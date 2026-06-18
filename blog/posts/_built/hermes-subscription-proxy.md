---
type: article
title: "Hermes Subscription Proxy는 구독 인증을 로컬 API로 바꾼다"
aliases:
  - hermes-subscription-proxy
author:
  - "[[육대근]]"
date created: 2026-06-19
date modified: 2026-06-19
tags:
  - hermes
  - ai-agent
  - workflow
  - proxy
description: A practical guide to Hermes Agent Subscription Proxy, the local OpenAI-compatible pass-through that lets external apps use OAuth-backed provider subscriptions without handling real credentials.
thumbnail: images/hermes-subscription-proxy-cover.png
status: completed
series: hermes-notes
---

# Hermes Subscription Proxy는 구독 인증을 로컬 API로 바꾼다

![cover](images/hermes-subscription-proxy-cover.png)

Hermes Agent의 Subscription Proxy는 외부 앱이 Hermes가 관리하는 OAuth 기반 구독을 OpenAI-compatible API처럼 쓰게 해주는 로컬 서버다. 해결하는 문제는 단순하다. Karakeep, Open WebUI, LobeChat 같은 앱마다 장기 API key를 따로 넣지 않고, Hermes가 이미 보유한 provider 로그인과 자동 갱신을 한곳에서 붙여준다.

## 기능 개요 — agent가 아니라 model pass-through

Subscription Proxy는 Gateway나 API Server와 헷갈리기 쉽다. API Server가 “Hermes Agent 자체”를 HTTP 백엔드로 열어 tools, memory, skills까지 실행하게 한다면, Subscription Proxy는 훨씬 좁다. 외부 앱의 `/v1/chat/completions` 같은 요청을 받아 provider credential을 붙인 뒤 upstream으로 그대로 전달한다.

공식 문서 기준 현재 proxy upstream은 `nous`와 `xai`가 제공된다. 즉 Hermes가 OAuth로 로그인한 Nous Portal 또는 xAI/Grok 계정을, OpenAI 호환 클라이언트가 이해하는 `Base URL`, `API key`, `Model` 조합으로 연결할 수 있다. 앱이 보내는 bearer token은 proxy 앞단의 형식 요구를 채우는 값일 뿐이고, 실제 upstream 인증은 Hermes의 auth store에서 꺼내 붙는다.

## 어떻게 작동하나

먼저 사용 가능한 upstream을 확인한다.

```bash
hermes proxy providers
hermes proxy status
```

로컬 검증에서는 Hermes Agent v0.16.0 설치본에서 `nous`, `xai` adapter가 노출됐고, `hermes proxy status`가 provider별 readiness를 표시했다. 준비된 provider가 있으면 foreground 서버로 실행한다.

```bash
hermes proxy start --provider xai
# 또는 기본값 nous
hermes proxy start
```

기본 바인딩은 안전하게 localhost다.

```text
http://127.0.0.1:8645/v1
```

외부 앱에는 보통 이렇게 넣는다.

```text
Base URL: http://127.0.0.1:8645/v1
API key: any-non-empty-string
Model: provider가 지원하는 모델명
```

요청 흐름은 의도적으로 얇다. proxy가 요청 본문을 변형하지 않고, 만료가 가까운 OAuth bearer를 갱신하고, `Authorization: Bearer ...`를 붙여 upstream에 전달한 뒤 스트리밍 응답도 그대로 돌려준다. 그래서 이 기능은 tool call, memory, skill 실행이 필요한 작업에는 맞지 않는다. 그런 경우에는 Hermes API Server를 써야 한다.

## 짧은 실제 사용 사이드바

이 사용자의 운영처럼 Hermes를 여러 프로파일과 여러 접속면으로 나눠 쓰는 환경에서는 “외부 앱도 같은 구독을 쓰게 하되, agent 권한은 주지 않는” 경계가 중요하다. Subscription Proxy는 그 경계를 잘 만든다. 북마크 요약기나 로컬 연구 앱에는 model endpoint만 주고, 파일·브라우저·터미널 도구는 Hermes 대화 세션 안에 남겨둘 수 있기 때문이다.

## Pitfalls / tips

첫째, `not logged in`은 앱 문제가 아니라 Hermes provider 로그인 문제다. `hermes proxy status`로 upstream 상태를 먼저 보고, 필요한 경우 해당 provider OAuth 로그인을 다시 수행한다. 실제 token 값은 로그나 글에 남기지 않는다.

둘째, LAN 노출은 조심해야 한다.

```bash
hermes proxy start --host 0.0.0.0 --port 8645
```

이렇게 열면 같은 네트워크의 다른 기기도 접근할 수 있다. proxy 자체는 들어온 bearer 값을 신뢰하지 않고 upstream credential을 대신 붙이므로, 방화벽·VPN·reverse proxy 인증 없이 넓게 열면 구독 quota를 그대로 노출하는 셈이다.

셋째, 허용 path를 확인해야 한다. 예를 들어 Nous adapter는 chat completions, legacy completions, embeddings, models 같은 OpenAI 호환 path를 대상으로 한다. 이미지 생성이나 음성 합성처럼 upstream이 제공하지 않는 path는 404로 막히는 것이 정상이다.

## 언제 이 기능을 쓰나

Subscription Proxy는 Hermes를 또 하나의 agent 서버로 공개하는 기능이 아니다. 외부 앱이 “모델 추론만” 필요하고, Hermes가 이미 provider 로그인과 갱신을 관리하고 있을 때 쓰는 얇은 인증 브리지다. agent 능력까지 필요하면 API Server, 시간 기반 자동화가 필요하면 Cron, 외부 이벤트가 필요하면 Webhook이 더 맞다. 반대로 로컬 앱 여러 개에 정적 키를 흩뿌리고 싶지 않다면, proxy가 가장 작은 표면으로 같은 구독을 재사용하게 해준다.
