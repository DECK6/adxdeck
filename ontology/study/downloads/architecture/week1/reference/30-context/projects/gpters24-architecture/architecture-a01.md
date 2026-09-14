---
description: "Case-specific assumptions and relationships for the architecture training scenario."
akmLayer: context
akmRole: operating-context
akmType: context
trustLevel: unverified
CMDS: Develop
sourceType: synthesis
sourcePath: "00-inbox/2026-09-12-architecture-a01.md"
nextAction: verify
date created: 2026-09-12
date modified: 2026-09-12
---

# A01 · 주택 요구사항 · FAMILY-02

요청은 침실 3개, 욕실 2개, 넓은 거실과 통창, 거실·주방·다이닝 분리다. 긴 복도를 줄인 FAMILY-02 가상 배치를 대상으로 한다. 실제 주소·대지 조건·허가 정보는 없다. 이 문서는 사용자 공간 요구를 실습용으로 다시 쓴 것이다.

## 출처

[[00-inbox/2026-09-12-architecture-a01]]

## 이 사례의 연결

- [[reference/30-context/projects/gpters24-architecture/architecture-a02|거실 · 넓이와 위치]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a03|주방과 다이닝 · 분리된 공간]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a04|침실 세 개와 드레스룸]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a05|욕실 두 개]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a09|도면 · 좌표와 리비전]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a10|요구 조건과 판단 보류]]

## 의미가 있는 관계

- HOUSE — contains → LIVING (근거: A02, 실습 모델 가정)
- HOUSE — contains → DINING (근거: A03, 실습 모델 가정)
- HOUSE — contains → KITCHEN (근거: A03, 실습 모델 가정)
- HOUSE — contains → HALL (근거: A06, 실습 모델 가정)
- HOUSE — contains → BED-1 (근거: A04, 실습 모델 가정)
- HOUSE — contains → BED-2 (근거: A04, 실습 모델 가정)
- HOUSE — contains → BED-3 (근거: A04, 실습 모델 가정)
- HOUSE — contains → BATH-1 (근거: A05, 실습 모델 가정)
- HOUSE — contains → BATH-2 (근거: A05, 실습 모델 가정)
- HOUSE — contains → DRESS (근거: A04, 실습 모델 가정)

이 노트는 특정 실습 사례의 맥락입니다. 일반화할 개념은 별도 지식 노트에서 근거와 함께 정리합니다.
