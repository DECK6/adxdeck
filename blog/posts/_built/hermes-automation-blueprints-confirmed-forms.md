---
type: article
title: "Hermes Automation Blueprints는 cron 문법보다 먼저 목적을 묻는다"
aliases:
  - "Hermes Automation Blueprints Confirmed Forms"
author:
  - "Deck"
date created: 2026-07-19
date modified: 2026-07-19
tags:
  - hermes
  - ai-agent
  - workflow
  - automation-blueprints
description: Hermes Agent Automation Blueprints turn common recurring tasks into validated forms and conversational setup flows. This guide explains typed slots, explicit confirmation, cron execution, and shareable blueprint skills.
thumbnail: images/hermes-automation-blueprints-confirmed-forms-cover.png
status: completed
series: hermes-notes
---

# Hermes Automation Blueprints는 cron 문법보다 먼저 목적을 묻는다

![Hermes Automation Blueprints confirmed forms cover](images/hermes-automation-blueprints-confirmed-forms-cover.png)

예약 작업을 만들고 싶어도 첫 질문이 `0 8 * * *`의 뜻이라면 자동화는 시작부터 운영자용 기능이 된다. Hermes Agent의 **Automation Blueprints**는 반복 작업을 목적별 템플릿으로 제시하고, 시간·반복 요일·전달 위치처럼 사람이 이해할 값만 받은 뒤 기존 Cron 작업으로 변환한다.

## 기능 개요 — 같은 템플릿을 모든 화면에서 쓴다

Blueprint Catalog에는 아침 브리핑, 중요 메일 감시, 주간 리뷰, 맞춤 알림 같은 ready-to-run 자동화가 들어 있다. 각 항목은 작업 지시문과 고정된 일정 구조, `time`·`weekdays`·`enum`·`text` 타입의 입력 슬롯, 기본 전달 위치를 한곳에 정의한다. 잘못 쓴 슬롯 이름과 허용되지 않은 선택값은 작업 생성 전에 거부된다.

이 정의는 화면마다 따로 복제되지 않는다. Dashboard와 Desktop은 슬롯을 폼으로 렌더링하고, CLI·TUI·메신저는 `/blueprint` 대화로 필요한 값을 묻는다. 문서의 **Send to App** 링크도 같은 값을 composer에 미리 채운다. 마지막에는 항상 사용자가 확인해야 하므로 템플릿을 열거나 skill을 설치한 것만으로 예약 작업이 조용히 생기지 않는다.

Blueprint는 별도의 실행 엔진도 아니다. 입력 검증이 끝나면 기존 `cron.jobs.create_job` 규격으로 바뀌고, 생성된 작업은 profile별 `~/.hermes/cron/jobs.json`에 저장된다. 이후 실행·일시정지·전달·이력 관리는 일반 Cron과 같다.

## 어떻게 작동하고 쓰는가

가장 쉬운 시작은 이름만 입력하는 것이다. 이름은 prefix나 가까운 철자도 찾아 주며, Hermes가 빈 슬롯을 한 항목씩 확인한다.

```text
/blueprint morning-brief
```

값을 알고 있다면 한 줄로 미리 채울 수 있다. `origin`은 설정을 시작한 대화로 결과를 돌려보내며, 생성 전 확인 단계는 그대로 남는다.

```text
/blueprint morning-brief time=08:00 deliver=origin
```

예약 뒤에는 기존 Cron 표면에서 상태를 관리한다.

```text
/cron
hermes cron list
hermes cron pause <job-id>
hermes cron resume <job-id>
```

직접 만든 절차도 Blueprint가 될 수 있다. `~/.hermes/skills/<category>/<name>/SKILL.md`의 frontmatter에 다음 블록을 추가한다.

```yaml
metadata:
  hermes:
    tags: [blueprint, briefing]
    blueprint:
      schedule: "0 8 * * *"
      deliver: origin
      prompt: "Create a concise daily project briefing."
      no_agent: false
```

이 파일은 여전히 평범한 Skill이라 검색·검사·설치·공유 흐름을 그대로 사용한다. 설치 시에는 `~/.hermes/cron/suggestions.json`에 제안으로 등록될 뿐이며, 아래처럼 수락해야 실제 Cron 작업이 된다.

```text
/suggestions
/suggestions accept 1
/suggestions dismiss 1
```

## 짧은 실제 사용 사이드바

한 운영 셋업에서는 여러 역할별 profile이 각각 다른 예약 작업과 전달 채널을 가진다. 반복 브리핑의 구조를 Blueprint로 고정하면 각 profile에서는 시간과 전달 위치만 확인하면 되고, 실제 실행은 해당 profile의 Cron 저장소와 Skill 경계를 그대로 따른다. 개인 경로나 채널 식별자를 템플릿 본문에 넣지 않는 것도 중요한 운영 규칙이다.

## Pitfalls / tips

- **Blueprint와 Cron을 경쟁 기능으로 보지 않는다.** Blueprint는 안전한 설정 레이어이고 Cron은 실제 스케줄러다. 자유로운 일정·script·복잡한 전달 옵션이 필요하면 `hermes cron create`가 더 직접적이다.
- **설치와 예약을 구분한다.** Blueprint Skill 설치는 제안만 만들며, `/suggestions accept N` 전에는 실행되지 않는다.
- **`deliver=origin`의 문맥을 확인한다.** Dashboard에서 만든 작업은 구성된 home channel을 기준으로 삼을 수 있다. `hermes cron list`에서 결과 위치를 다시 본다.
- **Skill에 비밀을 쓰지 않는다.** 공유 가능한 절차와 schedule만 두고 토큰·계정·개인 식별자는 환경 설정과 secret source에 남긴다.
- **수정 후 새 작업에 반영되는지 확인한다.** 이미 생성된 Cron 작업은 원본 템플릿을 실시간으로 따라가는 별칭이 아니다.

반복 요구가 이미 정형화되어 있고 비전문가도 같은 자동화를 설치해야 한다면 Blueprint가 알맞다. 단 한 번의 알림은 자연어로 요청해도 충분하고, 고급 스케줄·사전 script·세밀한 모델 지정까지 필요하다면 Cron을 직접 구성하는 편이 낫다.
