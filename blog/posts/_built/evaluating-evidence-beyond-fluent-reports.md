---
type: article
track: ai-ax
title: "유창한 보고서 너머의 근거 평가"
slug: evaluating-evidence-beyond-fluent-reports
aliases:
  - "Evaluating Evidence Beyond Fluent Reports"
author:
  - "[[육대근]]"
date created: 2026-07-25
date modified: 2026-07-25
tags:
  - article
  - ai-agent
  - deep-research
  - evaluation
  - evidence
  - akm
  - AI
description: "딥 리서치 에이전트를 보고서, 근거, 검색 과정으로 나누어 평가하고 AKM EvidencePacket이 메우려는 간극을 살핀다."
thumbnail: images/evaluating-evidence-beyond-fluent-reports-cover.png
status: completed
---

# 유창한 보고서 너머의 근거 평가

![매끈한 표면 뒤로 근거 연결망과 갈라진 검색 경로가 이어지는 추상 설치 장면](images/evaluating-evidence-beyond-fluent-reports-cover.png)

## 현재 문제

딥 리서치 에이전트가 내놓은 보고서는 흔히 그럴듯하다. 목차가 단정하고 문장은 전문적이며 링크도 촘촘하다. 그래서 검토자는 금세 문장 품질과 전체 인상에 기대게 된다. 이 매끈함 때문에 인용이 실제 주장을 뒷받침하는지, 검토해야 할 반례가 검색에서 빠졌는지, 최신 자료가 낮은 권위의 출처를 밀어 올렸는지는 완성된 문장만 읽어서는 알기 어렵다.

좋은 산출물과 좋은 조사는 같은 말이 아니다. 보고서가 잘 읽혀도 근거가 약할 수 있고, 인용이 정확해도 검색 범위가 편향될 수 있다. 반대로 조사 과정이 성실했더라도 사용자의 요청을 놓친 보고서는 좋은 결과물이 아니다. 하나의 종합 점수로 셋을 뭉치면 실패 원인도 함께 사라진다.

## 개념과 근거

DEER는 이 문제를 두 층으로 나눈다. 2026년 3월 공개된 v4는 50개 과제, 13개 분야를 대상으로 평가 분류체계를 만들고, 7개 차원과 25개 하위 차원을 101개 세부 루브릭으로 풀었다. 요청 충족, 분석의 타당성, 구조, 형식과 문체, 윤리는 문서 전체를 대상으로 판단한다. Information Integrity와 Information Sufficiency는 주장 단위로 따로 확인한다.

특히 DEER는 명시적 인용이 붙은 문장만 보는 관행을 비판한다. 보고서에서 원자적 주장을 뽑고, 앞 문장이나 앞 절의 인용을 이어받는 암묵적 주장까지 추적한 뒤, 출처 문서가 해당 주장을 지지하는지 검사한다. 문체 점수와 Claim Factuality, Citation Support, Evidence Coverage, Reference Reliability/Diversity를 서로 다른 평가 항목으로 다룬다.

2025년의 DeepResearch Bench도 비슷한 분리를 택했다. RACE는 포괄성, 깊이, 지시 이행, 가독성을 기준 보고서와 비교해 평가한다. FACT는 보고서에서 진술–URL(Statement–URL) 쌍을 추출해 같은 URL에 연결된 동일 사실을 중복 제거한 뒤, 웹페이지 텍스트가 진술을 지지하는지 판정하고 Citation Accuracy와 Average Effective Citations per Task를 계산한다. 연구의 실험표도 RACE와 FACT 지표를 별도 열로 제시한다. 이는 유창함을 근거 품질의 대리 지표로 삼지 않는 평가 설계다.

## 작동 방식

평가표도 세 장으로 나누는 편이 낫다.

보고서 평가는 사용자의 요구를 빠짐없이 다뤘는지, 계산과 추론을 재현할 수 있는지, 본문과 결론이 서로 맞는지, 한계와 반론을 숨기지 않았는지를 본다. 여기에는 과제별 전문가 지침이 필요하다. 분야 지식이 필요한 오류를 범용 LLM 심사자에게만 맡기면 놓칠 가능성이 크다.

근거 평가는 검증 가능한 주장을 분리하고 각 주장에 출처를 연결한다. URL이 존재한다는 사실로 끝내지 않고 해당 위치를 직접 읽어 지지 범위와 단서를 기록해야 한다. 인용 정확도뿐 아니라 우선 검증할 주장 중 근거가 있는 비율, 출처의 권위와 다양성, 충돌과 오래된 자료도 함께 본다.

검색 과정 평가는 보고서 밖의 흔적을 다룬다. 어떤 검색어와 범위를 썼는지, 어떤 검색 경로를 실행하거나 건너뛰었는지, 후보를 어떤 규칙으로 정렬·제외·중복 제거했는지, 반대 근거와 최신성 충돌을 어떻게 처리했는지를 남긴다. DEER와 DeepResearch Bench는 보고서에 도착한 출처를 세밀하게 검사하지만, 버려진 검색 결과와 실행하지 않은 검색 경로까지는 충분히 보여 주지 못한다. 이 세 번째 장이 있어야 "못 찾았다"와 "찾았지만 배제했다"를 구분할 수 있다.

## AKM/공개 GitHub 연결

2026년 7월 25일 직접 확인한 공개 저장소 [DECK6/akm](https://github.com/DECK6/akm)의 default branch는 `main`이었다. 당시 HEAD `2efc02b040ec86948005fa634ae1a3b43a184a3f`의 [`EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md)는 이 간극에 대응하는 데이터 계약을 제안한다. `EvidenceRow`는 출처 정체성, 정확한 위치, 권위, 최신성, 검색 경로와 순위, 발췌문, 검증 상태를 한 행에 묶는다. 상태는 `candidate → direct-read → claim-supported`로 좁아진다. 검색에 걸린 후보는 최종 주장을 지지할 수 없고, 직접 읽었다는 사실도 특정 `claimId`의 지지를 자동으로 뜻하지 않는다.

`EvidencePacket`은 한 과제의 검색과 검증 기록을 묶는다. 실행하거나 건너뛴 검색 경로, 정렬과 결합 규칙, 출처 단위 중복 제거, 제외된 행, 주장별 지지 상태, 충돌, 누락 근거, 직접 읽기 대기열, 검증 판정을 보존한다. 공개 retrieval manifest는 exact, qmd lexical·semantic, Graphify 관계 탐색, direct read를 서로 다른 경로로 두고 원점수를 직접 비교하지 않는다. 범위와 권위를 먼저 적용하고 최신성은 동급 후보의 보조 기준으로만 쓴다.

핵심 원칙은 "후보는 검증이 아니다"다. 검색 순위와 답의 진실성을 분리하고, 유창한 합성 전에 출처 위치와 주장 지지 상태를 남긴다. 다만 공개 파일은 스키마 1.0.0의 P0 계약과 템플릿이다. retrieval manifest에도 `implementationStatus: not-implemented`, `p1MayStart: false`가 적혀 있다. 현재 작동 중인 평가 서비스로 소개하면 과장이다.

## 한계

세 층을 나눈다고 진실이 자동으로 정해지지는 않는다. 원자적 주장 추출과 지지 판정에도 모델 오차가 들어가고, 웹 문서는 바뀌거나 사라진다. 전문가 루브릭은 비용이 크며 분야별 합의도 흔들릴 수 있다. 두 연구 모두 프리프린트다. DeepResearch Bench는 벤치마크 규모, 분야 편향, 인간 평가 처리량을 명시적 한계로 든다. DEER v4가 명시한 한계는 LLM 심사자의 인간 대비 편향과 텍스트 보고서 중심 범위이며, 50개 과제·13개 분야라는 범위도 일반화의 경계로 보아야 한다.

검색 기록이 많다고 조사 품질이 높은 것도 아니다. 로그 양을 성과로 삼으면 에이전트는 불필요한 검색을 늘릴 수 있다. 과정 평가에서는 검색 횟수보다 필수 경로의 실행 여부, 제외 사유, 권위 충돌, 직접 읽기 완료율을 보아야 한다. EvidencePacket의 `PASS`도 근거 준비 상태일 뿐, 보고서 자체의 승인이나 사실의 영구 보증은 아니다.

## 설계 시사점

제품의 단일 "research quality" 점수 대신 세 개의 지표 묶음이 필요하다. 보고서 점수는 독자가 받은 결과를, 근거 점수는 주장과 출처의 연결을, 과정 점수는 검색 범위와 선택의 재현 가능성을 보여 준다. 세 점수를 평균내기보다 낮은 축과 보류 사유를 그대로 드러내는 편이 진단에 유리하다.

에이전트도 초안과 함께 최소한의 근거 묶음을 내야 한다. 우선 검증할 주장 목록, 직접 읽은 위치, 빠진 근거, 충돌, 검색 경로와 제외 사유면 충분하다. 모든 내부 추론을 공개할 필요는 없다. 의사결정에 영향을 준 검색과 검증 사건만 구조화하면 된다. 문체 평가는 이 기록과 보고서를 함께 놓고 진행해야 한다. 유창함만으로 근거를 대신할 수는 없다.

## Sources consulted

- Janghoon Han 외, [DEER: A Benchmark for Evaluating Deep Research Agents on Expert Report Generation, arXiv:2512.17776v4](https://arxiv.org/abs/2512.17776v4), 2026. PDF 원문과 추출문을 직접 확인했다.
- Mingxuan Du 외, [DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents, arXiv:2506.11763](https://arxiv.org/abs/2506.11763), 2025. arXiv PDF의 RACE, FACT, 한계 절을 직접 확인했다.
- DECK6/akm, [`99-system/EVIDENCE-SCHEMA.md`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/EVIDENCE-SCHEMA.md), 공개 `main` 확인 커밋 고정.
- DECK6/akm, [`99-system/evidence-row.schema.json`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/evidence-row.schema.json), 공개 `main` 확인 커밋 고정.
- DECK6/akm, [`99-system/templates/project-retrieval-manifest.yaml`](https://github.com/DECK6/akm/blob/2efc02b040ec86948005fa634ae1a3b43a184a3f/99-system/templates/project-retrieval-manifest.yaml), 공개 `main` 확인 커밋 고정.
