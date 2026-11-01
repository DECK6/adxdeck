# DEXA radar dashboard

`https://dexa.art/dash/` has one password gate for every tab: 종합 (cross-radar overview), the radar tabs, 지원 (application ledger), 수익 설계 (revenue plan) and NARA. GitHub Pages serves a static shell and an AES-GCM encrypted payload. Opening a direct tab hash does not decrypt it. The password and decrypted content are not written to browser storage; locking or leaving the page clears the in-memory view.

## Initial setup

Open `scripts/dashboard/setup.command` in macOS Terminal. Enter the password twice using hidden input. PBKDF2-SHA256 (600,000 iterations, a random 16-byte salt) derives a 256-bit AES key. Only the derived key and KDF parameters are stored in `~/.config/dexa-dash/key.json` with owner-only permissions. The password itself is discarded. Treat this local file as a secret: it can decrypt and update the dashboard. It must never enter Git, a vault note, a log or a message.

## Update after either radar run

```sh
python3 /Volumes/data/Dev/adxdeck-worktrees/radar-dash-20261031/scripts/dashboard/publish.py
```

This is the shared, password-free update command for both existing radar owners. An OS file lock serializes updates. A separate clean `radar-dash-live` worktree fetches and fast-forwards `origin/main`; only `dash/data.enc.json` is staged, committed and pushed. A competing remote change stops the push without rewriting history. Receipts are atomically saved and re-read under AKM `60-actions/runs/radar-dashboard/<timestamp>/receipt.json`. `PUBLISHED` means the Git push was verified; check Pages propagation separately. On failure the receipt says `REPAIR_PENDING` and retains the last good public payload where possible. The script creates no schedule and sends no messages.

Validate and encrypt without pushing:

```sh
python3 scripts/dashboard/publish.py --check
```

Rebuild the current checkout without publishing:

```sh
node scripts/dashboard/build.mjs
```

## Input contract

`dash/schema/radar.v1.schema.json` documents the common adapter. The publisher independently reads both latest sources by their **actual update timestamps**, not directory names:

- Open calls: completed `60-actions/runs/media-art-open-call-radar/*/{candidate-state,checkpoint,receipt}.json` with matching occurrence IDs. The adapter is written back to that private occurrence as `open-call-radar.v1.json`.
- Lectures: `60-actions/runs/lecture-opportunity-radar/*/lecture-radar.v1.json`, maintained by the lecture owner.
- Revenue plan: the newest `*revenue-plan*.md` note (by frontmatter `date modified`) under AKM `00-inbox`, `30-context/projects[/revenue-plan]` or `80-outputs/revenue`. `scripts/dashboard/revenue.mjs` parses its numbered sections (0 결론, 1-1 단가, 1-2 청중, 2 아이템 A–E + F 회수, 3 기간별 합계, 4 상충, 5 이번 주 행동, 6 준비물, 7 가정, 9 정정, 10 결정 지점) into the `revenue` block. Section 8 (근거 경로: local paths, session ids) is never exported; the same privacy check runs over the block. A vault without the note simply omits the tab.

Only allowlisted fields enter encryption. Paths, contacts, authentication links and raw calendars are excluded. Raw vault Markdown is not copied. Missing keys, invalid adapters and privacy violations stop before replacing the encrypted export. Each publish uses a fresh random 12-byte AES-GCM IV.

Hold rule (2026-11-01): `status=hold` only counts as 보류 when it is a confirmed blocker (overseas residency or base requirement, eligibility failure, full rights assignment, full-time weekday role) or the master's own `on_hold`; unconfirmed pay, schedule, fees or rights clauses render as 확인 필요 inside 검토 가능, with the item's `reason` (fallback: 검토 의견, then `nextAction`) shown on cards, timeline rows, the inspector and the comparison table. Adapters should send `reason` and, for real blockers, `holdKind: "blocker"`; without them `dash/core.mjs` infers the kind from the reason text (`HARD_HOLD`). Recommendation status, application status and source run status remain separate. Submitted/cancelled/on-hold items cannot become urgent application reminders. Lecture A/B/C is `track`, not `grade`. Date-only deadlines remain date-only; the UI compares their calendar dates in KST. `HOLD` stays visible. Adding another radar requires its adapter to be included in the builder; tabs render from the shared payload.

## Overview, applications and revenue tabs

종합 merges every non-submitted working item with a deadline (any bucket, next 60 days), the plan's 결정 지점 and NARA bid closes into one dated timeline; clicking a row opens that item in its radar tab (filter 전체). 지원 lists submitted / preparing / on-hold items of all radars grouped by result state; checkboxes stay in the radar tabs. 수익 설계 shows conclusions, period totals, the 13 items with live radar counts (B1→강의처, C2→공모, D1→나라장터), milestones, recoveries, conflicts, preparations, audience and the full note text (minus section 8). Correct the plan in the AKM note; the next publish re-parses it.

## Verification

```sh
node --test scripts/dashboard/test/*.test.mjs scripts/shared-shell-regression.test.js
```

Browser QA uses a separate temporary fixture site with a known synthetic password: `node scripts/dashboard/qa-site.mjs --password '<fixture>' [--port 8765]` copies `dash/`, encrypts the current vault data under that password and serves a same-origin mock of the state API seeded from the synced ledger (writes stay in memory). Never replace production encryption with fixture data. Test wrong/correct passwords, both tabs, filters, search, detail, lock, deep links, keyboard navigation and mobile overflow. Live verification checks the locked gate and the published ciphertext hash; the initial real password is entered by the owner only.

## Password changes

The initializer refuses to overwrite an existing key. For an intentional rotation, move the old configuration to a private backup outside Git, rerun Terminal setup, then rebuild and publish both radars. Preserve the old key until the new page unlock has been confirmed. Do not automate a rotation during an ordinary radar run.

## Compare and track applications

The list and inspector stay open together. Click any non-control part of an item; comparison and submission checkboxes keep their own actions. Select up to three items for aligned comparison. Unsubmitted expired items leave all working views and remain in the archive. Submitted items remain in result tracking after the deadline.

A submission checkbox writes to the dedicated `dexa-radar-state` Worker/D1 store. Successful writes enter result-awaiting; network failures stay visibly unsaved. Revisions reject conflicting writes. Timestamped, nonce-bound HMAC requests use a domain-derived key; the Worker never receives the dashboard password or AES key. Browser keys live in memory only. Official final results are retained. The `verified-record` source is an audit mirror; only `dashboard-user` corrections override producer application state.

Before either radar investigation, run:

```sh
node /Volumes/data/Dev/adxdeck-worktrees/radar-dash-20261031/scripts/dashboard/sync-state.mjs
```

It atomically saves and re-reads AKM `60-actions/runs/radar-dashboard/application-state/latest.json`. The shared publisher performs this sync again before encrypting; unavailable state stops publication. Optional adapter fields `resultStatus`, `stateUpdatedAt`, `stateSource`, `stateRevision` keep provenance separate from public-announcement check time.

## Korean media-art analysis

Private Korean analysis lives in AKM `60-actions/runs/radar-dashboard/open-call-analysis/latest.json`; each item has a fingerprint of material source facts. A changed fact invalidates the prior analysis instead of silently reusing prize or travel conditions. Refresh the Korean analysis during each media-art investigation. Summaries, reviews, application format, prize versus production budget, attendance, travel/living support, fees, deliverables, eligibility and rights must be explicit; unknown is never treated as free or optional. The exported `highlights` fields appear on cards and in the comparison table. Do not commit plaintext analysis or source data.

## NARA tab

The common encrypted envelope also carries the existing NARA v2 payload. After unlock, a same-origin `/nara/?embedded=dashboard` frame receives it from its exact parent window. It has no second password and writes no common credentials to browser storage. Main lock removes the frame and its data. Recommendations, vault, draft versions, copy, slides and request status use the same NARA renderer and backend as `/nara/`.

NARA writes its exact rescored payload to private `.data/dashboard-payload.json` before publication. The common builder reads it and encrypts it with both radars. Existing NARA publications then call the same shared publisher, under its existing local lock. A missing snapshot fails before ciphertext replacement. Draft requests persist `fable` or `astra-xhigh`; the local poller resolves that selected line and reports unavailability instead of silently switching providers. Automatic requests without a selected model keep the existing Sol engine. Additional “아스트라로 생성” and “페이블로 생성” buttons explicitly select the manual engine; they do not change the automatic default. No draft is generated merely by opening this tab.
