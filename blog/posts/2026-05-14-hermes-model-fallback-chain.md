---
type: article
title: "Hermes 모델·프로바이더 라우팅: Fallback 체인으로 끊기지 않는 에이전트 만들기"
aliases:
  - Hermes Model Fallback Chain
author:
  - "[[육대근]]"
date created: 2026-05-14
date modified: 2026-05-14
tags:
  - hermes
  - ai-agent
  - workflow
  - model-routing
description: How Hermes Agent picks a primary inference model and falls back through a configured chain when a provider rate-limits, overloads, or drops the connection.
thumbnail: images/hermes-model-fallback-chain-cover.png
status: completed
series: hermes-notes
---

![hero](images/hermes-model-fallback-chain-cover.png)

LLM 한 개에 의존해서 에이전트를 운영하면 결국은 망가진다. Anthropic 이 5xx 를 뱉거나, OpenAI 가 토큰을 묶거나, Codex 백엔드가 잠깐 끊기는 순간 워크플로 전체가 멈춘다. Hermes Agent 는 이 문제를 **모델 라우팅 + Fallback 체인** 으로 푼다. 기본 모델은 하나지만, 그 모델이 실패하면 다음 프로바이더로 자동으로 넘어간다.

이 글은 그 라우팅 레이어가 정확히 어떻게 동작하는지, 어떤 명령으로 설정하는지, 그리고 실제로 어떤 실패 신호에 반응하는지를 정리한다.

## 1. 기능 개요: Primary + Fallback

Hermes 의 모델 레이어는 두 부분으로 구성된다.

- **Primary model**: 모든 턴이 가장 먼저 시도하는 기본 모델. `hermes model` 인터랙티브 셀렉터로 고른다.
- **Fallback chain**: 0개 이상의 보조 모델 목록. Primary 가 특정 종류의 오류 — rate-limit, 5xx overload, connection error — 를 던졌을 때 위에서부터 순서대로 시도된다.

핵심 설계 결정 두 가지:

1. Fallback 은 **모든 오류**가 아니라 **재시도해도 의미 있는 오류** 에만 발동한다. 사용자가 잘못된 툴 인자를 넣었거나 입력 토큰이 컨텍스트를 초과한 경우에는 fallback 으로 넘기지 않는다. 다른 프로바이더에서도 똑같이 실패하기 때문이다.
2. Fallback 체인은 **프로바이더가 다른** 항목을 섞을 수 있다. Anthropic → OpenAI Codex → Nous portal 같은 식으로 서로 다른 백엔드를 묶어두면, 단일 벤더 장애에 전체 워크플로가 죽지 않는다.

공식 문서: <https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers>

## 2. 셋업: `hermes model` 과 `hermes fallback`

### Primary 모델 고르기

```bash
hermes model
```

이 명령은 인터랙티브 셀렉터를 띄운다. Anthropic, OpenAI, Google, OpenRouter, DeepSeek, xAI, NVIDIA NIM, Z.AI, Nous portal, 로컬 Ollama 등 등록된 프로바이더 목록에서 한 곳을 고르고, 그 안에서 모델을 선택한다. 결과는 `~/.hermes/config.yaml` 의 `model:` 과 `provider:` 키에 기록된다.

선택된 상태는 `hermes status` 로 항상 확인할 수 있다.

```text
◆ Environment
  Model:     claude-opus-4-7
  Provider:  Anthropic
```

### Fallback 체인 관리

```bash
hermes fallback list     # 현재 체인 보기
hermes fallback add      # 같은 셀렉터로 항목 추가
hermes fallback remove   # 항목 삭제
hermes fallback clear    # 전부 비우기
```

`add` 는 `hermes model` 과 같은 셀렉터를 재사용하므로, primary 와 똑같은 흐름으로 항목을 쌓을 수 있다. 예시 출력:

```text
Primary:   claude-opus-4-7  (via anthropic)

  Fallback chain (1 entry):
    1. gpt-5.5  (via openai-codex)  [https://chatgpt.com/backend-api/codex]

  Tried in order when the primary fails (rate-limit, 5xx, connection errors).
```

체인은 위에서 아래로 차례대로 시도된다. 그래서 가장 **저렴하거나 가장 안정적인** 보조 모델을 위쪽에, 마지막 보루를 아래쪽에 두는 게 합리적이다.

### 설정 파일에서 직접 보기

`~/.hermes/config.yaml` 을 열면 같은 정보가 평문으로 들어 있다.

```yaml
model: claude-opus-4-7
provider: anthropic
fallback:
  - model: gpt-5.5
    provider: openai-codex
```

대부분의 운영은 CLI 로 충분하지만, 디버그할 때는 이 파일을 직접 보는 게 가장 빠르다.

## 3. 동작: 어떤 오류가 Fallback 을 깨우는가

Fallback 이 발동하는 조건은 좁다. 대표적으로:

- HTTP **429** 류의 rate-limit
- HTTP **5xx** overload / 일시적 백엔드 실패
- TCP/TLS connection error, `incomplete chunked read`, 타임아웃 같은 전송층 실패

반대로 다음 경우는 fallback 으로 넘기지 않고 그대로 실패시킨다.

- 4xx 사용자 오류 (잘못된 인자, 비어 있는 입력)
- 컨텍스트 길이 초과
- 콘텐츠 정책 위반
- 모델이 정상적으로 응답을 끝낸 후의 의미적 오류

이렇게 분리되어 있기 때문에 fallback 체인은 “장애 회피용”이지 “출력 품질 백업용”이 아니다. 더 똑똑한 모델로 갈아타고 싶으면 그건 primary 를 바꾸거나, council 같은 별도 기능을 써야 한다.

## 4. 사용자 환경 사례 (사이드바)

이 셋업에서 primary 는 `claude-opus-4-7` 이고, fallback 으로 `gpt-5.5` (Codex 백엔드) 한 개만 걸려 있다. 두 프로바이더가 서로 다른 회사라서 한쪽이 죽어도 다른 쪽으로 계속 진행된다. 실제 운영에서는 새벽 시간대 Anthropic rate-limit 이 튀어오를 때 Codex 로 넘어가서 cron 작업이 계속 도는 것을 자주 본다. 단, Codex 경로는 OAuth 풀이 `exhausted` 로 빠지면 그대로 막히기 때문에 `hermes auth list` 로 주기적으로 상태를 확인하는 게 안전하다.

## 5. 함정과 팁

- **무한 체인은 피한다.** 두세 개면 충분하다. 더 길어지면 매 턴마다 실패 누적 지연이 늘어난다.
- **체인 안에서 모델 능력 격차가 너무 크면 결과가 흔들린다.** 비슷한 사이즈의 모델을 묶거나, 적어도 같은 툴 호출 컨벤션을 지키는 모델끼리 묶는다.
- **API 키는 별개로 관리된다.** `hermes status` 의 API Keys 섹션에서 어떤 프로바이더가 실제로 인증되어 있는지 먼저 확인한다. 키가 없으면 `add` 로 추가해도 호출 시점에 인증 오류로 떨어진다.
- **Codex/Anthropic 같은 브라우저 인증 기반 프로바이더는 별도 `hermes login --provider <name>` 절차가 필요하다.** 토큰이 만료되면 fallback 체인 안에 들어 있어도 인증 오류로 fail-out 된다.
- **로그**: 어떤 모델이 실제로 응답했는지 확인하려면 `hermes logs` 또는 세션 인사이트를 본다. 단순히 “결과가 나왔다” 만 보고 primary 가 살아 있다고 가정하지 않는 편이 좋다.

## 6. 언제 이 기능을 켤 것인가

Fallback 체인은 다음과 같은 경우에 가장 큰 효과를 낸다.

- **장시간 동작하는 cron / kanban / gateway 워크플로** — 사용자가 자고 있을 때 vendor 가 흔들려도 작업이 멈추면 안 되는 환경.
- **여러 토픽/플랫폼에서 동시에 들어오는 게이트웨이 트래픽** — 한 vendor 가 압박을 받을 때 다른 vendor 로 흘리기 위한 용도.
- **민감한 비용 분산** — 비싼 primary 가 막혔을 때만 저렴한 fallback 으로 슬쩍 떨어지게 두는 운영.

반대로 “더 똑똑한 답을 받고 싶다”거나 “여러 모델의 의견을 비교하고 싶다” 같은 요구는 fallback 의 일이 아니다. 그건 **council** 같은 별도 기능이 담당한다. Fallback 은 어디까지나 “primary 가 죽었을 때 손해 보지 않고 계속 일하기” 위한 안전망이다.

한 줄 요약: `hermes model` 로 기본을 한 개 정하고, `hermes fallback add` 로 다른 벤더를 한두 개 더 얹어 두면, 에이전트는 다음 vendor 사고가 터져도 잠들지 않는다.
