---
type: article
title: "Hermes Persistent Goals는 ‘계속해’라는 말을 작업 루프로 바꾼다"
aliases:
  - "Hermes Persistent Goals"
author:
  - "[[Deck]]"
date created: 2026-06-04
date modified: 2026-06-04
tags:
  - hermes
  - ai-agent
  - workflow
  - goals
  - automation
description: "A feature guide to Hermes Agent Persistent Goals: how /goal keeps an objective alive across turns with a judge loop, turn budget, and resumable state."
thumbnail: images/hermes-persistent-goals-cover.png
status: completed
series: hermes-notes
---

# Hermes Persistent Goals는 ‘계속해’라는 말을 작업 루프로 바꾼다

![Abstract cover for Hermes Persistent Goals](images/hermes-persistent-goals-cover.png)

긴 작업에서 사람이 가장 자주 하는 말은 의외로 단순하다. “좋아, 계속해.” **Hermes Persistent Goals**는 이 반복 지시를 기능으로 바꾼다. `/goal`로 완료 목표를 세우면 Hermes는 한 턴을 끝낸 뒤에도 목표가 아직 끝났는지 판단하고, 부족하면 같은 세션 안에서 자동으로 다음 턴을 이어간다.

## 기능 개요: 목표, 판정자, 예산이 한 묶음이다

`/goal`은 Hermes 세션에 “standing objective”를 붙이는 명령이다. 일반 프롬프트처럼 한 번 실행하고 끝나는 것이 아니라, 마지막 응답이 목표를 만족했는지 보조 judge 모델이 확인한다. 판정 결과가 `continue`이면 Hermes는 continuation prompt를 다시 넣고 다음 단계를 수행한다. 결과가 `done`이면 루프를 멈춘다.

이 기능은 Cron이나 Kanban처럼 별도 작업 큐를 만드는 장치가 아니다. 현재 대화의 맥락, toolset, 승인 정책을 유지한 채 한 목표를 여러 턴에 걸쳐 밀고 나가는 세션 내부 루프에 가깝다. 그래서 “테스트를 모두 고치고 통과까지 확인해”, “리포트를 작성하고 산출물 경로까지 검증해”처럼 사람이 중간에 계속 밀어줘야 하는 작업에 맞는다.

중간에 기준을 추가할 수도 있다. `/subgoal`은 활성 목표에 추가 완료 조건을 붙인다. 예를 들어 버그 수정을 진행하다가 “회귀 테스트도 추가”가 필요해지면 새 목표를 다시 세우지 않고 subgoal을 붙여 판정 기준을 강화한다.

## 어떻게 작동하고 설정하는가

가장 단순한 사용법은 대화형 CLI나 게이트웨이에서 바로 목표를 세우는 것이다.

```text
/goal Fix every failing test in tests/hermes_cli/ and verify the target test command passes
```

상태 확인과 제어 명령은 다음처럼 쓴다.

```text
/goal status
/goal pause
/goal resume
/goal clear
/subgoal add a regression test for the bug you patched
/subgoal remove 1
/subgoal clear
```

Hermes는 목표를 받으면 첫 턴을 즉시 시작한다. 턴이 끝날 때마다 judge가 마지막 응답 일부와 목표를 보고 엄격한 JSON 판정을 만든다. 판정이 계속이면 사용자가 따로 “계속”이라고 말하지 않아도 다음 user-role continuation 메시지가 붙는다. 이 방식은 system prompt나 toolset을 바꾸지 않으므로 prompt cache도 정상적으로 유지된다.

설정 파일에서는 최대 continuation 턴 수를 조정할 수 있다.

```yaml
goals:
  max_turns: 20
```

judge 모델을 따로 싸고 빠른 모델로 보내고 싶다면 보조 모델 라우팅을 쓴다.

```yaml
auxiliary:
  goal_judge:
    provider: openrouter
    model: google/gemini-3-flash-preview
```

목표 상태는 세션 DB의 `state_meta`에 `goal:<session_id>` 형태로 저장된다. 세션을 다시 열면 목표, pause 상태, subgoal 목록을 이어받을 수 있다. 다만 예산을 다 쓰면 자동으로 멈추며, 계속하려면 `/goal resume`으로 새 예산을 주는 편이 안전하다.

## 짧은 실제 사용 사이드바

한 실제 Hermes 운영 셋업에서는 개발, 지식관리, 운영 프로파일이 분리되어 있고 각 프로파일마다 맡는 일이 다르다. 이런 환경에서 `/goal`은 “한 프로파일 안에서 끝까지 밀어붙일 단일 목표”에 잘 맞는다. 반대로 여러 프로파일이 나눠 맡아야 하는 작업은 Kanban이나 delegation이 더 적절하다.

## Pitfalls / tips

첫째, 목표 문장은 완료 조건을 포함해야 한다. “리팩터링해”보다 “리팩터링하고 `python -m pytest ...`가 통과했음을 확인해”가 낫다. judge는 마지막 응답에 명시된 완료 증거를 보고 판단하므로, 검증 명령과 산출물 기준을 goal에 넣는 것이 중요하다.

둘째, judge는 보수적으로 설계되었지만 완벽하지 않다. 실제로 끝났는데 계속할 수도 있고, 반대로 목표가 모호하면 너무 빨리 끝났다고 볼 수도 있다. 판정 사유가 함께 표시되므로 이상하면 `/goal clear` 후 더 구체적인 목표로 다시 세운다.

셋째, 게이트웨이에서 실행 중인 목표를 새 목표로 덮어쓰는 것은 경합을 만들 수 있다. 실행 중에는 `/goal status`, `/goal pause`, `/goal clear`처럼 제어 명령을 먼저 쓰고, 필요하면 `/stop` 뒤 새 목표를 세우는 편이 안전하다.

## 언제 이 기능을 잡을까

Persistent Goals는 “한 세션, 한 목표, 여러 턴”이 필요한 순간에 가장 좋다. 짧은 질의응답은 일반 프롬프트로 충분하고, 정해진 시간에 반복되는 일은 Cron이 낫다. 여러 에이전트가 나눠야 하는 일은 delegation이나 Kanban이 맞다. 하지만 같은 맥락 안에서 검증까지 반복해야 하는 작업이라면 `/goal`은 사람의 “계속해”를 Hermes의 작업 루프로 바꿔준다.
