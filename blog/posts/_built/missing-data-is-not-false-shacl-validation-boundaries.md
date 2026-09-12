---
type: article
track: ai-ax
title: "빠진 정보는 거짓이 아니다: SHACL로 업무 그래프의 입력 경계를 세우기"
aliases:
  - "missing-data-is-not-false-shacl-validation-boundaries"
author: 육대근
date created: 2026-09-12
date modified: 2026-09-12
tags:
  - article
  - ai-ax
  - graph-engineering
  - SHACL
  - OWL
  - data-validation
  - knowledge-graph
description: "OWL의 열린 세계 추론과 SHACL의 데이터 그래프 검증을 구별하고, shape target·검증 보고서·폐쇄 조건으로 업무상 필수 정보의 누락을 다루는 설계 원칙을 살펴본다."
thumbnail: images/missing-data-is-not-false-shacl-validation-boundaries-cover.png
status: completed
publishReady: true
---

# 빠진 정보는 거짓이 아니다: SHACL로 업무 그래프의 입력 경계를 세우기

![열린 지식 공간과 제한된 검증 프레임 사이에서 누락된 연결을 점검하는 추상 개념 이미지](images/missing-data-is-not-false-shacl-validation-boundaries-cover.png)

*AI로 생성한 개념 이미지이며 실제 시스템이나 데이터의 기록이 아니다.*

계약 검토 기록을 그래프로 옮긴다고 해 보자. 승인된 계약에는 원문 링크, 담당자, 승인일이 있어야 한다. 그런데 승인일이 비어 있다. 이를 보고 “승인되지 않았다”고 결론 내리면 업무 사실을 바꾼다. 반대로 “그래프는 열린 세계이므로 어딘가에 값이 있을 수 있다”고 넘기면 입력 검증을 포기한다. 누락을 거짓으로 취급하거나 방치하는 오류가 같은 자리에서 생긴다.

여기서는 질문을 둘로 나눠야 한다. OWL은 어떤 공리에서 무엇이 따라오는지 해석한다. SHACL은 지금 건넨 데이터 그래프가 정해 둔 조건을 만족하는지 판정한다. 둘 다 RDF를 다루지만 보증하는 것은 다르다. 이 글은 지식 그래프 추출이나 답변의 근거 계약 대신, 제출된 그래프의 어느 노드를 어떤 shape로 검사하고 실패를 어떤 보고서로 남길지에 집중한다.

## 1. OWL의 최소 카디널리티는 빈 입력 칸 검사기가 아니다

OWL 2의 클래스 표현은 세계에 관한 의미적 조건을 기술한다. 예를 들어 어떤 종류의 승인 기록이 승인일 값을 최소 하나 가진다고 공리화할 수 있다. [OWL 2 Direct Semantics](https://www.w3.org/TR/owl2-direct-semantics/)는 이런 표현을 해석 구조 안에서 만족해야 할 집합 조건으로 정의한다. reasoner는 “현재 파일에 승인일 트리플이 적혀 있는가”만 보지 않는다. 주어진 공리와 사실을 함께 만족하는 해석이 가능한지를 본다.

여기서 열린 세계 가정이 중요하다. 데이터에 승인일이 보이지 않는다는 사실만으로 승인일이 없다고 확정하지 않는다. 알려지지 않은 값이 존재할 수 있기 때문이다. 승인일 최소 하나라는 제한과 승인일이 빠진 개체가 함께 있어도, 다른 공리가 충돌을 만들지 않는 한 미기록 값을 가진 해석이 가능하다. 따라서 OWL의 최소 카디널리티를 관계형 데이터베이스의 `NOT NULL`이나 폼의 필수 입력 검사처럼 쓰면 기대와 결과가 어긋난다.

“빠졌다”와 “거짓이다”도 분리해야 한다. 현재 그래프에 승인일 진술이 없다는 것은 관찰 가능한 데이터 상태다. 해당 계약이 승인되지 않았다는 것은 업무 세계에 관한 부정 주장이다. 후자를 말하려면 미승인 상태를 기록하거나 조사 범위가 완전하다는 별도 약속이 필요하다. 단순한 부재로는 부족하다.

OWL은 여전히 필요하다. 승인 기록, 계약, 담당자의 의미를 정의하고 클래스 포함 관계나 속성의 논리적 함의를 계산하는 일에는 OWL이 맞다. 입력 시점에 필수값이 실제로 들어왔는지, 값이 하나뿐인지, 허용한 속성만 있는지를 검사하는 일은 다른 장치가 맡아야 한다. 이 역할 구분이 Graph Engineering의 첫 번째 경계다.

## 2. SHACL 검증은 target에서 report까지 이어지는 절차다

2017년 [W3C SHACL Recommendation](https://www.w3.org/TR/shacl/)은 기준선이자 현재 확정된 계보다. 이 규격은 조건을 담은 shapes graph와 검사할 data graph를 구별한다. 검증은 shapes graph를 데이터 설명서처럼 읽는 일로 끝나지 않는다. 활성화된 shape의 target을 계산해 focus node를 고르고, property path로 각 focus node의 value node를 구한 다음, constraint component를 평가한다.

특히 target을 대충 정해서는 안 된다. `승인된 계약 기록`만 검사하려면 무엇이 그 집합에 들어오는지 먼저 정해야 한다. 타입이 붙은 노드나 특정 주어·목적어 관계를 가진 노드를 고를 수 있다. target에도 잡히지 않고 다른 shape의 참조로도 검사 대상이 되지 않는 노드는 shape가 엄격해도 검사되지 않는다. 검증 누락을 constraint 부족으로만 보면 원인을 놓친다. 타입 부여 전 단계의 레코드까지 검사해야 한다면 수집 단계용 target이나 명시적 대상 목록을 따로 설계해야 한다.

focus node가 정해지면 `minCount`는 현재 검증에 사용된 데이터 그래프에서 경로를 따라 얻은 값의 개수를 센다. 승인일 경로의 값이 없고 최소 하나를 요구했다면 위반이다. 이 판정의 뜻은 “현실에 승인일이 없다”가 아니라 “이번 입력 그래프가 이 shape에서 요구한 승인일 값을 제공하지 않았다”이다. 같은 노드에 담당자가 여럿이면 `maxCount`, 날짜 리터럴의 자료형이 다르면 `datatype`, 값의 클래스가 다르면 `class` 같은 조건이 각각 다른 실패를 만든다.

결과는 참·거짓 한 비트로만 끝나지 않는다. SHACL validation report는 전체 적합 여부와 개별 validation result를 RDF로 표현한다. 최근 [SHACL 1.2 Core Working Draft](https://www.w3.org/TR/shacl12-core/)도 실패한 데이터 노드인 `sh:focusNode`와, 해당하는 경우 관련 경로인 `sh:resultPath`, 문제가 된 값인 `sh:value`, 심각도와 메시지 등을 보고서 정보로 설명한다. 이 보고서를 저장하면 “검증 실패”를 수정할 데이터 문제로 돌려줄 수 있다. 검증기가 실행되지 못한 failure와 정상 실행 뒤 나온 non-conformance도 같은 상태로 뭉개지 않는 편이 좋다.

폐쇄 조건은 필요한 범위에만 건다. SHACL의 `sh:closed true`는 해당 shape에 연결된 property shape의 경로 중 단일 IRI인 속성과 `sh:ignoredProperties`에 열거한 속성 외의 술어가 focus node에 있으면 위반으로 보고한다. 그러나 SHACL 전체가 자동으로 폐쇄 세계가 되는 것은 아니다. 한 node shape를 닫아도 다른 노드나 다른 target까지 저절로 닫히지 않는다. 확장 가능한 메타데이터를 모두 금지하면 정상 입력도 막을 수 있으므로, 거래·승인처럼 허용 필드를 엄격히 관리해야 하는 경계에서만 폐쇄를 선택해야 한다.

## 3. AKM에는 정본 판정기가 아니라 제출 검증 경계로 제안한다

다음은 AKM에 이미 구현된 기능이나 도입 성과가 아니라 DEXA의 가상 설계 제안이다. 대상은 모든 노트가 아니라 `게시 승인된 주장 기록`처럼 업무 상태가 분명한 작은 입력 묶음이다. 원문 Markdown과 출처는 정본으로 남기고, 파생된 RDF 데이터 그래프를 제출 스냅샷으로 고정한다. shapes graph도 별도 파일로 버전과 적용 목적을 기록한다. 그래야 같은 데이터가 다른 판정을 받은 이유를 데이터 변경과 shape 변경으로 나눠 추적할 수 있다.

첫 shape는 승인 대상만 겨냥한다. 승인 상태가 명시된 주장 기록을 target으로 삼고, 원출처 식별자와 원문 위치, 검토 상태를 필수 경로로 요구하는 식이다. 여기서 `sourceNotes` 필드의 존재와 특정 문장을 지지하는 원문 구간의 확인은 여전히 다르다. SHACL은 링크와 locator의 존재·개수·자료형을 검사할 수 있지만, 인용한 문장이 주장을 지지하는지는 사람이 원문을 읽거나 별도 근거 심사를 해야 한다.

둘째, 검사 시점을 상태 전이 앞에 둔다. 후보 레코드는 불완전한 채로 보존할 수 있다. 다만 `approved`나 `publish-ready`로 승격하려는 제출물에는 승인용 shape를 적용한다. 통과하지 못한 레코드를 삭제하거나 “거짓”으로 바꾸지 않고, 현재 입력이 어느 조건을 충족하지 못했는지 보고서와 함께 후보 상태에 남긴다. 이 방식은 수집의 개방성과 배포 경계의 엄격함을 동시에 유지한다.

셋째, validation report를 실행 증거로 보존한다. 데이터 스냅샷 식별자, shapes graph 버전, 검증기와 옵션, 추론 전처리 여부, 전체 적합 여부, 개별 결과를 함께 남긴다. [Apache Jena의 현재 SHACL 문서](https://jena.apache.org/documentation/shacl/)는 shapes와 data를 입력으로 받아 보고서를 텍스트와 RDF로 출력하는 경로를 설명하고, Fuseki에서는 검사할 default·named·union graph를 명시하도록 한다. 특정 도구를 채택하자는 뜻은 아니다. “어느 그래프를 검사했는가”가 실행 계약의 일부라는 예로 읽으면 된다.

폐쇄 shape는 승인 레코드의 외곽에만 고려한다. 예를 들어 승인 레코드 자체에는 정해진 업무 속성만 허용하되, 연결된 원문 문서 노드는 새로운 메타데이터를 받아들일 수 있게 열어 둘 수 있다. target과 폐쇄 범위를 같은 문서에 설명하지 않으면, 팀은 “SHACL을 적용했으니 그래프 전체가 검증됐다”고 오해하기 쉽다.

## 4. 통과 판정보다 먼저 검사 범위를 읽어야 한다

SHACL 통과는 shape에 적힌 조건에 대한 판정일 뿐이다. shape에 없는 조건, target 밖의 노드, 검사 그래프에 포함되지 않은 named graph는 통과 여부와 무관하다. 잘못된 출처 URL도 문자열 형식과 개수만 맞으면 통과한다. 낡은 승인일이 올바른 날짜 자료형이라는 이유로 최신 상태가 되지도 않는다. validation semantics는 사실 검증, 출처의 권위, 최신성 판단을 대체하지 않는다.

추론과 검증을 결합할 때는 순서를 고정해야 한다. 일부 도구는 RDFS나 OWL RL 추론으로 데이터 그래프를 확장한 뒤 SHACL을 실행할 수 있다. 그러면 명시 입력에는 없던 타입이나 값이 추론 결과로 생겨 target과 제약 판정이 달라질 수 있다. 원시 제출 데이터의 충실도를 검사하려는지, 선택한 추론 체계로 확장된 그래프의 적합성을 검사하려는지 먼저 정하고 보고서에 남겨야 한다. 그렇지 않으면 누락된 입력을 추론이 메워 통과한 것과 사용자가 실제로 값을 제출한 것을 구별하기 어렵다.

shape 자체도 검토 대상이다. target이 너무 좁으면 검사를 피하는 데이터가 생기고, 너무 넓으면 아직 수집 중인 후보까지 승인 규칙으로 막는다. `closed`를 켠 shape에 허용 속성을 빠뜨리면 정상 확장이 위반이 된다. 심각도 설정을 운영 게이트와 연결하지 않으면 같은 결과를 두 팀이 다르게 처리할 수 있다. 보고서가 정교해도 shapes graph가 업무 규칙을 잘못 옮겼다면 판정도 틀린다.

표준 상태도 경계에 포함한다. 2026년 8월 28일자 SHACL 1.2 Core는 W3C Recommendation 트랙의 Working Draft이며, 문서 자체가 W3C 회원의 승인을 뜻하지 않고 작업 중 문서로 인용해야 한다고 밝힌다. [SHACL 1.2 Node Expressions](https://www.w3.org/TR/shacl12-node-expr/)도 Working Draft로, 동적으로 focus node를 계산하는 방향을 제시하지만 확정 표준처럼 다루면 안 된다. 현재 운영 기준은 2017 Recommendation과 실제 검증기의 지원 범위를 고정하고, 1.2 기능은 별도 호환성 시험 뒤에 검토하는 편이 안전하다.

실무에서는 역할을 이렇게 나누면 된다. 개념의 의미와 논리적 함의를 다루면 OWL을 검토한다. 현재 제출 그래프에서 업무상 필수 정보의 존재·개수·자료형·허용 속성을 검사하려면 SHACL을 사용한다. 그때도 target, 입력 그래프 경계, 추론 전처리, shape 버전, validation report 보존을 함께 정한다. “없음”을 “거짓”으로 바꾸지 않고도, “이번 제출에는 필요한 값이 없다”고 정확히 거부할 수 있어야 한다.

## 참고자료

- W3C, [OWL 2 Web Ontology Language Direct Semantics (Second Edition)](https://www.w3.org/TR/owl2-direct-semantics/), W3C Recommendation, 2012-12-11.
- W3C, [Shapes Constraint Language (SHACL)](https://www.w3.org/TR/shacl/), W3C Recommendation, 2017-07-20. 현행 확정 기준선과 계보로 사용.
- W3C, [SHACL 1.2 Core](https://www.w3.org/TR/shacl12-core/), W3C Working Draft, 2026-08-28. 진행 중 문서로만 사용.
- W3C, [SHACL 1.2 Node Expressions](https://www.w3.org/TR/shacl12-node-expr/), Working Draft. 진행 중 문서로만 사용.
- Apache Software Foundation, [Apache Jena SHACL](https://jena.apache.org/documentation/shacl/), 현행 공식 도구 문서, 2026-09-12 확인.
