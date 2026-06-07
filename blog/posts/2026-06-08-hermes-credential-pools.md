---
type: article
title: "Hermes Credential Pools는 같은 provider 안에서 끊김을 먼저 흡수한다"
aliases:
  - "Hermes Credential Pools"
author:
  - "[[Deck]]"
date created: 2026-06-08
date modified: 2026-06-08
tags:
  - hermes
  - ai-agent
  - workflow
  - auth
  - credential-pools
description: "A practical guide to Hermes Agent credential pools: how same-provider credential rotation works, how it differs from fallback providers, and how to inspect or tune it safely."
thumbnail: images/hermes-credential-pools-cover.png
status: completed
series: hermes-notes
---

![Hermes credential pool routing diagram](images/hermes-credential-pools-cover.png)

Hermes Agent의 `Credential Pools`는 모델 provider가 갑자기 막혔을 때 대화를 바로 다른 회사로 넘기기 전에, **같은 provider 안의 다른 인증 수단**으로 먼저 회복하게 해주는 기능이다. API key 하나가 rate limit에 걸리거나 OAuth 토큰이 만료되면, Hermes는 세션을 끊지 않고 다음 credential을 고른다. 문제는 “어떤 모델을 쓸 것인가” 이전에 “이 provider에 아직 쓸 수 있는 열쇠가 남아 있는가”로 좁혀진다.

## 기능 개요: fallback보다 앞에 있는 회복층

Credential pool은 provider별 인증 묶음이다. 예를 들어 `openrouter`에 여러 API key를 등록하거나, `openai-codex`·`xai-oauth`처럼 OAuth credential이 둘 이상 있으면 Hermes는 이를 하나의 pool로 다룬다. 공식 문서 기준으로 이 기능은 fallback provider와 다르다. Credential pool은 **same-provider rotation**이고, fallback provider는 **cross-provider failover**다. 순서도 pool이 먼저다. pool 안의 credential을 모두 써 보아도 회복하지 못할 때에야 `fallback_providers` 체인이 작동한다.

Hermes가 다루는 상태도 단순한 목록이 아니다. 각 credential에는 label, auth type, source, 현재 선택 표시, 사용 횟수, 최근 상태, cooldown 같은 운영 정보가 붙는다. 수동으로 넣은 키는 `auth.json`에 저장되지만, 환경변수나 외부 vault에서 빌려온 비밀값은 원문 대신 source reference와 fingerprint 위주로 관리된다.

## 어떻게 쓰는가

현재 pool 상태는 다음 명령으로 확인한다.

```bash
hermes auth list
hermes auth list openrouter
```

credential을 추가할 때는 provider와 방식에 맞춰 등록한다.

```bash
hermes auth add openrouter --type api-key --api-key sk-or-...
hermes auth add anthropic --type oauth
hermes auth reset openrouter
```

rotation 전략은 interactive `hermes auth` 메뉴에서 바꾸거나 `config.yaml`에 명시할 수 있다.

```yaml
credential_pool_strategies:
  openrouter: round_robin
  anthropic: least_used
```

전략은 네 가지다. `fill_first`는 기본값으로 첫 credential을 오래 쓰고, 문제가 생기면 다음으로 넘어간다. `round_robin`은 매 요청마다 순환한다. `least_used`는 사용량이 낮은 credential을 우선한다. `random`은 건강한 credential 중 무작위로 고른다.

오류별 처리도 다르다. 일반적인 429는 같은 credential로 한 번 더 시도한 뒤 반복되면 회전한다. 사용량 상한처럼 재시도해도 풀리지 않는 429, 402 billing/quota 오류는 즉시 다음 credential로 넘긴다. 401은 OAuth refresh를 먼저 시도하고, refresh가 실패할 때만 rotation으로 간다.

```yaml
model:
  provider: openai-codex
  default: gpt-5.5
fallback_providers:
  - provider: anthropic
    model: claude-opus-4-8
```

위 구조라면 Hermes는 먼저 `openai-codex` pool 안에서 회복을 시도하고, 그래도 안 되면 Anthropic fallback으로 넘어간다.

## 실제 운용 사이드바

이 사용자의 Hermes 환경에서는 Dev 프로파일이 `openai-codex`를 기본 provider로 쓰고, fallback에는 Anthropic 계열 모델을 둔다. 실제 `hermes auth list`에서는 `nous`, `openai-codex`, `xai-oauth` 같은 provider별 pool이 보이며, 같은 provider에 둘 이상의 OAuth credential이 등록된 경우도 있다. 그래서 cron, delegation, gateway 작업은 provider 교체보다 먼저 “같은 provider 내부의 다른 credential”로 회복할 기회를 얻는다.

## 주의할 점

첫째, pool은 무한 우회 장치가 아니다. 모든 credential이 같은 요금제나 같은 사용량 상한에 묶여 있으면 회전해도 곧 다시 막힌다. 둘째, `fallback_providers`와 혼동하지 말아야 한다. provider 자체를 바꾸고 싶으면 fallback을 설정하고, 같은 provider 안의 여러 키를 활용하고 싶으면 auth pool을 설정한다. 셋째, token 원문을 블로그나 로그에 복사하지 않는다. 확인에는 `hermes auth list`처럼 label과 상태만 보여주는 명령을 쓴다.

프로파일을 나눠 쓰는 경우에는 어느 Hermes home을 보고 있는지도 확인해야 한다. CLI, gateway, cron이 서로 다른 프로파일로 실행되면 각자의 `config.yaml`을 읽는다. 다만 이 환경처럼 전역 `auth.json`을 symlink로 공유하는 구성에서는 refresh 충돌을 줄이기 위해 symlink를 깨지 않는 것이 중요하다.

## 언제 이 기능을 먼저 볼까

짧은 대화가 아니라 장시간 코딩, 예약 실행, 브라우저 자동화, multi-agent delegation처럼 중간 실패 비용이 큰 작업이라면 credential pools를 먼저 점검할 가치가 있다. “같은 provider를 계속 쓰되 끊김을 줄이고 싶다”면 pool, “provider 자체가 죽었을 때 다른 모델로 넘어가고 싶다”면 fallback, “작업 단위를 분리해 병렬로 굴리고 싶다”면 delegation이 맞다. Hermes의 회복력은 이 세 층을 구분해서 설계할 때 가장 안정적으로 작동한다.
