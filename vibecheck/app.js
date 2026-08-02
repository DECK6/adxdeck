/* Vibe Coding Check — app logic
   Everything (in-progress session + finished results) lives in localStorage.
   Nothing is sent anywhere. */

const STORE_KEY = 'dexa.vibecheck.v1';
const GRADES = [
  { min: 90, name: 'SHIP READY', line: '혼자서도 문제를 진단하고 되돌릴 수 있는 수준입니다. 이제 아는 것을 문서로 남겨 팀에 전파할 단계입니다.' },
  { min: 75, name: 'SOLID', line: '기본기가 잡혀 있습니다. 약한 영역 한두 곳만 메우면 AI가 만든 코드를 신뢰성 있게 검수할 수 있습니다.' },
  { min: 55, name: 'GROWING', line: '작동하는 결과물은 만들 수 있지만, 문제가 생겼을 때 원인을 특정하는 데 시간이 걸립니다. 아래 보완 영역부터 채우세요.' },
  { min: 35, name: 'FRAGILE', line: 'AI가 준 코드가 왜 되고 왜 안 되는지 판단하기 어려운 구간입니다. 특히 버전관리와 보안은 사고로 직결되니 먼저 잡으세요.' },
  { min: 0, name: 'START HERE', line: '지금은 AI에 전적으로 의존하는 상태입니다. 나쁜 출발점이 아닙니다 — 아래 순서대로 하나씩만 익혀도 결과물이 달라집니다.' },
];

/* ----------------------------------------------------------------- store */
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { session: null, history: [] };
    const parsed = JSON.parse(raw);
    return { session: parsed.session || null, history: Array.isArray(parsed.history) ? parsed.history : [] };
  } catch (e) {
    return { session: null, history: [] };
  }
}

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (e) {
    flashSave('저장 실패 — 브라우저 저장공간 확인');
  }
}

let store = loadStore();
let selectedCats = new Set(CATEGORIES.map((c) => c.id));
let viewingResult = null;
let saveTimer = null;

/* ------------------------------------------------------------- utilities */
const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
const qById = (id) => QUESTIONS.find((q) => q.id === id);
const catById = (id) => CATEGORIES.find((c) => c.id === id);

function normalize(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/* short ascii tokens need a word boundary so "ls" doesn't match "tools" */
function hasKeyword(hay, needle) {
  const n = needle.toLowerCase().trim();
  if (!n) return false;
  if (/^[a-z0-9]{1,3}$/.test(n)) return new RegExp('(^|[^a-z0-9])' + n + '($|[^a-z0-9])', 'i').test(hay);
  return hay.includes(n);
}

function autoGrade(question, text) {
  const hay = normalize(text);
  const hits = question.keys.map((k) => k.any.some((token) => hasKeyword(hay, token)));
  const got = hits.filter(Boolean).length;
  return { hits, got, max: question.keys.length, ratio: question.keys.length ? got / question.keys.length : 0 };
}

function selfFromRatio(ratio) {
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.35) return 1;
  return 0;
}

function fmtDate(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function show(viewId) {
  ['view-start', 'view-quiz', 'view-result'].forEach((id) => byId(id).classList.toggle('hidden', id !== viewId));
  window.scrollTo({ top: 0 });
}

function flashSave(msg) {
  const el = byId('save-state');
  el.textContent = msg || '자동 저장됨';
  el.classList.add('on');
  setTimeout(() => el.classList.remove('on'), 900);
}

/* --------------------------------------------------------------- scoring */
function scoreSession(session) {
  const byCat = {};
  const dist = { 0: 0, 1: 0, 2: 0 };
  let got = 0;
  let max = 0;

  session.order.forEach((qid) => {
    const q = qById(qid);
    if (!q) return;
    const a = session.answers[qid];
    if (!a || !a.graded) return;
    const self = typeof a.self === 'number' ? a.self : selfFromRatio(a.ratio || 0);
    dist[self] += 1;
    got += self;
    max += 2;
    if (!byCat[q.cat]) byCat[q.cat] = { got: 0, max: 0, n: 0 };
    byCat[q.cat].got += self;
    byCat[q.cat].max += 2;
    byCat[q.cat].n += 1;
  });

  return {
    score: max ? Math.round((got / max) * 100) : 0,
    answered: dist[0] + dist[1] + dist[2],
    dist,
    byCat,
  };
}

function gradeOf(score) {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
}

/* =========================================================== START VIEW */
function renderStart() {
  renderCategories();
  renderResume();
  renderHistory();
  show('view-start');
}

function renderCategories() {
  const wrap = byId('cat-list');
  wrap.innerHTML = '';
  CATEGORIES.forEach((cat) => {
    const n = QUESTIONS.filter((q) => q.cat === cat.id).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-item';
    btn.setAttribute('aria-pressed', selectedCats.has(cat.id) ? 'true' : 'false');
    btn.innerHTML =
      '<span class="box" aria-hidden="true">✓</span>' +
      '<span class="txt">' +
      `<span class="name">${cat.name}</span>` +
      `<span class="line">${cat.line}</span>` +
      `<span class="n">${cat.id} · ${n}문항</span>` +
      '</span>';
    btn.addEventListener('click', () => {
      if (selectedCats.has(cat.id)) selectedCats.delete(cat.id);
      else selectedCats.add(cat.id);
      btn.setAttribute('aria-pressed', selectedCats.has(cat.id) ? 'true' : 'false');
      updateCatCount();
    });
    wrap.appendChild(btn);
  });
  updateCatCount();
}

function selectedQuestionIds() {
  return QUESTIONS.filter((q) => selectedCats.has(q.cat)).map((q) => q.id);
}

function updateCatCount() {
  const n = selectedQuestionIds().length;
  byId('cat-count').textContent = `${n}문항 선택됨`;
  byId('btn-start').disabled = n === 0;
}

function renderResume() {
  const box = byId('resume-box');
  const s = store.session;
  if (!s || !s.order || !s.order.length) {
    box.classList.add('hidden');
    return;
  }
  const done = s.order.filter((id) => s.answers[id] && s.answers[id].graded).length;
  byId('resume-desc').textContent =
    `${fmtDate(s.startedAt)}에 시작한 테스트가 진행 중입니다 — ${s.order.length}문항 중 ${done}문항 완료.`;
  box.classList.remove('hidden');
}

function renderHistory() {
  const wrap = byId('history-list');
  wrap.innerHTML = '';
  if (!store.history.length) {
    const empty = document.createElement('div');
    empty.className = 'hist-empty';
    empty.textContent = '아직 완료한 테스트가 없습니다.';
    wrap.appendChild(empty);
    return;
  }
  store.history
    .slice()
    .sort((a, b) => b.ts - a.ts)
    .forEach((rec) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'hist-row';
      row.innerHTML =
        `<span class="date">${fmtDate(rec.ts)}</span>` +
        `<span class="sc">${rec.score}<span class="u">/100</span></span>` +
        `<span class="meta">${rec.grade} · ${rec.answered}문항</span>` +
        '<span class="go">결과 보기 →</span>';
      row.addEventListener('click', () => {
        viewingResult = rec;
        renderResult(rec);
      });
      wrap.appendChild(row);
    });
}

/* ============================================================ QUIZ VIEW */
function startSession(ids, shuffle) {
  const order = ids.slice();
  if (shuffle) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  store.session = { order, cursor: 0, answers: {}, startedAt: Date.now() };
  saveStore();
  renderQuestion();
  show('view-quiz');
}

function currentQuestion() {
  const s = store.session;
  return qById(s.order[s.cursor]);
}

function renderQuestion() {
  const s = store.session;
  const q = currentQuestion();
  if (!q) return;
  const cat = catById(q.cat);
  const a = s.answers[q.id];

  byId('q-index').textContent = `${String(s.cursor + 1).padStart(2, '0')} / ${String(s.order.length).padStart(2, '0')}`;
  byId('q-cat').textContent = `${q.cat} · ${cat ? cat.name : ''}`;
  byId('q-text').innerHTML = q.q;
  byId('q-hint').textContent = q.hint;
  byId('q-hint').classList.add('hidden');
  byId('btn-hint').setAttribute('aria-expanded', 'false');
  byId('btn-hint').textContent = '힌트 보기';

  const ta = byId('answer');
  ta.value = a ? a.text || '' : '';
  ta.disabled = false;

  const pct = Math.round((s.cursor / s.order.length) * 100);
  byId('progress-fill').style.width = pct + '%';
  byId('progress-bar').setAttribute('aria-valuenow', String(pct));

  byId('btn-prev').disabled = s.cursor === 0;
  byId('save-state').textContent = '자동 저장됨';

  if (a && a.graded) renderFeedback(q, a);
  else byId('feedback').classList.add('hidden');

  byId('btn-next').textContent = s.cursor === s.order.length - 1 ? '결과 보기 →' : '다음 문제 →';
  if (!a || !a.graded) ta.focus();
}

function persistAnswerText() {
  const s = store.session;
  if (!s) return;
  const q = currentQuestion();
  if (!q) return;
  const text = byId('answer').value;
  const prev = s.answers[q.id] || {};
  s.answers[q.id] = Object.assign({}, prev, { text });
  saveStore();
}

function gradeCurrent(forceZero) {
  const s = store.session;
  const q = currentQuestion();
  const text = forceZero ? byId('answer').value : byId('answer').value;
  const auto = autoGrade(q, forceZero ? '' : text);
  const prev = s.answers[q.id] || {};
  const rec = {
    text,
    graded: true,
    hits: auto.hits,
    ratio: auto.ratio,
    self: forceZero ? 0 : typeof prev.self === 'number' ? prev.self : null,
  };
  s.answers[q.id] = rec;
  saveStore();
  renderFeedback(q, rec);
  byId('feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderFeedback(q, rec) {
  const auto = rec.hits ? { hits: rec.hits, got: rec.hits.filter(Boolean).length } : autoGrade(q, rec.text);
  byId('fb-score').textContent = `키워드 ${auto.got} / ${q.keys.length} 포함`;

  const ul = byId('fb-keys');
  ul.innerHTML = '';
  q.keys.forEach((k, i) => {
    const li = document.createElement('li');
    li.className = auto.hits[i] ? 'hit' : 'miss';
    li.innerHTML = `<span class="mk">${auto.hits[i] ? '✓' : '—'}</span><span>${k.label}</span>`;
    ul.appendChild(li);
  });

  byId('fb-model-text').innerHTML = q.model;
  byId('fb-why-text').textContent = q.why;

  const effective = typeof rec.self === 'number' ? rec.self : selfFromRatio(rec.ratio || 0);
  document.querySelectorAll('.self-btn').forEach((b) => {
    b.setAttribute('aria-pressed', Number(b.dataset.self) === effective ? 'true' : 'false');
  });

  byId('feedback').classList.remove('hidden');
}

function goNext() {
  const s = store.session;
  if (s.cursor < s.order.length - 1) {
    s.cursor += 1;
    saveStore();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    finishSession();
  }
}

function goPrev() {
  const s = store.session;
  if (s.cursor > 0) {
    persistAnswerText();
    s.cursor -= 1;
    saveStore();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function finishSession() {
  const s = store.session;
  const summary = scoreSession(s);
  const grade = gradeOf(summary.score);
  const rec = {
    id: 'r' + s.startedAt,
    ts: Date.now(),
    startedAt: s.startedAt,
    score: summary.score,
    grade: grade.name,
    answered: summary.answered,
    dist: summary.dist,
    byCat: summary.byCat,
    order: s.order.slice(),
    answers: JSON.parse(JSON.stringify(s.answers)),
  };
  store.history.push(rec);
  store.session = null;
  saveStore();
  viewingResult = rec;
  renderResult(rec);
}

/* ========================================================== RESULT VIEW */
function renderResult(rec) {
  const grade = gradeOf(rec.score);
  byId('res-date').textContent = fmtDate(rec.ts);
  byId('res-score').textContent = rec.score;
  byId('res-grade').textContent = grade.name;
  byId('res-count').textContent = rec.answered;
  byId('res-full').textContent = rec.dist[2] || 0;
  byId('res-part').textContent = rec.dist[1] || 0;
  byId('res-zero').textContent = rec.dist[0] || 0;
  byId('res-verdict').textContent = grade.line;

  renderChart(rec);
  renderWeak(rec);
  renderReview(rec);
  show('view-result');
}

function renderChart(rec) {
  const wrap = byId('cat-chart');
  wrap.innerHTML = '';

  const rows = CATEGORIES.filter((c) => rec.byCat[c.id]).map((c) => {
    const d = rec.byCat[c.id];
    return { cat: c, pct: d.max ? Math.round((d.got / d.max) * 100) : 0, d };
  });

  rows.forEach((r) => {
    const weak = r.pct < 50;
    const row = document.createElement('div');
    row.className = 'chart-row' + (weak ? ' weak' : '');
    row.innerHTML =
      `<span class="label">${r.cat.name}</span>` +
      '<span class="track"><span class="bar"></span></span>' +
      `<span class="val">${r.pct}%${weak ? '<span class="flag">보완 필요</span>' : ''}</span>`;
    wrap.appendChild(row);
    requestAnimationFrame(() => {
      row.querySelector('.bar').style.width = r.pct + '%';
    });

    const tipText =
      `${r.cat.name} (${r.cat.id})\n${r.d.n}문항 · 획득 ${r.d.got} / ${r.d.max}점 · ${r.pct}%`;
    row.addEventListener('mousemove', (e) => showTip(e, r.cat.name, tipText));
    row.addEventListener('mouseleave', hideTip);
  });

  const scale = document.createElement('div');
  scale.className = 'chart-scale';
  scale.innerHTML = '<span></span><span class="ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span></span><span></span>';
  wrap.appendChild(scale);
}

let tipEl = null;
function showTip(e, title, body) {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'chart-tip';
    document.body.appendChild(tipEl);
  }
  tipEl.classList.remove('hidden');
  tipEl.innerHTML = `<span class="t">${title}</span>`;
  tipEl.appendChild(document.createTextNode(body.split('\n').slice(1).join(' ')));
  const pad = 14;
  tipEl.style.left = Math.min(e.clientX + pad, window.innerWidth - 280) + 'px';
  tipEl.style.top = e.clientY + pad + 'px';
}
function hideTip() {
  if (tipEl) tipEl.classList.add('hidden');
}

function renderWeak(rec) {
  const wrap = byId('weak-list');
  wrap.innerHTML = '';
  const rows = CATEGORIES.filter((c) => rec.byCat[c.id])
    .map((c) => ({ cat: c, pct: Math.round((rec.byCat[c.id].got / rec.byCat[c.id].max) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  const weak = rows.filter((r) => r.pct < 75).slice(0, 3);
  if (!weak.length) {
    const card = document.createElement('div');
    card.className = 'weak-card ok';
    card.innerHTML = '<h3>모든 영역 75% 이상</h3><p>취약 영역이 없습니다. 이제 실제 프로젝트에서 배포·보안 체크리스트를 문서로 만들어 두세요.</p>';
    wrap.appendChild(card);
    return;
  }
  weak.forEach((r, i) => {
    const missed = rec.order
      .map(qById)
      .filter((q) => q && q.cat === r.cat.id)
      .filter((q) => {
        const a = rec.answers[q.id];
        if (!a || !a.graded) return false;
        const self = typeof a.self === 'number' ? a.self : selfFromRatio(a.ratio || 0);
        return self < 2;
      });
    const card = document.createElement('div');
    card.className = 'weak-card';
    card.innerHTML =
      `<h3>${i + 1}. ${r.cat.name} — ${r.pct}%</h3>` +
      `<p>${r.cat.line}. 놓친 문항 ${missed.length}개. ${missed.length ? '아래 복습 목록에서 이 영역 문항의 모범답안을 다시 읽고, 실제 프로젝트에서 한 번 직접 해보세요.' : ''}</p>`;
    wrap.appendChild(card);
  });
}

function renderReview(rec) {
  const wrap = byId('review-list');
  wrap.innerHTML = '';
  rec.order.forEach((qid) => {
    const q = qById(qid);
    if (!q) return;
    const a = rec.answers[qid];
    if (!a || !a.graded) return;
    const self = typeof a.self === 'number' ? a.self : selfFromRatio(a.ratio || 0);
    const mark = self === 2 ? '●' : self === 1 ? '◐' : '○';
    const cat = catById(q.cat);

    const item = document.createElement('div');
    item.className = 'review-item';

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'review-head';
    head.innerHTML =
      `<span class="mk s${self}" aria-hidden="true">${mark}</span>` +
      `<span class="cat">${cat ? cat.name : q.cat}</span>` +
      `<span class="qq">${q.q}</span>`;
    head.addEventListener('click', () => item.classList.toggle('open'));

    const body = document.createElement('div');
    body.className = 'review-body';

    const lab1 = document.createElement('span');
    lab1.className = 'lab';
    lab1.textContent = '내 답변';
    const mine = document.createElement('div');
    mine.className = 'mine' + (a.text && a.text.trim() ? '' : ' empty');
    mine.textContent = a.text && a.text.trim() ? a.text : '(작성하지 않음)';

    const lab2 = document.createElement('span');
    lab2.className = 'lab';
    lab2.textContent = '모범답안';
    const ans = document.createElement('p');
    ans.className = 'ans';
    ans.innerHTML = q.model;

    const lab3 = document.createElement('span');
    lab3.className = 'lab';
    lab3.textContent = '왜 중요한가';
    const why = document.createElement('p');
    why.className = 'ans';
    why.textContent = q.why;

    body.append(lab1, mine, lab2, ans, lab3, why);
    item.append(head, body);
    wrap.appendChild(item);
  });
}

/* ============================================================== EXPORT */
function exportJSON() {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vibecheck-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || (!data.history && !data.session)) throw new Error('형식 오류');
      store = {
        session: data.session || null,
        history: Array.isArray(data.history) ? data.history : [],
      };
      saveStore();
      renderStart();
      alert('불러왔습니다.');
    } catch (e) {
      alert('불러오지 못했습니다. 이 페이지에서 내보낸 JSON 파일인지 확인하세요.');
    }
  };
  reader.readAsText(file);
}

/* =============================================================== EVENTS */
byId('btn-all').addEventListener('click', () => {
  selectedCats = new Set(CATEGORIES.map((c) => c.id));
  renderCategories();
});
byId('btn-none').addEventListener('click', () => {
  selectedCats = new Set();
  renderCategories();
});
byId('btn-start').addEventListener('click', () => {
  const ids = selectedQuestionIds();
  if (!ids.length) return;
  if (store.session && !confirm('진행 중인 기록이 있습니다. 새로 시작하면 지워집니다. 계속할까요?')) return;
  startSession(ids, byId('opt-shuffle').checked);
});
byId('btn-resume').addEventListener('click', () => {
  renderQuestion();
  show('view-quiz');
});
byId('btn-discard').addEventListener('click', () => {
  if (!confirm('진행 중인 기록을 지울까요? 완료된 지난 결과는 남습니다.')) return;
  store.session = null;
  saveStore();
  renderStart();
});

byId('answer').addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistAnswerText();
    flashSave();
  }, 500);
});
byId('answer').addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    persistAnswerText();
    gradeCurrent(false);
  }
});

byId('btn-hint').addEventListener('click', () => {
  const hint = byId('q-hint');
  const open = hint.classList.toggle('hidden');
  byId('btn-hint').setAttribute('aria-expanded', open ? 'false' : 'true');
  byId('btn-hint').textContent = open ? '힌트 보기' : '힌트 닫기';
});
byId('btn-grade').addEventListener('click', () => {
  persistAnswerText();
  gradeCurrent(false);
});
byId('btn-skip').addEventListener('click', () => {
  persistAnswerText();
  gradeCurrent(true);
});
byId('btn-next').addEventListener('click', goNext);
byId('btn-prev').addEventListener('click', goPrev);
byId('btn-exit').addEventListener('click', () => {
  persistAnswerText();
  renderStart();
});

document.querySelectorAll('.self-btn').forEach((b) => {
  b.addEventListener('click', () => {
    const q = currentQuestion();
    const rec = store.session.answers[q.id];
    if (!rec) return;
    rec.self = Number(b.dataset.self);
    saveStore();
    document.querySelectorAll('.self-btn').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
  });
});

byId('btn-home').addEventListener('click', renderStart);
byId('btn-retry-wrong').addEventListener('click', () => {
  const rec = viewingResult;
  if (!rec) return;
  const ids = rec.order.filter((qid) => {
    const a = rec.answers[qid];
    if (!a || !a.graded) return true;
    const self = typeof a.self === 'number' ? a.self : selfFromRatio(a.ratio || 0);
    return self < 2;
  });
  if (!ids.length) {
    alert('틀린 문항이 없습니다.');
    return;
  }
  startSession(ids, false);
});

byId('btn-export').addEventListener('click', exportJSON);
byId('btn-export-2').addEventListener('click', exportJSON);
byId('btn-import').addEventListener('click', () => byId('file-import').click());
byId('file-import').addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) importJSON(e.target.files[0]);
  e.target.value = '';
});
byId('btn-wipe').addEventListener('click', () => {
  if (!confirm('진행 상황과 모든 지난 결과를 삭제합니다. 되돌릴 수 없습니다. 계속할까요?')) return;
  store = { session: null, history: [] };
  localStorage.removeItem(STORE_KEY);
  renderStart();
});

window.addEventListener('beforeunload', () => {
  if (store.session && !byId('view-quiz').classList.contains('hidden')) persistAnswerText();
});

/* ================================================================= INIT */
renderStart();
