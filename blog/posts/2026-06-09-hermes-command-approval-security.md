---
type: article
title: "Hermes의 승인 레이어는 자동화가 선을 넘기 전에 멈춘다"
aliases:
  - "hermes-command-approval-security"
author:
  - "[[Deck]]"
date created: 2026-06-09
date modified: 2026-06-09
tags: [hermes, ai-agent, workflow, security]
description: "A feature guide to Hermes Agent's dangerous-command approval, YOLO mode, hard blocklist, gateway authorization, and Tirith scanning. It explains how to keep agent automation useful without removing safety boundaries."
thumbnail: images/hermes-command-approval-security-cover.png
status: completed
series: hermes-notes
---

# Hermes의 승인 레이어는 자동화가 선을 넘기 전에 멈춘다

![Abstract safety layers for Hermes command approval](images/hermes-command-approval-security-cover.png)

Hermes Agent가 강력해지는 지점은 `terminal`, `file`, `browser`, `computer_use` 같은 도구를 실제 작업 환경에 연결할 때다. 동시에 위험도 여기서 생긴다. 에이전트가 파일을 지우거나, 시스템 서비스를 멈추거나, 원격 스크립트를 실행할 수 있다면 “잘 대답하는 모델”보다 “실행 전에 멈출 수 있는 구조”가 더 중요해진다. Hermes의 보안·승인 레이어는 바로 이 문제를 다룬다.

## 기능 개요: 승인, 차단, 격리의 세 층

Hermes의 Security 기능은 하나의 스위치가 아니라 여러 방어층이다. 메시징 Gateway에서는 누가 봇과 대화할 수 있는지 allowlist와 pairing으로 걸러낸다. 터미널 실행 전에는 위험한 명령 패턴을 감지해 사용자 승인을 요구한다. Docker, Singularity, Modal, Daytona 같은 backend에서는 컨테이너 자체를 격리 경계로 본다. MCP 하위 프로세스와 context file도 별도 필터링·스캔 대상이 된다.

가장 자주 만나는 부분은 dangerous command approval이다. Hermes는 `rm -r`, `DROP TABLE`, `curl | sh`, `/etc/` 덮어쓰기, 시스템 서비스 중지, fork bomb, 강제 프로세스 종료 같은 패턴을 실행 전에 잡는다. 감지되면 CLI에서는 `once`, `session`, `always`, `deny` 중 하나를 고르고, Gateway에서는 승인/거절 응답을 기다린다. 기본 방향은 fail-closed다. 응답이 없으면 실행하지 않는다.

## 어떻게 작동하는가

승인 정책은 `~/.hermes/config.yaml`의 `approvals` 섹션에서 조정한다.

```yaml
approvals:
  mode: manual      # manual | smart | off
  timeout: 60
  cron_mode: deny   # deny | approve
  mcp_reload_confirm: true
  destructive_slash_confirm: true
```

`manual`은 위험 패턴마다 사용자에게 묻는 기본 모드다. `smart`는 보조 모델이 저위험 오탐을 자동 판단하고 애매한 경우만 사용자에게 넘긴다. `off`는 `--yolo`와 비슷하게 승인 확인을 건너뛰므로, 신뢰 가능한 CI나 버려도 되는 환경이 아니면 신중해야 한다.

세션 단위로 빠르게 전환할 때는 다음처럼 실행한다.

```bash
hermes --yolo
```

또는 대화 중에 `/yolo`를 사용한다. Hermes는 YOLO 상태일 때 배너와 status bar로 계속 표시한다. 다만 `--yolo`도 모든 것을 허용하지는 않는다. `rm -rf /`, fork bomb, live disk format, root filesystem을 향한 원격 스크립트 실행처럼 복구 불가능한 hardline blocklist는 승인 모드와 무관하게 거부된다.

항상 허용한 패턴은 `command_allowlist`로 남는다.

```yaml
command_allowlist:
  - rm
  - systemctl
```

이 목록은 편리하지만 오래 남는다. 반복 자동화가 끝난 뒤에는 `hermes config edit`로 다시 검토하는 편이 안전하다. 메시징 환경에서는 `hermes pairing list`, `hermes pairing approve <platform> <code>`로 접근 권한을 관리하고, `security.tirith_enabled: true`를 통해 Tirith 기반 명령 스캔을 켤 수 있다.

## 짧은 실제 사용 사례

이 사용자의 운영에서는 Dev 프로파일이 로컬 빌드, 블로그 발행, 이미지 생성, Git 커밋처럼 side effect가 큰 작업을 자주 맡는다. 그래서 cron 작업은 headless 실행 중 위험 명령이 나오면 자동 승인하지 않고, 우회 가능한 안전한 경로를 찾거나 실패 로그를 남기는 쪽이 더 낫다. 프로파일 분리는 역할과 기억을 나누는 장치이지 파일 시스템 보안 샌드박스가 아니므로, 승인 레이어와 toolset 제한을 함께 써야 한다.

## Pitfalls / tips

첫째, `approvals.mode: off`를 “전문가 모드”처럼 상시 켜 두지 않는다. 승인 피로를 줄이려다 자동화 전체가 무제한 실행 권한을 갖게 된다. 둘째, Cron에서는 `cron_mode: deny`를 기본으로 두고, 정말 검증된 작업만 별도 환경에서 승인한다. 셋째, 컨테이너 backend에서는 위험 명령 검사가 생략될 수 있으므로 컨테이너의 mount, 권한, 네트워크 범위가 실제 안전 경계가 된다. 넷째, Tirith가 없는 플랫폼에서는 pattern guard가 계속 작동하지만 content-level 분석은 빠질 수 있다. macOS와 Linux는 prebuilt binary가 있고, Windows는 WSL 실행이 더 현실적이다.

이 기능은 자동화를 느리게 만들기 위한 장치가 아니다. 오히려 Hermes에게 더 많은 일을 맡기기 위한 브레이크다. 반복 실행은 Cron이나 Kanban으로 보내고, 강한 도구는 필요한 profile과 toolset에만 열며, 파괴적 명령은 approval layer 뒤에 둔다. Hermes를 작업 동료처럼 쓰려면 모델의 능력만큼 실행 경계도 설계해야 한다.
