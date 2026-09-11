---
type: article
track: ai-ax
title: "에이전트의 경험은 전이될 때 지식이 된다"
aliases:
  - "Agent Experience Becomes Knowledge When It Transfers"
author:
  - "육대근"
date created: 2026-08-10
date modified: 2026-09-11
tags:
  - article
  - AI
  - ai-agent
  - knowledge-management
  - self-improvement
  - evaluation
description: "에이전트의 성공과 실패를 재사용 가능한 지식으로 바꾸려면 무엇을 남기고, 어떻게 반증하며, 언제 전이 검증을 거쳐야 하는지 살펴본다."
thumbnail: images/gpt2-agent-experience-becomes-knowledge-when-it-transfers.png
status: completed
---
# 에이전트의 경험은 전이될 때 지식이 된다

![연결된 돌 조각의 구조가 다른 구성으로 이동하며 이어지는 개념 이미지](images/gpt2-agent-experience-becomes-knowledge-when-it-transfers.png)

*AI로 생성한 개념 이미지이며, 실제 시스템의 실행 화면이 아니다.*

에이전트가 어려운 작업을 여러 번 시도한 끝에 성공했다고 하자. 마지막 답만 저장하면 결과물은 남는다. 전체 대화를 보관하면 성공에 이르는 과정도 남는다. 그런데 다음 에이전트가 비슷한 작업을 맡았을 때 무엇을 따라야 하는지는 여전히 분명하지 않다. 어느 판단이 결정적이었고, 어떤 시도는 왜 실패했으며, 그 교훈이 다른 조건에서도 통하는지를 다시 읽어 내야 하기 때문이다.

이 대목에서 실행 기록과 지식이 갈린다. 기록은 무슨 일이 있었는지를 보존한다. 재사용 가능한 지식은 그 경험에서 반복 가능한 주장과 적용 경계, 반례와 확인 방법을 골라낸다. 한 번 맞았다는 사실만으로는 부족하다. 새로운 작업에서도 도움이 되고, 기존에 되던 일을 망가뜨리지 않아야 한다.

최근 에이전트 연구에서는 모델의 파라미터나 프롬프트를 계속 바꾸지 않고도 이 문제를 풀려는 흐름이 나타났다. 핵심 질문은 “어떤 에이전트를 오래 살려 둘 것인가”보다 “여러 에이전트가 남긴 경험 중 무엇을 지식으로 승격할 것인가”에 가깝다.

## 성공과 실패를 지식 후보로 바꾸기

AAAI 2024에 발표된 **ExpeL**은 에이전트가 여러 훈련 작업에서 성공과 실패 경험을 모으고, 자연어 insight와 성공 trajectory를 추출해 보지 못한 평가 작업에 사용하도록 설계됐다. 모델 파라미터를 업데이트하지 않고도 작업 간 경험을 활용할 수 있다는 접근이다. 논문은 세 가지 결정론적 환경에서 성능 향상과 source task에서 target task로의 forward transfer를 보고했다.

2026년 7월 공개된 preprint **Knowledge-Centric Self-Improvement(KSI)**는 이 발상을 더 명시적인 지식 큐레이션 구조로 확장한다. 에이전트는 generic하고 disposable한 실행자로 두고, 지속적으로 개선되는 대상은 공유 지식 기반으로 한정한다. 실험 프로토콜은 세 단계로 구성된다.

먼저 **Task-Level Forum**은 한 작업에서 나온 여러 시도를 근거를 갖춘 국소 주장으로 바꾼다. 무엇을 전제로 행동했는지, 어떤 출력이 그 판단을 지지하거나 반박하는지, 다음 시도에서 무엇을 바꿀지, 예상 결과는 무엇인지가 기록된다. 성공담을 요약하는 대신 다시 틀릴 수 있는 조건까지 남기는 방식이다.

그다음 **Cross-Task Forum**은 국소 주장이 다른 작업에서도 살아남는지 확인한다. 다른 에이전트의 동의만 모으지 않는다. 작업 근거를 붙여 기존 주장에 동의하거나 반박하고, 때로는 두 주장을 합친다. 이때 충돌은 제거할 잡음이 아니라 적용 범위를 좁혀 주는 단서가 된다.

마지막 **Distillation**은 살아남은 주장을 용도에 따라 `transferable_insights`, `confirmed_constraints`, `rejected_hypotheses`, `pitfalls`, `checks`로 나눈다. 특히 `applies_when`과 `does_not_apply_when`을 함께 두면 “항상 이렇게 하라”는 막연한 조언을 조건부 지식으로 바꿀 수 있다.

## 전이 검증이 지식의 품질을 가른다

문장이 그럴듯하게 정리됐다고 지식의 효용까지 입증되는 것은 아니다. KSI 연구진은 지식 묶음을 만든 절차와 그 묶음 자체의 효과를 구분하기 위해 generation 10의 자산을 고정했다. 그런 다음 self-improvement에 쓰지 않은 어려운 작업을 benchmark마다 20개씩 골라, forum이나 추가 distillation 없이 다른 실행자에게 제공했다.

논문이 보고한 Polyglot과 ARC-AGI-1의 held-out 실험에서는 모든 donor–recipient 조합이 대응하는 no-knowledge baseline보다 높은 결과를 보였다. 그러나 한 cross-family ARC 조합의 seed 변동은 ±12.6%p로 컸다. 이 결과는 “정제된 지식은 언제나 전이된다”는 보증이 아니다. 특정 코딩·추론 benchmark에서, 고정된 지식 자산이 그것을 만든 run 밖에서도 효용을 가질 수 있다는 초기 근거다.

이 구분은 실무에서 중요하다. 같은 프로젝트의 다음 실행이 빨라졌다는 사실만으로는 지식과 익숙한 맥락의 효과를 분리하기 어렵다. 승격 후보를 고정한 뒤 보지 못한 작업에 적용하고, 후보를 넣지 않은 baseline과 비교해야 한다. 다른 model family에서도 같은 방향이 유지되는지, baseline이 통과한 작업을 새 지식이 실패하게 만들지는 않는지도 봐야 한다.

## AKM에서는 저장보다 승격이 중요해진다

여기서부터는 논문 결과를 옮기는 부분이 아니라, 공개 **AKM(Agent Knowledge Management)** 구조에 적용한 DEXA의 설계 해석이다. AKM은 source, knowledge, context, operational memory, procedure, action, evaluation을 분리하고, `Ingest → Classify → Compile → Contextualize → Execute → Verify → Learn Back`의 순환을 공개 문서로 정의한다.

이 구조는 한 실행의 transcript 전체를 곧바로 장기 기억으로 넣지 않도록 막는다. 원문과 tool output은 source나 action evidence로 보존하고, 반복 가능한 주장은 knowledge 후보로 컴파일한다. 특정 조직·사용자·프로젝트에서만 맞는 조건은 context에 남기고, 여러 번 재현된 실행 순서만 procedure로 승격한다. 실패는 지우지 않고 evaluation에서 다음 수정 대상을 가리키게 한다.

KSI의 forum과 distillation을 이 구조에 연결하더라도 consensus가 source truth를 대신해서는 안 된다. 여러 에이전트가 같은 말을 했다는 사실은 출처가 그 주장을 지지한다는 뜻이 아니다. Forum은 후보를 만들고 반례를 찾는 장치다. 직접 source, tool output, deterministic test가 사실과 실행을 판정해야 한다. 전이 검증을 통과하기 전까지 distilled bundle은 정본이 아니라 후보로 남기는 편이 안전하다.

## 더 많이 배우는 시스템의 비용

지식 중심 자기개선은 공짜가 아니다. 모든 시도를 forum에 올리고, 작업마다 반론을 만들고, 매번 distillation을 수행하면 실제 작업보다 큐레이션이 더 비싸질 수 있다. 잘못 추상화한 규칙은 관련 없는 작업에 전달되어 negative transfer를 만들고, 오래된 성공 조건은 최신 도구와 정책에 맞지 않을 수 있다.

KSI 논문도 한계를 분명히 둔다. 현재 결과는 동료 심사를 거치지 않은 preprint의 저자 보고이며, abstract reasoning, coding, terminal benchmark를 중심으로 한다. 장기간의 계층적 작업 조정과 human expert의 forum 참여는 다루지 않았다. ExpeL의 실험도 결정론적 환경에 한정된다. 두 연구는 경험을 외부 지식으로 바꾸는 가능성을 보여 주지만, 조직의 실제 지식 운영이 자동으로 개선된다는 증거는 아니다.

설계의 핵심은 지식을 많이 생성하는 데 있지 않다. 어떤 경험이 주장으로 바뀌었는지, 그 주장을 깨뜨릴 반례가 무엇인지, 적용 조건이 어디까지인지, 고정된 지식 자산이 보지 못한 작업에서도 도움이 됐는지를 확인할 수 있어야 한다. 다음 실행이 실제로 달라졌고, 그 변화가 퇴행을 만들지 않았을 때 비로소 경험은 지식이 된다.

## Sources consulted

- Xuefei Julie Wang 외, [Knowledge-Centric Self-Improvement, arXiv:2607.19592v1](https://arxiv.org/abs/2607.19592v1)
- Andrew Zhao 외, [ExpeL: LLM Agents Are Experiential Learners, AAAI 2024](https://ojs.aaai.org/index.php/AAAI/article/view/29936)
- [recursive-knowledge/KSI, current public `main` snapshot](https://github.com/recursive-knowledge/KSI/tree/ac709263bc3d316fdf9682fcf7b5475a9f86c16f)
- [AKM public README](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/README.md)
- [AKM public operating loop](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/LOOP.md)
