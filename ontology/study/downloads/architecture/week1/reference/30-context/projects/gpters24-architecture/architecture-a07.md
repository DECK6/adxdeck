---
description: "Case-specific assumptions and relationships for the architecture training scenario."
akmLayer: context
akmRole: operating-context
akmType: context
trustLevel: unverified
CMDS: Develop
sourceType: synthesis
sourcePath: "00-inbox/2026-09-12-architecture-a07.md"
nextAction: verify
date created: 2026-09-12
date modified: 2026-09-12
---

# A07 · 거실 통창 · 창과 개구부와 벽

WINDOW는 폭 6000mm·높이 2400mm인 시각화 가정의 거실 통창이다. 창은 OPENING을 채우고, OPENING은 SOUTH-WALL에 뚫려 있으며 SOUTH-WALL은 LIVING의 남측 경계를 이룬다. 창 자체를 벽이나 공간으로 분류하지 않는다. 유리 구조·열성능 검토는 없다.

## 출처

[[00-inbox/2026-09-12-architecture-a07]]

## 이 사례의 연결

- [[reference/30-context/projects/gpters24-architecture/architecture-a02|거실 · 넓이와 위치]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a09|도면 · 좌표와 리비전]]
- [[reference/30-context/projects/gpters24-architecture/architecture-a10|요구 조건과 판단 보류]]

## 의미가 있는 관계

- WINDOW — fillsOpening → OPENING (근거: A07, 실습 모델 가정)
- OPENING — hostedBy → SOUTH-WALL (근거: A07, 실습 모델 가정)
- SOUTH-WALL — bounds → LIVING (근거: A07, 실습 모델 가정)

이 노트는 특정 실습 사례의 맥락입니다. 일반화할 개념은 별도 지식 노트에서 근거와 함께 정리합니다.
