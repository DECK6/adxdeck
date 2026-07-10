import {
  LEGACY_PROFILE_STORAGE_KEYS,
  PROFILE_STORAGE_KEY as STORAGE_KEY,
  createEmptyProfile,
  migrateProfile,
  sanitizeProfile,
} from "./profile-schema.js";
import {
  CAMERA_LIMITS,
  DEFAULT_CAMERA,
  TAU,
  buildGraphLayout3D,
  compareNodesForLayout,
  createCamera,
  fitCameraToLayout,
  focusYawForPosition,
  normalizeAngle,
  projectPoint,
} from "./graph-layout-3d.js?v=20260711-3d4";

const DATA_URL = "./data/learnmap.json";

const TOPIC_STATUSES = Object.freeze({
  familiar: "익숙해요",
  practicing: "연습 중이에요",
  preview: "먼저 살펴봐요",
});

const ALIGNMENT_LABELS = Object.freeze({
  introduces: "도입",
  supports: "지원",
  extends: "확장",
  assesses: "평가",
});

const VERIFICATION_LABELS = Object.freeze({
  "official-source-checked": "공식 출처 식별 확인",
  "public-doc-derived": "공개 문서 기반",
  "workstream-reviewed": "작업 단위 검토",
  "verification-review-needed": "추가 검토 필요",
  "not-checked": "미확인",
});

const MODE_COPY = Object.freeze({
  path: {
    eyebrow: "PERSONAL LEARNING PATH",
    title: "우리 아이 경로",
    description: "즐겨찾기와 주제 상태를 중심으로, 선택한 학년군과 관심 과목의 다음 흐름을 모았습니다.",
  },
  week: {
    eyebrow: "THIS WEEK AT HOME",
    title: "이번 주 집에서 해볼 것",
    description: "연습 중인 주제를 먼저, 먼저 살펴볼 주제와 즐겨찾기를 이어서 최대 6개 활동으로 제안합니다.",
  },
});

const EXPECTED_COUNTS = Object.freeze({
  nodes: 1956,
  edges: 1894,
  clusters: 153,
  standards: 620,
});

const MIN_ZOOM = CAMERA_LIMITS.minZoom;
const MAX_ZOOM = CAMERA_LIMITS.maxZoom;
const SEARCH_LIMIT = 10;
const HIT_RADIUS = 11;
const SUBJECT_FALLBACK = "#67625C";
const RED = "#E63329";
const GRAPH_BACKGROUND = "#060912";
const GRAPH_INK = "#F4F1EA";
const AUTO_ROTATION_SPEED = 0.000045;
const AUTO_ROTATION_PAUSE_MS = 5200;

const GRAPH_SUBJECT_COLORS = Object.freeze({
  "Korean Language": "#F25555",
  Mathematics: "#24C8DB",
  "Social Studies": "#F59E0B",
  Science: "#34D399",
  "English as a Foreign Language": "#A78BFA",
  "Moral Education": "#F472B6",
  "Physical Education": "#A3E635",
  Music: "#EC4899",
  Art: "#38BDF8",
  "Practical Arts / Informatics": "#60A5FA",
  "Integrated Subjects": "#D6E4FF",
});

const byId = (id) => document.getElementById(id);

const els = {
  app: byId("app"),
  metricNodes: byId("metric-nodes"),
  metricEdges: byId("metric-edges"),
  metricStandards: byId("metric-standards"),
  fitView: byId("fit-view"),
  openGuide: byId("open-guide"),
  openOntology: byId("open-ontology"),
  releaseLabel: byId("release-label"),
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  profileNickname: byId("profile-nickname"),
  profileGrade: byId("profile-grade"),
  profileSubjects: byId("profile-subjects"),
  savedIndicator: byId("saved-indicator"),
  clearLocalData: byId("clear-local-data"),
  topicSearch: byId("topic-search"),
  clearSearch: byId("clear-search"),
  searchResults: byId("search-results"),
  toggleSubjects: byId("toggle-subjects"),
  subjectFilters: byId("subject-filters"),
  toggleGrades: byId("toggle-grades"),
  gradeFilters: byId("grade-filters"),
  dataStatus: byId("data-status"),
  canvas: byId("graph-canvas"),
  toggleListView: byId("toggle-list-view"),
  closeListView: byId("close-list-view"),
  topicListPanel: byId("topic-list-panel"),
  topicList: byId("topic-list"),
  zoomIn: byId("zoom-in"),
  zoomLevel: byId("zoom-level"),
  zoomOut: byId("zoom-out"),
  visibleNodes: byId("visible-nodes"),
  loadingPanel: byId("loading-panel"),
  emptyState: byId("empty-state"),
  retryData: byId("retry-data"),
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
  selectedAlignment: byId("selected-alignment"),
  selectedVerification: byId("selected-verification"),
  selectedOntologyStatus: byId("selected-ontology-status"),
  selectedSourceStatus: byId("selected-source-status"),
  selectedTopicUri: byId("selected-topic-uri"),
  selectedPathSummary: byId("selected-path-summary"),
  selectedPathExamples: byId("selected-path-examples"),
  selectedAction: byId("selected-action"),
  selectedEvidence: byId("selected-evidence"),
  selectedQuestion: byId("selected-question"),
  statusOptions: byId("status-options"),
  clearTopicStatus: byId("clear-topic-status"),
  toggleFavorite: byId("toggle-favorite"),
  prerequisiteCount: byId("prerequisite-count"),
  prerequisiteList: byId("prerequisite-list"),
  unlockCount: byId("unlock-count"),
  unlockList: byId("unlock-list"),
  selectedCluster: byId("selected-cluster"),
  selectedClusterSummary: byId("selected-cluster-summary"),
  parentPanel: byId("parent-panel"),
  parentPanelEyebrow: byId("parent-panel-eyebrow"),
  parentPanelTitle: byId("parent-panel-title"),
  parentPanelDescription: byId("parent-panel-description"),
  parentSummary: byId("parent-summary"),
  parentEmpty: byId("parent-empty"),
  parentEmptyTitle: byId("parent-empty-title"),
  parentEmptyDescription: byId("parent-empty-description"),
  parentTopicGrid: byId("parent-topic-grid"),
  focusProfile: byId("focus-profile"),
  guideDialog: byId("guide-dialog"),
  closeGuide: byId("close-guide"),
  confirmGuide: byId("confirm-guide"),
  ontologyDialog: byId("ontology-dialog"),
  closeOntology: byId("close-ontology"),
  confirmOntology: byId("confirm-ontology"),
  ontologyVersion: byId("ontology-version"),
  ontologyDataRelease: byId("ontology-data-release"),
  ontologyPayloadHash: byId("ontology-payload-hash"),
  ontologyReleaseStatus: byId("ontology-release-status"),
  ontologyAutomatedReview: byId("ontology-automated-review"),
  ontologyExternalReview: byId("ontology-external-review"),
  ontologyOfficialStatus: byId("ontology-official-status"),
  ontologyRights: byId("ontology-rights"),
  ontologyTurtleDownload: byId("ontology-turtle-download"),
  ontologyJsonldDownload: byId("ontology-jsonld-download"),
  ontologyTurtleHash: byId("ontology-turtle-hash"),
  ontologyJsonldHash: byId("ontology-jsonld-hash"),
};

const ctx = els.canvas?.getContext("2d", { alpha: true });
const graphPanel = els.canvas?.closest(".graph-panel") ?? null;
const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
let reducedMotion = reducedMotionQuery?.matches ?? false;

const state = {
  mode: "map",
  listView: false,
  profile: createEmptyProfile(),
  favoriteIds: new Set(),
  storageEnabled: true,
  saveIndicatorTimer: null,
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
  layout3d: null,
  projectedNodes: [],
  projectedNodeById: new Map(),
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
    ...DEFAULT_CAMERA,
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
  lastRenderTime: 0,
  interactionPauseUntil: 0,
  autorotateTimer: null,
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
  state.profile = loadProfile();
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
  renderProfileControls();
  renderOntologyInfo();
  updateVisibleGraph();
  updateMetrics();
  setMode("map");
  setReady();
  fitView({ markUser: false });
  state.ready = true;
  applyRouteFromHash();
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
  if (data.meta?.schemaVersion !== 2 || data.meta?.ontology?.version !== "0.3.0-p3") {
    throw new Error("온톨로지 의미 투영 버전이 올바르지 않습니다.");
  }
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
  state.profile = sanitizeProfile(state.profile, {
    subjectIds: new Set(state.subjects.map((subject) => subject.id)),
    gradeIds: new Set(state.grades.map((grade) => grade.id)),
    nodeIds: new Set((data.nodes ?? []).map((node) => node.id)),
  });
  state.favoriteIds = new Set(state.profile.favorites);
  state.nodes = data.nodes.map((node, index) => ({
    ...node,
    _index: index,
    _search: normalize(`${node.title ?? ""} ${node.code ?? ""}`),
    _color: subjectColor(node.subject),
    x: 0,
    y: 0,
    z: 0,
    layout3d: null,
  }));
  state.edges = [];
  state.clusters = new Map(data.clusters.map((cluster) => [cluster.id, cluster]));
  state.standards = new Map(data.standards.map((standard) => [standard.id, standard]));
  state.nodeById = new Map(state.nodes.map((node) => [node.id, node]));
  state.nodeIndex = new Map(state.nodes.map((node, index) => [node.id, index]));
  state.incoming = new Map(state.nodes.map((node) => [node.id, []]));
  state.outgoing = new Map(state.nodes.map((node) => [node.id, []]));

  for (const edge of data.edges) {
    const dependent = state.nodeById.get(edge.from);
    const prerequisite = state.nodeById.get(edge.to);
    if (!dependent || !prerequisite) {
      continue;
    }
    const prepared = {
      ...edge,
      dependentNode: dependent,
      prerequisiteNode: prerequisite,
      fromNode: prerequisite,
      toNode: dependent,
    };
    state.edges.push(prepared);
    state.incoming.get(dependent.id)?.push(prepared);
    state.outgoing.get(prerequisite.id)?.push(prepared);
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
      color: subjectColorForId(String(subject.id), subject.color),
      count: Number(subject.count ?? 0),
    }));
  }

  const counts = new Map();
  for (const node of data.nodes ?? []) {
    const id = node.subject ?? "Unknown";
    const current = counts.get(id) ?? {
      id,
      label: node.subjectLabel ?? id,
      color: subjectColorForId(id, SUBJECT_FALLBACK),
      count: 0,
    };
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
  state.layout3d = buildGraphLayout3D({
    nodes: state.nodes,
    subjects: state.subjects,
    grades: state.grades,
    clusters: [...state.clusters.values()],
  });

  for (const node of state.nodes) {
    const layout = state.layout3d.positions.get(node.id);
    if (!layout) {
      throw new Error(`3D layout position missing for ${node.id}`);
    }
    node.x = layout.x;
    node.y = layout.y;
    node.z = layout.z;
    node.layout3d = layout;
  }
}

function loadProfile() {
  try {
    for (const key of [STORAGE_KEY, ...LEGACY_PROFILE_STORAGE_KEYS]) {
      const stored = window.localStorage.getItem(key);
      if (!stored) continue;
      try {
        const parsed = JSON.parse(stored);
        const migrated = migrateProfile(parsed);
        if (!migrated) throw new Error(`지원하지 않는 프로필 스키마: ${parsed?.version ?? "없음"}`);
        const profile = sanitizeProfile(migrated);
        if (key !== STORAGE_KEY) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          window.localStorage.removeItem(key);
        }
        return profile;
      } catch (error) {
        console.warn("손상된 브라우저 저장값을 비우고 새 설정으로 시작합니다.", error);
        window.localStorage.removeItem(key);
      }
    }
    return createEmptyProfile();
  } catch (error) {
    state.storageEnabled = false;
    console.warn("브라우저 로컬 저장소를 읽을 수 없습니다.", error);
    return createEmptyProfile();
  }
}

function persistProfile(message = "저장됨") {
  if (!state.storageEnabled) {
    showSaveIndicator("이 브라우저에서 저장을 사용할 수 없음", { persistent: true });
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
    for (const key of LEGACY_PROFILE_STORAGE_KEYS) window.localStorage.removeItem(key);
    els.clearLocalData.disabled = !profileHasData();
    showSaveIndicator(message);
  } catch (error) {
    state.storageEnabled = false;
    console.warn("브라우저 로컬 저장소에 저장할 수 없습니다.", error);
    showSaveIndicator("이 브라우저에서 저장을 사용할 수 없음", { persistent: true });
  }
}

function clearProfile() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    for (const key of LEGACY_PROFILE_STORAGE_KEYS) window.localStorage.removeItem(key);
    state.storageEnabled = true;
  } catch (error) {
    state.storageEnabled = false;
    console.warn("브라우저 로컬 저장소를 지울 수 없습니다.", error);
  }

  state.profile = createEmptyProfile();
  state.favoriteIds = new Set();
  renderProfileControls();
  syncInspectorProfileState();
  updateParentPanel();
  requestRender();
  showSaveIndicator(state.storageEnabled ? "저장한 내용 삭제됨" : "저장소를 지울 수 없음", {
    persistent: !state.storageEnabled,
  });
}

function showSaveIndicator(message, options = {}) {
  if (!els.savedIndicator) {
    return;
  }
  window.clearTimeout(state.saveIndicatorTimer);
  els.savedIndicator.textContent = message;
  els.savedIndicator.dataset.active = "true";
  if (!options.persistent) {
    state.saveIndicatorTimer = window.setTimeout(() => {
      els.savedIndicator.textContent = "이 브라우저에만 저장";
      delete els.savedIndicator.dataset.active;
    }, reducedMotion ? 900 : 1800);
  }
}

function profileHasData() {
  return Boolean(
    state.profile.nickname ||
    state.profile.grade ||
    state.profile.subjects.length ||
    state.profile.favorites.length ||
    Object.keys(state.profile.statuses).length,
  );
}

function renderProfileControls() {
  if (!state.data) {
    return;
  }

  els.profileNickname.value = state.profile.nickname;
  els.profileGrade.replaceChildren(
    optionElement("", "아직 고르지 않음"),
    ...state.grades.map((grade) => optionElement(grade.id, grade.label)),
  );
  els.profileGrade.value = state.profile.grade;

  els.profileSubjects.replaceChildren(
    ...state.subjects.map((subject) => {
      const label = document.createElement("label");
      label.className = "profile-subject-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = subject.id;
      input.checked = state.profile.subjects.includes(subject.id);
      input.dataset.profileSubjectId = subject.id;
      input.addEventListener("change", () => {
        const next = new Set(state.profile.subjects);
        if (input.checked) {
          next.add(subject.id);
        } else {
          next.delete(subject.id);
        }
        state.profile.subjects = [...next];
        persistProfile();
        updateParentPanel();
      });
      const swatch = element("i", "", "");
      swatch.style.setProperty("--subject-color", subject.color);
      label.append(input, swatch, element("span", "", subject.label));
      return label;
    }),
  );

  els.clearLocalData.disabled = !profileHasData();
  if (!state.storageEnabled) {
    showSaveIndicator("이 브라우저에서 저장을 사용할 수 없음", { persistent: true });
  } else if (profileHasData()) {
    els.savedIndicator.textContent = "저장됨 · 이 브라우저에만";
  } else {
    els.savedIndicator.textContent = "이 브라우저에만 저장";
  }
}

function optionElement(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function setMode(mode) {
  state.mode = Object.hasOwn(MODE_COPY, mode) ? mode : "map";
  const isMap = state.mode === "map";
  els.app.dataset.mode = state.mode;
  graphPanel.hidden = !isMap;
  els.parentPanel.hidden = isMap;
  els.fitView.disabled = !isMap;

  for (const button of els.modeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
  }

  if (isMap) {
    window.requestAnimationFrame(() => {
      resizeCanvas();
      requestRender();
    });
  } else {
    clearAutorotationTimer();
    setListView(false, { restoreFocus: false });
    updateParentPanel();
  }
}

function updateParentPanel() {
  if (!state.data || state.mode === "map") {
    return;
  }

  const copy = MODE_COPY[state.mode];
  const nodes = parentNodesForMode(state.mode);
  const hasSetup = profileHasData();
  els.parentPanelEyebrow.textContent = copy.eyebrow;
  els.parentPanelTitle.textContent = state.profile.nickname
    ? `${state.profile.nickname}의 ${copy.title.replace("우리 아이 ", "")}`
    : copy.title;
  els.parentPanelDescription.textContent = copy.description;
  renderParentSummary();
  els.parentEmpty.hidden = hasSetup && nodes.length > 0;
  els.parentTopicGrid.hidden = !els.parentEmpty.hidden;

  if (!hasSetup) {
    els.parentEmptyTitle.textContent = "우리 아이 설정을 먼저 골라주세요.";
    els.parentEmptyDescription.textContent = "학년군이나 관심 과목을 고르거나, 지도에서 주제 상태와 즐겨찾기를 표시하면 맞춤 내용이 나타납니다.";
    els.parentTopicGrid.replaceChildren();
    return;
  }

  if (!nodes.length) {
    els.parentEmptyTitle.textContent = "조건에 맞는 주제가 없습니다.";
    els.parentEmptyDescription.textContent = "학년군 또는 관심 과목 설정을 바꾸거나 지도에서 다른 주제를 표시해 보세요.";
    els.parentTopicGrid.replaceChildren();
    return;
  }

  els.parentTopicGrid.replaceChildren(...nodes.map((node, index) => parentTopicCard(node, index)));
}

function renderParentSummary() {
  const counts = Object.values(state.profile.statuses).reduce(
    (result, status) => ({ ...result, [status]: (result[status] ?? 0) + 1 }),
    {},
  );
  const entries = [
    ["familiar", "익숙", counts.familiar ?? 0],
    ["practicing", "연습", counts.practicing ?? 0],
    ["preview", "먼저", counts.preview ?? 0],
    ["favorites", "즐겨찾기", state.profile.favorites.length],
  ];
  els.parentSummary.replaceChildren(
    ...entries.map(([key, label, count]) => {
      const item = element("span", `summary-${key}`, "");
      item.append(element("b", "", String(count)), document.createTextNode(label));
      return item;
    }),
  );
}

function parentNodesForMode(mode) {
  const matchesProfile = state.nodes.filter((node) => nodeMatchesProfile(node));
  const tracked = matchesProfile.filter((node) => topicStatus(node.id) || isFavorite(node.id));
  const rankedTracked = [...tracked].sort(compareParentPriority);

  if (mode === "week") {
    const active = matchesProfile.filter((node) => topicStatus(node.id) !== "familiar");
    return uniqueNodes([...rankedTracked, ...active.sort(compareParentPriority)]).slice(0, 6);
  }

  const connected = [];
  for (const node of rankedTracked) {
    connected.push(
      ...(state.incoming.get(node.id) ?? []).map((edge) => edge.prerequisiteNode),
      ...(state.outgoing.get(node.id) ?? []).map((edge) => edge.dependentNode),
    );
  }
  return uniqueNodes([
    ...rankedTracked,
    ...connected.filter((node) => nodeMatchesProfile(node)),
    ...matchesProfile.sort(compareParentPriority),
  ]).slice(0, 18);
}

function nodeMatchesProfile(node) {
  if (state.profile.grade && node.grade !== state.profile.grade) {
    return false;
  }
  return state.profile.subjects.length === 0 || state.profile.subjects.includes(node.subject);
}

function compareParentPriority(a, b) {
  const rank = { practicing: 0, preview: 1, familiar: 3 };
  const aStatus = topicStatus(a.id);
  const bStatus = topicStatus(b.id);
  const aRank = rank[aStatus] ?? (isFavorite(a.id) ? 2 : 4);
  const bRank = rank[bStatus] ?? (isFavorite(b.id) ? 2 : 4);
  return aRank - bRank || gradeSortValue(a.grade) - gradeSortValue(b.grade) || compareNodesForLayout(a, b);
}

function uniqueNodes(nodes) {
  const seen = new Set();
  return nodes.filter((node) => node && !seen.has(node.id) && seen.add(node.id));
}

function parentTopicCard(node, index) {
  const article = document.createElement("article");
  article.className = "parent-topic-card";
  article.dataset.nodeId = node.id;
  const status = topicStatus(node.id);
  const head = element("div", "parent-topic-card-head", "");
  head.append(
    element("span", "card-index", String(index + 1).padStart(2, "0")),
    element("span", `topic-state state-${status || "new"}`, status ? TOPIC_STATUSES[status] : "살펴볼 주제"),
  );

  const title = document.createElement("button");
  title.type = "button";
  title.className = "parent-topic-title";
  title.textContent = node.title ?? "제목 없음";
  title.addEventListener("click", () => selectNode(node));

  const evidence = Array.isArray(node.evidence) ? node.evidence[0] : "아이의 말과 활동 결과를 함께 살펴보세요.";
  const favorite = document.createElement("button");
  favorite.type = "button";
  favorite.className = "card-favorite";
  favorite.setAttribute("aria-pressed", String(isFavorite(node.id)));
  favorite.setAttribute("aria-label", `${node.title ?? "주제"} 즐겨찾기`);
  favorite.textContent = isFavorite(node.id) ? "★ 저장됨" : "☆ 즐겨찾기";
  favorite.addEventListener("click", () => toggleFavoriteFor(node.id));

  const detail = document.createElement("button");
  detail.type = "button";
  detail.className = "card-detail";
  detail.textContent = "상세와 배움 경로 보기";
  detail.addEventListener("click", () => selectNode(node));

  const actions = element("div", "parent-topic-actions", "");
  actions.append(favorite, detail);
  article.append(
    head,
    element("p", "parent-topic-meta", `${node.code ?? "성취기준"} · ${metaLine(node)}`),
    title,
    cardInfo("ACTION", topicAction(node)),
    cardInfo("EVIDENCE", evidence),
    cardInfo("PROMPT", node.assessmentPrompt ?? "어떻게 생각하고 해냈는지 아이의 말로 들려줄래?"),
    actions,
  );
  return article;
}

function cardInfo(label, text) {
  const section = element("section", "parent-card-info", "");
  section.append(element("span", "", label), element("p", "", text));
  return section;
}

function topicAction(node) {
  const summary = state.standards.get(node.standard)?.summary ?? node.title ?? "이 주제";
  if (node.type === "PROCEDURAL") {
    return `집에 있는 재료나 일상 장면으로 ‘${summary}’ 활동을 10분 해보고, 선택한 방법을 아이가 직접 말하게 해보세요.`;
  }
  if (node.type === "REFLECTIVE") {
    return `‘${summary}’ 활동을 돌아보며 잘된 점 하나와 다음에 바꿀 점 하나를 함께 적어보세요.`;
  }
  return `‘${summary}’를 아이의 말로 설명하고, 생활 속 예를 하나 찾아 연결해 보세요.`;
}

function topicStatus(nodeId) {
  return state.profile.statuses[nodeId] ?? "";
}

function isFavorite(nodeId) {
  return state.favoriteIds.has(nodeId);
}

function setTopicStatus(nodeId, status) {
  if (!state.nodeById.has(nodeId)) {
    return;
  }
  if (status && Object.hasOwn(TOPIC_STATUSES, status)) {
    state.profile.statuses[nodeId] = status;
  } else {
    delete state.profile.statuses[nodeId];
  }
  persistProfile();
  syncInspectorProfileState();
  updateParentPanel();
  renderTopicList();
  requestRender();
}

function toggleFavoriteFor(nodeId) {
  if (!state.nodeById.has(nodeId)) {
    return;
  }
  const favorites = new Set(state.favoriteIds);
  if (favorites.has(nodeId)) {
    favorites.delete(nodeId);
  } else {
    favorites.add(nodeId);
  }
  state.favoriteIds = favorites;
  state.profile.favorites = [...favorites];
  persistProfile();
  syncInspectorProfileState();
  updateParentPanel();
  renderTopicList();
  requestRender();
}

function syncInspectorProfileState() {
  if (!state.selectedId) {
    return;
  }
  const status = topicStatus(state.selectedId);
  for (const button of els.statusOptions.querySelectorAll("[data-status-value]")) {
    button.setAttribute("aria-pressed", String(button.dataset.statusValue === status));
  }
  els.clearTopicStatus.disabled = !status;
  const favorite = isFavorite(state.selectedId);
  els.toggleFavorite.setAttribute("aria-pressed", String(favorite));
  els.toggleFavorite.textContent = favorite ? "★ 즐겨찾기됨" : "☆ 즐겨찾기";
}

function setListView(visible, options = {}) {
  state.listView = Boolean(visible && state.mode === "map");
  els.topicListPanel.hidden = !state.listView;
  els.toggleListView.setAttribute("aria-pressed", String(state.listView));
  els.toggleListView.textContent = state.listView ? "지도" : "목록";
  if (state.listView) {
    clearAutorotationTimer();
    renderTopicList();
    els.closeListView.focus({ preventScroll: true });
  } else if (options.restoreFocus !== false && document.activeElement === els.closeListView) {
    els.toggleListView.focus({ preventScroll: true });
  }
  requestRender();
}

function renderTopicList() {
  if (!state.listView || !els.topicList) {
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const node of state.visibleNodes) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.nodeId = node.id;
    button.setAttribute("aria-current", String(node.id === state.selectedId));
    const status = topicStatus(node.id);
    button.append(
      element("span", "topic-list-code", node.code ?? "—"),
      element("strong", "", node.title ?? "제목 없음"),
      element("small", "", `${metaLine(node)}${status ? ` · ${TOPIC_STATUSES[status]}` : ""}${isFavorite(node.id) ? " · ★" : ""}`),
    );
    button.addEventListener("click", () => selectNode(node));
    fragment.append(button);
  }
  els.topicList.replaceChildren(fragment);
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
  renderTopicList();
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

function renderOntologyInfo() {
  const ontology = state.data?.meta?.ontology;
  if (!ontology) return;
  const turtle = ontology.artifacts?.turtle;
  const jsonLd = ontology.artifacts?.jsonLd;

  els.releaseLabel.textContent = `ONTOLOGY ${ontology.version}`;
  els.ontologyVersion.textContent = ontology.version;
  els.ontologyDataRelease.textContent = state.data?.meta?.taxonomyVersion ?? "—";
  els.ontologyPayloadHash.textContent = shortHash(state.data?.meta?.payloadSha256);
  els.ontologyReleaseStatus.textContent = ontology.releaseStatus === "formal" ? "정식 P3 릴리스" : ontology.releaseStatus;
  els.ontologyAutomatedReview.textContent = ontology.automatedReviewStatus === "passed"
    ? `${ontology.formalGateCount ?? "전체"}개 게이트 통과`
    : ontology.automatedReviewStatus;
  els.ontologyExternalReview.textContent = ontology.externalDomainReviewStatus === "ongoing" ? "진행 중" : ontology.externalDomainReviewStatus;
  els.ontologyOfficialStatus.textContent = ontology.officialStatus === "independent-non-official" ? "독립 제작 · 비공식" : ontology.officialStatus;
  els.ontologyRights.textContent = `${ontology.rights?.status ?? "—"} · 재배포 허락 아님`;

  if (turtle) {
    els.ontologyTurtleDownload.href = turtle.href;
    els.ontologyTurtleHash.textContent = `SHA-256 ${shortHash(turtle.sha256)} · ${formatBytes(turtle.bytes)}`;
  }
  if (jsonLd) {
    els.ontologyJsonldDownload.href = jsonLd.href;
    els.ontologyJsonldHash.textContent = `SHA-256 ${shortHash(jsonLd.sha256)} · ${formatBytes(jsonLd.bytes)}`;
  }
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

  for (const button of els.modeButtons) {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  }
  els.profileNickname?.addEventListener("input", () => {
    state.profile.nickname = els.profileNickname.value.slice(0, 24);
    persistProfile();
    updateParentPanel();
  });
  els.profileNickname?.addEventListener("blur", () => {
    state.profile.nickname = state.profile.nickname.trim();
    els.profileNickname.value = state.profile.nickname;
    persistProfile();
  });
  els.profileGrade?.addEventListener("change", () => {
    state.profile.grade = els.profileGrade.value;
    persistProfile();
    updateParentPanel();
  });
  els.clearLocalData?.addEventListener("click", clearProfile);
  els.toggleListView?.addEventListener("click", () => setListView(!state.listView));
  els.closeListView?.addEventListener("click", () => setListView(false));
  els.retryData?.addEventListener("click", () => window.location.reload());
  els.focusProfile?.addEventListener("click", () => {
    els.profileGrade?.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
    els.profileGrade?.focus({ preventScroll: true });
  });
  for (const button of els.statusOptions?.querySelectorAll("[data-status-value]") ?? []) {
    button.addEventListener("click", () => setTopicStatus(state.selectedId, button.dataset.statusValue));
  }
  els.clearTopicStatus?.addEventListener("click", () => setTopicStatus(state.selectedId, ""));
  els.toggleFavorite?.addEventListener("click", () => toggleFavoriteFor(state.selectedId));

  els.closeInspector?.addEventListener("click", closeInspector);
  els.openGuide?.addEventListener("click", openGuide);
  els.closeGuide?.addEventListener("click", closeGuide);
  els.confirmGuide?.addEventListener("click", closeGuide);
  els.openOntology?.addEventListener("click", openOntology);
  els.closeOntology?.addEventListener("click", closeOntology);
  els.confirmOntology?.addEventListener("click", closeOntology);
  window.addEventListener("hashchange", () => applyRouteFromHash());
  document.addEventListener("visibilitychange", () => {
    state.lastRenderTime = 0;
    if (document.hidden) {
      clearAutorotationTimer();
    } else {
      requestRender();
    }
  });
  reducedMotionQuery?.addEventListener?.("change", (event) => {
    reducedMotion = event.matches;
    state.lastRenderTime = 0;
    if (reducedMotion) {
      clearAutorotationTimer();
    }
    requestRender();
  });

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
    if (isDialogOpen(els.ontologyDialog)) {
      closeOntology();
    } else if (isDialogOpen(els.guideDialog)) {
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
  pauseAutorotation();
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
      mode: event.shiftKey ? "pan" : "rotate",
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
      pauseAutorotation();
      if (state.drag.mode === "pan" || event.shiftKey) {
        state.view.panX += dx;
        state.view.panY += dy;
      } else {
        state.view.yaw = normalizeAngle(state.view.yaw + dx * 0.0062);
        state.view.pitch = clamp(state.view.pitch + dy * 0.0038, CAMERA_LIMITS.minPitch, CAMERA_LIMITS.maxPitch);
      }
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
      selectNode(node, { center: true, focusCanvas: true });
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
  pauseAutorotation();
  const point = canvasPoint(event);
  const factor = Math.exp(-event.deltaY * 0.001);
  zoomAt(point, state.view.zoom * factor, { markUser: true });
}

function onCanvasKeyDown(event) {
  if (event.key.toLocaleLowerCase() === "l") {
    event.preventDefault();
    setListView(true);
    return;
  }

  const directions = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
  };
  if (directions[event.key]) {
    event.preventDefault();
    const next = nextNodeInDirection(directions[event.key]);
    if (next) {
      selectNode(next, { center: true });
      els.canvas.focus({ preventScroll: true });
    }
    return;
  }

  if (event.key === "Enter") {
    const node = state.selectedId
      ? state.nodeById.get(state.selectedId)
      : state.hoveredId
        ? state.nodeById.get(state.hoveredId)
        : nearestNodeToScreenCenter();
    if (node) {
      event.preventDefault();
      selectNode(node, { center: true });
    }
  }
}

function nextNodeInDirection(direction) {
  const current = state.nodeById.get(state.selectedId) ?? nearestNodeToScreenCenter();
  if (!current) {
    return null;
  }
  const origin = worldToScreen(current);
  let best = null;
  let bestScore = Infinity;
  for (const node of state.visibleNodes) {
    if (node.id === current.id) {
      continue;
    }
    const point = worldToScreen(node);
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;
    const forward = dx * direction.x + dy * direction.y;
    if (forward <= 2) {
      continue;
    }
    const sideways = Math.abs(dx * direction.y - dy * direction.x);
    const score = forward + sideways * 2.4;
    if (score < bestScore) {
      best = node;
      bestScore = score;
    }
  }
  return best;
}

function nearestNodeToScreenCenter() {
  const center = { x: state.size.width / 2, y: state.size.height / 2 };
  let nearest = null;
  let nearestDistance = Infinity;
  for (const node of state.visibleNodes) {
    const point = worldToScreen(node);
    const nextDistance = distance(point, center);
    if (nextDistance < nearestDistance) {
      nearest = node;
      nearestDistance = nextDistance;
    }
  }
  return nearest;
}

function makePinchState() {
  const points = [...state.pointers.values()];
  if (points.length < 2) {
    return null;
  }
  const center = midpoint(points[0], points[1]);
  return {
    distance: Math.max(1, distance(points[0], points[1])),
    center,
    zoom: state.view.zoom,
    panX: state.view.panX,
    panY: state.view.panY,
  };
}

function updatePinch() {
  const points = [...state.pointers.values()];
  if (points.length < 2 || !state.pinch) {
    return;
  }
  const center = midpoint(points[0], points[1]);
  const nextZoom = state.pinch.zoom * (distance(points[0], points[1]) / state.pinch.distance);
  const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  const viewportCenter = { x: state.size.width / 2, y: state.size.height / 2 };
  const ratio = state.pinch.zoom > 0 ? zoom / state.pinch.zoom : 1;
  state.view.zoom = zoom;
  state.view.panX = center.x - viewportCenter.x
    - (state.pinch.center.x - viewportCenter.x - state.pinch.panX) * ratio;
  state.view.panY = center.y - viewportCenter.y
    - (state.pinch.center.y - viewportCenter.y - state.pinch.panY) * ratio;
  state.view.userChanged = true;
  pauseAutorotation();
  updateZoomLabel();
  requestRender();
}

function zoomAtCenter(factor) {
  const point = { x: state.size.width / 2, y: state.size.height / 2 };
  zoomAt(point, state.view.zoom * factor, { markUser: true });
}

function zoomAt(point, nextZoom, options = {}) {
  const previousZoom = state.view.zoom;
  const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  const center = { x: state.size.width / 2, y: state.size.height / 2 };
  const ratio = previousZoom > 0 ? zoom / previousZoom : 1;
  state.view.zoom = zoom;
  state.view.panX = point.x - center.x - (point.x - center.x - state.view.panX) * ratio;
  state.view.panY = point.y - center.y - (point.y - center.y - state.view.panY) * ratio;
  state.view.userChanged = Boolean(options.markUser);
  pauseAutorotation();
  updateZoomLabel();
  updateHover(state.lastPointer);
  requestRender();
}

function fitView(options = {}) {
  const nodes = state.visibleNodes.length ? state.visibleNodes : state.nodes;
  if (!nodes.length) {
    return;
  }

  const camera = createCamera({
    ...DEFAULT_CAMERA,
    userChanged: Boolean(options.markUser),
  });
  const framed = fitCameraToLayout(nodes, state.size, camera, {
    padding: reducedMotion ? 44 : 58,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
  });
  state.view = {
    ...framed,
    userChanged: Boolean(options.markUser),
  };
  state.view.userChanged = Boolean(options.markUser);
  if (options.markUser) {
    pauseAutorotation();
  }
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
  pauseAutorotation();
  if (options.updateRoute !== false) {
    replaceRouteHash("topic", node.id);
  }
  els.app.classList.add("inspector-open");
  els.inspector.setAttribute("aria-hidden", "false");
  // Reading the new canvas rect forces the inspector grid change to settle
  // before projection and centering use the viewport dimensions.
  resizeCanvas();
  fillInspector(node);
  updateSearchResults();
  renderTopicList();

  if (options.center !== false && isNodeFilterVisible(node)) {
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
  els.selectedAlignment.textContent = `${ALIGNMENT_LABELS[node.alignmentKind] ?? node.alignmentKind ?? "정렬"} (${node.alignmentKind ?? "—"})`;
  els.selectedVerification.textContent = `${VERIFICATION_LABELS[node.verificationStatus] ?? node.verificationStatus ?? "—"} · 정렬 ${VERIFICATION_LABELS[node.alignmentVerificationStatus] ?? node.alignmentVerificationStatus ?? "—"}`;
  const ontology = state.data?.meta?.ontology;
  els.selectedOntologyStatus.textContent = `${ontology?.version ?? "—"} · ${ontology?.releaseStatus === "formal" ? "정식 릴리스" : ontology?.releaseStatus ?? "상태 없음"}`;
  els.selectedSourceStatus.textContent = `${ontology?.rights?.status ?? "—"} · 공식 원문 미포함`;
  els.selectedTopicUri.textContent = node.uri ?? node.id;
  els.selectedAction.textContent = topicAction(node);
  els.selectedQuestion.textContent = node.assessmentPrompt ?? "아이의 설명과 수행 과정을 함께 확인해 보세요.";
  els.selectedCluster.textContent = cluster?.title ?? "연결된 배움 묶음 없음";
  els.selectedClusterSummary.textContent = cluster?.parentSummary ?? cluster?.summary ?? "이 주제와 연결된 묶음 설명이 아직 없습니다.";

  const evidence = Array.isArray(node.evidence) && node.evidence.length
    ? node.evidence
    : ["관찰 가능한 증거가 아직 없습니다."];
  els.selectedEvidence.replaceChildren(...evidence.map((text) => element("li", "", text)));

  els.prerequisiteCount.textContent = String(incoming.length);
  els.unlockCount.textContent = String(outgoing.length);
  const paths = node.pathSummary ?? {};
  els.selectedPathSummary.replaceChildren(
    summaryMetric("직접 선수", paths.directPrerequisites ?? incoming.length),
    summaryMetric("간접 선수", paths.indirectPrerequisites ?? 0),
    summaryMetric("직접 다음", paths.directUnlocks ?? outgoing.length),
    summaryMetric("간접 다음", paths.indirectUnlocks ?? 0),
  );
  fillRelatedList(els.prerequisiteList, incoming, "prerequisiteNode", "먼저 배우는 주제가 없습니다.");
  fillRelatedList(els.unlockList, outgoing, "dependentNode", "다음에 열리는 주제가 없습니다.");
  fillPathExamples(node, incoming, outgoing);
  syncInspectorProfileState();
}

function firstClusterFor(node) {
  const clusterId = Array.isArray(node.clusters) ? node.clusters[0] : null;
  return clusterId ? state.clusters.get(clusterId) : null;
}

function fillRelatedList(container, edges, nodeKey, emptyText) {
  if (!edges.length) {
    container.replaceChildren(element("div", "related-empty", emptyText));
    return;
  }

  container.replaceChildren(
    ...edges.map((edge) => {
      const node = edge[nodeKey];
      const button = document.createElement("button");
      button.type = "button";
      button.append(
        element("strong", "", node.title ?? "제목 없음"),
        relationBadge(edge.requirementLevel),
        element("small", "related-meta", `${node.code ?? ""} · ${metaLine(node)}`),
        element("small", "related-reason", edge.reason ?? "관계 설명 없음"),
      );
      button.addEventListener("click", () => selectNode(node, { center: true, focusCanvas: true }));
      return button;
    }),
  );
}

function relationBadge(level) {
  return element(
    "span",
    `relation-badge ${level === "required" ? "required" : "recommended"}`,
    level === "required" ? "필수" : "권장",
  );
}

function summaryMetric(label, value) {
  const item = element("span", "", "");
  item.append(element("b", "", String(value)), document.createTextNode(label));
  return item;
}

function fillPathExamples(node, incoming, outgoing) {
  const examples = [];
  for (const edge of incoming.slice(0, 2)) {
    examples.push(pathExampleArticle(
      `직접 선수 · ${relationLevelText(edge.requirementLevel)}`,
      `${edge.prerequisiteNode.title ?? "선수 주제"}를 먼저 다루면 ${node.title ?? "이 주제"}로 이어가기 쉽습니다.`,
      edge.reason ?? "검토된 한 단계 선수 관계입니다.",
    ));
  }

  for (const example of (node.pathSummary?.indirectPrerequisiteExamples ?? []).slice(0, 2)) {
    examples.push(pathExampleArticle(
      `간접 선수 · ${example.hops}단계`,
      pathTitleLine(example.path),
      `단계별 의미: ${example.requirementLevels.map(relationLevelText).join(" / ")}`,
    ));
  }

  for (const example of (node.pathSummary?.indirectUnlockExamples ?? []).slice(0, 1)) {
    examples.push(pathExampleArticle(
      `간접 다음 · ${example.hops}단계`,
      pathTitleLine(example.path),
      `단계별 의미: ${example.requirementLevels.map(relationLevelText).join(" / ")}`,
    ));
  }

  if (!examples.length && outgoing.length) {
    examples.push(pathExampleArticle(
      "출발 주제",
      "직접 선수 없이 시작할 수 있고, 이 주제 뒤에 이어지는 다음 주제가 있습니다.",
      "필요하면 다음에 열리는 길에서 직접 관계를 확인하세요.",
    ));
  }

  els.selectedPathExamples.replaceChildren(...examples);
}

function pathExampleArticle(label, body, meta) {
  const article = document.createElement("article");
  article.append(
    element("strong", "", label),
    element("p", "", body),
    element("code", "", meta),
  );
  return article;
}

function pathTitleLine(pathIds = []) {
  return pathIds
    .map((nodeId) => state.nodeById.get(nodeId)?.title ?? nodeId)
    .join(" → ");
}

function relationLevelText(level) {
  return level === "required" ? "필수" : "권장";
}

function closeInspector() {
  const restoreCanvasFocus = els.inspector.contains(document.activeElement);
  state.selectedId = null;
  els.app.classList.remove("inspector-open");
  els.inspector.setAttribute("aria-hidden", "true");
  clearRouteHash();
  updateSearchResults();
  renderTopicList();
  pauseAutorotation();
  if (restoreCanvasFocus) {
    const target = state.mode === "map"
      ? els.canvas
      : els.modeButtons.find((button) => button.dataset.mode === state.mode);
    target?.focus({ preventScroll: true });
  }
  requestRender();
}

function centerNode(node) {
  const layout = node.layout3d ?? node;
  state.view.yaw = focusYawForPosition(layout);
  state.view.pitch = clamp(-0.14 - layout.y * 0.00008, CAMERA_LIMITS.minPitch, CAMERA_LIMITS.maxPitch);
  const projected = worldToScreen(node);
  const target = unobscuredCanvasCenter();
  state.view.panX += target.x - projected.x;
  state.view.panY += target.y - projected.y;
  state.view.userChanged = true;
  pauseAutorotation();
  updateZoomLabel();
}

function unobscuredCanvasCenter() {
  const canvasRect = els.canvas.getBoundingClientRect();
  const inspectorRect = els.inspector.getBoundingClientRect();
  const overlapLeft = Math.max(canvasRect.left, inspectorRect.left);
  const overlapRight = Math.min(canvasRect.right, inspectorRect.right);
  const inspectorOverlaysRight = overlapRight > overlapLeft
    && inspectorRect.left > canvasRect.left + 1;
  return {
    x: inspectorOverlaysRight
      ? (overlapLeft - canvasRect.left) / 2
      : canvasRect.width / 2,
    y: canvasRect.height / 2,
  };
}

function openGuide() {
  clearAutorotationTimer();
  if (typeof els.guideDialog.showModal === "function") {
    els.guideDialog.showModal();
  } else {
    els.guideDialog.setAttribute("open", "");
  }
}

function closeGuide() {
  if (typeof els.guideDialog.close === "function" && isDialogOpen(els.guideDialog)) {
    els.guideDialog.close();
  } else {
    els.guideDialog.removeAttribute("open");
  }
  els.openGuide?.focus({ preventScroll: true });
  requestRender();
}

function openOntology() {
  clearAutorotationTimer();
  if (typeof els.ontologyDialog.showModal === "function") {
    els.ontologyDialog.showModal();
  } else {
    els.ontologyDialog.setAttribute("open", "");
  }
}

function closeOntology() {
  if (typeof els.ontologyDialog.close === "function" && isDialogOpen(els.ontologyDialog)) {
    els.ontologyDialog.close();
  } else {
    els.ontologyDialog.removeAttribute("open");
  }
  els.openOntology?.focus({ preventScroll: true });
  requestRender();
}

function isDialogOpen(dialog) {
  return Boolean(dialog?.open);
}

function applyRouteFromHash() {
  if (!state.ready) {
    return;
  }
  const route = parseRouteHash(window.location.hash);
  if (!route) {
    return;
  }
  const node = nodeForRoute(route);
  if (!node) {
    return;
  }
  ensureNodeVisible(node);
  selectNode(node, { center: true, focusCanvas: false, updateRoute: false });
}

function parseRouteHash(hash) {
  const match = /^#\/(topic|standard|cluster)\/(.+)$/.exec(hash ?? "");
  if (!match) {
    return null;
  }
  try {
    return { kind: match[1], id: decodeURIComponent(match[2]) };
  } catch {
    return null;
  }
}

function nodeForRoute(route) {
  if (route.kind === "topic") {
    return state.nodeById.get(route.id) ?? null;
  }
  if (route.kind === "standard") {
    return state.nodes
      .filter((node) => node.standard === route.id)
      .sort(compareNodesForLayout)[0] ?? null;
  }
  if (route.kind === "cluster") {
    return state.nodes
      .filter((node) => Array.isArray(node.clusters) && node.clusters.includes(route.id))
      .sort(compareNodesForLayout)[0] ?? null;
  }
  return null;
}

function ensureNodeVisible(node) {
  let changed = false;
  if (!state.activeSubjects.has(node.subject)) {
    state.activeSubjects.add(node.subject);
    changed = true;
  }
  if (!state.activeGrades.has(node.grade)) {
    state.activeGrades.add(node.grade);
    changed = true;
  }
  if (!changed) {
    return;
  }
  syncFilterButtons();
  updateVisibleGraph();
  renderTopicList();
}

function replaceRouteHash(kind, id) {
  const nextHash = `#/${kind}/${encodeURIComponent(id)}`;
  if (window.location.hash === nextHash) {
    return;
  }
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${nextHash}`);
}

function clearRouteHash() {
  if (!parseRouteHash(window.location.hash)) {
    return;
  }
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
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

function render(timestamp = performance.now()) {
  state.renderQueued = false;
  updateAutorotation(timestamp);
  const { width, height, dpr } = state.size;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = GRAPH_BACKGROUND;
  ctx.fillRect(0, 0, width, height);

  if (!state.ready) {
    updateZoomLabel();
    scheduleAutorotationFrame();
    return;
  }

  prepareProjectedNodes();
  drawEdges();
  drawHighlightedEdges();
  drawNodes();
  updateZoomLabel();
  scheduleAutorotationFrame();
}

function updateAutorotation(timestamp) {
  if (!shouldAutorotate()) {
    state.lastRenderTime = timestamp;
    return;
  }
  if (timestamp < state.interactionPauseUntil) {
    state.lastRenderTime = timestamp;
    return;
  }
  const delta = state.lastRenderTime ? Math.min(48, timestamp - state.lastRenderTime) : 16;
  state.view.yaw = normalizeAngle(state.view.yaw + delta * AUTO_ROTATION_SPEED);
  state.lastRenderTime = timestamp;
}

function scheduleAutorotationFrame() {
  if (!shouldAutorotate()) {
    clearAutorotationTimer();
    return;
  }
  const delay = state.interactionPauseUntil - performance.now();
  if (delay > 0) {
    if (!state.autorotateTimer) {
      state.autorotateTimer = window.setTimeout(() => {
        state.autorotateTimer = null;
        requestRender();
      }, delay);
    }
    return;
  }
  state.renderQueued = true;
  requestAnimationFrame(render);
}

function shouldAutorotate() {
  return !reducedMotion
    && !document.hidden
    && state.ready
    && state.mode === "map"
    && !state.listView
    && !state.selectedId
    && !state.hoveredId
    && state.pointers.size === 0
    && !state.drag
    && !state.pinch
    && !isDialogOpen(els.guideDialog)
    && !isDialogOpen(els.ontologyDialog)
    && state.visibleNodes.length > 0;
}

function pauseAutorotation() {
  state.interactionPauseUntil = performance.now() + AUTO_ROTATION_PAUSE_MS;
  clearAutorotationTimer();
}

function clearAutorotationTimer() {
  if (state.autorotateTimer) {
    window.clearTimeout(state.autorotateTimer);
    state.autorotateTimer = null;
  }
}

function prepareProjectedNodes() {
  state.projectedNodes = state.visibleNodes
    .map((node) => {
      const projected = worldToScreen(node);
      return {
        ...projected,
        node,
        radius: projectedNodeRadius(node, projected),
      };
    })
    .sort((a, b) => a.depth - b.depth || a.node.id.localeCompare(b.node.id));
  state.projectedNodeById = new Map(state.projectedNodes.map((point) => [point.node.id, point]));
}

function drawEdges() {
  const focusId = visibleFocusId();
  ctx.save();
  ctx.strokeStyle = focusId
    ? "rgba(244, 241, 234, 0.018)"
    : "rgba(190, 217, 255, 0.062)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (const edge of state.visibleEdges) {
    const from = state.projectedNodeById.get(edge.fromNode.id);
    const to = state.projectedNodeById.get(edge.toNode.id);
    if (!from || !to) {
      continue;
    }
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
  const focusId = visibleFocusId();
  if (!focusId) {
    return;
  }
  const incoming = state.incoming.get(focusId) ?? [];
  const outgoing = state.outgoing.get(focusId) ?? [];
  drawEdgeSet(incoming, "rgba(244, 241, 234, 0.88)", 1.35);
  drawEdgeSet(outgoing, RED, 1.55);
}

function drawEdgeSet(edges, color, width) {
  for (const level of ["required", "recommended"]) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = level === "required" ? 1 : 0.82;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.setLineDash([]);
    ctx.beginPath();
    for (const edge of edges) {
      if (edge.requirementLevel !== level || !state.visibleNodeIds.has(edge.from) || !state.visibleNodeIds.has(edge.to)) {
        continue;
      }
      const from = state.projectedNodeById.get(edge.fromNode.id);
      const to = state.projectedNodeById.get(edge.toNode.id);
      if (!from || !to || !lineNearViewport(from, to)) {
        continue;
      }
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function drawNodes() {
  ctx.save();
  const focus = focusNodeContext();
  for (const projected of state.projectedNodes) {
    const { node } = projected;
    if (!pointNearViewport(projected, 24)) {
      continue;
    }
    const isSelected = node.id === state.selectedId;
    const isHovered = node.id === state.hoveredId;
    const isPrerequisite = focus.prerequisites.has(node.id);
    const isUnlock = focus.unlocks.has(node.id);
    const status = topicStatus(node.id);
    const favorite = isFavorite(node.id);
    const radius = isSelected ? projected.radius + 3.3 : isHovered ? projected.radius + 2.4 : projected.radius;
    const baseAlpha = depthAlpha(projected.depth);
    const alpha = focus.id
      ? isSelected || isHovered
        ? 1
        : isPrerequisite || isUnlock
          ? 0.94
          : 0.18
      : status || favorite
        ? 0.96
        : baseAlpha;

    ctx.beginPath();
    ctx.fillStyle = node._color ?? SUBJECT_FALLBACK;
    ctx.globalAlpha = alpha;
    ctx.arc(projected.x, projected.y, radius, 0, TAU);
    ctx.fill();

    if (isSelected || isHovered) {
      ctx.globalAlpha = 0.94;
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = isSelected ? GRAPH_INK : node._color ?? GRAPH_INK;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, radius + 4.2, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = isSelected ? 0.58 : 0.34;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, radius + 8.4, 0, TAU);
      ctx.stroke();
    }

    if (status || favorite || isPrerequisite || isUnlock) {
      ctx.globalAlpha = 1;
      ctx.lineWidth = favorite ? 1.6 : 1.05;
      ctx.strokeStyle = isUnlock || status === "preview" ? RED : GRAPH_INK;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, radius + 1.1, 0, TAU);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function focusNodeContext() {
  const id = visibleFocusId();
  if (!id) {
    return { id: null, prerequisites: new Set(), unlocks: new Set() };
  }
  return {
    id,
    prerequisites: new Set((state.incoming.get(id) ?? []).map((edge) => edge.prerequisiteNode.id)),
    unlocks: new Set((state.outgoing.get(id) ?? []).map((edge) => edge.dependentNode.id)),
  };
}

function visibleFocusId() {
  const id = state.selectedId ?? state.hoveredId;
  return id && state.visibleNodeIds.has(id) ? id : null;
}

function projectedNodeRadius(node, projected) {
  const status = topicStatus(node.id);
  const favorite = isFavorite(node.id);
  const depthScale = clamp(projected.scale * 1.95, 0.58, 2.25);
  const base = status || favorite ? 3.4 : 2.55;
  return base * depthScale;
}

function depthAlpha(depth) {
  return clamp(0.42 + ((depth + 760) / 1520) * 0.34, 0.28, 0.82);
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
  let nearestDistance = Infinity;
  let nearestDepth = -Infinity;
  for (const node of state.visibleNodes) {
    const screen = worldToScreen(node);
    const dx = screen.x - point.x;
    const dy = screen.y - point.y;
    const distanceSquared = dx * dx + dy * dy;
    const targetRadius = Math.max(HIT_RADIUS, projectedNodeRadius(node, screen) + 4);
    const isCloser = distanceSquared < nearestDistance - 0.5;
    const isFrontTie = Math.abs(distanceSquared - nearestDistance) <= 0.5 && screen.depth > nearestDepth;
    if (distanceSquared <= targetRadius * targetRadius && (isCloser || isFrontTie)) {
      nearest = node;
      nearestDistance = distanceSquared;
      nearestDepth = screen.depth;
    }
  }
  return nearest;
}

function worldToScreen(point) {
  return projectPoint(point.layout3d ?? point, state.view, state.size);
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
  if (els.retryData) {
    els.retryData.hidden = true;
  }
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
  if (els.retryData) {
    els.retryData.hidden = false;
  }
  requestRender();
}

function setStatus(text) {
  els.dataStatus.textContent = text;
}

function updateZoomLabel() {
  if (els.zoomLevel) {
    els.zoomLevel.textContent = `${Math.round(state.view.zoom * 100)}%`;
  }
}

function subjectColor(subjectId) {
  const payloadColor = state.subjects.find((subject) => subject.id === subjectId)?.color;
  return subjectColorForId(subjectId, payloadColor);
}

function subjectColorForId(subjectId, fallback = SUBJECT_FALLBACK) {
  return GRAPH_SUBJECT_COLORS[subjectId] ?? fallback ?? SUBJECT_FALLBACK;
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

function shortHash(value) {
  const hash = String(value ?? "");
  return hash ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : "—";
}

function formatBytes(value) {
  return `${(Number(value) / 1024 / 1024).toFixed(1)} MB`;
}
