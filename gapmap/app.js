const TRANSITIONS = {
  elementaryToMiddle: {
    collection: "subjects",
    description: "중학교 과목별 공식 연계의 간극을 큰 점수부터 확인하세요.",
    itemKey: "subject",
    kicker: "ELEMENTARY → MIDDLE",
    title: "초등에서 중학교로",
  },
  middleToHigh: {
    collection: "courses",
    description: "고등학교 과목별 공식 연계의 간극을 큰 점수부터 확인하세요.",
    itemKey: "course",
    kicker: "MIDDLE → HIGH",
    title: "중학교에서 고등학교로",
  },
};

const numberFormat = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

const elements = {
  dashboard: document.querySelector("#dashboard"),
  detailClose: document.querySelector("#detailClose"),
  detailContent: document.querySelector("#detailContent"),
  detailPanel: document.querySelector("#detailPanel"),
  emptyResults: document.querySelector("#emptyResults"),
  errorMessage: document.querySelector("#errorMessage"),
  loadError: document.querySelector("#loadError"),
  resultStatus: document.querySelector("#resultStatus"),
  search: document.querySelector("#subjectSearch"),
  sectionDescription: document.querySelector("#sectionDescription"),
  sectionTitle: document.querySelector("#sectionTitle"),
  subjectGrid: document.querySelector("#subjectGrid"),
  tabs: [...document.querySelectorAll('[role="tab"]')],
  transitionKicker: document.querySelector("#transitionKicker"),
};

let activeTransition = "elementaryToMiddle";
let lastTrigger = null;
let report = null;
let selectedItem = null;

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function formatNumber(value, suffix = "") {
  return Number.isFinite(value) ? numberFormat.format(value) + suffix : "—";
}

function formatDelta(value) {
  if (!Number.isFinite(value)) return "—";
  return (value > 0 ? "+" : "") + numberFormat.format(value) + "%p";
}

function getItemName(item) {
  return item[TRANSITIONS[activeTransition].itemKey] || "이름 없음";
}

function getItems() {
  const config = TRANSITIONS[activeTransition];
  const items = report?.transitions?.[activeTransition]?.[config.collection];
  return Array.isArray(items) ? items : [];
}

function fieldEvidenceFor(item) {
  if (!item?.fieldEvidenceRef || !report?.fieldEvidence) return null;
  const label = item.subjectGroup ?? item.subject;
  return report.fieldEvidence.subjects.find((subject) => subject.subject === label) ?? null;
}

function normalizeSearch(value) {
  return value.normalize("NFKC").toLocaleLowerCase("ko-KR").trim();
}

function matchesSearch(item, query) {
  if (!query) return true;
  const standards = Array.isArray(item.newlyIntroduced) ? item.newlyIntroduced : [];
  const searchable = [
    getItemName(item),
    item.subjectGroup,
    item.elementaryCounterpart,
    ...standards.flatMap((standard) => [standard.code, standard.domain, standard.label]),
  ]
    .filter(Boolean)
    .join(" ");
  return normalizeSearch(searchable).includes(query);
}

function getVisibleItems() {
  const query = normalizeSearch(elements.search.value);
  return getItems()
    .filter((item) => matchesSearch(item, query))
    .sort((left, right) =>
      (Number.isFinite(right.gapScore) ? right.gapScore : -1) -
        (Number.isFinite(left.gapScore) ? left.gapScore : -1) ||
      getItemName(left).localeCompare(getItemName(right), "ko"),
    );
}

function scoreLevel(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function isNewSubject(item) {
  return activeTransition === "elementaryToMiddle" && item.elementaryCounterpart == null;
}

function createBadge(text, tone) {
  const badge = document.createElement("span");
  badge.className = "badge badge-" + tone;
  badge.textContent = text;
  return badge;
}

function appendBadges(parent, item) {
  if (item.structureSplit) parent.append(createBadge("구조 분화", "split"));
  if (item.miningDensityCaveat) parent.append(createBadge("연계 채굴 주의", "caveat"));
}

function createMetric(label, value, detail) {
  const metric = document.createElement("div");
  metric.className = "card-metric";
  appendTextElement(metric, "span", "metric-label", label);
  appendTextElement(metric, "strong", "metric-value", value);
  if (detail) appendTextElement(metric, "small", "metric-detail", detail);
  return metric;
}

const NAEA_TOOLTIP =
  "국가수준 학업성취도 평가(NAEA) 단면 표집조사(중3·고2 약 3%). 문서 갭의 검증이 아니라 대조 참고입니다.";

function createNaeaMini(field) {
  const year = report.fieldEvidence.latestExamYear;
  const wrap = document.createElement("div");
  wrap.className = "card-naea";
  wrap.title = NAEA_TOOLTIP;
  appendTextElement(wrap, "span", "card-naea-label", "NAEA 기초학력 미달률 · 단면 " + year);
  appendTextElement(
    wrap,
    "span",
    "card-naea-values",
    "중3 " + formatNumber(field.middle3[year], "%") + " · 고2 " + formatNumber(field.high2[year], "%"),
  );
  return wrap;
}

function createSubjectCard(item, rank) {
  const name = getItemName(item);
  const isNew = isNewSubject(item);
  const card = document.createElement("button");
  const density = item.densityJump || {};
  const newCount = Array.isArray(item.newlyIntroduced) ? item.newlyIntroduced.length : 0;
  const coverage = Math.min(Math.max(Number(item.coveragePct) || 0, 0), 100);

  card.type = "button";
  card.className = "subject-card " + (isNew ? "score-new" : "score-" + scoreLevel(item.gapScore));
  card.dataset.itemName = name;
  card.setAttribute("aria-controls", "detailPanel");
  card.setAttribute(
    "aria-label",
    isNew
      ? name + ", 초등 대응이 없는 신규 교과, 상세 보기"
      : name + ", 갭 스코어 " + formatNumber(item.gapScore) + "점, 상세 보기",
  );
  card.setAttribute("aria-pressed", String(selectedItem === item));
  if (selectedItem === item) {
    card.classList.add("is-selected");
    lastTrigger = card;
  }

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  const identity = document.createElement("div");
  appendTextElement(identity, "span", "card-rank", isNew ? "—" : String(rank).padStart(2, "0"));
  appendTextElement(identity, "h3", "card-title", name);
  appendTextElement(
    identity,
    "p",
    "card-context",
    activeTransition === "elementaryToMiddle"
      ? item.elementaryCounterpart
        ? "초등 " + item.elementaryCounterpart + " 연계"
        : "초등 대응 교과 없음"
      : item.subjectGroup || "교과군 정보 없음",
  );
  const score = document.createElement("div");
  score.className = isNew ? "card-score is-new" : "card-score";
  if (isNew) {
    appendTextElement(score, "span", "score-label", "구분");
    appendTextElement(score, "strong", "score-number", "신규");
  } else {
    appendTextElement(score, "span", "score-label", "GAP");
    appendTextElement(score, "strong", "score-number", formatNumber(item.gapScore));
    appendTextElement(score, "span", "score-total", "/100");
  }
  cardHeader.append(identity, score);

  const progressGroup = document.createElement("div");
  progressGroup.className = "coverage-group";
  const progressLabel = document.createElement("div");
  appendTextElement(progressLabel, "span", "", "공식 연계 커버리지");
  appendTextElement(progressLabel, "strong", "", formatNumber(item.coveragePct, "%"));
  const progress = document.createElement("progress");
  progress.max = 100;
  progress.value = coverage;
  progress.setAttribute("aria-label", "공식 연계 커버리지 " + formatNumber(item.coveragePct, "%"));
  progressGroup.append(progressLabel, progress);

  const metricGrid = document.createElement("div");
  metricGrid.className = "card-metrics";
  metricGrid.append(
    createMetric("신규 도입", formatNumber(newCount, "개"), "공식 미연계 후보"),
    createMetric(
      "밀도 점프",
      formatNumber(density.ratio, "×"),
      formatNumber(density.lowerPerYear) + " → " + formatNumber(density.upperPerYear) + " /년",
    ),
  );

  const field = fieldEvidenceFor(item);
  const badges = document.createElement("div");
  badges.className = "card-badges";
  if (isNew) badges.append(createBadge("신규 교과", "new"));
  appendBadges(badges, item);
  if (field) {
    const naeaBadge = createBadge("NAEA 단면 참고", "naea");
    naeaBadge.title = NAEA_TOOLTIP;
    badges.append(naeaBadge);
  }

  const cardFooter = document.createElement("div");
  cardFooter.className = "card-footer";
  appendTextElement(cardFooter, "span", "", "상세 근거 보기");
  appendTextElement(cardFooter, "span", "card-arrow", "↗").setAttribute("aria-hidden", "true");

  card.append(cardHeader, progressGroup, metricGrid, badges);
  if (field) card.append(createNaeaMini(field));
  card.append(cardFooter);
  card.addEventListener("click", () => selectItem(item, card));
  return card;
}

function updateCardSelection() {
  for (const card of elements.subjectGrid.querySelectorAll(".subject-card")) {
    const isSelected = selectedItem && card.dataset.itemName === getItemName(selectedItem);
    card.classList.toggle("is-selected", Boolean(isSelected));
    card.setAttribute("aria-pressed", String(Boolean(isSelected)));
  }
}

function createGroupHeader(title, note) {
  const header = document.createElement("div");
  header.className = "grid-group-header";
  appendTextElement(header, "h3", "grid-group-title", title);
  if (note) appendTextElement(header, "p", "grid-group-note", note);
  return header;
}

function buildGridNodes(items) {
  if (activeTransition !== "elementaryToMiddle") {
    return items.map((item, index) => createSubjectCard(item, index + 1));
  }
  const rankedItems = items.filter((item) => !isNewSubject(item));
  const newItems = items.filter((item) => isNewSubject(item));
  const nodes = rankedItems.map((item, index) => createSubjectCard(item, index + 1));
  if (newItems.length) {
    nodes.push(
      createGroupHeader(
        "중학교 신규 교과 (초등 대응 없음)",
        "대응하는 초등 교과가 없어 갭이 아니라 중학교에서 처음 시작하는 전면 신규 학습입니다.",
      ),
      ...newItems.map((item) => createSubjectCard(item, null)),
    );
  }
  return nodes;
}

function renderGrid() {
  const items = getVisibleItems();
  elements.subjectGrid.replaceChildren(...buildGridNodes(items));
  elements.emptyResults.hidden = items.length !== 0;
  elements.resultStatus.textContent = normalizeSearch(elements.search.value)
    ? "검색 결과 " + formatNumber(items.length) + "개 과목"
    : "갭 스코어 높은 순 · 전체 " + formatNumber(items.length) + "개 과목";

  if (selectedItem && !items.includes(selectedItem)) closeDetail(false);
}

function createDetailMetric(label, value, detail) {
  const metric = document.createElement("div");
  metric.className = "detail-metric";
  appendTextElement(metric, "span", "", label);
  appendTextElement(metric, "strong", "", value);
  if (detail) appendTextElement(metric, "small", "", detail);
  return metric;
}

function renderStandards(parent, item) {
  const standards = Array.isArray(item.newlyIntroduced) ? item.newlyIntroduced : [];
  const section = document.createElement("section");
  section.className = "detail-section";
  appendTextElement(section, "h3", "", "신규 도입 성취기준");
  appendTextElement(section, "p", "section-note", "공식 연계가 확인되지 않은 후보 " + formatNumber(standards.length) + "개");

  if (!standards.length) {
    appendTextElement(section, "p", "section-empty", "공식 미연계 신규 도입 후보가 없습니다.");
    parent.append(section);
    return;
  }

  const list = document.createElement("ul");
  list.className = "standard-list";
  for (const standard of standards) {
    const itemElement = document.createElement("li");
    const meta = document.createElement("div");
    appendTextElement(meta, "code", "standard-code", standard.code || "코드 없음");
    appendTextElement(meta, "span", "standard-domain", standard.domain || "영역 없음");
    appendTextElement(itemElement, "p", "standard-label", standard.label || "라벨 없음");
    itemElement.prepend(meta);
    list.append(itemElement);
  }
  section.append(list);
  parent.append(section);
}

function evidenceLinkText(evidence) {
  if (activeTransition === "elementaryToMiddle") {
    return "초 " + (evidence.elementaryGradeBand || "학년군 미상") + " → " + (evidence.middleCode || "중등 코드 없음");
  }
  return (evidence.middleCode || "중등 코드 없음") + " → " + (evidence.highCode || "고등 코드 없음");
}

function renderEvidence(parent, item) {
  const evidence = Array.isArray(item.linkedEvidence) ? item.linkedEvidence : [];
  const sample = evidence.slice(0, 8);
  const section = document.createElement("section");
  section.className = "detail-section evidence-section";
  appendTextElement(section, "h3", "", "연계 근거 표본");
  appendTextElement(
    section,
    "p",
    "section-note",
    sample.length
      ? "전체 " + formatNumber(evidence.length) + "건 중 앞선 " + formatNumber(sample.length) + "건"
      : "공식 문서에서 확인된 연계 근거가 없습니다.",
  );

  if (!sample.length) {
    appendTextElement(section, "p", "section-empty", "표시할 연계 근거 표본이 없습니다.");
    parent.append(section);
    return;
  }

  const tableWrap = document.createElement("div");
  tableWrap.className = "table-wrap";
  const table = document.createElement("table");
  appendTextElement(table, "caption", "sr-only", getItemName(item) + " 연계 근거 표본");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const heading of ["연계", "공식 문서 근거", "쪽번호"]) {
    appendTextElement(headRow, "th", "", heading).scope = "col";
  }
  head.append(headRow);

  const body = document.createElement("tbody");
  for (const record of sample) {
    const row = document.createElement("tr");
    const linkCell = appendTextElement(row, "td", "evidence-link", evidenceLinkText(record));
    const sourceLabel = activeTransition === "elementaryToMiddle" ? record.elementaryLabel : record.middleLabel;
    if (sourceLabel) appendTextElement(linkCell, "small", "", sourceLabel);
    appendTextElement(row, "td", "evidence-basis", record.basis || "근거 설명 없음");
    appendTextElement(row, "td", "evidence-page", Number.isFinite(record.page) ? "p. " + record.page : "—");
    body.append(row);
  }
  table.append(head, body);
  tableWrap.append(table);
  section.append(tableWrap);
  parent.append(section);
}

function renderFieldSourceLinks(parent, sourceUrls) {
  const wrap = document.createElement("p");
  wrap.className = "field-source";
  appendTextElement(wrap, "span", "", "출처: " + report.fieldEvidence.source.publisher + " · ");
  const years = Object.entries(sourceUrls);
  years.forEach(([year, urls], yearIndex) => {
    appendTextElement(wrap, "span", "", year + " ");
    urls.forEach((url, index) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "[" + (index + 1) + "]";
      wrap.append(link, document.createTextNode(" "));
    });
    if (yearIndex < years.length - 1) wrap.append(document.createTextNode("· "));
  });
  parent.append(wrap);
}

function renderFieldEvidence(parent, item) {
  const field = fieldEvidenceFor(item);
  if (!field) return;
  const fieldEvidence = report.fieldEvidence;
  const years = fieldEvidence.examYears;
  const section = document.createElement("section");
  section.className = "detail-section field-section";
  appendTextElement(section, "h3", "", "현장 성취도 대조 (NAEA)");
  appendTextElement(
    section,
    "p",
    "section-note",
    "중3·고2 약 3% 표집 단면조사 · 문서 갭의 검증이 아니라 대조 참고입니다.",
  );

  const tableWrap = document.createElement("div");
  tableWrap.className = "table-wrap";
  const table = document.createElement("table");
  table.className = "field-table";
  appendTextElement(table, "caption", "sr-only", field.subject + " NAEA 기초학력 미달률");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const heading of ["학교급", ...years.map((year) => year + " 미달률")]) {
    appendTextElement(headRow, "th", "", heading).scope = "col";
  }
  head.append(headRow);
  const body = document.createElement("tbody");
  for (const [label, key] of [["중3", "middle3"], ["고2", "high2"]]) {
    const row = document.createElement("tr");
    appendTextElement(row, "th", "", label).scope = "row";
    for (const year of years) appendTextElement(row, "td", "", formatNumber(field[key][year], "%"));
    body.append(row);
  }
  table.append(head, body);
  tableWrap.append(table);
  section.append(tableWrap);

  appendTextElement(
    section,
    "p",
    "field-note",
    "중3 대비 고2 단면 격차: " + years.map((year) => year + " " + formatDelta(field.crossSectionDelta[year])).join(" · "),
  );
  appendTextElement(
    section,
    "p",
    "field-note",
    "통계적 유의 항목: " +
      (field.signal.length ? field.signal.join("; ") : "공식 명시된 통계적 유의 변화 없음(표집오차 수준)"),
  );
  renderFieldSourceLinks(section, fieldEvidence.source.sourceUrls);
  parent.append(section);
}

function renderDetail(focusHeading = false) {
  if (!selectedItem) {
    const placeholder = document.createElement("div");
    placeholder.className = "detail-placeholder";
    appendTextElement(placeholder, "div", "placeholder-score", "?").setAttribute("aria-hidden", "true");
    appendTextElement(placeholder, "h2", "", "과목을 선택하세요");
    appendTextElement(
      placeholder,
      "p",
      "",
      "카드를 클릭하거나 키보드로 이동한 뒤 Enter를 누르면 신규 도입 성취기준과 연계 근거를 볼 수 있습니다.",
    );
    elements.detailContent.replaceChildren(placeholder);
    elements.detailClose.hidden = true;
    elements.detailPanel.classList.remove("has-selection");
    return;
  }

  const item = selectedItem;
  const name = getItemName(item);
  const fragment = document.createDocumentFragment();
  const header = document.createElement("div");
  header.className = "detail-header";
  appendTextElement(header, "p", "detail-kicker", TRANSITIONS[activeTransition].kicker);
  const title = appendTextElement(header, "h2", "", name);
  title.id = "detailTitle";
  title.tabIndex = -1;
  appendTextElement(
    header,
    "p",
    "detail-context",
    activeTransition === "elementaryToMiddle"
      ? item.elementaryCounterpart
        ? "초등 " + item.elementaryCounterpart + "에서 이어지는 중학교 과목"
        : "초등 대응 교과가 지정되지 않은 중학교 과목"
      : (item.subjectGroup || "교과군 미상") + " · 고등학교 과목",
  );
  const badgeRow = document.createElement("div");
  badgeRow.className = "detail-badges";
  appendBadges(badgeRow, item);
  header.append(badgeRow);

  const density = item.densityJump || {};
  const standards = item.standards || {};
  const metrics = document.createElement("div");
  metrics.className = "detail-metrics";
  metrics.append(
    createDetailMetric("갭 스코어", formatNumber(item.gapScore), "/ 100"),
    createDetailMetric("커버리지", formatNumber(item.coveragePct, "%"), formatNumber(standards.linked) + " / " + formatNumber(standards.total) + " 연계"),
    createDetailMetric("신규 도입", formatNumber(Array.isArray(item.newlyIntroduced) ? item.newlyIntroduced.length : 0, "개"), "공식 미연계 후보"),
    createDetailMetric("밀도 점프", formatNumber(density.ratio, "×"), formatNumber(density.lowerPerYear) + " → " + formatNumber(density.upperPerYear) + " /년"),
  );

  fragment.append(header, metrics);
  if (item.miningDensityCaveat) {
    appendTextElement(
      fragment,
      "p",
      "detail-caveat",
      "주의: 원천 문서의 내용 체계 표기 방식 차이로 연계가 과소 집계되었을 수 있습니다. 이 주의 플래그는 갭 스코어 계산에 포함되지 않습니다.",
    );
  }
  renderFieldEvidence(fragment, item);
  renderStandards(fragment, item);
  renderEvidence(fragment, item);
  elements.detailContent.replaceChildren(fragment);
  elements.detailClose.hidden = false;
  elements.detailPanel.classList.add("has-selection");

  if (focusHeading) {
    requestAnimationFrame(() => {
      title.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches) {
        elements.detailPanel.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  }
}

function selectItem(item, trigger) {
  selectedItem = item;
  lastTrigger = trigger;
  updateCardSelection();
  renderDetail(true);
}

function closeDetail(restoreFocus = true) {
  const trigger = lastTrigger;
  selectedItem = null;
  lastTrigger = null;
  updateCardSelection();
  renderDetail();
  if (restoreFocus && trigger?.isConnected) trigger.focus();
}

function activateTransition(key, focusTab = false) {
  if (!TRANSITIONS[key]) return;
  activeTransition = key;
  selectedItem = null;
  lastTrigger = null;
  const config = TRANSITIONS[key];
  elements.transitionKicker.textContent = config.kicker;
  elements.sectionTitle.textContent = config.title;
  elements.sectionDescription.textContent = config.description;

  for (const tab of elements.tabs) {
    const isActive = tab.dataset.transition === key;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && focusTab) tab.focus();
  }
  renderGrid();
  renderDetail();
}

function handleTabKeydown(event, index) {
  let targetIndex = null;
  if (event.key === "ArrowRight") targetIndex = (index + 1) % elements.tabs.length;
  if (event.key === "ArrowLeft") targetIndex = (index - 1 + elements.tabs.length) % elements.tabs.length;
  if (event.key === "Home") targetIndex = 0;
  if (event.key === "End") targetIndex = elements.tabs.length - 1;
  if (targetIndex === null) return;
  event.preventDefault();
  activateTransition(elements.tabs[targetIndex].dataset.transition, true);
}

async function loadReport() {
  try {
    const response = await fetch("./data/gap-report.json", { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (!data?.transitions?.elementaryToMiddle || !data?.transitions?.middleToHigh) {
      throw new Error("전환 구간 데이터가 없습니다.");
    }
    report = data;
    for (const tab of elements.tabs) tab.disabled = false;
    elements.search.disabled = false;
    elements.dashboard.setAttribute("aria-busy", "false");
    activateTransition(activeTransition);
  } catch (error) {
    elements.dashboard.setAttribute("aria-busy", "false");
    elements.loadError.hidden = false;
    elements.errorMessage.textContent = error instanceof Error ? error.message : "알 수 없는 오류";
    elements.resultStatus.textContent = "데이터 로드 실패";
  }
}

for (const [index, tab] of elements.tabs.entries()) {
  tab.addEventListener("click", () => activateTransition(tab.dataset.transition));
  tab.addEventListener("keydown", (event) => handleTabKeydown(event, index));
}

elements.search.addEventListener("input", renderGrid);
elements.detailClose.addEventListener("click", () => closeDetail());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && selectedItem) closeDetail();
});

loadReport();
