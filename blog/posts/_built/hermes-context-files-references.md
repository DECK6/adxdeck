---
type: article
title: "Hermes는 프로젝트의 규칙을 대화 전에 읽는다"
aliases:
  - "hermes-context-files-references"
author:
  - "[[Deck]]"
date created: 2026-06-12
date modified: 2026-06-12
tags: [hermes, ai-agent, workflow, context]
description: "A feature guide to Hermes Agent context files and context references. It explains how project instructions, AGENTS.md, SOUL.md, and @file-style references shape each run without turning every prompt into a giant paste."
thumbnail: images/hermes-context-files-references-cover.png
status: completed
series: hermes-notes
---

# Hermes는 프로젝트의 규칙을 대화 전에 읽는다

![Abstract context routing diagram for Hermes](images/hermes-context-files-references-cover.png)

좋은 에이전트 작업은 “무엇을 하라”만으로 충분하지 않다. 어느 저장소의 규칙을 따라야 하는지, 어떤 파일을 건드리면 안 되는지, 어떤 말투와 검증 기준을 유지해야 하는지가 함께 들어가야 한다. Hermes Agent의 Context Files와 Context References는 이 문제를 두 층으로 나눠 해결한다. 반복되는 운영 규칙은 자동으로 읽고, 그때그때 필요한 파일·diff·URL은 사용자가 `@`로 붙인다.

## 기능 개요: 자동 규칙과 명시적 첨부

Context Files는 세션 시작 또는 파일 접근 시 Hermes가 자동으로 발견하는 지침 파일이다. 지원 파일은 `.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.cursor/rules/*.mdc`, 그리고 전역 `SOUL.md`다. 프로젝트 지침은 우선순위에 따라 하나만 로드되고, `SOUL.md`는 `$HERMES_HOME/SOUL.md`에서 별도로 읽힌다.

Context References는 사용자가 메시지 안에 직접 넣는 `@` 문법이다. `@file:src/main.py`, `@file:src/main.py:10-25`, `@folder:src`, `@diff`, `@staged`, `@git:5`, `@url:https://...`처럼 현재 질문에 필요한 자료를 inline context로 확장한다. 자동 규칙은 “항상 따라야 할 배경”, `@` 참조는 “이번 턴에 꼭 봐야 할 증거”에 가깝다.

## 어떻게 작동하는가

프로젝트 루트에 `AGENTS.md`를 두면 Hermes는 작업 디렉터리에서 시작해 git root 기준으로 문맥 파일을 찾는다.

```markdown
# Project Context

## Commands
- Build with `npm run build`.
- Run tests with `pytest tests -q`.

## Rules
- Do not edit generated migrations directly.
- Keep public examples free of secrets and private paths.
```

우선순위는 대략 다음과 같다.

```text
.hermes.md / HERMES.md → AGENTS.md → CLAUDE.md → .cursorrules
SOUL.md → always from $HERMES_HOME
```

세션 중 하위 폴더의 파일을 읽으면 Hermes는 그 경로의 부모 디렉터리들을 확인해 nested `AGENTS.md`, `CLAUDE.md`, `.cursorrules`도 한 번씩 발견한다. 그래서 monorepo에서는 `frontend/AGENTS.md`, `backend/AGENTS.md`처럼 영역별 규칙을 둘 수 있다. 단, startup prompt를 매번 크게 만들지 않기 위해 하위 규칙은 해당 경로가 실제로 도구 호출에 등장했을 때 주입된다.

반대로 사용자가 한 번만 특정 자료를 붙이고 싶을 때는 CLI에서 이렇게 쓴다.

```text
Review @diff and compare it with @file:README.md:1-80
Summarize @url:https://hermes-agent.nousresearch.com/docs/user-guide/features/context-references
```

Hermes는 확장된 내용을 `--- Attached Context ---` 아래에 붙인다. `hermes chat --help` 기준으로 단발 질문에는 `-q`, 이미지에는 `--image`, toolset에는 `-t`를 쓸 수 있지만, `@file` 자동완성은 주로 interactive CLI 기능이다. Telegram이나 Discord 같은 메시징 Gateway에서는 같은 문법이 그대로 전달될 수 있으므로, 그때는 에이전트가 `read_file`, `web_extract` 같은 도구로 다시 확인하게 하는 편이 안전하다.

## 짧은 실제 사용 사례

이 사용자의 셋업에서는 Dev, PKM, Ops처럼 역할이 나뉜 프로파일이 각자 다른 작업 규칙을 갖는다. 개발 저장소에서는 repo-local 지침을 먼저 보고, 블로그 발행 cron은 별도 발행 규칙과 금지 주제를 확인한 뒤 움직인다. 이 구조 덕분에 매번 긴 운영 규칙을 다시 붙이지 않아도, 실행 전에 “이 작업장에서의 기준”을 먼저 읽게 된다.

## Pitfalls / tips

첫째, `AGENTS.md`를 백과사전처럼 길게 만들지 않는다. 공식 구현은 큰 파일을 잘라 넣을 수 있고, 너무 긴 규칙은 prompt cache와 판단 품질을 동시에 해친다. 둘째, 민감 파일을 `@file`로 붙이려 하지 않는다. SSH 키, shell profile, Hermes `.env`, 일부 credential directory는 차단된다. 셋째, `@folder`는 파일 내용 전체가 아니라 tree와 metadata를 주는 도구다. 코드 검토에는 `@file`의 line range가 더 정확하다. 넷째, 첨부 context는 압축될 때 요약될 수 있다. 장기적으로 보존해야 하는 결정은 문서나 이슈에 남기고, 대화 context를 원본 저장소로 착각하지 않는다.

Context Files는 저장소의 헌법이고, Context References는 그날의 증거 묶음이다. 반복 규칙은 파일로 두고, 순간적인 판단 자료는 `@`로 좁게 붙일 때 Hermes는 덜 추측하고 더 정확히 실행한다. 모든 것을 prompt에 복사하는 방식보다, 필요한 규칙과 필요한 증거를 분리하는 편이 오래가는 에이전트 운영 방식이다.
