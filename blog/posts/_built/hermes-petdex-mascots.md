---
type: article
title: "Hermes Pets는 장난감이 아니라 에이전트 상태 표시등이다"
aliases:
  - "hermes-petdex-mascots"
author:
  - "Deck"
date created: 2026-06-25
date modified: 2026-06-25
tags:
  - hermes
  - ai-agent
  - workflow
  - petdex
description: "A practical guide to Hermes Agent Pets: how Petdex mascots install per profile, map agent activity to animation states, render across CLI/TUI/desktop, and stay cosmetic rather than behavioral."
thumbnail: images/hermes-petdex-mascots-cover.png
status: completed
series: hermes-notes
featureTopic: "Pets and Petdex Mascots"
officialDocs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/pets"
localVerification:
  - "hermes --version"
  - "hermes pets --help"
  - "hermes pets doctor"
  - "active profile display.pet config"
---

# Hermes Pets는 장난감이 아니라 에이전트 상태 표시등이다

![Hermes Pets cover](images/hermes-petdex-mascots-cover.png)

Hermes Pets는 CLI, TUI, desktop app에서 움직이는 작은 마스코트를 띄우는 기능입니다. 겉으로는 귀여운 장식처럼 보이지만, 실제 목적은 더 실용적입니다. 에이전트가 idle인지, tool을 실행 중인지, 검토 중인지, 실패했는지를 시각적으로 알려 주는 **상태 표시등**입니다.

## 기능 개요: Petdex 마스코트를 profile별로 붙이기

공식 문서 기준 Pets는 공개 Petdex gallery의 animated sprite를 Hermes 화면에 연결합니다. 중요한 점은 이 기능이 prompt, token, model behavior를 바꾸지 않는다는 것입니다. `SOUL.md`나 `/personality`처럼 에이전트의 말투를 바꾸는 레이어가 아니라, `display` 설정 아래에 있는 순수 표시 레이어입니다.

설치된 pet은 profile의 Hermes home 아래에 저장됩니다.

```text
~/.hermes/pets/<slug>/
~/.hermes/profiles/<profile>/pets/<slug>/
```

profile을 나누어 쓰는 환경에서는 Dev profile과 개인 assistant profile이 서로 다른 pet을 가질 수 있습니다. 선택 상태도 `config.yaml`의 `display.pet`에 저장되므로, 한 profile에서 켠 마스코트가 다른 profile의 설정을 오염시키지 않습니다.

## 어떻게 동작하나: `hermes pets`, `/pet`, `display.pet`

가장 기본 흐름은 gallery를 보고, 설치하고, 선택한 뒤 doctor로 확인하는 것입니다.

```bash
hermes pets list
hermes pets list cat
hermes pets install boba --select
hermes pets show
hermes pets doctor
```

세션 안에서는 slash command로도 다룰 수 있습니다.

```bash
/pet
/pet list
/pet boba
/pet scale 0.5
/pet off
```

설정 파일에서는 다음 형태로 저장됩니다.

```yaml
display:
  pet:
    enabled: true
    slug: "boba"
    render_mode: auto
    scale: 0.33
    unicode_cols: 0
```

`render_mode: auto`는 kitty, Ghostty, WezTerm, iTerm2, sixel 같은 그래픽 지원 터미널을 먼저 감지하고, 없으면 truecolor Unicode half-block 렌더링으로 내려갑니다. pipe나 redirect처럼 TTY가 아닌 환경에서는 terminal pet 렌더링을 끄는 것이 정상 동작입니다.

Pet은 Hermes 내부의 activity state에 맞춰 움직입니다. tool 실행 중이면 `run`, 모델이 읽거나 생각하는 동안은 `review`, 완료 후에는 `wave`, 실패하면 `failed`, todo가 전부 끝난 순간에는 `jump`처럼 매핑됩니다. 즉 “예쁜 고양이”가 아니라 현재 turn의 상태를 눈으로 확인하는 작은 계기판에 가깝습니다.

## 짧은 실제 사용 사이드바

이 사용자의 셋업처럼 profile과 topic이 분리된 운영에서는 화면 표지가 생각보다 중요합니다. Dev, PKM, Ops가 각자 다른 역할을 맡을 때 pet은 권한이나 행동을 바꾸지는 않지만, “지금 어느 surface가 움직이고 있는지”를 빠르게 알아차리는 보조 신호가 됩니다. 특히 긴 tool 실행이나 gateway turn을 기다릴 때 작은 상태 변화만으로도 불필요한 중복 입력을 줄일 수 있습니다.

## 주의할 점과 팁

첫째, pet은 설치와 선택이 모두 끝나야 보입니다. `hermes pets doctor`가 `no pets installed` 또는 `enabled: false`를 말한다면 먼저 `hermes pets install <slug> --select`를 실행합니다.

둘째, Petdex npm CLI와 Hermes Pets의 저장 위치를 혼동하지 않아야 합니다. 일반 Petdex CLI는 다른 앱의 pet 폴더를 쓸 수 있지만, Hermes는 profile-aware한 Hermes home 아래의 `pets/`를 기준으로 합니다.

셋째, desktop app의 floating pet은 편의 기능이지 별도 agent가 아닙니다. pop-out overlay가 보이더라도 별도 gateway 연결이나 독립 권한이 생기는 것은 아니며, 표시와 입력 shortcut을 제공하는 UI 레이어입니다.

넷째, 글꼴·터미널·원격 shell 환경에 따라 렌더링 품질이 다릅니다. 이미지 프로토콜이 없는 터미널에서는 Unicode fallback이 정상이고, 너무 작게 줄이면 half-block 표현은 뭉개질 수 있습니다. 이때는 `hermes pets scale 0.5`처럼 크기를 조정하거나 `render_mode: off`로 terminal pet만 끄면 됩니다.

## 언제 쓰면 좋나

Pets는 작업 능력을 늘리는 기능이 아닙니다. Tools, Cron, Kanban, Delegation처럼 에이전트가 할 수 있는 일을 확장하지도 않습니다. 대신 Hermes를 오래 켜 두고 쓰는 사람에게 turn 상태, 실패, 완료, 대기 상태를 낮은 마찰로 보여 줍니다. 기능적으로는 `/status`나 로그를 볼 수 있지만, 매번 명령을 치지 않고도 에이전트의 움직임을 감지하고 싶을 때 Pets가 가장 가볍습니다.
