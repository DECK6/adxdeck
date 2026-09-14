---
description: "Case-specific assumptions and relationships for the recipe training scenario."
akmLayer: context
akmRole: operating-context
akmType: context
trustLevel: unverified
CMDS: Develop
sourceType: synthesis
sourcePath: "00-inbox/2026-09-14-recipe-r03.md"
nextAction: verify
date created: 2026-09-14
date modified: 2026-09-14
---

# R03 · 버터달걀밥

학습용 필수 재료는 밥, 버터, 달걀이다. D3는 이 메뉴의 ID다. R01·R02에 나온 밥·달걀·버터와 같은 재료 ID를 재사용한다. 같은 이름의 재료를 메뉴마다 중복 생성하지 않는다.

## 출처

[[00-inbox/2026-09-14-recipe-r03]]

## 이 사례의 연결

- [[reference/30-context/projects/gpters24-recipe/recipe-r01|간장달걀밥]]
- [[reference/30-context/projects/gpters24-recipe/recipe-r02|버터간장밥]]
- [[reference/30-context/projects/gpters24-recipe/recipe-r04|우리 집 보관함과 판단 규칙]]

## 의미가 있는 관계

- D3 — needsIngredient → RICE (근거: R03, 실습 모델 가정)
- D3 — needsIngredient → BUTTER (근거: R03, 실습 모델 가정)
- D3 — needsIngredient → EGG (근거: R03, 실습 모델 가정)

이 노트는 특정 실습 사례의 맥락입니다. 일반화할 개념은 별도 지식 노트에서 근거와 함께 정리합니다.
