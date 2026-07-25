---
type: article
track: ai-ax
title: "에이전트의 맥락은 작업마다 다시 편성되어야 한다"
slug: task-specific-context-budgets
aliases:
  - "Task-Specific Context Budgets"
author:
  - "[[육대근]]"
date created: 2026-07-25
date modified: 2026-07-25
tags:
  - article
  - ai-agent
  - context-engineering
  - knowledge-management
  - akm
  - AI
description: "에이전트 지식 시스템에서 저장량보다 작업별 context budget과 선별 규칙이 중요한 이유를 연구와 AKM 공개 설계에 연결해 살핀다."
thumbnail: images/task-specific-context-budgets-cover.png
status: completed
---

# 에이전트의 맥락은 작업마다 다시 편성되어야 한다

![수많은 맥락 조각 가운데 일부만 선택되어 제한된 작업 공간으로 들어가는 추상 설치 장면](images/task-specific-context-budgets-cover.png)

## 현재 문제

에이전트의 기억을 말할 때 저장량부터 세기 쉽다. 더 많은 대화, 더 긴 문서, 더 큰 벡터 저장소를 붙이면 이전보다 잘 일할 것처럼 보인다. 그러나 저장할 수 있다는 것과 지금 모델에게 보여 줘야 한다는 것은 다른 문제다. 회의록 한 장은 나중에 검색할 수 있어야 하지만, 코드 리뷰와 보도자료 교정에 매번 들어갈 이유는 없다.

긴 context window도 이 구분을 없애지 않는다. 최대 입력 길이는 상한이지, 그만큼 채우라는 권고가 아니다. 현재 요청, 금지 조건, 최신 파일, 도구 결과, 과거 결정이 한 창 안에서 자리를 다툰다. 관련 없는 기억이 늘면 어떤 근거를 따라야 하는지 흐려진다. 오래된 결정과 최신 정책에 권위와 시점 표시가 없다면 충돌을 조정하기도 어렵다.

그래서 에이전트형 지식 관리의 질문은 "얼마나 많이 기억하는가"에서 "이 작업에 어떤 정보를 얼마만큼, 어떤 순서로 넣는가"로 옮겨가야 한다.

## 개념과 근거

맥락 예산(context budget)은 모델의 물리적 한도와 다르다. 한 작업에서 목표·제약·증거·절차·작업 기록에 배정할 입력 예산과 답변·도구 호출을 위해 남겨 둘 여유를 뜻한다. 선별 규칙은 후보를 고르고 제외하며, 필요하면 다시 읽게 만드는 운영 계약이다.

연구는 "창이 길면 모두 잘 읽는다"는 가정을 지지하지 않는다. Liu 등의 TACL 2024 논문 *Lost in the Middle*은 다중 문서 질의응답과 key-value 검색에서 관련 정보의 위치만 바뀌어도 성능이 크게 달라질 수 있음을 보였다. 정보가 긴 입력의 처음이나 끝에 있을 때보다 가운데 있을 때 성능이 낮아지는 현상은 long-context 모델에서도 나타났다. Hsieh 등의 RULER 연구는 단순한 needle-in-a-haystack를 넘어 다중 needle, multi-hop tracing, aggregation을 시험했다. 32K 이상을 표방한 17개 모델 가운데 32K에서 만족스러운 성능을 유지한 모델은 절반뿐이었고, 거의 모든 모델이 길이가 늘수록 큰 성능 저하를 보였다.

두 결과가 짧은 prompt가 언제나 우월하다고 증명하는 것은 아니다. 다만 표기된 context 길이와 실제 과업 수행 길이가 같지 않으며, 정보의 위치와 과업 복잡도가 결과에 관여한다는 근거는 된다. Anthropic도 2025년 공식 기술 글에서 context를 한계효용이 줄어드는 유한 자원으로 다루고, 원하는 결과의 가능성을 높이는 "가장 작은 고신호 토큰 집합"을 찾는 것을 context engineering의 원칙으로 제시했다.

## 작동 방식

실무에서는 검색 전에 작업을 먼저 분류해야 한다. 사실 확인인지, 코드 수정인지, 기획 초안인지에 따라 필요한 근거와 허용 가능한 누락이 다르다. 같은 "프로젝트 기억"이라도 사실 확인에는 원문과 최신성이 중요하고, 코드 수정에는 현재 diff와 테스트 규칙이 먼저이며, 기획에는 사용자 제약과 결정 이력이 더 큰 몫을 차지한다.

맥락 패킷은 목표, 산출물, 금지 사항처럼 빠지면 작업 자체가 달라지는 항목부터 채운다. 그다음 현재 상태와 직접 읽은 근거를 넣는다. 절차와 과거 실패는 해당 부분만 붙이고, 큰 로그와 중간 검색 결과는 요약·경로·위치 정보(locator)를 남긴 뒤 내보낸다. 새 주제로 넘어갈 때는 이전 세션 전체를 넘기지 말고 패킷을 다시 만든다.

선별 순서도 명시해야 한다. 프로젝트 범위와 접근 정책을 통과한 자료만 후보로 삼고, 관련성 점수보다 출처 권위와 적용 범위를 먼저 본다. 신선성은 자격이 같은 자료 사이에서 따진다. 같은 원본의 여러 조각이 상위권을 독점하지 못하게 출처 단위 중복 제거와 상한을 두고, 주변 문맥은 최종 후보에만 확장한다. 중요한 주장은 검색 발췌문이 아니라 직접 읽은 원문으로 확인한다. 제외 이유도 남겨야 다음 실패를 고칠 수 있다.

고정된 마법의 비율은 없다. 예산은 토큰 수만이 아니라 정보 역할별 상한과 퇴출 조건까지 포함해야 한다. 예를 들어 도구 실행이 끝난 뒤 원시 출력은 빼되 명령, 종료 상태, 핵심 관찰, 파일 경로는 남길 수 있다. 반대로 법적 문구나 정밀한 수치처럼 요약 과정에서 손실되기 쉬운 내용은 원문 위치 정보와 함께 보존해야 한다.

## AKM/공개 GitHub 연결

2026년 7월 25일 직접 확인한 공개 저장소 [DECK6/akm](https://github.com/DECK6/akm)의 default branch는 `main`이었다. 당시 HEAD `2efc02b040ec86948005fa634ae1a3b43a184a3f`의 [README.ko.md](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/README.ko.md)는 AKM의 7개 레이어를 로딩 관점에서 Memory, Brain, Vault로 묶는다. Memory는 매 세션 읽는 짧은 포인터, Brain은 작업할 때 읽는 절차·결정·실패 패턴, Vault는 지식이 필요할 때 찾는 원본·지식·맥락·산출물이다. 저장 위치와 로딩 시점을 분리한 셈이다.

같은 커밋의 [EVIDENCE-SCHEMA.md](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)는 후보와 검증을 구분하고, 중요한 주장을 직접 읽은 자료에 연결한다. 범위와 권위는 관련성·신선성보다 앞선다. 출처 단위 중복 제거, 출처별 상한, 선택 결과에만 적용하는 주변 문맥 확장도 명시한다. EvidencePacket 지표에는 입력 바이트와 추정 맥락 토큰이 들어간다. [project retrieval manifest 템플릿](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/templates/project-retrieval-manifest.yaml)은 허용·차단 범위, 검색 경로, 결과 상한, 직접 읽기 정책을 프로젝트 단위로 선언하게 한다.

이 공개 코어가 작업별 토큰 예산을 자동 배분한다고 말할 수는 없다. 현재 설계에서 읽을 수 있는 것은 토대다. 다음 단계는 작업 계약(task contract)이 작업 유형, 입력 상한, 필수 근거 슬롯, 출처 상한, 퇴출 조건을 선언하고, 실행 후 누락·과잉 주입을 `70-evaluation/`으로 되돌리는 것이다.

## 한계

선별은 손실을 만든다. 처음에는 주변 정보처럼 보였던 문장이 뒤늦게 핵심 조건으로 드러날 수 있고, 검색 질의가 나쁘면 좋은 자료는 후보에도 오르지 못한다. 요약은 수치와 예외를 지우기 쉽다. 권위와 최신성 규칙도 조직마다 다르며, token 수가 적다고 맥락의 질이 자동으로 높아지지는 않는다.

예산은 한 번 정하고 끝나는 값이 아니다. 누락 때문인지, 낡은 정보 때문인지, 한 출처의 독점 때문인지 구분해 고쳐야 한다. 고위험 작업에서는 절약보다 원문 확인과 충돌 보존이 우선이다.

## 설계 시사점

기억 시스템은 모든 기억을 현재형으로 만들 필요가 없다. 많이 저장하되 이번 작업에는 적게, 정확히 불러와야 한다. 예산은 모델이나 사용자에게 하나의 숫자로 붙이지 말고 작업 계약에 붙인다. 검색 결과는 후보로 두고, 중요한 주장은 직접 읽은 근거로 승격한다. 선택과 제외의 이유를 남기고, 실패가 생기면 저장량보다 선별 규칙을 먼저 고친다. 필요할 때 원본으로 돌아가 작은 패킷을 다시 만들 수 있어야 장기 작업도 덜 흐려진다.

## Sources consulted

- Liu et al., ["Lost in the Middle: How Language Models Use Long Contexts"](https://aclanthology.org/2024.tacl-1.9/), TACL 2024.
- Hsieh et al., ["RULER: What's the Real Context Size of Your Long-Context Language Models?"](https://arxiv.org/abs/2404.06654), COLM 2024.
- Anthropic, ["Effective context engineering for AI agents"](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), 2025-09-29.
- [DECK6/akm public repository](https://github.com/DECK6/akm) (`main` 확인)
- AKM [`README.ko.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/README.ko.md) (확인 커밋 고정)
- AKM [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md) (확인 커밋 고정)
- AKM [`project-retrieval-manifest.yaml`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/templates/project-retrieval-manifest.yaml) (확인 커밋 고정)
