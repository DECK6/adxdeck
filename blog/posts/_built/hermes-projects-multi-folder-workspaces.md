---
type: article
title: "Hermes Projects는 여러 저장소를 하나의 작업 단위로 묶는다"
aliases:
  - "Hermes Projects Multi Folder Workspaces"
author:
  - "Deck"
date created: 2026-07-16
date modified: 2026-07-16
tags:
  - hermes
  - ai-agent
  - workflow
  - projects
description: Hermes Projects turns multiple folders and repositories into one named workspace. This guide explains primary folders, Desktop session grouping, per-profile state, and Kanban bindings.
thumbnail: images/hermes-projects-multi-folder-workspaces-cover.png
status: completed
series: hermes-notes
---

# Hermes Projects는 여러 저장소를 하나의 작업 단위로 묶는다

![Hermes Projects multi-folder workspace cover](images/hermes-projects-multi-folder-workspaces-cover.png)

하나의 제품이 앱 저장소, 문서 폴더, 에셋 디렉터리로 흩어지면 `cd`만으로는 “이 폴더들이 같은 일”이라는 사실을 남길 수 없다. Hermes Agent의 **Projects**는 여러 폴더와 저장소를 사람이 읽을 수 있는 이름 아래 묶고, 세션과 작업 보드가 공유할 기준점을 만든다.

## 기능 개요 — 폴더 목록보다 오래 사는 작업 경계

Project는 이름과 안정적인 slug, 하나 이상의 folder, 대표 위치인 primary folder, 선택적인 Kanban board 연결을 가진다. 활성 상태와 archive 상태도 별도로 기록된다. 단순 즐겨찾기가 아니라 Desktop의 세션 그룹과 작업 위치를 결정하는 명시적 workspace 객체다.

Hermes는 세션의 현재 작업 디렉터리가 어느 Project folder 아래에 있는지 비교해 Desktop 목록을 묶는다. 여러 경로가 겹치면 더 구체적인 경로가 우선한다. GUI에서 Project를 전환하면 현재 채팅의 workspace도 primary folder로 이동한다. 반면 터미널에서 실행한 일회성 `cd`는 Project를 만들거나 바꾸지 않는다.

상태는 profile마다 `$HERMES_HOME/projects.db`에 저장된다. 따라서 같은 컴퓨터라도 profile A와 profile B의 Project 목록은 독립적이다. 별도의 `config.yaml` 키는 필요하지 않으며, CLI와 Desktop이 이 작은 SQLite 저장소를 함께 사용한다.

## 어떻게 만들고 운영하는가

두 폴더를 하나의 Project로 만들고 앱 저장소를 primary로 지정해 보자.

```bash
hermes project create "Aurora Demo" \
  ~/work/aurora-app ~/work/aurora-docs \
  --slug aurora-demo \
  --primary ~/work/aurora-app \
  --use
```

생성 뒤에는 slug나 ID로 조회한다. `list`의 별표는 현재 active Project를 뜻한다.

```bash
hermes project list
hermes project show aurora-demo
hermes project add-folder aurora-demo ~/work/aurora-assets --label assets
hermes project set-primary aurora-demo ~/work/aurora-app
hermes project use aurora-demo
```

Project에 board를 연결하면 project-linked Kanban task가 primary 저장소를 기준으로 예측 가능한 worktree와 branch 규칙을 사용할 수 있다. Project와 board의 데이터베이스가 합쳐지는 것은 아니다.

```bash
hermes project bind-board aurora-demo delivery
hermes project archive aurora-demo
hermes project restore aurora-demo
```

Archive는 삭제가 아니라 복구 가능한 숨김이다. 연결을 해제하려면 board 인자를 빼고 `hermes project bind-board aurora-demo`를 실행한다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 공개 웹앱과 원고 폴더가 서로 다른 위치에 있지만, 빌드와 검증은 하나의 결과물로 이어진다. 두 위치를 한 Project로 묶고 앱 저장소를 primary로 두면 Desktop의 관련 세션을 같은 경계에서 찾고, 검증 작업도 동일한 저장소 기준으로 배치할 수 있다. 역할이 다른 profile들은 각자 Project 상태를 유지한다.

## Pitfalls / tips

- **Profile과 혼동하지 않는다.** Profile은 모델·도구·기억·설정을 격리하고, Project는 그 안에서 폴더와 작업 맥락을 묶는다.
- **Kanban이나 Worktree의 대체물이 아니다.** Kanban은 durable task와 dependency를 관리하고, Git worktree는 브랜치 파일을 격리한다. Project는 둘이 참조할 workspace 기준점이다.
- **폴더를 먼저 확인한다.** 잘못된 경로도 문자열로 등록될 수 있으므로 `hermes project show`로 primary와 folder 목록을 검토한다.
- **기존 task가 자동 이동한다고 가정하지 않는다.** board binding 이후에도 task가 Project에 연결되었는지 확인해야 한다.
- **`projects.db`를 직접 편집하지 않는다.** 이름 변경, 폴더 제거, archive와 restore는 `hermes project` 명령으로 처리한다.

폴더 하나에서 끝나는 짧은 작업은 셸의 현재 디렉터리만으로 충분하다. 여러 저장소와 문서, 반복 세션, Kanban 실행이 하나의 제품 경계를 공유해야 할 때 Projects를 쓰면 “어디서 일하는가”를 매번 다시 설명하지 않아도 된다.
