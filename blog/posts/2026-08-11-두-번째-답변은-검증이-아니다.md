---
type: article
track: ai-ax
title: "두 번째 답변은 검증이 아니다: LLM 자기검증에 필요한 증거 게이트"
aliases:
  - "두 번째 답변은 검증이 아니다"
  - "Self Verification Needs an Evidence Gate"
author:
  - "육대근"
date created: 2026-08-11
date modified: 2026-08-11
tags:
  - article
  - ai-agent
  - self-verification
  - evaluation
  - evidence
  - governance
  - AI
description: "LLM이 자기 답을 다시 읽는 것과 실제로 검증하는 것은 다르다. 초안 보존, 독립 질문, 외부 증거, 수정 게이트, 퇴행 검사를 결합한 자기검증 구조를 살펴본다."
thumbnail: images/self-verification-needs-an-evidence-gate-cover.png
status: completed
---

# 두 번째 답변은 검증이 아니다: LLM 자기검증에 필요한 증거 게이트

![동결된 기준선과 독립 검증 경로가 증거 게이트로 합류하는 추상 시스템](images/self-verification-needs-an-evidence-gate-cover.png)

에이전트가 초안을 내놓았을 때 “다시 검토해 줘”라고 요청하면 대개 더 신중해 보이는 답이 돌아온다. 문장이 정돈되고 빠진 설명도 채워진다. 문제는 수정된 답이 실제로 더 정확한지다. 모델이 처음부터 잘못 알고 있던 사실은 두 번째 답에서도 반복될 수 있고, 맞았던 문장이 근거 없는 자기비판 때문에 틀리게 바뀔 수도 있다.

여기에는 서로 다른 일이 한꺼번에 벌어진다. **다듬기(refinement)**는 표현이나 구성을 개선하는 일이고, **검증(verification)**은 주장이 근거와 맞는지 판정하는 일이며, **수정(correction)**은 확인된 충돌만 고치는 일이다. 같은 모델이 같은 맥락에서 답을 한 번 더 냈다고 해서 이 셋이 자동으로 이어지지는 않는다.

LLM 자기검증을 신뢰성 있는 시스템으로 만들려면 “한 번 더 생각하기”보다 절차를 분명히 나눠야 한다. 초안을 보존하고, 중요한 질문을 초안에서 분리하며, 외부 출처나 도구 결과로 판정하고, 수정 뒤에는 처음보다 나빠지지 않았는지 확인해야 한다. 핵심은 반복 횟수가 아니라 **무엇에 수정 권한을 줄지** 정하는 데 있다.

## 자기비판은 질문을 만들 수 있지만 판결문은 아니다

가장 느슨한 자기검증은 첫 답과 함께 “오류를 찾아 고쳐라”라는 지시를 다시 보내는 방식이다. 비용은 낮지만 검증자와 작성자가 같은 모델, 같은 지식, 같은 맥락을 공유한다. 처음 답을 만든 편향이 검토 과정에도 그대로 남을 수 있다.

Jie Huang 등이 2024년 3월 갱신한 [Large Language Models Cannot Self-Correct Reasoning Yet](https://arxiv.org/abs/2310.01798v2)는 외부 피드백 없이 모델 자체 능력에만 기대는 intrinsic self-correction을 따로 시험했다. 연구진은 GSM8K, CommonSenseQA, HotpotQA의 당시 모델·설정에서 oracle label이 없으면 개선이 사라지거나 성능이 낮아질 수 있다고 보고했다. 이 결과를 모든 모델과 과제에 대한 영구적 금지로 일반화할 수는 없다. 다만 수정된 답을 평가할 때 초기 답과 비용이 맞는 baseline을 남겨야 하고, 자기비판만으로 사실 검증을 통과시켜서는 안 된다는 경계는 분명하다.

자기비판이 쓸모없다는 뜻은 아니다. 논리의 빈틈, 모호한 문장, 빠진 조건, 추가 확인이 필요한 주장을 찾는 데에는 유용하다. 그러나 이때 모델이 내놓을 것은 “검증 완료” 선언이 아니라 **검증할 질문의 목록**이다. 질문 생성과 사실 판정을 분리하면 모델의 유창함이 증거 역할까지 차지하는 일을 줄일 수 있다.

## 초안을 숨긴 질문은 결합을 줄이지만 외부 진실을 만들지는 않는다

[Chain-of-Verification](https://arxiv.org/abs/2309.11495v2)은 초안을 만든 뒤 검증 질문을 계획하고, 질문에 독립적으로 답한 다음 최종 응답을 다시 쓰는 흐름을 제안했다. factored 방식에서는 검증 질문에 답할 때 원래 초안을 보여 주지 않는다. 연구진은 long-form biography 설정에서 factored 변형이 joint 방식보다 강했고, 특정 실험의 FACTSCORE가 `55.9`에서 `71.4`로 높아졌다고 보고했다.

여기서 중요한 것은 점수 자체보다 **초안 결합(draft coupling)을 줄이는 방법**이다. 검증자가 초안을 보고 있으면 사실을 새로 확인하기보다 기존 문장을 설명하거나 합리화하기 쉽다. “이 문장이 맞는가?” 대신 “사건의 날짜는 언제인가?”, “이 수치의 모집단은 무엇인가?”, “문서가 실제로 요구하는 조건은 무엇인가?”처럼 원자적인 질문으로 바꾸면 확인 범위가 선명해진다.

그렇지만 초안을 숨겨도 같은 모델의 지식과 편향은 남는다. Chain-of-Verification 연구도 모든 단계에서 LLM만 사용했고 도구 사용은 다루지 않았다고 밝힌다. 독립 질문은 자기확증을 낮추는 장치이지, 외부 사실의 대체물이 아니다. 이 구분을 놓치면 더 정교한 프롬프트가 더 강한 증거처럼 보이는 역전이 생긴다.

## 외부 증거가 들어올 때 수정의 권한이 달라진다

[CRITIC](https://arxiv.org/abs/2305.11738v4)은 검색, 코드 인터프리터, API 같은 외부 도구의 피드백을 받아 답을 비평하고 수정하는 구조를 실험했다. 논문은 해당 QA 설정에서 모델 자체 비평의 기여가 작거나 초기 출력보다 나쁠 수 있었고, 도구 상호작용을 제거한 조건보다 외부 피드백을 사용한 조건이 일관되게 높았다고 보고한다. 이 결과 역시 연구의 모델과 과제 범위를 벗어나 보편 법칙으로 확대할 수는 없다.

그래도 시스템에서 무엇을 먼저 믿어야 하는지는 또렷해진다. 출처가 있는 주장이라면 원문 위치를 직접 읽고, 계산이라면 같은 입력으로 다시 실행하며, 코드라면 테스트와 정적 검사를 돌리고, 실제 상태에 관한 주장이라면 대상 시스템에서 readback을 받아야 한다. 모델의 자신감이나 두 검토자의 합의보다 **권위 있는 외부 출처, 환경 출력, 결정적 검사**가 수정 권한을 가져야 한다.

외부 피드백도 자동으로 진실이 되지는 않는다. 검색 결과는 오래되거나 문맥이 잘릴 수 있고, API는 일시적으로 실패하며, 테스트는 작성된 조건만 검사한다. 그래서 evidence gate에는 출처의 권위와 최신성, 정확한 locator, 도구의 실행 조건, 테스트가 다루는 범위를 함께 남겨야 한다. “검색에서 찾았다”와 “이 근거가 이 주장을 지지한다”는 다른 상태다.

## 안전한 자기검증은 기준선을 보존한 채 좁게 움직인다

2026년 6월 공개된 preprint [Denoising Iterative Self-Correction](https://arxiv.org/abs/2606.21724v1)은 초기 답 `y0`를 동결하고, 표적 질문과 독립 답변을 만든 뒤, judge가 구체적인 모순을 찾았을 때만 `MISTAKE`를 내리도록 설계했다. 틀렸다는 근거가 없으면 `NO_MISTAKE`로 멈추고, 수정되지 않은 내용은 그대로 둔다. 연구진은 BIG-Bench Mistake와 Sonnet 4.5를 사용한 한 설정에서 `1,195`건의 개선과 `8`건의 퇴행을 보고했고, 반복 횟수는 `K=3` 이후 이득이 평탄해지는 양상을 관찰했다.

이 수치는 2026년 preprint의 특정 benchmark와 model configuration에서 나온 결과다. 현재의 다른 에이전트나 지식 시스템에 그대로 전이할 수 없다. 더 중요한 기여는 개선 건수만 세지 않고 **개선과 퇴행을 함께 기록했다는 점**이다. 수정 루프가 한 문제를 고치면서 다른 요구사항, 링크, 형식, 이미 맞았던 사실을 망가뜨릴 수 있기 때문이다.

실무에서는 다음 순서로 자기검증을 구성할 수 있다.

1. **기준선(baseline)을 동결한다.** 초안, 현재 파일, 입력 조건, 가능한 경우 hash를 보존한다.
2. **영향이 큰 주장만 고른다.** 날짜, 수치, 인과, 책임 주체, 실행 조건처럼 판정이 달라지면 결론이 바뀌는 항목을 우선한다.
3. **초안과 분리된 질문을 만든다.** 질문은 한 번에 하나의 사실이나 요구사항을 겨냥하고, 가능하면 검증자에게 초안의 답을 보여 주지 않는다.
4. **외부 증거로 답한다.** 1차 출처, 실제 도구 출력, 재현 가능한 계산, deterministic test를 사용하고 locator와 조건을 기록한다.
5. **구체적인 충돌이 있을 때만 수정한다.** “문장이 마음에 들지 않는다”가 아니라 어떤 근거가 baseline의 어느 부분과 충돌하는지 남긴다.
6. **퇴행 없음(no-degradation) readback을 실행한다.** 요청 적합성, 근거가 있는 주장, 링크, 구조, 테스트 결과를 baseline과 다시 비교한다.
7. **반복을 제한한다.** 증거가 약하거나 같은 실패가 다시 나오면 더 많은 자기비판 대신 `HOLD`로 멈춘다.

이 구조는 모든 문장에 같은 비용을 쓰지 않는다. 저위험 문체 수정은 한 번의 refinement로 끝낼 수 있지만, 외부 게시·정책 판단·코드 배포·지식 정본화처럼 되돌리기 어렵거나 영향이 큰 작업은 verification과 correction gate를 분리해야 한다.

## LLM judge는 검증자를 평가받아야 한다

작성 모델과 다른 모델을 judge로 두면 독립성이 조금 커진다. 그러나 모델이 달라졌다는 사실만으로 판정이 진실이 되는 것은 아니다. 2026년 6월 공개된 [RuVerBench](https://arxiv.org/abs/2606.29920v1)는 Deep Research와 Agentic Coding의 human-labeled rubric instance `2,458`개를 사용해 LLM judge의 rubric verification을 평가했다. 논문이 제시한 최고 balanced accuracy도 완벽하지 않았고, 성능이 높은 검증자끼리 틀리는 항목의 겹침이 낮았으며, prompt·batching·vote protocol에 따라 결과가 달라졌다.

이 결과는 “judge를 더 많이 세우면 된다”는 단순한 해법에도 제동을 건다. 다수결은 일부 우연한 오류를 줄일 수 있지만, 모든 judge가 공유하는 잘못된 전제나 빠진 근거는 고치지 못한다. 고영향 판정에서는 judge 이름과 버전, 초안 노출 여부, 불일치, 확신 수준을 기록하고, 판정이 엇갈리면 직접 출처나 결정적 검사, 사람의 판단으로 넘겨야 한다.

평가 시스템도 같은 원칙을 적용받는다. 검증자에게 높은 점수를 받았다는 사실과 실제 요구사항을 충족했다는 사실을 분리해야 한다. `judge-passed`, `source-supported`, `test-passed`, `human-approved`를 하나의 “검증됨” 상태로 합치면 어느 층에서 오류가 났는지 추적할 수 없다.

## AKM에서 Verify와 Learn Back 사이를 어떻게 설계할 것인가

공개 저장소의 [AKM LOOP](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/LOOP.md)는 `Ingest → Classify → Compile → Contextualize → Execute → Verify → Learn Back` 순서를 제시하고, Verify 없이는 Learn Back이 불가능하다고 명시한다. 이 공개 파일의 고정 커밋은 `2efc02b040ec86948005fa634ae1a3b43a184a3f`이며 2026년 8월 11일 default branch `main`에서 직접 확인했다.

이 순서는 출발점이지 자기검증 구현 전체는 아니다. AKM 같은 지식 시스템에 적용한다면, Learn Back으로 넘어가는 교훈은 “모델이 두 번째 답에서 동의했다”가 아니라 source·tool·test가 확인한 실패와 수정 결과에 묶여야 한다. 초안과 수정본, 검증 질문, evidence locator, 수정 사유, 퇴행 결과가 함께 남아야 다음 작업에서 재사용할 만한 교훈인지 판단할 수 있다.

운영 상태도 더 잘게 나눌 필요가 있다. `draft`는 아직 확인되지 않은 출력이고, `refined`는 표현이나 구조가 다듬어진 상태다. `source-supported`는 특정 주장이 출처의 지지를 받은 상태이며, `corrected`는 확인된 충돌을 고친 상태다. 마지막으로 `no-degradation-passed`는 수정 때문에 다른 요구사항이 망가지지 않았음을 뜻한다. 이 상태들을 한 단어로 줄이지 않아야 자동화가 다음 행동을 안전하게 선택할 수 있다.

## 자기검증의 목표는 더 많이 고치는 것이 아니다

보수적인 evidence gate는 일부 오류를 놓칠 수 있다. 구체적인 충돌을 요구하면 recall보다 precision을 우선하게 되고, 확인할 수 없는 주장은 미해결 상태로 남는다. 도구 호출과 독립 질문은 시간과 비용을 더하며, 완전한 deterministic check를 만들 수 없는 평가도 많다. 사람의 검토 역시 편향과 처리량 한계를 가진다.

그래도 근거 없이 원문을 갈아엎기보다 어디까지 확인했는지 드러내는 편이 낫다. 신뢰할 수 있는 자기검증은 모델이 스스로를 믿게 만드는 기술이 아니다. 초안의 권리를 보존하고, 수정 권한을 외부 증거에 넘기며, 틀렸다는 근거가 부족할 때 멈출 수 있게 하는 운영 설계다.

에이전트가 “다시 확인했습니다”라고 말했을 때 물어야 할 질문도 달라진다. 몇 번 생각했는지가 아니라, 무엇을 baseline으로 남겼는지, 어떤 질문을 독립적으로 확인했는지, 어느 증거가 수정을 허가했는지, 고친 뒤 무엇이 나빠지지 않았는지다. 이 네 가지에 답할 수 없다면 두 번째 답은 검증 결과가 아니라 또 하나의 초안이다.

## 직접 읽은 자료

- Shen Yin, Benyamin Ken, William Stremmel, [Denoising Iterative Self-Correction: Structured Verification Loops for Reliable LLM Reasoning](https://arxiv.org/abs/2606.21724v1), arXiv:2606.21724v1, 2026-06-19.
- Yangda Peng 외, [Can LLM-as-a-Judge Reliably Verify Rubrics in Agentic Scenarios?](https://arxiv.org/abs/2606.29920v1), arXiv:2606.29920v1, 2026-06-29.
- Jie Huang 외, [Large Language Models Cannot Self-Correct Reasoning Yet](https://arxiv.org/abs/2310.01798v2), arXiv:2310.01798v2, 2024-03-14.
- Zhibin Gou 외, [CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing](https://arxiv.org/abs/2305.11738v4), arXiv:2305.11738v4, 2024-02-21.
- Shehzaad Dhuliawala 외, [Chain-of-Verification Reduces Hallucination in Large Language Models](https://arxiv.org/abs/2309.11495v2), arXiv:2309.11495v2, 2023-09-25.
- DECK6, [AKM LOOP](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/LOOP.md), public `main` 고정 커밋, accessed 2026-08-11.
