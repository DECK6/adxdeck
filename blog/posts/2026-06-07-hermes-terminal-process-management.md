---
type: article
title: "Hermes Terminal은 명령 실행보다 프로세스 운영에 가깝다"
aliases:
  - "Hermes Terminal Process Management"
author:
  - "[[Deck]]"
date created: 2026-06-07
date modified: 2026-06-07
tags:
  - hermes
  - ai-agent
  - workflow
  - terminal
  - process-management
description: "A feature guide to Hermes Agent Terminal and Process tools: foreground commands, background jobs, PTY sessions, and safe operational habits."
thumbnail: images/hermes-terminal-process-management-cover.png
status: completed
series: hermes-notes
---

# Hermes Terminal은 명령 실행보다 프로세스 운영에 가깝다

![Abstract cover for Hermes Terminal Process Management](images/hermes-terminal-process-management-cover.png)

Hermes Agent의 `terminal`은 단순히 셸 명령을 대신 치는 기능이 아니다. 빌드, 테스트, 서버, 대화형 CLI처럼 시간이 걸리고 상태가 남는 작업을 에이전트가 붙잡고 운영하게 해 주는 실행 계층이다. 핵심 문제는 “명령을 실행할 수 있는가”가 아니라, 실행 뒤 로그·종료·입력·중단을 어떻게 안전하게 관리하느냐다.

## 기능 개요: terminal과 process는 한 쌍이다

Hermes의 `terminal` toolset에는 두 도구가 들어 있다. `terminal`은 명령을 시작하고, `process`는 `background=true`로 시작된 작업을 관리한다. 공식 도구 레퍼런스는 이 toolset을 “Shell command execution and background process management”로 설명한다. 즉 짧은 명령은 foreground로 끝내고, 오래 걸리는 명령은 추적 가능한 세션으로 분리하는 구조다.

또 하나의 중요한 경계는 파일 도구와의 역할 분담이다. 파일 읽기에는 `read_file`, 검색에는 `search_files`, 수정에는 `patch`나 `write_file`이 더 안전하다. `terminal`은 패키지 설치, 테스트 실행, Git, 서버 구동, 운영체제 상태 확인, PTY가 필요한 CLI처럼 셸 자체가 필요한 일에 쓰는 편이 좋다.

## 어떻게 작동하고 설정하는가

짧은 확인은 foreground 실행이 기본이다.

```python
terminal(command="python -m pytest tests/unit -q", workdir="/path/to/project", timeout=300)
```

반대로 서버, watcher, 긴 빌드는 background로 시작한다. 이때 반환되는 `session_id`가 이후 관리의 기준점이다.

```python
terminal(command="npm run dev", workdir="/path/to/app", background=true)
# => {"session_id": "proc_abc123", "pid": 12345}

process(action="poll", session_id="proc_abc123")
process(action="log", session_id="proc_abc123")
process(action="wait", session_id="proc_abc123", timeout=60)
process(action="kill", session_id="proc_abc123")
```

상호작용이 필요한 프로그램에는 `pty=true`를 붙인다. Codex, Claude Code, Python REPL, 일부 인증 CLI처럼 터미널 제어 문자가 필요한 도구가 여기에 속한다.

```python
terminal(command="python", pty=true)
process(action="submit", session_id="proc_abc123", data="print('ok')")
```

기본 설정은 `~/.hermes/config.yaml`의 `terminal` 섹션에서 조정한다.

```yaml
terminal:
  backend: local      # local, docker, modal, ssh 등
  cwd: /path/to/workspace
  timeout: 180
  persistent_shell: true
  shell_init_files: []
```

컨테이너 백엔드를 쓰면 CPU·메모리·디스크와 지속성도 설정할 수 있다. `container_persistent: true`이면 설치한 패키지와 작업 파일이 다음 세션에도 남는다. Docker 환경 변수 전달은 `terminal.docker_forward_env`로 명시하지만, 컨테이너 안 명령에 노출되는 값이므로 필요한 것만 넘겨야 한다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 개발 프로파일의 `terminal` toolset이 활성화되어 있고, backend는 `local`, 기본 작업 디렉터리는 개발 워크스페이스로 잡혀 있다. 블로그 발행 같은 자동화에서도 이미지 생성 뒤 정적 사이트 빌드, Git 상태 확인, publish script 실행은 `terminal`이 담당하고, 산출물 검증 로그는 `process`나 일반 foreground 실행으로 회수한다.

## Pitfalls / tips

첫째, background 작업에는 `notify_on_complete=true`를 붙이는 습관이 좋다. 테스트나 빌드처럼 언젠가 끝나는 긴 작업은 완료 알림을 받아야 한다. 반대로 개발 서버나 watcher처럼 끝나지 않는 프로세스는 background로 띄운 뒤 health check나 로그 신호로 readiness를 확인한다.

둘째, `nohup`, 셸의 `&`, `disown`으로 Hermes 바깥에 프로세스를 숨기지 않는다. 그렇게 시작하면 에이전트가 `process(action="kill")`, `log`, `poll`로 관리하기 어렵다. Hermes가 추적해야 하는 작업은 `terminal(background=true)`로 시작해야 한다.

셋째, blind sleep을 피한다. 서버를 띄운 뒤 “10초 기다리기”보다 로그에서 startup 문구를 확인하거나 실제 HTTP health check를 실행하는 편이 재현성이 높다.

넷째, 대화형 명령을 일반 terminal로 실행하면 멈춘 것처럼 보일 수 있다. 입력을 기다리는 CLI, TUI, REPL에는 `pty=true`와 `process(action="submit"|"write")`를 사용한다.

## 마무리: 언제 terminal을 고를까

Hermes에서 `terminal`은 셸이 필요한 작업의 운영 레이어다. 파일을 읽고 고치는 일은 file 도구, 여러 도구 호출을 Python 안에서 줄이는 일은 Code Execution, 반복 예약은 Cron, 병렬 하위 작업은 Delegation이 더 적합하다. 하지만 빌드·테스트·서버·Git·패키지 설치·대화형 CLI처럼 실제 프로세스가 중심인 순간에는 `terminal`과 `process`가 가장 직접적이고 검증 가능한 선택이다.
