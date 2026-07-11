const taskLabels = {
  "prerequisite-choice": "직접 선수 선택",
  "direction-choice": "관계 방향 판별",
  "edge-audit": "비기록 관계 탐지",
};
const seriesColors = ["#c8ff3d", "#5ef2c2", "#76a9ff", "#ff735c", "#ffc75e", "#b58cff", "#52d6ff", "#f28fc7"];

const [results, gold] = await Promise.all([
  fetch("results.json").then(assertOk).then((response) => response.json()),
  fetch("gold.v1.json").then(assertOk).then((response) => response.json()),
]);

const questions = new Map(gold.questions.map((question) => [question.id, question]));
let visibleFailures = 8;

renderHero();
renderLeaderboard();
renderModelLegend();
renderStability();
renderTaskChart();
renderSubjectChart();
renderFinding();
setupFilters();
renderFailures();
setupSharing();

function assertOk(response) {
  if (!response.ok) throw new Error(`데이터를 불러오지 못했습니다: ${response.status}`);
  return response;
}

function renderHero() {
  const leaders = results.models.slice(0, 2);
  leaders.forEach((model, index) => {
    document.querySelector(`#hero-model-${index + 1}`).textContent = model.label;
    document.querySelector(`#hero-score-${index + 1}`).textContent = formatScore(model.overall.score);
  });
  document.querySelector("#completed-model-count").textContent = String(results.completedModelCount);
  document.querySelector("#run-progress-count").textContent = `${results.completedRuns}/${results.plannedRuns}`;
  document.querySelector("#run-summary").textContent = `2026-07-11 · ${results.completedModelCount}개 모델 × ${results.runsPerModel}회 비교 완료 · ${results.completedRuns}/${results.plannedRuns} 수집`;
  const pending = results.pendingModels[0];
  document.querySelector("#interim-status").textContent = pending
    ? `${pending.label}은 ${pending.completedRuns}/${pending.plannedRuns}회 완료 상태로 평균 순위에서 제외했습니다. 현재 공개 비교는 ${results.completedModelCount}개 모델의 ${results.comparableRuns}회만 사용합니다.`
    : "모든 모델의 반복 수집이 완료됐습니다.";
  document.querySelector(".hero-figure").setAttribute("aria-label", `${leaders.map((model) => `${model.label} 평균 ${formatScore(model.overall.score)}점`).join(", ")} 비교`);
}

function renderLeaderboard() {
  const root = document.querySelector("#leaderboard");
  root.innerHTML = results.models.map((model, index) => `
    <article class="model-card provider-${providerClass(model.provider)}" data-rank="${index + 1}" style="--series-color:${seriesColors[index % seriesColors.length]}">
      <div class="model-top">
        <div><span class="model-rank">RANK ${String(index + 1).padStart(2, "0")} · ${escapeHtml(model.provider)}</span><h3 class="model-name">${escapeHtml(model.label)}</h3></div>
        <div class="model-score"><strong>${formatScore(model.overall.score)}</strong><span>MEAN ALIGNMENT</span></div>
      </div>
      <div class="run-strip" aria-label="${escapeHtml(model.label)} 실행별 점수">${model.runs.map((run) => `<span title="${run.runId} · ${run.score}%">${formatScore(run.score)}</span>`).join("")}</div>
      <div class="model-meta">
        <span><strong>${formatScore(model.overall.correct)}/${model.overall.total}</strong> 평균 정답</span>
        <span><strong>${formatScore(model.overall.median)}</strong> 중앙값</span>
        <span><strong>${formatScore(model.overall.min)}–${formatScore(model.overall.max)}</strong> 범위</span>
        <span><strong>SD ${formatScore(model.overall.standardDeviation)}</strong> 표준편차</span>
        <span><strong>${model.stability.stableIncorrectItems}</strong> 일관 오답</span>
      </div>
    </article>`).join("");
}

function renderStability() {
  const root = document.querySelector("#stability-table");
  root.innerHTML = `<div class="stability-row stability-head"><span>모델</span><span>5회 점수</span><span>평균</span><span>95% CI</span><span>순위 범위</span><span>문항 일치율</span></div>${results.models.map((model, index) => `
    <div class="stability-row" style="--series-color:${seriesColors[index % seriesColors.length]}">
      <strong>${escapeHtml(model.label)}</strong>
      <span class="run-values">${model.runs.map((run) => `<i>${formatScore(run.score)}</i>`).join("")}</span>
      <b>${formatScore(model.overall.score)}</b>
      <span>${formatScore(model.overall.ci95[0])}–${formatScore(model.overall.ci95[1])}</span>
      <span>${model.overall.rankMin}–${model.overall.rankMax}위</span>
      <span>${formatScore(model.stability.meanModalAgreement * 100)}%</span>
    </div>`).join("")}`;
}

function renderModelLegend() {
  document.querySelector("#model-legend").innerHTML = results.models.map((model, index) => `
    <span class="legend-item" style="--series-color:${seriesColors[index % seriesColors.length]}"><i></i>${escapeHtml(model.label)}</span>`).join("");
}

function renderTaskChart() {
  const types = Object.keys(taskLabels);
  document.querySelector("#task-chart").innerHTML = types.map((type) => `
    <div class="bar-group">
      <span>${taskLabels[type]}</span>
      ${results.models.map((model, index) => barRow(model.label, model.byType[type].score, model.provider, seriesColors[index % seriesColors.length])).join("")}
    </div>`).join("");
}

function barRow(label, value, provider, color) {
  return `<div class="bar-row provider-${providerClass(provider)}" style="--series-color:${color}"><b>${escapeHtml(label)}</b><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-value">${formatScore(value)}</span></div>`;
}

function renderSubjectChart() {
  const subjects = Object.keys(results.models[0].bySubject);
  document.querySelector("#subject-chart").innerHTML = subjects.map((subject) => `
    <div class="subject-row">
      <span>${escapeHtml(subject)}</span>
      <div class="subject-bars" style="--model-count:${results.models.length}">
        ${results.models.map((model, index) => {
          const value = model.bySubject[subject].score;
          return `<div class="subject-bar provider-${providerClass(model.provider)}" style="--series-color:${seriesColors[index % seriesColors.length]}" title="${escapeHtml(model.label)} ${value}%"><i style="width:${value}%"></i><b>${formatScore(value)}</b></div>`;
        }).join("")}
      </div>
    </div>`).join("");
}

function renderFinding() {
  const math = results.models.map((model) => model.bySubject["수학"]?.score).filter(Number.isFinite);
  const integrated = results.models.map((model) => model.bySubject["통합교과"]?.score).filter(Number.isFinite);
  document.querySelector("#finding-stat").innerHTML = `수학 ${scoreRange(math)}<br>통합교과 ${scoreRange(integrated)}`;
  document.querySelector("#finding-copy").textContent = `${results.completedModelCount}개 완료 모델은 교과에 따라 크게 다른 정렬도를 보였습니다. 이 차이는 모델 성능뿐 아니라 현재 온톨로지 관계가 주제명만으로 얼마나 복원 가능한지도 함께 보여줍니다.`;
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
  const stability = document.querySelector("#stability-filter").value;
  const subject = document.querySelector("#subject-filter").value;
  const task = document.querySelector("#task-filter").value;
  const model = results.models.find((candidate) => candidate.id === modelId) ?? results.models[0];
  const failures = model.items
    .filter((item) => item.score < 100
      && (stability === "all" || (stability === "variable" && !item.unanimous) || (stability === "consistent-miss" && item.unanimous && item.correctRuns === 0))
      && (subject === "all" || item.subject === subject)
      && (task === "all" || item.type === task))
    .sort((a, b) => a.score - b.score || a.questionId.localeCompare(b.questionId));
  const shown = failures.slice(0, visibleFailures);
  const root = document.querySelector("#failure-list");
  root.innerHTML = shown.length ? shown.map((item) => failureCard(model, item)).join("") : `<p class="empty-state">이 조건에서는 5회 모두 온톨로지와 정렬됐습니다.</p>`;
  const loadMore = document.querySelector("#load-more");
  loadMore.hidden = shown.length >= failures.length;
  loadMore.textContent = `더 보기 · ${shown.length}/${failures.length}`;
}

function failureCard(model, item) {
  const question = questions.get(item.questionId);
  const modelAnswer = describeAnswer(question, item.modelAnswerId);
  const correctAnswer = describeAnswer(question, item.correctAnswerId);
  const distribution = item.answerDistribution.map((answer) => `${describeAnswer(question, answer.answerId)} ${answer.count}/${item.totalRuns}`).join(" · ");
  const state = item.unanimous && item.correctRuns === 0 ? "CONSISTENT MISS" : item.correctRuns === 0 ? "MISS" : "UNSTABLE";
  return `<article class="failure-card">
    <div class="failure-meta"><strong>${state} · ${item.questionId}</strong>${escapeHtml(item.subject)} · ${item.gradeBand}학년군<br>${taskLabels[item.type]}<br>${item.correctRuns}/${item.totalRuns}회 정렬 · 평균 신뢰도 ${Math.round(item.confidence * 100)}%</div>
    <div class="failure-question"><h3>${escapeHtml(question.prompt)}</h3><p>${escapeHtml(question.rationale)}</p></div>
    <div class="failure-answer answer-pair">
      <div class="answer-item"><span>${escapeHtml(model.label)} 최빈 선택 · 정렬도 ${formatScore(item.score)}%</span><p>${escapeHtml(modelAnswer)}</p><small>${escapeHtml(distribution)}</small></div>
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
    const leaders = results.models.slice(0, 3).map((model) => `${model.label} 평균 ${formatScore(model.overall.score)}% (${formatScore(model.overall.min)}–${formatScore(model.overall.max)})`).join(" · ");
    const text = `AI는 초등학교를 이해하는가? 완료 ${results.completedModelCount}개 모델 × ${results.runsPerModel}회: ${leaders}. 5회 반복의 중간 결과와 한계를 공개했습니다.`;
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

function scoreRange(values) {
  if (values.length === 0) return "—";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${formatScore(min)}%` : `${formatScore(min)}–${formatScore(max)}%`;
}

function providerClass(provider) {
  return String(provider).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
