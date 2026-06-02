---
type: article
title: "Hermes Vision은 이미지를 대화의 입력으로 바꾼다"
aliases:
  - "Hermes Vision Image Analysis"
author:
  - "[[Deck]]"
date created: 2026-06-03
date modified: 2026-06-03
tags:
  - hermes
  - ai-agent
  - workflow
  - vision
  - multimodal
description: "A feature guide to Hermes Agent Vision: how image paste, image attachments, and vision_analyze route visual inputs through multimodal or auxiliary models."
thumbnail: images/hermes-vision-image-analysis-cover.png
status: completed
series: hermes-notes
---

# Hermes Vision은 이미지를 대화의 입력으로 바꾼다

![Abstract cover for Hermes Vision image analysis](images/hermes-vision-image-analysis-cover.png)

텍스트만 다루는 에이전트는 화면, 스크린샷, 이미지 오류, 디자인 시안을 설명받아야 한다. 그 설명이 틀리면 다음 판단도 틀어진다. **Hermes Vision**은 이 병목을 줄이는 기능이다. 이미지를 클립보드, 로컬 파일, URL, 메시징 플랫폼 첨부로 받아 모델이 직접 보거나, 필요하면 보조 vision 모델이 설명으로 변환해 대화에 넣는다.

## 기능 개요: 이미지도 하나의 입력 블록이 된다

Hermes의 Vision은 두 층으로 작동한다. 첫째, CLI와 게이트웨이는 사용자가 보낸 이미지를 대화 입력으로 붙인다. CLI에서는 `/paste`로 클립보드 이미지를 명시적으로 첨부하거나, 단발 실행에서 `--image`를 쓸 수 있다. 둘째, 도구 레벨에서는 `vision_analyze`가 URL이나 로컬 이미지 경로를 받아 이미지 분석을 수행한다.

핵심은 “항상 같은 방식으로 실패하지 않게 하는 라우팅”이다. 현재 모델이 vision-capable이면 이미지는 base64 image content block으로 전달되어 모델이 픽셀을 직접 본다. 반대로 텍스트 전용 모델이면 Hermes가 `auxiliary.vision` 설정의 보조 모델을 통해 이미지를 설명하고, 그 텍스트 요약을 대화 컨텍스트에 넣는다. 사용자는 모델을 바꿔도 같은 워크플로우를 유지할 수 있다.

`vision` toolset은 기본적으로 `vision_analyze`를 제공한다. 브라우저 자동화와 함께 쓸 때는 `browser_get_images`로 페이지의 이미지 URL을 모은 뒤 `vision_analyze`로 특정 이미지를 확인할 수 있고, `browser_vision`은 현재 브라우저 화면 자체를 스크린샷으로 분석한다. 즉 Vision은 이미지 파일 분석, 웹 이미지 확인, 화면 이해를 잇는 공통 시각 입력 계층이다.

## 어떻게 설정하고 쓰는가

기본 CLI에서 Vision이 열려 있는지 먼저 확인한다.

```bash
hermes tools list
```

필요하면 toolset을 지정해 세션을 시작한다.

```bash
hermes chat --toolsets vision,file,web
```

단발 질문에 로컬 이미지를 붙일 때는 다음처럼 실행한다.

```bash
hermes chat -q "이 스크린샷에서 오류 원인을 찾아줘" --image ./screenshot.png
```

대화형 CLI에서는 클립보드 이미지를 복사한 뒤 아래 명령을 입력한다.

```text
/paste
```

첨부된 이미지는 입력창 위에 이미지 배지로 표시되고, 전송 시 모델이 처리할 수 있는 이미지 블록으로 들어간다. Linux X11은 `xclip`, Wayland는 `wl-clipboard`가 필요하고, macOS는 기본적으로 `osascript`를 사용한다. WSL2는 `powershell.exe`를 통해 Windows 클립보드를 읽는다.

도구 호출 관점에서는 같은 일을 더 직접적으로 시킬 수 있다.

```text
vision_analyze(image_url="./ui-bug.png", question="접근성 문제를 찾아줘")
```

설정에서 보조 vision 모델을 조정해야 할 때는 `auxiliary.vision`을 확인한다.

```yaml
auxiliary:
  vision:
    provider: openrouter
    model: google/gemini-2.5-flash
```

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 블로그 커버 이미지 검수, 브라우저 화면 확인, macOS 앱 스크린샷 점검이 텍스트 작업과 자주 섞인다. 특히 “이미지에 글자나 워터마크가 있는가”처럼 사람이 눈으로 확인하던 QA를 Vision으로 한 번 더 걸러 두면 발행 전에 위험한 자산을 줄일 수 있다. 다만 개인 경로, 계정 화면, 토큰이 보이는 캡처는 공개 글이나 외부 모델에 그대로 보내지 않는 것이 원칙이다.

## 흔한 함정과 팁

첫째, `/paste`는 SSH 원격 세션에서 기대대로 동작하지 않을 수 있다. 클립보드 도구는 Hermes가 실행되는 머신의 클립보드를 읽기 때문이다. 원격 서버에서 작업한다면 이미지를 업로드해 로컬 경로로 참조하거나, 접근 가능한 URL을 쓰는 편이 안정적이다.

둘째, Vision은 Image Generation과 다르다. Vision은 기존 이미지를 이해하는 기능이고, Image Generation은 새 이미지를 만드는 기능이다. 커버를 만들 때는 `image_generate`, 결과를 검수할 때는 `vision_analyze`처럼 역할을 나누면 좋다.

셋째, 이미지 안의 민감정보는 텍스트보다 쉽게 놓친다. 주소창, 채팅방 이름, API 키 일부, 파일 경로, 사람 얼굴, 내부 대시보드가 보이면 먼저 가리거나 잘라낸 뒤 첨부해야 한다. 넷째, 텍스트 전용 모델에서 보조 vision 설명을 거친 결과는 픽셀 직접 인식보다 정보가 손실될 수 있다. 세밀한 UI·차트·도면 분석은 vision-capable 모델을 쓰는 편이 낫다.

Vision은 Hermes를 “말을 잘 듣는 챗봇”에서 “화면과 이미지도 함께 다루는 작업자”로 넓힌다. 텍스트 로그만으로 충분한 문제는 일반 도구가 빠르다. 하지만 오류 화면, 디자인 시안, 웹 이미지, 생성 커버, 복잡한 UI처럼 시각 정보가 판단의 중심일 때는 Vision이 가장 짧은 입력 경로가 된다.
