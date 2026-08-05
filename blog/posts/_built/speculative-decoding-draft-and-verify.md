---
type: article
track: ai-ax
title: "작은 모델이 먼저 쓰고, 큰 모델이 한 번에 확인한다"
slug: speculative-decoding-draft-and-verify
aliases:
  - "Speculative Decoding Draft and Verify"
author:
  - "육대근"
date created: 2026-08-06
date modified: 2026-08-06
tags:
  - article
  - speculative-decoding
  - llm-inference
  - model-serving
  - inference-optimization
  - akm
  - AI
description: "추측 디코딩이 작은 초안 모델과 큰 목표 모델의 역할을 나눠 생성 지연을 줄이는 원리, 실제 성능의 조건, 그리고 이 구조를 AKM의 후보·직접 읽기·주장 지지 경계와 혼동하지 말아야 하는 이유를 살핀다."
thumbnail: images/speculative-decoding-proposal-verification-cover.png
status: completed
---

# 작은 모델이 먼저 쓰고, 큰 모델이 한 번에 확인한다

![여러 후보 경로가 검증 면을 통과하며 하나의 수락된 흐름으로 이어지는 추상 개념 이미지](images/speculative-decoding-proposal-verification-cover.png)

## 한 토큰씩 기다리는 병목

대화형 LLM이 문장을 만드는 과정은 겉보기보다 순차적이다. 다음 토큰을 계산하려면 직전 토큰이 먼저 정해져야 한다. 한 번의 응답에서 수백 토큰을 내보내면 큰 모델의 forward pass도 수백 번 이어진다. batch size가 작은 대화형 요청에서는 계산보다 모델 가중치를 메모리에서 읽는 데 더 오래 걸려 병목이 생기기도 한다.

추측 디코딩(speculative decoding)은 이 순서를 없애지 않는다. 대신 작은 초안 모델이 다음 토큰 여러 개를 먼저 제안하고, 큰 목표 모델이 그 후보를 한 번의 병렬 계산으로 평가하게 만든다. 목표 모델이 받아들인 prefix는 남고, 처음 거부된 지점부터는 목표 모델의 분포에 맞춰 다시 샘플링한다. 작은 모델의 답을 그대로 쓰는 방식과는 다르다. 비싼 목표 모델을 매 토큰마다 직렬로 호출하던 일을 여러 후보를 한꺼번에 확인하는 계산으로 묶는다.

2023년 ICML에 실린 [Leviathan 등의 논문](https://proceedings.mlr.press/v202/leviathan23a.html)은 이 계열의 기초가 된 결과다. 저자들은 T5-XXL 실험에서 표준 T5X 구현보다 2~3배 빠른 결과를 보고했다. 이 논문은 현재의 최신 기법을 대표하기보다, 수락·거부와 보정 분포 재샘플링을 결합한 speculative sampling으로 목표 모델의 출력 분포를 바꾸지 않고 초안 토큰을 처리할 수 있음을 보인 계보로 읽어야 한다.

여기서 말하는 "확인"은 사실 검증이 아니다. 목표 모델이 판단하는 것은 초안 토큰이 자신의 확률 분포에서 수락 가능한가이다. 목표 모델 자체가 잘못된 사실을 높은 확률로 내놓는다면 추측 디코딩은 그 오류를 고치지 않는다. 분포 보존은 구문 정확성, 출처 지지, 안전한 도구 실행을 보장한다는 뜻도 아니다.

## 속도는 수락률 하나로 결정되지 않는다

수락률이 높아도 느릴 수 있다. 초안 모델이 충분히 싸야 하고, 목표 모델의 병렬 검증 비용이 여러 번의 순차 디코딩보다 작아야 하며, 추가 메모리와 backend 구현도 감당할 수 있어야 한다. 초안 길이를 늘리면 한 번의 목표 모델 호출로 더 많은 토큰을 처리할 기회가 생기지만, 거부 뒤에 버리는 계산도 늘어난다. EAGLE과 arXiv:2607.17283v1의 해당 실험에서는 뒤쪽 제안에서 예측 오차가 누적되고 위치별 수락률이 낮아지는 경향이 관찰됐다. 이는 모든 모델과 workload에서 수락률이 단조 감소한다는 보편 법칙은 아니다.

ICML 2024의 [EAGLE](https://proceedings.mlr.press/v235/li24bt.html)은 별도의 작은 언어 모델이 토큰을 예측하게 하는 대신, 목표 모델의 상위 직전 층 feature를 예측하는 초안 구조를 제안했다. Vicuna, LLaMA2-Chat, Mixtral 8x7B Instruct와 대화·코드·수학·지시 이행 과제를 평가했다. 논문은 LLaMA2-Chat 70B에서 2.7~3.5배 latency speedup과 약 두 배의 throughput을 보고했다. 같은 논문에서 Mixtral 8x7B Instruct의 속도 향상은 1.5배였다. 모델 구조와 초안 수락 길이가 달라지면 같은 방법의 효과도 달라진다.

논문 수치가 deployment에서 그대로 재현되는 것은 아니다. 2026년 7월 30일 확인한 [vLLM 추측 디코딩 문서](https://docs.vllm.ai/en/latest/features/speculative_decoding/)는 이 기능을 medium-to-low QPS의 memory-bound workload에서 inter-token latency를 줄이는 방법으로 설명한다. 현재 문서는 multi-token prediction, 별도 draft model, n-gram, suffix decoding을 지원 방식으로 소개하고, 모델 family, traffic pattern, hardware, sampling setting에 맞춘 benchmark를 권고한다. 문서 표기 2026년 7월 2일 기준으로 draft model 방식은 vLLM 0.10.0 이하에서, pipeline parallelism은 vLLM 0.15.0 이하에서 지원되지 않는다. 버전에 따라 바뀌는 조건이므로 최신 문서에서 다시 확인해야 한다.

2026년 7월 19일 공개된 단일 저자 preprint [《Lossless but Not Free》](https://arxiv.org/abs/2607.17283v1)은 이 간극을 소비자용 Apple silicon 한 대에서 시험했다. 주요 `K=4` 비교에서 두 조합은 각각 약 1.57배와 1.40배 빨랐고, 세 조합은 약 0.50배, 0.52배, 0.33배로 기준선보다 느렸다. `K` sweep의 관측 최고점은 `K=6`의 1.61배였지만, 같은 구성은 `K=2~6`에서 비슷한 범위의 속도 향상을 보였고 표준편차도 겹쳤다. 따라서 `K=6`을 통계적으로 유일한 최적점으로 읽어서는 안 된다. 저자는 초안이 목표 모델보다 충분히 빠르지 않거나 quantized Metal backend가 병렬 검증을 사실상 직렬로 처리한 경우를 원인으로 분리했다. 이 결과는 한 장비와 제한된 조합에서 나온 preprint라 일반 성능표로 쓸 수 없다. 수학적 보장과 실제 wall-clock 개선을 따로 재야 한다는 경고로는 쓸 수 있다.

## AKM에서 후보와 근거를 나누는 이유

DEXA에 필요한 부분은 제안자와 승인자의 역할을 나누고, 제안 비용·수락 조건·승인 권위를 따로 측정하는 방식이다. "작은 모델을 쓰면 빠르다"는 결론을 지식 시스템에 그대로 옮길 수는 없다.

앞선 DEXA 글들은 같은 상태 계약을 보고서 근거 평가, 구조화 출력, 그래프 edge 검증, 장기 기억의 최신성 문제에 적용했다. 여기서는 그 적용 범위를 추측 디코딩의 "제안과 검증" 비유에 한정한다. 2026년 7월 30일 확인한 공개 [DECK6/akm](https://github.com/DECK6/akm) 저장소의 `main`은 commit [`2efc02b`](https://github.com/DECK6/akm/tree/2efc02b040ec86948005fa634ae1a3b43a184a3f)를 가리켰다. 이 버전의 [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)와 [`evidence-row.schema.json`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/evidence-row.schema.json)은 P0 `EvidenceRow`·`EvidencePacket` 데이터 계약의 공개 원문이지, 실행 중인 verifier나 retrieval service의 설명서가 아니다. P0는 connector, database, embedding model, reranker를 구현하지 않는다. 이 계약에서 검색 결과는 `candidate`다. 지정 위치를 실제로 읽고 관찰한 revision이나 가능한 checksum을 기록해야 `direct-read`가 된다. 특정 `claimId`와 지지 관계까지 확인한 결과만 `claim-supported`로 좁혀진다.

겉모양은 초안과 목표 모델의 관계와 비슷하다. 저렴한 검색 lane이 후보를 넓게 제안하고, 더 비싼 직접 읽기가 후보를 줄인다. 다만 두 검증은 같은 일이 아니다. 추측 디코딩의 verifier는 목표 모델 분포에 맞는지를 계산한다. AKM의 검증자는 출처가 특정 주장을 실제로 지지하는지 읽고 판단해야 한다. 검색 후보 여러 개를 LLM에 한꺼번에 넣었다고 이 판단이 자동으로 보존되지는 않는다. 공개 스키마가 "candidate is not verification"을 불변 조건으로 둔 이유다.

AKM에 옮길 수 있는 것은 역할 분리와 계보 보존이다. 검색 점수가 높은 항목을 먼저 읽되, 점수를 사실성으로 바꾸지 않는다. 직접 읽은 locator와 관찰한 revision을 남기고, 지지 범위를 claim 단위로 좁힌다. 후보가 탈락해도 왜 탈락했는지 기록하면 다음 retrieval과 평가를 고칠 수 있다. 초안 생성 속도와 최종 근거 품질도 한 점수로 뭉치지 않는다.

## 분포 보존이 보장하지 않는 것

추측 디코딩은 목표 모델의 품질을 높이는 학습법이 아니다. lossless sampling이라는 표현도 목표 분포를 보존한다는 좁은 뜻이다. vLLM 문서는 hardware numeric precision과 batch size에 따른 logprob 차이를 경고하고, 같은 요청의 token log probability 안정성을 보장하지 않는다고 밝힌다. 알고리즘 수준의 분포 보존과 bitwise deterministic output은 같은 조건이 아니다.

2023년 논문은 latency를 줄이는 대신 동시 계산과 산술 연산이 늘 수 있다고 설명한다. compute 여유가 없거나 요청이 이미 큰 batch로 묶이는 환경에서는 이 교환이 불리할 수 있다. 별도 초안 모델은 배포 메모리와 유지보수 부담도 만든다. EAGLE 같은 feature-level 방법은 이 비용을 줄이지만 지원 모델과 학습된 speculator가 필요하다.

지식 작업에는 더 큰 비약을 경계해야 한다. 작은 모델의 제안을 큰 모델이 승인했다고 해서 인용이 맞거나 행동이 안전해지지 않는다. 두 모델이 같은 오래된 사실이나 편향을 공유할 수도 있다. 고위험 문서, 외부 공개, 도구 실행에서는 원출처 확인과 규칙 기반 검사를 별도로 둬야 한다.

## 설계 시사점

추측 디코딩을 도입할 때는 홍보된 최대 배수보다 실제 workload의 기준선을 먼저 재야 한다. inter-token latency, time to first token, throughput, 초안 위치별 acceptance rate, 추가 메모리를 함께 기록해야 한다. draft length와 모델 pair를 바꿀 때마다 같은 prompt set과 sampling 조건으로 다시 비교하고, 병렬 검증이 실제 kernel과 backend에서 병렬로 실행되는지도 확인해야 한다.

AKM에는 같은 측정 습관을 다른 의미로 적용할 수 있다. retrieval recall, direct-read 비율, claim-support 통과율, 충돌과 기권을 분리한다. 빠른 후보 제안이 검증 단계를 건너뛰는 이유가 되어서는 안 된다. 실무에서는 추측을 싸게 만들고, 승인 권위는 마지막까지 바꾸지 않으며, 거부된 경로까지 측정 가능한 상태로 남겨야 한다.

## Sources consulted

- Leviathan, Kalman, Matias, ["Fast Inference from Transformers via Speculative Decoding"](https://proceedings.mlr.press/v202/leviathan23a.html), ICML 2023, PMLR 202:19274-19286, 2023-07-23~29. 기초 계보로 사용.
- Li, Wei, Zhang, Zhang, ["EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty"](https://proceedings.mlr.press/v235/li24bt.html), ICML 2024, PMLR 235:28935-28948, 2024-07-21~27.
- [vLLM "Speculative Decoding" 공식 문서](https://docs.vllm.ai/en/latest/features/speculative_decoding/), 문서 표기 2026-07-02, 2026-07-30 확인. 지원 방식·workload·호환성 경계는 현재 문서 기준.
- Chordiya, ["Lossless but Not Free: An Empirical Anatomy of Speculative Decoding on Consumer Hardware"](https://arxiv.org/abs/2607.17283v1), arXiv:2607.17283v1, 2026-07-19. Peer review 전 preprint이며 [공개 benchmark code와 결과물](https://github.com/ParamChordiya/speculative_decoding_engine)을 함께 제공.
- [DECK6/akm 공개 저장소](https://github.com/DECK6/akm), `main` commit [`2efc02b`](https://github.com/DECK6/akm/tree/2efc02b040ec86948005fa634ae1a3b43a184a3f) (2026-07-30 확인); [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md), [`evidence-row.schema.json`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/evidence-row.schema.json).
