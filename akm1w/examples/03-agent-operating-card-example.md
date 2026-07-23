---
type: procedure
aliases:
  - "가상 주간 브리핑 source 판정 절차"
description: "Fictional operating card for selecting an approved briefing source, preserving project-specific exceptions, and stopping when authority or scope cannot be verified."
akmLayer: procedure
akmType: playbook
trustLevel: reviewed
author:
  - "가상 작성자"
date created: 2026-07-23
date modified: 2026-07-23
tags:
  - AKM
  - agent-operations
  - fictional-example
status: completed
sourceNotes:
  - "가상 주간 브리핑 현재 기준"
  - "가상-브리핑-운영기준-v2-승인본.md"
  - "가상-브리핑-개선-아이디어.md"
  - "가상-라온-프로젝트-브리핑-적용기록.md"
---

# 가상 예시 답안 — 주간 브리핑 source 판정 절차

> 이 문서는 작성 형식을 보여 주는 완전한 가상 예시 답안입니다. 실제 조직, 정책, 승인 또는 프로젝트를 나타내지 않습니다. 실제 실행에서는 권한과 source 원문을 직접 확인하세요.

## 언제 읽는가

에이전트가 가상 팀의 주간 브리핑 초안을 만들거나 기존 초안을 현재 기준과 비교할 때 읽는다.

## 먼저 읽을 답변 참고 지식

`가상 주간 브리핑 현재 기준`

이 카드에는 근거 내용을 복제하지 않는다. 위 답변 참고 노트와 다음 세 source를 먼저 직접 읽는다.

- `가상-브리핑-운영기준-v2-승인본.md`
- `가상-브리핑-개선-아이디어.md`
- `가상-라온-프로젝트-브리핑-적용기록.md`

## 사용자·프로젝트 Context

- 가상 팀 내부 교육 실습에만 사용한다.
- Source A의 팀 공통 범위와 Source C의 가상 라온 프로젝트 범위를 분리한다.
- 가상 라온 프로젝트 예외는 다른 프로젝트에 적용하지 않는다.

## Trigger

주간 브리핑 초안 생성, 현재 기준 비교, 또는 미승인 아이디어가 공통 정책처럼 인용된 징후가 있을 때 실행한다.

## 실행 Procedure

1. 먼저 답변 참고 노트 `가상 주간 브리핑 현재 기준`을 읽는다.
2. 후보 문서마다 source, 문서 상태, authority, scope, effective date, approval, supersedes를 직접 확인한다.
3. 승인된 팀 공통 기준과 미승인 제안, 프로젝트 전용 예외를 분리한다.
4. 핵심 주장마다 직접 읽은 문장·구간을 evidence로 기록한다.
5. 결과를 PASS, PASS_WITH_NOTE, HOLD, FAIL, NOT TESTED 중 하나로 판정한다.
6. 불확실성이 있으면 다음 source와 확인 질문을 남기고 Learn Back 대상을 지정한다.

## 권한 경계

- 원본을 수정하거나 승인 상태를 임의로 변경하지 않는다.
- 미승인 제안을 팀 공통 정책으로 승격하지 않는다.
- 프로젝트 전용 기록을 다른 프로젝트에 일반화하지 않는다.
- 비밀정보·개인정보가 있으면 처리하거나 외부로 전송하지 않고 즉시 멈춘다.

## Stop·HOLD 조건

- 승인 상태나 authority를 직접 확인할 수 없다.
- 두 승인 문서가 충돌하지만 supersedes 관계가 없다.
- 프로젝트 예외의 scope가 불명확하다.
- Source C의 예외가 공통 기준에 반영되었다는 evidence가 없다.
- 실제 개인정보나 비밀정보가 포함되어 있다.

## 완료 Evidence

- 사용한 source 세 개와 직접 확인한 문장·구간
- 문서 상태·authority·scope·effective date·approval·supersedes 기록
- 최종 판정과 HOLD 항목
- 다시 확인할 사람·문서·질문
- 브라우저에서 내보낸 답변 참고 노트와 이 운영 카드

## 평가 판정

- PASS: 승인·authority·scope·직접 읽은 근거가 모두 연결됨
- PASS_WITH_NOTE: 기준은 사용할 수 있으나 프로젝트 예외 등 범위 메모가 필요함
- HOLD: approval, supersedes 또는 공통 반영 여부를 확인할 수 없음
- FAIL: source와 충돌하거나 권한 경계를 위반함
- NOT TESTED: 실제 source를 직접 읽거나 절차를 실행하지 않음

## Learn Back 대상

문서 상태를 놓쳤다면 Procedure 2단계를 수정한다. 범위를 일반화했다면 Context와 Evaluation 기준을 수정한다. 미승인 제안이 기준처럼 사용되었다면 approval·authority·scope·supersedes 확인을 필수 gate로 추가한다.

## 다음 행동

가상 팀의 다음 버전 승인 운영 기준을 직접 열어 Source C의 라온 예외가 공통 기준으로 승인되었는지, 그리고 기존 Source A를 supersedes 하는지 확인한다. 확인 전까지 공통 반영 주장은 HOLD로 유지한다.
