---
type: article
title: "Hermes 모델 카탈로그는 모델 선택을 릴리스 밖으로 분리한다"
aliases:
  - "hermes-model-catalog-selector"
author:
  - "Deck"
date created: 2026-07-03
date modified: 2026-07-03
tags: [hermes, ai-agent, workflow, model-catalog]
description: "A practical guide to Hermes Agent's model catalog: curated provider model lists, cache behavior, refresh options, and how it supports the model picker without requiring a new release."
thumbnail: images/hermes-model-catalog-selector-cover.png
status: completed
series: hermes-notes
---

# Hermes 모델 카탈로그는 모델 선택을 릴리스 밖으로 분리한다

![Hermes model catalog cover](images/hermes-model-catalog-selector-cover.png)

모델 선택기는 단순한 드롭다운이 아니다. provider마다 `/models` 응답 형식, 모델 수, 가격 정보, 지원 능력이 다르고, 새 모델은 Hermes Agent 릴리스 주기보다 더 빠르게 나온다. **Hermes Model Catalog**는 이 문제를 “코드를 다시 배포해야만 모델 목록이 바뀐다”에서 “원격 매니페스트와 로컬 캐시로 선택지를 갱신한다”로 바꾼다.

## 기능 개요 — curated catalog와 picker

Hermes의 `hermes model`과 세션 안 `/model`은 provider와 모델을 고르는 입구다. 여기서 중요한 점은 모든 provider의 원시 `/models` 목록을 그대로 보여 주지 않는다는 것이다. OpenRouter 같은 provider는 수백 개 모델과 이미지·TTS·reranker까지 섞어 제공할 수 있다. Hermes는 agentic 작업에 적합한 모델을 고르기 쉽도록 provider별 큐레이션 목록을 사용한다.

공식 문서 기준으로 model catalog는 OpenRouter와 Nous Portal의 큐레이션된 모델 목록을 JSON 매니페스트에서 가져온다. 새 프런티어 모델이나 권장 모델 배지가 바뀌어도 Hermes 본체를 매번 업데이트하지 않고 선택기 표면을 갱신할 수 있다. 네트워크가 막히면 캐시나 설치본에 포함된 스냅샷으로 조용히 돌아간다.

## 어떻게 작동하나

가장 많이 만나는 사용 흐름은 모델 선택기다.

```bash
hermes model
```

목록을 강제로 새로 받고 싶을 때는 캐시를 비운 뒤 다시 가져온다.

```bash
hermes model --refresh
```

매니페스트의 기본 위치는 문서 사이트의 JSON endpoint다.

```text
https://hermes-agent.nousresearch.com/docs/api/model-catalog.json
```

설정은 `~/.hermes/config.yaml`의 `model_catalog` 블록으로 조정한다.

```yaml
model_catalog:
  enabled: true
  url: https://hermes-agent.nousresearch.com/docs/api/model-catalog.json
  ttl_hours: 1
  providers: {}
```

디스크 캐시는 다음 위치를 쓴다.

```text
~/.hermes/cache/model_catalog.json
```

동작은 보수적이다. 캐시가 TTL 안에 있으면 네트워크를 다시 부르지 않는다. 캐시가 있는데 네트워크가 실패하면 캐시를 사용한다. 캐시도 없고 원격도 실패하면 Hermes 설치본에 들어 있는 in-repo 스냅샷으로 fallback한다. 즉 catalog fetch 실패가 모델 선택기 전체를 망가뜨리면 안 된다는 설계다.

제3자가 자체 큐레이션 목록을 운영할 수도 있다.

```yaml
model_catalog:
  providers:
    openrouter:
      url: https://example.com/my-openrouter-curation.json
```

이때 override 매니페스트는 자신이 관리하는 provider 블록만 담아도 된다. 나머지는 기본 master catalog가 계속 담당한다.

## 실제 운용에서의 짧은 장면

이 사용자의 Hermes 운영은 프로파일별로 Dev, PKM, Ops 작업을 나누고, 각 프로파일이 다른 provider와 보조 모델 설정을 가질 수 있다. 이런 환경에서는 “어떤 모델이 설치본에 하드코딩되어 있는가”보다 “현재 선택기와 config가 어떤 catalog를 기준으로 보이는가”가 더 중요하다. 새 모델이 보이지 않을 때도 바로 인증 문제로 단정하지 않고, catalog 캐시와 refresh 여부를 먼저 확인하는 식이다.

## 주의할 점

- model catalog는 인증을 대신하지 않는다. 목록에 보이는 provider라도 API key나 OAuth가 없으면 실제 호출은 실패한다.
- catalog의 `description`은 선택기 배지 같은 힌트일 뿐, 가격·context length는 보통 provider API나 models.dev 같은 실시간 정보에서 온다.
- `enabled: false`를 설정하면 원격 fetch를 끄고 설치본 스냅샷을 쓴다. 폐쇄망이나 재현성 테스트에는 유용하지만 최신 모델 반영은 늦어진다.
- `--refresh`는 목록 캐시를 다시 받는 기능이지, 현재 실행 중인 세션의 모델을 바꾸는 기능이 아니다. 이미 열린 세션은 시작 시점의 설정을 유지한다.
- 커스텀 catalog URL을 쓸 때는 schema version과 provider key를 맞춰야 한다. 알 수 없는 필드는 무시되지만 이해하지 못하는 schema version은 거부될 수 있다.

Model Catalog는 눈에 잘 띄지 않지만, Hermes를 오래 운영할수록 중요한 기반 기능이다. 모델이 빠르게 바뀌는 시대에는 선택지 목록 자체도 운영 대상이다. 새 모델을 실험하고 싶을 때는 `hermes model --refresh`로 catalog를 갱신하고, 안정적인 운영에서는 config·cache·fallback을 함께 확인하는 것이 좋다.
