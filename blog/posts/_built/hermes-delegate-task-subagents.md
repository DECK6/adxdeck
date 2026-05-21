---
type: article
title: "Hermes delegate_task는 작업을 작게 떼어 격리한다"
aliases:
  - Hermes delegate task subagents
author:
  - "[[육대근]]"
date created: 2026-05-22
date modified: 2026-05-22
tags:
  - hermes
  - ai-agent
  - workflow
  - delegation
description: A practical guide to Hermes Agent subagent delegation with delegate_task, including context isolation, batch execution, roles, configuration, and verification boundaries.
thumbnail: images/hermes-delegate-task-subagents-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-delegate-task-subagents-cover.png)

Hermes Agent의 `delegate_task`는 에이전트가 자기 안에서 부르는 **격리된 하위 에이전트**다. 하나의 대화가 너무 많은 파일, 검색 결과, 판단 흐름을 끌어안으면 컨텍스트가 흐려진다. 이때 부모 에이전트는 작은 과업을 하위 에이전트에게 맡기고, 최종 요약만 다시 받아 전체 판단을 유지한다.

## 기능 개요 — subagent를 쓰는 이유

`delegate_task`는 Kanban 카드나 cron job처럼 오래 남는 작업 큐가 아니다. 부모 턴 안에서 동기적으로 실행되고, 부모는 자식이 끝날 때까지 기다린다. 하위 에이전트는 새 대화, 별도 터미널 세션, 제한된 toolset을 받고 시작한다. 이전 대화 기록을 자동 공유하지 않기 때문에 `goal`과 `context`에 필요한 배경을 명시해야 한다.

단일 작업은 `goal` 하나로 보내고, 독립적인 조사나 비교는 `tasks` 배열로 병렬 실행한다. 기본 병렬 수는 3개이며 `delegation.max_concurrent_children`로 조정한다. 중간 tool 결과 전체가 부모 컨텍스트로 쏟아지지 않아 코드 리뷰, 병렬 리서치, 큰 refactor 구역 분리에 잘 맞는다.

## 어떻게 작동하나

가장 중요한 입력은 `goal`, `context`, `toolsets`다.
```python
delegate_task(
    goal="Review src/auth for JWT validation issues",
    context="Project: /path/to/app. Files: src/auth/*.py. Run: pytest tests/auth -v.",
    toolsets=["terminal", "file"]
)
```

여러 작업은 이렇게 보낸다.
```python
delegate_task(tasks=[
    {"goal": "Research option A", "context": "Focus on cost and risk", "toolsets": ["web"]},
    {"goal": "Research option B", "context": "Focus on setup and maintenance", "toolsets": ["web"]},
    {"goal": "Compare current code paths", "context": "Project root and target files...", "toolsets": ["terminal", "file"]}
])
```

설정은 `~/.hermes/config.yaml`의 `delegation` 섹션에서 다룬다.

```yaml
delegation:
  max_iterations: 50
  max_concurrent_children: 3
  child_timeout_seconds: 600
  max_spawn_depth: 1
  orchestrator_enabled: true
  model: "google/gemini-3-flash-preview"
  provider: "openrouter"
```

`model`과 `provider`를 지정하면 하위 에이전트만 더 빠르거나 저렴한 모델로 라우팅할 수 있다. 지정하지 않으면 보통 부모 provider 설정을 따른다. 단, 로컬 문서 기준으로 delegation은 부모 provider는 물려받지만 fallback chain 자체를 그대로 쓰지는 않는다. 안정성이 중요하면 delegation용 모델을 별도로 점검한다.

역할도 구분된다. 기본 `leaf`는 다시 위임하지 못하는 worker다. `orchestrator`는 추가 위임을 할 수 있지만, 기본 `max_spawn_depth: 1`에서는 flat 구조로 제한된다. 깊이를 2 이상으로 올리면 병렬 수와 깊이가 곱해져 비용과 부하가 빠르게 커진다.

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 Dev 작업을 맡길 때 repo inspection, 구현, 테스트, 리뷰를 다른 관점으로 나누어 확인하는 패턴이 자주 쓰인다. 다만 하위 에이전트가 “테스트 통과”라고 보고해도 부모가 다시 `git diff`, 빌드 출력, 생성 파일을 확인한다. 위임은 판단을 분산시키지만 검증 책임을 없애지는 않는다.

## Pitfalls / tips

첫째, `context`를 아끼면 실패한다. 하위 에이전트는 “아까 말한 버그”를 모른다. 파일 경로, 에러 메시지, 테스트 명령, 금지사항을 같이 넘겨야 한다.

둘째, durable workflow와 혼동하지 않는다. 부모 턴이 중단되면 자식도 취소될 수 있다. 오래 살아남아야 하는 일은 `cronjob`이나 `terminal(background=True, notify_on_complete=True)`가 더 맞다.

셋째, toolset을 좁게 준다. 웹 조사는 `["web"]`, 코드 작업은 `["terminal", "file"]`처럼 필요한 권한만 주면 사고면이 작아진다. `clarify`, `memory`, `send_message`, 기본 leaf의 `delegate_task`는 막혀 있어 하위 에이전트가 사용자 대화나 공유 메모리 쓰기를 마음대로 수행하지 못한다.

## 언제 delegation 쓰나

`delegate_task`는 “작고 독립적이며 검증 가능한 판단 작업”에 적합하다. 한 번의 파일 읽기나 계산에는 과하고, 장기 운영에는 durable하지 않다. 여러 관점을 빠르게 모으고 부모가 마지막 검증과 합성을 맡아야 할 때, delegation은 대화를 작은 작업장들로 나누는 직접적인 방법이다.
