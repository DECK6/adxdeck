# DEXA radar dashboard

`https://dexa.art/dash/` has one password gate for every radar tab. GitHub Pages serves a static shell and an AES-GCM encrypted payload. Opening a direct tab hash does not decrypt it. The password and decrypted content are not written to browser storage; locking or leaving the page clears the in-memory view.

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

Only allowlisted fields enter encryption. Paths, contacts, authentication links and raw calendars are excluded. Raw vault Markdown is not copied. Missing keys, invalid adapters and privacy violations stop before replacing the encrypted export. Each publish uses a fresh random 12-byte AES-GCM IV.

Recommendation status, application status and source run status remain separate. Submitted/cancelled/on-hold items cannot become urgent application reminders. Lecture A/B/C is `track`, not `grade`. Date-only deadlines remain date-only; the UI compares their calendar dates in KST. `HOLD` stays visible. Adding another radar requires its adapter to be included in the builder; tabs render from the shared payload.

## Verification

```sh
node --test scripts/dashboard/test/*.test.mjs scripts/shared-shell-regression.test.js
```

Browser QA uses a separate temporary fixture site with a known synthetic password. Never replace production encryption with fixture data. Test wrong/correct passwords, both tabs, filters, search, detail, lock, deep links, keyboard navigation and mobile overflow. Live verification checks the locked gate and the published ciphertext hash; the initial real password is entered by the owner only.

## Password changes

The initializer refuses to overwrite an existing key. For an intentional rotation, move the old configuration to a private backup outside Git, rerun Terminal setup, then rebuild and publish both radars. Preserve the old key until the new page unlock has been confirmed. Do not automate a rotation during an ordinary radar run.
