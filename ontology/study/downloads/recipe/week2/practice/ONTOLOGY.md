# 요리와 보유 재료 온톨로지 설계

학습용으로 정한 필수 재료의 보유 여부만 확인합니다. 기본 시나리오는 보유 목록을 전부 확인한 상태이며, 목록이 미완료이면 미기록 재료는 보류합니다.

## 종류
- Recipe: 요리
- Ingredient: 재료
- Pantry: 보관함

## 관계
- needsIngredient: 필요로 한다 (Recipe → Ingredient)
- hasIngredient: 보유한다 (Pantry → Ingredient)

OWL 파일은 종류·관계·개체·출처를 표현합니다. 웹의 순환/필수값 검사는 별도의 경량 검사이며 OWL reasoner나 SHACL 엔진 실행 결과가 아닙니다.
