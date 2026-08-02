---
type: article
track: ai-ax
title: "레퍼런스가 많을수록 프롬프트는 더 구조적이어야 한다 — Seedance 2.5 공식 가이드에서 배운 것"
slug: why-seedance-prompts-need-explicit-reference-roles
description: "A practical, source-backed guide to structuring Seedance 2.5 prompts with explicit reference roles, exclusions, staged end states, and preservation boundaries for multimodal video generation."
aliases:
  - "Why Seedance Prompts Need Explicit Reference Roles"
author:
  - "[[육대근]]"
date created: 2026-08-02
date modified: 2026-08-02
tags:
  - article
  - seedance
  - ai-video
  - multimodal
  - prompting
  - video-editing
  - AI
thumbnail: images/seedance-2-5-reference-roles.png
status: completed
---

# 레퍼런스가 많을수록 프롬프트는 더 구조적이어야 한다 — Seedance 2.5 공식 가이드에서 배운 것

![여러 영상 프레임과 참조 카드가 역할선과 타임라인으로 연결된 추상 이미지](images/seedance-2-5-reference-roles.png)

제품 영상 하나를 만든다고 가정해 보자. 제품의 앞·옆·뒤를 보여 주는 이미지 네 장, 손동작을 담은 영상, 매장 배경 이미지, 내레이션 음성이 있다. 자료가 늘어날수록 더 자세히 묘사하면 될 것 같지만, 정작 어려워지는 것은 문장의 길이가 아니다. 어느 자료가 제품의 형태를 정하는지, 어느 자료에서 동작만 가져올지, 배경 이미지 속 사람은 왜 제외해야 하는지 구분하는 일이다.

ByteDance의 [Dreamina Seedance 2.5 Prompt Guide](https://bytedance.larkoffice.com/docx/A88jd0B47oAd8zxWp5ycZFMfnxh)는 이미지·비디오·오디오를 함께 참조하는 방식을 설명한다. 가이드 설명상 최대 50개의 참조 자료를 결합할 수 있지만, 유형별 권장 범위는 그보다 작고 자료가 늘면 안정성이 낮아질 수 있다. 지원 범위와 결과는 계정, 지역, 제품 화면, 입력 자료와 생성 조건에 따라 달라질 수 있으므로 실제 사용 환경에서 다시 확인해야 한다.

이 가이드의 가장 실용적인 결론은 단순하다. **레퍼런스가 많아질수록 더 필요한 것은 긴 묘사가 아니라 역할, 제외 조건, 단계별 종료 상태, 보존 경계를 명시하는 구조다.** 프롬프트는 분위기를 쌓는 글에서 자료 사이의 책임을 나누는 제작 명세로 바뀌어야 한다.

## 자료가 많아지면 묘사보다 관계가 먼저다

공식 가이드의 기본 공식은 짧다. 영상의 뼈대는 주체와 사건이고, 장면·스타일·카메라·오디오는 필요할 때 덧붙인다.

```text
Subject + Action or Event
+ Scene and Environment (optional)
+ Visual Style (optional)
+ Camera Movement/Cut (optional)
+ Audio (optional)
```

이 순서는 멀티모달 입력에서도 유효하지만, 참조 자료가 추가되면 한 단계가 더 필요하다. 본문을 길게 쓰기 전에 각 자료의 역할을 먼저 배정해야 한다. `@Image 1`이 인물의 외형을 정하는지, 제품의 재질을 정하는지, 공간의 조명만 정하는지 분리한다. 같은 자료에서도 가져올 속성과 버릴 속성을 함께 적는다.

```text
@Image 1 defines <subject>'s <appearance, structure, or material>. Use only those attributes.
@Video 1 defines <motion, camera movement, or pacing>. Do not use <identity, clothing, or scene>.
<Subject> completes <primary event> in <scene>.
```

이런 역할 매핑은 모델이 자료를 보았다는 사실보다 중요하다. 서로 다른 각도의 이미지가 같은 제품을 가리킨다면 “모두 하나의 제품을 정의하며 결과에는 제품 하나만 유지한다”고 적어야 한다. 배경 사진은 공간과 조명만 가져오고 사진 속 인물은 쓰지 않는다고 제한한다. 동작 영상은 손의 속도와 경로만 가져오고 출연자의 얼굴과 의상은 제외한다. 입력을 추가하는 순간 선택 가능성도 늘어나므로, 제외 조건은 오해의 범위를 줄이는 실질적인 경계다.

## 긴 사건과 편집에는 끝 상태와 보존 경계가 필요하다

여러 사건이 이어지는 영상에서는 시간 설명보다 상태 연결이 먼저다. 가이드는 긴 사건을 단계로 나누고, 각 단계에 하나의 주요 변화와 직접 확인할 수 있는 종료 상태를 두도록 안내한다. “분위기가 고조된다”보다 “인물이 문 앞에 멈추고, 상자는 오른손에 있으며, 문은 닫힌 상태다”가 다음 단계를 잇기 쉽다.

```text
[Stage 1]
Initial state: <visible starting state>.
Primary event: <one main change>.
End state: <observable positions, ownership, and scene state>.

[Stage 2]
Continue from the previous stage: <state that must remain unchanged>.
Primary event: <one main change>.
End state: <observable state>.
```

종료 상태는 다음 단계의 입력 계약이다. 인물 수, 의상, 소품의 소유권, 이동 방향, 장면의 공간 관계처럼 이어져야 할 항목을 눈에 보이는 상태로 적는다. 타임스탬프가 필요하다면 중요한 입장·퇴장·전환에 시간 예산을 줄 수 있지만, 가이드도 이를 프레임 단위의 정확한 편집점으로 보지는 않는다. 시간표만 세밀하게 쓰고 단계 사이의 상태를 비워 두면 연속성 문제는 남는다.

기존 영상을 편집할 때는 경계가 더 엄격해진다. 가이드는 원본 영상을 `sole editing master`로 선언하고, 바꿀 범위와 유지할 내용을 분리하는 틀을 제시한다.

```text
[Source Video Role]
@Video 1 is the sole editing master.

[Edit Scope]
Modify only <object, region, time range, or audio category>.

[Content to Preserve]
Keep <identity, motion, camera, audio, timing, and event order> unchanged.
```

이 선언은 참조 이미지가 원본 영상의 구도와 사건 순서를 덮어쓰지 못하게 한다. 배경만 바꾼다면 인물의 외형·위치·크기·동작은 보존하고, 참조 이미지에서는 공간 구조와 조명만 가져온다. 음악만 지운다면 대사, 입 모양, 환경음, 효과음, 화면과 편집 리듬을 유지한다고 적는다. 편집 프롬프트의 품질은 새로 넣을 묘사의 풍부함보다 무엇을 건드리지 않을지 얼마나 분명히 정했는가에 달려 있다.

## 더 길게 쓰기 전에 네 가지를 확인한다

멀티 레퍼런스 프롬프트를 검토할 때는 형용사의 수보다 네 질문이 유용하다.

- 각 자료가 통제하는 대상과 속성을 한 문장으로 말할 수 있는가?
- 각 자료에서 가져오지 않을 대상을 적었는가?
- 단계가 끝났을 때 화면에서 확인할 수 있는 상태가 있는가?
- 편집·확장 과정에서 끝까지 바뀌면 안 되는 항목을 정했는가?

네 질문에 답할 수 없다면 프롬프트를 더 길게 쓰기보다 역할표와 단계 구조부터 고쳐야 한다. 반대로 네 경계가 이미 분명하다면 장식적인 묘사를 계속 늘릴 이유는 적다. 좋은 멀티모달 프롬프트는 각 자료가 어디에서 효력을 갖고 어디에서 멈추는지 결정할 수 있는 문장이다.

이 글은 ByteDance의 Lark 문서 **Dreamina Seedance 2.5 Prompt Guide**를 2026-08-02에 열람한 소스 노트를 바탕으로 핵심 원칙과 짧은 템플릿만 재구성했다. 원문의 기능 설명은 공식 가이드의 자기설명으로 읽어야 하며, 실제 생성 품질이나 계정별 기능, 가격, 지역·API 가용성을 독립적으로 검증한 결과는 아니다.
