---
type: article
title: "Hermes API Server는 에이전트를 OpenAI 호환 백엔드로 바꾼다"
aliases:
  - "hermes-api-server-openai-compatible"
author: Deck
date created: 2026-06-13
date modified: 2026-06-13
tags: [hermes, ai-agent, workflow, api-server]
description: "A practical guide to Hermes Agent's API Server: OpenAI-compatible endpoints, configuration, streaming runs, sessions, and security boundaries."
thumbnail: images/hermes-api-server-openai-compatible-cover.png
status: completed
series: hermes-notes
---

# Hermes API Server는 에이전트를 OpenAI 호환 백엔드로 바꾼다

![Hermes API Server cover](images/hermes-api-server-openai-compatible-cover.png)

Hermes API Server는 Hermes Agent를 터미널이나 메신저 안에 가두지 않고, OpenAI 호환 HTTP 백엔드로 노출하는 기능이다. Open WebUI, LobeChat, LibreChat, 자체 대시보드처럼 OpenAI API 형식을 이해하는 클라이언트가 Hermes를 하나의 모델처럼 호출하면서도, 실제 뒤에서는 Hermes의 도구·스킬·메모리·프로파일 설정이 그대로 작동한다.

## 기능 개요

핵심은 “모델 API처럼 보이지만 에이전트 런타임을 실행한다”는 점이다. `/v1/chat/completions`는 익숙한 Chat Completions 형식을 받으며, `/v1/responses`는 `previous_response_id` 기반의 서버 측 대화 상태를 지원한다. 긴 실행을 UI가 안정적으로 추적해야 한다면 `/v1/runs` 계열 엔드포인트로 run을 만들고, 상태를 polling하거나 SSE 이벤트 스트림을 구독할 수 있다.

모델 목록은 `/v1/models`에서 조회된다. 기본 모델 이름은 profile 이름을 따르며, default profile에서는 `hermes-agent`로 보인다. 외부 UI가 무엇을 지원하는지 안전하게 확인하려면 `/v1/capabilities`를 먼저 호출하면 된다. 여기에는 chat completions, responses, runs, session 제어, skills/toolsets discovery 같은 지원 표면이 기계 판독 가능한 형태로 드러난다.

## 어떻게 켜고 쓰는가

API Server는 현재 `config.yaml`이 아니라 `~/.hermes/.env` 또는 profile별 `.env`의 환경 변수로 켠다.

```bash
API_SERVER_ENABLED=true
API_SERVER_PORT=8642
API_SERVER_HOST=127.0.0.1
API_SERVER_KEY=change-me-local-dev
# 브라우저가 Hermes를 직접 호출해야 할 때만 명시
# API_SERVER_CORS_ORIGINS=http://localhost:3000
```

그다음 gateway를 실행한다.

```bash
hermes gateway run
# 또는 설치된 서비스라면
hermes gateway start
```

클라이언트는 base URL을 `http://localhost:8642/v1`로 두고, Bearer token을 붙여 호출한다.

```bash
curl http://localhost:8642/v1/chat/completions \
  -H "Authorization: Bearer change-me-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"model":"hermes-agent","messages":[{"role":"user","content":"Hello from an external UI"}]}'
```

멀티턴을 Hermes 쪽에 맡기고 싶다면 Responses API가 더 편하다.

```json
{
  "model": "hermes-agent",
  "input": "이 프로젝트의 변경 파일을 요약해줘",
  "store": true
}
```

다음 요청에서 `previous_response_id`를 넘기면 이전 tool call과 결과까지 포함한 대화 흐름이 이어진다. 이름 붙은 대화를 쓰고 싶을 때는 `conversation` 값을 고정해도 된다.

## 실제 운영에서의 짧은 예

한 운영 셋업에서는 Hermes를 CLI, gateway, cron, profile별 작업 레인으로 나누어 쓰면서, API Server용 bearer key만 미리 준비해 둔다. 평소에는 로컬 gateway와 profile이 작업 경계를 담당하고, 외부 대시보드나 OpenAI 호환 프론트엔드가 필요해지는 순간 `API_SERVER_ENABLED=true`를 켜서 같은 에이전트 능력을 HTTP 표면으로 연결하는 방식이다.

## 주의할 점과 팁

첫째, API Server는 “채팅 프록시”가 아니라 도구 실행 권한이 붙은 에이전트 진입점이다. terminal, file, browser 같은 toolset이 활성화되어 있으면 HTTP 호출도 그 능력에 닿을 수 있으므로 `API_SERVER_KEY`는 반드시 길고 비밀스러운 값으로 두어야 한다. 기본 bind가 `127.0.0.1`인 것도 이 때문이다.

둘째, CORS는 기본 비활성이다. Open WebUI처럼 서버 간 연결을 쓰는 경우에는 CORS가 필요 없고, 브라우저 앱이 직접 호출할 때만 `API_SERVER_CORS_ORIGINS`를 좁게 지정한다. 셋째, request의 `model` 필드는 호환성을 위한 이름에 가깝다. 실제 추론 provider와 모델은 서버 쪽 Hermes profile 설정이 결정한다.

여러 사용자를 분리해야 한다면 API key 하나로 모든 것을 섞기보다 profile을 나누고 port도 분리한다.

```bash
hermes profile create alice
# alice profile의 .env에 API_SERVER_PORT=8643, API_SERVER_KEY=... 설정
hermes -p alice gateway run
```

마지막으로 파일 업로드는 아직 일반 문서 업로드 표면이 아니다. inline image URL이나 `data:image/...` 입력은 지원하지만, OpenAI식 `file_id`나 비이미지 `data:` 문서는 제한된다.

## 언제 API Server를 선택할까

Telegram, Discord, Slack처럼 사람과 대화하는 채널이 필요하면 Gateway가 먼저다. 정해진 시간에 반복 실행하려면 Cron이 맞고, 긴 작업을 여러 에이전트에게 나눌 때는 Kanban이나 delegation이 더 자연스럽다. 반대로 이미 OpenAI 호환 UI, 사내 대시보드, 자동화 클라이언트가 있고 그 뒤에 Hermes Agent의 실제 도구 실행력을 붙이고 싶다면 API Server가 가장 얇고 표준적인 연결면이다.
