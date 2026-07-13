---
type: article
title: "Hermes TUI는 긴 에이전트 세션을 한 터미널에서 지휘한다"
aliases:
  - "Hermes Modern TUI"
author:
  - "Deck"
date created: 2026-07-14
date modified: 2026-07-14
tags:
  - hermes
  - ai-agent
  - workflow
  - tui
description: Hermes Agent's modern TUI turns long interactive runs into a responsive terminal workspace with overlays, live session switching, and shared session history. This guide explains launch options, configuration, requirements, and boundaries.
thumbnail: images/hermes-modern-tui-cover.png
status: completed
series: hermes-notes
---

# Hermes TUI는 긴 에이전트 세션을 한 터미널에서 지휘한다

![Hermes modern TUI cover](images/hermes-modern-tui-cover.png)

에이전트가 몇 분 동안 추론하고 여러 도구를 실행하면 단순한 입력 프롬프트만으로는 현재 상태와 다음 메시지를 함께 다루기 어렵다. Hermes Agent의 **TUI**는 같은 에이전트 런타임을 반응형 터미널 작업공간으로 바꿔, 실행 중에도 입력을 준비하고 세션·모델·승인 흐름을 화면 안에서 관리하게 한다.

## 기능 개요 — 같은 Hermes, 더 풍부한 터미널 표면

TUI는 별도의 에이전트나 모델이 아니다. Python 기반 Hermes 런타임 위에 Node.js와 Ink로 만든 프런트엔드가 subprocess로 붙는다. 따라서 toolset, skills, memory, profiles, slash commands와 세션 저장소는 Classic CLI와 같다. 둘은 `~/.hermes/state.db`를 공유하므로 CLI에서 시작한 세션을 TUI에서 이어 가거나 반대로 전환할 수 있다.

차이는 상호작용 방식이다. 시작 배너가 먼저 그려지고 도구와 스킬이 로딩되는 동안에도 메시지를 입력해 queue에 둘 수 있다. 모델 선택, 세션 선택, command approval, clarification은 inline 질문 대신 modal overlay로 열린다. reasoning과 tool call은 접을 수 있는 section으로 스트리밍되고, alternate screen을 써서 긴 출력 중에도 화면이 덜 흔들린다.

한 프로세스 안에서 여러 live session을 다루는 switcher도 핵심이다. `Ctrl+X` 또는 `/sessions`로 열고, `Ctrl+N`으로 새 세션을 만들며, 선택한 세션으로 즉시 이동할 수 있다. 닫힌 세션은 삭제되지 않고 저장된 transcript로 남아 `/resume`이나 `--resume`으로 다시 연다.

## 어떻게 실행하고 설정하나

일회성으로 TUI를 열거나 기존 세션을 이어 가는 명령은 다음과 같다.

```bash
hermes --tui
hermes --tui --continue
hermes --tui --resume "session title"

# 이번 실행만 Classic CLI로 되돌리기
hermes --cli
```

매번 TUI로 시작하려면 `~/.hermes/config.yaml`의 표시 인터페이스를 바꾼다.

```yaml
display:
  interface: tui
  details_mode: collapsed
  mouse_tracking: all
  tui_status_indicator: kaomoji
```

환경변수 `HERMES_TUI=1`도 bare `hermes`와 `hermes chat`을 TUI로 보낸다. 명시적 `--tui`와 `--cli`가 설정값보다 우선한다. 기본 실행은 새 세션이며, 연결이 끊긴 뒤 최근 세션을 자동으로 붙잡고 싶을 때만 `HERMES_TUI_RESUME=1`을 사용한다.

TUI 안에서도 `/model`, `/skin`, `/usage`, `/agents` 같은 명령은 그대로 작동한다. 다만 결과가 picker나 observability overlay로 보인다. `/agents`는 subagent tree와 token·cost·file rollup을 보여 주고, `/details`는 thinking·tools·subagents section의 노출 수준을 조절한다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 지식·개발·운영 역할을 서로 다른 Hermes profile과 메시징 topic으로 분리한다. 메시징 표면은 장기 운영과 전달에 두고, TUI는 특정 profile의 구현·검증 세션을 한 터미널에서 집중해서 볼 때 사용한다. 이때 profile 격리는 그대로 유지되고 바뀌는 것은 대화 화면뿐이다.

## Pitfalls / tips

첫째, Node.js 20 이상과 실제 TTY가 필요하다. `hermes doctor`로 Node와 TUI workspace 상태를 확인할 수 있고, 첫 실행에는 `ui-tui/node_modules` 설치로 잠시 시간이 걸릴 수 있다. pipe나 비대화형 Cron에서는 TUI 대신 single-query mode로 내려간다.

둘째, `hermes --tui`와 `hermes dashboard --tui`는 다르다. 전자는 터미널 앱이고 후자는 Dashboard 안의 chat surface를 켠다. 로그에 보이는 `HERMES_TUI_GATEWAY_URL`은 Dashboard 내부 연결용이므로 외부 Gateway에 붙는 remote attach 주소로 설정하면 안 된다.

셋째, alternate screen은 종료 뒤 scrollback을 깔끔하게 비운다. 실행 기록이 필요하면 터미널 화면을 보존하려 하지 말고 공유 세션 저장소와 `hermes sessions`를 사용한다. 문제가 생기면 `hermes --cli`로 같은 세션과 설정을 확인해 UI 문제와 agent 문제를 분리한다.

## 언제 TUI를 고를까

한 번의 짧은 질문이나 shell pipeline에는 Classic CLI가 더 가볍다. 설정·Cron·Gateway 상태를 브라우저에서 관리하려면 Dashboard, 파일 미리보기까지 포함한 GUI가 필요하면 Desktop이 맞다. 여러 tool call과 subagent가 이어지는 긴 대화를 터미널 안에서 놓치지 않고 지휘하려면 TUI가 가장 직접적인 선택이다.
