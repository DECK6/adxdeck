# 맥 이어하기 · 문화예술로 방명록

## 사용자 요청

- 첨부한 종이 방명록을 예쁜 별도 웹 폼으로 제작. Google Forms UI는 사용하지 않음.
- 제목: **문화예술로 방명록**.
- 키오스크 세로 **9:16**. 사진에 있는 성별 남/여, 연령대 유아/초등/중등/고등/대학/성인, 초상권 및 개인정보 사용 동의/비동의.
- 공개 위치는 dexa.art/sorizieum. 기존 전시 화면이 있으므로 `/sorizieum/guestbook/` 하위 경로를 제안하고 준비한 상태.
- Google 시트는 새로 만들라는 사용자 지시로 아래 시트 생성 완료.
- Google 자동저장 연결은 **맥의 Aside**로 진행하기를 원함.
- 마지막 요청: Windows 세션임을 알고 맥으로 이어가기를 요청.

## 상태

화면·저장 코드 작성 및 모의 검증 완료. **실제 Google 저장과 공개 배포는 아직 안 됨.**

- 화면: `index.html`, `style.css`, `app.js`, `config.js`. 외부 의존성·빌드 없음.
- 디자인: 아이보리 종이색, 짙은 초록, 테라코타 포인트, 소리의 흐름을 표현한 SVG, 큰 터치 선택.
- 선택은 각 그룹 하나씩, 비동의도 접수 가능. 이름·연락처 없음.
- 저장 응답을 읽고 접수 ID가 맞을 때만 감사 화면 → 6초 후 초기화. 90초 미사용도 초기화.
- 중복 탭 방지, 네트워크 재시도 때 동일 UUID 사용. 입력값은 브라우저 영구 저장 안 함.
- 현재 `config.js`의 `endpoint`는 빈 문자열. 저장됐다고 오인시키지 않고 연결 준비 메시지를 표시함.
- Google Apps Script 서버: `setup/Code.gs`. allowlist 검증, LockService, UUID 중복 검사, 서버 한국시간 기록, appendRow 후 flush, JSON 확인 응답.
- Google 시트: https://docs.google.com/spreadsheets/d/1IVHY-T-V3bAufjfqIraudFr3TKCHAnbVc9NjDWihd98/edit
- 시트 탭 `방문기록` (sheetId 36575129). 접수 ID / 방문일시 (한국시간) / 성별 / 연령대 / 초상권 및 개인정보 사용 동의 / 동의문 버전. 헤더 고정·스타일 적용, 시간대 Asia/Seoul.
- 실제 정책(초상권 활용 목적·매체, 보유 기간)은 원본 사진에 없었으므로 확정하지 않음. 안내 모달에 운영 담당자 문의 안내, 제출 전 실제 운영 안내로 조정 가능.

## 다음 작업

1. 맥의 AKM·저장소 지침을 먼저 읽고 현재 Git 변경 보존. 기존 사이트 파일 덮어쓰지 않기.
2. 맥 Aside의 지원되는 MCP 또는 CLI REPL로 연결. `aside guide repl`, `aside skills show google-accounts` 및 `google-sheets`를 필요할 때 읽기. 로그인·쿠키·토큰은 출력하거나 파일에 복사하지 않기.
3. Google Apps Script 프로젝트를 만들고 `setup/Code.gs`, `setup/appsscript.json`을 넣기. 사용자의 시트 계정에 접근 가능한지 확인.
4. 웹 앱 배포: 실행 사용자 ‘나’, 액세스 ‘모든 사용자’. Google의 계정 승인 단계는 계정 소유자가 처리. 공개 URL은 기존 행 조회 없이 검증된 방문기록 추가만 지원.
5. 반환 `/exec` URL을 `config.js` endpoint에 반영. 브라우저에서 실제 CORS simple POST → 리다이렉트 → JSON 응답 확인 및 시트 새 행 확인. 모의 검증만으로 실제 저장 완료라 하지 않기.
6. 실제 성공·비동의·실패·재시도 중복 방지 확인. 테스트 행은 기록과 구분해 사용자에게 알리기.
7. 기존 `sorizieum/index.html` 내 전시 네비게이션에 방명록 링크를 추가하고 GitHub Pages 배포. 기존 작품·안내키오스크 경로 유지.
8. 익명 공개 접속 및 1080×1920, 모바일 확인 후 결과와 시트 링크 안내.

## 검증 근거

- Node 문법 검사 통과.
- `node --test setup/backend.test.mjs`: 3개 통과. 비동의 저장·서버 시간·UUID 재전송 중복 방지, 누락/수식/이전 동의 버전 거부, 락/시트 오류 시 실패 반환.
- T3 HTML headless 540×960: 11개 체크 통과(필수값, 연속 제출 1회, 네트워크 실패, 잘못된 ACK 거부, 정상 ACK 후 감사 화면, 재시도 ID 유지, 비동의 접수, 다음 방문객 초기화, 모달 열기/닫기, footer 포함). 마지막 footer bottom=948px, 콘솔 오류 없음.
- 1080×1920 T3 preview evaluate에서 실제 viewport·kiosk 1080×1920과 문서 높이1920 관측. screenshot 도구는 반복 timeout, HTML headless로 시각 검증.
- 실제 Apps Script 배포·네트워크·시트 자동 append 검증은 미실행.

## Windows 환경에서 생긴 연결 문제 (맥에서 재현할 필요 없음)

Windows user-pc, 환경 ID 3834a8ca-02c6-46e9-96f0-94fe4be24c22, 작업 `D:/dev/adxdeck` (sparse clone, main), 별도 운영파일 `D:/dev/sorizieum-guestbook-ops`.
Windows에 Aside 공식 CLI 1.26.1104.1843 설치(서명·해시 검증). `u0`는 로그인되어 있지만 로컬 Profile 0은 disconnected. 원격 host 조회는 Pro 제한403. 사용자 Aside는 맥에 켜져 있었음.
Windows T3의 자동 앱 실행은 정책 거절. 인증 우회·토큰 추출·외부 전송 안 함. 기존 실행 스레드를 맥으로 이동하는 도구는 현재 T3 MCP에 없음.

## 배포 원본

GitHub `DECK6/adxdeck`가 dexa.art의 Pages 원본. 이 인계 브랜치는 main에 합쳐지지 않았으므로 현재 운영 사이트는 바뀌지 않았음. 맥에 기존 소스 프로젝트가 있다면 최종 빌드 산출물과 충돌 여부를 확인하며 통합.
