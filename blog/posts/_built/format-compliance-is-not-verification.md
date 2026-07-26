---
type: article
track: ai-ax
title: 형식이 맞는 답은 아직 검증된 답이 아니다
aliases:
  - 형식이 맞는 답은 아직 검증된 답이 아니다
  - Format Compliance Is Not Verification
author:
  - 육대근
date created: 2026-07-27
date modified: 2026-07-27
tags:
  - article
  - structured-generation
  - constrained-decoding
  - inference
  - akm
  - AI
description: 구조화 생성이 토큰 단계에서 보장하는 형식의 범위와, 사실·근거·권한 검증이 별도 계층으로 남는 이유를 살펴본다.
thumbnail: images/format-compliance-is-not-verification-cover.png
status: completed
---

# 형식이 맞는 답은 아직 검증된 답이 아니다

![구조 제약을 통과하는 토큰 조각](images/format-compliance-is-not-verification-cover.png)

LLM이 만든 JSON을 자동화에 연결하면 괄호 하나만 어긋나도 작업 전체가 멈추곤 한다. 필드 이름이 다르거나 배열 자리에 문자열이 오면 파서는 실패한다. 구조화 생성은 이런 문제를 프롬프트에 잘 지켜 달라고 부탁하는 대신, 추론 단계에서 선택 가능한 토큰을 제한해 다룬다.

그러나 스키마를 통과했다고 해서 출력 전체를 믿어도 되는지는 별개의 문제다. 형식 일치는 강한 보장이지만 범위가 또렷하다. 토큰 수준의 제약은 지원되는 문법과 구조 계약을 지킬 수 있다. 값의 의미, 사실성, 근거의 적합성, 실행 권한의 안전성에는 각각 다른 검증이 필요하다.

## 구조화 생성이 실제로 보장하는 것

OpenAI가 2024년 8월 6일 공개한 Structured Outputs 설명은 구현 경계를 구체적으로 드러낸다. 제공된 JSON Schema를 context-free grammar로 바꾼 뒤, 이미 생성된 토큰과 문법 규칙을 바탕으로 다음에 허용할 토큰을 계산한다. 허용되지 않은 토큰의 확률은 0이 된다. 새 스키마를 처음 처리할 때는 전처리와 캐시 구축 때문에 지연이 더해질 수 있다.

이 방식은 문법이 허용하는 출력 경로를 보장한다. 필수 필드, 자료형, enum, 중첩 구조, 닫는 괄호 같은 조건이 여기에 해당한다. 같은 문서는 Structured Outputs가 모델의 모든 오류를 막지는 못하며 JSON 객체의 값에는 오류가 남을 수 있다고 명시한다.

따라서 "schema-valid"는 쓸모 있고 명확한 기술적 상태다. 그렇다고 이미 검증된 답이 되지는 않는다.

## 디코딩 단계에서 문법은 어떻게 개입하는가

일반적인 샘플링에서 모델은 어휘 전체를 다음 토큰 후보로 본다. 제약 디코딩(constrained decoding)은 매 단계에서 이 후보 집합을 줄인다. 지금까지 생성한 접두 시퀀스가 어떤 문법 상태에 놓였는지 추적하고, 그 상태에서 가능한 토큰에만 확률을 남긴다. 토큰 하나를 고르면 상태를 갱신한 뒤 같은 계산을 이어 간다.

사후 검사와 재시도만 쓰는 흐름에서는 잘못된 결과가 먼저 만들어진다. 추론 단계의 제약은 잘못된 토큰을 처음부터 고르지 못하게 한다. 대신 구현 부담이 생긴다. 스키마가 엔진의 지원 범위를 벗어나면 보장의 범위도 줄어든다. 문법 컴파일, 토큰 마스크 계산, 캐시 유지에는 비용이 든다. 중첩과 재귀를 다루는 표현력에 따라 finite-state machine, regular expression, context-free grammar의 차이도 커진다.

## 하나의 성공률로 비교할 수 없는 이유

JSONSchemaBench는 구조화 출력 엔진을 서로 다른 세 축에서 평가한다. 제약을 충족하는 출력을 만드는 효율, 여러 제약 유형을 처리하는 스키마 범위, 생성된 출력의 품질이다. 연구진은 10K real-world JSON schemas와 official JSON Schema Test Suite를 함께 사용해 6개 프레임워크를 비교했다. arXiv의 현재 판은 2025년 2월 27일 공개된 v3이며, v1은 2025년 1월 18일 제출됐다.

이 세 축은 서로 바꿔 쓸 수 없다. 어떤 엔진은 빠르지만 일부 키워드를 지원하지 않는다. 다른 엔진은 넓은 스키마를 처리하면서 초기 컴파일 비용을 더 치를 수 있다. 형식은 맞아도 과제 정답의 품질이 떨어지는 모델도 있다. 이 결과들을 모두 하나의 "성공률"에 넣으면 차이가 사라진다.

## 동적 에이전트 프로토콜이 만드는 새 비용

에이전트 작업에서는 출력 구조가 요청마다 달라진다. 한 요청 안에서도 선택한 도구나 응답 프로토콜에 따라 구조를 바꿔야 할 수 있다. XGrammar-2는 이 조건을 다루기 위해 tag-triggered structure switching, cross-grammar cache, Earley-based adaptive token mask cache, just-in-time compilation, repetition state compression을 제안한다. 정확한 arXiv 식별자는 2601.04426이다. 현재 판은 2026년 5월 25일의 v3이며, v1은 2026년 1월 7일 제출됐다.

캐시와 문법 전이는 구조 제약에 드는 오버헤드를 낮춘다. 그렇다고 정확성의 새 계층이 생기지는 않는다. 도구 선택이 적절했는지, 인수값이 사실과 맞는지, 그 도구를 실행할 권한이 있는지는 여전히 확인해야 한다.

## AKM의 공개 스키마가 보여 주는 다음 경계

AKM의 공개 저장소에는 [EvidenceRow와 EvidencePacket의 기계 판독용 스키마](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/evidence-row.schema.json)가 공개돼 있다. 함께 제공되는 [AKM Evidence Schema](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)는 `candidate`, `direct-read`, `claim-supported`, `conflicted`, `stale`, `rejected` 같은 검증 상태를 정의한다.

JSON Schema는 EvidenceRow에 필요한 `source`, `scope`, `authority`, `freshness`, `retrieval`, `content`, `verification` 필드가 있는지 검사할 수 있다. enum 밖의 state나 필수 필드 누락도 거부한다. 그러나 근거가 실제 출처를 직접 읽은 결과인지, locator가 올바른지, excerpt가 claim을 정말 지지하는지는 스키마 파일 하나로 판정할 수 없다. direct read와 claim support에는 별도의 행위와 기록이 필요하다.

DEXA는 스키마를 검증 가능한 상태를 빠뜨리지 않고 전달하는 계약으로 해석한다. 구조화 생성은 계약에 맞는 봉투를 안정적으로 만든다. 그 안의 근거를 심사하는 일은 출처 계보, 권위, 최신성, 충돌 정책의 몫이다.

## 형식 보장만으로 확보할 수 없는 것

grammar-constrained decoding이 과제 성능을 높인 사례는 있다. ACL 2025 Industry Track 논문은 logical parsing에서 grammar constraint가 구문 정확도와 의미 정확도를 함께 개선했고, 작은 모델에서는 in-context example을 대신할 가능성도 보였다고 보고했다. 이 결과는 logical parsing이라는 특정 설정에서 얻은 empirical finding이다. 모든 도메인에서 의미 정확성을 보장하는 정리로 일반화할 수 없다.

반대 방향의 비용도 관찰됐다. EMNLP 2024 Industry Track 연구는 형식 제약 아래에서 여러 추론 과제의 성능이 하락했고, 제약이 엄격할수록 저하가 커지는 경향을 보고했다. 모든 모델과 스키마에서 같은 손실이 난다고 일반화할 근거는 없다. 구조 제약이 언제나 품질에 중립적이라는 가정도 검증 대상이다.

다음 주장은 토큰 수준의 추론 제약만으로 확보되지 않는다.

- 값이 현실의 사실과 일치한다.
- 인용이 주장을 실제로 지지한다.
- 최신 버전과 정책을 사용했다.
- 호출한 도구와 작업이 승인 범위 안에 있다.
- 여러 출처의 충돌이 해결됐다.
- downstream system에서 실행해도 안전하다.

## 실무 설계에서는 보장을 층으로 나눈다

1. 구문·구조 게이트를 추론 단계에 둔다. 지원되는 JSON Schema 하위 집합, grammar, regex의 범위를 문서화하고 잘못된 출력의 재시도를 줄인다.
2. 의미 검증기를 분리한다. 날짜 관계, 합계, ID 존재 여부, 필드 간 불변 조건처럼 스키마만으로 표현하기 어려운 조건은 응용 코드에서 검사한다.
3. 근거 게이트를 둔다. 중요한 주장은 출처 위치, 버전, direct-read 여부, 지지 관계를 확인한 뒤에만 통과시킨다.
4. 권한·안전 게이트를 도구 실행 앞에 둔다. 스키마에 맞는 도구 호출이어도 권한, 범위, 부작용, 비용, 되돌릴 수 없는 작업을 따로 승인한다.
5. benchmark를 분해한다. format compliance, schema coverage, compile latency, per-token overhead, task quality, factuality, evidence support, safe execution을 서로 다른 지표로 기록한다.
6. failure message에도 실패한 층이 드러나야 한다. parse failure, unsupported schema, semantic invalidity, unsupported claim, stale evidence, unauthorized action을 한 종류의 "model error"로 합치지 않는다.

구조화 생성은 자동화의 입구를 안정시킨다. 파서가 읽을 수 있는 출력과 스키마가 허용하는 구조를 훨씬 일관되게 만들 수 있다. 그 입구를 통과한 뒤에는 내용 심사와 실행 승인이 기다린다. 신뢰할 수 있는 시스템은 "형식이 맞다"는 상태를 정확히 기록하고, 그 상태에 사실성이나 안전성까지 슬쩍 얹지 않는다.

## 직접 읽은 자료

- OpenAI, [Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/), 2024-08-06.
- Saibo Geng et al., [JSONSchemaBench: A Rigorous Benchmark of Structured Outputs for Language Models](https://arxiv.org/abs/2501.10868v3), arXiv:2501.10868v3, 2025-02-27. Initial submission: 2025-01-18.
- Linzhang Li et al., [XGrammar-2: Efficient Dynamic Structured Generation Engine for Agentic LLMs](https://arxiv.org/abs/2601.04426v3), arXiv:2601.04426v3, 2026-05-25. Initial submission: 2026-01-07.
- Federico Raspanti, Tanir Ozcelebi, Mike Holenderski, [Grammar-Constrained Decoding Makes Large Language Models Better Logical Parsers](https://aclanthology.org/2025.acl-industry.34/), ACL Industry Track, 2025-07.
- Zhi Rui Tam et al., [Let Me Speak Freely? A Study On The Impact Of Format Restrictions On Large Language Model Performance](https://aclanthology.org/2024.emnlp-industry.91/), EMNLP Industry Track, 2024-11.
- DECK6, [AKM evidence-row.schema.json](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/evidence-row.schema.json), accessed 2026-07-27.
- DECK6, [AKM Evidence Schema](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md), accessed 2026-07-27.
