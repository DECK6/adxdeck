// 전환기 길잡이 — parent/teacher-facing renderer.
// Reads dist/guide/guide-data.json (built by scripts/build-guide.mjs) and paints
// a grade picker + per-grade story. No external dependencies. Facts and codes
// live only inside "자세한 근거 보기" folds or 교사 모드; the default screen is prose.

const DATA_URL = "./guide-data.json";

// gapType → short parent-facing badge.
const BADGE = {
  NewSubjectStart: "새로 시작",
  StructuralSplit: "과목 분화",
  ContentGap: "새 내용 많음",
  DensityJump: "학습량 증가",
};

const els = {
  main: document.querySelector("#main"),
  loadState: document.querySelector("#loadState"),
  boundaryNotice: document.querySelector("#boundaryNotice"),
  teacherMode: document.querySelector("#teacherMode"),
};

let guide = null;

// ---- tiny DOM helpers ---------------------------------------------------
function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.html != null) node.innerHTML = opts.html;
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

// ---- hash routing -------------------------------------------------------
function parseHash() {
  const raw = location.hash.replace(/^#/, "");
  const params = new URLSearchParams(raw);
  return { grade: params.get("grade"), teacher: params.get("teacher") === "1" };
}

function writeHash(grade, teacher) {
  const params = new URLSearchParams();
  if (grade) params.set("grade", grade);
  if (teacher) params.set("teacher", "1");
  const next = params.toString();
  if (next !== location.hash.replace(/^#/, "")) location.hash = next ? `#${next}` : "";
}

// ---- home: grade picker -------------------------------------------------
const SCHOOL_LABEL = { elementary: "초등학교", middle: "중학교", high: "고등학교" };

function renderHome() {
  const wrap = el("section", { class: "home", attrs: { "aria-labelledby": "homeQuestion" } });
  wrap.append(el("h1", { class: "home-question", attrs: { id: "homeQuestion" }, text: "자녀(학생)가 지금 몇 학년인가요?" }));
  wrap.append(el("p", { class: "home-help", text: "학년을 고르면 그 시기에 무엇이 달라지는지, 무엇을 함께 살펴보면 좋을지 이야기로 안내합니다." }));

  const groups = { elementary: [], middle: [], high: [] };
  for (const code of guide.gradeOrder) groups[guide.grades[code].school].push(guide.grades[code]);

  for (const school of ["elementary", "middle", "high"]) {
    const g = el("div", { class: "grade-group" });
    g.append(el("h2", { class: "grade-group-title", text: SCHOOL_LABEL[school] }));
    const list = el("div", { class: "grade-buttons" });
    for (const grade of groups[school]) {
      const btn = el("button", {
        class: `grade-btn${grade.isTransition ? " is-transition" : ""}`,
        attrs: { type: "button", "data-grade": grade.code },
      });
      btn.append(el("span", { class: "grade-btn-label", text: grade.label }));
      btn.append(el("span", {
        class: "grade-btn-tag",
        text: grade.isTransition ? "전환기" : "안정기",
      }));
      btn.addEventListener("click", () => selectGrade(grade.code));
      list.append(btn);
    }
    g.append(list);
    wrap.append(g);
  }
  return wrap;
}

// ---- grade screen -------------------------------------------------------
function backBar(currentLabel) {
  const bar = el("div", { class: "back-bar" });
  const back = el("button", { class: "back-btn", attrs: { type: "button" }, text: "← 학년 다시 고르기" });
  back.addEventListener("click", () => selectGrade(null));
  bar.append(back);
  bar.append(el("span", { class: "crumb", text: currentLabel }));
  return bar;
}

function renderNonTransition(grade) {
  const sec = el("section", { class: "grade-screen" });
  sec.append(backBar(grade.label));
  sec.append(el("p", { class: "grade-kicker", text: grade.label }));
  sec.append(el("h1", { class: "grade-headline", text: grade.headline }));
  sec.append(el("p", { class: "grade-summary", text: grade.summary }));

  const up = grade.upcoming;
  if (up && up.previewGrades && up.previewGrades.length) {
    const card = el("div", { class: "upcoming-card" });
    card.append(el("h2", { text: "다가올 전환 미리 보기" }));
    card.append(el("p", { text: `${up.label} 전환 시기의 안내를 참고할 수 있습니다.` }));
    const links = el("div", { class: "preview-links" });
    for (const code of up.previewGrades) {
      const target = guide.grades[code];
      const b = el("button", { class: "preview-link", attrs: { type: "button" }, text: `${target.label} 안내 보기` });
      b.addEventListener("click", () => selectGrade(code));
      links.append(b);
    }
    card.append(links);
    sec.append(card);
  }
  return sec;
}

function subjectLead(subject) {
  if (subject.smooth) return subject.smoothNote;
  if (subject.subjectIntro && subject.gapTypes.includes("NewSubjectStart")) return subject.subjectIntro;
  return subject.whatChanges[0] ?? subject.subjectIntro ?? "";
}

function renderConceptGroup(group) {
  const box = el("div", { class: "concept-domain" });
  box.append(el("h4", { class: "concept-domain-title", text: group.domain }));
  const ul = el("ul", { class: "concept-list" });
  for (const item of group.items) {
    const li = el("li", { class: "concept-item" });
    const head = el("p", { class: "concept-label" });
    head.append(el("span", { text: item.easyLabel }));
    head.append(el("span", { class: "code-chip", text: item.code }));
    li.append(head);
    li.append(el("p", { class: "concept-explain", text: item.easyExplain }));
    ul.append(li);
  }
  box.append(ul);
  return box;
}

function renderEvidence(subject) {
  const det = el("details", { class: "evidence" });
  det.append(el("summary", { text: "자세한 근거 보기 (쪽번호·코드)" }));
  const body = el("div", { class: "evidence-body" });

  const facts = el("dl", { class: "evidence-facts" });
  const addFact = (k, v) => {
    facts.append(el("dt", { text: k }));
    facts.append(el("dd", { text: v }));
  };
  addFact("갭 스코어", String(subject.expert.gapScore));
  addFact("문서 연계율", `${subject.expert.coveragePct}%`);
  addFact("연간 밀도 배수", `${subject.expert.densityJumpRatio}배`);
  addFact("성취기준", `총 ${subject.expert.standardsTotal} · 연계 ${subject.expert.standardsLinked} · 미연계 ${subject.expert.standardsUnlinked}`);
  if (subject.expert.elementaryCounterpart) addFact("이전 학교급 대응", subject.expert.elementaryCounterpart);
  body.append(facts);

  if (subject.expert.rationales.length) {
    body.append(el("h5", { class: "evidence-sub", text: "온톨로지 근거 문장" }));
    const rl = el("ul", { class: "evidence-rationale" });
    for (const r of subject.expert.rationales) rl.append(el("li", { text: r.rationale }));
    body.append(rl);
  }

  if (subject.expert.basisPages.length) {
    body.append(el("h5", { class: "evidence-sub", text: "이어짐 근거 (공식 문서·쪽번호)" }));
    const bl = el("ul", { class: "evidence-basis" });
    for (const b of subject.expert.basisPages) bl.append(el("li", { text: b }));
    body.append(bl);
  }

  det.append(body);
  return det;
}

function renderSubject(subject) {
  const det = el("details", { class: `subject${subject.smooth ? " is-smooth" : ""}` });
  const summary = el("summary", { class: "subject-summary" });
  const titleRow = el("div", { class: "subject-title-row" });
  titleRow.append(el("span", { class: "subject-name", text: subject.subject }));
  const badges = el("span", { class: "badges" });
  if (subject.smooth) {
    badges.append(el("span", { class: "badge badge-smooth", text: "자연스럽게 이어짐" }));
  } else {
    for (const t of subject.gapTypes) badges.append(el("span", { class: "badge", text: BADGE[t] ?? t }));
  }
  titleRow.append(badges);
  summary.append(titleRow);
  summary.append(el("p", { class: "subject-lead", text: subjectLead(subject) }));
  det.append(summary);

  const body = el("div", { class: "subject-body" });

  if (subject.subjectIntro && !(subject.gapTypes.includes("NewSubjectStart"))) {
    body.append(el("p", { class: "subject-intro", text: subject.subjectIntro }));
  }

  if (subject.smooth) {
    body.append(block("이 과목은", [subject.smoothNote]));
  } else {
    if (subject.whatChanges.length) body.append(block("무엇이 달라지나", subject.whatChanges));
    if (subject.whyNow.length) body.append(block("왜 지금 봐야 하나", subject.whyNow));
  }

  if (subject.continuity && subject.continuity.points.length) {
    body.append(block("이어지는 학습 확인 포인트", subject.continuity.points));
  }

  if (subject.fieldSignal) {
    const fs = el("div", { class: "field-signal" });
    fs.append(el("h3", { class: "section-h", text: "국어·수학·영어 참고" }));
    fs.append(el("p", { text: subject.fieldSignal.note }));
    fs.append(el("p", { class: "field-caveat", text: subject.fieldSignal.caveat }));
    body.append(fs);
  }

  if (subject.newConcepts.length) {
    const nc = el("div", { class: "new-concepts" });
    const h = el("h3", { class: "section-h" });
    h.append(el("span", { text: "처음 만나는 개념" }));
    h.append(el("span", { class: "ai-tag", text: "AI 초안" }));
    nc.append(h);
    nc.append(el("p", { class: "new-concepts-help", text: "미리 이름과 뜻만 구경해 두어도 낯섦이 줄어듭니다. 쉬운 말 설명은 AI가 쓴 초안입니다." }));
    for (const group of subject.newConcepts) nc.append(renderConceptGroup(group));
    body.append(nc);
  }

  body.append(renderEvidence(subject));
  det.append(body);
  return det;
}

function block(title, paragraphs) {
  const div = el("div", { class: "sub-block" });
  div.append(el("h3", { class: "section-h", text: title }));
  for (const p of paragraphs) div.append(el("p", { text: p }));
  return div;
}

function renderTransition(grade) {
  const sec = el("section", { class: "grade-screen" });
  sec.append(backBar(grade.label));
  sec.append(el("p", { class: "grade-kicker", text: `${grade.label} · ${grade.transitionLabel}` }));
  sec.append(el("h1", { class: "grade-headline", text: grade.headline }));
  sec.append(el("p", { class: "grade-summary", text: grade.summary }));
  sec.append(el("p", { class: "subject-count-note", text: `과목 ${grade.subjects.length}개의 안내가 준비되어 있습니다. 궁금한 과목을 펼쳐 보세요.` }));

  const list = el("div", { class: "subject-list" });
  for (const subject of grade.subjects) list.append(renderSubject(subject));
  sec.append(list);
  return sec;
}

// ---- render dispatch ----------------------------------------------------
function render() {
  const { grade, teacher } = parseHash();
  setTeacher(teacher, false);

  clear(els.main);
  if (els.loadState) els.loadState.remove();

  if (!grade || !guide.grades[grade]) {
    els.main.append(renderHome());
    document.title = "전환기 길잡이 · 학년별 안내";
  } else {
    const g = guide.grades[grade];
    els.main.append(g.isTransition ? renderTransition(g) : renderNonTransition(g));
    document.title = `${g.label} · 전환기 길잡이`;
  }
  els.main.setAttribute("aria-busy", "false");
  els.main.focus?.();
  window.scrollTo(0, 0);
}

function selectGrade(code) {
  const { teacher } = parseHash();
  writeHash(code, teacher);
}

function setTeacher(on, propagate = true) {
  document.body.classList.toggle("teacher-mode", on);
  if (els.teacherMode) els.teacherMode.checked = on;
  if (propagate) {
    const { grade } = parseHash();
    writeHash(grade, on);
  }
}

// ---- boot ---------------------------------------------------------------
async function boot() {
  try {
    const res = await fetch(DATA_URL, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    guide = await res.json();
  } catch (err) {
    els.main.setAttribute("aria-busy", "false");
    clear(els.main);
    els.main.append(el("p", {
      class: "load-error",
      text: "안내 데이터를 불러오지 못했습니다. 서버(bun run serve)를 통해 다시 접속해 주세요.",
    }));
    return;
  }

  if (guide.boundaryNotice && els.boundaryNotice) els.boundaryNotice.textContent = guide.boundaryNotice;

  els.teacherMode?.addEventListener("change", (e) => setTeacher(e.target.checked, true));
  window.addEventListener("hashchange", render);

  // Print: open every fold so a grade prints complete, then restore.
  let reopened = [];
  window.addEventListener("beforeprint", () => {
    reopened = [...document.querySelectorAll("details:not([open])")];
    for (const d of reopened) d.open = true;
  });
  window.addEventListener("afterprint", () => {
    for (const d of reopened) d.open = false;
    reopened = [];
  });

  render();
}

boot();
