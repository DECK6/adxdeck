---
type: article
title: "Hermes Profiles와 Workers: AI에게 역할과 작업 레인을 나누는 법"
aliases:
  - "Hermes Profiles and Workers"
description: "Explains how Hermes Agent profiles and worker lanes separate agent state, tools, and durable task handoffs. Use this article to understand how to turn one assistant into a quieter role-based operating team."
author:
  - "[[Deck]]"
date created: 2026-05-11
date modified: 2026-05-11
tags:
  - article
  - hermes
  - ai-agent
  - workflow
series: hermes-notes
thumbnail: images/2026-05-11-hermes-profiles-workers-cover.png
status: completed
published: true
publishedAt: 2026-05-11
publishSlug: "hermes-profiles-and-workers"
featureTopic: "Profiles and worker lanes"
officialDocs:
  - "https://hermes-agent.nousresearch.com/docs/user-guide/profiles"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban"
localChecks:
  - "hermes profile --help"
  - "hermes kanban --help"
publicSafetyStatus: reviewed
---

# Hermes Profiles와 Workers: AI에게 역할과 작업 레인을 나누는 법

![Abstract cover for Hermes profiles and worker lanes](images/2026-05-11-hermes-profiles-workers-cover.png)

## Lede

AI 에이전트를 오래 쓰다 보면 “더 똑똑한 한 명”보다 “잘 나뉜 여러 역할”이 더 중요해진다. 한 에이전트가 글쓰기, 코드 수정, 자료 조사, 배포 점검, 일정 알림을 모두 맡을 수는 있지만, 모든 일을 한 대화 안에 밀어 넣으면 맥락은 빨리 탁해진다. 실패했을 때도 원인을 나누기 어렵다. 글이 얕았는지, 도구 권한이 부족했는지, 인증이 끊겼는지, 빌드가 깨졌는지가 한 덩어리로 보이기 때문이다.

Hermes Agent의 Profiles와 worker lane은 이 문제를 “역할 분리”로 해결한다. 프로필은 캐릭터 설정이 아니라 독립된 실행 단위다. 각 프로필은 별도의 설정, 세션, 스킬, 기억, 도구 노출을 가질 수 있고, 필요하면 서로 다른 모델이나 작업공간을 기본값으로 삼을 수 있다. 여기에 Kanban 기반 worker 흐름을 붙이면 작업은 말로만 나뉘는 것이 아니라, 카드, 의존성, workspace, handoff를 가진 실행 레인으로 분리된다.

## 개념

Profiles는 Hermes를 여러 운영자처럼 나누는 기능이다. 예를 들어 한 프로필은 문서와 지식 정리에 집중하고, 다른 프로필은 코드 변경과 테스트에 집중하며, 또 다른 프로필은 배포와 상태 확인을 맡을 수 있다. 핵심은 “누가 더 똑똑한가”가 아니라 “어떤 프로필이 어떤 책임과 도구를 갖는가”다. 프로필을 분리하면 기억과 스킬이 섞이는 일을 줄이고, 특정 작업에 필요한 도구만 열어 둘 수 있다.

Workers는 이 분리를 durable task로 바꾸는 방식이다. Hermes Kanban은 작업을 카드로 만들고, 부모-자식 의존성, 담당 프로필, workspace, 실행 이력, 완료 handoff를 남긴다. 단발성 하위 질문은 즉석 delegation으로 충분하지만, 사람이 나중에 다시 확인해야 하는 작업이나 다른 프로필이 이어받아야 하는 작업은 Kanban worker lane에 올리는 편이 안정적이다.

## 사용법

출발점은 작게 잡는 것이다. 먼저 `hermes profile list`, `hermes profile create`, `hermes profile show`로 프로필을 만들고 확인한다. 각 프로필에는 맡길 일과 맡기지 않을 일을 같이 적어 둔다. “문서 담당”, “개발 담당”, “운영 담당”처럼 이름을 붙이는 것보다 중요한 것은 기본 workspace, 필요한 toolset, 반드시 읽어야 할 지침, 완료 보고 형식을 분명히 하는 일이다.

그 다음 durable workflow가 필요한 작업만 Kanban에 올린다. `hermes kanban create`로 카드를 만들고 담당 프로필을 지정하면, dispatcher가 작업을 claim하고 격리된 workspace에서 실행한다. worker는 시작할 때 카드 내용을 읽고, 필요하면 heartbeat를 남기며, 끝나면 요약과 metadata를 남긴다. 이 metadata가 다음 worker의 입력이 된다. 결국 worker lane은 “AI가 알아서 했다”가 아니라 “어떤 역할이 무엇을 읽고 무엇을 남겼는가”를 추적하는 장치다.

## 짧은 사이드바

실제 운영에서는 글, 이미지, 빌드, 인증, 배포가 한 번에 얽히는 작업이 자주 생긴다. 하나의 프로필이 모두 처리하면 실패 지점이 흐려진다. 반대로 글 작성 프로필, 이미지 생성 프로필, 배포 확인 프로필을 나누면 문제를 좁혀 볼 수 있다. 이때 중요한 교훈은 프로필을 많이 만드는 것이 아니라, 각 프로필의 침묵 범위까지 정하는 것이다.

## Pitfalls

첫 번째 함정은 프로필을 성격 놀이로 쓰는 것이다. 말투만 다르고 도구와 기억이 같다면 운영상 분리는 일어나지 않는다. 두 번째 함정은 worker가 끝났다고만 말하고 검증 가능한 artifact를 남기지 않는 것이다. 파일 경로, commit hash, 테스트 수, 발행 slug처럼 다음 사람이 확인할 수 있는 단서를 남겨야 한다. 세 번째 함정은 모든 일을 Kanban에 올리는 것이다. 짧은 비교나 초안 검토처럼 한 세션 안에서 끝나는 일은 delegation이 더 가볍다.

## 클로징

Hermes의 Profiles와 Workers는 AI를 여러 개 켜는 기능이 아니라, AI에게 조직도를 주는 기능에 가깝다. 좋은 구조는 더 많은 답변을 만드는 구조가 아니라, 필요한 역할만 말하고 나머지는 기다리게 하는 구조다. 작업 레인이 분리될수록 사람은 모든 맥락을 다시 조율하는 관리자에서, 결과와 다음 결정을 판단하는 운영자로 돌아올 수 있다.
