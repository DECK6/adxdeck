---
type: article
title: "Hermes Skill Bundles는 반복 작업의 준비 단계를 하나의 명령으로 접는다"
aliases:
  - hermes-skill-bundles
author:
  - "Deck"
date created: 2026-07-09
date modified: 2026-07-09
tags: [hermes, ai-agent, workflow, skills]
description: "A practical guide to Hermes Agent Skill Bundles: grouping multiple skills into one slash command for recurring workflows without mutating the system prompt."
thumbnail: images/hermes-skill-bundles-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-skill-bundles-cover.png)

Hermes의 Skill은 “이 일을 할 때 따라야 하는 절차”를 필요할 때 불러오는 장치다. **Skill Bundles**는 그 절차가 항상 여러 개 함께 필요할 때 쓰는 얇은 묶음이다. 매번 `/skill-a`, `/skill-b`, `/skill-c`를 따로 부르는 대신, 하나의 slash command로 필요한 스킬들을 한꺼번에 로드한다.

## 기능 개요 — 스킬 여러 개를 하나의 작업 프로필로

공식 문서 기준으로 bundle은 작은 YAML 파일이다. 이름, 설명, 스킬 목록, 선택적 instruction을 갖고, 실행 시 `/<bundle-name>` 명령으로 노출된다. 예를 들어 backend 작업에서 코드 리뷰, TDD, PR 워크플로우를 항상 함께 쓴다면 다음처럼 만든다.

```bash
hermes bundles create backend-dev \
  --skill github-code-review \
  --skill test-driven-development \
  --skill github-pr-workflow \
  -d "Backend feature work — review, test, PR workflow"
```

그 다음 CLI, TUI, Dashboard chat, Telegram·Discord·Slack 같은 Gateway 표면에서 같은 방식으로 호출한다.

```text
/backend-dev refactor the auth middleware
```

Hermes는 bundle에 들어 있는 스킬들을 한 번에 로드하고, slash command 뒤에 붙인 문장을 사용자 지시로 함께 전달한다. 중요한 점은 bundle이 스킬을 새로 설치하지 않는다는 것이다. 이미 설치되어 발견 가능한 스킬을 묶는 별칭에 가깝다.

## 어떻게 작동하나

로컬 설치본 `Hermes Agent v0.18.2`에서는 다음 표면이 확인된다.

```bash
hermes bundles list
hermes bundles show backend-dev
hermes bundles create research
hermes bundles delete backend-dev
hermes bundles reload
```

문서상 bundle 파일은 `~/.hermes/skill-bundles/<slug>.yaml` 아래에 있으며, profile을 쓰는 설치에서는 해당 profile의 `skill-bundles/` 디렉터리에 저장된다. 구조는 단순하다.

```yaml
name: backend-dev
description: Backend feature work — review, test, PR workflow.
skills:
  - github-code-review
  - test-driven-development
  - github-pr-workflow
instruction: |
  Always start by writing failing tests, then implement.
```

`skills`는 필수이며 비어 있으면 안 된다. `instruction`은 bundle 전체에 덧붙일 짧은 운영 규칙이다. 예를 들어 “검증 명령을 먼저 제안하고, 성공 로그를 보고할 것”처럼 여러 스킬을 함께 쓸 때의 팀 규칙을 넣을 수 있다.

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 글 발행, Obsidian 정리, 개발 검증처럼 매번 같은 계열의 스킬이 함께 필요한 일이 반복된다. 이런 경우 bundle은 개인 사건을 기록하는 도구가 아니라, “작업 시작 전에 어떤 절차 기억을 불러올지”를 줄이는 인터페이스다. 특히 Gateway에서 짧은 명령으로 긴 준비 맥락을 불러올 수 있다는 점이 실무적이다.

## Pitfalls / tips

첫째, bundle 이름이 기존 skill slug와 충돌하면 bundle이 우선한다. 의도한 override가 아니라면 너무 일반적인 이름, 예를 들어 `research` 같은 이름은 조심한다.

둘째, bundle에 적힌 skill이 없으면 전체가 실패하지 않고 해당 skill만 skip된다. 편리하지만 조용한 품질 저하가 될 수 있으므로 `hermes bundles show <name>`과 `/bundles`로 실제 로드 목록을 확인한다.

셋째, bundle은 system prompt를 바꾸지 않는다. 호출 시점에 fresh user message처럼 스킬 내용을 붙이므로 prompt cache를 깨지 않는 설계다. 반대로 모든 세션에 항상 필요한 원칙이라면 bundle보다 profile, config, 또는 기본 skill 설정이 더 알맞다.

마지막으로 team-wide bundle을 공유할 때는 YAML만 공유한다고 끝나지 않는다. 각 환경에 필요한 skills가 설치되어 있어야 하며, 비밀값이나 로컬 경로는 bundle instruction에 넣지 않는다.

## 언제 쓰면 좋은가

Skill Bundles는 “자주 반복되지만 항상 켜 둘 필요는 없는 작업 프로필”에 맞다. 단일 절차라면 일반 skill 하나면 충분하고, 장기적으로 에이전트 성격 자체를 바꾸려면 profile이 낫다. 여러 절차 기억을 그때그때 하나의 명령으로 조립하고 싶을 때, bundle이 가장 가벼운 선택지다.
