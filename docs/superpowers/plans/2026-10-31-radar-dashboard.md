# Radar dashboard implementation plan

Scope: M, one phase, implemented inline under the user's existing authorization. No child agents or new conversations. Design: `../specs/2026-10-31-radar-dashboard-design.md`.

## Task 1: Private data and encryption

Files: `scripts/dashboard/{lib,build}.mjs`, `setup-key.py`, `setup.command`, `dash/core.mjs`, `scripts/dashboard/test/*.test.mjs`.

Write tests first: one encrypted payload with two adapters round-trips; wrong password/tampering fails; fresh IV; invalid schema/unsafe links rejected; private source keys stripped; submitted/held/date-only states preserved; key file permissions checked; missing key never emits plaintext. Observe RED before implementation, then GREEN with the built-in Node test runner. Terminal setup derives an AES256 key from a twice-entered hidden password and atomically writes a 0600 configuration outside the repo. No secret arguments, shell history, transcript or printed values.

Adapter integration: open-call exporter reads latest completed occurrence state/report. Lecture exporter is owned by the existing lecture thread and publishes `lecture-radar.v1.json` into its run folder. Builder accepts the schema's version aliases and chooses newest actual `updatedAt` among each source's run files. The two source folders remain independent. Encrypted output is written atomically.

## Task 2: One main gate and tab UI

Files: `dash/{index.html,styles.css,app.mjs}`. Cover the single gate, hash navigation, submitted reminder suppression, expiry/date-only behavior and safe Markdown/URL rendering in focused tests. Implement the responsive UI. All tab data and complete reports stay behind the one decryption boundary. No password persistence; lock clears the UI. Escape source text and reject non-HTTP(S) links. Add no remote scripts.

## Task 3: Publication and future updates

Files: `scripts/dashboard/publish.mjs`, dashboard README, the two radar execution-contract pointers coordinated by their owners, AKM project/procedure/devlog.

Initialize the real password in a visible local terminal after the tested setup is ready. Build actual two-radar encrypted data. Verify repository/public outputs contain no key/plaintext and key config is 0600. Self-review acceptance, security, code quality and failure paths separately. Run focused tests, relevant existing regression checks, local browser checks at desktop/mobile with Aside, then the authorized ship workflow. Publish only the reviewed dashboard scope onto the current Pages branch with a clean isolated worktree. Verify live locked page and matching ciphertext. Install no timer; future radar output invokes the documented publisher under a local lock.

## Architecture critique and dispositions

Architecture: reuse NARA's static encryption boundary; one shared payload avoids a tab bypass. A missing key/source fails before output replacement. No Worker is needed for this requested static vault.

Code quality: keep crypto/validation/adapter export separate from UI and CLI. Do not refactor NARA. Only genuine repeated behavior shares the common core.

Tests: real crypto, file-permission and normalization tests plus browser gate/tab/lock checks. Source freshness, date precision, submitted deduplication and lecture track/grade separation are required regressions.

Performance: one small encrypted fetch, one PBKDF2 operation per unlock, in-memory filtering, no framework or remote script. Do not rerender the entire report on each search.

Review focus: stale latest-source selection; accidental ciphertext overwrite before both sources validate; raw source paths/contact/calendar content crossing the export allowlist; escaped Markdown links; lock/deep-link bypass; concurrent publisher pushes.

## Decisions and execution ledger

- Existing user instructions authorize implementation/deployment and forbid child agents/new threads; inline self-review replaces additional agent ceremony. No repeated approval question is introduced.
- Decisions key-retention choice state `6cf1c049f38f808e5a7d` returned fallback/concurrency_limit, no API call. Parent chose derived-key configuration to discard the initial password while allowing unattended updates. No retry on another transport.
- Current T3 project is the multi-project Dev root, so native worktree handoff would not target this website repository. A clean linked worktree was created from freshly fetched origin/main at `adxdeck-worktrees/radar-dash-20261031`; the dirty primary checkout is preserved.
- Pre-flight: Task1 exports the envelope and radar contract consumed by Task2; Task3 consumes the same build function and key config. Schema is already shared with the existing lecture owner. No conflicting field definitions.

- Publisher isolation choice state `019a3b875860717a0cf8` selected isolated OS-lock/worktree; applied directly. Secrets and private radar content were not sent.
- Initial Terminal password setup completed; key config permissions 0600. Browser-compatible Python derivation test passed. Agent never received the password.
- Browser QA found a legacy pre-submission work-fit sentence under a submitted item. An assertion reproduced the contradiction, then submitted evidence replaced that stale description and the test passed. Existing radar receipt remains unchanged.
- Native inline review/verification is used under the user's explicit no-child-agent/no-new-thread constraint and Triple Crown's native-equivalence rule. Skill onboarding, global upgrades and unrelated routing injection are outside this publication scope. No external reviewer result or percentage coverage is claimed.
