---
type: article
title: "Hermes X Search는 소셜 반응을 근거 있는 입력으로 바꾼다"
aliases:
  - "hermes-x-search-social-listening"
author:
  - "[[Deck]]"
date created: 2026-06-17
date modified: 2026-06-17
tags: [hermes, ai-agent, workflow, x-search]
description: "A practical guide to Hermes Agent's x_search tool for searching X/Twitter posts through xAI, including setup, filters, citations, and degraded-result handling."
thumbnail: images/hermes-x-search-social-listening-cover.png
status: completed
series: hermes-notes
---

# Hermes X Search는 소셜 반응을 근거 있는 입력으로 바꾼다

![Hermes X Search cover](images/hermes-x-search-social-listening-cover.png)

새 기능 발표나 모델 논쟁을 따라갈 때 일반 웹 검색만으로는 늦거나 넓다. Hermes Agent의 `x_search`는 X/Twitter 위의 게시물, 프로필, 스레드를 에이전트 안에서 직접 찾게 해 주는 도구다. 핵심 문제는 “사람들이 지금 X에서 뭐라고 말하는가”를 추측이 아니라 인용 가능한 입력으로 가져오는 것이다.

## 기능 개요 — 웹 검색이 아니라 X 검색

`x_search`는 Hermes의 별도 toolset이다. `web_search`가 검색엔진 결과와 웹 문서를 다룬다면, `x_search`는 xAI Responses API의 서버 측 X 검색 기능을 호출한다. 결과에는 Grok이 합성한 답변과 함께 원 게시물로 이어지는 citation 정보가 포함될 수 있다.

사용 시점도 다르다. 제품 릴리스 반응, 특정 계정의 발표, 커뮤니티 논쟁, 이미지나 영상이 붙은 게시물 흐름처럼 “X 안의 현재성”이 중요한 질문에 적합하다. 일반 문서, 공식 가이드, 블로그 원문 확인은 여전히 `web_search`와 `web_extract`가 맞다.

## 어떻게 작동하는가

인증은 두 경로 중 하나로 충분하다. SuperGrok 또는 X Premium+ 계정의 OAuth를 쓰거나, 유료 xAI API key를 설정한다. 둘 다 있으면 Hermes는 OAuth를 우선 사용해 구독 quota를 먼저 쓴다.

```bash
hermes auth add xai-oauth
hermes tools
# Search → 🐦 X (Twitter) Search 활성화
```

설정은 `~/.hermes/config.yaml`의 `x_search` 블록에서 조정한다.

```yaml
x_search:
  model: grok-4.20-reasoning
  timeout_seconds: 180
  retries: 2
```

도구 호출에는 검색어뿐 아니라 계정 필터와 날짜 필터를 넣을 수 있다.

```json
{
  "query": "reactions to new Grok image features",
  "allowed_x_handles": ["xai"],
  "from_date": "2026-06-01",
  "enable_image_understanding": true
}
```

`allowed_x_handles`는 최대 10개 계정으로 좁히고, `excluded_x_handles`는 특정 계정을 제외한다. `from_date`와 `to_date`는 `YYYY-MM-DD` 형식으로 검증된다. 이미지나 영상이 포함된 게시물까지 읽어야 하면 `enable_image_understanding`, `enable_video_understanding`를 켠다.

반환값에서 특히 볼 것은 `citations`, `inline_citations`, `degraded`다. 필터를 걸었는데 citation이 전혀 없으면 `degraded: true`가 될 수 있다. 이때 답변은 X 인덱스에서 근거를 찾은 결과가 아니라 모델 합성에 가까우므로, 실제 게시물 근거로 취급하지 말아야 한다.

## 실제 사용 사이드바

이 사용자의 Hermes 운영에서는 일반 웹 조사와 소셜 반응 조사를 분리한다. 공식 기능 의미는 문서와 로컬 설치에서 확인하고, X 쪽 여론이나 릴리스 반응은 `x_search` 후보로 둔다. Dev 프로파일에는 xAI OAuth 자격 증명이 잡혀 있고, 도구 목록에서도 `x_search`가 활성화된 상태로 확인된다.

## 팁과 함정

첫째, `x_search`가 tool schema에 보이지 않으면 모델 문제가 아니라 credential gating일 가능성이 크다. `hermes auth list xai-oauth` 또는 `XAI_API_KEY` 상태를 확인하고, 세션을 새로 시작해 도구 레지스트리를 다시 만들면 된다.

둘째, handle 필터는 강력하지만 취약하다. 오탈자, 너무 좁은 날짜 범위, X 인덱스 지연이 있으면 citation 없이 `degraded`가 켜질 수 있다. 중요한 주장이라면 날짜를 넓히거나, 원 게시물 URL을 별도로 확인한다.

셋째, 비용과 latency를 예상해야 한다. X 검색은 일반 웹 검색보다 오래 걸릴 수 있어 `timeout_seconds` 기본값이 넉넉하다. 반복 자동화에서는 불필요한 broad query보다 계정·날짜·키워드를 명확히 주는 편이 안정적이다.

## 언제 쓰는가

`x_search`는 “공식 문서가 무엇을 말하는가”가 아니라 “X에서 지금 어떤 반응과 인용이 흐르는가”를 물을 때 꺼내는 도구다. 기능 의미 검증은 docs와 로컬 설치, 공개 웹 페이지는 `web_extract`, 화면 조작은 `browser`, X 위의 현재 반응은 `x_search`로 나누면 Hermes의 조사 파이프라인이 훨씬 덜 흐려진다.
