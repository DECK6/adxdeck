---
type: article
title: "Hermes Tool Gateway는 도구 API 가입을 하나의 라우팅 문제로 줄인다"
aliases:
  - "Hermes Tool Gateway Managed Tools"
author:
  - "[[Deck]]"
date created: 2026-06-29
date modified: 2026-06-29
tags:
  - hermes
  - ai-agent
  - workflow
  - tool-gateway
description: "A practical guide to Hermes Agent Tool Gateway: how Nous Portal routes web, image, TTS, browser, and cloud terminal tools without separate provider accounts."
thumbnail: images/hermes-tool-gateway-managed-tools-cover.png
status: completed
series: hermes-notes
---

# Hermes Tool Gateway는 도구 API 가입을 하나의 라우팅 문제로 줄인다

![Hermes Tool Gateway cover](images/hermes-tool-gateway-managed-tools-cover.png)

Hermes Agent를 실제 작업에 쓰기 시작하면 모델보다 먼저 부딪히는 문제가 있다. 웹 검색은 Firecrawl, 이미지는 FAL, 음성은 TTS provider, 브라우저는 Browser Use나 로컬 브라우저처럼 각 도구마다 계정과 키가 따로 필요하다는 점이다. **Nous Tool Gateway**는 이 복잡도를 “도구를 어디로 라우팅할 것인가”라는 설정 문제로 줄인다.

## 기능 개요

Tool Gateway는 Nous Portal 구독을 통해 Hermes의 일부 도구 호출을 Nous가 관리하는 백엔드로 보내는 기능이다. 공식 문서 기준으로 대상은 web search/extract, image generation, text-to-speech, cloud browser automation, 그리고 선택적 cloud terminal 실행이다. Hermes의 agent loop나 tool 이름이 바뀌는 것은 아니다. 사용자는 여전히 `web_search`, `image_generate`, `text_to_speech`, `browser_navigate` 같은 도구를 쓰고, 실행 계층만 direct API key 대신 gateway를 통과한다.

중요한 점은 gateway가 전부 켜기/끄기 스위치가 아니라 **도구별 라우팅**이라는 것이다. 웹과 이미지만 Nous Subscription으로 쓰고, TTS는 Edge로 두고, 브라우저는 로컬로 유지할 수 있다. 그래서 Tool Gateway는 lock-in이라기보다 “키가 없는 도구부터 빠르게 붙이는 우회로”에 가깝다.

## 어떻게 설정하고 동작하나

가장 쉬운 진입점은 Portal onboarding이다.

```bash
hermes setup --portal
hermes portal info
hermes portal tools
hermes status
```

이미 Hermes를 쓰고 있다면 `hermes tools`에서 도구별 provider를 고른다. Nous Subscription을 선택하면 로그인 흐름 또는 즉시 활성화를 진행한다. 모델 provider를 반드시 Nous로 바꾸어야만 도구 gateway를 쓰는 구조는 아니다.

수동 설정은 profile의 `~/.hermes/config.yaml`에서 도구별 `use_gateway` 값을 본다.

```yaml
web:
  backend: firecrawl
  use_gateway: true

image_gen:
  use_gateway: true

tts:
  provider: openai
  use_gateway: true

browser:
  cloud_provider: browser-use
  use_gateway: true
```

`use_gateway: true`가 있으면 해당 도구는 direct key가 있어도 gateway를 우선한다. `false`이거나 빠져 있으면 기존 `.env`의 직접 키나 로컬 backend를 사용한다. 로컬 확인에서는 현재 프로파일이 Nous Portal에 로그인되어 있지 않았고, catalog는 web/image not configured, TTS Edge TTS, browser Local browser, Modal local로 표시했다. 이는 고장이 아니라 “아직 gateway routing을 선택하지 않았다”는 의미다.

## 실제 사용 사이드바

이 사용자의 Hermes 운영은 Dev, PKM, Ops처럼 profile과 작업 표면이 나뉘어 있다. 이런 환경에서는 모든 profile에 모든 외부 API key를 흩뿌리는 것보다, 자주 쓰는 tool category만 gateway로 묶고 나머지는 로컬·직접 provider로 남기는 편이 관리하기 쉽다. 특히 예약 작업이나 메신저 gateway처럼 사람이 바로 개입하지 않는 실행면에서는 “어느 도구가 어떤 backend로 나가는지”를 `hermes portal info`와 `hermes status`로 먼저 확인하는 습관이 중요하다.

## 함정과 팁

첫째, Portal inference와 Tool Gateway는 연결되어 있지만 같은 뜻은 아니다. Nous 모델을 쓰는 것과 web/image/TTS/browser 도구를 Nous Subscription으로 라우팅하는 것은 별도 설정이다.

둘째, Tool Gateway는 유료 구독 또는 사용 가능한 free tool pool이 있어야 한다. 구독이 만료되면 gateway로 라우팅된 도구는 실패하므로, 자동화 작업에서는 direct key fallback이나 상태 점검을 함께 둔다.

셋째, self-hosted override용 `TOOL_GATEWAY_DOMAIN`, `TOOL_GATEWAY_SCHEME`, `TOOL_GATEWAY_USER_TOKEN`은 일반 사용자가 먼저 만질 값이 아니다. 조직 배포가 아니라면 `hermes tools`와 Portal login 흐름을 쓴다.

넷째, 민감한 값은 글이나 로그에 남기지 않는다. `hermes portal info`는 routing summary 확인용이지 토큰 공유 명령이 아니다.

## 언제 선택할까

도구별 API 계정이 이미 안정적이고 비용·쿼터를 직접 관리하고 싶다면 direct provider가 좋다. 반대로 여러 도구의 가입·키·과금을 하나로 줄이고 싶거나, 메신저·cron·CLI가 같은 도구 backend를 쓰게 만들고 싶다면 Tool Gateway가 적합하다. Hermes에서 도구는 “많이 켜는 것”보다 “어디로 안전하게 라우팅되는지 아는 것”이 먼저다.
