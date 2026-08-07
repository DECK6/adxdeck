---
type: article
track: ai-ax
title: "모델은 기억하지 않았다, 앞부분의 계산을 재사용했을 뿐이다"
aliases:
  - "Prefix Caching Reuses Computation Not Memory"
author:
  - "육대근"
date created: 2026-08-07
date modified: 2026-08-07
tags:
  - article
  - AI
  - inference
  - prefix-caching
  - KV-cache
  - model-serving
description: "prefix caching이 같은 입력 앞부분의 KV 계산을 어떻게 재사용하는지, 기억·검색·provider prompt caching과 무엇이 다른지 살펴본다."
thumbnail: images/prefix-caching-computation-reuse-cover.png
status: completed
---

# 모델은 기억하지 않았다, 앞부분의 계산을 재사용했을 뿐이다

![동일한 앞부분의 계산 경로가 여러 요청에서 재사용되는 추상 이미지](images/prefix-caching-computation-reuse-cover.png)

긴 시스템 지침과 도구 정의, 같은 문서 묶음을 매 요청 앞에 붙이는 AI 서비스가 있다. 질문은 매번 달라도 앞부분은 거의 같다. 모델은 그 공통 구간을 읽을 때마다 같은 계산을 반복한다. 응답이 시작되기 전의 지연이 길어지고, 서버는 이미 처리한 입력에 다시 GPU 시간을 쓴다.

prefix caching은 이 중복 계산을 줄이는 추론 최적화다. 이름에 cache와 context가 함께 등장해서 장기 기억이나 검색 기술처럼 들리지만, 실제로 저장하는 것은 지식의 의미가 아니다. 같은 모델이 같은 token prefix를 처리하며 만든 key-value 상태를 다시 쓰는 것이다. 모델이 지난 대화를 이해해 기억한 것도 아니고, 새 사실을 학습한 것도 아니다. 이전 요청과 정확히 같은 앞부분에 대한 계산을 건너뛴다.

용어를 잘못 붙이면 설계도 엇나간다. 기억과 캐시를 혼동하면 성능을 과대평가하고, 서로 다른 사용자의 요청을 같은 cache 영역에 섞는 위험도 놓치기 쉽다. prefix caching을 쓰기 전에 무엇이 재사용되고 무엇은 전혀 보장되지 않는지부터 갈라 봐야 한다.

## 같은 문장이 아니라 같은 계산 경로를 찾는다

Transformer가 prompt를 처리하는 prefill 단계에서는 각 token이 이전 token들과 맺는 attention을 계산한다. 이때 layer마다 이후 token 생성에 필요한 key와 value 상태가 생긴다. 일반적인 KV cache는 한 요청 안에서 이미 본 token을 다시 계산하지 않게 한다. prefix caching은 이 재사용 범위를 요청 사이로 넓힌다.

vLLM의 Automatic Prefix Caching 문서는 기존 요청의 KV cache를 보관하다가 새 요청이 같은 prefix를 공유하면 공통 부분의 계산을 건너뛴다고 설명한다. vLLM의 현재 설계 문서는 block token과 그 앞의 parent hash를 조합해 cache block을 식별한다. LoRA ID, multimodal input hash, tenant 격리를 위한 cache salt처럼 계산 결과를 달라지게 하는 조건도 식별자에 포함할 수 있다. vLLM v0.11부터 기본 hash 알고리즘이 SHA-256이라는 버전 경계도 명시되어 있다.

여기서 "같다"는 의미가 비슷하다는 뜻이 아니다. token sequence와 재사용에 영향을 주는 실행 조건이 맞아야 한다. 문장 뜻이 같아도 공백, 도구 목록, 이미지, system instruction의 순서가 달라 token prefix가 바뀌면 cache hit가 끊길 수 있다. 반대로 내용의 의미를 해석하지 않아도 정확히 같은 prefix라면 계산을 재사용할 수 있다.

SGLang은 이 문제를 RadixAttention으로 다뤘다. 2023년 12월 12일 처음 제출되고 2024년 6월 6일 v2로 개정된 논문은 prompt와 생성 결과의 KV cache를 radix tree로 관리해 여러 호출 사이에서 prefix를 재사용하는 runtime을 제안한다. 논문은 다양한 언어·멀티모달 모델과 workload에서 당시 비교 시스템보다 최대 6.4배 높은 throughput을 보고했다. 이 수치는 모든 배포의 보장값이 아니다. workload, model, cache hit 비율, memory pressure, scheduler가 달라지면 효과도 달라진다. 더 눈여겨볼 대목은 최고 수치보다 runtime의 역할이다. 반복되는 구조를 찾아 계산 자산으로 관리한다.

## prompt caching이라는 제품명과 엔진의 동작은 겹치지만 같지 않다

Provider가 제공하는 prompt caching도 흔히 exact prefix를 기준으로 한다. OpenAI의 현재 API 문서는 cache hit가 exact prefix match에서만 가능하다고 밝히고, 기본 자동 caching은 1,024 token 이상 prompt에 적용된다고 설명한다. 응답의 `cached_tokens` 같은 usage field로 hit를 확인할 수 있으며, 최신 모델군과 이전 모델군은 TTL과 retention 설정 의미가 다르다. 이것은 해당 API의 routing, 보관 정책, 과금 계약까지 포함한 제품 동작이다.

Anthropic의 현재 문서는 5분과 1시간 TTL을 제시하고, prompt prefix에서 지정한 지점부터 재사용한다고 설명한다. cache는 조직 사이에서 공유되지 않는다. Claude API와 일부 플랫폼에서는 workspace 단위로도 격리되며, Bedrock과 Google Cloud는 조직 단위 격리를 사용한다고 명시한다. 같은 "prompt caching"이라는 이름 아래에서도 격리 단위와 TTL, write/read token 가격은 provider마다 다르다.

provider의 할인율을 self-hosted vLLM의 성능 수치로 옮길 수는 없다. vLLM의 block hash 설계가 특정 API의 보관 정책을 설명하는 것도 아니다. 둘 다 반복되는 exact prefix의 prefill 계산을 활용하지만, cache 보관 기간과 공유 경계는 각 서비스의 계약에 달려 있다.

## 기억, 검색, 학습과 갈라지는 지점

prefix cache는 semantic memory가 아니다. 사용자가 "지난번 회의의 결론"을 물어도 관련 기록을 찾아 주지 않는다. 표현이 달라진 같은 의미를 찾는 vector retrieval도 하지 않는다. cache 밖의 사실을 문서에서 가져오지 않으며, 오래된 정보와 최신 정보를 비교해 현재 상태를 고르지도 않는다.

모델 weight도 바뀌지 않는다. fine-tuning이나 continual learning처럼 새로운 패턴을 parameter에 반영하지 않는다. 같은 prefix에 대한 중간 attention 상태를 잠시 보관할 뿐이다. cache가 사라져도 모델의 지식은 변하지 않고, 다시 계산하면 같은 조건에서 같은 종류의 상태를 만들 수 있다.

일반적인 대화 memory는 어떤 정보를 남길지, 언제 폐기할지, 누구의 사실인지, 최신 상태가 무엇인지 결정해야 한다. retrieval은 현재 질문에 맞는 근거를 고른다. prefix caching은 이미 선택된 입력의 앞부분이 이전 입력과 일치하는지 본다. 이 셋은 서로 보완할 수 있지만 역할을 대신하지 않는다.

## AKM에서는 지식 구조보다 prompt 조립 경계가 먼저 보인다

AKM 같은 지식 운영 체계에 prefix caching을 붙일 때는 "무엇을 더 기억하게 할까"보다 prompt 조립 순서를 봐야 한다. 어떤 입력을 여러 요청의 공통 prefix로 고정하고, 무엇을 요청마다 뒤에 붙일지 정하는 일이다.

예를 들어 공개된 운영 원칙, 증거 schema, 변하지 않는 도구 설명은 안정적인 앞부분 후보가 될 수 있다. 현재 질문, 최신 검색 결과, 사용자별 자료, 권한에 따라 달라지는 정보는 뒤쪽의 가변 구간에 둔다. 이렇게 조립하면 공통 prefix가 길게 유지되어 cache hit 가능성이 커진다. 동시에 오래된 사실을 cache 효율 때문에 고정하는 실수를 피할 수 있다.

cache hit가 지식의 권위나 최신성보다 앞설 수는 없다. 정책이 바뀌었는데도 예전 system instruction을 유지하면 틀린 입력을 더 빨리 처리할 뿐이다. evidence가 갱신됐는데 prefix를 보존하려고 뒤에 정정문만 덧붙이면 충돌한 맥락이 쌓인다. cache 효율은 입력 구조를 보는 운영 지표이지, 사실성을 정하는 기준이 아니다.

실무적으로는 두 종류의 revision을 나눌 필요가 있다. 지식 revision은 내용의 권위·시점·근거가 바뀐 경우다. cache revision은 token sequence나 model, tokenizer, adapter, tool schema처럼 KV 재사용 조건이 바뀐 경우다. 둘을 같은 "context 변경"으로 뭉치면 cache miss의 원인과 지식 갱신의 이유를 구분할 수 없다.

## 빠른 prefill이 긴 답변까지 빠르게 만들지는 않는다

vLLM 문서는 Automatic Prefix Caching이 query를 처리하는 prefill 시간을 줄이지만 새 token을 만드는 decoding 시간은 줄이지 않는다고 선을 긋는다. 긴 답변 생성이 대부분의 시간을 차지하거나 새 요청들이 공통 prefix를 공유하지 않으면 이득은 작다. GPU memory를 cache가 차지하면 다른 요청의 KV block이 더 자주 밀려날 수도 있다.

hit rate만 높여서도 부족하다. cache lookup과 hash 계산, block 관리에도 비용이 든다. traffic이 적으면 데워진 cache를 쓰기도 전에 만료될 수 있다. 서로 다른 tenant를 잘못 묶으면 정보 노출 가능성까지 커진다. vLLM은 multi-tenant 격리를 위해 cache salt를 식별 요소로 제시하고, Anthropic은 조직·workspace 격리를 문서화한다. "같은 prefix니까 재사용한다"에 앞서 "누구 사이에서 재사용해도 되는가"를 정해야 한다.

cache hit가 출력의 정확성을 높이지 않는다는 점도 중요하다. 같은 prefix의 계산을 건너뛰어도 입력에 잘못된 지침이 있으면 같은 오류를 더 싸고 빠르게 반복한다. retrieval 근거가 부실하거나 tool 결과가 오래됐다면 cache는 이를 검증하지 않는다. 성능 최적화가 품질 보증으로 승격되는 순간 설계가 틀어진다.

## 설계 시사점

prefix caching을 도입할 때는 평균 latency 하나보다 prefill과 decoding을 나눠 측정해야 한다. time to first token, input token 수, shared-prefix 길이, cache hit·eviction, output token 수를 함께 봐야 어느 구간이 빨라졌는지 알 수 있다. 비용은 provider usage field와 실제 청구 규칙을 기준으로 확인하고, self-hosted 환경에서는 GPU memory와 throughput을 따로 측정한다.

prompt template은 안정적인 공통 구간을 앞에, 요청별 가변 정보는 뒤에 두는 편이 유리하다. 그러나 보안 경계와 최신성 규칙이 먼저다. tenant, model revision, tokenizer, adapter, multimodal input, tool schema가 바뀌면 같은 cache namespace를 계속 써도 되는지 검토해야 한다. 민감한 입력은 provider의 격리·retention 문서를 확인하고, self-hosted runtime에서는 salt와 namespace 정책을 테스트해야 한다.

prefix caching은 AI가 더 많이 기억하게 만드는 기술이 아니다. 이미 읽은 동일한 앞부분을 다시 계산하지 않게 만든다. memory와 retrieval은 지식을 다루고, cache는 계산을 다룬다. 이 경계를 지켜야 무엇이 빨라졌고 무엇이 그대로인지 제대로 측정할 수 있다.

## Sources consulted

- [vLLM, Automatic Prefix Caching](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/) — current developer documentation, accessed 2026-08-07; prefill reuse and decoding boundary.
- [vLLM, Prefix Caching design](https://docs.vllm.ai/en/latest/design/prefix_caching/) — current developer documentation, accessed 2026-08-07; block hash inputs, cache salt, and v0.11 hash boundary.
- [Zheng et al., SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104) — submitted 2023-12-12, revised 2024-06-06 (v2); RadixAttention and KV cache reuse.
- [OpenAI API, Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) — current documentation, accessed 2026-08-07; exact-prefix matching, 1,024-token default threshold, usage and retention semantics.
- [Anthropic, Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — current documentation, accessed 2026-08-07; 5-minute/1-hour TTL and organization/workspace isolation.
