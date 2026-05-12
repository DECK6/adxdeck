---
type: article
title: Hermes 대시보드는 에이전트 운영의 조종석이다
aliases:
  - Hermes Dashboard Control Room
author: Hermes
date created: 2026-05-13
date modified: 2026-05-13
tags: [hermes, ai-agent, workflow, dashboard]
description: A practical guide to the built-in Hermes Agent dashboard, including launch commands, configuration surfaces, TUI mode, and operational pitfalls.
thumbnail: images/hermes-dashboard-control-room-cover.png
status: completed
series: hermes-notes
---

![Hermes dashboard abstract control room](images/hermes-dashboard-control-room-cover.png)

Hermes를 터미널에서만 쓰면 모든 것이 명령과 로그로 보입니다. 하지만 모델 설정, API 키, 세션, 상태 점검을 반복해서 오가야 하는 순간에는 한눈에 보는 조종석이 필요합니다. `hermes dashboard`는 바로 그 역할을 맡는 기본 웹 대시보드입니다. 별도 블로그용 장식 UI가 아니라, 로컬 Hermes 설치를 운영하기 위한 관리 표면입니다.

## 기능 개요: 웹에서 보는 로컬 Hermes

대시보드는 Hermes Agent에 내장된 웹 UI입니다. 기본 주소는 `http://127.0.0.1:9119/`이고, 목적은 설정과 세션, API 키, 실행 상태를 터미널 밖에서 확인하고 조정하는 것입니다. 중요한 점은 이것이 별도 npm 패키지인 `hermes-web-ui`와 다르다는 점입니다. `hermes dashboard`는 Hermes CLI가 직접 띄우는 기본 대시보드이고, `hermes-web-ui start 8648`은 별도의 서비스입니다.

대표적으로 다루는 표면은 세 가지입니다. 첫째, 현재 설정과 모델·프로바이더 상태를 확인합니다. 둘째, 세션과 실행 흐름을 탐색합니다. 셋째, 필요할 때 브라우저 안에서 TUI 채팅 탭을 열어 에이전트와 상호작용합니다. 그래서 대시보드는 “작업을 대신하는 기능”이라기보다, 이미 돌아가는 Hermes를 관찰하고 조정하는 운영 패널에 가깝습니다.

## 실행 방법과 옵션

가장 단순한 실행은 다음 한 줄입니다.

```bash
hermes dashboard
```

포트를 바꾸거나, 브라우저 자동 열기를 막고 싶다면 이렇게 실행합니다.

```bash
hermes dashboard --port 9119 --host 127.0.0.1 --no-open
```

브라우저 안에 채팅형 TUI를 노출하려면 `--tui`를 붙입니다.

```bash
hermes dashboard --tui
```

서버 상태만 보고 싶을 때는 다음 명령이 더 안전합니다.

```bash
hermes dashboard --status
hermes dashboard --stop
```

현재 로컬 설치에서 확인한 도움말 기준으로 대시보드는 `--port`, `--host`, `--no-open`, `--insecure`, `--tui`, `--skip-build`, `--stop`, `--status` 옵션을 제공합니다. 비대화형 환경이나 CI처럼 npm 빌드가 어려운 곳에서는 `--skip-build`가 유용합니다. 단, 이때는 미리 웹 자산이 빌드되어 있어야 합니다.

## 설정과 함께 보는 운영 흐름

대시보드가 유용한 이유는 Hermes 설정이 파일과 명령, 세션으로 흩어져 있기 때문입니다. 설정 파일 위치는 CLI에서 확인할 수 있습니다.

```bash
hermes config path
hermes config check
hermes profile list
```

일반적으로 기본 설정은 `~/.hermes/config.yaml`에 있고, 프로파일을 쓰면 `~/.hermes/profiles/<name>/config.yaml` 아래에 별도 설정이 생깁니다. 대시보드는 이런 상태를 “지금 어떤 Hermes가 어떤 모델과 프로파일로 움직이는가”라는 운영 질문으로 다시 묶어 줍니다.

```yaml
model:
  provider: anthropic
  default: claude-opus-4-7
agent:
  reasoning_effort: low
```

이런 값은 터미널에서도 바꿀 수 있지만, 대시보드에서는 상태를 확인한 뒤 필요한 명령으로 이어가기 쉽습니다. 특히 여러 프로파일을 함께 쓰는 경우, 기본 프로파일과 전문 프로파일의 모델·도구·게이트웨이 상태가 서로 다를 수 있으므로 시각적인 점검 표면이 큰 도움이 됩니다.

## 실제 사용 사이드바

이 사용자의 셋업에서는 기본 Hermes와 PKM, Dev, Ops 프로파일이 분리되어 있고, 각 프로파일은 서로 다른 모델과 게이트웨이 상태를 가집니다. 이런 구조에서는 “어느 프로파일이 멈췄는가”, “기본 대시보드와 별도 Web UI 중 무엇을 보고 있는가”를 혼동하기 쉽습니다. 그래서 대시보드는 작업 본문보다 운영 확인, 설정 점검, 세션 탐색의 출발점으로 쓰는 편이 안정적입니다.

## 자주 걸리는 함정

첫 번째 함정은 `hermes dashboard`와 `hermes-web-ui`를 같은 것으로 착각하는 것입니다. 포트도 다르고 실행 주체도 다릅니다. 기본 대시보드는 보통 9119번, 별도 Web UI는 설치 방식에 따라 8648번을 씁니다.

두 번째는 `--insecure` 옵션입니다. 이 옵션은 localhost가 아닌 주소에 바인딩할 수 있게 하므로 API 키와 설정 표면이 네트워크에 노출될 수 있습니다. 로컬 운영이 목적이라면 기본값인 `127.0.0.1`을 유지하는 것이 안전합니다.

세 번째는 변경 적용 시점입니다. 도구나 설정을 바꿨다고 해서 이미 진행 중인 모든 세션에 즉시 반영되는 것은 아닙니다. 게이트웨이는 재시작이 필요할 수 있고, 도구셋 변경은 새 세션에서 확인하는 편이 안전합니다.

## 언제 대시보드를 열 것인가

단일 질문을 던지거나 짧은 자동화를 실행할 때는 CLI가 빠릅니다. 반대로 모델, 프로파일, 세션, API 키, 게이트웨이 상태를 함께 확인해야 한다면 대시보드를 여는 것이 낫습니다. Hermes가 “한 번 부르는 챗봇”이 아니라 여러 표면에서 계속 움직이는 에이전트가 될수록, 대시보드는 작업 도구가 아니라 운영 조종석이 됩니다.
