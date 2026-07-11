const taskLabels = {
  "prerequisite-choice": "직접 선수 선택",
  "direction-choice": "관계 방향 판별",
  "edge-audit": "비기록 관계 탐지",
};

const [results, gold] = await Promise.all([
  fetch("results.json").then(assertOk).then((response) => response.json()),
  fetch("gold.v1.json").then(assertOk).then((response) => response.json()),
]);

const questions = new Map(gold.questions.map((question) => [question.id, question]));
let visibleFailures = 8;

renderLeaderboard();
renderTaskChart();
renderSubjectChart();
setupFilters();
renderFailures();
setupSharing();

function assertOk(response) {
  if (!response.ok) throw new Error(`데이터를 불러오지 못했습니다: ${response.status}`);
  return response;
}

function renderLeaderboard() {
  const root = document.querySelector("#leaderboard");
  root.innerHTML = results.models.map((model, index) => `
    <article class="model-card" data-rank="${index + 1}">
      <div class="model-top">
        <div><span class="model-rank">RANK ${String(index + 1).padStart(2, "0")}</span><h3 class="model-name">${escapeHtml(model.label)}</h3></div>
        <div class="model-score"><strong>${formatScore(model.overall.score)}</strong><span>ONTOLOGY ALIGNMENT</span></div>
      </div>
      <div class="model-meta">
        <span><strong>${model.overall.correct}/${model.overall.total}</strong> correct</span>
        <span><strong>${model.coverage.answered}/${model.coverage.total}</strong> answered</span>
        <span><strong>${model.meanAbsoluteCalibrationError}</strong> confidence error</span>
      </div>
    </article>`).join("");
}

function renderTaskChart() {
  const types = Object.keys(taskLabels);
  document.querySelector("#task-chart").innerHTML = types.map((type) => `
    <div class="bar-group">
      <span>${taskLabels[type]}</span>
      ${results.models.map((model) => barRow(model.label, model.byType[type].score)).join("")}
    </div>`).join("");
}

function barRow(label, value) {
  return `<div class="bar-row"><b>${escapeHtml(label)}</b><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-value">${formatScore(value)}</span></div>`;
}

function renderSubjectChart() {
  const subjects = Object.keys(results.models[0].bySubject);
  document.querySelector("#subject-chart").innerHTML = subjects.map((subject) => `
    <div class="subject-row">
      <span>${escapeHtml(subject)}</span>
      <div class="subject-bars">
        ${results.models.map((model) => {
          const value = model.bySubject[subject].score;
          return `<div class="subject-bar" title="${escapeHtml(model.label)} ${value}%"><i style="width:${value}%"></i><b>${formatScore(value)}</b></div>`;
        }).join("")}
      </div>
    </div>`).join("");
}

function setupFilters() {
  const modelFilter = document.querySelector("#model-filter");
  modelFilter.innerHTML = results.models.map((model) => `<option value="${model.id}">${escapeHtml(model.label)}</option>`).join("");
  const subjects = [...new Set(gold.questions.map((question) => question.subject))].sort((a, b) => a.localeCompare(b, "ko"));
  document.querySelector("#subject-filter").insertAdjacentHTML("beforeend", subjects.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join(""));
  document.querySelector("#task-filter").insertAdjacentHTML("beforeend", Object.entries(taskLabels).map(([id, label]) => `<option value="${id}">${label}</option>`).join(""));
  for (const select of document.querySelectorAll(".filters select")) {
    select.addEventListener("change", () => { visibleFailures = 8; renderFailures(); });
  }
  document.querySelector("#load-more").addEventListener("click", () => { visibleFailures += 8; renderFailures(); });
}

function renderFailures() {
  const modelId = document.querySelector("#model-filter").value;
  const subject = document.querySelector("#subject-filter").value;
  const task = document.querySelector("#task-filter").value;
  const model = results.models.find((candidate) => candidate.id === modelId) ?? results.models[0];
  const failures = model.items.filter((item) => !item.correct && (subject === "all" || item.subject === subject) && (task === "all" || item.type === task));
  const shown = failures.slice(0, visibleFailures);
  const root = document.querySelector("#failure-list");
  root.innerHTML = shown.length ? shown.map((item) => failureCard(model, item)).join("") : `<p class="empty-state">이 조건에는 실패 사례가 없습니다.</p>`;
  const loadMore = document.querySelector("#load-more");
  loadMore.hidden = shown.length >= failures.length;
  loadMore.textContent = `더 보기 · ${shown.length}/${failures.length}`;
}

function failureCard(model, item) {
  const question = questions.get(item.questionId);
  const modelAnswer = describeAnswer(question, item.modelAnswerId);
  const correctAnswer = describeAnswer(question, item.correctAnswerId);
  return `<article class="failure-card">
    <div class="failure-meta"><strong>MISS · ${item.questionId}</strong>${escapeHtml(item.subject)} · ${item.gradeBand}학년군<br>${taskLabels[item.type]}<br>confidence ${Math.round(item.confidence * 100)}%</div>
    <div class="failure-question"><h3>${escapeHtml(question.prompt)}</h3><p>${escapeHtml(question.rationale)}</p></div>
    <div class="failure-answer answer-pair">
      <div class="answer-item"><span>${escapeHtml(model.label)} 선택</span><p>${escapeHtml(modelAnswer)}</p></div>
      <div class="answer-item correct"><span>온톨로지 정렬 답</span><p>${escapeHtml(correctAnswer)}</p></div>
    </div>
  </article>`;
}

function describeAnswer(question, answerId) {
  if (!answerId) return "미응답";
  if (question.type === "edge-audit") {
    const relation = question.relations.find((candidate) => candidate.id === answerId);
    return relation ? `${relation.prerequisite.label} → ${relation.target.label}` : answerId;
  }
  return question.options.find((option) => option.id === answerId)?.label ?? answerId;
}

function setupSharing() {
  document.querySelector("#share-button").addEventListener("click", async () => {
    const text = "AI는 초등학교를 이해하는가? GPT-5.6-sol 56%, Claude Sonnet 44%. 정답을 아는 것과 배움의 구조를 이해하는 것은 달랐습니다.";
    if (navigator.share) {
      await navigator.share({ title: document.title, text, url: location.href });
      return;
    }
    await navigator.clipboard.writeText(`${text} ${location.href}`);
    const button = document.querySelector("#share-button");
    button.textContent = "링크 복사됨";
    setTimeout(() => { button.textContent = "결과 공유"; }, 1800);
  });
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
