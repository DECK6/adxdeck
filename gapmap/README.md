# 학교급 전환 갭 지도 (Transition Gap Map)

대한민국 2022 개정 교육과정의 **학교급 전환 구간(초→중, 중→고)** 에서 과목별 학습 연계가 공식 문서상 얼마나 이어지는지·끊기는지를 정량화한 갭 지도다. [한국 초등 학습지도](https://github.com/DECK6/korean-elementary-learning-map)와 [한국 중등 학습지도](https://github.com/DECK6/korean-secondary-learning-map)의 공식 근거 데이터(전건 인쇄 쪽번호 locator 보유)를 입력으로 사용한다.

## 산출물

- `data/gap-report.json` — 전환 구간×과목 단위 갭 지표와 성취기준 단위 근거
- `docs/gap-overview.md`, `docs/gaps/<subject>.md` — 과목별 갭 리포트 (신규 도입 개념 목록, 전환기 체크포인트)
- `ui/` — 과목별 갭 대시보드 (정적, 의존성 없음)

## 갭 지표 (모두 공식 문서 명시 기반)

| 지표 | 정의 |
| --- | --- |
| `coveragePct` | 상위 학교급 성취기준 중 하위 학교급과의 공식 연계가 명시된 비율 |
| `unlinkedRatio` | 공식 연계가 없는 성취기준 비율 (신규 도입 후보) |
| `densityJump` | 연간 성취기준 수 비율 (하위→상위 학교급) |
| `structureSplit` | 교과 구조 분화 여부 (예: 실과 → 기술·가정+정보, 사회 → 사회+역사) |
| `gapScore` | `round(100 × (0.5×unlinkedRatio + 0.3×min(densityJump/3, 1) + 0.2×structureSplit))` |

`miningDensityCaveat: true`인 과목은 원천 문서의 내용 체계 표기 방식 차이로 연계가 과소 집계될 수 있음을 뜻한다 (예: 수학). 이 플래그는 스코어에 반영하지 않고 항상 함께 표시한다.

## 중요한 경계

- 이 지도의 "갭"은 **공식 문서가 연계를 명시하지 않았다**는 사실의 지표이며, 학생 성취도 하락이나 교육적 결손을 직접 측정한 것이 아니다.
- 실제 현장 갭 검증에는 성취도 데이터(국가수준 학업성취도 평가 등)와 교과 전문가 검토가 필요하다.
- 개별 학습자를 진단하지 않으며, 교육부·국가교육위원회·NCIC의 공식 자료가 아니다.
- 입력 두 저장소의 릴리스 버전·파일 해시를 `data/gap-report.json`의 `generatedFrom`에 핀한다. 입력이 바뀌면 재생성한다.

## 실행

```bash
bun run build     # 두 학습지도에서 gap-report.json 생성
bun run build:docs
bun run verify    # 결정성·스키마·카운트 게이트 + 테스트
bun run serve     # UI 로컬 확인
```

입력 경로는 기본적으로 형제 디렉토리(`../korean-elementary-learning-map`, `../korean-secondary-learning-map`)이며 `ELEM_MAP_DIR`/`SECONDARY_MAP_DIR` 환경변수로 바꿀 수 있다.

## 라이선스

MIT (원저작자 DECK, github.com/DECK6). 입력 데이터셋도 각각 MIT다.
