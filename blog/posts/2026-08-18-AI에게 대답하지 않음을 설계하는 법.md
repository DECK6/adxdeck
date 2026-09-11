---
type: article
track: ai-ax
title: "AI에게 ‘대답하지 않음’을 설계하는 법: 선택적 예측과 기권 규칙"
slug: designing-abstention-rules-for-ai-systems
aliases:
  - "Designing Abstention Rules for AI Systems"
author:
  - "육대근"
date created: 2026-08-18
date modified: 2026-09-11
tags:
  - article
  - AI
  - selective-prediction
  - abstention
  - uncertainty
  - evaluation
  - human-ai-collaboration
  - governance
description: "AI가 답할지, 되물을지, 사람에게 넘길지를 선택하도록 만드는 기권 규칙을 선택적 예측, 불확실성 보정, 위험-응답률 평가, 증거 상태의 관점에서 살펴본다."
thumbnail: images/gpt2-designing-abstention-rules-for-ai-systems.png
status: completed
---

# AI에게 ‘대답하지 않음’을 설계하는 법: 선택적 예측과 기권 규칙

![절벽 앞에서 멈춘 빛의 경로와 좁은 다리로 이어지는 경로를 대비한 개념 이미지](images/gpt2-designing-abstention-rules-for-ai-systems.png)

*AI로 생성한 개념 이미지이며, 실제 시스템의 실행 화면이 아니다.*

사내 규정에 관해 묻는 직원에게 AI가 답하려 한다. 검색 결과에는 개정 전 문서와 새 공지가 함께 잡혔고, 적용 시점은 질문에 적혀 있지 않다. 모델은 두 문서를 매끄럽게 합쳐 한 문장으로 답할 수 있다. 그러나 지금 필요한 동작은 그럴듯한 종합이 아니라 적용 날짜를 되묻거나 담당자에게 넘기는 일이다.

대부분의 AI 제품은 답변을 잘 만드는 데 집중한다. 그러다 보니 대답하지 않는 순간은 안전 필터의 거절, 모델 오류, 빈 응답처럼 처리되기 쉽다. 신뢰할 수 있는 시스템은 이 순간도 구분한다. **기권(abstention)**은 실패 문구가 아니라, 현재 근거와 위험 수준으로는 답을 확정하지 않겠다는 실행 상태다.

이 상태를 설계하려면 “모델이 얼마나 자신 있어 보이는가”만 볼 수 없다. 질문 자체에 답할 수 있는지, 필요한 근거가 있는지, 잘못된 답의 비용이 얼마인지, 사람에게 넘긴 뒤 무엇을 확인해야 하는지를 함께 정해야 한다. 핵심은 모든 질문에 답하는 모델이 아니라 **답할 범위를 측정하고 제한하는 시스템**을 만드는 데 있다.

## 기권은 거절 문구가 아니라 시스템 상태다

2025년 *Transactions of the Association for Computational Linguistics*에 실린 기권 연구 서베이는 판단 대상을 세 갈래로 나눈다. 첫째, 질문이 애초에 답할 수 있는 형태인지 본다. 둘째, 모델이 해당 답을 충분히 확신하는지 살핀다. 셋째, 질문과 답이 인간의 가치 및 사용 맥락과 맞는지 검토한다. 세 조건 중 하나라도 부족하면 기권이 필요할 수 있다.[5]

이 구분은 “모르겠습니다”라는 한 문장보다 훨씬 넓다. 날짜나 대상이 빠진 질문에는 `CLARIFY`로 되묻고, 근거가 충돌하면 `DEFER`로 담당자에게 넘기며, 안전 정책이나 권한 경계를 벗어나면 `STOP`으로 실행을 중단할 수 있다. 충분한 근거와 권한이 있을 때만 `ANSWER`를 선택한다. 사용자에게 보이는 문구는 비슷해도 후속 동작은 서로 다르다.

기권 시스템의 평가는 전체 정확도 하나로 끝나지 않는다. **응답률(coverage)**은 전체 질문 중 시스템이 실제로 답한 비율이고, **선택 위험(selective risk)**은 답한 항목 안에서 발생한 오류의 비율이다. 임계값을 엄격히 잡으면 대개 위험은 낮아지지만 응답률도 줄어든다. 반대로 거의 모든 질문에 답하면 빈 화면은 줄어도 잘못된 확정이 늘 수 있다. 같은 서베이는 특정 정확도를 유지할 때 가능한 최대 응답률, 임계값 전 구간의 위험-응답률 곡선, 답한 항목만을 대상으로 한 정확도처럼 이 균형을 따로 재는 지표들을 정리한다.[5]

```text
coverage = answered_queries / all_queries
selective_risk = wrong_answers / answered_queries
```

목표는 기권률을 무조건 높이는 것이 아니다. 위험이 낮은 질문에는 답하고, 불확실성이 큰 질문에는 최소한의 추가 정보를 요청하며, 사람이 판단해야 할 항목만 넘겨야 한다. 과도한 기권은 검토 대기열을 키우고 사용자가 시스템을 우회하게 만든다. 부족한 기권은 오류를 확신 있는 문장으로 포장한다.

## 자신감 숫자 하나로는 임계값을 세울 수 없다

모델이 내놓은 확률이나 “확신합니다”라는 표현을 곧바로 기권 기준으로 삼기는 어렵다. 확률은 모델과 프롬프트, 문장 길이, 과제에 따라 보정 상태가 달라질 수 있다. 자연어로 자신감을 묻는 방식도 답의 정확성과 안정적으로 일치한다고 가정할 수 없다.

2024년 ACL 논문 *Don’t Hallucinate, Abstain*은 질문응답에서 지식 공백을 찾는 기권 방법을 비교했다. 연구진은 calibration, fine-tuning, prompting, self-consistency 계열을 포함한 `11`개 방법을 검토한 뒤, 다른 LLM이 답을 협력적으로 평가하거나 경쟁적으로 반박하는 방식을 제안했다. `3`개 LLM과 `4`개 QA 과제에서 가장 강한 baseline보다 기권 정확도가 최대 `19.3%` 높아졌다고 보고했다.[1]

이 수치를 모든 도메인의 기권 성능으로 일반화해서는 안 된다. 다른 모델의 합의도 외부 사실을 만들지 못하고, 다중 모델 호출은 비용과 지연을 늘린다. 논문의 실험도 지식 공백이 있는 질문응답에 한정된다. 다만 단일 모델의 자기확신만으로 기권 여부를 정할 때보다 독립적인 신호와 반례를 추가해야 한다는 설계 문제는 분명히 드러난다.[1]

실무에서 임계값을 정하려면 최소한 네 종류의 신호가 필요하다. 질문의 필수 정보가 빠졌는지, 권위 있는 근거가 확보됐는지, 모델 출력끼리 또는 출처끼리 충돌하는지, 틀린 답을 실행했을 때 되돌릴 수 있는지를 따로 기록해야 한다. 이 신호들을 하나의 불투명한 confidence score로 압축하면 왜 기권했는지 설명하기 어려워진다. 기권 이유가 다르면 다음 동작도 달라져야 한다.

## 컨포멀 예측은 보정 데이터의 경계 안에서 작동한다

컨포멀 예측(conformal prediction)은 calibration set에서 오차 기준을 정한 뒤, 새 입력에 대해 사용자가 지정한 위험 수준을 만족하도록 예측 집합을 구성하는 방법이다. 정답 후보가 하나뿐인 분류 문제에서는 여러 label을 함께 반환할 수 있고, 자연어 생성에서는 허용 가능한 응답이 포함된 후보 집합을 만들도록 변형할 수 있다. 집합이 너무 크거나 조건을 충족하지 못하면 시스템은 확정 답을 내지 않고 추가 질문이나 사람 검토로 이관할 수 있다.

2025년 ACL 논문 SConU는 LLM의 conformal uncertainty 방법이 의존하는 **exchangeability** 가정을 직접 문제 삼았다. calibration data와 실제 입력의 불확실성 분포가 어긋나면 목표한 miscoverage bound가 깨질 수 있기 때문이다. 연구진은 단일 도메인 안의 이상치와 서로 다른 도메인 사이의 분포 차이를 판정하기 위해 두 conformal p-value를 도입하고, 고위험 질문응답에서 그 영향을 분석했다.[2]

여기서 중요한 점은 보장이 모델 자체에서 저절로 나오지 않는다는 사실이다. calibration set이 실제 운영 질문을 대표해야 하고, 무엇을 정답 또는 허용 가능한 응답으로 볼지 평가 기준이 정해져 있어야 하며, 운영 분포가 바뀌면 다시 보정해야 한다. SConU도 기존 방법이 exchangeability 위반에서 통제되지 않은 오차와 실행하기 어려운 예측 집합을 만들 수 있다고 지적한다.[2]

따라서 “오류율을 `5%`로 설정했다”는 설정값만으로 운영 보장을 선언할 수 없다. 어떤 모집단과 기간에서 calibration data를 만들었는지, 새 입력이 그 분포에서 벗어났는지, 예측 집합이 실제 의사결정에 쓸 만큼 작은지 함께 확인해야 한다. 컨포멀 예측은 불확실성을 없애는 장치가 아니라 **가정과 오차 예산을 명시하는 계약**에 가깝다.

## 사람 이관은 답변의 끝이 아니라 다음 작업의 시작이다

기권이 유용하려면 사람에게 빈 화면을 넘겨서는 안 된다. 시스템은 답하지 않은 이유와 사람이 확인할 범위를 함께 건네야 한다. 질문의 누락 정보, 충돌한 출처, 적용한 임계값, 이미 확인한 사실, 남은 결정, 되돌릴 수 없는 후속 작업을 묶은 handoff packet이 필요하다.

NIST의 2024년 *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*은 AI 시스템의 지식 한계와 사람이 출력을 어떻게 사용·감독할지 문서화하라고 제안한다. 또한 알려진 ground truth와의 비교, human oversight, automated evaluation 등 여러 방법으로 생성 결과의 정확성·품질·신뢰성·진위를 평가하도록 안내한다.[3] 기권 규칙도 이 운영 문서의 일부여야 한다. 누가 어떤 조건에서 판단을 이어받고, 얼마 안에 처리하며, 결과를 다시 시스템에 어떻게 반영할지 정해 두어야 한다.

사람에게 넘기는 비율만 낮추면 과소 기권이 생길 수 있고, 오류를 줄이겠다고 모든 애매한 질문을 넘기면 검토자가 병목이 된다. 그래서 모델 지표와 운영 지표를 함께 봐야 한다. 위험-응답률 곡선 옆에 검토 대기 시간, 되묻기로 해결된 비율, 잘못 이관된 비율, 사람 판단 뒤 뒤집힌 답의 비율을 놓으면 임계값이 실제 조직에서 감당 가능한지 알 수 있다.

## 공개 AKM의 증거 상태는 기권을 confidence 밖으로 꺼낸다

2026년 8월 18일 확인한 AKM 공개 저장소의 `99-system/EVIDENCE-SCHEMA.md`는 검색 결과를 곧바로 최종 주장으로 쓰지 않는다. 당시 확인한 공개 `main`의 revision `f26ace2a16caba724b24db12cbee238ebb52498f`에서 증거 상태는 `candidate → direct-read → claim-supported`로 전이하며, 충돌·노후화·범위 위반이 있으면 `conflicted`, `stale`, `rejected`로 분기한다. 필수 근거, 직접 읽기, 권위 판정이 빠졌을 때 packet verdict는 `HOLD`다.[4]

이 설계가 컨포멀 예측의 통계적 보장을 대신하는 것은 아니다. 대신 지식 작업에서 기권 이유를 모델 confidence와 분리하는 응용 사례를 보여 준다. 검색 점수가 높아도 원문을 읽지 않았다면 기권할 수 있고, 최신 문서라도 권위가 낮으면 확정하지 않으며, 서로 다른 출처의 충돌을 평균내지 않고 남긴다.[4]

이 구조에서는 “확신이 낮아서 답하지 않았다”보다 더 구체적인 기록을 남길 수 있다. `missing_direct_read`, `unresolved_conflict`, `stale_authority`, `out_of_scope`처럼 원인을 구분하면 시스템은 필요한 원문을 다시 읽거나, 권위 있는 담당자에게 묻거나, 질문 범위를 줄일 수 있다. 기권은 막다른 길이 아니라 다음 검증 단계를 선택하는 routing 정보가 된다.

## 운영 규칙은 임계값보다 먼저 정해야 한다

기권 기능을 붙이기 전에 무엇을 보호할지 정해야 한다. 잘못된 답의 비용이 낮고 즉시 되돌릴 수 있는 초안 작업과, 외부 발송·결제·의료·법률 판단처럼 영향이 큰 작업에 같은 임계값을 적용할 이유는 없다. 작업마다 허용 위험과 필수 근거를 따로 정의해야 한다.

이후 운영 계약은 다음 순서로 만들 수 있다.

1. **결정 단위 고정:** 질문 전체가 아니라 어떤 claim 또는 action을 확정하는지 정한다.
2. **기권 원인 분리:** 정보 누락, 지식 공백, 출처 충돌, 분포 이탈, 권한 부족을 다른 상태로 기록한다.
3. **보정 자료 구성:** 실제 운영 분포와 위험 등급을 반영한 calibration set을 만들고, 정답·허용 응답 기준을 함께 버전 관리한다.
4. **이관 산출물 정의:** 사람에게 원문, 충돌, 미확인 조건, 제안된 다음 질문을 전달하고 소유자와 처리 기한을 붙인다.
5. **두 축으로 평가:** 선택 위험과 응답률을 함께 보고, 사람 검토량·대기 시간·재작업률을 같은 실험에서 측정한다.
6. **분포 변화 감시:** 도메인·사용자·정책·모델이 바뀌면 기존 threshold를 그대로 재사용하지 않고 재보정한다.

기권 뒤의 결과도 학습 자료로 돌려보내야 한다. 사람이 어떤 근거로 답을 승인하거나 뒤집었는지 남기면 calibration set과 routing rule을 고칠 수 있다. 단, 검토자의 한 번의 선택을 보편 정답으로 즉시 승격해서는 안 된다. 권위, 맥락, 적용 기간을 함께 기록해야 같은 질문이 다른 조건에서 돌아왔을 때 오답을 재생산하지 않는다.

AI 시스템의 신뢰성은 얼마나 자주 답하는지만으로 결정되지 않는다. 답할 수 없는 질문을 구분하고, 그 이유를 설명하며, 다음 판단자가 이어서 일할 수 있게 만드는 능력도 성능의 일부다. 대답하지 않음이 측정 가능한 상태가 될 때, AI는 유창함과 책임 있는 실행 사이에 필요한 경계를 갖게 된다.

## Sources consulted

[1] Shangbin Feng et al., “Don’t Hallucinate, Abstain: Identifying LLM Knowledge Gaps via Multi-LLM Collaboration,” ACL 2024. https://aclanthology.org/2024.acl-long.786/
[2] Zhiyuan Wang et al., “SConU: Selective Conformal Uncertainty in Large Language Models,” ACL 2025. https://aclanthology.org/2025.acl-long.934/
[3] NIST, “Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile,” NIST AI 600-1, 2024. https://doi.org/10.6028/NIST.AI.600-1
[4] DECK6/AKM, `99-system/EVIDENCE-SCHEMA.md`, revision `f26ace2a16caba724b24db12cbee238ebb52498f`. https://github.com/DECK6/akm/blob/f26ace2a16caba724b24db12cbee238ebb52498f/99-system/EVIDENCE-SCHEMA.md
[5] Bingbing Wen et al., “Know Your Limits: A Survey of Abstention in Large Language Models,” *Transactions of the Association for Computational Linguistics*, vol. 13, 2025. https://aclanthology.org/2025.tacl-1.26/
