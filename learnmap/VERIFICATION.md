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
LEARNMAP_BROWSER_FILE_MODE=1 node scripts/check-learnmap-browser.mjs
git diff --check
```

Observed results:

- deterministic projection: PASS — 1,956 topics, 1,894 direct prerequisite edges, 620 standards, 153 clusters; payload SHA-256 `0dd3e00a18ff674e2e9404581732a0c56f76fecb25167e0a6e0b4919ed935c51`
- P3 semantics: PASS — 1,894 `directRequires`, 1,894 inverse `unlocks`, 53,656 non-direct `indirectRequires`, 1,956 standard alignments
- ontology downloads: PASS — Turtle SHA-256 `aec25621de747e995509ad425038a09f7753117cd9aeddb083476ac2fdf7136d`; JSON-LD SHA-256 `d6152367e6635caae96c198a186034dd186b7547806914603dc463be72917580`
- browser profile: PASS — `dexa.learnmap.v1` → `dexa.learnmap.v2` migration, sanitization, reload persistence, one-click clear, damaged-data recovery
- actual headless Chromium: PASS — desktop and 390×844 mobile, reduced motion, touch, list fallback, ontology panel/download links, fragment routes, explainable direct/indirect paths, parent path/week modes, data-error state, GET-only local resource access, no console/runtime assertion failures
- privacy/static gate: PASS — profile state remains in `localStorage`; no `POST`, beacon, WebSocket, analytics, or state exfiltration path in the app
- routing: PASS — all app resources use relative `/learnmap/`-safe paths and sitemap contains `https://dexa.art/learnmap/`
- whitespace: `git diff --check` PASS

The browser test used its documented `file://` fallback because an overlapping Chromium QA process caused the first localhost run to time out before app navigation. The same test still exercised the real Chromium DOM and relative files; final HTTP behavior is independently gated against the deployed GitHub Pages site.

## Captures

- [Desktop 1440×1000](verification/desktop.png) — SHA-256 `169b04c97821783634d3787be42a07d8f02059a0696ef240adaa7db083e52ca6`
- [Mobile 390×844](verification/mobile.png) — SHA-256 `75673ede2f03b6b91e761f1c6c0a0aeb888e4836b83300b8afa642da998cf376`

## Remaining interpretation and operational risks

- The ontology is an independently built, non-official model; it is not MOE/NCIC approval and does not diagnose learners.
- External curriculum/classroom review remains ongoing.
- Official-source redistribution/commercial permission remains `HOLD`; the public slim projection excludes official text, locators, and source URLs.
- The checked-in RDF downloads are large (about 22.7 MB Turtle and 31.2 MB JSON-LD), so first downloads may be slower on mobile networks.
- Fragment routes are supported under `/learnmap/`; arbitrary deep-path URLs are not claimed.
