# DEXA 초등 배움 지도

`https://dexa.art/learnmap/`에 배포하는 정적 학부모용 학습 지도입니다. 서버나 계정 없이 `learnmap/data/learnmap.json`을 브라우저에서 읽고, Canvas 그래프·키보드 목록·맞춤 경로·주간 활동 보기를 제공합니다.

## 브라우저 저장과 개인정보

우리 아이 설정은 `localStorage`의 `dexa.learnmap.v1` 한 키에만 저장됩니다. 앱은 이 값을 서버로 전송하지 않으며 동기화, 분석 이벤트, `POST`, beacon, WebSocket을 사용하지 않습니다. 화면의 “내가 저장한 내용 한 번에 지우기” 버튼은 키를 즉시 제거합니다.

버전 1 스키마:

```json
{
  "version": 1,
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
node scripts/check-learnmap-parent.mjs
bun scripts/check-learnmap-browser.mjs
```

현재 계약은 성취기준 620개, 주제 1,956개, 연결 1,894개, 배움 묶음 153개입니다. 브라우저 검증은 로컬 정적 서버와 헤드리스 Chromium만 사용하며 재로드 후 설정 복원, 전체 삭제, 데이터 개수, 데스크톱·모바일 렌더링, GET 이외의 요청 부재를 확인합니다.

## 배포 경로

사이트 루트의 정적 파일 구조를 그대로 배포하면 `/learnmap/`에서 동작합니다. `index.html`은 `./styles.css`, `./app.js`, `./data/learnmap.json`, `./favicon.svg`만 상대 경로로 요청합니다. 이 작업에서는 커밋까지만 만들고 원격 저장소로 push하거나 배포하지 않습니다.

## 해석과 권리 주의

주제 상태와 추천 경로는 진단, 성적, 처방이 아닙니다. 가족이 다음 대화를 고르기 위한 브라우저 개인 메모이며, 선수 연결도 고정된 수업 순서를 뜻하지 않습니다.

교육과정 원문과 성취기준의 이용 조건은 원 출처의 공공누리·저작권 고지를 우선합니다. 이 저장소의 학부모용 설명, 그래프 투영, UI 코드는 원문 권리를 대체하거나 확장하지 않습니다. 외부 공개 전에는 데이터 provenance와 권리 상태를 다시 확인해야 합니다.
