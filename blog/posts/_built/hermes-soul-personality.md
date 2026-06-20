---
type: article
title: "Hermes의 말투는 SOUL.md에서 시작된다"
aliases:
  - "hermes-soul-personality"
author:
  - "Deck"
date created: 2026-06-21
date modified: 2026-06-21
tags: [hermes, ai-agent, workflow, personality]
description: "A feature guide to Hermes Agent personality control with SOUL.md, session personality overlays, and the boundary between durable identity and project rules."
thumbnail: images/hermes-soul-personality-cover.png
status: completed
series: hermes-notes
---

# Hermes의 말투는 SOUL.md에서 시작된다

![Hermes personality cover](images/hermes-soul-personality-cover.png)

에이전트를 오래 쓰다 보면 모델 성능보다 먼저 신경 쓰이는 것이 있다. 매번 같은 일을 맡기는데도 답변 톤, 직접성, 설명 길이가 흔들리면 사용자는 다시 지시문을 붙여야 한다. **Hermes의 Personality / SOUL.md 기능**은 이 반복을 줄이기 위해 “이 에이전트가 어떤 목소리로 말하는가”를 별도 설정으로 분리한다.

## 기능 개요 — SOUL.md, /personality, skin은 다르다

공식 문서에서 `SOUL.md`는 Hermes 인스턴스의 **primary identity**다. 세션이 시작될 때 `HERMES_HOME` 아래의 `SOUL.md`를 읽고, 보안 스캔과 길이 제한을 거친 뒤 시스템 프롬프트의 첫 번째 정체성 슬롯에 넣는다. 파일이 없거나 비어 있으면 Hermes는 내장 기본 정체성으로 돌아간다.

`/personality`는 이와 다르다. `concise`, `technical`, `teacher`, `creative` 같은 프리셋을 세션 단위로 덧씌우는 임시 모드다. 기본 목소리는 `SOUL.md`가 잡고, 특정 대화에서만 선생님·리뷰어·짧은 답변 모드로 바꾸고 싶을 때 `/personality`를 쓴다. 또 `display.skin`이나 `/skin`은 CLI의 색, 배너, 스피너를 바꾸는 시각 테마일 뿐 말투를 바꾸지는 않는다.

## 어떻게 설정하고 쓰는가

가장 기본 위치는 다음과 같다.

```text
~/.hermes/SOUL.md
$HERMES_HOME/SOUL.md
```

Profiles를 쓰는 경우 각 profile의 `HERMES_HOME` 안에 있는 `SOUL.md`가 기준이 된다. 이번 로컬 확인에서도 Dev profile에는 별도의 `SOUL.md`가 존재했고, `config.yaml`의 `display.skin`은 `default`로 설정되어 있었다. 즉 “말투 파일”과 “화면 테마”가 실제로 분리되어 운영되는 상태다.

기본 편집은 단순하다.

```bash
nano ~/.hermes/SOUL.md
```

내용은 프로젝트 규칙보다 넓고 오래가는 지시가 좋다.

```markdown
# Identity
You are direct, calm, and technically precise.

# Style
Prefer concise answers unless depth is useful.
Push back clearly when an assumption is weak.

# Avoid
Do not use hype language or empty reassurance.
```

세션 중 임시 전환은 slash command로 한다.

```text
/personality
/personality concise
/personality technical
/personality teacher
```

직접 만든 모드가 필요하면 `~/.hermes/config.yaml`의 `agent.personalities`에 이름을 추가하고 `/personality codereviewer`처럼 호출할 수 있다.

```yaml
agent:
  personalities:
    codereviewer: >
      You are a meticulous code reviewer. Identify bugs, security issues,
      performance concerns, and unclear design choices.
```

## 실제 운용에서의 짧은 장면

이 사용자의 Hermes 운영은 profile별 역할이 분리되어 있다. Dev 쪽은 친절하지만 실행 중심으로 보고하고, 다른 profile은 지식 정리나 일상 운영에 맞춘 톤을 가진다. 이 차이를 매번 프롬프트에 쓰는 대신 profile별 `SOUL.md`와 작업별 skill이 나누어 맡는 구조가 안정적이다.

## Pitfalls / tips

가장 흔한 실수는 `SOUL.md`에 프로젝트 경로, 포트, 빌드 명령, 임시 운영 메모를 넣는 것이다. 그런 정보는 저장소의 `AGENTS.md`, `CLAUDE.md`, `HERMES.md` 또는 skill에 두는 편이 안전하다. `SOUL.md`는 “어디서나 따라와야 하는 목소리”만 담아야 충돌이 줄어든다.

또 하나는 `/personality`를 영구 설정으로 오해하는 것이다. 세션 모드 전환에는 좋지만, 다음 실행에서도 같은 목소리를 원한다면 `SOUL.md`나 `agent.personalities`를 정리해야 한다. 반대로 화면이 어둡거나 밝아서 불편한 문제는 `/personality`가 아니라 `/skin` 또는 `display.skin`으로 해결한다.

마지막으로 `SOUL.md`는 프롬프트에 직접 들어가는 파일이다. 너무 길거나 서로 모순된 문장을 많이 넣으면 오히려 에이전트의 판단이 흐려진다. 짧고 안정적인 원칙, 금지할 말투, 불확실성을 다루는 방식 정도로 시작하는 편이 좋다.

## 마무리

Hermes를 “매번 새로 만나는 챗봇”이 아니라 “내 작업 방식에 맞춰진 에이전트”로 쓰고 싶다면 `SOUL.md`가 첫 번째 레버다. 프로젝트별 행동은 `AGENTS.md`, 절차 지식은 skills, 잠깐의 말투 전환은 `/personality`, 화면 취향은 `/skin`으로 나누면 설정이 오래 버틴다.
