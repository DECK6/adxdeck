---
type: article
title: "Hermes Skills — 에이전트에게 절차 기억을 주입하는 법"
aliases:
  - Hermes Skills System
author:
  - "[[육대근]]"
date created: 2026-05-12
date modified: 2026-05-12
tags:
  - hermes
  - ai-agent
  - workflow
  - skills
description: A practical guide to the Hermes Agent Skills system — what skills are, how auto-discovery and skill_view work, how to author and patch them with skill_manage, and when to reach for a skill instead of a memory entry or a one-off prompt.
thumbnail: images/hermes-skills-system-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-skills-system-cover.png)

LLM 에이전트에게 가장 흔히 결핍된 것은 지식이 아니라 **절차 기억**이다. 모델은 영리하지만 "이 작업은 이런 순서로, 이 명령으로, 이 함정을 피하면서 한다"를 매번 새로 발명한다. Hermes Agent의 Skills 시스템은 이 절차 기억을 외부 파일로 빼내고, 매 턴마다 후보를 자동으로 노출시키는 장치다.

## 개념 — Skill은 무엇인가

Hermes에서 Skill은 한마디로 **재사용 가능한 작업 절차 문서**다. 단순한 메모(Memory)와 구별되는 핵심은 세 가지다.

- **트리거 가능**: 이름과 description으로 작업 유형이 매칭되면 모델이 직접 로드한다.
- **자체 충족**: SKILL.md 안에 사전 조건, 단계, 명령어, 검증, 함정이 다 들어 있다.
- **확장 가능**: 같은 디렉토리 아래 `references/`, `templates/`, `scripts/`로 부가 자산을 붙일 수 있다.

기본 위치는 두 군데다. 사용자가 직접 작성한 스킬은 `~/.hermes/skills/<category>/<name>/SKILL.md`에 들어가고, 플러그인이나 공식 번들 스킬은 별도 위치에서 제공된다. 카테고리는 강제가 아니라 정리용 디렉토리이며, 같은 카테고리 안의 여러 스킬은 `apple`, `mlops/training`처럼 슬래시로 묶일 수 있다.

각 스킬의 SKILL.md는 두 부분으로 구성된다.

```markdown
---
name: my-skill
description: One-line trigger phrase. Use when the task is X.
---

# Body
- 전제 조건
- 단계 1, 2, 3 (실제 명령 포함)
- 검증
- 함정
```

YAML frontmatter의 `name`과 `description`은 단순한 메타데이터가 아니라 **라우팅 단서**다. 모델은 매 턴마다 등록된 스킬 목록을 보고, description이 현재 작업과 관련 있어 보이면 본문을 로드한다. 그래서 description은 "이 스킬이 무엇을 하는지"가 아니라 "**언제** 이 스킬을 써야 하는지"로 써야 한다.

## 자동 발견과 로드 — 어떻게 동작하나

설정 파일(`~/.hermes/config.yaml`)에서 스킬 디렉토리가 활성화되어 있으면, 에이전트 세션 시작 시 다음이 일어난다.

1. 등록된 디렉토리를 스캔해 SKILL.md를 모두 모은다.
2. 각 스킬의 `name` + `description`을 추려 시스템 프롬프트의 `<available_skills>` 블록에 주입한다.
3. 본문은 로드하지 않는다. 모델이 필요하다고 판단하면 `skill_view(name=...)`로 명시적으로 가져온다.

이 lazy-load 구조 덕분에 수십 개의 스킬을 등록해도 컨텍스트 비용은 description 수준에 머문다. 카테고리/플러그인이 정리된 환경에서는 보통 한 줄짜리 요약이 카테고리 그룹 아래 정렬되어 보인다.

CLI 측에서 상태를 확인할 때 자주 쓰는 명령은 다음과 같다.

```bash
# 등록된 스킬 한눈에 보기 (대화 내 도구로도 동일하게 노출)
hermes skills list

# 특정 스킬 본문을 터미널에서 확인
hermes skills view dexa-blog-publish

# 디렉토리/메타데이터 점검
hermes skills validate
```

대화 컨텍스트 안에서는 같은 동작을 도구로도 부른다. `skills_list`로 목록을, `skill_view(name="...")`로 본문을, `skill_view(name="...", file_path="references/foo.md")`로 부속 파일을 가져온다. 후자는 거대한 스킬을 모듈화할 때 핵심이다 — 메인 SKILL.md는 항상 짧게 유지하고, 사례별 디테일은 `references/날짜-주제.md`로 떼어 두면 본 절차는 가벼운데 사례 기억은 무한히 누적된다.

## skill_manage — 만들고, 고치고, 합치고

스킬은 코드와 마찬가지로 살아 있는 문서다. Hermes는 `skill_manage` 툴을 통해 다음을 지원한다.

- `create` — 새 SKILL.md 작성. category 옵션으로 디렉토리 그룹을 지정한다.
- `patch` — `old_string` / `new_string` 기반 부분 수정. 일상적인 함정·명령어 갱신은 거의 다 이 모드.
- `edit` — 전체 본문을 통째로 다시 쓰는 모드. 큰 구조 변경에만 쓴다.
- `write_file` / `remove_file` — `references/`, `templates/`, `scripts/`, `assets/` 아래 부속 파일을 관리.
- `delete` — 스킬을 폐기. 다른 스킬에 흡수시킬 때는 `absorbed_into="<umbrella>"`를 명시해서 단순 폐기와 통합을 구분한다.

권장 워크플로는 단순하다.

1. 어려운 작업이 끝났다 → "이걸 다음에 또 만나면 어떻게 풀까?"를 묻는다.
2. 그 답이 5단계 이상이거나, 명령어/경로/함정을 동반하면 `create`로 새 스킬.
3. 기존 스킬을 따라하다 누락이나 오류를 발견하면 즉시 `patch`. 미루지 않는다.
4. 같은 영역의 스킬이 늘어나 트리거가 겹치기 시작하면 우산(umbrella) 스킬로 합치고, 흡수된 스킬은 `delete(absorbed_into=...)`로 정리.

## 실제 운영 사이드바

본 환경에서는 카테고리가 명시적으로 갈려 있다. PKM/note-taking 계열은 옵시디언 볼트 운영 절차, mlops 계열은 학습·추론·평가 도구별 사용법, devops 계열은 칸반과 webhook, github 계열은 PR/리뷰 워크플로를 담는다. 카테고리별 스킬 수가 한 자리에서 두 자리로 늘어나는 순간이 우산 스킬을 만들 신호다 — 옵시디언 PKM 운영도 처음에는 4~5개의 분산 스킬이었다가 한 개의 큰 SKILL.md + 수십 개의 `references/날짜-사례.md` 구조로 합쳐졌고, 이후 매일의 cron 실행이 그 references 디렉토리에 한 줄씩 사례를 추가해 가는 식으로 운영된다.

## 함정 — 자주 부딪히는 것들

- **description을 정의로 쓰는 실수.** "X에 대한 스킬"이라고 쓰면 모델이 트리거하지 못한다. "Use when Y" 패턴으로 명령형 트리거를 써야 한다.
- **본문에 너무 많이 욱여넣기.** SKILL.md가 200줄을 넘기 시작하면 본문은 절차만 남기고 사례·실패담은 `references/`로 옮긴다. 컨텍스트 비용과 가독성 둘 다 좋아진다.
- **메모리와 혼동.** 사용자 선호·환경 사실은 `memory` 도구, 절차·워크플로는 `skill_manage`. 절차를 메모리에 적으면 매 턴 재주입되어 비용만 늘고 갱신도 어렵다.
- **수정 안 하는 스킬.** 따라하다 오류를 만났는데 패치하지 않으면 다음 세션의 자신이 같은 실수를 반복한다. 스킬은 유지보수가 빠지는 순간 부채로 변한다.
- **삭제 시 흡수 경로 누락.** `absorbed_into`를 비워둔 채 삭제하면 cron이나 다른 자동화가 사라진 스킬 이름을 계속 참조한다. 우산이 있다면 명시, 단순 폐기라면 빈 문자열을 명시.

## 언제 스킬을 만들지 말아야 하나

스킬은 절차가 **반복**되고 **비용이 들 때** 빛난다. 한 번만 할 작업, 단일 도구 호출로 끝나는 작업, 매번 컨텍스트가 다르게 바뀌어 일반화가 어려운 작업은 스킬이 아니라 그 자리의 프롬프트로 푸는 게 맞다. 스킬은 "다음에 비슷한 상황이 오면 이 문서를 다시 열겠다"고 확신이 들 때 만든다.

반대로 절차가 손에 익었는데도 매번 같은 명령을 검색해 찾고, 같은 함정에 또 빠지고 있다면 — 그 순간이 `skill_manage(action="create")`의 가장 좋은 신호다.
