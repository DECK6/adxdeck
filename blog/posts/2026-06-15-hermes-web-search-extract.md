---
type: article
title: Hermes Web Search는 검색과 본문 추출을 다른 도구로 다룬다
aliases:
  - hermes-web-search-extract
author: DECK
date created: 2026-06-15
date modified: 2026-06-15
tags: [hermes, ai-agent, workflow, web-search]
description: "A feature guide to Hermes Agent Web Search and Extract: backend selection, search-only providers, long-page compression, and when to use browser automation instead."
thumbnail: images/hermes-web-search-extract-cover.png
status: completed
series: hermes-notes
---

# Hermes Web Search는 검색과 본문 추출을 다른 도구로 다룬다

![cover](images/hermes-web-search-extract-cover.png)

AI 에이전트가 웹을 쓴다는 말은 보통 두 가지 일을 섞어 부릅니다. 하나는 “무엇이 있는지 찾는” 검색이고, 다른 하나는 “찾은 페이지를 읽을 수 있는 본문으로 가져오는” 추출입니다. Hermes Agent의 Web Search & Extract는 이 둘을 `web_search`와 `web_extract`로 분리해, 가벼운 사실 확인부터 긴 문서 요약까지 같은 에이전트 루프 안에서 처리하게 해 줍니다.

## 기능 개요

`web_search`는 질의어와 `limit`을 받아 제목, URL, 설명이 포함된 검색 결과를 돌려줍니다. `web_extract`는 URL 목록을 받아 페이지를 Markdown에 가까운 읽기 가능한 형태로 가져옵니다. 둘을 함께 쓰면 먼저 후보를 찾고, 그중 필요한 페이지 몇 개만 본문으로 검증하는 흐름을 만들 수 있습니다.

핵심은 backend를 하나로 고정하지 않아도 된다는 점입니다. Firecrawl, Tavily, Exa, Parallel은 검색과 추출을 모두 지원하고, SearXNG, Brave Search, DDGS, xAI/Grok은 검색 전용입니다. 검색 전용 backend를 쓸 때도 `web.search_backend`과 `web.extract_backend`을 나눠 SearXNG로 찾고 Firecrawl로 읽는 식의 조합이 가능합니다.

## 어떻게 동작하나

가장 빠른 설정 경로는 도구 관리 UI입니다.

```bash
hermes tools
```

여기서 **Web Search & Extract** 항목을 고르면 provider별 API key나 URL을 안내받습니다. 직접 설정한다면 `~/.hermes/config.yaml`과 `~/.hermes/.env`를 함께 봅니다.

```yaml
web:
  search_backend: "searxng"
  extract_backend: "firecrawl"
```

```bash
# ~/.hermes/.env
SEARXNG_URL=http://localhost:8888
FIRECRAWL_API_KEY=fc-your-key-here
```

CLI에서 특정 세션에만 웹 도구를 열 수도 있습니다.

```bash
hermes chat --toolsets web -q "Hermes Agent web_extract 동작을 요약해줘"
hermes chat --toolsets search -q "최근 Hermes Agent 문서에서 Web Search 항목을 찾아줘"
```

`web_extract`의 중요한 안전장치는 긴 페이지 압축입니다. 5,000자 미만은 그대로 반환하고, 5,000자부터 500,000자까지는 `auxiliary.web_extract` 모델이 약 5,000자 요약으로 줄입니다. 500,000자를 넘으면 100k 단위로 나눠 병렬 요약 후 다시 합치며, 2,000,000자를 넘는 페이지는 더 좁은 URL을 쓰라는 힌트와 함께 거절합니다.

```yaml
auxiliary:
  web_extract:
    provider: openrouter
    model: google/gemini-3-flash-preview
    timeout: 360
```

이 보조 모델을 따로 지정하면 비싼 주 모델로 긴 문서 요약을 반복하는 일을 피할 수 있습니다. 로컬 확인 기준으로 한 Dev 프로파일은 `hermes-cli` toolset을 쓰고, `auxiliary.web_extract`는 `auto`에 `timeout: 360`으로 남겨 두어 주 모델 경로를 기본값으로 따릅니다.

## 실제 운영 사이드바

이 사용자의 Hermes 운영에서는 블로그 발행이나 기능 검증 전에 공식 문서와 로컬 설치 상태를 함께 확인합니다. 이때 `web_extract`는 “문서 페이지를 가져와 근거를 잡는” 역할을 하고, 클릭·로그인·시각 검증이 필요할 때만 Browser Automation으로 넘어갑니다. 즉 웹 도구는 브라우저를 대체하기보다, 브라우저를 켜기 전의 빠른 조사 레이어에 가깝습니다.

## 주의할 점과 팁

검색 전용 provider를 추출까지 된다고 착각하지 않는 것이 첫 번째입니다. Brave, DDGS, SearXNG, xAI는 검색 결과를 주지만 `web_extract`에는 별도 backend가 필요합니다. xAI/Grok 검색은 index API라기보다 모델이 서버 측 검색 도구를 사용해 생성한 결과이므로, 중요한 주장에는 URL 추출이나 별도 검증을 붙이는 편이 안전합니다.

SearXNG를 직접 띄울 때는 JSON format이 켜져 있어야 합니다. `curl "http://localhost:8888/search?q=test&format=json"`이 403을 내면 Hermes 문제가 아니라 SearXNG 설정 문제일 가능성이 큽니다. 반대로 구조화된 표나 필드를 원문 그대로 긁어야 한다면 `web_extract`의 요약이 방해될 수 있으므로 `browser_navigate`와 `browser_snapshot`을 사용합니다.

## 언제 써야 하나

Web Search & Extract는 공개 웹에서 근거를 찾고, 몇 개 페이지를 읽어 답변·리서치·문서 검증에 붙일 때 가장 가볍습니다. 로그인된 화면 조작, 폼 입력, 스크린샷 확인은 Browser Automation이 맞고, 대량 반복 조사는 Batch Processing이나 Cron과 조합하는 편이 낫습니다. 먼저 `web_search`로 좁히고, 정말 읽을 가치가 있는 URL만 `web_extract`로 가져오는 습관이 비용과 컨텍스트를 함께 아껴 줍니다.
