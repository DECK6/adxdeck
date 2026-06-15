---
type: article
title: "AKM — 에이전트에게 지식 운영체계를 주는 법"
aliases:
  - "Agent Knowledge Management"
  - "AKM Agent Knowledge Management"
  - "AKM"
author:
  - "[[육대근]]"
date created: 2026-06-15
date modified: 2026-06-15
tags:
  - hermes
  - ai-agent
  - workflow
  - knowledge-management
  - memory
description: AKM(Agent Knowledge Management)은 LLM Wiki식 지식 지도에 운영 기억, 절차, 실행 기록, 검증과 Learn Back 루프를 결합해 에이전트가 다음 실행에서 더 잘 일하게 만드는 Markdown 기반 지식 운영체계다.
thumbnail: images/akm-agent-knowledge-management-cover.png
status: completed
series: hermes-notes
---

![cover](images/akm-agent-knowledge-management-cover.png)

AI 에이전트를 오래 쓰다 보면 같은 문제가 반복된다. 모델은 매번 똑똑하지만, 지난번에 정리한 맥락을 잊고, 성공했던 절차를 다시 발명하고, 실패했던 이유를 다음 세션에서 또 밟는다. 단순히 문서를 많이 넣는다고 해결되지 않는다. 지식, 사용자 맥락, 반복 절차, 실행 기록, 검증 기준은 서로 다른 수명을 갖기 때문이다.

[AKM(Agent Knowledge Management)](https://github.com/DECK6/akm)은 이 문제를 “에이전트를 위한 지식 운영체계”로 다룬다. 코어는 단순하다. 데이터베이스나 서버가 아니라 Markdown 폴더, frontmatter, wikilink, 그리고 어디에 무엇을 저장할지 정하는 규칙이다. 하지만 목적은 단순한 위키가 아니다. 에이전트가 무엇을 읽고, 무엇을 기억하고, 어떤 절차로 실행하고, 실패를 어느 레이어로 되돌릴지를 정하는 운영 구조다.

## LLM Wiki 다음의 질문

AKM이 출발하는 지점에는 Karpathy가 제안한 LLM Wiki 패턴이 있다. 원본을 보존하고, 개념과 엔티티와 비교 문서를 컴파일하고, LLM이 다시 읽기 좋은 Markdown 지식 지도를 만든다. 이것만으로도 큰 개선이 생긴다. 매번 흩어진 자료를 다시 해석하지 않아도 되고, 좋은 요약이 세션 종료와 함께 증발하지 않는다.

하지만 에이전트가 실제로 일하기 시작하면 다른 질문이 따라온다. 이 지식은 누구에게나 참인 지식인가, 아니면 특정 프로젝트에서만 참인 맥락인가. 반복할 수 있는 절차인가, 아니면 오늘 한 번의 실행 기록인가. 실패는 단순 로그로 남길 것인가, 아니면 다음 실행을 바꾸는 규칙으로 되돌릴 것인가.

AKM은 LLM Wiki를 폐기하지 않는다. 오히려 그것을 Knowledge Layer로 받아들이고, 그 주변에 운영 기억, 프로젝트 맥락, 절차, 실행, 검증 레이어를 붙인다. 그래서 “더 큰 위키”라기보다 “위키를 포함한 에이전트 운영 구조”에 가깝다.

## 7개 레이어로 섞임을 막기

AKM의 중심은 7개 레이어다. `10-sources/`는 원본을 보존하고, `20-knowledge/`는 재사용 가능한 지식으로 컴파일한다. `30-context/`는 특정 사용자·조직·프로젝트에서만 참인 맥락을 담고, `40-memory/`는 매 세션 먼저 읽어야 하는 짧고 안정적인 포인터만 남긴다.

그 다음부터는 실행에 가깝다. `50-procedures/`는 반복 가능한 절차와 스킬을 저장하고, `60-actions/`는 재현·검증·인수인계에 필요한 실행 기록만 선별해 보관한다. `70-evaluation/`은 실패 패턴, 품질 기준, 검증 규칙이 들어가는 자리다. 보조적으로 `80-outputs/`와 `90-archive/`가 산출물과 폐기된 노트를 담당한다.

이 분리가 중요한 이유는 각 저장물이 망가지는 방식이 다르기 때문이다. 긴 도메인 지식이 memory에 들어가면 매 세션 컨텍스트가 오염된다. 절차 문서에 배경 지식을 모두 넣으면 같은 내용을 여러 곳에서 고쳐야 한다. 모든 실행 로그를 저장하면 다음 에이전트는 중요한 기록과 잡음을 구분하지 못한다. 검증 레이어가 없으면 실패는 다음 실행을 바꾸지 못하고 사라진다.

## Memory, Brain, Vault라는 읽기 방식

AKM은 7개 레이어를 다시 세 가지 읽기 관점으로 묶는다. Memory는 `40-memory/`다. 항상 먼저 읽지만, 길면 안 된다. “여기부터 찾아라”, “이 실수는 반복된다” 같은 포인터가 어울린다.

Brain은 `50-procedures/`, `60-actions/`, `70-evaluation/`이다. 작업을 할 때 필요한 절차, 과거 결정, 실패 패턴, 검증 기준을 읽는 영역이다. Vault는 `10-sources/`, `20-knowledge/`, `30-context/`, `80-outputs/`다. 지식이 필요할 때 들어가는 원본과 컴파일 지식, 프로젝트 맥락, 산출물의 영역이다.

이 구분은 에이전트의 네이티브 메모리와도 충돌하지 않게 만든다. Claude Code, Codex, OpenClaw 같은 도구는 각자 진입점 파일과 메모리 관습이 있다. AKM은 그 안에 모든 내용을 복사하라고 요구하지 않는다. 각 harness에는 얇은 adapter snippet만 두고, 공유 규칙은 AKM core를 가리키게 한다. “한 몸, 다른 곳은 포인터”라는 설계 원칙이다.

## 핵심은 Learn Back이다

AKM의 운영 루프는 `Ingest → Classify → Compile → Contextualize → Execute → Verify → Learn Back`이다. 앞부분은 지식을 들여오고 분류하고 연결하는 과정이다. 뒤쪽은 실제 실행과 검증, 그리고 학습의 되먹임이다.

여기서 가장 중요한 단어는 Learn Back이다. 실패를 단순히 “이번 세션의 오류”로 버리지 않고, 어떤 레이어가 고쳐져야 하는지 되돌린다. 같은 실수가 반복되면 `70-evaluation/failure-patterns/`에 기록하고 `40-memory/`에 예방 포인터를 추가한다. 절차대로 했는데 결과가 틀렸다면 `50-procedures/`의 검증 단계를 강화한다. 지식이 오래됐으면 `20-knowledge/`를 고치거나 신뢰도를 낮춘다. 저장 위치를 잘못 골랐다면 `00-system/ROUTER.md` 자체가 보완 대상이 된다.

이 점에서 AKM은 “자동으로 진화하는 마법의 메모리”가 아니다. 더 정확히는 에이전트와 사용자가 실패를 어디에 기록하고, 무엇을 고쳐야 다음 실행이 좋아지는지 합의할 수 있게 해 주는 구조다. 자동화보다 중요한 것은 실패를 잃어버리지 않는 라우팅이다.

## 어떻게 붙이는가

사용 방식은 의외로 가볍다. 저장소를 클론하고, 사용하는 도구의 adapter 문서를 고른다. 현재 AKM 저장소에는 [Claude Code adapter](https://github.com/DECK6/akm/blob/main/adapters/claude-code/README.md), [Codex adapter](https://github.com/DECK6/akm/blob/main/adapters/codex/README.md), [OpenClaw adapter](https://github.com/DECK6/akm/blob/main/adapters/openclaw/README.md), 그리고 [custom adapter 안내](https://github.com/DECK6/akm/blob/main/adapters/README.md)가 포함되어 있다.

그 다음 에이전트의 진입점 파일, 예를 들면 `CLAUDE.md`나 `AGENTS.md`에 snippet을 붙이고 실제 AKM 경로를 지정한다. 에이전트가 지식을 저장하거나 찾아야 할 때는 [`00-system/ROUTER.md`](https://github.com/DECK6/akm/blob/main/00-system/ROUTER.md)의 분류 트리를 따라가고, 반복 실행과 피드백은 [`00-system/LOOP.md`](https://github.com/DECK6/akm/blob/main/00-system/LOOP.md)의 루프로 돌아간다. 인스턴스 검증은 [`scripts/lint.mjs`](https://github.com/DECK6/akm/blob/main/scripts/lint.mjs)로 schema, enum, 레이어 배치, 깨진 링크, INDEX 정합성, secret pattern을 점검할 수 있다.

공개 저장소는 시스템 파일과 adapter, template, lint 스크립트를 배포한다. 실제 개인 지식이 들어가는 레이어들은 로컬 인스턴스 데이터로 남기는 설계다. 그래서 AKM은 팀이나 개인이 자기 환경에서 사적으로 쓰면서도, core 규칙은 계속 업데이트할 수 있다.

## 왜 지금 필요한가

에이전트가 한두 번 질문에 답하는 도구라면 이런 구조는 과하다. 그러나 에이전트가 프로젝트를 읽고, 작업을 실행하고, 실패를 고치고, 다음 세션에도 이어서 일해야 한다면 문제가 달라진다. 더 큰 컨텍스트 윈도우만으로는 저장 위치, 신뢰도, 재사용성, 검증 기준을 자동으로 해결하지 못한다.

AKM은 지식 관리를 “많이 저장하기”에서 “어디에 저장해야 다음 실행이 좋아지는가”로 바꾼다. Memory에는 포인터를, Knowledge에는 재사용 지식을, Context에는 특정 프로젝트의 사실을, Procedure에는 반복 절차를, Evaluation에는 실패와 품질 기준을 둔다. 이 단순한 분리만으로도 에이전트의 장기 작업은 훨씬 덜 흐려진다.

시작점은 여기다: [github.com/DECK6/akm](https://github.com/DECK6/akm). AKM은 완성된 보안 제품이나 만능 자동 학습 엔진이 아니라, 파일을 읽고 쓰는 에이전트에게 장기 운영의 뼈대를 제공하는 Markdown 기반 시스템이다. 그 겸손함이 오히려 장점이다. 복잡한 플랫폼을 먼저 세우지 않고도, 오늘의 실패를 내일의 절차와 기억으로 되돌릴 수 있기 때문이다.
