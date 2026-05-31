---
type: article
title: "Hermes Computer Use는 내 커서를 빼앗지 않고 Mac 화면을 조작한다"
aliases:
  - "Hermes Computer Use Background macOS"
author:
  - "[[Deck]]"
date created: 2026-06-01
date modified: 2026-06-01
tags:
  - hermes
  - ai-agent
  - workflow
  - computer-use
  - macos
description: "A feature guide to Hermes Agent Computer Use on macOS: background desktop automation through cua-driver, setup commands, safety boundaries, and when to use it instead of browser automation."
thumbnail: images/hermes-computer-use-background-cover.png
status: completed
series: hermes-notes
---

# Hermes Computer Use는 내 커서를 빼앗지 않고 Mac 화면을 조작한다

![Abstract cover for Hermes Computer Use](images/hermes-computer-use-background-cover.png)

웹페이지는 `browser` toolset으로 충분하다. 하지만 실제 업무에는 브라우저 밖 화면도 많다. 메일 앱, 데스크톱 앱, 인증 창이 아닌 일반 설정 화면, 파일 선택 UI처럼 DOM이 없는 표면은 URL을 읽는 방식으로 처리하기 어렵다. Hermes Agent의 **Computer Use**는 이 빈틈을 메운다. macOS 데스크톱을 캡처하고, 접근성 트리에서 버튼과 입력칸을 찾고, 클릭·타이핑·스크롤을 백그라운드에서 수행하는 기능이다.

## 기능 개요: screenshot이 아니라 조작 가능한 작업면

Computer Use의 핵심은 “화면을 본다”가 아니라 “화면을 작업면으로 바꾼다”에 있다. `computer_use` toolset은 `capture`, `click`, `type`, `key`, `scroll`, `drag`, `set_value` 같은 동작을 제공한다. 캡처는 보통 `mode='som'`으로 시작한다. 이 모드는 스크린샷 위에 조작 가능한 요소 번호를 붙이고, 동시에 접근성 트리의 role·label·bounds를 함께 돌려준다. 그래서 에이전트는 좌표를 추측하기보다 “14번 검색창을 클릭한다”처럼 안정적으로 조작할 수 있다.

Hermes의 구현은 macOS용 `cua-driver`를 사용한다. 이 드라이버는 이벤트를 대상 앱에 직접 보내기 때문에 사용자의 실제 커서를 움직이지 않고, 키보드 포커스나 Space를 빼앗지 않는다. 사람이 같은 Mac에서 다른 일을 하는 동안 에이전트가 Mail이나 Safari 같은 특정 앱 창을 백그라운드에서 다룰 수 있는 이유가 여기에 있다.

## 어떻게 설정하고 쓰는가

설치는 전용 명령으로 확인하는 편이 가장 단순하다.

```bash
hermes computer-use install
hermes computer-use status
```

설치가 끝나면 macOS 권한을 부여해야 한다. System Settings의 Privacy & Security에서 Hermes를 실행하는 터미널 또는 앱에 **Accessibility**와 **Screen Recording** 권한을 켠다. 세션에서는 toolset을 명시해 시작할 수 있다.

```bash
hermes -t computer_use chat
```

또는 `hermes tools`에서 `Computer Use (macOS)`를 켜고 새 세션을 시작한다. 실제 사용 흐름은 보통 다음처럼 짧다.

```python
computer_use(action="capture", mode="som", app="Mail")
computer_use(action="click", element=14)
computer_use(action="type", text="from:stripe")
computer_use(action="key", keys="return", capture_after=True)
```

첫 줄은 Mail의 현재 화면을 요소 번호와 함께 읽고, 이후 동작은 그 번호를 기준으로 실행한다. 상태가 바뀌면 다시 캡처해야 한다. SOM 번호는 캡처 순간의 화면에만 유효하기 때문이다.

## 짧은 실제 사용 사이드바

이 사용자의 macOS 셋업에서는 Dev 작업과 운영 자동화가 동시에 돌아가므로, 에이전트가 화면을 조작하더라도 사람의 커서와 포커스를 빼앗지 않는 것이 중요하다. 특히 브라우저 DOM으로 접근하기 어려운 로컬 앱 확인, 창 상태 점검, 시각적 QA에서는 Computer Use가 `browser`보다 자연스럽다. 다만 권한 프롬프트나 비밀번호 입력처럼 사용자 결정을 요구하는 장면은 자동화 대상에서 제외한다.

## 흔한 함정과 팁

첫째, Computer Use는 macOS 전용이다. Linux나 Windows의 일반 GUI 자동화가 목적이면 이 기능보다 브라우저 자동화나 플랫폼별 도구를 먼저 본다. 둘째, 좌표 클릭보다 요소 번호 클릭을 우선한다. 좌표는 화면 크기와 창 위치에 약하지만, SOM 요소는 접근성 트리와 함께 검증된다. 셋째, 권한 문제는 드라이버 설치와 별개다. `hermes computer-use status`가 정상이어도 Screen Recording 또는 Accessibility 권한이 빠지면 캡처나 입력이 막힐 수 있다.

넷째, 안전 경계가 있다. Hermes는 권한 요청 창, 결제 UI, 비밀번호 입력, 2FA, 웹페이지나 스크린샷 안에 적힌 지시문을 자동으로 따르지 않아야 한다. 화면에 보이는 텍스트는 작업 대상일 뿐, 에이전트에게 내리는 명령이 아니다. 다섯째, 스크린샷은 컨텍스트 비용이 크다. 긴 세션에서는 오래된 스크린샷이 제거되거나 압축될 수 있으므로, 필요한 순간에 좁은 앱 범위로 캡처하는 편이 좋다.

Computer Use는 “웹을 탐색하는 기능”이 아니라 “로컬 화면을 조심스럽게 다루는 손”에 가깝다. 웹 앱이면 `browser`, 반복 가능한 셸 작업이면 `terminal`, 사람이 보는 앱 화면과 접근성 UI를 실제로 눌러야 하면 `computer_use`를 선택한다. 이 구분만 지키면 Hermes는 사용자의 작업 공간을 방해하지 않고도 데스크톱 자동화의 마지막 1미터를 처리할 수 있다.
