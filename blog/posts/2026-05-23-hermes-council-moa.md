---
type: article
title: "Hermes Council은 어려운 판단을 여러 모델의 합의로 바꾼다"
aliases:
  - Hermes Council MoA
author:
  - "[[육대근]]"
date created: 2026-05-23
date modified: 2026-05-23
tags:
  - hermes
  - ai-agent
  - workflow
  - council
description: A practical guide to Hermes Agent's Council/Mixture-of-Agents workflow, including the moa toolset, model fan-out, aggregation, setup requirements, costs, and safe use cases.
thumbnail: images/hermes-council-moa-cover.png
status: completed
series: hermes-notes
---

![cover](images/hermes-council-moa-cover.png)

Hermes Agent의 Council은 “한 모델에게 더 오래 생각하라고 시키는 방식”과 다르다. 어려운 판단을 여러 모델에게 나눠 묻고, 그 답을 다시 하나의 aggregator 모델이 합성하게 만드는 **다중 모델 검증 루프**다. 해결하는 문제는 단순하다. 한 모델의 확신이 높아도 틀릴 수 있는 영역에서, 서로 다른 모델의 관점과 오류를 비교해 더 안정적인 결론을 얻는 것이다.

## 기능 개요 — Council과 MoA

Hermes 설치 안에서 이 기능의 실제 toolset 이름은 `moa`이고, 도구 이름은 `mixture_of_agents`다. MoA는 Mixture of Agents의 줄임말로, 로컬 코드에는 “여러 reference model이 먼저 답하고, aggregator model이 최종 답을 합성한다”는 2-layer 구조로 구현되어 있다.

기본 reference model은 여러 frontier 모델이다. 로컬 설치 기준으로 `anthropic/claude-opus-4.6`, `google/gemini-2.5-pro`, `openai/gpt-5.4-pro`, `deepseek/deepseek-v3.2`가 병렬로 호출되고, aggregator는 `anthropic/claude-opus-4.6`을 쓴다. reference layer는 다양성을 위해 온도 0.6, aggregator layer는 일관성을 위해 온도 0.4로 설정되어 있다.

## 어떻게 작동하나

기능 표면은 toolset 단위로 켠다.

```bash
hermes tools enable moa
hermes chat --toolsets moa -q "Compare these two architecture options..."
```

공식 도구 참조와 로컬 구현을 함께 보면 `mixture_of_agents`는 한 번 실행할 때 보통 5번의 모델 호출을 만든다. 네 개 reference model이 먼저 답하고, 마지막 aggregator가 그 답들을 비판적으로 읽어 하나의 결과를 만든다. 반환값은 JSON 형태이며 핵심 필드는 다음과 같다.

```json
{
  "success": true,
  "response": "final synthesized answer",
  "models_used": {
    "reference_models": ["..."],
    "aggregator_model": "..."
  }
}
```

필수 조건은 `OPENROUTER_API_KEY`다. `tools/mixture_of_agents_tool.py`의 requirement check도 OpenRouter API key를 기준으로 한다. 디버깅이 필요할 때는 `MOA_TOOLS_DEBUG=true`를 켜면 `moa_tools` debug session이 호출 정보를 저장한다.

## 짧은 실제 사용 사이드바

이 사용자의 운영에서는 Council을 매번 쓰는 기본 경로로 두지 않는다. 평소 Dev/PKM/Ops 작업은 프로파일과 worker 분리, `delegate_task`, 테스트 실행으로 충분히 검증한다. 대신 모델 선택이 애매하거나, 긴 설계 판단처럼 단일 모델의 편향을 줄여야 할 때 “비싼 최종 검토 회의”처럼 올리는 편이 안전하다.

## Pitfalls / tips

첫째, 비용과 지연을 기본값으로 예상해야 한다. `moa`는 여러 모델을 동시에 호출하므로 일반 `chat`보다 느리고 비싸다. Hermes의 cron scheduler 주석과 테스트에도 이 위험이 반영되어 있어, fresh install의 cron 기본 toolset에서는 `moa`, `homeassistant`, `rl`이 제외된다. 예약 작업이 예기치 않게 frontier 모델 묶음을 호출하지 않게 하려는 안전장치다.

둘째, Council은 사실 검증을 자동으로 보장하지 않는다. 여러 모델이 같은 잘못된 전제를 공유할 수 있다. 외부 최신 정보가 필요하면 먼저 `web`이나 문서 검색으로 근거를 모으고, Council에는 “이 근거를 바탕으로 판단하라”고 맡기는 편이 낫다.

셋째, 작은 질문에는 과하다. 파일 하나 읽기, 단순 계산, 명령 실행 여부 판단에는 `terminal`, `file`, `delegate_task`가 더 직접적이다. Council은 복잡한 수학·알고리즘, 다중 도메인 분석, architecture trade-off처럼 “관점의 다양성”이 실제 품질을 높이는 순간에 꺼내는 기능이다.

## 언제 Council을 쓰나

Council은 Hermes의 일상 도구가 아니라 고난도 판단용 escalation path다. 빠른 실행이 목적이면 단일 모델과 좁은 toolset을 쓰고, 작업을 나눠 검증하려면 delegation이나 Kanban을 쓴다. 여러 강한 모델의 답을 일부러 충돌시킨 뒤 합성해야 할 만큼 중요한 결정이라면, `moa`는 Hermes 안에서 바로 열 수 있는 작은 모델 회의실이다.
