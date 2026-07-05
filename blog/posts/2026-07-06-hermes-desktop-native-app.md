---
type: article
title: "Hermes Desktop은 터미널 에이전트를 일상 작업창으로 끌어온다"
aliases:
  - "hermes-desktop-native-app"
  - "Hermes Desktop Native App"
author:
  - "Deck"
date created: 2026-07-06
date modified: 2026-07-06
tags:
  - hermes
  - ai-agent
  - workflow
  - desktop
  - gui
description: "A practical feature guide to Hermes Agent Desktop: how the native app shares the same agent core with CLI and gateway, how to launch it, and when to use it instead of the web dashboard or terminal UI."
thumbnail: images/hermes-desktop-native-app-cover.png
status: completed
series: hermes-notes
---

# Hermes Desktop은 터미널 에이전트를 일상 작업창으로 끌어온다

![Hermes Desktop cover](images/hermes-desktop-native-app-cover.png)

Hermes Agent는 터미널에서 시작할 수 있지만, 모든 사용자가 매번 CLI 안에서 모델·도구·세션을 관리하고 싶은 것은 아니다. **Hermes Desktop**은 같은 Hermes Agent 코어를 네이티브 앱으로 감싼 표면이다. 별도 제품이 아니라, 이미 설정한 provider, skills, sessions, memory, profile을 같은 데이터 위에서 다루는 작업창에 가깝다.

## 기능 개요

Desktop App은 macOS, Windows, Linux에서 동작하는 Electron 기반 네이티브 UI다. 중앙에는 채팅이 있고, 왼쪽에는 세션과 관리 영역, 오른쪽에는 파일·웹·도구 출력 미리보기 레일이 붙는다. 드래그앤드롭 파일 첨부, 스트리밍 tool activity, composer history, 모델 선택 드롭다운, command palette 같은 기능은 “에이전트가 지금 무엇을 보고 무엇을 실행하는가”를 터미널보다 더 눈에 보이게 만든다.

중요한 구분은 Web Dashboard와의 차이다. `hermes dashboard`는 브라우저에서 설정과 세션을 관리하는 서버형 패널이고, Desktop은 로컬 앱 셸이다. 둘 다 같은 Hermes 런타임을 쓰지만, Desktop은 로컬 앱처럼 실행되고 필요하면 원격 `hermes dashboard` 백엔드에 붙을 수도 있다.

## 어떻게 실행되고 설정되나

이미 Hermes가 설치되어 있다면 기본 진입점은 단순하다.

```bash
hermes desktop
# 또는 alias
hermes gui
```

특정 작업 폴더를 초기 파일 브라우저와 채팅 cwd로 열고 싶을 때는 다음처럼 시작한다.

```bash
hermes desktop --cwd /path/to/project
```

빌드된 앱이 이미 있으면 `--skip-build`, 깨끗하게 다시 만들고 싶으면 `--force-build`, 실행하지 않고 패키지만 만들려면 `--build-only`를 쓴다. 소스 체크아웃을 직접 개발 중이라면 `--source`로 Electron/Vite 개발 빌드에 붙을 수 있다.

```bash
hermes desktop --skip-build
hermes desktop --force-build
hermes desktop --build-only
hermes desktop --source
```

앱은 `HERMES_HOME` 아래의 기존 Hermes 설정을 읽는다. Desktop 전용으로 중요한 환경변수는 `HERMES_DESKTOP_CWD`, `HERMES_DESKTOP_HERMES_ROOT`, `HERMES_DESKTOP_REMOTE_URL`, `HERMES_DESKTOP_IGNORE_EXISTING` 정도다. 원격 백엔드를 쓰는 경우에는 대상 머신에서 `hermes dashboard --host ... --port ...`가 실행 중이어야 하며, 공개 네트워크라면 username/password보다 OAuth나 VPN을 우선 고려해야 한다.

## 실제 운영에서의 짧은 사례

이 사용자의 셋업처럼 CLI, gateway, cron, 여러 profile이 함께 움직이면 “어느 표면에서 시작했는가”보다 “같은 세션과 설정을 이어서 볼 수 있는가”가 더 중요해진다. Desktop은 긴 작업 로그를 시각적으로 따라가거나, 파일 브라우저와 채팅을 나란히 두고 결과물을 확인할 때 유용하다. 반대로 자동 실행이나 headless 작업은 여전히 cron, gateway, CLI가 더 맞다.

## 주의할 점

첫째, Desktop의 모델 선택 드롭다운은 앱의 편의 상태와 세션 선택에 가깝고, profile의 기본 모델을 바꾸는 위치는 Settings의 Model 영역이다. 크론이나 subagent 기본값까지 바꾸려면 profile 설정을 확인해야 한다.

둘째, 원격 연결은 “Desktop이 원격 에이전트를 알아서 띄운다”는 뜻이 아니다. 원격 머신의 dashboard 프로세스, 인증 설정, 방화벽 또는 VPN이 먼저 준비되어야 한다. 연결 문제는 `hermes logs gui -f` 또는 `desktop.log`에서 부팅·백엔드 오류를 확인하는 편이 빠르다.

셋째, GUI가 안전장치를 없애지는 않는다. 세션별 YOLO 토글은 위험 명령 승인 프롬프트를 우회할 수 있으므로 임시 실험에만 신중히 써야 한다. 앱 제거도 단계가 나뉜다. GUI만 지우는 것과 agent·데이터까지 지우는 것은 다르다.

## 언제 Desktop을 선택할까

터미널에서 빠르게 한 번 실행할 일은 `hermes`나 `hermes --tui`가 가볍다. 브라우저 기반 관리와 원격 접속은 `hermes dashboard`가 맞다. 하지만 채팅, 파일 확인, 설정, 세션 관리, voice, skills, cron, profiles를 한 화면에서 오가며 Hermes를 매일 쓰려면 Desktop이 가장 자연스러운 입구다.
