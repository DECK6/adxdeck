---
type: article
title: "Hermes Worktree는 병렬 에이전트의 작업 충돌을 디렉터리에서 차단한다"
aliases:
  - Hermes Git Worktree Isolation
author:
  - "Deck"
date created: 2026-07-12
date modified: 2026-07-12
tags:
  - hermes
  - ai-agent
  - workflow
  - git-worktree
description: Hermes Agent can create an isolated Git worktree and branch for each CLI session. This guide explains automatic worktree mode, base synchronization, cleanup behavior, and safe parallel use.
thumbnail: images/hermes-git-worktree-isolation-cover.png
status: completed
series: hermes-notes
---

# Hermes Worktree는 병렬 에이전트의 작업 충돌을 디렉터리에서 차단한다

![Hermes Git worktree isolation cover](images/hermes-git-worktree-isolation-cover.png)

같은 저장소에서 에이전트 둘을 동시에 실행하면 한쪽의 수정·삭제·빌드 산출물이 다른 쪽 작업을 흔들 수 있다. Hermes Agent의 **Worktree mode**는 세션마다 별도 Git branch와 working directory를 자동으로 만들어 이 충돌을 파일시스템 단계에서 막는다. 저장소 전체를 복제하지 않고 Git 객체는 공유하므로, 병렬 작업의 격리 비용도 작다.

## 기능 개요 — 대화가 아니라 checkout을 분리한다

Hermes는 실행한 현재 디렉터리를 프로젝트 루트로 본다. 보통 여러 세션을 같은 checkout에서 열면 index, untracked file, 빌드 캐시를 함께 쓴다. `--worktree` 또는 `-w`를 켜면 Hermes는 저장소 아래 `.worktrees/hermes-<id>`를 만들고 `hermes/hermes-<id>` branch를 checkout한 뒤, 터미널과 파일 도구의 작업 디렉터리를 그곳으로 바꾼다.

각 세션은 독립 branch·index·working tree를 가지지만 원본 저장소의 object database를 공유한다. Checkpoint Manager도 worktree 경로별로 분리되므로 `/rollback` 기록이 다른 세션과 섞이지 않는다. Worktree는 “누가 어느 파일을 고치는가”를 격리하고, checkpoint는 그 격리 공간 안에서 변경을 되돌리는 보조 안전망이다.

## 어떻게 만들고 작동하나

Git 저장소 안에서 플래그 하나로 시작할 수 있다.

```bash
cd /path/to/project
hermes -w

# 한 번의 비대화형 작업에도 적용
hermes -w -z "Fix the failing renderer test"
```

매번 격리하려면 `~/.hermes/config.yaml`에 기본값을 둘 수 있다.

```yaml
worktree: true
worktree_sync: true
```

`worktree_sync: true`가 기본이다. 현재 branch에 upstream이 있으면 이를 fetch해 base로 쓰고, 없으면 원격 기본 branch를 찾는다. 네트워크나 remote 해석이 실패하면 local `HEAD`로 내려간다. 의도적으로 현재 로컬 상태에서 분기해야 할 때만 `false`로 둔다.

Hermes는 `.worktrees/`를 `.gitignore`에 추가하고, 활성 worktree를 현재 프로세스의 PID로 lock한다. 저장소에 있지만 Git이 추적하지 않는 런타임 파일이 꼭 필요하면 루트의 `.worktreeinclude`에 상대경로를 적을 수 있다.

```text
# .worktreeinclude
.local-tooling/
fixtures/runtime-cache/
```

파일은 복사되고 디렉터리는 가능한 환경에서 symlink된다. 저장소 밖으로 나가는 경로는 거부된다. 비밀 키를 편의상 복제하는 목록으로 쓰기보다, 각 실행 환경의 secret source나 안전한 환경변수 주입을 우선하는 편이 낫다.

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 역할이 다른 여러 에이전트가 같은 코드베이스의 구현·테스트·리뷰를 나눠 맡는다. 각 작업을 별도 worktree와 branch에 고정하면 한 worker의 실험 산출물이 다른 worker의 검증을 오염시키지 않고, 최종 반영은 diff와 commit 단위로 모을 수 있다.

## Pitfalls / tips

첫째, `-w`는 Git 저장소 안에서만 작동하며 최소 한 번의 commit이 필요하다. 원본 checkout의 미추적 파일과 미커밋 변경은 새 worktree에 자동으로 나타나지 않는다.

둘째, **작업을 commit하기 전에 세션을 끝내지 않는다.** 정상 종료 시 Hermes는 remote 어디에도 없는 commit이 있으면 worktree를 보존하지만, uncommitted·staged·untracked 변경만 남은 worktree는 산출물로 보고 강제 정리할 수 있다. 중요한 결과는 commit하고, 장기 보존이 필요하면 push한다.

셋째, Worktree mode는 durable queue가 아니다. 한두 개의 병렬 CLI 세션을 빠르게 격리할 때 적합하다. 재시작·의존성·담당자·감사 로그가 필요한 장기 작업은 Kanban workspace를 쓰고, 짧은 하위 문제만 떼어 결과를 기다릴 때는 `delegate_task`를 쓴다.

## 닫기

한 세션만 읽기 중심으로 쓴다면 기본 checkout이 가장 단순하다. 여러 에이전트가 같은 저장소를 동시에 수정하거나 위험한 리팩터를 시험한다면 `hermes -w`가 첫 번째 안전 장치다. Branch로 작업의 소유권을 나누고, checkpoint로 세션 내부 복구를 맡기며, Kanban은 오래 살아남아야 하는 작업 흐름에 사용하는 구성이 경계를 가장 선명하게 만든다.
