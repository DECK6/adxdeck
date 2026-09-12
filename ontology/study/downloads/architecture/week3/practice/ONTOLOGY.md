# 한국 주거 건축 온톨로지 설계

FAMILY-02 가상 주택을 줄여 만든 학습용 모델입니다. 원 모델의 공간 좌표를 사용하며 건축 인허가·구조 안전·법규 적합 판정은 포함하지 않습니다.

## 종류
- Building: 주택
- Space: 공간
- Window: 창
- Opening: 개구부
- Wall: 벽
- Door: 문
- Drawing: 도면
- Rule: 요구 조건

## 관계
- contains: 공간을 포함한다 (Building → Space)
- fillsOpening: 개구부를 채운다 (Window → Opening)
- hostedBy: 벽에 뚫려 있다 (Opening → Wall)
- bounds: 경계를 이룬다 (Wall → Space)
- connects: 공간에 연결된다 (Door → Space)
- depicts: 형상을 나타낸다 (Drawing → Building)
- appliesTo: 요구를 적용한다 (Rule → Building)

OWL 파일은 종류·관계·개체·출처를 표현합니다. 웹의 순환/필수값 검사는 별도의 경량 검사이며 OWL reasoner나 SHACL 엔진 실행 결과가 아닙니다.
