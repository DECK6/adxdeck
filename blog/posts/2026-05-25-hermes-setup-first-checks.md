---
type: article
title: "Hermes 설치는 끝이 아니라 첫 진단 루프의 시작이다"
aliases:
  - hermes-setup-first-checks
author:
  - "[[육대근]]"
date created: 2026-05-25
date modified: 2026-05-25
tags:
  - hermes
  - ai-agent
  - workflow
  - setup
description: A practical Hermes Agent setup guide focused on installation paths, first health checks, configuration files, updates, and what to verify before adding advanced features.
thumbnail: images/hermes-setup-first-checks-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-setup-first-checks-cover.png)

Hermes Agent 설치의 목표는 “명령어가 실행된다”에서 끝나지 않는다. 진짜 문제는 첫 대화, provider 인증, 도구 의존성, 업데이트 경로가 서로 맞물려 있는지 확인하는 것이다. 그래서 설치 직후에는 새 기능을 켜기보다, 작은 진단 루프를 먼저 통과시키는 편이 안전하다.

## 기능 개요 — 설치, 설정, 진단, 업데이트

공식 문서 기준 Hermes는 macOS, Linux, WSL2에서는 one-line git installer로 시작할 수 있고, pip 설치와 Windows/Termux 경로도 제공한다. git installer는 `main`을 추적하는 개발 친화 경로이고, pip 설치는 tagged release를 따라가는 안정 경로에 가깝다.

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

설치가 끝나면 `hermes setup`, `hermes model`, `hermes tools`, `hermes gateway setup`이 각각 초기 설정의 입구가 된다. 처음부터 gateway, cron, voice, MCP까지 한꺼번에 켜기보다, 기본 CLI 대화가 성공하는지 먼저 확인하는 것이 핵심이다.

## 어떻게 작동하나

가장 짧은 확인 순서는 버전, 설정 위치, 상태, 진단이다.

```bash
hermes --version
hermes config path
hermes config env-path
hermes status
hermes doctor
```

`hermes --version`은 현재 설치본과 업데이트 가능 여부를 보여준다. `hermes config path`와 `hermes config env-path`는 각각 설정 파일과 비밀값 파일의 위치를 확인한다. 공개 문서에서 설명하는 기본 구조는 `~/.hermes/config.yaml`에 일반 설정을, `~/.hermes/.env`에 API key와 token 같은 secret을 두는 방식이다.

```yaml
# ~/.hermes/config.yaml
model:
  default: anthropic/claude-sonnet-4
terminal:
  backend: local
  timeout: 180
```

`hermes setup`은 전체 wizard이고, 특정 구역만 다시 설정할 수도 있다.

```bash
hermes setup model
hermes setup terminal
hermes setup tools
hermes setup --quick
```

`hermes doctor`는 의존성, 설정, 서비스 상태를 점검한다. 업데이트는 설치 방식에 맞춰 자동 감지된다.

```bash
hermes update --check
hermes update
hermes config check
hermes config migrate
```

특히 git 설치에서는 `hermes update`가 pull, dependency install, config migration, gateway restart까지 이어질 수 있다. 운영 중인 gateway가 있다면 업데이트 전후로 `hermes gateway status`를 함께 보는 편이 좋다.

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 Hermes를 단일 CLI가 아니라 Dev/PKM/Ops처럼 용도별 profile로 나눠 쓴다. 그래서 설치 확인도 “전체가 된다”보다 “해당 profile의 config, env, toolset, gateway가 맞는가”를 보는 방식에 가깝다. 실제로 자동화 작업은 대개 고급 기능 문제가 아니라 오래된 설정, 빠진 의존성, 업데이트 뒤 config migration 누락에서 먼저 막힌다.

## Pitfalls / tips

첫째, `hermes: command not found`는 대개 설치 실패가 아니라 shell reload나 PATH 문제다. 새 터미널을 열거나 `source ~/.bashrc`, `source ~/.zshrc`를 먼저 확인한다.

둘째, API key를 `config.yaml`에 직접 적지 않는 편이 안전하다. `hermes config set OPENROUTER_API_KEY ...`처럼 CLI를 쓰면 secret은 `.env`로, 일반 설정은 `config.yaml`로 나뉜다.

셋째, Windows는 native 지원이 가능하지만 공식 문서상 early beta 성격이 남아 있다. 안정성을 우선하면 WSL2 경로가 여전히 무난하다. macOS나 Linux의 service 계정 설치에서는 browser automation용 Chromium system dependency가 빠질 수 있으므로 `hermes doctor` 결과를 먼저 따른다.

넷째, 업데이트 후 작업 tree가 예기치 않게 dirty라면 그대로 진행하지 않는다. 공식 updating 문서도 `git status --short`, `hermes doctor`, `hermes --version` 순서의 post-update validation을 권한다.

## 언제 이 루프를 쓰나

설치·업데이트 진단 루프는 Hermes의 모든 고급 기능보다 앞에 둔다. 모델 라우팅, Tools, Skills, Cron, Gateway가 이상해 보일 때도 먼저 `version → config path → status → doctor → update check`를 통과시키면 문제 범위가 줄어든다. Hermes를 처음 쓰는 독자에게 이 루프는 입문 절차이고, 오래 쓰는 운영자에게는 장애를 작게 자르는 기본 점검표다.
