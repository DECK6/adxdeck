---
type: article
track: ai-ax
title: "FlashAttention은 긴 문맥의 제곱 비용을 없애지 않는다"
aliases:
  - "FlashAttention Does Not Remove Quadratic Attention"
author:
  - "육대근"
date created: 2026-10-09
date modified: 2026-10-09
tags:
  - article
  - AI
  - LLM
  - FlashAttention
  - inference
  - GPU
  - context-engineering
description: "FlashAttention이 정확한 어텐션을 유지하면서 GPU 메모리 이동을 줄이는 원리와, 긴 문맥의 제곱 연산량·하드웨어별 성능·AKM 적용에서 남는 경계를 살펴본다."
thumbnail: images/gpt2-flashattention-quadratic-cost-cover.png
status: completed
---

# FlashAttention은 긴 문맥의 제곱 비용을 없애지 않는다

![빠른 온칩 메모리와 느린 외부 메모리 사이에서 어텐션 타일이 이동하는 모습을 표현한 추상 개념 이미지](images/gpt2-flashattention-quadratic-cost-cover.png)

*AI로 생성한 개념 이미지이며, 실제 GPU 회로나 성능 측정 화면이 아니다.*

긴 회의록과 규정집을 한꺼번에 모델에 넣을 수 있게 되면, 문맥 창의 숫자만으로 시스템의 준비가 끝난 것처럼 보인다. 하지만 입력 길이가 두 배가 될 때 어떤 계산과 메모리 이동이 늘어나는지는 별개의 문제다. FlashAttention은 이 지점을 매우 효과적으로 다루지만, 흔히 붙는 "제곱 비용을 없앴다"는 설명은 정확하지 않다.

FlashAttention은 어텐션의 수학적 정의를 근사식으로 바꾸지 않는다. 계산 순서를 바꿔 GPU 메모리 계층 사이의 이동을 줄인다. 모델의 최대 문맥 길이보다 먼저, 어떤 중간값이 어디에 쓰이고 다시 읽히는지 봐야 하는 이유다.

## 느린 것은 계산만이 아니라 데이터 이동이다

표준 self-attention은 각 토큰의 query와 모든 key 사이 점수를 계산한다. 시퀀스 길이를 `N`이라고 하면 점수 행렬의 크기는 `N × N`이다. 계산량은 여전히 시퀀스 길이에 대해 제곱으로 증가한다. 2024년 *FlashAttention-3*의 arXiv v2 사전 공개본도 self-attention 점수 계산이 sequence length에 대해 quadratic scaling을 갖는다고 출발점에서 명시한다.[1]

GPU 안의 모든 메모리가 같은 속도인 것은 아니다. HBM은 크지만 온칩 SRAM보다 데이터 이동 비용이 크다. 기존 구현은 큰 attention matrix와 중간값을 HBM에 쓰고 다시 읽는다. 2024년 ICLR에 발표된 *FlashAttention-2*는 FlashAttention이 비대칭 GPU 메모리 계층을 고려해 HBM 접근을 줄이는 IO-aware 알고리즘이라고 설명한다.[2]

FlashAttention은 query, key, value를 작은 타일로 나눠 온칩 메모리에서 계산한다. softmax 정규화도 블록별로 갱신하고, 전체 `N × N` 중간 행렬을 HBM에 저장하지 않는다. 필요한 일부 값은 저장하는 대신 다시 계산한다. FLOP가 조금 늘더라도 느린 메모리 읽기와 쓰기가 크게 줄면 벽시계 시간은 짧아질 수 있다. 이 방식은 근사 attention이 아니다. 지원하는 설정에서 같은 수학적 attention을 계산하지만, 부동소수점 연산 순서가 달라지므로 기존 커널과 비트 단위로 같은 값을 보장한다는 뜻은 아니다.[2][3]

## 선형 메모리와 제곱 연산량을 섞지 않는다

FlashAttention 논문에서 "linear instead of quadratic"는 주로 attention 중간값의 메모리 사용량 경계를 가리킨다.[2] 전체 연산량이 선형으로 바뀌었다는 뜻은 아니다. 긴 문맥에서 `N × N` 관계를 계산하는 일은 남는다. 구현을 바꿔 같은 연산을 하드웨어에 더 잘 맞게 배치한 것이다.

제품 설명을 읽을 때 이 구분을 놓치기 쉽다. 더 긴 문맥이 메모리에 들어가더라도 같은 지연과 비용으로 처리된다는 보장은 없다. 커널 하나의 처리량 향상이 전체 API 응답 시간과 비용에 그대로 반영되는 것도 아니다. 토큰화, 모델의 다른 층, KV cache, 배칭, 네트워크와 요청 대기 시간이 함께 작동한다.

벤치마크 수치에도 장비와 설정이 붙는다. *FlashAttention-2*는 A100에서 기존 FlashAttention 대비 약 `2×`, 이론 최대 FLOP 처리량의 `50–73%`에 도달했다고 보고했다.[2] *FlashAttention-3*의 arXiv v2 사전 공개본은 Hopper H100의 비동기 Tensor Core와 TMA를 활용해 FP16에서 FlashAttention-2 대비 `1.5–2.0×`, 최대 `740 TFLOPs/s`와 `75%` utilization을 보고했다.[1] 이 수치는 해당 사전 공개본이 시험한 GPU, head dimension, dtype과 attention 설정에서 나온 결과이며, 이후 학회 최종판의 수치와 구분해야 한다. 다른 GPU나 전체 서비스의 보편적 배속으로 옮기면 안 된다.

## FlashAttention-3은 하드웨어 세대와 함께 읽어야 한다

FlashAttention-3의 개선은 이름만 바뀐 범용 소프트웨어 업데이트가 아니다. Hopper 세대의 비동기 실행 기능을 전제로 한다. 데이터 이동을 맡는 producer warp와 행렬 계산을 맡는 consumer warp를 나누고, 두 작업이 겹치도록 예약한다. block-wise matrix multiplication과 softmax도 엇갈려 실행한다.[1][3]

FP8 경로는 더 조심해서 읽어야 한다. 낮은 정밀도는 처리량을 높이지만 exact attention이라는 설명과 수치 정밀도의 경계가 달라진다. 연구진은 FP8 경로에서 baseline FP8 attention보다 `2.6×` 낮은 numerical error를 보고했지만, error가 0이라고 말하지 않았다.[1] 알고리즘적으로 exact한 FP16 경로의 의미와 FP8 저정밀 경로의 오차 비교를 한 문장으로 합치면 안 된다.

공개 구현도 하드웨어와 소프트웨어 조합에 따라 지원 범위가 달라진다.[4] 따라서 "FlashAttention 지원"이라는 체크박스보다 실제 GPU architecture, dtype, head dimension, causal 여부, 라이브러리와 커널 버전을 함께 기록해야 재현 가능한 성능 주장이 된다.

## AKM에서는 긴 문맥을 성능 계약으로 다룬다

AKM에 긴 문서를 넣는다고 가정해 보자. 원문 전체를 한 요청에 싣는 방식과 검색으로 필요한 근거만 고르는 방식은 같은 답을 겨루는 두 구현이 아니다. 하나는 넓은 문맥을 직접 처리하고, 다른 하나는 입력 전에 근거를 선택한다. FlashAttention은 전자의 실행 비용을 줄일 수 있지만, 어떤 문장이 질문에 필요한지 판정하지 않는다.

DEXA의 적용안은 각 업무 평가표에 `context_length`, `attention_backend`, `gpu_arch`, `dtype`, `kernel_version`을 남기는 것이다. 여기에 peak memory, time to first token, inter-token latency, 비용과 답변 근거 충족률을 함께 측정한다. 이는 현재 배포 기능에 대한 주장이 아니라 AKM 실험을 위한 설계 제안이다.

비교 순서도 고정해야 한다. 같은 모델과 같은 질문 집합에서 일반 attention과 FlashAttention을 비교하고, 그다음 입력 길이를 바꾼다. 마지막에 전체 문맥 방식과 검색 방식의 답변 품질을 비교한다. 커널 효과, 문맥 길이 효과, 검색 선택 효과를 한 번에 바꾸면 무엇이 결과를 바꿨는지 알 수 없다.

## 더 긴 입력이 더 나은 근거는 아니다

FlashAttention이 보장하는 것은 지원 범위 안에서 attention 계산의 메모리 이동을 줄이는 일이다. 긴 문맥이 항상 필요한 정보를 포함한다거나, 모델이 그 정보를 올바르게 사용한다거나, 답변에 근거가 있다는 사실은 보장하지 않는다. 문맥 창과 지식 신뢰도는 다른 축이다.

실무에서는 먼저 병목이 attention kernel에 있는지 확인해야 한다. 그다음 목표 하드웨어와 dtype에서 해당 경로가 실제로 지원되는지, 늘어난 문맥이 검증된 답의 비율을 높이는지 측정한다. 앞의 두 판단은 실행 효율을 다루고, 마지막 판단은 업무 결과를 다룬다. 어느 하나도 다른 판단을 대신하지 않는다.

## 직접 읽은 자료

- [1] Jay Shah 외, [FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision](https://arxiv.org/html/2407.08608v2), arXiv v2 사전 공개본. 2024년 7월 12일 공개된 v2의 abstract, introduction, algorithm, empirical validation을 읽었다. 이 글의 성능 수치는 NeurIPS 2024 최종판이 아니라 이 버전을 기준으로 한다.
- [2] Tri Dao, [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning](https://arxiv.org/html/2307.08691), ICLR 2024. 2023년 7월 17일 공개된 v1을 계보 자료로 사용했고, abstract와 algorithm·benchmark 범위를 확인했다.
- [3] Tri Dao, [FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision](https://tridao.me/blog/2024/flash3/), 2024년 7월 11일. 타일링, HBM–SRAM 이동, Hopper 전용 최적화 설명을 확인했다.
- [4] Dao-AILab, [flash-attention 공개 저장소](https://github.com/Dao-AILab/flash-attention), 2026년 10월 9일 확인. 설치 조건과 하드웨어별 지원 범위는 사용 시점의 README와 릴리스를 다시 확인해야 한다.
