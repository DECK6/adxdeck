---
type: article
track: ai-ax
title: "도구 실행 전에 멈추고, LLM 호출 전에 맥락을 넣는 Hermes Shell Hooks"
aliases:
  - "Hermes Shell Hooks Consent Guardrails"
author:
  - "Deck"
date created: 2026-07-25
date modified: 2026-07-25
tags:
  - hermes
  - ai-agent
  - workflow
  - hooks
description: "Hermes Shell Hooks attach reviewed scripts to agent lifecycle events without requiring a Python plugin. This guide covers the JSON protocol, consent model, blocking and context injection, and the checks to run before enabling hooks in unattended sessions."
thumbnail: images/hermes-shell-hooks-consent-guardrails-cover.png
status: completed
series: hermes-notes
---

# 도구 실행 전에 멈추고, LLM 호출 전에 맥락을 넣는 Hermes Shell Hooks

![Hermes Shell Hooks cover](images/hermes-shell-hooks-consent-guardrails-cover.png)

에이전트가 파일을 쓰거나 셸 명령을 실행하기 직전, 조직 규칙을 기계적으로 확인하고 싶을 때가 있다. 매번 프롬프트에 주의를 적는 방식은 쉽게 빠진다. Hermes Shell Hooks는 에이전트의 실행 지점에 검토한 스크립트를 연결해 이 문제를 다룬다.

## 훅 세 종류 가운데 Shell Hooks의 자리

Hermes에는 Gateway hook, Plugin hook, Shell hook이 있다. Gateway hook은 메시징 게이트웨이의 세션과 명령 이벤트를 듣는다. Plugin hook은 Python 플러그인 안에서 등록한다. Shell Hooks는 활성 `HERMES_HOME`의 `config.yaml`에 실행 파일을 적는 방식이다. 기본 프로파일 경로는 `~/.hermes/config.yaml`이며, 이름 있는 프로파일은 `hermes config path`로 실제 설정 파일부터 확인해야 한다. Bash, Python, Go 바이너리처럼 표준 입력과 출력을 다룰 수 있는 프로그램이면 연결할 수 있고 CLI와 Gateway 양쪽에서 작동한다.

주요 이벤트는 `pre_tool_call`, `post_tool_call`, `pre_llm_call`, `subagent_stop` 등이다. `pre_tool_call`은 특정 도구 호출을 막을 수 있다. `pre_llm_call`은 현재 사용자 메시지에 임시 맥락을 보탠다. 시스템 프롬프트를 수정하거나 대화 기록에 영구 규칙을 쓰는 기능은 아니다.

## 설정과 JSON 통신

기본 프로파일의 스크립트는 관례상 `~/.hermes/agent-hooks/`에 둔다. 이름 있는 프로파일에서는 활성 `HERMES_HOME` 아래에 같은 구조를 두면 경계를 찾기 쉽다. 아래 설정은 `terminal` 호출 직전에 검사 스크립트를 실행한다. 직접 실행하는 파일에는 shebang을 넣고 `chmod +x`로 실행 권한을 줘야 한다. `matcher`는 `pre_tool_call`과 `post_tool_call`에서 도구 이름을 고르는 정규식이다. 제한 시간은 기본 60초이며 최대 300초다.

```yaml
hooks:
  pre_tool_call:
    - matcher: "terminal"
      command: "~/.hermes/agent-hooks/check-terminal.py"
      timeout: 5
```

Hermes는 이벤트마다 JSON 한 건을 스크립트의 stdin으로 보낸다. 여기에는 `hook_event_name`, `tool_name`, `tool_input`, `session_id`, `cwd`, 이벤트별 `extra`가 들어간다. 스크립트가 호출을 거부하려면 stdout으로 다음 JSON을 반환한다.

```json
{"action":"block","message":"이 경로에서는 해당 명령을 실행할 수 없습니다."}
```

`pre_llm_call`에서는 `{"context":"..."}`를 반환해 현재 턴에만 맥락을 넣을 수 있다. 빈 객체는 아무 조치도 하지 않는 응답이다. 잘못된 JSON, 0이 아닌 종료 코드, 시간 초과는 경고로 기록되며 에이전트 루프 자체를 중단시키지는 않는다. 파이프와 리다이렉션이 필요하다면 `command`에 셸 문법을 직접 넣지 말고 별도 스크립트 안에 작성해야 한다.

설정한 뒤에는 합성 payload로 통신 형태부터 확인한다.

```bash
hermes hooks list
hermes hooks test pre_tool_call --for-tool terminal
hermes hooks doctor
```

`list`는 이벤트, matcher, timeout, 동의 상태를 보여 준다. `test`는 일치하는 훅을 시험 입력으로 실제 실행하고, `doctor`도 승인된 스크립트를 실행해 JSON 유효성과 시간을 확인한다. 합성 입력은 샌드박스가 아니다. 두 명령 모두 사용자 권한으로 파일과 네트워크에 접근할 수 있으므로 스크립트를 먼저 읽고, 외부 전송 대상을 테스트용으로 바꾼 뒤 폐기 가능한 작업 디렉터리에서 실행해야 한다. 동의를 취소할 때는 정확한 command 문자열을 넘긴다.

```bash
hermes hooks revoke '~/.hermes/agent-hooks/check-terminal.py'
```

취소 결과는 다음 재시작부터 적용된다.

## 실제 운영에서 잡아야 할 경계

한 다중 프로파일 설치에서는 PKM, Dev, Ops를 대화 토픽과 역할에 따라 나누고, 각 프로파일의 `hooks:` 목록은 기본적으로 비워 둔다. 반복되는 방법은 Skills에 두고 역할별 판단은 Profile 지침에 남긴다. 개발 프로파일에서 특정 경로의 쓰기를 항상 검사하거나, 장시간 작업이 끝날 때 같은 형식의 기록을 남겨야 하는 요구가 생기면 그때 Shell Hook으로 내린다. 도입할 때도 공용 설정에 바로 추가하지 않고 복제한 프로파일과 폐기 가능한 작업 폴더에서 payload, 로그 범위, 실패 동작을 확인한 뒤 대상 프로파일에만 등록한다.

## 처음 켤 때 놓치기 쉬운 점

Shell Hook은 사용자 계정의 전체 권한으로 실행된다. 처음 보는 `(event, command)` 조합은 동의를 요청하고 결과를 활성 `HERMES_HOME`의 `shell-hooks-allowlist.json`에 저장한다. Gateway, Cron, CI처럼 TTY가 없는 프로세스에서는 새 훅이 자동 등록되지 않는다. 이때는 검토한 이벤트와 command 쌍만 allowlist에 수동으로 기록하는 방식이 가장 좁다. `--accept-hooks`와 `HERMES_ACCEPT_HOOKS=1`은 해당 시작 시점에 발견한 미승인 훅을 함께 승인할 수 있고, `hooks_auto_accept: true`는 그 동작을 설정으로 지속한다. 공유 설정이나 무인 실행에서는 전체 `hooks:` 블록을 검토하지 않은 채 이 우회 경로를 켜 두지 않는다.

allowlist는 파일 해시가 아니라 command 문자열을 기준으로 삼는다. 승인 뒤 스크립트 내용이 바뀌어도 동의가 자동 취소되지 않는다. 공유 설정을 가져왔거나 스크립트를 수정했다면 `hermes hooks doctor`를 다시 실행해야 한다. Plugin hook과 함께 쓸 때는 Python 플러그인이 먼저 등록되고, 첫 번째 유효한 차단 응답이 적용된다는 순서도 확인할 필요가 있다.

짧은 후처리나 실행 전 차단처럼 독립된 스크립트 하나로 끝나는 정책에는 Shell Hooks가 알맞다. Python API와 패키징이 필요한 확장은 Plugin을 쓰고, Telegram이나 Slack의 세션 이벤트만 듣는 작업은 Gateway hook으로 두는 편이 경계를 읽기 쉽다.
