---
type: article
track: ai-ax
title: "에이전트의 장기 기억은 검색보다 시간 관리가 어렵다"
slug: long-term-agent-memory-is-a-time-problem
aliases:
  - "Long-Term Agent Memory Is a Time Problem"
author:
  - "육대근"
date created: 2026-07-29
date modified: 2026-07-29
tags:
  - article
  - ai-agent
  - long-term-memory
  - temporal-reasoning
  - knowledge-management
  - akm
  - AI
description: "장기 기억 에이전트가 과거 정보를 찾는 데서 그치지 않고 변경 시점, 유효 기간, 충돌과 기권을 다뤄야 하는 이유를 최근 벤치마크와 AKM 공개 설계에 연결해 살핀다."
thumbnail: images/long-term-agent-memory-is-a-time-problem-cover.png
status: completed
---

# 에이전트의 장기 기억은 검색보다 시간 관리가 어렵다

![서로 다른 시점의 기억 조각이 시간축과 검증 경로를 따라 현재 상태로 모이는 추상 개념 이미지](images/long-term-agent-memory-is-a-time-problem-cover.png)

## 기억이 틀리는 순간은 대개 정보가 바뀐 뒤다

장기 기억을 붙인 에이전트가 과거 대화에서 사용자의 직업을 정확히 찾아냈다고 하자. 그 답은 한때 맞았을 수 있다. 사용자가 이직한 뒤에도 같은 기록을 꺼낸다면 검색은 성공했지만 기억은 실패한 셈이다. "지금 어디에서 일하는가"와 "작년에는 어디에서 일했는가"는 같은 문서를 찾아도 답이 달라야 한다.

저장 용량이나 context window만 늘려서는 풀리지 않는다. 오래된 사실과 새 사실이 함께 검색됐을 때 어느 쪽이 현재 유효한지 판단해야 한다. 새 정보가 기존 정보를 완전히 대체하는지 일부만 수정하는지도 구분해야 하고, 답할 근거가 모자라면 멈출 수 있어야 한다. 장기 기억의 병목은 과거 정보를 찾는 능력에서 시간에 따라 바뀌는 상태를 관리하는 능력으로 이동한다.

## 벤치마크가 검색 성공과 기억 성공을 갈라놓는다

2024년 10월 14일 공개되고 ICLR 2025 논문으로 게재된 [LongMemEval](https://arxiv.org/abs/2410.10813v2)은 장기 기억을 정보 추출, 여러 세션에 걸친 추론, 시간 추론, 지식 갱신, 답변 기권의 다섯 능력으로 나눴다. 500개 질문을 길이를 조절할 수 있는 사용자와 어시스턴트의 대화 이력 안에 배치했다. 97개 질문과 3~6개 세션으로 구성한 상용 시스템 pilot에서 GPT-4o 기반 ChatGPT와 Coze는 같은 모델의 offline-reading 조건보다 각각 37%, 64% 낮았다. 약 11만 5천 token의 전체 이력을 읽힌 long-context 실험에서는 정답 근거 세션만 제공한 oracle 조건보다 30~60% 낮았다.

이 수치를 모든 에이전트의 일반 성능으로 옮길 수는 없다. 평가 시점은 2024년 8월이고, 질문은 연구진이 만든 task-oriented 대화에 심어졌다. 그래도 평가 항목을 나눈 방식은 실무에 쓸 만하다. 관련 기록을 찾았는지와 그 기록을 현재 질문에 맞게 읽었는지는 다른 검사다. LongMemEval도 장기 기억을 indexing, retrieval, reading의 세 단계로 분해한다. 시간 정보를 사실과 연결하고 검색 범위를 좁힌 설계는 시간 추론 subset의 recall을 6.8~11.3% 높였지만, 완벽한 recall만으로 답변 정확성이 보장되지는 않았다.

2024년 ACL에 실린 [LoCoMo](https://aclanthology.org/2024.acl-long.747/)는 다른 평가 조건에서 같은 문제를 드러낸다. 이 데이터셋은 사람의 검수를 거친 50개 장기 대화로 구성되며, 대화 하나가 평균 304.9 turn, 19.3 session, 9,209.2 token에 걸쳐 이어진다. 질문은 single-hop과 multi-hop뿐 아니라 시간, 상식, adversarial 유형을 포함하고, event summarization은 긴 대화에서 인과와 시간의 연결을 복원하게 한다. long-context와 RAG가 성능을 높였지만 사람 수준에는 미치지 못했고, 특히 시간 추론에서 큰 격차가 남았다. 다만 LoCoMo의 대화는 LLM으로 생성한 뒤 사람이 고친 합성 데이터다. 실제 조직 기록의 권한, 삭제, 동명이인, 불완전한 timestamp까지 재현하는 벤치마크는 아니다.

시간만 맞춘다고 필요한 기록을 찾을 수 있는 것은 아니다. NeurIPS 2024의 [HippoRAG](https://arxiv.org/abs/2405.14831v3)은 LLM이 만든 knowledge graph와 Personalized PageRank를 조합해 passage 사이의 관계를 한 번의 검색 단계에서 따라간다. 보고된 근거는 multi-hop QA 중심이다. 서로 떨어진 정보를 잇는 검색의 가능성은 보여 주지만, 사실의 유효 기간이나 갱신 충돌까지 해결했다는 증거는 아니다. 잘 연결된 그래프와 시간에 맞는 기억은 같은 성질이 아니다.

## 시간형 기억은 사건과 현재 상태를 함께 보존한다

시간을 다루는 기억은 적어도 두 시점을 나눠 기록해야 한다. 하나는 사건이 실제로 일어난 때다. 다른 하나는 시스템이 그 사실을 알게 된 때다. 사용자가 "지난달에 이직했다"고 오늘 말하면 이직 시점과 기록 시점은 다르다. 뒤늦게 들어온 정보가 과거 상태를 고칠 수 있으므로 `created_at` 하나만으로는 충분하지 않다.

2025년 1월 20일 공개된 Zep의 [temporal knowledge graph 논문](https://arxiv.org/abs/2501.13956v1)은 이 두 시간을 bi-temporal model로 구현한다. episode에는 원문과 reference timestamp를 남기고, 관계 edge에는 시스템에서 생성·무효화된 시점과 사실이 유효·무효해진 시점을 따로 둔다. 새 관계가 기존 관계와 시간상 겹치며 모순될 때는 이전 edge를 지우지 않고 유효 종료 시점을 기록한다. 파생된 관계에서 원 episode로 돌아가는 양방향 index도 둔다.

이 시스템 논문의 저자 다섯 명은 모두 Zep AI 소속이며, 성능 수치도 저자 측 실험에서 나왔다. 논문 자체도 source episode로 되돌아가는 경로를 실험에서 직접 평가하지 않았다고 밝힌다. DMR 평가는 대화당 60개 message라 현재 모델의 context window에 들어가며, 단일 turn 사실 검색 위주라는 한계가 있다. 따라서 Zep의 수치를 시간형 memory architecture의 보편적 우위로 읽기보다, 사건 시간과 기록 시간, 현재 상태와 이력, 파생 사실과 원문을 분리한 구현 사례로 보는 편이 정확하다.

특정 제품의 이름을 걷어내면 증거 흐름은 다섯 단계로 정리된다.

1. 원문 episode를 수정하지 않고 actor, source locator, 관찰 시점과 함께 저장한다.
2. 추출한 사실은 원문과 분리된 후보로 만들고, 사건 시점과 유효 기간을 붙인다.
3. 새 사실이 들어오면 이전 기록을 덮어쓰지 않고 `supersedes`, `conflicts_with`, `invalidated_at` 같은 관계로 상태 변화를 남긴다.
4. 검색은 의미 유사도와 함께 질문의 시간 범위를 해석한다. "현재" 질문과 "당시" 질문은 서로 다른 edge 집합을 읽어야 한다.
5. reader에는 선택된 현재 사실만 주지 않는다. 답에 영향을 주는 과거 상태, 충돌, 원문 위치를 함께 전달하고 해소되지 않은 충돌에서는 기권하게 한다.

## AKM에는 기억 엔진보다 먼저 상태 계약이 필요하다

앞선 글들이 이 상태 계약을 보고서 근거, 구조화 출력, 그래프 edge 검증에 적용했다면, 이 글은 같은 계약을 사실의 현재성, 유효 기간, 충돌 보존이라는 장기 기억 문제에 한정한다. 2026년 7월 29일 확인한 공개 [DECK6/akm](https://github.com/DECK6/akm) 저장소의 default branch는 `main`, 확인 commit은 [`2efc02b`](https://github.com/DECK6/akm/tree/2efc02b040ec86948005fa634ae1a3b43a184a3f)였다. 이 버전의 [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)는 memory engine을 구현하지 않지만, 시간형 기억에 필요한 몇 가지 상태를 분리한다.

`EvidenceRow`는 source revision과 `observedAt`을 기록하고, freshness를 `current`, `unknown`, `stale`, `superseded`로 구분한다. 검증 상태도 `candidate → direct-read → claim-supported`로 좁아지며, 나중에 들어온 근거가 기존 지지를 무효화하면 `conflicted`, `stale`, `rejected`로 이동할 수 있다. 이때 이전 locator와 source identity, 검증 이력을 지우지 않는다. 같은 문서의 [`conflicts remain visible`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md#L18-L33) 원칙은 오래된 근거와 새 근거를 점수 평균으로 합쳐 버리지 말라고 요구한다.

이 공개 P0 계약이 bi-temporal graph나 자동 memory retrieval을 운영한다는 뜻은 아니다. [`ENFORCEMENT.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/ENFORCEMENT.md)는 현재 실행되는 enforcement를 zero-dependency read-only validator로 한정하며, 출처가 주장을 지지하는지는 이 validator가 결정할 수 없고 별도 verification 절차에서 판단해야 한다고 적는다. DEXA의 적용도 여기서 시작한다. 새 memory backend를 고르기 전에 어떤 기록이 현재인지, 무엇을 대체했는지, 어느 원문에서 왔는지, 답하지 말아야 할 충돌이 남았는지를 파일과 파생 index가 같은 방식으로 표현하게 만드는 일이다.

## 시간 정보를 넣어도 해결되지 않는 것

Timestamp가 있다고 사건 시간이 정확한 것은 아니다. "지난여름"처럼 상대적인 표현은 해석이 필요하고, 작성 시각과 실제 발생 시각이 다를 수 있다. 두 출처가 서로 다른 날짜를 말하면 최신 기록을 택하는 규칙만으로 진실을 정할 수 없다. 시간상 겹치는 모순에서 새 edge를 우선해 기존 edge의 `t_invalid`를 설정하는 Zep의 규칙도, 법률·의료·조직 정책 같은 고위험 기록의 진실 판정 규칙으로 일반화해서는 안 된다.

기억이 많아질수록 개인정보 보호와 삭제 문제도 커진다. 시간 이력을 보존한다는 설계는 감사에는 도움이 되지만, 사용자가 삭제를 요구한 개인정보를 무기한 남길 이유가 되지 않는다. 접근 권한과 보존 기간, 삭제 전파, 파생 index 재생성을 별도 정책으로 두어야 한다. 장기 기억 평가 역시 한 점수로 끝내기 어렵다. 잘못된 현재화, 필요한 과거의 조기 폐기, 동명이인 병합, 기권 실패는 서로 다른 오류다.

## 설계 시사점

장기 기억 시스템은 "찾았다"를 통과 기준으로 삼지 말아야 한다. 최소한 현재 질문과 과거 시점 질문을 나눠 시험하고, 동일한 사실의 갱신 전후를 모두 넣어야 한다. 정답이 없는 false-premise 질문에서는 답을 만들어내지 않는지도 측정해야 한다. retrieval recall과 최종 답변 정확도, source traceability를 따로 기록해야 검색기와 reader의 실패를 구분할 수 있다.

AKM에서는 canonical Markdown과 원출처를 남기고, 검색 index나 graph는 다시 만들 수 있는 파생물로 유지하는 편이 안전하다. 현재 상태를 가리키는 포인터와 변경 이력을 담은 증거 행을 분리하고, `superseded`와 `conflicted`를 삭제의 다른 이름으로 쓰지 않아야 한다. 어떤 기억이 오래 남는가보다, 어느 시점에 어떤 근거가 유효했고 왜 지금은 달라졌는지를 되짚을 수 있는지가 장기 작업의 신뢰도를 결정한다.

## Sources consulted

- Wu et al., ["LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory"](https://arxiv.org/abs/2410.10813v2), 2024-10-14 공개, 2025-03-04 갱신, ICLR 2025.
- Maharana et al., ["Evaluating Very Long-Term Conversational Memory of LLM Agents"](https://aclanthology.org/2024.acl-long.747/), ACL 2024, DOI [`10.18653/v1/2024.acl-long.747`](https://doi.org/10.18653/v1/2024.acl-long.747).
- Gutiérrez et al., ["HippoRAG: Neurobiologically Inspired Long-Term Memory for Large Language Models"](https://arxiv.org/abs/2405.14831v3), 2024-05-23 공개, 2025-01-14 갱신, NeurIPS 2024; [공개 구현](https://github.com/OSU-NLP-Group/HippoRAG).
- Rasmussen et al., ["Zep: A Temporal Knowledge Graph Architecture for Agent Memory"](https://arxiv.org/abs/2501.13956v1), 2025-01-20 공개; [Graphiti 공개 구현](https://github.com/getzep/graphiti).
- [DECK6/akm 공개 저장소](https://github.com/DECK6/akm), `main` commit [`2efc02b`](https://github.com/DECK6/akm/tree/2efc02b040ec86948005fa634ae1a3b43a184a3f) (2026-07-29 확인); [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md), [`ENFORCEMENT.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/ENFORCEMENT.md).
