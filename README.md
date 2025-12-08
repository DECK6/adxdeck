# ADX Work Lab - Multi-Page Website

## 개요

ADX Work Lab 웹사이트가 단일 페이지에서 다중 페이지 구조로 성공적으로 재구성되었습니다. 이 재구성을 통해 비즈니스 정보와 개인 정보를 명확하게 분리하여 더 나은 사용자 경험을 제공합니다.

## 웹사이트 구조

### 1. 메인 페이지 (index.html)
**ADX Work Lab 비즈니스 정보 중심**

- **Home 섹션**: 전문가 그룹으로서의 브랜드 소개 및 핵심 메시지
- **About 섹션**: 
  - ADX Work Lab의 비전과 미션
  - 기술 전문성 (AI 교육 95%, 창의적 솔루션 90%, 컨설팅 경험 85%)
  - 전문 분야 (AI 비주얼 콘텐츠 제작, AI 미디어아트 제작, AI 체험프로그램 제작)
  - 핵심 가치 (혁신, 협력, 품질)
- **Projects 섹션**: 
  - 주요 프로젝트 포트폴리오
  - 워크숍 참여자 후기 (간략 버전)
- **Contact 섹션**: 문의 양식 및 연락처 정보

### 2. About DECK 페이지 (about-deck.html)
**육대근 개인 정보 및 전문성 상세**

- **Hero 섹션**: AI 전문가 그룹 리더로서의 개인 브랜딩 및 소개
- **Education & Certifications 섹션**: 
  - 학력 (서강대 MBA, 예술경영학사 등)
  - 자격증 (DX 컨설턴트, AI PD 1급 전국최우수, Microsoft 인증, Vanderbilt 대학교 인증)
- **Career Philosophy 섹션**: 전문가로서의 철학과 접근법
- **Detailed Testimonials 섹션**: 
  - 30여 기업/기관 참여자들의 상세 후기
  - 통계 정보 (30+ 협력기관, 500+ 교육 참여자, 100% 만족도)

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **JavaScript**: 동적 기능 구현
- **CSS3**: 커스텀 애니메이션 및 스타일링

## 주요 기능

### 1. 반응형 디자인
- 데스크톱, 태블릿, 모바일 모든 기기에서 최적화된 경험
- 모바일 전용 네비게이션 메뉴

### 2. 인터랙티브 요소
- **파티클 애니메이션**: 마우스 움직임에 반응하는 배경 효과
- **타이핑 효과**: 메인 타이틀의 동적 텍스트 애니메이션
- **스킬 바 애니메이션**: 전문성 수준을 시각적으로 표현
- **부드러운 스크롤**: 섹션 간 자연스러운 이동

### 3. 네비게이션 시스템
- 페이지 간 연결된 네비게이션
- 현재 활성 페이지 하이라이트
- 앵커 링크를 통한 섹션 내 이동

### 4. 연락 기능
- **Web3Forms 기반 문의 시스템**: 전문적인 이메일 알림 서비스
- **실시간 폼 검증**: 이메일 및 전화번호 유효성 검사
- **사용자 친화적 UX**: 로딩 상태, 성공/오류 메시지, 자동 숨김
- **스팸 방지**: Honeypot 필드를 통한 봇 차단

## 파일 구조

```
adxdeck/
├── index.html          # 메인 페이지 (비즈니스 정보)
├── about-deck.html     # About DECK 페이지 (개인 정보)
├── styles.css          # 통합 스타일시트
├── script.js           # JavaScript 기능들
└── README.md           # 프로젝트 문서
```

## 디자인 시스템

### 색상 팔레트
- **Primary**: #00a2ff (블루)
- **Secondary**: #3d5afe (보라-블루)
- **Background**: #0a1525 (다크 네이비)
- **Text**: #ffffff (화이트)
- **Accent**: #00eaff (시안)

### 타이포그래피
- **Primary Font**: Montserrat (영문)
- **Secondary Font**: Noto Sans KR (한글)
- **Font Weights**: 300, 400, 500, 600, 700, 800

## 성능 최적화

- CSS 및 JavaScript 파일 분리로 캐싱 효율성 증대
- 이미지 최적화 및 CDN 활용
- 최소한의 외부 의존성으로 빠른 로딩 속도

## 브라우저 호환성

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Internet Explorer 11 (제한적 지원)

## 배포 및 호스팅

웹사이트는 정적 파일로 구성되어 있어 다음과 같은 호스팅 서비스에서 쉽게 배포할 수 있습니다:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- 기타 정적 웹 호스팅 서비스

## Web3Forms 설정 가이드

### 1. Web3Forms 계정 생성
1. https://web3forms.com 방문
2. "Get Started for FREE" 클릭
3. 이메일로 가입 (GitHub 또는 Google 로그인 가능)

### 2. Access Key 발급
1. 대시보드에서 "Create New Form" 클릭
2. 폼 이름 입력: "ADX Work Lab Contact Form"
3. 이메일 주소 입력 (문의를 받을 이메일)
4. Access Key 복사

### 3. 코드에 Access Key 적용
`index.html` 파일에서 다음 라인을 찾아 수정:
```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
```
`YOUR_ACCESS_KEY_HERE`를 실제 Access Key로 교체

### 4. 추가 설정 (선택사항)
- **사용자 정의 응답 페이지**: Web3Forms 대시보드에서 설정
- **이메일 템플릿 커스터마이징**: 수신 이메일 형식 변경
- **자동 응답 메시지**: 문의자에게 자동 답변 설정
- **Webhook 연동**: 외부 시스템과 연동

### 5. 테스트
1. 웹사이트에서 테스트 문의 발송
2. 설정한 이메일 주소로 알림 수신 확인
3. 폼 제출 후 성공 메시지 표시 확인

## 향후 개선 계획

1. **SEO 최적화**: 메타 태그 및 구조화된 데이터 추가
2. **성능 향상**: 이미지 지연 로딩 및 코드 분할
3. **접근성 개선**: ARIA 레이블 및 키보드 네비게이션 강화
4. **다국어 지원**: 영문 버전 추가
5. **CMS 연동**: 콘텐츠 관리 시스템 통합


---

---

## Rebranding & Overhaul (2025-12-05)

### Session Summary
This session successfully transformed the website into a high-end **AI Media Art & Video Content Agency** platform. The design was pivoted to a sophisticated **Monochrome (Black & White)** theme, and the content was completely rewritten to reflect a visionary, avant-garde identity.

### Work Walkthrough

#### 1. Design Overhaul (Monochrome Theme)
-   **Color Palette**: Switched to a strict Black & White theme (`#000000` background, `#ffffff` text) for a "Gallery" aesthetic.
-   **Visuals**: Replaced colorful gradients with subtle dark radial gradients and noise texture.
-   **Typography**: Enhanced readability with high-contrast white text and minimalist fonts.
-   **Branding**: Standardized name to **ADX Worklab**.

#### 2. Content & Interaction Upgrade
-   **Hero Interaction**: Implemented a **"Neural Network" simulation** using HTML5 Canvas. Particles connect dynamically and interact with mouse movement.
-   **Video Gallery**: Added a global **Video Modal**. Project cards now feature a "Play" button and open a video player (YouTube/MP4) on click.
-   **Technology Section**: Added a new section detailing the tech stack: Generative AI, Real-time 3D, WebGL, Motion.

#### 3. Content Overhaul (Visionary Identity)
-   **Copywriting**: Rewrote Hero and About sections with a high-end, philosophical tone (e.g., "Redefining Reality with Neural Imagination").
-   **Portfolio**: Replaced generic placeholders with 3 premier case studies:
    -   *LUMINOUS DATA* (Media Facade)
    -   *SYNAPTIC FLOW* (Interactive Installation)
    -   *FUTURE SCAPE* (AI Brand Film)
-   **Services**: Redefined specialized services: "Spatial Experience", "Neural Cinema", "R&D Lab".

### Progress Status
-   [x] **Rebranding**: "AI Media Art Agency" identity established.
-   [x] **Design**: Monochrome theme applied and verified.
-   [x] **Features**: Interactive Hero and Video Modal implemented.
-   [x] **Content**: All copy and portfolio items updated to high-end tone.

---

© 2025 ADX Worklab. All rights reserved. 