---
type: article
track: ai-ax
title: "관계에 출처를 붙였다고 그 관계가 사실이 되지는 않는다"
description: "RDF 1.2의 triple term과 reifier가 지식 그래프의 관계에 출처·검토 상태를 붙이는 방법을 살펴보고, 진술 메타데이터와 사실 검증을 구분한다."
aliases:
  - "A Source on an Edge Does Not Make It True"
author: Deck
date created: 2026-09-28
date modified: 2026-09-28
tags:
  - article
  - AI
  - knowledge-graph
  - RDF
  - provenance
  - AKM
thumbnail: images/a-source-on-an-edge-does-not-make-it-true-cover.png
status: completed
---

# 관계에 출처를 붙였다고 그 관계가 사실이 되지는 않는다

![하나의 그래프 관계와 그 관계를 둘러싼 서로 다른 출처·검토 상태를 표현한 추상 개념 이미지](images/a-source-on-an-edge-does-not-make-it-true-cover.png)

*이 글의 개념을 표현하기 위해 GPT Image 2로 생성한 이미지이며, 실제 지식 그래프나 운영 화면을 재현한 것이 아니다.*

전시 기록을 지식 그래프로 옮기다 보면 애매한 장면을 자주 만난다. 한 보도자료에는 작품 A가 행사 B에 참여했다고 적혀 있다. 다른 자료는 같은 작품을 언급하지만 출품 사실은 확정하지 않는다. 그래프에 `작품 A → 참여함 → 행사 B`라는 관계를 만들고 보도자료 URL을 붙이면 표는 깔끔해진다. 문제는 그다음이다.

그러나 이 구조에는 서로 다른 질문이 겹쳐 있다. 누가 그 관계를 주장했는가. 어느 문서에서 확인했는가. 검토자는 문서를 직접 읽었는가. 그리고 현재 그래프는 그 관계를 사실로 채택했는가. 출처 링크는 첫 세 질문의 일부를 설명할 수 있지만, 마지막 질문에 자동으로 답하지는 않는다.

2026년 4월 7일 W3C Candidate Recommendation Snapshot으로 공개된 RDF 1.2 Concepts는 이 구분을 데이터 모델 안에서 다룰 수 있는 장치를 제시한다.[1] triple term으로 관계 자체를 다시 가리키고, reifier로 그 관계를 주장한 기록이나 상황을 구별한다. 이 장치를 AKM의 증거 경계에 적용하면 무엇이 달라지는지, 형식만으로는 해결되지 않는 일이 무엇인지 살펴보자.

## 관계와 그 관계를 말한 기록은 다른 대상이다

RDF의 기본 단위는 주어·술어·목적어로 이루어진 triple이다. `작품 A가 행사 B에 참여했다`를 그래프로 표현하면 작품이 주어, 참여 관계가 술어, 행사가 목적어가 된다. RDF 1.2에서 asserted triple은 해당 명제가 참이라고 주장하는 그래프의 구성원이다. RDF 그래프는 asserted triple이 나타내는 모든 주장의 논리적 결합으로 해석된다.[1]

triple term은 triple을 다른 triple의 목적어로 사용하는 RDF term이다. RDF 1.2 Concepts는 triple term이 명제(proposition)를 나타낸다고 설명한다. 그 명제가 그래프에서 참이라고 주장되는지는 별개다. 어떤 triple이 triple term으로만 나타난다면, 그 관계를 언급하거나 설명할 수는 있어도 관계 자체가 asserted triple로 채택된 것은 아니다.[1]

`rdf:reifies`는 reifier와 triple term을 연결한다. 이때 `rdf:reifies`의 주어가 reifier다. reifier는 그 명제를 주장한 기록, 믿음, 상황처럼 명제와 관련된 구체적인 대상을 나타낼 수 있고, 다른 triple의 주어나 목적어로 다시 사용될 수 있다. 같은 명제에 서로 다른 출처를 가진 여러 reifier를 연결할 수도 있다.[1]

출처가 충돌할 때 이 차이가 선명해진다. 같은 `작품 A → 참여함 → 행사 B` 관계를 두 문서가 각각 주장하더라도, 두 주장 기록은 같은 대상이 아니다. 문서별 작성자, 날짜, 직접 확인 여부, 검토 상태를 각 reifier에 붙여야 한 문서의 신뢰 상태가 다른 문서로 잘못 번지지 않는다.

## asserted와 reified를 섞으면 미확인 주장이 사실로 승격된다

RDF 1.2 Turtle은 reified triple과 annotation syntax를 모두 제공한다.[2] 둘은 겉보기에는 비슷하지만 assertion 경계가 다르다. 다음 예시는 보도자료가 참여 관계를 주장했다는 기록만 만든다. 관계 자체를 현재 그래프의 사실로 채택하지 않는다.

```turtle
VERSION "1.2"
PREFIX ex: <https://example.org/>

<< ex:workA ex:participatedIn ex:eventB ~ ex:claim17 >>
    ex:source ex:pressRelease17 ;
    ex:reviewStatus "candidate" .
```

`ex:claim17`은 관계의 출처와 검토 상태를 담는 reifier다. RDF 1.2 Turtle 문서는 이런 reified triple이 가리키는 원래 관계가 그래프에 asserted되지 않을 수 있다고 명시한다. 문서의 예에서도 누군가가 직함을 주장했다는 사실은 표현되지만, 그 직함 관계 자체는 그래프의 구성원이 아니다.[2]

반대로 아래 annotation syntax는 참여 관계를 asserted triple로 넣으면서 동시에 reifier를 만든다.

```turtle
VERSION "1.2"
PREFIX ex: <https://example.org/>

ex:workA ex:participatedIn ex:eventB ~ ex:claim17
    {| ex:source ex:pressRelease17 ;
       ex:reviewStatus "reviewed" |} .
```

두 번째 형식은 짧고 편리한 대신 의미가 더 강하다. Turtle 문서는 annotation syntax가 triple을 reify하는 동시에 assert한다고 설명한다.[2] 자료를 아직 후보로만 수집하는 단계에서 이 형식을 쓰면 검토되지 않은 관계를 그래프가 참이라고 주장할 수 있다. 파서가 받아들였다는 사실과 채택 정책을 통과했다는 사실은 다르다.

이 차이는 구현 API에서도 드러난다. Eclipse RDF4J는 RDF 1.2의 `TripleTerm`을 `Statement`가 아니라 `Value`로 표현한다. triple의 주어·술어·목적어를 담아 `rdf:reifies`의 목적어로 쓸 수 있지만, triple term을 만들었다고 원래 statement가 저장소의 asserted triple이 되는 것은 아니다.[4] RDF4J의 annotation 예시는 원래 statement를 assert하고 추가 메타데이터를 가진 reifier를 함께 만든다고 별도로 설명한다.

## AKM에서는 출처, 주장, 채택을 세 단계로 나눈다

AKM의 문서·회의·프로젝트 기록에서 관계를 추출할 때, 바로 정본 그래프에 asserted triple을 추가하지 않는 편이 안전하다. 먼저 원문에서 발견한 관계 후보를 만들고, 그 후보를 말한 기록을 reifier로 분리할 수 있다. 다음 필드는 RDF 1.2의 표준 스키마가 아니라 DEXA가 제안하는 적용안이다.

- `source`: 관계를 언급한 원문이나 공개 자료
- `locator`: 원문 안에서 해당 주장을 다시 찾을 위치
- `extractedAt`: 관계 후보를 만든 시각
- `extractor`: 사람·규칙·모델 등 추출 주체와 버전
- `reviewStatus`: `candidate`, `supported`, `rejected`, `conflicting`
- `reviewedBy`와 `reviewedAt`: 검토 사건의 주체와 시점
- `scope`: 관계가 성립한다고 판단한 시간·버전·업무 범위

여기서 `source`가 있다는 사실은 `supported`를 뜻하지 않는다. 링크가 열려도 문서가 작품 일반 소개만 담았을 수 있고, 관계의 방향이 반대일 수 있으며, 같은 이름의 다른 작품을 가리킬 수도 있다. 출처는 검토할 대상을 제공한다. 해당 출처가 바로 그 관계를 지지하는지는 사람이든 검증 절차든 별도로 판정해야 한다.

검토가 끝난 뒤에도 reifier를 버릴 이유는 없다. 관계를 asserted triple로 승격하더라도 어느 자료와 판단이 그 승격을 지지했는지 남아야 한다. 이후 더 강한 반대 근거가 들어오면, 과거의 출처 기록을 덮어쓰는 대신 새 reifier와 검토 사건을 추가하고 현재 채택 상태를 바꿀 수 있다. 같은 명제에 여러 reifier를 둘 수 있다는 RDF 1.2의 모델은 이 이력을 표현할 자리를 제공한다.[1]

reifier를 곧 사실 버전으로 부르는 것도 주의해야 한다. 같은 관계에 reifier가 두 개 있다는 것은 두 번의 주장이나 서로 다른 상황을 표현할 수 있다는 뜻이다. 어느 쪽이 최신 정본인지, 두 주장이 같은 기간을 다루는지, 서로 충돌하는지는 별도 업무 규칙이 판단한다. `rdf:reifies`의 의미가 의도적으로 일반적이라는 사양 설명을 승인 워크플로의 완성된 의미로 확대해서는 안 된다.[1]

## 형식 호환성과 의미 보존은 따로 시험한다

RDF 1.2의 triple term을 쓰기로 결정해도 도구 지원은 자동으로 따라오지 않는다. RDF 1.2 Interoperability Note는 triple term을 허용하는 RDF 1.2 Full과 triple term을 쓰지 않는 RDF 1.2 Basic을 구분한다.[3] Full 그래프를 Basic 표현으로 바꾸는 변환은 원래 입력을 복원할 수 있도록 정보 보존을 목표로 하지만, 변환된 그래프가 원래 그래프와 의미론적으로 동등하다고 보장하지는 않는다.[3]

독립 구현 문서도 같은 경계를 보여 준다. RDF4J는 triple term의 생성·저장·질의와 RDF 1.1 reification 사이의 변환을 지원하지만, 모든 저장소가 triple term을 네이티브로 처리하는 것은 아니라고 경고한다. 지원하지 않는 저장소에 업로드하면 오류가 나거나 호환 인코딩으로 바뀔 수 있다.[4]

파일을 한 번 파싱했다고 도입 시험이 끝나는 것은 아니다. 사용 중인 parser, store, query engine, serializer가 같은 assertion 경계를 보존하는지 확인해야 한다. `candidate` 관계가 왕복 변환 뒤 asserted triple로 생기지 않는지, 같은 명제의 여러 reifier가 합쳐지지 않는지, IRI reifier와 blank node의 식별성이 필요한 범위에서 유지되는지 살펴본다. SPARQL 질의가 reifier의 출처와 원래 관계를 함께 회수하는지도 고정 사례로 시험해야 한다.

Candidate Recommendation과 Working Draft를 곧바로 안정 규격으로 취급해서도 안 된다. 이 글은 RDF 1.2 Concepts의 2026년 4월 7일 Candidate Recommendation Snapshot, Turtle의 2026년 8월 12일 Working Draft, Interoperability Note의 2026년 3월 9일 초안을 기준으로 읽었다.[1][2][3] 실제 도입에서는 설치한 도구 버전과 구현 보고서, 해당 버전의 문법을 다시 고정해야 한다.

## 그래프에 필요한 것은 더 많은 선보다 판정 가능한 관계다

RDF 1.2의 triple term과 reifier는 관계 수준의 메타데이터를 표현하기 쉽게 만든다. 어떤 문서가 무엇을 주장했는지, 같은 명제에 몇 개의 출처와 상황이 있는지, 원래 관계가 현재 그래프에서 asserted됐는지를 나눠 기록할 수 있다. 이것은 지식 그래프의 출처 이력을 더 정밀하게 만드는 장치다.

하지만 `source`, `confidence`, `reviewed` 같은 속성이 붙었다고 관계의 사실성이 올라가지는 않는다. 누가 어떤 근거를 어느 범위까지 확인했는지 읽을 수 있어야 하고, 채택되지 않은 주장이 형식 변환이나 편리한 annotation syntax 때문에 사실로 승격되지 않아야 한다. 충돌하는 주장도 평균 점수 하나로 합치지 말고 출처와 판정 이력을 보존해야 한다.

첫 시험에는 관계 하나면 충분하다. 원문 두 개가 같은 관계를 다르게 말하는 사례를 고르고, 각각의 reifier를 만든 뒤 하나는 `supported`, 다른 하나는 `conflicting`으로 남긴다. asserted 관계를 제거하거나 바꿨을 때 출처 이력이 사라지지 않는지, RDF 1.2 Full과 호환 표현을 왕복한 뒤 assertion 상태가 유지되는지도 확인한다. 연결 수가 많아졌다는 보고보다 관계와 그 관계를 믿은 이유를 서로 바꾸지 않고 설명할 수 있는지가 더 중요한 도입 기준이다.

## 참고 자료

[1] [RDF 1.2 Concepts and Abstract Data Model, W3C Candidate Recommendation Snapshot, 2026-04-07](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/)

[2] [RDF 1.2 Turtle, W3C Working Draft, 2026-08-12](https://www.w3.org/TR/2026/WD-rdf12-turtle-20260812/)

[3] [RDF 1.2 Interoperability, W3C Group Note Draft, 2026-03-09](https://www.w3.org/TR/2026/DNOTE-rdf12-interop-20260309/)

[4] [RDF 1.2 Triple Terms and SPARQL 1.2, Eclipse RDF4J](https://rdf4j.org/documentation/programming/rdf12/)
