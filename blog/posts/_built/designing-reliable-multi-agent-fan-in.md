---
type: article
track: ai-ax
title: "병렬 에이전트가 합류하는 순간, 무엇을 보존해야 하나"
slug: designing-reliable-multi-agent-fan-in
aliases:
  - "Designing Reliable Multi-Agent Fan-In"
author:
  - "[[육대근]]"
date created: 2026-08-09
date modified: 2026-08-09
tags:
  - article
  - multi-agent
  - graph-engineering
  - fan-in
  - AI
description: "병렬 에이전트의 출력이 합류할 때 출처 계보, 충돌, 최소 성공 조건, 단일 작성자 책임을 보존하는 팬인 계약을 살펴본다."
thumbnail: images/designing-reliable-multi-agent-fan-in-cover.png
status: completed
---

# 병렬 에이전트가 합류하는 순간, 무엇을 보존해야 하나

![서로 다른 색의 빛 흐름이 투명한 합류 구조를 지나 하나의 경로로 이어지는 장면](images/designing-reliable-multi-agent-fan-in-cover.png)

가령 세 에이전트가 같은 질문을 나눠 맡았다고 하자. 첫 번째는 근거가 달린 답을 보냈고, 두 번째는 시간 제한을 넘겼으며, 세 번째는 첫 번째와 충돌하는 결론을 냈다. 화면에는 결과 두 개와 오류 하나가 남는다. 여기서 빈 값을 지우고 남은 문장만 요약하면 보고서는 매끄럽게 완성될 수 있다. 하지만 무엇이 빠졌고, 왜 충돌했으며, 어느 결과까지 믿어도 되는지는 사라진다.

병렬화는 일을 여러 갈래로 시작하게 해 줄 뿐, 그 결과를 믿을 만한 하나의 산출물로 바꾸지는 않는다. 이번 글은 여러 에이전트의 출력이 합류하는 팬인(fan-in)을 살펴본다. 이 글에서 말하는 **팬인 계약**은 표준화된 제품 기능명이 아니다. 각 분기의 상태와 출처를 보존하고, 누락·충돌·최소 성공 조건을 판정한 뒤, 한 작성자에게 정본 쓰기 권한을 넘기는 설계 규칙을 가리킨다.

## 여러 답이 있다는 것과 믿을 만한 합의는 다르다

다중 에이전트가 성능 이득을 낸 사례는 있다. 2024년 공개된 [Mixture-of-Agents 논문](https://arxiv.org/abs/2406.04692)은 여러 모델을 층으로 배치하고, 다음 층의 각 에이전트가 이전 층의 모든 출력을 보조 정보로 읽게 했다. 저자들이 공개한 실험에서 오픈소스 모델만 사용한 구성은 AlpacaEval 2.0의 length-controlled 승률로 65.1%를 기록했고, 같은 표에 제시된 GPT-4 Omni의 57.5%를 앞섰다. 이는 해당 모델 구성과 당시 평가 조건에서 여러 출력을 다시 읽는 구조가 답변 품질을 높일 수 있음을 보여 준다. 모든 과업과 최신 모델 조합에서 같은 이득이 난다는 뜻은 아니다.

실패를 추적한 연구도 있다. 2025년 갱신된 [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657v3)은 7개 공개 다중 에이전트 시스템에서 수집한 실행 trace 1,642개를 분석했다. 연구진은 실패를 14개 유형으로 나누고 이를 시스템 설계, 에이전트 간 불일치, 과업 검증의 세 범주로 묶었다. 역할 지시 불이행, 종료 조건 인식 실패, 다른 에이전트 입력 무시, 불완전하거나 잘못된 검증처럼 합성 이전과 이후에 걸친 문제가 함께 나타났다.

이 두 결과는 서로 모순되지 않는다. Mixture-of-Agents는 출력 집합을 다음 모델이 활용할 수 있다는 가능성을 보여 주고, 실패 분류 연구는 여러 모델을 연결했다는 사실만으로 견고한 시스템이 되지 않는다는 점을 보여 준다. 이 결과는 팬인의 핵심이 문장을 자연스럽게 섞는 능력만은 아니라는 점을 드러낸다. 합치기 전에 각 분기의 성공과 실패를 표현하고, 합친 뒤에도 근거와 충돌을 되찾을 수 있어야 한다.

## 팬인 계약은 합치기 전에 실패를 표현한다

팬인은 답을 한데 모으는 단계에 그치지 않는다. reducer나 aggregator가 읽을 입력은 자유 형식 문장 묶음보다 상태가 있는 결과여야 한다. 가장 작은 형태는 다음과 같이 생각할 수 있다.

```text
BranchResult = {
  status: success | empty | unavailable | conflicted
  artifact: ...
  source_revision: ...
  evidence_locator: ...
  error: ...
}
```

여기서 `status`는 빠진 분기를 빈 문자열과 구분한다. `source_revision`과 `evidence_locator`는 결과가 어느 자료의 어느 지점에서 왔는지 남긴다. `conflicted`는 한쪽을 즉시 버리는 대신 서로 다른 결과가 존재한다는 사실을 다음 단계로 전달한다. 이 필드는 예시다. 실제 시스템의 과업과 위험에 맞춰 누락과 충돌을 표현할 수 있어야 한다.

그다음 reducer는 형식을 맞추고 중복을 줄이되, 출처가 다른 충돌까지 평균 내어 지우면 안 된다. 같은 URL을 두 에이전트가 읽었다면 중복 근거일 수 있고, 서로 독립된 두 자료가 다른 결론을 낸다면 해결해야 할 충돌일 수 있다. 문자열 유사도만으로 둘을 같은 것으로 처리할 수 없는 이유다. 병합 결과에는 채택한 항목뿐 아니라 제외된 분기, 제외 사유, 해결되지 않은 충돌이 남아야 한다.

다음 coverage gate는 "충분히 모였는가"를 판단한다. 필수 출처 네 곳을 모두 확인하는 과업이라면 세 곳만 성공했을 때 `HOLD`가 맞다. 가능한 자료를 최대 네 곳까지 모으는 과업이라면 세 곳으로 진행하되 누락을 표시할 수 있다. 같은 실행 결과라도 성공 조건이 다르면 terminal 상태가 달라진다. 최소 성공 수와 필수 분기를 팬아웃 전에 적어 두어야 하는 이유다.

정본은 한 작성자만 쓴다. 여러 분기가 같은 파일이나 데이터베이스 레코드를 직접 고치면 내용 충돌과 파일 충돌이 겹친다. 분기마다 고유 산출물을 만들고, reducer와 coverage gate를 통과한 뒤, 한 writer가 정본을 갱신해야 한다. 병렬 조사는 여러 명이 할 수 있지만 최종 쓰기 책임까지 병렬화할 필요는 없다.

## 공개 AKM에 적용하면 EvidencePacket은 답이 아니라 합류 기록이다

2026년 8월 9일 확인한 공개 [DECK6/akm 저장소](https://github.com/DECK6/akm)의 default branch는 `main`이며, HEAD는 [`2efc02b`](https://github.com/DECK6/akm/tree/2efc02b040ec86948005fa634ae1a3b43a184a3f)였다. 이 커밋의 [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)는 P0 `EvidenceRow`와 `EvidencePacket`의 공개 계약이다. 문서 자체가 이를 실행 중인 다중 에이전트 런타임이 아니라, 정본 Markdown과 원출처 위에 놓이는 재생성 가능한 파생 계층으로 한정한다.

이 계약은 검색된 후보를 `candidate`, 원문 위치를 직접 읽은 상태를 `direct-read`, 특정 주장에 대한 지지가 확인된 상태를 `claim-supported`로 나눈다. 충돌은 평균 내지 않고 `conflicted`로 남기며, 필수 주장의 근거가 없거나 충돌이 해결되지 않았으면 packet verdict를 `HOLD`로 둘 수 있다. 특히 문서는 `EvidencePacket`이 근거 준비 상태에서 `PASS`하더라도 답이나 산출물은 아직 작성되지 않았을 수 있다고 명시한다.

여기서부터는 DEXA의 설계 해석이다. 각 조사 분기의 결과를 `EvidenceRow`처럼 취급하고, reducer가 만든 `EvidencePacket`을 합류 기록으로 삼을 수 있다. `claim-supported`에 이르지 못한 항목은 최종 주장의 근거로 승격하지 않고, 해결되지 않은 충돌은 writer에게 숨기지 않는다. packet이 준비 상태를 통과한 뒤 한 writer가 글을 작성하게 하면, "근거가 모였다"와 "최종 답이 승인됐다"를 분리할 수 있다. 공개 AKM에 이 다중 에이전트 fan-in runtime이 구현돼 있다는 주장은 아니다.

## 합류 지점에도 비용과 실패가 있다

팬인 계약은 무료가 아니다. 모든 분기를 비교해야 하는 barrier는 가장 느린 분기를 기다린다. 워커 수가 늘면 모델 호출, token, 네트워크, rate limit 부담도 함께 커질 수 있다. wall-clock time이 줄었다고 총비용이 줄었다고 단정할 수 없다. 출력 스키마와 상태 전이, 재시도 정책을 유지하는 비용도 생긴다.

reducer도 새로운 오류 지점이다. 다수의 비슷한 답을 선호하다가 소수의 정확한 근거를 지울 수 있고, 모델 기반 요약기는 출처가 다른 두 문장을 하나의 합의처럼 만들 수 있다. 모든 원문을 한 번에 넣으면 맥락이 비대해지고, 지나치게 짧게 압축하면 판정에 필요한 조건이 사라진다. 결정론적 정규화·필드 검증·중복 제거와 모델이 맡을 충돌 해석을 나눠 맡기는 편이 낫다. 나눈다고 사실성이 자동 보장되는 것은 아니며, 중요한 주장은 원출처 직접 읽기와 별도 검증이 필요하다.

작은 과업에는 이 구조가 과하다. 한 문서에서 날짜 하나를 찾거나, 실패해도 처음부터 다시 하면 되는 짧은 작업은 단일 에이전트와 간단한 script가 더 투명하다. [StateFlow](https://arxiv.org/abs/2403.11322v5)가 상태와 전이로 수행 절차를 고정하는 `process grounding`과 상태 안의 하위 과업을 구분했듯, 외부화할 제어가 실제로 있을 때만 그래프와 상태 계약이 비용을 정당화한다. 팬인이 필요해서 워커를 늘리는 것이 아니라, 독립 작업이 이미 있고 그 결과의 누락·충돌·쓰기 책임을 관리해야 할 때 팬인 계약이 필요하다.

## 설계 시사점: 워커 수보다 합류 규칙을 먼저 적는다

다중 에이전트 설계를 시작할 때 모델 목록보다 먼저 다음 질문에 답해야 한다.

- 각 분기는 성공, 빈 결과, 접근 실패, 충돌을 어떻게 구분해 반환하는가?
- 필수 분기와 최소 성공 수는 무엇이며, 어떤 누락에서 `HOLD`하는가?
- reducer는 출처 계보와 반대 근거를 어떤 구조로 보존하는가?
- 최종 산출물의 유일한 writer는 누구이며, 쓰기 전후의 검증과 readback은 무엇인가?

이 질문에 답하지 못한 병렬화는 fan-out만 있고 fan-in은 없는 구조다. 병렬 에이전트의 품질은 몇 개를 동시에 실행했는가보다 합류 지점에서 무엇을 지우지 않았는가로 드러난다. 속도와 관점의 다양성은 fan-out이 만들 수 있지만, 누락을 숨기지 않고 충돌을 보존하며 정본 쓰기를 통제하는 책임은 fan-in에 남는다.

## Sources consulted

- Wang et al., ["Mixture-of-Agents Enhances Large Language Model Capabilities"](https://arxiv.org/abs/2406.04692), 2024-06-07.
- Cemri et al., ["Why Do Multi-Agent LLM Systems Fail?"](https://arxiv.org/abs/2503.13657v3), arXiv v3 2025-10-26, NeurIPS 2025 Datasets and Benchmarks Track.
- Wu et al., ["StateFlow: Enhancing LLM Task-Solving through State-Driven Workflows"](https://arxiv.org/abs/2403.11322v5), COLM 2024.
- [DECK6/akm 공개 저장소](https://github.com/DECK6/akm), `main` commit [`2efc02b`](https://github.com/DECK6/akm/tree/2efc02b040ec86948005fa634ae1a3b43a184a3f) (2026-08-09 확인).
- AKM [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md) (P0 `EvidenceRow`·`EvidencePacket` 계약).
