---
type: article
title: "Hermes가 손에 쥔 도구들: Toolsets로 에이전트 능력을 켜고 끄는 법"
aliases:
  - Hermes Tools and Toolsets
author:
  - "[[육대근]]"
date created: 2026-05-17
date modified: 2026-05-17
tags:
  - hermes
  - ai-agent
  - workflow
  - tools
description: A practical guide to Hermes Agent's built-in toolsets — what tools are available, how to enable or disable them per platform, how terminal backends work, and when to reach for the Tool Gateway instead of individual API keys.
thumbnail: images/hermes-tools-and-toolsets-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-tools-and-toolsets-cover.png)

에이전트가 실제로 무언가를 **할 수** 있으려면 모델의 사고 회로만으로는 부족하다. Hermes Agent가 웹을 검색하고, 파일을 고치고, 코드를 실행하고, 이미지를 생성하는 것은 모두 **Tools** 덕분이다. 그리고 그 도구들은 각 플랫폼(CLI, Telegram, Discord)마다 켜거나 끌 수 있는 **Toolsets** 단위로 묶여 있다. 이번 글에서는 어떤 도구들이 있고, 어떻게 제어하며, 터미널 백엔드와 Tool Gateway까지 실제로 어떻게 쓰는지 살핀다.

## 개념 — Tool과 Toolset의 차이

**Tool**은 에이전트가 한 번의 호출로 실행할 수 있는 개별 함수다. `web_search`, `terminal`, `image_generate`, `delegate_task` 같은 것들이다. 에이전트가 대화 중에 "지금 이게 필요하다"고 판단하면 직접 호출한다.

**Toolset**은 비슷한 목적의 도구를 묶은 그룹 이름이다. 예를 들어 `web` toolset을 활성화하면 `web_search`와 `web_extract`가 함께 켜진다. Toolset 단위로 켜고 끌 수 있다는 것이 핵심이다 — Telegram 채널에는 터미널 실행을 막고 CLI에만 열어 두는 식으로 플랫폼별 격리가 가능하다.

## 내장 도구 전체 범위

Hermes는 설치 직후부터 다음 카테고리의 도구를 내장하고 있다.

| 카테고리 | 대표 도구 | 역할 |
|---|---|---|
| **Web** | `web_search`, `web_extract` | 검색 및 페이지 본문 추출 |
| **Terminal & Files** | `terminal`, `process`, `read_file`, `patch` | 명령 실행·파일 편집 |
| **Browser** | `browser_navigate`, `browser_snapshot`, `browser_vision` | 실제 브라우저 자동화 |
| **Media** | `vision_analyze`, `image_generate`, `text_to_speech` | 멀티모달 분석·생성 |
| **Agent 오케스트레이션** | `todo`, `clarify`, `execute_code`, `delegate_task` | 계획·코드 실행·서브에이전트 위임 |
| **Memory & recall** | `memory`, `session_search` | 영속 기억·과거 세션 검색 |
| **자동화 & 전달** | `cronjob`, `send_message` | 스케줄 작업·플랫폼 메시지 발송 |
| **통합** | `ha_*`, MCP 서버 도구, `rl_*` | Home Assistant·MCP·RL 훈련 |

`video_generate`와 `video_analyze`는 기본 비활성이다. 필요할 때 `hermes tools` 또는 `--toolsets` 플래그로 추가한다.

## 도구 확인과 조작 — 실제 명령

```bash
# 현재 플랫폼(CLI)의 전체 도구 상태 확인
hermes tools list

# 인터랙티브 UI로 플랫폼별 활성화/비활성화
hermes tools

# 세션 중 특정 toolset만 켜고 실행
hermes chat --toolsets "web,terminal"

# 단일 toolset 활성화
hermes tools enable image_gen

# 단일 toolset 비활성화
hermes tools disable video_gen
```

`hermes tools list`는 `✓ enabled` / `✗ disabled`로 toolset 상태를 플랫폼별로 보여 준다. 같은 Hermes 설치에서 CLI, Telegram, Discord가 각각 다른 toolset 조합을 가질 수 있다.

주요 toolset 이름은 다음과 같다:
`web`, `terminal`, `file`, `browser`, `vision`, `image_gen`, `tts`, `todo`, `memory`, `session_search`, `cronjob`, `delegation`, `code_execution`, `clarify`, `homeassistant`, `messaging`, `computer_use`

플랫폼 프리셋(`hermes-cli`, `hermes-telegram`)과 동적 MCP toolset(`mcp-<server>`)은 Toolsets Reference에서 전체 목록을 확인할 수 있다.

## 터미널 백엔드 — 어디서 명령을 실행하나

`terminal` 도구는 단순히 로컬 쉘만 실행할 수 있는 게 아니다. **백엔드**를 교체하면 같은 `terminal` 호출이 Docker 컨테이너, 원격 SSH 서버, 클라우드 샌드박스에서 실행된다.

| 백엔드 | 설명 | 대표 사용처 |
|---|---|---|
| `local` | 로컬 머신 실행 (기본값) | 개발·신뢰 작업 |
| `docker` | 격리된 컨테이너 | 보안·재현성 |
| `ssh` | 원격 서버 | 에이전트가 자신의 코드를 건드리지 못하게 격리 |
| `singularity` | HPC 컨테이너 | 클러스터 컴퓨팅 |
| `modal` | 서버리스 클라우드 | 대규모·일회성 실행 |
| `daytona` | 클라우드 워크스페이스 | 원격 개발 환경 |
| `vercel_sandbox` | Vercel 클라우드 microVM | 스냅샷 기반 파일 영속성 |

백엔드는 `~/.hermes/config.yaml`로 설정한다.

```yaml
# ~/.hermes/config.yaml
terminal:
  backend: local       # docker / ssh / singularity / modal / daytona / vercel_sandbox
  timeout: 180         # 명령 타임아웃 (초)
```

### Docker 백엔드의 동작 방식

Docker를 쓰면 Hermes는 처음 실행 시 단일 장수명 컨테이너를 시작하고, 이후의 모든 `terminal`, `read_file`, `execute_code` 호출을 `docker exec`로 그 컨테이너에 라우팅한다. `/workspace` 안의 파일, pip 설치, 환경 변수 변경이 세션 내내 유지된다. 컨테이너는 Hermes 종료 시 함께 멈춘다.

```yaml
terminal:
  backend: docker
  docker_image: python:3.11-slim
```

SSH 백엔드는 보안이 중요할 때 유용하다. 에이전트가 원격 서버에서 실행되므로 자신의 설치 파일을 수정할 수 없다.

```bash
# ~/.hermes/.env
TERMINAL_SSH_HOST=my-server.example.com
TERMINAL_SSH_USER=myuser
TERMINAL_SSH_KEY=~/.ssh/id_rsa
```

## Tool Gateway — API 키 없이 핵심 도구 쓰기

Nous Portal 유료 구독자는 **Tool Gateway**를 통해 웹 검색, 이미지 생성, TTS, 브라우저 자동화를 별도 API 키 없이 사용할 수 있다. 개별 OpenAI/Anthropic/Google 키를 각각 발급받아 설정할 필요가 없다는 뜻이다.

```bash
# Tool Gateway 활성화 (Nous Portal 구독 필요)
hermes model
```

`hermes tools`에서도 개별 도구를 Tool Gateway로 연결할 수 있다. 로컬 API 키가 없을 때 빠른 시작 경로로 유용하다.

## 실제 운영 사이드바

이 사용 환경에서는 CLI 프로파일에 `web`, `browser`, `terminal`, `file`, `image_gen`, `tts`, `memory`, `session_search`, `delegation`, `code_execution`, `cronjob`, `computer_use`, `skills`가 활성화되어 있다. `video_gen`, `x_search`, `homeassistant`, `spotify`는 비활성 상태다. PKM, Dev, Ops 세 프로파일이 각각 다른 toolset 조합을 쓰는 구조 — Dev 프로파일에서는 `terminal`과 `delegation`이 핵심이고, PKM 프로파일은 `file`·`memory` 중심으로 설정되어 있다. Telegram 채널에서는 `terminal`과 `computer_use`가 비활성화되어 있어 원격 실행 위험을 차단한다.

## 함정과 팁

- **`hermes tools list`와 `--toolsets` 차이**: `tools list`는 저장된 영속 설정을 보여 준다. `--toolsets` 플래그는 그 세션에만 적용되는 임시 오버라이드다.
- **MCP 서버는 별도 등록**: MCP로 연결한 외부 서버의 도구는 `hermes tools list`에 `MCP servers:` 섹션으로 따로 나타난다. `hermes tools enable mcp-<server>` 명령으로 플랫폼별 on/off가 가능하다.
- **Toolsets Reference 확인 경로**: 공식 문서의 Toolsets Reference 페이지에 전체 toolset 이름과 플랫폼 프리셋이 나와 있다. `hermes tools list` 출력의 이름과 1:1 대응된다.
- **Docker 백엔드 첫 실행**: `docker pull` 시간이 필요하다. 첫 `hermes chat` 명령 실행 후 잠시 대기해야 컨테이너가 준비된다.
- **비활성 도구를 호출하면**: 에이전트가 비활성 도구를 시도하면 오류를 받고 멈춘다. 대화 중에 갑자기 도구가 필요해지면 `hermes tools enable <toolset>`을 새 터미널에서 실행하고 재시작한다.

## 언제 Tools 설정에 손대야 하나

대부분의 경우 기본 설정으로 충분하다. 손댈 필요가 생기는 순간은 두 가지다.

첫째, **보안 격리**가 필요할 때. Telegram 채널이나 공유 환경에서는 `terminal`, `computer_use` 같은 강력한 도구를 비활성화해 두는 것이 안전하다.

둘째, **자원 최적화**가 필요할 때. 이미지 생성을 전혀 쓰지 않는 프로파일이라면 `image_gen`을 꺼 두면 에이전트가 불필요하게 해당 도구를 고려하는 비용이 줄어든다.

반대로 Docker/SSH 백엔드나 Tool Gateway는 본격적으로 Hermes를 격리 환경에서 운영하거나 API 키 관리를 단순화하고 싶을 때 고려한다. 다음 편에서는 이 Tools 위에서 작동하는 **Kanban 보드** — 도구 호출이 아니라 카드 단위로 에이전트에게 일을 시키는 방식을 다룬다.
