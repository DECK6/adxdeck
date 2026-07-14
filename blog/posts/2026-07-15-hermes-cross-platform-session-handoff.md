---
type: article
title: "Hermes Session Handoff는 터미널의 긴 작업을 메신저로 이어 보낸다"
aliases:
  - "Hermes Cross Platform Session Handoff"
author:
  - "Deck"
date created: 2026-07-15
date modified: 2026-07-15
tags:
  - hermes
  - ai-agent
  - workflow
  - session-handoff
description: Hermes Agent can hand a live CLI session to a messaging platform without discarding its transcript or tool history. This guide explains the handoff flow, prerequisites, thread behavior, and recovery boundaries.
thumbnail: images/hermes-cross-platform-session-handoff-cover.png
status: completed
series: hermes-notes
---

# Hermes Session Handoff는 터미널의 긴 작업을 메신저로 이어 보낸다

![Hermes cross-platform session handoff cover](images/hermes-cross-platform-session-handoff-cover.png)

터미널에서 시작한 조사나 개발 작업이 길어졌는데 자리를 옮겨야 한다면, 새 메신저 대화에 맥락을 다시 붙여 넣는 순간 기록과 도구 실행 흐름이 갈라진다. Hermes Agent의 **Cross-Platform Session Handoff**는 현재 CLI 세션을 Telegram·Discord·Slack 같은 메시징 표면으로 넘겨, 같은 대화를 휴대폰이나 팀 채널에서 이어 가게 한다.

## 기능 개요 — 메시지가 아니라 세션을 이동한다

Handoff의 핵심은 마지막 답변을 복사하는 것이 아니다. 현재 `session_id`, role-aware transcript, tool call 기록을 그대로 유지한 채 대상 플랫폼의 새 thread나 home channel에 연결한다. 세션 본체는 `~/.hermes/state.db`에 남고, Gateway가 대상 채널의 routing key를 그 세션에 다시 묶는다.

이 기능은 CLI 전용 slash command `/handoff <platform>`로 시작한다. 대상 Gateway가 실행 중이어야 하고, 해당 플랫폼의 home channel이 먼저 설정되어 있어야 한다. Hermes는 진행 중인 agent turn이 끝나기 전에는 handoff를 거부한다. 응답 도중 연결 위치가 바뀌어 두 표면이 같은 turn을 동시에 소유하는 일을 막기 위해서다.

## 어떻게 작동하고 쓰는가

먼저 대상 채팅에서 home channel을 한 번 등록하고 Gateway 상태를 확인한다.

```text
/sethome
```

```bash
hermes gateway status
hermes
```

CLI 세션 안에서 제목을 붙인 뒤 대상을 지정한다.

```text
/title renderer-review
/handoff telegram
```

요청을 받으면 CLI는 세션 행을 pending 상태로 기록하고 Gateway의 watcher가 이를 claim할 때까지 기다린다. Gateway는 Telegram에서는 topic, Discord에서는 text-channel thread, Slack에서는 seed message에 묶인 thread를 만든다. thread가 없는 WhatsApp·Signal·Matrix·SMS에서는 home channel로 직접 연결한다.

연결이 끝나면 Gateway가 같은 세션에 합성 user turn을 추가해 새 위치에서 동작 중임을 확인하게 하고, CLI는 성공 메시지와 resume 안내를 남긴 뒤 종료한다. 나중에 다시 터미널로 돌아올 때는 새 세션을 만들 필요가 없다.

```bash
hermes --resume "renderer-review"
```

별도의 handoff 전용 설정 블록은 없다. `~/.hermes/config.yaml`에서 대상 플랫폼이 활성화되어 있고, Gateway가 실행 중이며, home channel과 thread 생성 권한이 준비되어 있는지가 실제 조건이다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 지식·개발·운영 역할을 서로 다른 profile과 메시징 topic으로 나누고, 긴 구현·검증은 터미널에서 시작한다. 이동이 필요할 때 결과만 전달하는 대신 해당 세션을 handoff하면, 모바일에서도 직전 결정과 도구 실행 맥락을 같은 기록 위에서 이어 갈 수 있다. 역할별 profile 경계는 그대로 두고 대화 표면만 바꾸는 방식이다.

## Pitfalls / tips

첫째, `/sethome` 없이 실행하면 Hermes는 대상 위치를 결정할 수 없어 거부한다. 둘째, Gateway가 꺼져 있거나 플랫폼 연결이 끊겨 있으면 약 60초 뒤 timeout되고 원래 CLI 세션은 그대로 남는다. thread 생성 권한이 부족하면 home channel로 fallback할 수 있으므로, 여러 사람이 함께 쓰는 채널에서는 세션 격리가 유지됐는지 확인한다.

셋째, handoff는 공개 권한을 새로 주지 않는다. 대상 플랫폼의 allowlist·Pairing·mention 정책은 계속 적용된다. 넷째, 단순 알림을 보내는 `hermes send`와 구분한다. `send`는 메시지를 전달하지만 작업 세션의 소유 위치를 옮기지 않는다.

## 언제 Handoff를 고를까

같은 컴퓨터에서 잠시 창만 바꿀 때는 `hermes --continue`나 TUI session switcher가 더 단순하다. 결과 파일이나 알림만 보내려면 deliverable 또는 `hermes send`가 맞다. 터미널의 살아 있는 장기 작업을 메신저에서 그대로 이어야 할 때는 Handoff가 재설명과 기록 분기를 가장 적게 만드는 선택이다.
