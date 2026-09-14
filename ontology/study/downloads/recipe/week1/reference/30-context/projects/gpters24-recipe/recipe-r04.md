---
description: "Case-specific assumptions and relationships for the recipe training scenario."
akmLayer: context
akmRole: operating-context
akmType: context
trustLevel: unverified
CMDS: Develop
sourceType: synthesis
sourcePath: "00-inbox/2026-09-14-recipe-r04.md"
nextAction: verify
date created: 2026-09-14
date modified: 2026-09-14
---

# R04 · 우리 집 보관함과 판단 규칙

기본 시나리오: 밥·달걀·간장은 있고 버터는 없다. 이번 실습의 재고 목록은 전부 확인했으며 inventoryComplete=true다. 규칙: 등록된 필수 재료가 모두 보유 관계로 연결되면 재료 충족이다. 조건 변경 실험은 버터를 추가해 세 메뉴를 다시 확인하는 것이다. 목록 확인을 미완료(inventoryComplete=false)로 바꾼 실험에서는 연결이 없는 재료를 없다고 단정하지 않고 미확인으로 남긴다. 시나리오 변경은 실습 가정이며 실제 냉장고 조사 결과가 아니다.

## 출처

[[00-inbox/2026-09-14-recipe-r04]]

## 이 사례의 연결

- [[reference/30-context/projects/gpters24-recipe/recipe-r01|간장달걀밥]]
- [[reference/30-context/projects/gpters24-recipe/recipe-r02|버터간장밥]]
- [[reference/30-context/projects/gpters24-recipe/recipe-r03|버터달걀밥]]

## 의미가 있는 관계

- PANTRY — hasIngredient → RICE (근거: R04, 실습 모델 가정)
- PANTRY — hasIngredient → EGG (근거: R04, 실습 모델 가정)
- PANTRY — hasIngredient → SOY (근거: R04, 실습 모델 가정)

이 노트는 특정 실습 사례의 맥락입니다. 일반화할 개념은 별도 지식 노트에서 근거와 함께 정리합니다.
