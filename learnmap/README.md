# DEXA 초등 배움 지도

`https://dexa.art/learnmap/`에 배포하는 정적 학부모용 학습 지도입니다. 서버나 계정 없이 `learnmap/data/learnmap.json`을 브라우저에서 읽고, Canvas 그래프·키보드 목록·맞춤 경로·주간 활동 보기를 제공합니다.

## 브라우저 저장과 개인정보

우리 아이 설정은 `localStorage`의 `dexa.learnmap.v2` 한 키에만 저장됩니다. 앱은 이 값을 서버로 전송하지 않으며 동기화, 분석 이벤트, `POST`, beacon, WebSocket을 사용하지 않습니다. 기존 `dexa.learnmap.v1` 설정은 첫 로드에서 같은 값의 v2로 옮긴 뒤 기존 키를 제거합니다. 화면의 “내가 저장한 내용 한 번에 지우기” 버튼은 현재 키와 남아 있을 수 있는 구버전 키를 함께 제거합니다.

버전 2 스키마:

```json
{
  "version": 2,
  "nickname": "별이",
  "grade": "3-4",
  "subjects": ["Korean Language", "Mathematics"],
  "statuses": {
    "node-id": "practicing"
  },
  "favorites": ["node-id"]
}
```

`nickname`은 선택값이며 24자로 제한합니다. `grade`와 `subjects`는 공개 데이터의 ID를 사용합니다. 상태 값은 `familiar`(익숙해요), `practicing`(연습 중이에요), `preview`(먼저 살펴봐요) 중 하나입니다. 데이터 로드 때 존재하지 않는 학년군·과목·주제 ID는 제거합니다. 저장소가 차단되거나 손상돼도 빈 설정으로 계속 사용할 수 있습니다.

## 데이터 빌드와 검증

공개용 투영 파일은 전체 성취기준 원본에서 결정적으로 생성합니다.

```sh
node scripts/build-learnmap-data.mjs
node scripts/check-learnmap-data.mjs
node scripts/check-learnmap-ontology.mjs
node scripts/check-learnmap-profile.mjs
node scripts/check-learnmap-parent.mjs
node scripts/check-learnmap-browser.mjs
```

현재 계약은 성취기준 620개, 주제 1,956개, 직접 선수 관계 1,894개, 배움 묶음 153개입니다. 데이터 검증은 결정적 재빌드, 온톨로지 방향·필수/권장 의미, 정렬 관계, 간접 경로 합계, 공개 아티팩트 해시를 확인합니다. 브라우저 검증은 로컬 정적 서버와 헤드리스 Chromium을 우선 사용하며, localhost 바인딩이 막힌 샌드박스에서는 `file://` fallback으로 실제 Chromium DOM 검증을 계속합니다. v1 설정 마이그레이션, 재로드 후 복원, 전체 삭제, `/learnmap/` 상대 경로 또는 상대 파일 로드, 데스크톱·모바일 렌더링, GET 이외의 요청 부재를 확인합니다. 최종 후보의 명령·해시·캡처·잔여 위험은 [`VERIFICATION.md`](VERIFICATION.md)에 기록합니다.

## 온톨로지 공개 계약

화면용 `learnmap/data/learnmap.json`은 P3 온톨로지의 슬림 투영입니다. 주제·성취기준·배움 묶음에는 GitHub Pages에서 안정적으로 쓸 수 있는 `https://dexa.art/learnmap/#/…` fragment URI가 들어갑니다. `directRequires`는 **의존 주제 → 선수 주제** 방향의 검토된 모델 상대적 제안이며, `hard`는 이 모델 안의 `required`, `soft`는 `recommended`를 뜻합니다. `unlocks`는 그 역방향 파생 관계이고, 간접 선수 요약은 직접 관계를 두 단계 이상 따라가 계산합니다. 주제별 간접 예시는 선수·다음 방향 각각 최대 3개만 담아 화면 설명에 사용합니다. 어느 관계도 모든 아이에게 고정된 보편 순서나 진단을 뜻하지 않습니다.

전체 RDF 다운로드는 정식 릴리스의 공개 아티팩트 두 개만 제공합니다.

- `learnmap/ontology/learning-map.ttl`
- `learnmap/ontology/learning-map.jsonld`

`node scripts/sync-learnmap-ontology.mjs`는 형제 저장소의 P3 release manifest 해시와 크기를 확인해 두 파일만 복사하고, `--check`는 커밋된 파일을 다시 검증합니다. 슬림 투영에는 공식 원문, 출처 로케이터, 출처 URL을 넣지 않습니다. 자동 게이트 통과, 진행 중인 외부 교육 검토, 독립·비공식 상태, 권리 `HOLD`는 서로 독립된 상태로 표시합니다.

## 배포 경로

사이트 루트의 정적 파일 구조를 그대로 배포하면 `/learnmap/`에서 동작합니다. `index.html`과 모듈은 `./styles.css`, `./app.js`, `./profile-schema.js`, `./data/learnmap.json`, `./favicon.svg`, `./ontology/…`을 모두 상대 경로로 요청합니다. sitemap의 공개 주소는 `https://dexa.art/learnmap/`입니다. 이 작업에서는 커밋까지만 만들고 원격 저장소로 push하거나 배포하지 않습니다.

## 해석과 권리 주의

주제 상태와 추천 경로는 진단, 성적, 처방이 아닙니다. 가족이 다음 대화를 고르기 위한 브라우저 개인 메모이며, 선수 연결도 고정된 수업 순서를 뜻하지 않습니다. 이 온톨로지는 교육부·NCIC의 공식 온톨로지가 아닙니다.

교육과정 원문과 성취기준의 이용 조건은 원 출처의 공공누리·저작권 고지를 우선합니다. 이 저장소의 학부모용 설명, 그래프 투영, UI 코드는 원문 권리를 대체하거나 확장하지 않습니다. 외부 공개 전에는 데이터 provenance와 권리 상태를 다시 확인해야 합니다.
