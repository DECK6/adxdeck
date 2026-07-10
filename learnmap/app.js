const DATA_URL = "./data/learnmap.json";

const EXPECTED_COUNTS = Object.freeze({
  nodes: 1956,
  edges: 1894,
  clusters: 153,
  standards: 620,
});

const TAU = Math.PI * 2;
const MIN_SCALE = 0.18;
const MAX_SCALE = 5;
const SEARCH_LIMIT = 10;
const HIT_RADIUS = 11;
const SUBJECT_FALLBACK = "#67625C";
const RED = "#E63329";
const CHARCOAL = "#1D1D1B";
const CREAM = "#F4F1EA";

const byId = (id) => document.getElementById(id);

const els = {
  app: byId("app"),
  metricNodes: byId("metric-nodes"),
  metricEdges: byId("metric-edges"),
  metricStandards: byId("metric-standards"),
  fitView: byId("fit-view"),
  openGuide: byId("open-guide"),
  topicSearch: byId("topic-search"),
  clearSearch: byId("clear-search"),
  searchResults: byId("search-results"),
  toggleSubjects: byId("toggle-subjects"),
  subjectFilters: byId("subject-filters"),
  toggleGrades: byId("toggle-grades"),
  gradeFilters: byId("grade-filters"),
  dataStatus: byId("data-status"),
  canvas: byId("graph-canvas"),
  zoomIn: byId("zoom-in"),
  zoomLevel: byId("zoom-level"),
  zoomOut: byId("zoom-out"),
  visibleNodes: byId("visible-nodes"),
  loadingPanel: byId("loading-panel"),
  emptyState: byId("empty-state"),
  hoverCard: byId("hover-card"),
  hoverMeta: byId("hover-meta"),
  hoverTitle: byId("hover-title"),
  inspector: byId("inspector"),
  selectedIndex: byId("selected-index"),
  closeInspector: byId("close-inspector"),
  selectedSubject: byId("selected-subject"),
  selectedGrade: byId("selected-grade"),
  selectedCode: byId("selected-code"),
  selectedTitle: byId("selected-title"),
  selectedDescription: byId("selected-description"),
  selectedEvidence: byId("selected-evidence"),
  selectedQuestion: byId("selected-question"),
  prerequisiteCount: byId("prerequisite-count"),
  prerequisiteList: byId("prerequisite-list"),
  unlockCount: byId("unlock-count"),
  unlockList: byId("unlock-list"),
  selectedCluster: byId("selected-cluster"),
  selectedClusterSummary: byId("selected-cluster-summary"),
  guideDialog: byId("guide-dialog"),
  closeGuide: byId("close-guide"),
  confirmGuide: byId("confirm-guide"),
};

const ctx = els.canvas?.getContext("2d", { alpha: true });
const graphPanel = els.canvas?.closest(".graph-panel") ?? null;
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const state = {
  data: null,
  subjects: [],
  grades: [],
  nodes: [],
  edges: [],
  clusters: new Map(),
  standards: new Map(),
  nodeById: new Map(),
  nodeIndex: new Map(),
  incoming: new Map(),
  outgoing: new Map(),
  activeSubjects: new Set(),
  activeGrades: new Set(),
  visibleNodes: [],
  visibleEdges: [],
  visibleNodeIds: new Set(),
  selectedId: null,
  hoveredId: null,
  lastPointer: null,
  query: "",
  searchMatches: [],
  view: {
    x: 0,
    y: 0,
    scale: 1,
    userChanged: false,
  },
  size: {
    width: 1,
    height: 1,
    dpr: 1,
  },
  pointers: new Map(),
  drag: null,
  pinch: null,
  renderQueued: false,
  ready: false,
};

init().catch((error) => {
  showError(error);
});

async function init() {
  if (!els.app || !els.canvas || !ctx) {
    throw new Error("필수 DOM 요소를 찾을 수 없습니다.");
  }

  setLoading("데이터를 불러오는 중", "1,956개의 주제와 1,894개의 연결을 확인하는 중");
  wireStaticEvents();
  resizeCanvas();

  const response = await fetch(DATA_URL, { method: "GET" });
  if (!response.ok) {
    throw new Error(`learnmap.json 요청 실패 (${response.status})`);
  }

  const data = await response.json();
  validatePayload(data);
  prepareData(data);
  buildCoordinates();
  renderFilters();
  updateVisibleGraph();
  updateMetrics();
  setReady();
  fitView({ markUser: false });
  state.ready = true;
  requestRender();
}

function validatePayload(data) {
  if (!data || typeof data !== "object") {
    throw new Error("데이터 형식이 올바르지 않습니다.");
  }

  const counts = data.meta?.counts;
  assertCount(counts?.nodes, EXPECTED_COUNTS.nodes, "nodes");
  assertCount(counts?.edges, EXPECTED_COUNTS.edges, "edges");
  assertCount(counts?.clusters, EXPECTED_COUNTS.clusters, "clusters");
  assertCount(counts?.standards, EXPECTED_COUNTS.standards, "standards");

  assertCount(data.nodes?.length, EXPECTED_COUNTS.nodes, "nodes length");
  assertCount(data.edges?.length, EXPECTED_COUNTS.edges, "edges length");
  assertCount(data.clusters?.length, EXPECTED_COUNTS.clusters, "clusters length");
  assertCount(data.standards?.length, EXPECTED_COUNTS.standards, "standards length");
}

function assertCount(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} count mismatch: expected ${expected}, received ${actual ?? "missing"}`);
  }
}

function prepareData(data) {
  state.data = data;
  state.subjects = deriveSubjects(data);
  state.grades = deriveGrades(data);
  state.nodes = data.nodes.map((node, index) => ({
    ...node,
    _index: index,
    _search: normalize(`${node.title ?? ""} ${node.code ?? ""}`),
    _color: subjectColor(node.subject),
    x: 0,
    y: 0,
  }));
  state.edges = [];
  state.clusters = new Map(data.clusters.map((cluster) => [cluster.id, cluster]));
  state.standards = new Map(data.standards.map((standard) => [standard.id, standard]));
  state.nodeById = new Map(state.nodes.map((node) => [node.id, node]));
  state.nodeIndex = new Map(state.nodes.map((node, index) => [node.id, index]));
  state.incoming = new Map(state.nodes.map((node) => [node.id, []]));
  state.outgoing = new Map(state.nodes.map((node) => [node.id, []]));

  for (const edge of data.edges) {
    const from = state.nodeById.get(edge.from);
    const to = state.nodeById.get(edge.to);
    if (!from || !to) {
      continue;
    }
    const prepared = { ...edge, fromNode: from, toNode: to };
    state.edges.push(prepared);
    state.outgoing.get(from.id)?.push(prepared);
    state.incoming.get(to.id)?.push(prepared);
  }

  state.activeSubjects = new Set(state.subjects.map((subject) => subject.id));
  state.activeGrades = new Set(state.grades.map((grade) => grade.id));
}

function deriveSubjects(data) {
  const fromPayload = Array.isArray(data.subjects) ? data.subjects : [];
  if (fromPayload.length) {
    return fromPayload.map((subject) => ({
      id: String(subject.id),
      label: subject.label ?? subject.id,
      color: subject.color ?? SUBJECT_FALLBACK,
      count: Number(subject.count ?? 0),
    }));
  }

  const counts = new Map();
  for (const node of data.nodes ?? []) {
    const id = node.subject ?? "Unknown";
    const current = counts.get(id) ?? { id, label: node.subjectLabel ?? id, color: SUBJECT_FALLBACK, count: 0 };
    current.count += 1;
    counts.set(id, current);
  }
  return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, "ko"));
}

function deriveGrades(data) {
  const fromPayload = Array.isArray(data.grades) ? data.grades : [];
  if (fromPayload.length) {
    return fromPayload.map((grade) => ({
      id: String(grade.id),
      label: grade.label ?? `${grade.id}학년`,
      count: Number(grade.count ?? 0),
    }));
  }

  const counts = new Map();
  for (const node of data.nodes ?? []) {
    const id = node.grade ?? "기타";
    const current = counts.get(id) ?? { id, label: `${id}학년`, count: 0 };
    current.count += 1;
    counts.set(id, current);
  }
  return [...counts.values()].sort((a, b) => gradeSortValue(a.id) - gradeSortValue(b.id));
}

function buildCoordinates() {
  const subjectOrder = new Map(state.subjects.map((subject, index) => [subject.id, index]));
  const gradeOrder = new Map(state.grades.map((grade, index) => [grade.id, index]));
  const sectorWidth = TAU / Math.max(1, state.subjects.length);
  const sectorPadding = sectorWidth * 0.08;
  const ringStep = 245;
  const ringWidth = 170;
  const innerRadius = 190;
  const buckets = new Map();

  for (const node of state.nodes) {
    const subjectIndex = subjectOrder.get(node.subject) ?? 0;
    const gradeIndex = gradeOrder.get(node.grade) ?? 0;
    const key = `${subjectIndex}:${gradeIndex}`;
    const bucket = buckets.get(key) ?? [];
    bucket.push(node);
    buckets.set(key, bucket);
  }

  for (const [key, bucket] of buckets) {
    const [subjectIndexText, gradeIndexText] = key.split(":");
    const subjectIndex = Number(subjectIndexText);
    const gradeIndex = Number(gradeIndexText);
    const sectorStart = -Math.PI / 2 + subjectIndex * sectorWidth + sectorPadding;
    const usableSector = Math.max(0.02, sectorWidth - sectorPadding * 2);
    const ringCenter = innerRadius + gradeIndex * ringStep;
    const sorted = bucket.sort(compareNodesForLayout);
    const laneCount = Math.max(3, Math.ceil(Math.sqrt(sorted.length / 2)));
    const angleSlots = Math.max(1, Math.ceil(sorted.length / laneCount));

    sorted.forEach((node, index) => {
      const lane = index % laneCount;
      const slot = Math.floor(index / laneCount);
      const jitterA = stableUnit(`${node.id}:angle`) - 0.5;
      const jitterR = stableUnit(`${node.id}:radius`) - 0.5;
      const slotWidth = usableSector / angleSlots;
      const angle = sectorStart + slotWidth * (slot + 0.5) + jitterA * slotWidth * 0.42;
      const laneOffset = ((lane + 0.5) / laneCount - 0.5) * ringWidth;
      const radius = ringCenter + laneOffset + jitterR * 26;
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
    });
  }
}

function compareNodesForLayout(a, b) {
  const clusterA = Array.isArray(a.clusters) ? a.clusters[0] ?? "" : "";
  const clusterB = Array.isArray(b.clusters) ? b.clusters[0] ?? "" : "";
  return (
    clusterA.localeCompare(clusterB) ||
    String(a.domainLabel ?? a.domain ?? "").localeCompare(String(b.domainLabel ?? b.domain ?? ""), "ko") ||
    String(a.code ?? "").localeCompare(String(b.code ?? "")) ||
    String(a.type ?? "").localeCompare(String(b.type ?? "")) ||
    String(a.id).localeCompare(String(b.id))
  );
}

function stableUnit(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function renderFilters() {
  els.subjectFilters.replaceChildren(
    ...state.subjects.map((subject) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.style.setProperty("--chip-color", subject.color);
      button.setAttribute("aria-pressed", String(state.activeSubjects.has(subject.id)));
      button.dataset.subjectId = subject.id;
      button.append(
        element("span", "filter-chip-dot", ""),
        element("span", "filter-chip-name", subject.label),
        element("span", "filter-chip-count", formatNumber(subject.count)),
      );
      button.addEventListener("click", () => {
        toggleSetValue(state.activeSubjects, subject.id);
        onFiltersChanged();
      });
      return button;
    }),
  );

  els.gradeFilters.replaceChildren(
    ...state.grades.map((grade) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.setAttribute("aria-pressed", String(state.activeGrades.has(grade.id)));
      button.dataset.gradeId = grade.id;
      button.append(
        element("span", "filter-chip-dot", ""),
        element("span", "filter-chip-name", grade.label),
        element("span", "filter-chip-count", formatNumber(grade.count)),
      );
      button.addEventListener("click", () => {
        toggleSetValue(state.activeGrades, grade.id);
        onFiltersChanged();
      });
      return button;
    }),
  );

  updateToggleButtons();
}

function toggleSetValue(set, value) {
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
}

function onFiltersChanged() {
  syncFilterButtons();
  updateVisibleGraph();
  updateSearchResults();
  updateHover(null);
  requestRender();
}

function syncFilterButtons() {
  for (const button of els.subjectFilters.querySelectorAll("[data-subject-id]")) {
    button.setAttribute("aria-pressed", String(state.activeSubjects.has(button.dataset.subjectId)));
  }
  for (const button of els.gradeFilters.querySelectorAll("[data-grade-id]")) {
    button.setAttribute("aria-pressed", String(state.activeGrades.has(button.dataset.gradeId)));
  }
  updateToggleButtons();
}

function updateToggleButtons() {
  els.toggleSubjects.textContent = state.activeSubjects.size === state.subjects.length ? "모두 끄기" : "모두 켜기";
  els.toggleGrades.textContent = state.activeGrades.size === state.grades.length ? "모두 끄기" : "모두 켜기";
}

function updateVisibleGraph() {
  state.visibleNodes = state.nodes.filter((node) => isNodeFilterVisible(node));
  state.visibleNodeIds = new Set(state.visibleNodes.map((node) => node.id));
  state.visibleEdges = state.edges.filter((edge) => state.visibleNodeIds.has(edge.from) && state.visibleNodeIds.has(edge.to));
  els.visibleNodes.textContent = formatNumber(state.visibleNodes.length);
  els.emptyState.hidden = state.visibleNodes.length > 0;

  if (state.visibleNodes.length === 0) {
    setStatus(`필터 결과 없음 · 전체 ${formatNumber(EXPECTED_COUNTS.nodes)} 주제`);
  } else {
    setStatus(`데이터 준비 완료 · ${formatNumber(state.visibleNodes.length)} / ${formatNumber(EXPECTED_COUNTS.nodes)} 주제 표시`);
  }
}

function isNodeFilterVisible(node) {
  return state.activeSubjects.has(node.subject) && state.activeGrades.has(node.grade);
}

function updateMetrics() {
  els.metricNodes.textContent = formatNumber(EXPECTED_COUNTS.nodes);
  els.metricEdges.textContent = formatNumber(EXPECTED_COUNTS.edges);
  els.metricStandards.textContent = formatNumber(EXPECTED_COUNTS.standards);
}

function wireStaticEvents() {
  els.fitView?.addEventListener("click", () => fitView({ markUser: true }));
  els.zoomIn?.addEventListener("click", () => zoomAtCenter(1.22));
  els.zoomOut?.addEventListener("click", () => zoomAtCenter(1 / 1.22));
  els.toggleSubjects?.addEventListener("click", () => {
    state.activeSubjects = state.activeSubjects.size === state.subjects.length
      ? new Set()
      : new Set(state.subjects.map((subject) => subject.id));
    onFiltersChanged();
  });
  els.toggleGrades?.addEventListener("click", () => {
    state.activeGrades = state.activeGrades.size === state.grades.length
      ? new Set()
      : new Set(state.grades.map((grade) => grade.id));
    onFiltersChanged();
  });

  els.topicSearch?.addEventListener("input", () => {
    state.query = els.topicSearch.value;
    updateSearchResults();
  });
  els.topicSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && state.searchMatches[0]) {
      event.preventDefault();
      selectNode(state.searchMatches[0], { center: true, focusCanvas: true });
    }
  });
  els.clearSearch?.addEventListener("click", () => {
    els.topicSearch.value = "";
    state.query = "";
    updateSearchResults();
    els.topicSearch.focus();
  });

  els.closeInspector?.addEventListener("click", closeInspector);
  els.openGuide?.addEventListener("click", openGuide);
  els.closeGuide?.addEventListener("click", closeGuide);
  els.confirmGuide?.addEventListener("click", closeGuide);

  els.canvas.addEventListener("pointerdown", onPointerDown);
  els.canvas.addEventListener("pointermove", onPointerMove);
  els.canvas.addEventListener("pointerup", onPointerUp);
  els.canvas.addEventListener("pointercancel", onPointerCancel);
  els.canvas.addEventListener("pointerleave", onPointerLeave);
  els.canvas.addEventListener("wheel", onWheel, { passive: false });
  els.canvas.addEventListener("keydown", onCanvasKeyDown);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    if (isDialogOpen()) {
      closeGuide();
    } else if (state.selectedId) {
      closeInspector();
    }
  });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      const previous = { ...state.size };
      resizeCanvas();
      if (state.ready && !state.view.userChanged && (previous.width !== state.size.width || previous.height !== state.size.height)) {
        fitView({ markUser: false });
      }
    });
    observer.observe(els.canvas);
  } else {
    window.addEventListener("resize", () => {
      resizeCanvas();
      if (state.ready && !state.view.userChanged) {
        fitView({ markUser: false });
      }
    });
  }
}

function onPointerDown(event) {
  if (!state.ready) {
    return;
  }
  els.canvas.setPointerCapture?.(event.pointerId);
  const point = canvasPoint(event);
  state.pointers.set(event.pointerId, point);
  state.lastPointer = point;

  if (state.pointers.size === 1) {
    state.drag = {
      id: event.pointerId,
      start: point,
      last: point,
      moved: false,
    };
    state.pinch = null;
    els.canvas.classList.add("is-dragging");
  } else if (state.pointers.size === 2) {
    state.drag = null;
    state.pinch = makePinchState();
  }
}

function onPointerMove(event) {
  const point = canvasPoint(event);
  state.lastPointer = point;

  if (!state.ready) {
    return;
  }

  if (state.pointers.has(event.pointerId)) {
    state.pointers.set(event.pointerId, point);
  }

  if (state.pointers.size >= 2 && state.pinch) {
    updatePinch();
    updateHover(null);
    return;
  }

  if (state.drag && state.drag.id === event.pointerId) {
    const dx = point.x - state.drag.last.x;
    const dy = point.y - state.drag.last.y;
    const total = distance(point, state.drag.start);
    state.drag.last = point;

    if (total > 3) {
      state.drag.moved = true;
      state.view.x += dx;
      state.view.y += dy;
      state.view.userChanged = true;
      updateZoomLabel();
      updateHover(null);
      requestRender();
      return;
    }
  }

  updateHover(point);
}

function onPointerUp(event) {
  const point = canvasPoint(event);
  const wasDrag = state.drag?.id === event.pointerId ? state.drag : null;
  state.pointers.delete(event.pointerId);
  els.canvas.releasePointerCapture?.(event.pointerId);
  els.canvas.classList.remove("is-dragging");

  if (state.pointers.size === 2) {
    state.pinch = makePinchState();
  } else {
    state.pinch = null;
  }

  if (wasDrag && !wasDrag.moved) {
    const node = hitTest(point);
    if (node) {
      selectNode(node, { center: false, focusCanvas: true });
    }
  }
  state.drag = null;
  updateHover(point);
}

function onPointerCancel(event) {
  state.pointers.delete(event.pointerId);
  state.drag = null;
  state.pinch = state.pointers.size === 2 ? makePinchState() : null;
  els.canvas.classList.remove("is-dragging");
  updateHover(null);
}

function onPointerLeave() {
  if (state.pointers.size === 0) {
    updateHover(null);
  }
}

function onWheel(event) {
  if (!state.ready) {
    return;
  }
  event.preventDefault();
  const point = canvasPoint(event);
  const factor = Math.exp(-event.deltaY * 0.001);
  zoomAt(point, state.view.scale * factor, { markUser: true });
}

function onCanvasKeyDown(event) {
  if (event.key === "Enter") {
    const node = state.hoveredId ? state.nodeById.get(state.hoveredId) : null;
    if (node) {
      event.preventDefault();
      selectNode(node, { center: false });
    }
  }
}

function makePinchState() {
  const points = [...state.pointers.values()];
  if (points.length < 2) {
    return null;
  }
  const center = midpoint(points[0], points[1]);
  return {
    distance: Math.max(1, distance(points[0], points[1])),
    world: screenToWorld(center),
    scale: state.view.scale,
  };
}

function updatePinch() {
  const points = [...state.pointers.values()];
  if (points.length < 2 || !state.pinch) {
    return;
  }
  const center = midpoint(points[0], points[1]);
  const nextScale = state.pinch.scale * (distance(points[0], points[1]) / state.pinch.distance);
  const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
  state.view.scale = scale;
  state.view.x = center.x - state.pinch.world.x * scale;
  state.view.y = center.y - state.pinch.world.y * scale;
  state.view.userChanged = true;
  updateZoomLabel();
  requestRender();
}

function zoomAtCenter(factor) {
  const point = { x: state.size.width / 2, y: state.size.height / 2 };
  zoomAt(point, state.view.scale * factor, { markUser: true });
}

function zoomAt(point, nextScale, options = {}) {
  const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
  const world = screenToWorld(point);
  state.view.scale = scale;
  state.view.x = point.x - world.x * scale;
  state.view.y = point.y - world.y * scale;
  state.view.userChanged = Boolean(options.markUser);
  updateZoomLabel();
  updateHover(state.lastPointer);
  requestRender();
}

function fitView(options = {}) {
  const nodes = state.visibleNodes.length ? state.visibleNodes : state.nodes;
  if (!nodes.length) {
    return;
  }

  const bounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      maxX: Math.max(acc.maxX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxY: Math.max(acc.maxY, node.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
  const padding = reducedMotion ? 44 : 58;
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const usableWidth = Math.max(1, state.size.width - padding * 2);
  const usableHeight = Math.max(1, state.size.height - padding * 2);
  const scale = clamp(Math.min(usableWidth / width, usableHeight / height), MIN_SCALE, MAX_SCALE);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  state.view.scale = scale;
  state.view.x = state.size.width / 2 - centerX * scale;
  state.view.y = state.size.height / 2 - centerY * scale;
  state.view.userChanged = Boolean(options.markUser);
  updateZoomLabel();
  updateHover(null);
  requestRender();
}

function updateSearchResults() {
  const query = normalize(state.query);
  if (!query) {
    state.searchMatches = [];
    els.searchResults.replaceChildren();
    return;
  }

  const terms = query.split(/\s+/).filter(Boolean);
  state.searchMatches = state.nodes
    .filter((node) => terms.every((term) => node._search.includes(term)))
    .sort((a, b) => scoreSearch(b, terms) - scoreSearch(a, terms) || a.title.localeCompare(b.title, "ko"))
    .slice(0, SEARCH_LIMIT);

  els.searchResults.replaceChildren(
    ...state.searchMatches.map((node) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-current", String(node.id === state.selectedId));
      button.append(
        element("strong", "", node.title ?? "제목 없음"),
        element("span", "", node.code ?? node.grade ?? ""),
        element("small", "", metaLine(node)),
      );
      button.addEventListener("click", () => selectNode(node, { center: true, focusCanvas: true }));
      item.append(button);
      return item;
    }),
  );
}

function scoreSearch(node, terms) {
  const title = normalize(node.title ?? "");
  const code = normalize(node.code ?? "");
  let score = 0;
  for (const term of terms) {
    if (code === term) {
      score += 80;
    } else if (code.includes(term)) {
      score += 40;
    }
    if (title.startsWith(term)) {
      score += 18;
    } else if (title.includes(term)) {
      score += 8;
    }
  }
  return score;
}

function selectNode(nodeOrId, options = {}) {
  const node = typeof nodeOrId === "string" ? state.nodeById.get(nodeOrId) : nodeOrId;
  if (!node) {
    return;
  }

  state.selectedId = node.id;
  els.app.classList.add("inspector-open");
  els.inspector.setAttribute("aria-hidden", "false");
  fillInspector(node);
  updateSearchResults();

  if (options.center && isNodeFilterVisible(node)) {
    centerNode(node);
  }
  if (options.focusCanvas) {
    els.canvas.focus({ preventScroll: true });
  }
  requestRender();
}

function fillInspector(node) {
  const subject = state.subjects.find((item) => item.id === node.subject);
  const grade = state.grades.find((item) => item.id === node.grade);
  const cluster = firstClusterFor(node);
  const incoming = state.incoming.get(node.id) ?? [];
  const outgoing = state.outgoing.get(node.id) ?? [];

  els.selectedIndex.textContent = `NODE / ${formatNumber((state.nodeIndex.get(node.id) ?? 0) + 1)}`;
  els.selectedSubject.textContent = node.subjectLabel ?? subject?.label ?? node.subject ?? "과목";
  els.selectedSubject.style.setProperty("--chip-color", subject?.color ?? node._color ?? SUBJECT_FALLBACK);
  els.selectedGrade.textContent = grade?.label ?? node.grade ?? "학년군";
  els.selectedCode.textContent = node.code ?? node.standard ?? "";
  els.selectedTitle.textContent = node.title ?? "제목 없음";
  els.selectedDescription.textContent = node.description ?? "설명 정보가 아직 없습니다.";
  els.selectedQuestion.textContent = node.assessmentPrompt ?? "아이의 설명과 수행 과정을 함께 확인해 보세요.";
  els.selectedCluster.textContent = cluster?.title ?? "연결된 배움 묶음 없음";
  els.selectedClusterSummary.textContent = cluster?.parentSummary ?? cluster?.summary ?? "이 주제와 연결된 묶음 설명이 아직 없습니다.";

  const evidence = Array.isArray(node.evidence) && node.evidence.length
    ? node.evidence
    : ["관찰 가능한 증거가 아직 없습니다."];
  els.selectedEvidence.replaceChildren(...evidence.map((text) => element("li", "", text)));

  els.prerequisiteCount.textContent = String(incoming.length);
  els.unlockCount.textContent = String(outgoing.length);
  fillRelatedList(els.prerequisiteList, incoming.map((edge) => edge.fromNode), "먼저 배우는 주제가 없습니다.");
  fillRelatedList(els.unlockList, outgoing.map((edge) => edge.toNode), "다음에 열리는 주제가 없습니다.");
}

function firstClusterFor(node) {
  const clusterId = Array.isArray(node.clusters) ? node.clusters[0] : null;
  return clusterId ? state.clusters.get(clusterId) : null;
}

function fillRelatedList(container, nodes, emptyText) {
  if (!nodes.length) {
    container.replaceChildren(element("div", "related-empty", emptyText));
    return;
  }

  container.replaceChildren(
    ...nodes.map((node) => {
      const button = document.createElement("button");
      button.type = "button";
      button.append(
        element("strong", "", node.title ?? "제목 없음"),
        element("span", "", node.code ?? ""),
        element("small", "", metaLine(node)),
      );
      button.addEventListener("click", () => selectNode(node, { center: true, focusCanvas: true }));
      return button;
    }),
  );
}

function closeInspector() {
  state.selectedId = null;
  els.app.classList.remove("inspector-open");
  els.inspector.setAttribute("aria-hidden", "true");
  updateSearchResults();
  requestRender();
}

function centerNode(node) {
  state.view.x = state.size.width / 2 - node.x * state.view.scale;
  state.view.y = state.size.height / 2 - node.y * state.view.scale;
  state.view.userChanged = true;
  updateZoomLabel();
}

function openGuide() {
  if (typeof els.guideDialog.showModal === "function") {
    els.guideDialog.showModal();
  } else {
    els.guideDialog.setAttribute("open", "");
  }
}

function closeGuide() {
  if (typeof els.guideDialog.close === "function" && isDialogOpen()) {
    els.guideDialog.close();
  } else {
    els.guideDialog.removeAttribute("open");
  }
  els.openGuide?.focus({ preventScroll: true });
}

function isDialogOpen() {
  return Boolean(els.guideDialog?.open);
}

function resizeCanvas() {
  if (!els.canvas) {
    return;
  }
  const rect = els.canvas.getBoundingClientRect();
  const dpr = clamp(window.devicePixelRatio || 1, 1, 3);
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  state.size = {
    width: Math.max(1, rect.width),
    height: Math.max(1, rect.height),
    dpr,
  };

  if (els.canvas.width !== width || els.canvas.height !== height) {
    els.canvas.width = width;
    els.canvas.height = height;
  }
  requestRender();
}

function requestRender() {
  if (state.renderQueued || !ctx) {
    return;
  }
  state.renderQueued = true;
  requestAnimationFrame(render);
}

function render() {
  state.renderQueued = false;
  const { width, height, dpr } = state.size;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, width, height);

  drawMapGuides(width, height);
  if (!state.ready) {
    updateZoomLabel();
    return;
  }

  drawEdges();
  drawHighlightedEdges();
  drawNodes();
  updateZoomLabel();
}

function drawMapGuides(width, height) {
  const center = worldToScreen({ x: 0, y: 0 });
  ctx.save();
  ctx.strokeStyle = "rgba(29, 29, 27, 0.10)";
  ctx.lineWidth = 1;
  for (let index = 0; index < state.grades.length; index += 1) {
    const radius = (190 + index * 245) * state.view.scale;
    if (radius < 12 || radius > Math.max(width, height) * 1.8) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, TAU);
    ctx.stroke();
  }

  if (state.subjects.length) {
    const outerRadius = (190 + (state.grades.length - 1) * 245 + 120) * state.view.scale;
    ctx.strokeStyle = "rgba(29, 29, 27, 0.06)";
    for (let index = 0; index < state.subjects.length; index += 1) {
      const angle = -Math.PI / 2 + index * (TAU / state.subjects.length);
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + Math.cos(angle) * outerRadius, center.y + Math.sin(angle) * outerRadius);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawEdges() {
  ctx.save();
  ctx.strokeStyle = "rgba(29, 29, 27, 0.105)";
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  for (const edge of state.visibleEdges) {
    const from = worldToScreen(edge.fromNode);
    const to = worldToScreen(edge.toNode);
    if (!lineNearViewport(from, to)) {
      continue;
    }
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHighlightedEdges() {
  if (!state.selectedId) {
    return;
  }
  const incoming = state.incoming.get(state.selectedId) ?? [];
  const outgoing = state.outgoing.get(state.selectedId) ?? [];
  drawEdgeSet(incoming, CHARCOAL, 2.4);
  drawEdgeSet(outgoing, RED, 2.4);
}

function drawEdgeSet(edges, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (const edge of edges) {
    if (!state.visibleNodeIds.has(edge.from) || !state.visibleNodeIds.has(edge.to)) {
      continue;
    }
    const from = worldToScreen(edge.fromNode);
    const to = worldToScreen(edge.toNode);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawNodes() {
  ctx.save();
  for (const node of state.visibleNodes) {
    const point = worldToScreen(node);
    if (!pointNearViewport(point, 20)) {
      continue;
    }
    const isSelected = node.id === state.selectedId;
    const isHovered = node.id === state.hoveredId;
    const radius = isSelected ? 6.2 : isHovered ? 5.3 : 3.4;

    ctx.beginPath();
    ctx.fillStyle = node._color ?? SUBJECT_FALLBACK;
    ctx.globalAlpha = isSelected || isHovered ? 1 : 0.86;
    ctx.arc(point.x, point.y, radius, 0, TAU);
    ctx.fill();

    if (isSelected || isHovered) {
      ctx.globalAlpha = 1;
      ctx.lineWidth = isSelected ? 2 : 1.4;
      ctx.strokeStyle = isSelected ? CHARCOAL : RED;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function updateHover(point) {
  const node = point ? hitTest(point) : null;
  const nextId = node?.id ?? null;
  if (state.hoveredId !== nextId) {
    state.hoveredId = nextId;
    requestRender();
  }

  if (!node || !point) {
    els.hoverCard.hidden = true;
    return;
  }

  els.hoverMeta.textContent = `${node.code ?? "CODE / —"} · ${metaLine(node)}`;
  els.hoverTitle.textContent = node.title ?? "제목 없음";
  placeHoverCard(point);
  els.hoverCard.hidden = false;
}

function placeHoverCard(point) {
  if (!graphPanel) {
    return;
  }
  const cardWidth = Math.min(248, graphPanel.clientWidth - 24);
  const cardHeight = 72;
  const left = point.x + cardWidth + 22 > graphPanel.clientWidth ? point.x - cardWidth - 14 : point.x + 14;
  const top = point.y + cardHeight + 18 > graphPanel.clientHeight ? point.y - cardHeight - 10 : point.y + 10;
  els.hoverCard.style.left = `${clamp(left, 12, Math.max(12, graphPanel.clientWidth - cardWidth - 12))}px`;
  els.hoverCard.style.top = `${clamp(top, 12, Math.max(12, graphPanel.clientHeight - cardHeight - 12))}px`;
}

function hitTest(point) {
  let nearest = null;
  let nearestDistance = HIT_RADIUS * HIT_RADIUS;
  for (const node of state.visibleNodes) {
    const screen = worldToScreen(node);
    const dx = screen.x - point.x;
    const dy = screen.y - point.y;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared <= nearestDistance) {
      nearest = node;
      nearestDistance = distanceSquared;
    }
  }
  return nearest;
}

function worldToScreen(point) {
  return {
    x: point.x * state.view.scale + state.view.x,
    y: point.y * state.view.scale + state.view.y,
  };
}

function screenToWorld(point) {
  return {
    x: (point.x - state.view.x) / state.view.scale,
    y: (point.y - state.view.y) / state.view.scale,
  };
}

function canvasPoint(event) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function lineNearViewport(from, to) {
  const margin = 48;
  return !(
    Math.max(from.x, to.x) < -margin ||
    Math.min(from.x, to.x) > state.size.width + margin ||
    Math.max(from.y, to.y) < -margin ||
    Math.min(from.y, to.y) > state.size.height + margin
  );
}

function pointNearViewport(point, margin) {
  return (
    point.x >= -margin &&
    point.x <= state.size.width + margin &&
    point.y >= -margin &&
    point.y <= state.size.height + margin
  );
}

function setLoading(title, detail) {
  els.app.dataset.state = "loading";
  setStatus("데이터를 불러오는 중");
  const strong = els.loadingPanel?.querySelector("strong");
  const span = els.loadingPanel?.querySelector("div span");
  if (strong) {
    strong.textContent = title;
  }
  if (span) {
    span.textContent = detail;
  }
}

function setReady() {
  els.app.dataset.state = "ready";
  setStatus(`데이터 준비 완료 · ${formatNumber(EXPECTED_COUNTS.nodes)} 주제 / ${formatNumber(EXPECTED_COUNTS.edges)} 연결`);
}

function showError(error) {
  console.error(error);
  els.app.dataset.state = "error";
  setStatus(`데이터 오류 · ${error.message}`);
  els.visibleNodes.textContent = "0";
  els.emptyState.hidden = true;
  const strong = els.loadingPanel?.querySelector("strong");
  const span = els.loadingPanel?.querySelector("div span");
  if (strong) {
    strong.textContent = "데이터를 불러오지 못했습니다";
  }
  if (span) {
    span.textContent = error.message;
  }
  requestRender();
}

function setStatus(text) {
  els.dataStatus.textContent = text;
}

function updateZoomLabel() {
  if (els.zoomLevel) {
    els.zoomLevel.textContent = `${Math.round(state.view.scale * 100)}%`;
  }
}

function subjectColor(subjectId) {
  return state.subjects.find((subject) => subject.id === subjectId)?.color ?? SUBJECT_FALLBACK;
}

function metaLine(node) {
  const subject = node.subjectLabel ?? state.subjects.find((item) => item.id === node.subject)?.label ?? node.subject ?? "과목";
  const grade = state.grades.find((item) => item.id === node.grade)?.label ?? node.grade ?? "학년군";
  return `${subject} · ${grade}`;
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("ko-KR");
}

function gradeSortValue(value) {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function element(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  node.textContent = text;
  return node;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
