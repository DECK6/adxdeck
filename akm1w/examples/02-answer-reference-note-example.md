---
type: note
aliases:
  - "가상 주간 브리핑 현재 기준"
description: "Canonical fictional reference for deciding which source may be used as the current weekly briefing standard and which materials remain proposals or project-specific exceptions."
akmLayer: knowledge
akmType: guide
trustLevel: reviewed
author:
  - "가상 작성자"
date created: 2026-07-23
date modified: 2026-07-23
tags:
  - AKM
  - GPTERS
  - fictional-example
status: completed
sourceNotes:
  - "가상-브리핑-운영기준-v2-승인본.md"
  - "가상-브리핑-개선-아이디어.md"
  - "가상-라온-프로젝트-브리핑-적용기록.md"
---

# 가상 예시 답안 — 주간 브리핑에서 사용할 현재 기준

> 이 문서는 작성 형식을 보여 주는 완전한 가상 예시 답안입니다. 실제 조직, 정책, 승인 또는 프로젝트를 나타내지 않습니다. 실제 답변에는 각 source를 직접 읽은 근거만 사용하세요.

## 이번 노트가 답할 질문

주간 브리핑 초안을 만들 때 어떤 문서를 팀 공통 기준으로 사용하고, 어떤 내용은 미승인 제안 또는 프로젝트 전용 예외로 분리해야 하는가?

## 사용한 원본과 상태

| Source | 파일 | document status | authority | scope | freshness |
|---|---|---|---|---|---|
| A | `가상-브리핑-운영기준-v2-승인본.md` | 승인됨 | 가상 팀 승인본 | 가상 팀 공통 | effective date 2026-07-01 |
| B | `가상-브리핑-개선-아이디어.md` | 미승인 제안 | 작성자 제안 | 참고용 | 승인·반영 시점 없음 |
| C | `가상-라온-프로젝트-브리핑-적용기록.md` | 프로젝트 내부 기록 | 가상 프로젝트 내부 기록 | 가상 라온 프로젝트 한정 | 공통 기준 반영 여부 미확인 |

## 확인된 사실

- Source A에는 문서 상태가 `승인됨`, authority가 `가상 팀 승인본`, 적용 범위가 `가상 팀 공통`, effective date가 `2026-07-01`로 표시되어 있다.
- Source B에는 문서 상태가 `미승인 제안`, authority가 `작성자 제안`, 용도가 `참고용`으로 표시되어 있다.
- Source C에는 적용 범위가 `가상 라온 프로젝트 한정`, 공통 기준 반영 여부가 `미확인`으로 표시되어 있다.

## Source-to-Claim

| 정본 노트의 주장 | Source | 직접 확인한 문장·구간 | Authority | Scope | 판정 |
|---|---|---|---|---|---|
| 팀 공통 기준은 Source A다. | Source A | `문서 상태: 승인됨`, `authority: 가상 팀 승인본`, `적용 범위: 가상 팀 공통` | 가상 팀 승인본 | 팀 공통 | PASS |
| Source B는 승인 전까지 기준이 아니다. | Source B | `문서 상태: 미승인 제안`, `authority: 작성자 제안`, `용도: 참고용` | 작성자 제안 | 참고용 | PASS |
| Source C의 예외는 라온 프로젝트에만 적용한다. | Source C | `적용 범위: 가상 라온 프로젝트 한정`, `공통 기준 반영 여부: 미확인` | 프로젝트 내부 기록 | 라온 프로젝트 | PASS_WITH_NOTE |

## 합성한 판단

가상 팀의 공통 브리핑 기준은 Source A를 우선한다. Source B의 아이디어는 승인되기 전까지 공통 기준으로 사용하지 않는다. Source C의 예외는 가상 라온 프로젝트에만 적용하며 다른 프로젝트에 일반화하지 않는다.

## 충돌·불확실성

- Source B에는 Source A와 다른 개선 제안이 있으나 승인 여부가 확인되지 않았다.
- Source C의 예외가 다음 버전 공통 기준에 반영될지는 확인되지 않았다.
- 두 항목은 승인자와 다음 기준 문서를 직접 확인할 때까지 HOLD로 남긴다.

## 적용 범위

이 판단은 가상 팀의 주간 브리핑 초안 작성에만 사용한다. 실제 조직이나 다른 프로젝트의 기준으로 사용하지 않는다.

## Verify 결과

- 판정: PASS_WITH_NOTE
- 가장 강한 근거: Source A의 승인 상태, authority, 팀 공통 범위, effective date
- 가장 큰 불확실성: Source C의 예외가 다음 공통 기준에 반영될지 미확인
- 다음 source: 가상 팀의 다음 버전 승인 운영 기준
- 다음 검증 질문: 라온 예외가 팀 공통 기준으로 승인되었으며 기존 기준을 supersedes 하는가?
