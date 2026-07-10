# Learnmap release verification

Release candidate verified on 2026-07-10/11 KST from the isolated worktree `/Volumes/data/Dev/adxdeck-learnmap-publish`. The public deployment target is `https://dexa.art/learnmap/`.

## Candidate scope

Only `learnmap/`, its deterministic build/check scripts, and the already committed `sitemap.xml` learnmap entry are part of this release. The unrelated dirty worktree at `/Volumes/data/Dev/adxdeck` was not modified.

## Reproducible checks

```sh
node scripts/build-learnmap-data.mjs
node scripts/check-learnmap-data.mjs
node scripts/sync-learnmap-ontology.mjs --check
node scripts/check-learnmap-ontology.mjs
node scripts/check-learnmap-profile.mjs
node scripts/check-learnmap-parent.mjs
git diff --check
```

실제 브라우저 상호작용은 별도 Chromium/CDP 런처가 아니라 Aside의 실제 Chromium 세션과 `aside-browser` REPL assertion으로 검증했습니다.

Observed results:

- deterministic projection: PASS — 1,956 topics, 1,894 direct prerequisite edges, 620 standards, 153 clusters; payload SHA-256 `0dd3e00a18ff674e2e9404581732a0c56f76fecb25167e0a6e0b4919ed935c51`
- P3 semantics: PASS — 1,894 `directRequires`, 1,894 inverse `unlocks`, 53,656 non-direct `indirectRequires`, 1,956 standard alignments
- ontology downloads: PASS — Turtle SHA-256 `aec25621de747e995509ad425038a09f7753117cd9aeddb083476ac2fdf7136d`; JSON-LD SHA-256 `d6152367e6635caae96c198a186034dd186b7547806914603dc463be72917580`
- browser profile: PASS — `dexa.learnmap.v1` → `dexa.learnmap.v2` migration, sanitization, reload persistence, one-click clear, damaged-data recovery
- Aside browser: PASS — 1,956개 주제와 Canvas 렌더링, `분수` 검색 10건, inspector·fragment route, 과목 필터 1,956→1,593, 학년군 필터 1,956→1,606, zoom 47%→58%→47%, v1→v2 저장 마이그레이션·재로드 복원, P3/HOLD 온톨로지 패널과 상대 다운로드 링크를 실제 Chromium에서 확인했습니다.
- mobile viewport: PASS — Aside device emulation의 실제 측정값은 `390×844`, `scrollWidth=390`이며 검색·zoom·온톨로지·Canvas 컨트롤이 모두 표시됐습니다.
- browser safety: PASS — console error 0, page error 0, 실패 응답 0, 외부 runtime 요청 0; `/learnmap/`, `/robots.txt`, `/sitemap.xml`, TTL, JSON-LD는 모두 HTTP 200이었습니다.
- privacy/static gate: PASS — profile state remains in `localStorage`; no `POST`, beacon, WebSocket, analytics, or state exfiltration path in the app
- routing: PASS — all app resources use relative `/learnmap/`-safe paths and sitemap contains `https://dexa.art/learnmap/`
- whitespace: `git diff --check` PASS

Aside QA는 `http://127.0.0.1:8766/learnmap/`의 실제 HTTP 문서를 사용했습니다. 테스트용 `localStorage` 값은 검증 후 제거했고, 별도 브라우저 프로세스나 `file://` fallback은 사용하지 않았습니다.

## Captures

- [Desktop 1440×1000](verification/desktop.png) — SHA-256 `a22ebc4b61d30466e52c4d249a04948fedff8343dd37b3a68aa2d01dcaf98dc0`
- [Mobile 390×844](verification/mobile.png) — SHA-256 `f7136b18c07a8bc295c6281ca441dfa3c268b9b6d371890fa0012597dc89cc5d`
- [Independent desktop list/detail 1440×900](verification/independent-desktop.png) — SHA-256 `95098ab7e93838faca4410c1713417550aa87313fc0075635c09437a55557d94`

## Independent publish gate

The publish/review worker re-ran the local checks, exercised the local page and the unchanged DEXA homepage through Aside, and then read the public GitHub and GitHub Pages state back. The exact read-back commands were:

```sh
gh repo view DECK6/korean-elementary-learning-map --json nameWithOwner,isFork,isPrivate,description,homepageUrl,url,defaultBranchRef
(cd /Volumes/data/Dev/korean-elementary-learning-map && git rev-parse HEAD && git ls-remote origin refs/heads/main)
gh run view 29098767524 --repo DECK6/korean-elementary-learning-map --json status,conclusion,headSha,url
gh run view 29098685648 --repo DECK6/adxdeck --json status,conclusion,headSha,url
curl -L -o /tmp/learnmap-live-page.html -w '%{http_code}' https://dexa.art/learnmap/
curl -L -o /tmp/learnmap-live.json -w '%{http_code}' https://dexa.art/learnmap/data/learnmap.json
curl -L -o /tmp/dexa-live-home.html -w '%{http_code}' https://dexa.art/
```

Observed publish results:

- standalone data repository: PASS — `DECK6/korean-elementary-learning-map` is public, `isFork=false`, homepage `https://dexa.art/learnmap/`, and local/remote `main` both resolved to `fd87388a1b81004fb9363f59d6f35cddc5bde237`
- attribution: PASS — the repository says the Korean dataset was independently built and was inspired by the Marble learning-graph approach; it does not describe the project as Marble-based or an official derivative
- data CI: PASS — [run 29098767524](https://github.com/DECK6/korean-elementary-learning-map/actions/runs/29098767524) completed successfully for `fd87388a1b81004fb9363f59d6f35cddc5bde237`; the preceding run exposed a missing `actions/setup-python` pip cache dependency path, which the one-line CI fix corrected
- GitHub Pages: PASS — [run 29098685648](https://github.com/DECK6/adxdeck/actions/runs/29098685648) completed successfully for release commit `36b50c55a2e6c97d3d3ba3b6b30ed77235c9a06d`
- live HTTP: PASS — `/learnmap/`, its JSON payload, and the unchanged DEXA homepage returned 200; the downloaded JSON core hash was `0dd3e00a18ff674e2e9404581732a0c56f76fecb25167e0a6e0b4919ed935c51` with 1,956/1,894/620/153 counts
- live Aside QA: PASS — `분수` returned 10 results, the selected topic opened its fragment route and four path examples, only relative `https://dexa.art/learnmap/…` resources loaded, viewport width matched document width, and console/page errors were both zero
- homepage regression check: PASS — local 1440px Aside rendering preserved the DEXA navigation and hero without horizontal overflow, console errors, page errors, overlaps, or blank regions

## Remaining interpretation and operational risks

- The ontology is an independently built, non-official model; it is not MOE/NCIC approval and does not diagnose learners.
- External curriculum/classroom review remains ongoing.
- Official-source redistribution/commercial permission remains `HOLD`; the public slim projection excludes official text, locators, and source URLs.
- The checked-in RDF downloads are large (about 22.7 MB Turtle and 31.2 MB JSON-LD), so first downloads may be slower on mobile networks.
- Fragment routes are supported under `/learnmap/`; arbitrary deep-path URLs are not claimed.
