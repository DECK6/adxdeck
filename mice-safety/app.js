const DATA_FILES = {
  applicability: "data/mice-safety-applicability.json",
  laws: "data/law-registry.json",
  duties: "data/mice-duty-master.json",
  hazards: "data/hazard-controls.json",
  venues: "data/venue-safety-rules.json",
  workerSafety: "data/worker-safety-references.json",
  localOrdinances: "data/local-ordinance-pack.json",
  sources: "data/source-registry.json"
};

const EVENT_TYPES = [
  ["exhibition", "전시·박람회"],
  ["conference", "컨벤션·회의"],
  ["festival", "축제"],
  ["outdoor_event", "옥외행사"],
  ["performance", "공연"],
  ["food_event", "식음료"],
  ["vip_event", "VIP"]
];

const FEATURES = [
  ["outdoorEvent", "완전/부분 옥외"],
  ["roadUse", "도로점용·교통통제"],
  ["temporaryStructures", "임시구조물"],
  ["temporaryElectricity", "임시전기"],
  ["setupTeardown", "설치·철거 작업"],
  ["workAtHeight", "고소작업"],
  ["heavyObjectHandling", "중량물·하역"],
  ["hotWork", "화기작업"],
  ["foodService", "식음료 판매"],
  ["lpgUse", "LPG 사용"],
  ["performance", "무대·공연"],
  ["personalDataProcessing", "개인정보 처리"],
  ["vipSecurity", "VIP·보안검색"],
  ["unhostedCrowd", "무주최 다중운집"]
];

const SAMPLES = {
  indoor: {
    eventName: "실내 전시회 시뮬레이션",
    eventTypes: ["exhibition"],
    venueId: "coex",
    jurisdiction: "서울특별시 강남구",
    expectedCrowd: 6000,
    temporaryStructures: true,
    temporaryElectricity: true,
    setupTeardown: true,
    workAtHeight: true,
    heavyObjectHandling: true,
    personalDataProcessing: true
  },
  festival: {
    eventName: "옥외축제 시뮬레이션",
    eventTypes: ["festival", "outdoor_event", "food_event"],
    jurisdiction: "경기도 고양시",
    expectedCrowd: 8000,
    outdoorEvent: true,
    roadUse: true,
    temporaryStructures: true,
    temporaryElectricity: true,
    setupTeardown: true,
    foodService: true,
    lpgUse: true
  },
  vip: {
    eventName: "VIP 컨벤션 시뮬레이션",
    eventTypes: ["conference", "vip_event"],
    venueId: "kintex",
    jurisdiction: "경기도 고양시",
    expectedCrowd: 1200,
    personalDataProcessing: true,
    vipSecurity: true
  },
  unhosted: {
    eventName: "역세권 무주최 다중운집 시뮬레이션",
    eventTypes: ["outdoor_event"],
    jurisdiction: "서울특별시 중구",
    expectedCrowd: 10000,
    outdoorEvent: true,
    unhostedCrowd: true
  }
};

const VENUE_JURISDICTION_HINTS = {
  coex: ["서울특별시 강남구", "서울특별시"],
  setec: ["서울특별시 강남구", "서울특별시"],
  atcenter: ["서울특별시 서초구", "서울특별시"],
  kintex: ["경기도 고양시", "경기도"],
  suwon_convention_center: ["경기도 수원시", "경기도"],
  suwonmesse: ["경기도 수원시", "경기도"],
  bexco: ["부산광역시 해운대구", "부산광역시"],
  kdjcenter: ["광주광역시 서구", "광주광역시"],
  ueco: ["울산광역시 울주군", "울산광역시"],
  songdo_convensia: ["인천광역시 연수구", "인천광역시"],
  dcc: ["대전광역시 유성구", "대전광역시"],
  osco: ["경상북도 포항시", "경상북도"],
  exco: ["대구광역시 북구", "대구광역시"],
  hico: ["경상북도 경주시", "경상북도"],
  gumico: ["경상북도 구미시", "경상북도"],
  ceco: ["경상남도 창원시", "경상남도"],
  gsco: ["전북특별자치도 군산시", "전북특별자치도"],
  icc_jeju: ["제주특별자치도 서귀포시", "제주특별자치도"],
  yeosu_expo: ["전라남도 여수시", "전라남도"]
};

const STRICTNESS_LABELS = {
  statutory_required: "법정 의무",
  administrative_rule: "행정규칙/매뉴얼",
  local_required: "지자체·인허가 확인",
  venue_required: "베뉴 승인/규정",
  common_best_practice: "운영 모범관행",
  needs_review: "요건 검토 필요"
};

let DATA = null;

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[ch]));

function normalizeEventType(eventType) {
  return eventType === "outdoor_event" ? "festival" : eventType;
}

function uniqueById(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function strictnessRank(strictness) {
  return {
    statutory_required: 0,
    local_required: 1,
    venue_required: 2,
    administrative_rule: 3,
    needs_review: 4,
    common_best_practice: 5
  }[strictness] ?? 9;
}

function strictnessLabel(strictness) {
  return STRICTNESS_LABELS[strictness] ?? STRICTNESS_LABELS.needs_review;
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, "").trim();
}

function isJurisdictionMatch(recordJurisdiction, jurisdictionHint) {
  const record = normalizeText(recordJurisdiction);
  const hint = normalizeText(jurisdictionHint);
  return Boolean(record && hint && (record.includes(hint) || hint.includes(record)));
}

function uniqueStrings(items) {
  return Array.from(new Set(items.map((item) => String(item ?? "").trim()).filter(Boolean)));
}

function hasEventType(input, eventType) {
  return Array.isArray(input.eventTypes) && input.eventTypes.includes(eventType);
}

function eventTypeFromFlags(input) {
  const inferred = [];
  const explicit = new Set((input.eventTypes ?? []).map(normalizeEventType));
  const hasFestivalContext = explicit.has("festival") || input.outdoor || input.outdoorEvent || input.roadUse;
  if (input.outdoor || input.outdoorEvent || input.roadUse) inferred.push("festival");
  if ((input.temporaryStructures || input.setupTeardown || input.workAtHeight || input.heavyObjectHandling) && !hasFestivalContext && !input.performance) {
    inferred.push("exhibition");
  }
  if (input.performance) inferred.push("performance");
  if (input.foodService || input.lpgUse) inferred.push("food_event");
  if (input.personalDataProcessing && !input.performance && !input.foodService) inferred.push("conference");
  if (input.vipSecurity) inferred.push("vip_event");
  return inferred;
}

function isFeatureMatched(rule, input) {
  if (rule.match?.flag) return input[rule.match.flag] === true;
  if (rule.match?.field === "expectedCrowd" && rule.match.operator === ">=" && typeof rule.match.value === "number") {
    return typeof input.expectedCrowd === "number" && input.expectedCrowd >= rule.match.value;
  }
  return false;
}

function findByIds(items, ids) {
  const idSet = new Set(ids);
  return items.filter((item) => idSet.has(item.id));
}

function lawRefsFromDutiesAndHazards(items) {
  return Array.from(new Set(items.flatMap((item) => item.lawRefs ?? [])));
}

function lawIdFromRef(ref) {
  return String(ref).split(":")[0] ?? ref;
}

function sourceIdsFromItems(items) {
  return Array.from(new Set(items.flatMap((item) => item.sourceRefs ?? [])));
}

function findWorkerSafetyReferences(filters) {
  return DATA.workerSafety.references.filter((ref) => {
    if (filters.kind && ref.kind !== filters.kind) return false;
    if (filters.dutyId && !ref.relatedDutyIds.includes(filters.dutyId)) return false;
    if (filters.hazardId && !ref.relatedHazardIds.includes(filters.hazardId)) return false;
    if (filters.lawId && !ref.relatedLawRefs.some((lawRef) => lawRef.startsWith(`${filters.lawId}:`) || lawRef === filters.lawId)) return false;
    return true;
  });
}

function jurisdictionPriority(record, hints) {
  const matches = hints.filter((hint) => isJurisdictionMatch(record.jurisdiction, hint));
  if (matches.length === 0) return { score: 0, reasons: [], matches };

  const exactMatch = matches.find((hint) => normalizeText(record.jurisdiction) === normalizeText(hint));
  const cityMatch = matches.find((hint) => normalizeText(hint).includes(normalizeText(record.jurisdiction)) && normalizeText(record.jurisdiction).length > 5);
  const provinceMatch = matches.find((hint) => normalizeText(hint).includes(normalizeText(record.jurisdiction)));

  if (exactMatch) return { score: 500, reasons: [`관할 지자체 정확 매칭: ${exactMatch}`], matches };
  if (cityMatch) return { score: 430, reasons: [`기초/관할 후보 매칭: ${cityMatch}`], matches };
  if (provinceMatch) return { score: 330, reasons: [`광역 지자체 매칭: ${provinceMatch}`], matches };
  return { score: 250, reasons: [`관할 후보 부분 매칭: ${matches[0]}`], matches };
}

function categoryPriority(record, filters) {
  const eventTypes = new Set([
    ...(filters.eventType ? [normalizeEventType(filters.eventType)] : []),
    ...(filters.eventTypes ?? []).map(normalizeEventType)
  ]);
  const isOutdoor = Boolean(filters.outdoor || filters.outdoorEvent || eventTypes.has("festival"));
  const isPerformance = eventTypes.has("performance");
  const isExhibition = eventTypes.has("exhibition");
  const reasons = [];
  let score = 0;

  if (isOutdoor && ["outdoor_event_safety", "regional_festival_safety"].includes(record.categoryId)) {
    score += 170;
    reasons.push("옥외/축제 안전 조례 우선");
  }
  if (filters.roadUse && record.categoryId === "road_occupancy") {
    score += 160;
    reasons.push("도로점용/교통통제 조건 매칭");
  } else if (!filters.roadUse && record.categoryId === "road_occupancy") {
    score -= 40;
    reasons.push("도로점용 플래그 없음: 후보로만 유지");
  }
  if ((isOutdoor || isPerformance || isExhibition || filters.temporaryStructures) && record.categoryId === "outdoor_advertising") {
    score += 80;
    reasons.push("현수막·배너·안내물 조건 후보");
  }
  if (record.structuredStatus === "article_extracted") {
    score += 30;
    reasons.push("조문 발췌 보유");
  }
  return { score, reasons };
}

function findLocalOrdinances(filters) {
  const limit = filters.limit ?? 50;
  const eventTypes = new Set([
    ...(filters.eventType ? [normalizeEventType(filters.eventType)] : []),
    ...(filters.eventTypes ?? []).map(normalizeEventType)
  ]);
  const jurisdictionHints = uniqueStrings([
    filters.jurisdiction,
    ...(VENUE_JURISDICTION_HINTS[filters.venueId] ?? [])
  ]);

  const ranked = DATA.localOrdinances.records.filter((record) => {
    if (filters.categoryId && record.categoryId !== filters.categoryId) return false;
    if (eventTypes.size > 0 && !record.eventTypes.some((eventType) => eventTypes.has(normalizeEventType(eventType)))) return false;
    if (filters.dutyId && !record.dutyIds.includes(filters.dutyId)) return false;
    if (filters.hazardId && !record.hazardIds.includes(filters.hazardId)) return false;
    if (jurisdictionHints.length > 0 && !jurisdictionHints.some((hint) => isJurisdictionMatch(record.jurisdiction, hint))) return false;
    return true;
  }).map((record) => {
    const jurisdiction = jurisdictionPriority(record, jurisdictionHints);
    const category = categoryPriority(record, filters);
    const score = jurisdiction.score + category.score;
    return {
      ...record,
      priorityScore: score,
      priorityBand: score >= 580 ? "primary" : score >= 330 ? "secondary" : "reference",
      priorityReasons: [...jurisdiction.reasons, ...category.reasons],
      matchedJurisdictionHints: jurisdiction.matches
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore || a.jurisdiction.localeCompare(b.jurisdiction, "ko"));

  return ranked.slice(0, limit);
}

function simulate(input) {
  const requestedEventTypes = Array.from(new Set([
    ...(input.eventTypes ?? []).map(normalizeEventType),
    ...eventTypeFromFlags(input)
  ]));

  const matchedEvents = DATA.applicability.eventTypes.filter((event) => requestedEventTypes.includes(event.id));
  const matchedFeatureRules = DATA.applicability.featureRules.filter((rule) => isFeatureMatched(rule, input));
  const venue = input.venueId ? DATA.venues.venues.find((item) => item.id === input.venueId) : undefined;

  const conditionalLawIds = [
    ...matchedEvents.flatMap((event) => event.conditionalLawIds),
    ...matchedFeatureRules.flatMap((rule) => rule.lawIds)
  ];
  const duties = uniqueById(findByIds(DATA.duties.duties, [
    ...matchedEvents.flatMap((event) => event.dutyIds),
    ...matchedFeatureRules.flatMap((rule) => rule.dutyIds)
  ])).sort((a, b) => strictnessRank(a.strictness) - strictnessRank(b.strictness));
  const hazards = uniqueById(findByIds(DATA.hazards.hazards, [
    ...matchedEvents.flatMap((event) => event.hazardIds),
    ...matchedFeatureRules.flatMap((rule) => rule.hazardIds)
  ]));
  const lawIdsFromRefs = lawRefsFromDutiesAndHazards([...duties, ...hazards]).map(lawIdFromRef);
  const laws = uniqueById(findByIds(DATA.laws.laws, [
    ...DATA.applicability.commonLawIds,
    ...conditionalLawIds,
    ...lawIdsFromRefs
  ]));
  const sourceIds = Array.from(new Set([
    ...sourceIdsFromItems(duties),
    ...sourceIdsFromItems(hazards),
    ...(venue?.sourceRefs ?? []),
    ...(input.jurisdiction || requestedEventTypes.includes("festival") ? ["LOCAL_ORDINANCE_PACK_2026"] : [])
  ]));
  const sources = findByIds(DATA.sources.sources, sourceIds);
  const venueRules = venue?.rules ?? [];
  const workerSafetyReferences = uniqueById([
    ...duties.flatMap((duty) => findWorkerSafetyReferences({ dutyId: duty.id })),
    ...hazards.flatMap((hazard) => findWorkerSafetyReferences({ hazardId: hazard.id }))
  ]);
  const localOrdinances = findLocalOrdinances({
    jurisdiction: input.jurisdiction,
    venueId: input.venueId,
    eventType: requestedEventTypes.includes("festival") ? "festival" : requestedEventTypes[0],
    eventTypes: requestedEventTypes,
    roadUse: input.roadUse,
    outdoor: input.outdoor,
    outdoorEvent: input.outdoorEvent,
    temporaryStructures: input.temporaryStructures,
    limit: input.jurisdiction ? 30 : 12
  });

  return {
    version: DATA.applicability.version,
    input,
    matchedEventTypes: matchedEvents.map((event) => ({ id: event.id, label: event.label, conditions: event.conditions })),
    matchedFeatureRules: matchedFeatureRules.map((rule) => ({ id: rule.id, label: rule.label })),
    venue: venue ? {
      id: venue.id,
      name: venue.name,
      region: venue.region,
      website: venue.website,
      facilityFacts: venue.facilityFacts ?? [],
      safetyProfile: venue.safetyProfile ?? null
    } : null,
    laws,
    duties,
    hazards,
    venueRules,
    workerSafetyReferences,
    localOrdinances,
    sources
  };
}

function inputFlags(input) {
  const flags = [];
  if (Array.isArray(input.eventTypes)) flags.push(...input.eventTypes);
  if (input.venueId) flags.push(`베뉴 ${input.venueId}`);
  if (input.jurisdiction) flags.push(input.jurisdiction);
  if (typeof input.expectedCrowd === "number") flags.push(`${input.expectedCrowd.toLocaleString("ko-KR")}명`);
  for (const [key, label] of [
    ["outdoorEvent", "옥외"],
    ["roadUse", "도로점용"],
    ["temporaryStructures", "임시구조물"],
    ["temporaryElectricity", "임시전기"],
    ["setupTeardown", "설치·철거"],
    ["workAtHeight", "고소작업"],
    ["heavyObjectHandling", "중량물"],
    ["hotWork", "화기작업"],
    ["foodService", "식음료"],
    ["lpgUse", "LPG"],
    ["performance", "공연"],
    ["personalDataProcessing", "개인정보"],
    ["vipSecurity", "VIP/보안"],
    ["unhostedCrowd", "무주최 운집"]
  ]) {
    if (input[key] === true) flags.push(label);
  }
  return Array.from(new Set(flags));
}

function decisionSummary(input) {
  const hasOutdoor = Boolean(input.outdoor || input.outdoorEvent || hasEventType(input, "festival") || hasEventType(input, "outdoor_event"));
  const hasPerformance = Boolean(input.performance || hasEventType(input, "performance"));
  const hasFood = Boolean(input.foodService || input.lpgUse || hasEventType(input, "food_event"));
  const hasWorker = Boolean(input.setupTeardown || input.temporaryStructures || input.temporaryElectricity || input.workAtHeight || input.heavyObjectHandling || input.hotWork);
  const hasPrivacy = Boolean(input.personalDataProcessing || hasEventType(input, "conference") || hasEventType(input, "vip_event"));
  const hasVip = Boolean(input.vipSecurity || hasEventType(input, "vip_event"));
  return [
    {
      title: "옥외행사/지역축제 조례",
      status: hasOutdoor ? "적용 후보" : "비적용",
      reason: hasOutdoor ? "옥외·축제 조건이 있어 지자체 안전관리계획·협의 후보입니다." : "실내 행사 조건만 입력되어 필수로 올리지 않습니다."
    },
    {
      title: "도로점용/교통통제",
      status: input.roadUse ? "필수 후보" : hasOutdoor ? "조건부 확인" : "비적용",
      reason: input.roadUse ? "도로·보도·광장 점용 또는 통행 제한이 입력되었습니다." : hasOutdoor ? "외부 대기열, 승하차장, 보도 점용 여부를 확인해야 합니다." : "도로점용 조건이 없습니다."
    },
    {
      title: "공연법/공연 재해대처",
      status: hasPerformance ? "적용 후보" : "비적용",
      reason: hasPerformance ? "공연·무대 조건이 있어 공연 재해대처계획 후보입니다." : "공연 조건이 없어 필수로 올리지 않습니다."
    },
    {
      title: "식품위생/LPG",
      status: hasFood ? "적용 후보" : "비적용",
      reason: hasFood ? "식음료 판매, 시식, 케이터링 또는 LPG 사용 조건이 입력되었습니다." : "식음료·LPG 조건이 없어 필수로 올리지 않습니다."
    },
    {
      title: "설치·철거 작업자 안전",
      status: hasWorker ? "적용 후보" : "비적용",
      reason: hasWorker ? "부스·무대·전기·하역·고소·중량물 작업 조건이 입력되었습니다." : "작업 위험 조건이 없어 작업자 안전계획을 필수로 올리지 않습니다."
    },
    {
      title: "개인정보/CCTV",
      status: hasPrivacy ? "적용 후보" : "조건부 확인",
      reason: hasPrivacy ? "등록, QR, CCTV, 컨벤션/VIP 조건으로 개인정보 고지·위탁·보관 기준 점검이 필요합니다." : "개인정보 처리 방식이 확정될 때 적용 후보로 전환합니다."
    },
    {
      title: "VIP/보안검색",
      status: hasVip ? "적용 후보" : "조건부 확인",
      reason: hasVip ? "VIP 또는 보안검색 조건이 입력되어 출입통제·경비 운영 확인이 필요합니다." : "VIP·보안검색 조건이 없으면 제출 액션으로 올리지 않습니다."
    }
  ];
}

function buildPriorityActions(input, result) {
  const actions = [];
  for (const item of result.localOrdinances.slice(0, 3)) {
    actions.push({
      title: `관할 조례 확인: ${item.jurisdiction}`,
      detail: `${item.name ?? item.ordinanceName ?? "조례"} / 제출기한 ${item.submissionDeadline ?? "확인 필요"}`
    });
  }
  for (const duty of result.duties.slice(0, 5)) {
    actions.push({
      title: duty.title ?? duty.id,
      detail: `${strictnessLabel(duty.strictness)} / ${duty.requiredWhen ?? "조건 확인 필요"}`
    });
  }
  for (const hazard of result.hazards.slice(0, 3)) {
    actions.push({
      title: `위험 통제: ${hazard.label ?? hazard.id}`,
      detail: hazard.controls?.[0] ?? "현장 통제대책 지정 필요"
    });
  }
  if (input.unhostedCrowd === true) {
    actions.unshift({
      title: "무주최 다중운집 공동대응",
      detail: "지자체·경찰·소방·교통·시설 주체의 상황판단권과 방송/차단 기준을 먼저 확정합니다."
    });
  }
  return actions.slice(0, 10);
}

function toneForRisk(level) {
  if (/high|높|상|critical|긴급/i.test(level ?? "")) return "tone-danger";
  if (/medium|중|보통|확인/i.test(level ?? "")) return "tone-warning";
  return "tone-muted";
}

function toneForDecision(status) {
  if (/비적용/.test(status ?? "")) return "tone-muted";
  if (/조건부|확인/.test(status ?? "")) return "tone-warning";
  return "tone-good";
}

function chip(label, cls = "") {
  return `<span class="chip ${cls}">${escapeHtml(label)}</span>`;
}

function card(title, status, body, tone = "tone-muted") {
  return `<article class="mini-card ${tone}"><div class="card-topline"><strong>${escapeHtml(title)}</strong><span class="pill">${escapeHtml(status)}</span></div><p>${escapeHtml(body)}</p></article>`;
}

function list(items) {
  return `<ul class="compact-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderResult(result) {
  const input = result.input;
  const decisions = decisionSummary(input);
  const actions = buildPriorityActions(input, result);
  const resultEl = $("#result");
  resultEl.innerHTML = [
    '<section class="stats">',
    `<div class="card stat"><strong>${result.laws.length}</strong><span>적용 법령·지침</span></div>`,
    `<div class="card stat"><strong>${result.duties.length}</strong><span>의무·문서</span></div>`,
    `<div class="card stat"><strong>${result.hazards.length}</strong><span>위험요인</span></div>`,
    `<div class="card stat"><strong>${result.localOrdinances.length}</strong><span>조례 후보</span></div>`,
    '</section>',
    '<section class="card">',
    `<h2>${escapeHtml(input.eventName || "시뮬레이션 결과")}</h2>`,
    `<div class="chips">${inputFlags(input).map((item) => chip(item)).join("")}</div>`,
    '<p class="muted">자동 점수는 법적 적합성 점수가 아니라 입력 조건 대비 커버리지 점검값입니다. 최종 적용은 관할기관과 최신 원문 확인이 필요합니다.</p>',
    '</section>',
    '<section class="card"><h2>적용/비적용 판단</h2><div class="grid">',
    decisions.map((item) => card(item.title, item.status, item.reason, toneForDecision(item.status))).join(""),
    '</div></section>',
    '<section class="card"><h2>우선 액션</h2>',
    actions.length ? list(actions.map((item) => `${item.title} — ${item.detail}`)) : '<p class="muted">우선 액션 후보가 없습니다.</p>',
    '</section>',
    '<section class="card"><h2>주요 위험요인</h2><div class="grid">',
    result.hazards.slice(0, 8).map((hazard) => card(hazard.label ?? hazard.id, hazard.riskLevel ?? "확인", hazard.controls?.[0] ?? "통제대책 확인 필요", toneForRisk(hazard.riskLevel))).join("") || '<p class="muted">조건부 위험요인 없음</p>',
    '</div></section>',
    '<section class="card"><h2>의무 문서·체크리스트</h2><div class="list">',
    result.duties.slice(0, 10).map((duty) => card(duty.title ?? duty.id, strictnessLabel(duty.strictness), duty.requiredWhen ?? "적용 조건 확인 필요", ["statutory_required", "local_required"].includes(duty.strictness) ? "tone-good" : "tone-muted")).join("") || '<p class="muted">조건부 문서 없음</p>',
    '</div></section>',
    '<section class="card"><h2>법령·조례 근거</h2><div class="grid">',
    result.laws.slice(0, 10).map((law) => card(law.shortName ?? law.name ?? law.id, law.verificationStatus ?? "확인", law.miceUse ?? "MICE 적용 근거 확인 필요", "tone-muted")).join(""),
    result.localOrdinances.slice(0, 6).map((ord) => card(ord.jurisdiction ?? "지자체", ord.categoryLabel ?? "조례", `${ord.name ?? ord.ordinanceName ?? "조례"} / 제출기한: ${ord.submissionDeadline ?? "확인 필요"}`, ord.priorityBand === "primary" ? "tone-warning" : "tone-muted")).join(""),
    '</div></section>',
    '<section class="grid">',
    `<div class="card"><h2>베뉴 체크포인트</h2>${result.venueRules.length ? list(result.venueRules.slice(0, 8).map((rule) => rule.summary ?? rule.id)) : '<p class="muted">베뉴 미지정 또는 규정 후보 없음</p>'}</div>`,
    `<div class="card"><h2>작업자 안전 근거</h2>${result.workerSafetyReferences.length ? list(result.workerSafetyReferences.slice(0, 8).map((ref) => `${ref.title} — ${ref.summary}`)) : '<p class="muted">설치·철거/고소/전기/화기/중량물 조건 없음</p>'}</div>`,
    '</section>',
    '<section class="card"><div class="notice">이 결과는 안전관리 실무 초안입니다. 법률 자문이나 관할기관 승인을 대체하지 않으며, 실제 도면·배치·운영계획으로 보정해야 합니다.</div></section>'
  ].join("");
}

function renderCheckboxes(target, items, checked = []) {
  target.innerHTML = items.map(([value, label]) =>
    `<label class="check"><input type="checkbox" value="${escapeHtml(value)}"${checked.includes(value) ? " checked" : ""}> ${escapeHtml(label)}</label>`
  ).join("");
}

function formInput() {
  const eventTypes = Array.from(document.querySelectorAll("#eventTypes input:checked")).map((item) => item.value);
  const input = {
    eventName: $("#eventName").value.trim() || undefined,
    eventTypes,
    venueId: $("#venueId").value || undefined,
    jurisdiction: $("#jurisdiction").value.trim() || undefined,
    expectedCrowd: $("#expectedCrowd").value ? Number($("#expectedCrowd").value) : undefined
  };
  for (const [key] of FEATURES) {
    input[key] = Boolean(document.querySelector(`#featureFlags input[value="${key}"]`)?.checked);
  }
  if (input.outdoorEvent) input.outdoor = true;
  return input;
}

function applyInput(input) {
  $("#eventName").value = input.eventName || "";
  $("#expectedCrowd").value = input.expectedCrowd ?? "";
  $("#venueId").value = input.venueId || "";
  $("#jurisdiction").value = input.jurisdiction || "";
  for (const box of document.querySelectorAll("#eventTypes input")) box.checked = (input.eventTypes || []).includes(box.value);
  for (const box of document.querySelectorAll("#featureFlags input")) box.checked = Boolean(input[box.value]);
}

function runSimulation(event) {
  event?.preventDefault();
  if (!DATA) return;
  $("#status").textContent = "계산 중";
  try {
    renderResult(simulate(formInput()));
    $("#status").textContent = "완료";
  } catch (err) {
    $("#result").innerHTML = `<div class="notice error">${escapeHtml(err.message || err)}</div>`;
    $("#status").textContent = "오류";
  }
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} load failed`);
  return await response.json();
}

async function init() {
  renderCheckboxes($("#eventTypes"), EVENT_TYPES, ["exhibition"]);
  renderCheckboxes($("#featureFlags"), FEATURES);
  $("#sim-form").addEventListener("submit", runSimulation);
  $("#printBtn").addEventListener("click", () => window.print());
  for (const button of document.querySelectorAll("[data-sample]")) {
    button.addEventListener("click", () => {
      applyInput(SAMPLES[button.dataset.sample]);
      runSimulation();
    });
  }

  try {
    $("#status").textContent = "데이터 로드 중";
    const entries = await Promise.all(Object.entries(DATA_FILES).map(async ([key, path]) => [key, await loadJson(path)]));
    DATA = Object.fromEntries(entries);
    const venues = DATA.venues.venues ?? [];
    const jurisdictions = Array.from(new Set((DATA.localOrdinances.records ?? [])
      .map((item) => item.jurisdiction)
      .filter(Boolean))).sort((a, b) => a.localeCompare(b, "ko"));
    $("#venueId").innerHTML = '<option value="">베뉴 미지정</option>' + venues.map((venue) =>
      `<option value="${escapeHtml(venue.id)}">${escapeHtml(`${venue.name} / ${venue.region}`)}</option>`
    ).join("");
    $("#jurisdictionOptions").innerHTML = jurisdictions.map((item) => `<option value="${escapeHtml(item)}"></option>`).join("");
    applyInput(SAMPLES.indoor);
    runSimulation();
  } catch (err) {
    $("#result").innerHTML = `<div class="notice error">데이터를 불러오지 못했습니다: ${escapeHtml(err.message || err)}</div>`;
    $("#status").textContent = "데이터 오류";
  }
}

init();
