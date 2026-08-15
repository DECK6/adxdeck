---
type: article
track: ai-ax
title: "검색용 청크는 문서의 맥락을 잃지 말아야 한다"
slug: retrieval-chunks-should-keep-document-context
aliases:
  - "Retrieval Chunks Should Keep Document Context"
author:
  - "육대근"
date created: 2026-08-15
date modified: 2026-08-15
tags:
  - article
  - AI
  - RAG
  - retrieval
  - embeddings
  - late-chunking
  - knowledge-systems
description: "RAG가 문서를 잘게 나눈 뒤 잃기 쉬운 참조 관계를 late chunking, Contextual Retrieval, Contextual Document Embeddings가 어떻게 보완하는지 살펴본다."
thumbnail: images/retrieval-chunks-keep-document-context-cover.png
status: completed
---

# 검색용 청크는 문서의 맥락을 잃지 말아야 한다

![푸른 빛과 주황빛의 연속 흐름이 여러 투명 조각을 지나며 연결을 유지하는 추상 이미지](images/retrieval-chunks-keep-document-context-cover.png)

“이 수치는 전분기보다 3% 증가했다”는 문장을 검색용 청크 하나로 떼어 놓으면 무슨 정보가 남을까. 증가한 대상이 매출인지 가입자 수인지, 어느 회사의 어느 분기인지, ‘이 수치’가 앞 문단의 어떤 표를 가리키는지 알기 어렵다. 사람은 제목과 앞 문단을 함께 읽어 빈칸을 메우지만, 청크를 독립적으로 임베딩한 검색 시스템은 잘린 문장만 보고 의미를 압축해야 한다.

RAG는 긴 문서를 작은 청크로 나누어 검색 비용을 낮춘다. 하지만 문서를 자를 때 바뀌는 것은 저장 단위만이 아니다. 대명사의 지시 대상, 절 제목의 범위, 앞에서 정의한 약어, 사건의 시간 순서도 함께 끊길 수 있다. 질문에 필요한 문장이 색인 안에 있어도 그 문장을 찾는 데 필요한 단서가 청크 밖에 있다면 검색은 놓친다.

late chunking과 Contextual Retrieval, Contextual Document Embeddings는 청크를 없애지 않는다. 대신 **청크를 표현할 때 더 넓은 문맥을 함께 읽는다.** 세 방법의 구현 범위는 다르다. 다만 검색 단위와 의미를 해석하는 범위를 같은 크기로 고정하지 않는다는 점은 같다.

## 먼저 자르고 읽는 순서를 뒤집는 late chunking

일반적인 dense retrieval 파이프라인은 문서를 먼저 나눈 뒤 각 청크를 별도로 embedding model에 넣는다. 각 청크의 token representation은 같은 문서의 앞뒤를 보지 못한 상태에서 만들어진다. 짧은 청크는 특정 내용을 또렷하게 담을 수 있지만, 그 내용이 문서의 어느 대목에 속하는지 알려 주는 정보는 약해진다.

Jina AI와 Weaviate 연구진이 제안한 [late chunking](https://arxiv.org/abs/2409.04701v3)은 순서를 바꾼다. long-context embedding model이 먼저 문서 전체 또는 context window에 들어오는 긴 구간의 token을 처리한다. 그다음 원래의 청크 경계에 맞춰 token representation에 mean pooling을 수행한다. 청크별 vector를 만드는 시점만 뒤로 미루기 때문에 ‘late’라는 이름이 붙었다.

검색 결과를 거대한 문서 단위로 되돌리는 방식은 아니다. index에는 여전히 작은 청크의 vector를 넣고, query와 가까운 청크를 찾는다. 다만 각 vector를 만들 때 앞뒤 문맥을 이미 읽으므로 “그 회사”, “이 결과”, “두 번째 단계” 같은 표현이 문서 안에서 가리키는 대상을 반영할 수 있다. 논문은 추가 training 없이 여러 long-context embedding model에 적용할 수 있는 방법과, 이를 더 강화하기 위한 별도 training 방식도 함께 제시한다.

생성 모델로 청크 설명을 새로 쓸 필요가 없다는 점도 장점이다. 반면 문서가 embedding model의 최대 context보다 길면 한 번에 전체를 처리할 수 없다. 논문은 겹치는 긴 window를 사용하는 long late chunking을 제안하지만, window 경계와 계산량이라는 문제가 다시 생긴다. 저자들도 작은 BEIR retrieval task를 중심으로 평가했으며, 청크 분할 때문에 평가 계산량이 커져 다양한 model과 task를 포괄하는 실험에는 한계가 있었다고 밝힌다. 개선 수치를 모든 corpus에 그대로 옮길 수는 없다.

## 문맥을 짧게 써 붙이는 Contextual Retrieval

Anthropic의 [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)은 청크 앞에 별도의 설명을 붙인다. 문서 전체를 참고해 각 청크가 어느 문서의 어떤 대목인지 설명하는 50~100 token 정도의 짧은 문맥을 생성하고, 이를 원래 청크 앞에 놓는다. 이렇게 보강한 텍스트를 dense embedding과 BM25 index 양쪽에 사용한다.

앞의 예라면 “ACME의 2023년 2분기 실적 보고서에서 매출 변화를 설명하는 대목” 같은 정보가 청크에 붙을 수 있다. semantic search는 문장 의미만이 아니라 회사·시점·문서 역할을 함께 보게 되고, lexical search도 원문 청크에 없던 식별어를 찾을 수 있다. late chunking이 embedding model 내부에서 긴 문맥을 token representation에 반영한다면, Contextual Retrieval은 문맥을 읽을 수 있는 짧은 텍스트로 명시해 기존 검색 파이프라인에 넣는다.

Anthropic은 codebase, fiction, arXiv paper, science paper를 섞은 자체 실험에서 top-20 청크의 retrieval failure rate가 기본 5.7%에서 Contextual Embeddings만 썼을 때 3.7%, Contextual BM25까지 결합했을 때 2.9%로 줄었다고 보고했다. reranking을 더한 구성은 1.9%였다. 다만 이 수치는 Anthropic이 선택한 data, question, embedding model, retrieval 설정에서 나온 vendor 실험 결과다. 독립 benchmark의 보편적 성능 보증으로 읽어서는 안 된다.

이렇게 생성한 문맥은 원문이 아니다. 모델이 잘못된 대상이나 시점을 보충하면 검색 recall은 높아져도 근거가 왜곡될 수 있다. 원문 청크와 생성 문맥을 같은 필드에 섞어 버리면 나중에 무엇이 출처에 있었는지 구분하기도 어렵다. 문맥 생성 model과 prompt가 바뀌면 재색인이 필요하고, corpus 규모에 따라 사전 처리 비용도 늘어난다.

## 문서 하나를 넘어 corpus를 읽는 embedding

[Contextual Document Embeddings](https://arxiv.org/abs/2410.02525v4)는 문맥의 범위를 corpus로 넓힌다. John X. Morris와 Alexander M. Rush는 개별 문서를 따로 encoding하는 관행을 ‘out-of-context’ 문제로 보고, 주변 문서 집합의 정보를 최종 document embedding에 조건으로 넣는 두 단계 architecture를 제안했다. 같은 단어라도 금융 문서와 의료 문서에서 구별해야 할 의미가 달라진다는 점을 representation에 반영하려는 접근이다.

이 방법은 late chunking과 같지 않다. late chunking은 한 문서 안에서 청크가 잃은 앞뒤 문맥을 보존하는 indexing 기법이다. Contextual Document Embeddings는 corpus의 표본을 먼저 embedding해 dataset 특성을 잡고, 그 정보를 document encoder에 주입하는 model architecture다. 저자들은 여러 설정, 특히 out-of-domain retrieval에서 biencoder보다 나은 결과를 보고했지만, full-scale training에는 상당한 계산 자원이 필요했다. 논문 부록의 가장 느린 설정에서는 8대의 NVIDIA H100으로 unsupervised epoch 하나에 일반 biencoder가 약 하루, contextual architecture가 약 이틀 걸렸다고 밝힌다.

세 접근을 한 줄의 성능 순위로 세우기는 어렵다. long-context encoder를 이미 운영하는가, 별도의 LLM 전처리를 감당할 수 있는가, corpus가 자주 바뀌는가, model training까지 할 수 있는가에 따라 비용 구조가 달라진다. 공통점은 분명하다. **검색 결과는 청크여도 그 청크의 representation까지 고립시킬 필요는 없다.**

## AKM에서는 문맥과 출처 계보를 함께 보존해야 한다

공개 [AKM 저장소](https://github.com/DECK6/akm)의 default branch는 `main`이다. 2026년 8월 15일 확인한 HEAD `f26ace2a16caba724b24db12cbee238ebb52498f`의 [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/EVIDENCE-SCHEMA.md)는 exact search, lexical·semantic recall, graph traversal, direct read를 하나의 evidence contract로 정규화한다. 여기서 embedding과 graph export는 canonical Markdown을 대체하지 않는 파생물이며, 검색된 candidate가 곧 검증된 사실도 아니다.

AKM에 context-preserving retrieval을 적용하려면 보강된 의미와 출처 계보를 함께 남겨야 한다. 청크 vector가 문서 전체를 참고했더라도 source ID, revision, 원래 locator는 유지해야 한다. LLM이 만든 contextual text는 원문 excerpt와 분리하고, 어떤 model과 prompt version으로 생성했는지 기록해야 한다. 여러 청크가 같은 source에서 나왔다면 검색 점수가 높다는 이유로 한 문서가 결과를 독점하지 않도록 source-level dedup과 cap도 필요하다.

AKM schema는 ranking 뒤에 이웃 문맥을 확장하되 원래 matched locator를 계속 보이도록 요구한다. 검색 단계에서는 주변 문맥을 적극적으로 사용하되, 검증 단계에서는 직접 읽은 문장을 특정해야 한다. 문맥은 후보를 더 잘 찾게 해 주지만, 그 후보가 주장을 뒷받침하는지는 원출처를 읽고 별도로 판단해야 한다.

## 평가는 답변 점수보다 검색 실패를 먼저 본다

context-preserving retrieval을 시험하면서 최종 답변의 인상만 비교하면 실패 원인을 찾기 어렵다. 같은 embedding model, 같은 chunk size, 같은 query set을 고정한 뒤 naive chunking, late chunking, contextual text 방식의 recall@k와 source-level recall을 비교해야 한다. 특히 다음처럼 문맥 손실이 드러나는 질문을 따로 모을 필요가 있다.

- 대명사나 ‘이 결과’처럼 앞 문장을 참조하는 질문
- 청크에는 없고 heading에만 있는 주제어로 찾는 질문
- 같은 약어가 부서나 문서마다 다른 뜻을 갖는 질문
- 개정 전후 문서가 함께 있을 때 현재 revision을 찾아야 하는 질문
- 정답 문장은 짧지만 근거 범위가 앞뒤 문단에 걸쳐 있는 질문

recall이 올라도 잘못된 source가 함께 늘 수 있다. top-k 안에 정답 청크가 들어왔는지뿐 아니라, 같은 사실의 오래된 revision을 고르지 않았는지, 생성된 contextual text가 원문에 없는 정보를 넣지 않았는지, reranker가 출처 다양성을 지웠는지도 살펴야 한다. corpus가 바뀐 뒤 재색인 시간과 비용, query latency, index 크기도 품질 지표와 함께 기록해야 한다.

청크는 긴 문서를 다루기 위한 실용적인 저장·검색 단위다. 잘린 경계를 의미의 경계로 착각할 때 문제가 생긴다. 문서를 먼저 읽고 나중에 pooling하거나, 짧은 문맥을 생성해 붙이거나, corpus 정보를 embedding에 조건으로 넣는 방법은 이 손실을 서로 다른 층에서 줄인다. 어떤 방식을 택하든 원문과 생성 문맥, 검색 후보와 검증된 근거를 분리해야 한다. 그래야 recall을 높인 결과가 출처 추적 가능성을 훼손하지 않는다.

## 직접 읽은 자료

- Günther et al., [“Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models”](https://arxiv.org/abs/2409.04701v3) — submitted 2024-09-07, revised 2025-07-07 (v3); late chunking mechanism, long-context boundary, and evaluation scope.
- Anthropic, [“Introducing Contextual Retrieval”](https://www.anthropic.com/engineering/contextual-retrieval) — published 2024-09-19; chunk-specific contextual text, BM25 combination, reranking, and vendor-reported evaluation.
- Morris and Rush, [“Contextual Document Embeddings”](https://arxiv.org/abs/2410.02525v4) — submitted 2024-10-03, revised 2024-11-08 (v4); corpus-conditioned embedding architecture and computational resource disclosure.
- [DECK6/akm public repository](https://github.com/DECK6/akm) and pinned [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/EVIDENCE-SCHEMA.md) — default branch and exact public file verified 2026-08-15.
