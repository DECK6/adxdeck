---
type: article
title: "Hermes Slash Commands는 대화를 운영 콘솔로 바꾼다"
aliases:
  - "hermes-slash-command-surfaces"
author:
  - "Deck"
date created: 2026-06-23
date modified: 2026-06-23
tags: [hermes, ai-agent, workflow, slash-commands]
description: "A feature guide to Hermes Agent slash commands across the CLI and messaging gateway, including the central command registry, session controls, admin permissions, and practical usage patterns."
thumbnail: images/hermes-slash-command-surfaces-cover.png
status: completed
series: hermes-notes
---

# Hermes Slash Commands는 대화를 운영 콘솔로 바꾼다

![Hermes slash command surfaces cover](images/hermes-slash-command-surfaces-cover.png)

Hermes Agent를 오래 쓰다 보면 “프롬프트를 다시 설명하는 일”보다 “현재 세션을 어떻게 조작할 것인가”가 더 중요해진다. **Slash Commands**는 그 조작면이다. 대화창 안에서 `/compress`, `/queue`, `/tools`, `/kanban` 같은 명령을 호출해 세션, 도구, 게이트웨이, 작업 보드를 직접 다룬다.

## 기능 개요 — 두 개의 명령 표면, 하나의 레지스트리

공식 문서 기준으로 Hermes의 slash command는 두 표면을 가진다. 하나는 터미널의 interactive CLI이고, 다른 하나는 Telegram·Discord·Slack 같은 messaging gateway다. 둘 다 `hermes_cli/commands.py`의 중앙 `COMMAND_REGISTRY`에서 help text와 메뉴를 끌어온다. 로컬 설치에서 확인한 현재 registry 항목은 75개였다.

명령은 크게 네 부류로 나뉜다. `/new`, `/resume`, `/title`, `/status`는 세션을 다룬다. `/compress`, `/queue`, `/steer`, `/goal`은 대화 흐름과 장기 실행을 조절한다. `/tools`, `/skills`, `/plugins`, `/reload-mcp`는 기능 표면을 다시 읽거나 설정한다. `/kanban`, `/cron`, `/topic`, `/sethome`은 게이트웨이와 장기 운영 시스템을 제어한다.

## 어떻게 작동하고 쓰는가

CLI에서는 Hermes를 켠 뒤 `/`를 입력하면 autocomplete가 열린다. 명령 이름은 대소문자를 가리지 않고, 일부 명령은 alias를 가진다.

```text
/new my-session
/compress here 3
/queue 다음 턴에서 이 파일도 같이 검토해 주세요
/steer 방금 나온 테스트 실패를 우선 반영
/tools list
/status
```

CLI 바깥에서 확인할 때는 일반 shell command와 구분해야 한다. `hermes --help`는 설치된 top-level command를 보여 주고, 대화 안 명령은 slash command reference와 `/help`가 기준이다.

```bash
hermes --help
hermes chat --help
```

게이트웨이에서는 permission 모델이 추가된다. 플랫폼별 `gateway-config.yaml`의 `extra:` 블록에서 관리자와 일반 사용자의 명령 범위를 나눈다.

```yaml
extra:
  allow_admin_from:
    - "<user-id>"
  user_allowed_commands:
    - help
    - whoami
    - status
```

`allow_admin_from`이 설정된 범위에서는 admin이 모든 등록 명령을 보고, regular user는 `user_allowed_commands`와 기본 허용 명령인 `/help`, `/whoami`만 쓴다. 이 설계 덕분에 공개 채널에는 안전한 상태 조회만 열고, 운영자는 같은 봇에서 `/restart`, `/topic`, `/cron` 같은 강한 명령을 다룰 수 있다.

## 실제 운용에서의 짧은 장면

이 사용자의 Hermes 운용은 CLI와 메신저 토픽이 같이 돌아간다. 개발 작업 중에는 `/queue`와 `/steer`가 긴 실행을 끊지 않고 우선순위를 바꾸는 데 쓰이고, 게이트웨이 쪽에서는 `/topic`과 `/sethome`이 토픽별 세션 라우팅을 정리하는 손잡이가 된다. 즉 slash command는 “에이전트에게 다시 설명하기”보다 “현재 런타임을 조작하기”에 가깝다.

## Pitfalls / tips

첫째, slash command와 shell command를 섞지 않는다. `hermes cron list`는 터미널 명령이고, `/cron`은 대화 안 명령이다. 둘째, 도구나 스킬 설정을 바꾼 뒤에는 현재 세션에 바로 반영되지 않을 수 있다. Hermes는 prompt cache를 지키기 위해 많은 설정을 세션 시작 시점에 고정하므로 `/reset`이나 새 실행이 필요하다.

셋째, 게이트웨이에서 명령이 보이지 않으면 모델 문제가 아니라 권한 문제일 수 있다. `/whoami`로 admin/user 상태를 먼저 확인하고, `gateway-config.yaml`의 `allow_admin_from`, `user_allowed_commands`, group용 설정을 본다. 넷째, `/steer`는 프롬프트를 새로 보내는 기능이 아니라 다음 tool call 뒤에 끼워 넣는 mid-run steering이다. 작업을 새로 맡길 때는 `/queue`나 일반 메시지가 더 안전하다.

## 언제 이 기능을 쓰는가

Slash Commands는 Hermes를 단순 챗봇이 아니라 운영 가능한 agent runtime으로 쓸 때 빛난다. 한 번성 질문에는 필요 없지만, 긴 세션을 압축하고, 도구를 점검하고, 메신저 권한을 나누고, 실행 중인 작업을 부드럽게 방향 전환해야 한다면 먼저 `/help`와 `/status`를 열어 현재 조작면을 확인하는 편이 좋다.
