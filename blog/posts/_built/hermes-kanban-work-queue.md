---
type: article
title: Hermes Kanban은 대화를 작업 보드로 바꾼다
aliases:
  - "Hermes Kanban Work Queue"
author:
  - "[[Deck]]"
date created: 2026-05-20
date modified: 2026-05-20
tags:
  - hermes
  - ai-agent
  - workflow
  - kanban
description: "A feature guide to Hermes Agent Kanban, the durable task board for coordinating multi-profile workers, dependencies, retries, and recovery."
thumbnail: images/hermes-kanban-work-queue-cover.png
status: completed
series: hermes-notes
---

# Hermes Kanban은 대화를 작업 보드로 바꾼다

![Abstract Kanban work queue cover](images/hermes-kanban-work-queue-cover.png)

채팅형 에이전트에게 일을 맡기면 가장 먼저 부딪히는 한계가 있다. 한 번의 대화 안에서 끝나지 않는 일, 여러 역할이 나누어 처리해야 하는 일, 실패한 작업을 나중에 다시 회수해야 하는 일은 대화 기록만으로 관리하기 어렵다. Hermes Kanban은 이 문제를 durable task board로 풀어낸다. 즉, 일을 카드로 만들고, 상태와 담당 프로필과 의존성을 SQLite 보드에 남겨 여러 Hermes worker가 이어받게 하는 기능이다.

## 기능 개요: 보드, 카드, worker

Hermes Kanban의 핵심 단위는 board와 task다. 기본 보드는 Hermes 홈 아래의 Kanban DB에 저장되고, 필요하면 프로젝트별 보드를 따로 만들 수 있다. task에는 제목, 상태, assignee, 우선순위, parent/child 관계, comment, run history가 붙는다. 사람은 `hermes kanban ...` CLI나 dashboard에서 보드를 다루고, dispatcher가 띄운 worker는 `kanban_show`, `kanban_complete`, `kanban_block`, `kanban_heartbeat`, `kanban_comment` 같은 전용 도구로 자기 카드의 상태를 기록한다.

이 점에서 Kanban은 `delegate_task`와 다르다. `delegate_task`는 부모 세션이 기다리는 단기 위임에 가깝다. Kanban은 부모 대화가 끝나도 남는 작업 큐다. 긴 조사, 코드 수정, 검증, 리뷰처럼 단계가 갈라지고 재시도가 필요한 일은 Kanban 쪽이 더 적합하다.

## 어떻게 쓰는가

처음에는 보드를 초기화하고 gateway dispatcher가 돌고 있는지 확인한다.

```bash
hermes kanban init
hermes gateway start
hermes kanban list
```

작업은 assignee 프로필을 지정해 만들 수 있다.

```bash
hermes kanban create "API 변경점 조사" --assignee dev
hermes kanban show <task_id>
hermes kanban runs <task_id>
```

부모 작업이 끝난 뒤 자식 작업이 준비되어야 한다면 dependency를 연결한다.

```bash
hermes kanban link <parent_id> <child_id>
hermes kanban unblock <child_id>
```

반복 cron이나 외부 자동화가 같은 카드를 중복 생성하지 않게 하려면 idempotency key를 붙인다.

```bash
hermes kanban create "nightly ops review" \
  --assignee ops \
  --idempotency-key "nightly-ops-2026-05-20" \
  --json
```

설정은 `~/.hermes/config.yaml`의 `kanban` 섹션에서 조정한다.

```yaml
kanban:
  dispatch_in_gateway: true
  dispatch_interval_seconds: 60
  failure_limit: 2
  dispatch_stale_timeout_seconds: 14400
  worker_log_rotate_bytes: 2097152
```

`dispatch_in_gateway: true`이면 gateway 안의 dispatcher가 주기적으로 ready task를 claim하고 해당 assignee 프로필을 worker로 띄운다. 별도 daemon을 동시에 돌리는 방식은 권장되지 않는다. 두 dispatcher가 같은 보드를 보며 경쟁하면 claim race가 생길 수 있기 때문이다.

## 실제 사용 사이드바

이 사용자의 Hermes 셋업에서는 Dev, PKM, Ops처럼 역할이 다른 프로필이 분리되어 있고, 장기 작업은 대화 하나에 밀어 넣기보다 카드로 쪼개는 방식이 잘 맞는다. 예를 들어 부모 카드가 자료 수집을 끝내면 작성 카드가 ready가 되고, 검증 카드는 그 다음 worker에게 넘어간다. 공개 글에 남길 만한 핵심은 특정 보드명이나 로컬 경로가 아니라 “부모 카드 → 자식 카드 → worker handoff”라는 운영 패턴이다.

## 흔한 함정과 팁

첫째, gateway가 멈춰 있으면 ready task가 있어도 자동 처리되지 않는다. 이때는 `hermes kanban diagnostics`, `hermes kanban watch`, gateway 로그를 함께 본다. 둘째, assignee는 실제 profile 이름이어야 한다. 오타가 있으면 카드가 ready 상태에 머무를 수 있다. 셋째, worker는 일을 끝낼 때 그냥 최종 답변만 남기면 안 된다. `kanban_complete` 또는 `kanban_block`으로 상태를 닫아야 보드가 다음 단계를 판단한다. 넷째, 긴 작업은 heartbeat가 중요하다. heartbeat가 없으면 오래된 claim으로 간주되어 회수 대상이 될 수 있다.

Kanban은 모든 일을 카드로 만들라는 뜻은 아니다. 짧은 질의, 즉석 파일 점검, 부모가 결과를 바로 받아야 하는 하위 작업은 `delegate_task`가 가볍다. 반대로 여러 프로필이 나눠 처리하고, 중간 실패를 기록하며, 다음 날 이어서 회수해야 하는 일이라면 Hermes Kanban을 쓰는 편이 맞다. 대화는 순간의 실행면이고, Kanban은 오래 남는 작업면이다.
