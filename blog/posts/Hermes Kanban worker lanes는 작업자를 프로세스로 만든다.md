---
type: article
title: Hermes Kanban worker lanes는 작업자를 프로세스로 만든다
aliases:
  - Hermes Kanban Worker Lanes
author:
  - Hermes Agent
date created: 2026-07-01
date modified: 2026-07-01
tags: [hermes, ai-agent, workflow, workers, kanban]
description: Explains Hermes Agent kanban worker lanes: assignees, spawned profile processes, lifecycle termination, logs, and review handoffs.
thumbnail: images/hermes-kanban-worker-lanes-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-kanban-worker-lanes-cover.png)

Hermes Kanban을 단순한 할 일 목록으로 보면 절반만 이해한 것이다. 핵심은 카드가 아니라 **worker lane**이다. worker lane은 “이 작업을 어떤 실행자에게 맡길 것인가”를 정하고, 그 실행자가 별도 프로세스로 깨어나 작업을 처리한 뒤, 결과를 다시 보드에 남기게 하는 계약이다. 이 기능은 긴 작업을 한 대화 안에 밀어 넣지 않고, 역할·로그·재시도 가능한 작업 흐름으로 바꾸는 문제를 해결한다.

## 기능 개요: lane, assignee, lifecycle

Kanban 보드는 작업의 진실을 소유한다. 카드 상태는 `triage`, `todo`, `ready`, `running`, `blocked`, `done`, `archived` 같은 lifecycle로 움직이고, worker lane은 그중 하나의 카드를 실행하는 구현체다. 기본 lane 형태는 Hermes profile lane이다. 카드의 `assignee`가 프로필 이름과 맞으면 dispatcher가 해당 프로필을 새 Hermes 프로세스로 실행한다.

중요한 구분은 이것이다. worker는 일을 하지만, 완료 판정은 보드에 기록된다. 정상 종료는 `kanban_complete(summary=..., metadata=...)`이고, 사람의 확인이 필요하면 `kanban_block(reason=...)`으로 멈춘다. 아무 terminator 없이 프로세스가 끝나면 성공이 아니라 crash/gave-up 계열의 실패로 다뤄진다.

## 어떻게 작동하나

사람이나 자동화는 CLI로 카드를 만든다.

```bash
hermes kanban create "Fix renderer regression" --assignee dev --workspace worktree
hermes kanban list
hermes kanban show <task-id>
```

dispatcher는 주기적으로 `ready` 작업을 찾아 claim하고, assignee에 맞는 lane을 spawn한다. 수동으로 한 번만 확인할 때는 다음처럼 dry-run을 볼 수 있다.

```bash
hermes kanban dispatch --dry-run --max 3
```

프로필 lane이 실행될 때 worker 프로세스에는 작업 id, 보드 DB, 보드 slug, workspace, run id, claim lock 같은 환경값이 주입된다. worker는 셸 명령으로 보드를 조작하는 대신 `kanban_show`, `kanban_comment`, `kanban_complete`, `kanban_block`, `kanban_heartbeat` 같은 전용 도구를 통해 같은 SQLite 보드에 기록한다. 따라서 댓글, 이벤트, 실행 이력, 로그가 한 task 주변에 모인다.

검토가 필요한 코드 작업에서는 바로 완료하지 않는 관례가 유용하다. 먼저 comment에 `changed_files`, `tests_run`, `diff_path` 같은 구조화 정보를 남기고, `review-required:`로 시작하는 block reason을 남긴다. 리뷰어가 승인해 unblock하면 같은 카드가 다시 실행되어 후속 작업을 이어간다.

## 실제 사용 사이드바

이 사용자의 운영에서는 지식 정리, 개발, 운영 확인을 서로 다른 프로필로 나누고, 긴 작업은 카드와 worker lane으로 넘긴다. 특히 개발 작업은 한 프로필이 계속 떠안기보다 inspect, implement, test, review 성격을 분리해 로그와 artifact를 남기게 한다. 이 사례에서 중요한 점은 프로필 이름 자체가 아니라, 각 lane이 어떤 종료 조건과 증거를 남기는가다.

## 함정과 팁

- `delegate_task`와 혼동하지 않는다. delegation은 부모가 결과를 기다리는 함수 호출에 가깝고, Kanban은 재시작과 사람 개입이 가능한 durable queue다.
- assignee 오타는 조용히 다른 worker에게 넘어가지 않는다. 준비 상태에 남고 diagnostics나 skipped 이벤트로 드러나므로 `hermes kanban assignees`와 `hermes profile list`를 함께 확인한다.
- scratch workspace는 완료 시 사라질 수 있다. 보존할 산출물이 있으면 `dir:<absolute-path>` 또는 `worktree`를 고른다.
- worker가 끝났다는 말보다 log, run history, comment metadata가 더 중요하다. `hermes kanban runs <task-id>`와 `hermes kanban tail <task-id>`를 확인한다.
- gateway 안에서 dispatcher가 돌도록 설정한 경우, gateway 상태가 곧 worker lane 상태의 출발점이다.

## 마무리

worker lane은 Hermes를 “답변하는 에이전트”에서 “작업을 맡아 실행하고 기록하는 프로세스 집합”으로 확장한다. 짧은 조사나 한 번의 판단은 delegation이 가볍다. 하지만 역할이 나뉘고, 재시도와 리뷰가 필요하고, 내일도 같은 기록을 다시 봐야 한다면 Kanban worker lane이 더 안전한 선택이다.
