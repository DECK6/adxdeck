---
type: article
track: ai-ax
title: "에이전트 루프가 제어 그래프를 필요로 하는 시점"
slug: when-agent-loops-need-control-graphs
aliases:
  - "When Agent Loops Need Control Graphs"
author:
  - "[[육대근]]"
date created: 2026-07-25
date modified: 2026-07-25
tags:
  - article
  - ai-agent
  - control-graph
  - agent-workflow
  - akm
  - AI
description: "긴 에이전트 실행에서 상태, 출처 계보, 실패 복구 경로를 제어 그래프로 외부화해야 하는 조건을 살핀다."
thumbnail: images/when-agent-loops-need-control-graphs-cover.png
status: completed
---

# 에이전트 루프가 제어 그래프를 필요로 하는 시점

![하나의 빛 경로가 여러 상태 노드와 분기, 합류, 복구 경로로 바뀌는 추상 설치 장면](images/when-agent-loops-need-control-graphs-cover.png)

## 현재 문제

짧은 에이전트 작업에는 루프 하나면 충분하다. 모델이 다음 행동을 고르고, 도구 결과를 읽고, 끝났다고 판단할 때까지 반복한다. 문서 하나를 요약하거나 날짜를 확인하는 일에 상태 데이터베이스와 라우터를 먼저 붙이는 일은 낭비에 가깝다.

실행 시간 자체보다, 중간 상태를 다시 확인하고 그 결과를 책임져야 할 때 복잡성이 커진다. 가령 여러 자료를 동시에 읽고, 일부 실패를 견디며, 사람의 승인을 기다렸다가, 프로세스가 꺼져도 같은 지점에서 이어야 하는 작업이 그렇다. 대화 기록에는 주문 ID, 재시도 횟수, 승인 여부, 근거가 된 문서 버전이 한데 섞인다. 모델은 어느 API를 다시 부를지 매번 새로 판단하고, 실패 뒤에는 완료된 단계까지 반복한다. 프롬프트를 늘려도 상태 관리는 생기지 않는다.

## 개념과 근거

제어 그래프는 에이전트의 일을 노드와 전이, 명시적 상태로 드러낸 실행 구조다. 노드는 자료 읽기, 검증, 승인 요청처럼 책임이 정해진 작업이고, 엣지는 단순한 "그다음"이 아니라 실제 데이터 전달이나 안전 순서다. 실패한 노드는 재시도, 대체 경로, 보류(HOLD), 사람 인계 중 어디로 갈지도 정해져 있어야 한다.

2024년 논문 StateFlow는 복합 과업을 상태 머신으로 보고, 상태와 상태 전이로 다루는 "process grounding"과 상태 안에서 수행하는 하위 작업을 구분했다. 이 구분의 실용적 의미는 모델에게 모든 제어를 맡기지 않는 데 있다. Anthropic도 2024년 글에서 미리 정의된 코드 경로로 모델과 도구를 조정하는 workflow와, 모델이 과정과 도구 사용을 동적으로 이끄는 agent를 나눴다. 실무에서는 두 방식을 섞어 쓸 수 있다. 정해진 경계는 코드와 상태가 맡고, 경계 안의 판단은 모델이 맡는다.

명시적 상태에는 대화 전문보다 `run_id`, 현재 단계, 산출물 참조, 재시도 횟수, 승인 상태처럼 재개에 필요한 값을 둔다. LangGraph 공식 문서는 checkpointer가 한 thread의 graph state를 checkpoint로 보존해 중단 후 재개와 장애 복구에 쓰인다고 설명한다. interrupt도 같은 `thread_id`로 상태를 다시 불러오지만, 재개 시 해당 노드가 처음부터 다시 실행될 수 있다. 따라서 checkpoint만 믿을 것이 아니라 노드를 멱등하게 만들고 외부 전송에는 고유 작업 ID와 영수증 확인을 붙여야 한다.

## 작동 방식

긴 조사·작성 작업은 다음처럼 바뀔 수 있다.

```text
범위 확정
→ 자료별 읽기 병렬 분기
→ 출처 직접 확인
→ 누락·충돌을 판정하는 합류 지점
→ 단일 작성자
→ 근거·형식 감사
→ 통과 / 제한된 수정 / 사람 인계
```

도식보다 먼저 정할 것은 노드 사이의 계약이다. 각 분기가 받는 입력과 돌려주는 결과의 구조, 자료 하나가 열리지 않을 때 계속할 수 있는 최소 성공 수, 수정 루프의 상한, 작성 직전 장애가 났을 때 재개할 checkpoint를 적는다. 이 값들이 없으면 그래프를 그려도 제어는 여전히 프롬프트 안에 숨어 있다.

출처 계보(lineage)도 별도 필드로 남겨야 한다. 어떤 문서의 어느 버전과 위치를 읽었고, 그 결과가 어느 주장과 노드 출력에 쓰였는지 연결해야 한다. OpenAI Agents SDK의 tracing 문서는 한 workflow의 끝까지를 trace로, 그 안의 작업을 parent 관계가 있는 span으로 기록한다. 이는 실행 경로를 조사하는 데 유용하지만, trace가 있다는 이유만으로 주장이 사실이 되지는 않는다. 실행 계보는 근거 검증과 이어져야 하지만, 둘은 같은 작업이 아니다.

## AKM과 공개 GitHub에서 보이는 것

2026년 7월 25일 직접 확인한 공개 저장소 [DECK6/akm](https://github.com/DECK6/akm)의 default branch는 `main`이었다. 당시 HEAD `2efc02b040ec86948005fa634ae1a3b43a184a3f`의 [`99-system/LOOP.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/LOOP.md)는 `Ingest → Classify → Compile → Contextualize → Execute → Verify → Learn Back`을 운영 루프로 둔다. 이것은 한 번의 에이전트 실행 그래프가 아니라 지식이 장기간 순환하는 수명주기다. 다만 Execute 뒤에 Verify가 있고 실패가 Learn Back으로 돌아간다는 구조는 긴 실행이 가져야 할 제어 계약을 보여 준다.

같은 커밋의 [`99-system/ROUTER.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/ROUTER.md)는 재현, 검증, 복구, 인계에 필요한 실행 기록만 `60-actions/`에 남기고 반복될 실패와 복구 방법을 `70-evaluation/`로 보낸다. [`99-system/EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)는 근거를 `candidate → direct-read → claim-supported`로 전이시키면서 원출처 ID, 위치, revision과 checksum을 보존한다. AKM이 그래프 런타임이라는 뜻은 아니다. AKM은 다음 실행이 읽을 지식·근거·실패 기록을 정리하고, 실제 checkpoint·권한·스케줄링은 연결된 런타임이 맡는다.

## 한계

그래프 모양만으로 신뢰성이 생기지는 않는다. 상태를 메모리에만 두면 재시작 때 사라지고, 복구 엣지에 상한이 없으면 무한 재시도가 된다. 여러 분기는 호출 비용과 rate limit을 늘리며, 합류 지점은 가장 느린 분기를 기다린다. 스키마 변경, checkpoint 보존 기간, 경로별 테스트도 새 유지비다. 단순 루프에 외부 큐와 영속 상태를 붙여 같은 요구를 충족할 수도 있다.

## 설계 시사점

루프 횟수만 세어서는 전환 시점을 잡기 어렵다. 장애 뒤 이어야 하는가, 중간 승인이 있는가, 독립 분기와 합류가 있는가, 역할마다 권한이 다른가, 결과의 근거와 실행 경로를 다시 설명해야 하는가를 본다. 이 가운데 하나라도 실패 비용이 크다면 상태와 전이를 외부화할 이유가 생긴다. 실패해도 처음부터 다시 하면 되는 짧은 작업은 루프로 남겨 두는 편이 낫다.

제어 그래프를 쓴다고 모델의 자율성을 모두 없앨 필요는 없다. 모델이 잘하는 판단의 공간은 남기고, 반복되면 위험한 결정만 상태·정책·복구 엣지로 고정한다. 에이전트가 오래 일할수록 현재 위치와 돌아갈 길을 외부 상태에 남기는 편이 프롬프트를 계속 늘리는 것보다 낫다.

## Sources consulted

- Wu et al., ["StateFlow: Enhancing LLM Task-Solving through State-Driven Workflows"](https://arxiv.org/abs/2403.11322), 2024.
- Anthropic, ["Building effective agents"](https://www.anthropic.com/engineering/building-effective-agents), 2024-12-19.
- LangGraph 공식 문서, ["Persistence"](https://docs.langchain.com/oss/python/langgraph/persistence).
- LangGraph 공식 문서, ["Interrupts"](https://docs.langchain.com/oss/python/langgraph/interrupts).
- OpenAI Agents SDK 공식 문서, ["Tracing"](https://openai.github.io/openai-agents-python/tracing/).
- [DECK6/akm 공개 저장소](https://github.com/DECK6/akm) (`main` 확인)
- AKM [`LOOP.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/LOOP.md), [`ROUTER.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/ROUTER.md), [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md) (확인 커밋 고정)

아이디어 발견에는 Graph Engineering 관련 source bundle을 참고했지만, 외부 기술 주장은 위 논문과 공식 문서를 직접 읽어 대조했다.
