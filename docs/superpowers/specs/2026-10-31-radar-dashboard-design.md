# DEXA Radar Dashboard

User requirements: publish at `https://dexa.art/dash`; one password gate at the main page; a single page with tabs for open calls, lecture opportunities, and future radars; follow the existing NARA encrypted-data approach; initialize the password through a hidden terminal prompt. The open-call thread owns the shared UI, encryption, initial password flow and deployment. The existing lecture thread owns its adapter and future lecture output integration.

Use the existing GitHub Pages site, buildless HTML/CSS/ES modules and browser Web Crypto. Do not create another hosting project, scheduler, account or conversation. NARA itself remains unchanged.

```
AKM occurrence files -> radar.v1 adapters (private local files)
                    -> one validated dashboard payload
terminal password -> PBKDF2 -> local owner-only derived key
                    -> AES-GCM with a fresh IV per publication
                    -> dash/data.enc.json on GitHub Pages
main password gate -> browser decrypt -> all radar tabs
```

The static shell and ciphertext are public; private report data becomes readable only after successful decryption. A local 0600 key configuration retains key/salt/KDF parameters, never the initial password. The page retains neither password nor decrypted data in local/session storage; locking clears rendered data. There is no per-tab password.

Source contracts use `dash/schema/radar.v1.schema.json`. Exact deadlines and date-only deadlines remain separate. Application status and recommendation status are independent. Lecture A/B/C tracks are not open-call grades. Preserve HOLD, submitted, excluded, closed and unverified details. A submitted item never appears as a new application reminder. Display source occurrence, update time, scope limits and a readable complete report.

The page has a compact header, tab bar, summary counts, text search, status filters, deadline-sorted cards and a details dialog. Use DEXA dark neutrals and restrained amber/mint status colors, system fonts, keyboard-accessible controls and responsive layouts. Do not load external scripts. Treat every source string and URL as untrusted.

Authorized publishing includes only the dashboard source/ciphertext and its build tooling. Existing unrelated changes are preserved. Future authorized radar runs refresh both tabs from latest local adapters, preserving separate source statuses and occurrences. Scheduler configuration is not changed.

Acceptance: one successful password unlocks every tab; wrong passwords and modified ciphertext reveal no data; all private content is encrypted; source statuses and exact/date-only cutoffs survive export; submitted Gyeol stays submitted; latest lecture HOLD stays HOLD; mobile/keyboard flows work; the real `/dash` serves the reviewed encrypted version.
