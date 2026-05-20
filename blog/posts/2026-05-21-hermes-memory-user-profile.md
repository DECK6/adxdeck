---
type: article
title: "Hermes Memory는 작업 일지가 아니라 다음 세션의 운영 감각이다"
aliases:
  - Hermes Memory User Profile
author:
  - "[[육대근]]"
date created: 2026-05-21
date modified: 2026-05-21
tags:
  - hermes
  - ai-agent
  - workflow
  - memory
description: A practical guide to Hermes Agent's built-in memory, user profile, external memory providers, and the boundary between durable facts and searchable session history.
thumbnail: images/hermes-memory-user-profile-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-memory-user-profile-cover.png)

Hermes Agent의 Memory는 “지난 일을 모두 저장하는 기능”이 아니다. 더 정확히는 다음 세션에도 반복해서 유용한 사실만 골라 시스템 프롬프트에 주입하는 **작고 관리되는 장기 컨텍스트**다. 해결하는 문제는 명확하다. 에이전트가 매번 사용자의 말투, 환경, 금지사항, 반복되는 작업 관습을 다시 물어보지 않게 하되, 오늘의 임시 진행 상황까지 영구 기억으로 오염시키지 않는 것이다.

## 기능 개요 — MEMORY와 USER PROFILE

Hermes의 기본 메모리는 두 저장소로 나뉜다. `MEMORY.md`는 환경 사실, 프로젝트 관습, 도구 사용상의 교훈처럼 에이전트가 다시 참고해야 할 운영 메모를 담는다. `USER.md` 또는 User Profile은 사용자의 선호, 호칭, 커뮤니케이션 스타일, 기대하는 응답 방식처럼 “사용자에 관한 안정적인 사실”을 담는다.

세션이 시작되면 Hermes는 이 두 파일을 읽어 시스템 프롬프트 안에 frozen snapshot으로 넣는다. 그래서 메모리는 일반 대화 로그보다 강하게 작동하지만, 무제한 저장소는 아니다. `memory_char_limit`, `user_char_limit` 같은 제한이 있어 오래된 항목은 통합하거나 교체해야 한다. 에이전트가 세션 중 `memory` 도구로 항목을 추가·수정·삭제하면 디스크에는 즉시 반영되지만, 현재 세션의 프롬프트 블록은 바뀌지 않는다. 새 기억이 모델의 기본 컨텍스트로 보이는 시점은 다음 세션부터라고 이해하면 안전하다.

## 어떻게 설정하고 확인하나

기본 built-in memory는 항상 켜져 있으며, 외부 provider는 선택적으로 하나만 붙일 수 있다. 로컬 설치에서 확인한 CLI 표면은 다음과 같다.

```bash
hermes memory setup
hermes memory status
hermes memory off
hermes memory reset
```

`hermes memory status`는 built-in memory 상태, 현재 external provider, 설치된 provider plugin을 보여 준다. 예를 들면 Honcho, mem0, Hindsight, Holographic, RetainDB, OpenViking, Byterover, Supermemory 같은 provider가 plugin으로 제공될 수 있다. 외부 provider가 활성화되면 Hermes는 provider context를 프롬프트에 주입하고, 지원 범위에 따라 세션 요약이나 memory write를 provider 쪽에도 반영한다. 하지만 built-in `MEMORY.md`와 `USER.md`는 그대로 남아 기준점 역할을 한다.

설정 파일에서는 보통 다음 키를 확인한다.

```yaml
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 3600
  user_char_limit: 2200
  provider: ""
```

`provider: ""`는 외부 provider 없이 built-in만 쓰는 상태다. 외부 provider를 실험할 때도 먼저 `hermes memory status`로 현재 상태를 확인하고, 되돌릴 때는 `hermes memory off`로 external provider만 끄는 흐름이 깔끔하다. `hermes memory reset`은 built-in memory를 지우는 파괴적 명령이므로 테스트 환경이 아니라면 신중히 다뤄야 한다.

## 짧은 실제 사용 사이드바

이 사용자의 셋업에서는 “짧은 한국어 보고를 선호한다”처럼 다음 세션에도 의미 있는 선호는 User Profile 후보가 된다. 반대로 “오늘 카드 세 개 중 두 개를 끝냈다” 같은 진행 상황은 memory에 넣지 않고 세션 기록이나 `session_search`로 찾아야 할 정보로 둔다. 운영의 기준은 기억량이 아니라 재사용성이다.

## Pitfalls / tips

첫째, memory와 `session_search`를 섞어 생각하지 않는다. memory는 시작 프롬프트에 들어가는 선별된 장기 사실이고, `session_search`는 과거 대화 transcript를 필요할 때 검색하는 recall 도구다. PR 번호, 완료 로그, 임시 TODO처럼 일주일 뒤 낡을 정보는 memory보다 검색 기록에 남기는 편이 낫다.

둘째, “방금 저장했는데 왜 바로 반영되지 않나”는 정상 동작일 수 있다. 메모리 파일은 즉시 바뀌지만 시스템 프롬프트 snapshot은 세션 시작 때 고정된다. 현재 대화에서 tool 결과로는 live state를 볼 수 있어도, 모델의 기본 전제는 다음 세션에서 갱신된다.

셋째, 공개 글이나 로그에 실제 `MEMORY.md`, `USER.md` 내용을 그대로 붙이지 않는다. 메모리는 사용자 선호와 환경 사실을 담기 쉽기 때문에 예시는 항상 일반화하고, secret이나 개인 식별자는 저장 대상에서 제외한다.

## 언제 Memory를 쓰나

Memory는 에이전트가 앞으로도 같은 방식으로 행동해야 하는 안정적인 사실에 적합하다. 복잡한 절차 자체는 skill로, 오늘의 작업 진행은 session history로, 지금 필요한 임시 계획은 todo로 두는 편이 낫다. 좋은 Hermes 운영은 “많이 기억하는 에이전트”가 아니라, “다음 세션에 정말 필요한 것만 기억하는 에이전트”를 만드는 일이다.
