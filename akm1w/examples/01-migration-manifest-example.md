---
type: manifest
aliases:
  - "가상 주간 브리핑 마이그레이션 매니페스트"
description: "Filled fictional manifest showing how three weekly briefing notes can be preserved, linked, synthesized, or held without moving an entire knowledge system."
akmLayer: action
akmType: run
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

# 가상 예시 답안 — 주간 브리핑 Migration Manifest

> 이 문서는 작성 형식을 보여 주는 완전한 가상 예시 답안입니다. 실제 조직, 정책, 승인 또는 프로젝트를 나타내지 않습니다. 실제 작업에서는 privacy-safe 자료만 사용하고 각 source를 직접 읽어 교체하세요.

## 학습자 조건

- learner lane: Beginner
- 현재 시스템: 가상 팀 드라이브와 개인 노트
- privacy-safe 확인: 완료 — 실제 개인정보·계약·비밀정보가 없는 가상 공개 자료만 사용
- 이동 원칙: 전체 시스템을 옮기지 않고 원본은 보존하며 포인터·선택 합성·HOLD를 구분

## Source A

- 이름: `가상-브리핑-운영기준-v2-승인본.md`
- 현재 위치: 가상 팀 드라이브의 승인 문서 폴더
- 현재 역할: 현재 기준 원본
- 지식 구역: 답변 참고 지식
- AKM target layer: `10-sources`
- 처리 방식: keep — 원본 유지·포인터
- 민감도: 가상 공개 자료
- document status: 승인됨
- authority: 가상 팀 승인본
- scope: 가상 팀 공통
- 이유: 승인 상태와 원문을 훼손하지 않고 팀 공통 기준의 직접 근거로 사용하기 위해서다.
- direct-read evidence: 메타데이터에서 `문서 상태: 승인됨`, `authority: 가상 팀 승인본`, `적용 범위: 가상 팀 공통`, `effective date: 2026-07-01`을 직접 확인했다.

## Source B

- 이름: `가상-브리핑-개선-아이디어.md`
- 현재 위치: 가상 작성자의 개인 아이디어 노트
- 현재 역할: 해석·개선 제안
- 지식 구역: 답변 참고 지식
- AKM target layer: `20-knowledge`
- 처리 방식: selective synthesis — 승인 내용과 분리해 선택 합성
- 민감도: 가상 공개 자료
- document status: 미승인 제안
- authority: 작성자 제안
- scope: 참고용
- 이유: 읽기 쉬운 제안이 승인된 공통 기준으로 오인되지 않도록 Source A와 분리한다.
- direct-read evidence: 메타데이터에서 `문서 상태: 미승인 제안`, `authority: 작성자 제안`, `용도: 참고용`을 직접 확인했다.

## Source C

- 이름: `가상-라온-프로젝트-브리핑-적용기록.md`
- 현재 위치: 가상 라온 프로젝트 폴더
- 현재 역할: 프로젝트 적용·예외 기록
- 지식 구역: 에이전트 운영 지식
- AKM target layer: `30-context` 및 검증 후 `50-procedures`
- 처리 방식: link + HOLD — 현재 위치 유지·연결, 공통 기준 반영 여부는 보류
- 민감도: 가상 공개 자료
- document status: 프로젝트 내부 기록
- authority: 가상 프로젝트 내부 기록
- scope: 가상 라온 프로젝트 한정
- 이유: 프로젝트 한정 예외를 다른 프로젝트나 팀 공통 정책으로 일반화하지 않기 위해서다.
- direct-read evidence: 본문에서 `적용 범위: 가상 라온 프로젝트 한정`, `공통 기준 반영 여부: 미확인`을 직접 확인했다.

## 세 행 요약

| 기존 노트 | 구역 | 현재 역할 | AKM 목적지 | 처리 | 상태·authority·scope | 판정 |
|---|---|---|---|---|---|---|
| Source A | 답변 참고 지식 | 현재 기준 원본 | `10-sources` | keep·포인터 | 승인됨 · 가상 팀 승인본 · 팀 공통 | PASS |
| Source B | 답변 참고 지식 | 미승인 제안 | `20-knowledge` | selective synthesis | 미승인 · 작성자 제안 · 참고용 | PASS_WITH_NOTE |
| Source C | 에이전트 운영 지식 | 프로젝트 예외 | `30-context`·`50-procedures` | link + HOLD | 내부 기록 · 프로젝트 기록 · 라온 한정 | HOLD |

## 최종 판단

Source A를 팀 공통 기준의 원본으로 보존한다. Source B는 승인 전까지 제안으로만 참고한다. Source C는 가상 라온 프로젝트에만 연결하며, 공통 기준에 포함되었다는 직접 근거가 생기기 전에는 HOLD로 둔다.
