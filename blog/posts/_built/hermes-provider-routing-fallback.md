---
type: article
title: "Hermes 모델 라우팅은 장애가 아니라 선택지를 먼저 설계한다"
aliases:
  - "hermes-provider-routing-fallback"
author:
  - "Deck"
date created: 2026-07-03
date modified: 2026-07-03
tags: [hermes, ai-agent, workflow, providers]
description: "A practical guide to Hermes Agent model and provider routing: main models, auxiliary slots, provider routing, fallback chains, and credential pools."
thumbnail: images/hermes-provider-routing-fallback-cover.png
status: completed
series: hermes-notes
---

# Hermes 모델 라우팅은 장애가 아니라 선택지를 먼저 설계한다

![Hermes provider routing cover](images/hermes-provider-routing-fallback-cover.png)

AI 에이전트 운영에서 모델 선택은 “가장 똑똑한 모델 하나를 고르는 일”로 보이기 쉽다. 하지만 Hermes Agent의 모델/프로바이더 기능이 푸는 문제는 조금 다르다. 메인 대화 모델, 보조 작업 모델, 인증 방식, provider routing, fallback 체인을 분리해 두면 비용·속도·장애를 한곳에 몰아넣지 않고 운영할 수 있다.

## 기능 개요 — main, auxiliary, provider, fallback

Hermes에는 먼저 **main model**이 있다. 사용자의 메시지를 받고, 도구를 호출하고, 응답을 스트리밍하는 중심 모델이다. 이 값은 `hermes model` 대화형 선택기나 `~/.hermes/config.yaml`의 `model` 섹션에 기록된다.

그 옆에는 **auxiliary models**가 있다. 세션 제목 생성, context compression, vision, web extract, approval scoring, MCP routing, skill search, Kanban 분해처럼 메인 사고 루프 바깥의 작은 작업을 맡는다. 기본값은 `provider: auto`이며, 보통 메인 모델을 먼저 쓰고 필요하면 fallback 정책을 따른다. 그래서 장문 reasoning 모델을 메인으로 쓰더라도, 제목 생성이나 웹 요약은 더 빠르고 저렴한 모델로 따로 지정할 수 있다.

마지막으로 provider 층이 있다. Hermes는 Nous Portal, OpenAI Codex, Anthropic, OpenRouter, GitHub Copilot, Gemini, xAI, DeepSeek, 로컬/커스텀 OpenAI 호환 endpoint 등 여러 provider를 지원한다. API key 기반 provider는 `.env`나 auth flow를 통해 연결하고, OAuth 계열은 `hermes model` 또는 `hermes auth add` 흐름으로 인증한다.

## 어떻게 작동하나

모델을 고르는 기본 입구는 다음 명령이다.

```bash
hermes model
```

현재 설치본에서 이 명령은 provider와 기본 모델을 대화형으로 고르는 설정 마법사다. 선택 결과는 새 세션부터 적용된다. 실행 중인 채팅은 시작 시점의 모델을 유지하므로, 즉시 바꾸려면 세션 안에서 `/model`을 사용한다.

직접 설정할 때의 핵심 형태는 이렇다.

```yaml
model:
  provider: openrouter
  default: anthropic/claude-sonnet-4

auxiliary:
  title_generation:
    provider: openrouter
    model: google/gemini-2.5-flash
```

OpenRouter를 쓸 때는 하위 provider routing도 조정할 수 있다. 이 설정은 직접 Anthropic API에 붙는 경우가 아니라, OpenRouter가 여러 공급자 중 어디로 보낼지 정하는 규칙이다.

```yaml
provider_routing:
  sort: "latency"          # price, throughput, latency
  ignore:
    - "Together"
  require_parameters: true
  data_collection: "deny"
```

장애 대응은 `hermes fallback`으로 관리한다.

```bash
hermes fallback list
hermes fallback add
hermes fallback remove
hermes fallback clear
```

저장되는 형태는 최상위 `fallback_providers` 리스트다.

```yaml
fallback_providers:
  - provider: openai-codex
    model: gpt-5.3-codex
  - provider: custom
    model: local-agent-model
    base_url: http://localhost:8000/v1
    key_env: LOCAL_API_KEY
```

공식 동작 기준으로 fallback은 rate limit, 5xx, 401/403, 404, 반복된 invalid response 같은 실패 뒤에 발동한다. 대화 기록과 tool context는 보존하고 provider/model client만 교체해 해당 turn을 이어 간다. 새 사용자 메시지가 오면 다시 primary model에서 시작하므로, fallback은 영구 전환이 아니라 턴 단위 복원 장치에 가깝다.

같은 provider 안에서 여러 key를 돌리는 문제는 fallback이 아니라 **credential pools**가 맡는다. 즉 OpenRouter key 여러 개를 회전하는 것은 credential pool, OpenRouter가 죽으면 Codex나 로컬 모델로 넘어가는 것은 fallback이다.

## 실제 운용에서의 짧은 장면

이 사용자의 Hermes 운영에서는 프로파일별로 Dev, PKM, Ops 성격의 작업을 나누고, 각 프로파일이 다른 모델·도구 표면을 갖는다. 자동 발행이나 장시간 cron 작업에서는 “가장 강한 모델 하나”보다 primary, auxiliary, fallback을 따로 점검하는 편이 더 안정적이다. 특히 이미지 생성, 웹 추출, 요약처럼 부수 provider가 끼는 작업은 메인 채팅 모델이 정상이어도 별도 인증이나 tool gateway 설정에서 막힐 수 있다.

## 주의할 점

- `hermes model`은 세션 밖 설정 마법사이고, `/model`은 이미 구성된 provider 사이를 세션 안에서 바꾸는 명령이다.
- `provider_routing`은 OpenRouter 경유 요청에만 의미가 있다. 직접 provider에는 영향을 주지 않는다.
- `fallback_providers`에는 `provider`와 `model`이 모두 필요하다. 둘 중 하나가 빠진 항목은 무시된다.
- tool call 품질이 중요한 작업에서는 fallback 모델도 tool 지원, context 길이, vision 지원 여부를 확인해야 한다.
- 인증 실패 401/403은 재시도로 해결되지 않는 경우가 많다. 같은 요청을 반복하기보다 `hermes auth status <provider>`와 `hermes auth list`로 인증 상태를 먼저 본다.
- config 변경은 보통 새 세션부터 적용된다. gateway에서는 새 topic/session 또는 gateway restart가 필요할 수 있다.

Hermes의 모델 라우팅은 성능 욕심을 위한 장식이 아니다. 빠른 보조 모델이 충분한 작업, privacy나 provider 정책을 고정해야 하는 작업, 실패해도 끊기면 안 되는 작업을 나누는 운영 설계다. 단일 모델로 시작해도 괜찮지만, 작업이 cron·gateway·subagent로 길어지는 순간에는 main, auxiliary, provider routing, fallback, credential pool을 분리해 보는 것이 좋다.
