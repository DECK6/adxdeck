# DEXA Homepage Improvement Stages

> Scope note: this document translates the decision memo in `/Volumes/data/Obsidian/DECK/40. Docs/47. DEXA Docs/2026-04-20-DEXA-art-homepage-review.md` into executable homepage work for the current static site in `/Volumes/data/Dev/adxdeck`.

## Goal

Keep DEXA's brand atmosphere intact while making the homepage more legible as a conversion-oriented entry point for studio inquiries.

## Current implementation baseline

- Runtime: static HTML + Tailwind CDN + vanilla JS
- Primary files: `index.html`, `script.js`, `projects.json`
- Publish path: git commit + push to `main` (`origin` = `https://github.com/DECK6/adxdeck.git`)
- Existing content order: Hero → Intro/D.E.X.A → Blog → Projects → Upcoming → Academy → Contact
- Confirmed issue: `View Curriculum` currently points to `#`

---

## Stage 1 — Immediate fixes (ship now)

**Goal:** remove trust-breaking issues and sharpen first-impression conversion without changing page architecture.

### Included changes
1. **Fix the Academy dead link**
   - Change `View Curriculum` from `href="#"` to a real destination.
   - Interim destination: `#contact`
   - Rename CTA to conversion-safe language: `Education Inquiry`

2. **Clarify hero service translation**
   - Keep `Where AI Meets Art`
   - Add buyer-language description directly under the brand statement
   - State what DEXA can be hired for: AI media art, interactive exhibitions, branded experiences, workshops/speaking

3. **Re-establish CTA hierarchy in hero**
   - Primary CTA: inquiry/contact
   - Secondary CTA: portfolio
   - Keep both actions visible, but make inquiry the dominant action

4. **Rewrite D/E/X/A cards for buyer readability**
   - Preserve the branded titles
   - Replace the ultra-short labels with operational explanations
   - Each card should answer “how this helps a client/project”

### Explicitly out of scope for Stage 1
- Reordering sections
- New pages (`academy.html`, project detail pages)
- Contact form schema changes
- Analytics instrumentation
- Refactoring `script.js`

### Files expected to change
- Modify: `index.html`

### Validation
- Open homepage locally
- Confirm `Education Inquiry` scrolls to contact section
- Confirm hero copy reads clearly on desktop/mobile
- Confirm no console errors
- Confirm unrelated untracked files are not staged

---

## Stage 2 — Homepage IA correction

**Goal:** fix the page-wide hierarchy mismatch identified in the review memo.

### Planned changes
1. Move **Projects** ahead of **Blog**
2. Introduce a short **service translation strip** below hero
3. Reframe intro area as **trust + method**, not only philosophy
4. Add a post-project CTA block such as `Start a Project`
5. Demote blog to thought-leadership/supporting role

### Files expected to change
- Modify: `index.html`
- Optional: `script.js` if section hooks or lazy rendering need adjustment

### Validation
- Check section order visually and in DOM
- Verify nav anchors still land correctly
- Re-run browser snapshot for CTA flow review

---

## Stage 3 — Conversion scaffolding

**Goal:** make homepage inquiries easier to qualify and route.

### Planned changes
1. Add service/category chips or cards under hero
2. Normalize CTA styles into primary / secondary / tertiary roles
3. Add inquiry intent options to contact flow
   - project
   - education
   - speaking
4. Update Academy cards to align with their actual destination or action
5. Add repeated CTA placement after key trust/portfolio sections

### Files expected to change
- Modify: `index.html`
- Modify: `script.js`
- Optional: `projects.json`

### Validation
- Manual inquiry path test for each intent
- Responsive review for CTA consistency
- Ensure no broken modal/card interactions

---

## Stage 4 — Structural expansion

**Goal:** move from a strong brand landing page to a more complete business site.

### Planned changes
1. Create a dedicated Academy destination page
2. Create project detail pages instead of homepage-only modal dependence
3. Add analytics for CTA clicks and inquiry source attribution
4. Review SEO/meta updates after architecture changes
5. Consider templating/componentization if homepage iteration speed becomes a bottleneck

### Files expected to change
- Create: `academy.html` or `academy/index.html`
- Create: project detail pages or templates
- Modify: `index.html`, `script.js`, supporting assets

### Validation
- Link crawl for all new destinations
- Search/share preview checks
- Deployment smoke test on production

---

## Execution order

1. Document stages and lock Stage 1 scope
2. Implement Stage 1 only
3. Verify locally with browser + console
4. Commit only intended files
5. Push `main` for production deployment

## Stage 1 handoff summary

**Ship now:**
- academy CTA dead link fix
- hero buyer-language copy improvement
- hero CTA hierarchy improvement
- D/E/X/A card rewrite

**Do next, but not in this deployment:**
- section reordering
- service strip
- repeated conversion blocks
- inquiry typing
- dedicated Academy destination
