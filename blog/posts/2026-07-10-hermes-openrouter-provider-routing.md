---
type: article
title: "Hermes Provider Routing은 OpenRouter 안의 경로까지 고른다"
aliases:
  - Hermes OpenRouter Provider Routing
author:
  - "Deck"
date created: 2026-07-10
date modified: 2026-07-10
tags: [hermes, ai-agent, workflow, provider-routing]
description: Hermes Agent can pass OpenRouter provider preferences so a model request favors cheaper, faster, stricter, or privacy-bounded upstream providers. This guide explains how that differs from fallback models and credential pools.
thumbnail: images/hermes-openrouter-provider-routing-cover.png
status: completed
series: hermes-notes
---

# Hermes Provider Routing은 OpenRouter 안의 경로까지 고른다

![hero](images/hermes-openrouter-provider-routing-cover.png)

모델 이름 하나를 고르는 것만으로는 실제 요청 경로가 끝나지 않는다. OpenRouter를 쓰면 같은 모델도 여러 하위 제공자에서 서빙될 수 있고, 각각 가격·지연·처리량·데이터 정책이 다르다. Hermes Agent의 **Provider Routing**은 이 하위 제공자 선택 조건을 `config.yaml`에 고정해 “아무 데나 보내지 말고 이런 기준으로 보내라”를 선언하는 기능이다.

## 기능 개요 — fallback이 아니라 OpenRouter 내부 경로 선택

Provider Routing은 Hermes의 모델 선택기, fallback provider, credential pool과 붙어 있지만 역할은 다르다. `hermes model`은 기본 provider/model을 고르고, credential pool은 같은 provider 안의 인증을 돌려 쓰며, `fallback_providers`는 primary가 실패했을 때 다른 provider:model으로 넘어간다. 반면 `provider_routing`은 **provider가 OpenRouter일 때** OpenRouter API에 넘길 하위 provider 선호도를 정한다.

공식 문서 기준 핵심 옵션은 `sort`, `only`, `ignore`, `order`, `require_parameters`, `data_collection`이다. `sort: price`는 비용 우선, `sort: latency`는 첫 토큰 지연 우선, `sort: throughput`은 긴 생성의 처리량 우선이다. `only`와 `ignore`는 허용·차단 provider 목록이고, `order`는 선호 순서다. `require_parameters: true`는 요청 파라미터를 제대로 지원하는 하위 provider만 쓰게 해 조용한 옵션 드롭을 줄인다.

## 어떻게 작동하나

설정은 `~/.hermes/config.yaml`의 최상위 블록에 둔다.

```yaml
provider_routing:
  sort: "latency"
  ignore:
    - "Together"
  order:
    - "Anthropic"
    - "Google"
  require_parameters: true
  data_collection: "deny"
```

Hermes는 시작 시 이 값을 읽어 에이전트 생성 인자로 전달한다. 내부적으로는 `only`가 `providers_allowed`, `ignore`가 `providers_ignored`, `order`가 `providers_order`, `sort`가 `provider_sort`로 매핑되고, OpenRouter 호출에는 `extra_body.provider` 형태로 들어간다. CLI, Gateway, Cron, Dashboard/TUI 백엔드가 같은 설정을 보도록 로컬 설치에도 경로가 연결되어 있다.

설정 위치는 다음 명령으로 확인한다.

```bash
hermes config path
hermes status --all
```

직접 API 키를 출력할 필요는 없다. OpenRouter를 primary로 쓰는 프로파일에서만 이 블록이 실제 요청에 영향을 준다. Anthropic, OpenAI Codex, xAI OAuth처럼 직접 provider에 붙은 세션에서는 이 설정이 있어도 효과가 없다.

## 실제 사용 사이드바

이 사용자의 운영 셋업에서는 현재 Dev 프로파일의 primary가 OpenAI Codex이고, cross-provider fallback은 Anthropic 쪽으로 구성되어 있다. 그래서 `provider_routing`은 아직 비어 있으며, 이는 “설정 누락”이라기보다 OpenRouter primary가 아닐 때는 적용면이 없다는 좋은 예다. 비용 중심 배치 작업을 OpenRouter로 돌릴 때만 이 블록을 켜는 식으로 범위를 좁히면 운영 규칙이 선명해진다.

## Pitfalls / tips

첫째, Provider Routing과 Fallback Provider를 섞어 생각하지 않는다. Provider Routing은 OpenRouter 안의 하위 제공자 선택이고, fallback은 Hermes가 다른 provider:model으로 갈아타는 복구 체인이다.

둘째, `only`를 너무 좁히면 가용성이 떨어진다. 특정 provider가 잠시 불안정하면 OpenRouter의 자동 대체 폭까지 줄어든다. 일관성이 더 중요한 운영인지, 가용성이 더 중요한 배치인지에 따라 `only`와 `order`를 나눈다.

셋째, 개인정보나 데이터 사용 정책이 중요하면 `data_collection: "deny"`와 `ignore`를 함께 쓴다. 다만 하위 provider 이름은 OpenRouter 쪽 표기와 맞아야 한다. 이름이 틀리면 기대한 필터가 작동하지 않을 수 있으므로 작은 요청으로 먼저 확인한다.

## 닫기

OpenRouter를 단순 모델 중계로만 쓰면 Hermes가 제공하는 라우팅 제어면을 놓치기 쉽다. 대화형 작업에는 낮은 지연을, 대량 초안에는 낮은 가격을, 민감한 작업에는 데이터 정책과 파라미터 지원을 우선시키는 식으로 Provider Routing을 사용한다. 장애 복구가 목표라면 `fallback_providers`, 같은 provider 인증 회복이 목표라면 credential pool을 고르는 편이 맞다.
