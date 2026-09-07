---
type: article
track: ai-ax
title: "에이전트 기억은 저장보다 전달에서 실패한다"
slug: agent-memory-fails-at-delivery
aliases:
  - "Agent Memory Fails at Delivery"
author:
  - "육대근"
date created: 2026-09-07
date modified: 2026-09-07
tags:
  - article
  - AI
  - ai-agent
  - agent-memory
  - context-engineering
  - knowledge-management
description: "에이전트의 장기 기억을 저장·검색 문제로만 보면 필요한 사실이 정작 행동 순간에 사라지는 이유를 놓친다. 전향적 기억 벤치마크와 cue-anchored working memory 연구를 바탕으로 전달 시점, 트리거, 예산, 수명주기 설계를 살핀다."
thumbnail: images/agent-memory-fails-at-delivery-cover.png
status: completed
---

# 에이전트 기억은 저장보다 전달에서 실패한다

![수많은 어두운 기억 조각 가운데 일부만 붉은 신호를 따라 밝은 작업 영역으로 전달되는 추상 이미지](images/agent-memory-fails-at-delivery-cover.png)

에이전트에게 배포 규칙을 문서로 남겨 두었다고 하자. 필요한 파일도 검색할 수 있고, 이전 세션의 결정도 memory store에 보존되어 있다. 그런데 에이전트는 설정 파일을 수정하는 바로 그 순간 규칙을 떠올리지 못한 채 금지된 값을 쓴다. 작업이 끝난 뒤 “관련 규칙을 찾아보라”고 물으면 정확한 문서를 제시한다.

이 실패는 저장이나 검색의 부재로 설명되지 않는다. 사실은 있었고, 나중에는 찾을 수도 있었다. 빠진 것은 **행동해야 할 순간에 그 사실이 작업 맥락으로 들어오는 전달 경로**다. 에이전트 기억을 데이터베이스의 크기와 검색 정확도만으로 평가하면 이 차이를 놓치기 쉽다.

최근 memory architecture는 무엇을 저장하고 어떻게 검색할지를 빠르게 다듬어 왔다. 하지만 저장소가 좋아졌다고 필요한 기억이 제때 쓰이는 것은 아니다. 에이전트가 스스로 검색하지 않아도 필요한 기억이 제때 도착하는지 따로 물어야 한다. 이 질문은 기억의 범위를 콘텐츠 관리에서 런타임 제어까지 넓힌다.

## 찾을 수 있는 기억과 제때 작동하는 기억은 다르다

인지과학은 이미 회고적 기억과 전향적 기억을 구분한다. 회고적 기억(retrospective memory)은 과거의 사실을 묻는 질문에 답하는 능력이다. 전향적 기억(prospective memory)은 미리 알게 된 조건을 이후의 상황에서 자발적으로 떠올려 행동하는 능력이다. “지난 회의에서 정한 배포 규칙이 무엇인가”는 회고적 기억 문제다. “운영 브랜치를 배포할 때 그 규칙을 적용하라”는 전향적 기억 문제다.

2026년 6월 공개된 [TriggerBench](https://arxiv.org/abs/2606.23459)는 이 차이를 LLM 평가로 가져왔다. 연구진은 일상 보조와 전문 업무에 걸친 `1,265`개의 전향적 기억 과제를 만들고, 같은 대화를 명시적 질문으로 바꾼 회고적 기억 대조군과 비교했다. 잘못된 알림을 측정하는 negative variant와, 동시에 다른 요청을 주어 주의를 분산시키는 overloaded variant도 함께 구성했다.

논문이 보고한 핵심은 단순한 정답률 순위가 아니다. 같은 맥락에서도 회고적 기억은 긴 context에서 높은 성능을 유지한 반면, 전향적 기억은 context가 길어질수록 뚜렷하게 약해졌다. 트리거가 암묵적이거나 다른 요청과 겹칠 때도 성능이 떨어졌다. reasoning을 강화하면 필요한 알림을 더 잘 떠올리기도 했지만, 반대로 매번 경고하는 방식으로 false alarm이 늘어나는 precision–recall trade-off가 나타났다.

이 결과가 가리키는 실패는 “모델은 오래 기억하지 못한다”보다 더 좁고 선명하다. 과거 사실을 보유하고 회수하는 능력과, 미래의 적절한 순간을 감지해 그 사실을 행동으로 바꾸는 능력은 서로 다른 평가 항목이다. memory benchmark가 명시적 질의응답만 측정하면 후자의 실패를 잡아내기 어렵다.

## 저장·검색 시스템만으로는 전달 시점을 보장할 수 없다

2025년 공개된 [Mem0 논문](https://arxiv.org/abs/2504.19413)은 ongoing conversation에서 중요한 정보를 동적으로 추출하고, 통합하고, 다시 검색하는 장기 기억 아키텍처를 제안한다. 이 접근은 전체 대화를 매번 context에 넣지 않고 필요한 정보만 골라낸다. 무엇을 기억하고 어떤 기록을 현재 질문에 불러올지를 다루는 retrieval-centric 설계다.

검색기가 있어도 “언제 검색할 것인가”는 남는다. 에이전트가 “지금 memory tool을 호출해야 한다”고 판단해야 기록이 도착한다면, 그 판단 자체가 전향적 기억에 의존한다. 결국 모델은 기억이 필요한 순간에 memory를 확인해야 한다는 사실까지 기억해야 한다.

2026년 7월 공개된 Swapnanil Saha의 [*Delivery, Not Storage: Cue-Anchored Working Memory as a Harness Property for Coding Agents*](https://arxiv.org/abs/2607.20972)는 이 순환을 끊기 위해 기억의 전달을 하네스 책임으로 옮긴다. 논문이 제안한 memory record는 콘텐츠뿐 아니라 `kind`, `triggers`, `scope`, `decay`를 함께 가진다. 트리거는 `path`, `symbol`, `semantic`, `event`, `temporal` 조건을 조합한다.

에이전트가 특정 파일을 열거나, 심볼을 수정하거나, 세션이 재개되거나, 정해진 시간이 되면 하네스가 해당 cue를 평가한다. 조건을 통과한 기억만 중복, 범위, 수명, token budget 검사를 거쳐 현재 context에 들어간다. 모델은 기억이 있는지 먼저 떠올릴 필요가 없다. 대신 어떤 조건에서 무엇이 들어왔는지 전달 경로를 감사할 수 있어야 한다.

```text
cue observed
→ scope · staleness · cooldown check
→ budgeted and provenance-framed injection
→ agent action
```

이 구조에서는 저장(storage)과 전달(delivery)이 서로 다른 계층을 이룬다. 문서, 대화 기록, vector index는 기억의 내용과 위치를 맡고, 하네스의 cue evaluator는 그중 무엇을 언제 작업 창에 올릴지 맡는다. 검색 자체를 버리는 설계는 아니다. 명시적 탐색과 넓은 조사에는 여전히 검색이 필요하다. 다만 놓쳐서는 안 될 소수의 운영 규칙은 전적으로 자발적 검색에 맡기지 않는다.

## 컴팩션은 ‘요약에 남기기’와 ‘다시 전달하기’를 갈라놓는다

Saha의 논문은 자연스러운 코딩 과제를 사용한 통제 실험에서, task-relevant facts를 memory store에 미리 넣고 tool과 안내를 제공해도 `114 turns` 동안 자발적 memory operation이 `0`회였다고 보고했다. 반면 결정론적 injection을 갖춘 seeded run `n=3`에서는 저장된 기억이 전달됐다. audit-logged trigger evaluation에서 false-alarm fire가 없었다는 결과도 제시한다.

하지만 이 수치를 일반적인 성공률로 읽어서는 안 된다. 실험은 한 코딩 과제와 한 모델 계열에 집중되어 있고, 논문 저자와 구현·평가 하네스의 이해관계도 겹친다. `n=3`은 작으며, false alarm `0`도 해당 평가의 trigger log 범위에 한정된다. 이 실험이 주는 것은 cue delivery의 보편적 우위가 아니라, 자발적 조회와 하네스 전달을 나눠 측정해야 한다는 설계 신호다.

반복 compaction probe에서는 summary와 재주입이 서로 다른 역할을 했다. 대화에만 둔 `10 facts`는 `108 summaries` 중 `106`개에서 `0/10`으로 사라졌다. 같은 사실을 하네스 소유 store에서 다시 주입한 arm에서는 `138/138 compact-resume`에 전달됐지만, final summary에는 여전히 `0/10`만 남았다.

사실을 붙잡은 쪽은 요약이 아니었다. compaction 뒤 하네스가 새 context를 구성했다. 둘을 구분하지 않으면 “더 좋은 summary prompt”가 모든 책임을 떠안는다. 요약은 이전 대화를 압축하는 장치이고, 중요한 사실을 다시 사용할 수 있게 만드는 일은 별도 복원 계약의 몫일 수 있다.

## AKM에는 거대한 새 기억 엔진보다 작은 전달 계약이 먼저다

AKM 같은 source-backed 지식 체계에 이 관점을 적용하면 source와 canonical note는 사실의 정본으로 남고, 검색 index와 graph는 다시 만들 수 있는 파생물로 유지된다. cue layer는 정본을 복제하는 또 하나의 지식 저장소가 아니라, 작업 순간에 보여 줄 짧은 운영 포인터를 관리한다.

이는 현재 구현이나 성과에 대한 설명이 아니라, 범위를 좁힌 pilot 적용안이다. pilot용 cue card에는 적어도 다음 정보가 필요하다.

- **anchor**: 특정 path, command, event, task phase처럼 관찰 가능한 조건
- **content**: 그 순간 필요한 짧은 gotcha 또는 directive
- **source**: 원문과 검증 상태로 돌아가는 locator
- **scope**: 프로젝트, 브랜치, 세션, 역할의 적용 범위
- **lifecycle**: 유효 기간, cooldown, superseded 상태
- **risk**: 잘못 주입됐을 때의 영향과 필요한 사람 승인

모든 note를 처음부터 자동 주입하면 검색 부담은 줄지만 context가 부푼다. 그래서 실패 비용이 큰 소수의 규칙부터 다뤄야 한다. 외부 공개 직전의 privacy check, 특정 파일 수정 전의 순서 제약, 긴 작업 재개 시 확인해야 할 최신 checkpoint처럼 cue를 명확히 관찰할 수 있는 항목이 적합하다. semantic similarity만으로 발화하기보다는 path와 event 같은 결정론적 조건을 우선하고, semantic cue에는 높은 threshold와 작은 예산을 둔다.

전달 단계는 read-only context construction에 한정하는 편이 안전하다. cue가 곧바로 canonical note를 수정하거나 외부 행동을 승인해서는 안 된다. 기록 표시, 기록 변경, 행동 허가를 분리해야 잘못된 memory가 자동으로 권한을 얻지 않는다.

pilot의 성공 여부를 “몇 개를 주입했는가”로 판단해서는 안 된다. 필요한데 발화하지 않은 miss, 필요 없는데 발화한 false alarm, 오래된 규칙을 보여 준 stale injection, turn당 token cost, 중복 주입, 실제로 막은 재작업을 함께 기록해야 한다. 주입량이 늘수록 좋아 보이는 지표는 가장 위험한 over-triggering에 잘못된 보상을 줄 수 있다.

## 잘못된 기억을 제때 전달하면 실패도 더 빨라진다

Cue-anchored delivery가 기억의 정확성까지 보장하지는 않는다. Saha의 논문도 memory capture를 미해결된 “open half”로 남긴다. 사실을 잘못 추출하거나 낡은 규칙을 승인했다면, 더 안정적인 전달 경로는 오류를 더 자주 노출한다. capture quality, provenance, conflict resolution, expiry를 먼저 갖추지 않은 자동 주입은 stale poisoning이 될 수 있다.

트리거 설계에도 상충 관계가 있다. path와 event는 감사하기 쉽지만, 파일 이름이 바뀌거나 같은 구조를 여러 프로젝트가 공유하면 놓칠 수 있다. semantic trigger는 표현이 달라도 관련 상황을 잡을 수 있지만 false alarm과 prompt injection의 표면을 넓힌다. event가 잦으면 같은 지침이 반복돼 모델의 주의가 오히려 약해진다. cooldown과 dedup은 편의를 위한 옵션이 아니라 전달 품질의 일부다.

권한과 개인정보는 전달 계층에서도 별도 문제다. 어떤 memory가 존재한다는 사실 자체가 민감할 수 있으며, 다른 사용자나 프로젝트의 cue가 현재 세션에 섞여서는 안 된다. scope 검사는 검색 filter가 아니라 보안 경계로 다뤄야 한다. 삭제된 원문을 가리키는 파생 cue와 cache가 함께 폐기되는지도 확인해야 한다.

전달됐다는 이유만으로 모델이 그 기억을 무조건 따라서는 안 된다. 과거의 directive가 현재 요청이나 최신 정책과 충돌할 수 있다. 주입 블록에는 source, freshness, confidence, 적용 범위를 함께 표시하고, 충돌 시 확인하거나 기권하는 경로를 남겨야 한다. 전달의 결정론성과 내용의 진실성은 같은 속성이 아니다.

## 설계 시사점

에이전트 기억은 하나의 recall score만으로 평가하기 어렵다. 최소한 capture, storage, retrieval, delivery, expiry를 분리해야 한다. 어느 단계가 실패했는지 알아야 저장하지 못한 사실, 찾지 못한 사실, 제때 전달하지 못한 사실, 폐기하지 못한 사실을 서로 다른 방식으로 고칠 수 있다.

평가에는 trigger까지의 지연도 포함해야 한다. 규칙을 알려 준 직후가 아니라 여러 turn과 distractor 뒤에 trigger를 제시하고, trigger가 없는 negative control도 함께 둔다. compaction과 session resume 뒤에도 필요한 기억이 도착하는지 확인한다. 이때 summary에 남았는지, 외부 store에서 재구성됐는지를 구분해야 한다. 오래된 규칙과 새 규칙을 동시에 넣어 잘못된 현재화가 발생하는지도 시험해야 한다.

AX에서 memory를 설계할 때는 “많이 쌓는 기능”보다 “일의 다음 순간을 바꾸는 제어 경로”라는 관점이 유용하다. 지식은 저장돼 있다는 이유만으로 사용되지 않는다. 반대로 모든 지식을 항상 보여 주면 작업 맥락이 무너진다. 필요한 것은 검증된 기억을 소수로 추려 관찰 가능한 cue와 명시적 예산 아래 전달하고, 출처와 수명주기까지 붙이는 계약이다.

에이전트가 나중에 답을 찾아냈다는 사실은 그 기억이 제 역할을 했다는 증거가 아니다. 기억의 품질은 질문에 무엇을 답했는지뿐 아니라, 행동할 순간에 무엇이 도착하고 무엇이 억제됐는지로 판단해야 한다.

## Sources

- Zhang et al., [*TriggerBench: Investigating Prospective Memory for Large Language Models*](https://arxiv.org/abs/2606.23459), arXiv:2606.23459v1, 2026-06-22.
- Saha, [*Delivery, Not Storage: Cue-Anchored Working Memory as a Harness Property for Coding Agents*](https://arxiv.org/abs/2607.20972), arXiv:2607.20972v1, 2026-07-23.
- Chhikara et al., [*Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory*](https://arxiv.org/abs/2504.19413), arXiv:2504.19413v1, 2025-04-28.
