# DEXA Blog 작성 가이드

## 워크플로우

1. `blog/posts/` 폴더에 `.md` 파일 추가
2. `blog/images/` 폴더에 이미지 추가 (필요 시)
3. `node blog/build.js` 또는 `bash blog/publish.sh "<commit message>"` 실행
4. 생성된 정적 글 페이지, `posts.json`, `sitemap.xml`, `robots.txt` 확인
5. `git push`

`build.js`는 마크다운 원본을 기반으로 아래 산출물을 자동 생성한다.
- `blog/posts/_built/*.md` — ASCII slug 기반 복사본
- `blog/posts/[slug]/index.html` — 검색엔진용 정적 글 페이지
- `blog/posts.json` — 목록/프리뷰용 메타데이터
- `sitemap.xml`
- `robots.txt`

---

## 프론트매터 (Frontmatter)

모든 포스트는 YAML 프론트매터로 시작해야 한다.

```yaml
---
type: article
aliases:
  - "한글 별칭"
  - "English Alias"
author:
  - "[[작가명]]"
date created: 2026-03-28
date modified: 2026-03-28
tags:
  - article
  - AI
  - media-art
thumbnail: images/my-image.jpg
status: completed
---
```

### 필수 필드

| 필드 | 설명 | 예시 |
|------|------|------|
| `tags` | 태그 목록 (첫 번째 태그가 카테고리 결정) | `- article` |
| `date created` | 작성일 (YYYY-MM-DD) | `2026-03-28` |

### 선택 필드

| 필드 | 설명 | 예시 |
|------|------|------|
| `aliases` | 별칭 목록. **영문 별칭이 있으면 URL slug로 사용됨** | `- "AI and Media Art"` |
| `thumbnail` | 카드 목록 썸네일 이미지 경로 | `images/afterglow.jpg` |
| `author` | 작가명 (기본값: Deck) | `- "[[육대근]]"` |
| `title` | 제목 (없으면 본문 `# 제목`에서 추출) | `제목` |
| `date modified` | 수정일 | `2026-03-28` |

### 카테고리 결정 규칙

`tags`의 첫 번째 매칭 태그가 카테고리를 결정한다:

| 태그 | 카테고리 | 카드 색상 |
|------|----------|-----------|
| `article` | Article | 시안 (#00F0FF) |
| `project` | Project | 보라 (#BC13FE) |
| `thought` | Thought | 초록 (#39FF14) |
| `tutorial` | Tutorial | 초록 (#39FF14) |
| 없음 | Post | 시안 (#00F0FF) |

카테고리 결정용 태그(`article`, `project`, `thought`, `tutorial`, `post`)는 카드의 태그 목록에서 자동 제외된다.

---

## URL Slug 규칙

GitHub Pages는 한글 파일명을 서빙하지 못한다. `build.js`가 자동으로 ASCII slug를 생성한다.

**우선순위:**
1. 프론트매터 `aliases`에 영문 별칭이 있으면 사용 → `"AI and Media Art"` → `ai-and-media-art`
2. 없으면 파일명에서 한글 제거 후 사용
3. 결과가 3글자 미만이면 `post-`+해시 자동 생성

생성된 `.md` 파일은 `posts/_built/` 폴더에 ASCII 이름으로 복사되고, 같은 slug로 `posts/[slug]/index.html`이 생성된다.

### 실제 공개 URL

개별 글 URL은 더 이상 `post.html?slug=...`를 기본으로 쓰지 않는다.

```text
/blog/posts/why-immersion-became-the-core-language-of-media-art/
```

`post.html?slug=...`는 레거시 호환용이며, 새 링크는 항상 정적 경로를 사용한다.

> 한글 제목 포스트는 반드시 `aliases`에 영문 별칭을 추가할 것을 권장한다.

---

## 이미지

### 경로 규칙

이미지는 `blog/images/` 폴더에 넣는다.

```
blog/
├── images/
│   ├── afterglow.jpg      ← 이미지 파일
│   └── my-project.png
├── posts/
│   └── 내 포스트.md
```

### 본문 이미지

마크다운 본문에서 `images/` 상대경로로 참조한다:

```markdown
![설명 텍스트](images/afterglow.jpg)
```

빌드 시 정적 글 페이지에서는 이 경로가 자동으로 `/blog/images/...` 절대경로로 변환된다.

### 썸네일

프론트매터에 `thumbnail` 필드로 지정한다:

```yaml
thumbnail: images/afterglow.jpg
```

썸네일은 블로그 목록 카드와 메인 페이지 미리보기에 표시된다.

### 주의사항

- 경로는 항상 `images/파일명`으로 작성 (앞에 `/`, `./`, `../` 붙이지 않음)
- 파일명은 영문+숫자 권장 (한글 파일명은 GitHub Pages에서 404 가능)
- 이미지 크기 제한 없으나, GitHub 권장 단일 파일 50MB 이하

---

## 마크다운 문법

표준 마크다운 + Obsidian 확장 문법을 지원한다. `blog.js`의 `cleanMarkdown()`이 렌더링 전에 자동 변환한다.

### 지원 문법

```markdown
# 제목 1
## 제목 2
### 제목 3

**굵게**, *기울임*, ~~취소선~~

- 순서 없는 목록
1. 순서 있는 목록

> 인용문

`인라인 코드`

​```python
코드 블록
​```

[링크 텍스트](https://example.com)
![이미지 설명](images/photo.jpg)

| 표 | 제목 |
|----|------|
| 내용 | 값 |

---  (구분선)
```

### Obsidian 호환 문법

| Obsidian 문법 | 변환 결과 |
|---------------|-----------|
| `[[페이지명]]` | `페이지명` (텍스트로 변환) |
| `[[페이지명\|표시텍스트]]` | `표시텍스트` |
| `> [!info] 제목` | `> **제목**` (인용 블록) |
| `> [!warning] 주의` | `> **주의**` |

### 주의사항

- 본문에서 `<`, `>` 꺾쇠괄호는 HTML로 해석될 수 있다 → `<작품명>` 대신 `《작품명》` 사용 권장
- 프론트매터의 YAML은 자동으로 제거되므로 본문에 표시되지 않음

---

## 로컬 테스트

`file://` 프로토콜에서는 `fetch()`와 정적 경로 검증이 모두 불안정하므로 로컬 서버를 사용할 것:

```bash
# adxdeck 루트 폴더에서
npx serve .
# 또는
python3 -m http.server
```

`build.js`를 수동 실행하면 정적 글 페이지와 SEO 파일까지 함께 생성된다:

```bash
node blog/build.js
```

---

## 파일 구조

```
blog/
├── index.html          # 블로그 목록 페이지
├── post.html           # 레거시 뷰어/리다이렉트용
├── blog.js             # 클라이언트 렌더링 엔진
├── build.js            # 정적 글 + posts.json + sitemap/robots 생성
├── posts.json          # 자동 생성 — 직접 수정 금지
├── posts/
│   ├── 내 포스트.md    # 원본 마크다운 (한글 파일명 OK)
│   └── _built/         # 자동 생성 — 직접 수정 금지
│       └── my-post.md  # ASCII 이름 복사본
│   └── my-post/        # 자동 생성 — 직접 수정 금지
│       └── index.html  # 정적 글 페이지
├── images/
│   └── photo.jpg       # 이미지 파일
└── BLOG-GUIDE.md       # 이 파일
```

`posts.json`, `posts/_built/`, `posts/[slug]/index.html`, `sitemap.xml`, `robots.txt`는 `build.js`가 자동 생성하므로 직접 수정하지 않는다.
