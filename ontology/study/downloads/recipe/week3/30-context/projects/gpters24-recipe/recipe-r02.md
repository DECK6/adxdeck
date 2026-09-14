---
description: "Case-specific assumptions and relationships for the recipe training scenario."
akmLayer: context
akmRole: operating-context
akmType: context
trustLevel: unverified
CMDS: Develop
sourceType: synthesis
sourcePath: "10-sources/2026-09-14-recipe-r02.md"
nextAction: verify
date created: 2026-09-14
date modified: 2026-09-14
---

# R02 · 버터간장밥

학습용 필수 재료는 밥, 버터, 간장이다. D2는 이 메뉴의 ID다. 필요한 재료와 현재 보유한 재료는 서로 다른 관계다. 버터가 필요한 메뉴라는 사실만으로 버터를 보유했다고 읽지 않는다.

## 출처

[[10-sources/2026-09-14-recipe-r02]]

## 이 사례의 연결

- [[30-context/projects/gpters24-recipe/recipe-r04|우리 집 보관함과 판단 규칙]]

## 의미가 있는 관계

- D2 — needsIngredient → RICE (근거: R02, 실습 모델 가정)
- D2 — needsIngredient → BUTTER (근거: R02, 실습 모델 가정)
- D2 — needsIngredient → SOY (근거: R02, 실습 모델 가정)

이 노트는 특정 실습 사례의 맥락입니다. 일반화할 개념은 별도 지식 노트에서 근거와 함께 정리합니다.
