---
type: article
title: "Hermes 체크포인트는 에이전트의 파일 변경을 되돌릴 수 있게 만든다"
aliases:
  - hermes-checkpoints-rollback
author:
  - "[[육대근]]"
date created: 2026-05-31
date modified: 2026-05-31
tags:
  - hermes
  - ai-agent
  - workflow
  - checkpoints
description: A practical guide to Hermes Agent checkpoints and rollback, including setup, trigger rules, restore commands, and storage maintenance.
thumbnail: images/hermes-checkpoints-rollback-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-checkpoints-rollback-cover.png)

Hermes Agent의 체크포인트는 “에이전트가 파일을 고치다가 망치면 어떻게 하지?”라는 불안을 줄이는 안전장치다. Git 커밋을 대신하는 기능은 아니지만, `write_file`, `patch`, 위험한 shell 명령 직전에 작업 디렉터리의 상태를 별도 shadow store에 저장해 두고 `/rollback`으로 되돌릴 수 있게 만든다.

## 기능 개요

체크포인트는 Hermes v2 기준 opt-in 기능이다. 대부분의 대화에는 필요 없고, 저장소 비용도 있기 때문에 기본값은 꺼져 있다. 대신 코드 수정, 대량 리팩터링, 생성 파일 정리, 자동화 스크립트 실험처럼 “되돌릴 수 있어야 마음 놓고 맡길 수 있는” 작업에서 켜는 방식이 적합하다.

핵심 용어는 세 가지다. **checkpoint**는 특정 턴 직전의 파일 상태이고, **shadow store**는 실제 프로젝트의 `.git`과 분리된 `~/.hermes/checkpoints/store/` 내부 Git 저장소이며, **rollback**은 저장된 checkpoint를 현재 작업 디렉터리에 복원하는 명령이다. 실제 프로젝트 Git history는 건드리지 않는다.

## 어떻게 작동하나

세션 단위로 켜려면 CLI에서 `--checkpoints`를 붙인다.

```bash
hermes chat --checkpoints
```

프로파일 전체에서 항상 켜려면 `~/.hermes/config.yaml` 또는 profile별 `config.yaml`에 설정한다.

```yaml
checkpoints:
  enabled: true
  max_snapshots: 50
  max_total_size_mb: 500
  max_file_size_mb: 10
  auto_prune: true
  retention_days: 7
  delete_orphans: true
  min_interval_hours: 24
```

공식 문서 기준 checkpoint는 `write_file`, `patch` 같은 파일 도구와 `rm`, `mv`, `cp`, `sed -i`, `truncate`, output redirect, `git reset/clean/checkout`처럼 파괴적일 수 있는 terminal 명령 전에 만들어진다. 단, 한 대화 턴에서 같은 디렉터리에 대해 무한히 쌓지 않도록 “directory당 turn당 최대 1회”만 저장한다.

복원은 대화 중 slash command로 한다.

```text
/rollback
/rollback diff 1
/rollback 1
/rollback 1 src/broken_file.py
```

`/rollback`은 checkpoint 목록과 변경 통계를 보여준다. `diff`로 현재 상태와의 차이를 먼저 본 뒤, 번호를 지정해 전체를 복원하거나 파일 하나만 복원할 수 있다. 전체 복원 시 Hermes는 현재 상태를 다시 pre-rollback snapshot으로 남기고, 마지막 대화 턴도 되돌려 파일 상태와 agent context가 어긋나지 않게 한다.

저장소 관리는 CLI에서 확인한다.

```bash
hermes checkpoints
hermes checkpoints status --limit 20
hermes checkpoints prune --retention-days 3 --max-size-mb 200
hermes checkpoints clear-legacy
```

현재 로컬 Dev profile도 체크포인트가 켜져 있으며, `hermes checkpoints status`로 shadow store 크기와 project 수, live/orphan 상태를 확인할 수 있었다. 이처럼 운영 중인 profile마다 `~/.hermes/profiles/<name>/checkpoints/` 아래에 별도 store가 생긴다는 점도 기억해야 한다.

## 실제 사용 사이드바

이 사용자의 개발 환경에서는 Dev profile이 코드 변경과 블로그 빌드 같은 기술 작업을 맡고, PKM/운영 작업은 별도 profile로 분리되어 있다. 그래서 체크포인트는 “모든 작업의 보험”이라기보다, Dev가 파일을 직접 쓰는 세션에서 Git branch와 함께 쓰는 두 번째 안전망에 가깝다. 매일 발행 같은 자동화 작업에서도 변경 범위가 명확할 때만 유효하다.

## Pitfalls / tips

첫째, 체크포인트는 Git commit이 아니다. 리뷰 가능한 이력, 협업, 원격 백업은 여전히 프로젝트 Git으로 관리해야 한다. `/rollback`은 에이전트가 만든 최근 파일 변경을 빠르게 되돌리는 로컬 안전망이다.

둘째, 큰 폴더와 큰 파일은 의도적으로 건너뛴다. 공식 구현은 홈 디렉터리나 루트처럼 너무 넓은 범위를 피하고, 파일 수가 많은 디렉터리와 `max_file_size_mb`를 넘는 파일을 제외한다. 데이터셋, 모델 가중치, 대형 미디어를 보호하는 장치다.

셋째, store는 자란다. `auto_prune`을 끄면 수동으로 `hermes checkpoints prune`을 돌려야 한다. 오래된 workdir가 사라진 orphan project와 v1 migration의 `legacy-*` archive도 가끔 확인하는 편이 좋다.

넷째, 되돌리기 전에는 `rollback diff`를 먼저 보자. 번호를 잘못 고르면 필요한 변경까지 되돌릴 수 있다. 병렬 agent를 돌릴 때는 Git worktree와 branch를 나누고, checkpoint는 그 위에 얹는 보조 안전망으로 쓰는 구성이 가장 안전하다.

체크포인트는 “항상 켜야 하는 기본 기능”이 아니라 “파일 변경을 맡길 때의 복구 레이어”다. 단순 질의나 읽기 중심 작업에는 필요 없지만, 에이전트가 직접 쓰고 고치고 정리하는 세션에서는 작은 설정 하나로 작업의 심리적 비용을 크게 낮춘다.
