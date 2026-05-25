---
type: article
title: "Hermes 이미지 생성은 프롬프트보다 provider 설정이 먼저다"
aliases:
  - hermes-image-generation-provider
author:
  - "Deck"
date created: 2026-05-26
date modified: 2026-05-26
tags: [hermes, ai-agent, workflow, image-gen]
description: A practical guide to Hermes Agent image generation, explaining the image_gen toolset, provider/model selection, aspect ratios, delivery behavior, and common setup pitfalls.
thumbnail: images/hermes-image-generation-provider-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-image-generation-provider-cover.png)

Hermes Agent의 이미지 생성은 “그림을 잘 그리는 프롬프트”만의 문제가 아니다. 사용자가 provider와 model을 정해 두면, 에이전트는 대화 중 필요한 순간 `image_generate` 도구를 호출해 같은 설정 위에서 이미지를 만든다. 즉 프롬프트는 입력이고, 품질·비용·인증·저장 방식은 설정된 이미지 backend가 결정한다.

## 기능 개요 — image_gen toolset과 provider

공식 문서에서 Hermes의 이미지 생성은 `image_gen` toolset으로 제공된다. 에이전트가 직접 보는 스키마는 작다. 핵심 인자는 `prompt`와 `aspect_ratio`뿐이고, aspect ratio는 `landscape`, `square`, `portrait` 세 가지로 통일되어 있다. 모델별 네이티브 크기, 품질 옵션, 업스케일 여부는 backend가 내부에서 번역한다.

기본 문서 표면은 FAL.ai와 Nous Tool Gateway를 중심으로 설명한다. 동시에 Hermes는 image generation provider plugin 구조도 갖고 있어 OpenAI, OpenAI Codex, xAI 같은 backend를 `image_gen.provider`로 선택할 수 있다. 핵심은 하나다. Hermes가 임의로 모델을 고르는 것이 아니라, `hermes tools`와 `config.yaml`에 저장된 선택이 실제 생성 경로를 정한다.

## 어떻게 작동하나

먼저 toolset이 켜져 있는지 확인한다.

```bash
hermes tools list
hermes tools enable image_gen
hermes tools
```

`hermes tools`의 Image Generation 화면에서는 backend와 model을 고르고, 선택은 설정 파일에 남는다.

```yaml
image_gen:
  model: fal-ai/flux-2/klein/9b
  use_gateway: false
```

provider plugin을 명시적으로 쓰는 설치라면 provider와 model을 분리해 본다.

```yaml
image_gen:
  provider: openai-codex
  model: gpt-image-2-medium
```

대화 안에서는 “어두운 테마의 추상 기술 인포그래픽을 만들어줘, landscape로”처럼 요청하면 된다. 에이전트는 도구를 이렇게 호출한다.

```text
image_generate(prompt="...", aspect_ratio="landscape")
```

그 뒤 Hermes는 active provider를 찾고, 해당 provider가 모델별 payload를 만든다. FAL 문서 기준으로 `landscape`는 모델마다 `landscape_16_9`, `1536x1024`, `landscape_4_3` 같은 서로 다른 값으로 변환될 수 있다. base64를 반환하는 backend는 이미지를 `$HERMES_HOME/cache/images/` 아래에 저장하고, URL을 반환하는 backend는 URL을 결과로 넘긴다.

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 블로그 커버처럼 반복되는 제작물에 이미지 생성 도구를 쓴다. 중요한 습관은 프롬프트를 고치기 전에 provider 상태를 먼저 보는 것이다. generic `image_generate`가 FAL key를 요구하더라도, 로컬 설치에 Codex 이미지 provider가 준비되어 있으면 provider 선택 문제일 수 있다.

## Pitfalls / tips

첫째, `FAL_KEY environment variable is not set`은 이미지 생성 전체가 불가능하다는 뜻이 아닐 수 있다. 기본 경로가 FAL이라면 FAL key나 Nous Tool Gateway가 필요하지만, plugin provider를 쓰는 환경에서는 `image_gen.provider`가 원하는 backend로 설정되어 있는지 확인한다.

둘째, `image_generate` 호출에서 모델명을 매번 바꾸려 하지 않는다. 공식 사용 모델은 “에이전트는 prompt와 aspect ratio를 넘기고, 사용자는 설정에서 backend를 고른다”에 가깝다. 여러 모델을 비교해야 한다면 `hermes tools`에서 선택을 바꾼 뒤 같은 프롬프트를 다시 실행하는 편이 안전하다.

셋째, 생성 URL은 영구 보관소가 아니다. hosted URL은 만료될 수 있으므로 블로그, 문서, 프레젠테이션에 쓸 이미지는 로컬 파일로 저장해 프로젝트의 `images/` 폴더에 복사한다.

넷째, 이미지 provider plugin은 backend 교체다. 사용자 plugin은 `~/.hermes/plugins/image_gen/<name>/` 아래에 둘 수 있고, `hermes plugins enable <name>`과 `image_gen.provider` 설정을 함께 봐야 한다.

## 언제 이 기능을 쓰나

Hermes 이미지 생성은 대화형 아이디어 스케치, 블로그 커버, 발표용 추상 이미지처럼 에이전트가 작업 흐름 안에서 곧장 시각 자산을 만들어야 할 때 적합하다. 반대로 세밀한 편집, inpainting, 기존 이미지 수정은 현재 text-to-image 중심 도구의 범위를 넘는다. 빠른 생성은 Hermes 안에서 처리하고, 정교한 후편집은 전용 이미지 도구로 넘기는 식으로 나누면 안정적이다.
