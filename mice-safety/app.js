const DATA_FILES = {
  applicability: "data/mice-safety-applicability.json",
  laws: "data/law-registry.json",
  duties: "data/mice-duty-master.json",
  hazards: "data/hazard-controls.json",
  venues: "data/venue-safety-rules.json",
  performanceVenues: "data/kopis-venue-directory.json",
  workerSafety: "data/worker-safety-references.json",
  localOrdinances: "data/local-ordinance-pack.json",
  sources: "data/source-registry.json",
  personas: "data/nemotron-persona-sample.json"
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

const FEATURE_GROUPS = [
  ["장소·구조", [
    ["outdoorEvent", "야외(옥외)에서 진행합니까?"],
    ["roadUse", "도로·인도를 사용하거나 차량을 통제합니까?"],
    ["temporaryStructures", "무대·부스·천막 등 임시 구조물을 설치합니까?"],
    ["outdoorAdvertising", "현수막·배너·옥외 광고물을 답니까?"]
  ]],
  ["전기·화기·가스", [
    ["temporaryElectricity", "임시 전기·발전기를 사용합니까?"],
    ["hotWork", "용접·화기 작업이 있습니까?"],
    ["lpgUse", "LPG·가스를 사용합니까?"]
  ]],
  ["작업", [
    ["setupTeardown", "설치·철거 작업이 있습니까?"],
    ["workAtHeight", "사다리·고소작업 등 높은 곳 작업이 있습니까?"],
    ["heavyObjectHandling", "무거운 장비·자재를 옮깁니까?"]
  ]],
  ["운영", [
    ["foodService", "음식을 팔거나 제공합니까?"],
    ["performance", "공연이 있습니까?"],
    ["personalDataProcessing", "참가자 명단·QR·CCTV 등 개인정보를 다룹니까?"],
    ["vipSecurity", "VIP 경호·보안검색이 있습니까?"],
    ["unhostedCrowd", "주최자 없이 사람이 모이는 행사입니까?"]
  ]]
];
const FEATURES = FEATURE_GROUPS.flatMap(([, items]) => items);

const SAMPLES = {
  foodtruck: {
    eventName: "푸드트럭·먹거리 행사",
    eventTypes: ["festival"],
    expectedCrowd: 2000,
    outdoorEvent: true,
    foodService: true,
    lpgUse: true,
    temporaryElectricity: true,
    outdoorAdvertising: true
  },
  fleamarket: {
    eventName: "플리마켓·장터",
    eventTypes: ["festival"],
    expectedCrowd: 800,
    outdoorEvent: true,
    temporaryStructures: true,
    foodService: true,
    outdoorAdvertising: true
  },
  outdoorPerformance: {
    eventName: "야외 공연·버스킹",
    eventTypes: ["performance"],
    expectedCrowd: 3000,
    outdoorEvent: true,
    performance: true,
    temporaryStructures: true,
    temporaryElectricity: true
  },
  exhibition: {
    eventName: "전시·박람회",
    eventTypes: ["exhibition"],
    expectedCrowd: 5000,
    temporaryStructures: true,
    setupTeardown: true,
    temporaryElectricity: true,
    personalDataProcessing: true
  },
  convention: {
    eventName: "컨벤션·컨퍼런스",
    eventTypes: ["conference"],
    expectedCrowd: 1000,
    personalDataProcessing: true
  },
  unhosted: {
    eventName: "무주최 운집 대비",
    eventTypes: [],
    expectedCrowd: 10000,
    outdoorEvent: true,
    unhostedCrowd: true
  }
};

const TEMPLATES = [
  ["foodtruck", "🚚 푸드트럭·먹거리", "야외 + 음식 + 가스"],
  ["fleamarket", "🧺 플리마켓·장터", "야외 + 부스 + 음식"],
  ["outdoorPerformance", "🎤 야외 공연·버스킹", "무대 + 임시전기"],
  ["exhibition", "🏛 전시·박람회", "부스 설치·철거"],
  ["convention", "🎓 컨벤션·컨퍼런스", "실내 + 참가자 등록"],
  ["unhosted", "👥 무주최 운집 대비", "주최 없는 인파"]
];

const PERSONA_PRESETS = [
  ["national", "전국 대표 샘플", "전국 분산 샘플로 기본 사각지대를 점검합니다."],
  ["host_region", "개최 지역 중심", "입력한 관할 시도의 합성 페르소나를 우선합니다."],
  ["senior_inclusive", "고령층 포함", "65세 이상을 최소 40% 포함해 이동·휴식·의료 대응을 점검합니다."],
  ["family_inclusive", "가족 동반 포함", "자녀·다세대 가구를 최소 45% 포함해 보호자·재결합 절차를 점검합니다."],
  ["operations_workforce", "작업자·협력업체", "경비·운송·식음료·시설·의료 직군을 우선해 현장 브리핑을 점검합니다."]
];

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
  if ((input.temporaryStructures || input.setupTeardown || input.workAtHeight || input.heavyObjectHandling || input.hotWork || input.temporaryElectricity) && !hasFestivalContext && !input.performance) {
    inferred.push("exhibition");
  }
  if (input.performance) inferred.push("performance");
  if (input.foodService || input.lpgUse) inferred.push("food_event");
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

function findPerformanceVenue(venueId) {
  if (!venueId) return undefined;
  return (DATA.performanceVenues?.venues ?? []).find((venue) => venue.venueId === venueId);
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
    ...(VENUE_JURISDICTION_HINTS[filters.venueId] ?? []),
    findPerformanceVenue(filters.venueId)?.jurisdiction,
    findPerformanceVenue(filters.venueId)?.sido
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
  const performanceVenue = input.venueId ? findPerformanceVenue(input.venueId) : undefined;
  const resolvedJurisdiction = input.jurisdiction || performanceVenue?.jurisdiction;
  const resolvedVenue = venue ? {
    id: venue.id,
    name: venue.name,
    region: venue.region,
    website: venue.website,
    facilityFacts: venue.facilityFacts ?? [],
    safetyProfile: venue.safetyProfile ?? null,
    source: "venue_safety_rules"
  } : performanceVenue ? {
    id: performanceVenue.venueId,
    name: performanceVenue.name,
    region: performanceVenue.jurisdiction || performanceVenue.sido,
    website: performanceVenue.sourceUrl,
    address: performanceVenue.address,
    jurisdiction: performanceVenue.jurisdiction,
    category: performanceVenue.category,
    contact: performanceVenue.contact,
    facilityFacts: [
      performanceVenue.address ? `주소: ${performanceVenue.address}` : undefined,
      performanceVenue.category ? `KOPIS 시설 분류: ${performanceVenue.category}` : undefined,
      performanceVenue.contact ? `대표 연락처: ${performanceVenue.contact}` : undefined
    ].filter(Boolean),
    safetyProfile: {
      offlineCoverage: ["KOPIS 공연시설명·주소·관할·분류·연락처"],
      gaps: ["수용인원, 피난·소방 도면, 대관/반입/작업 안전 규정은 해당 시설 원문으로 별도 확인 필요"],
      lastReviewedAt: "KOPIS offline directory"
    },
    source: "kopis_performance_facility"
  } : null;

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
    ...(performanceVenue ? ["KCISA_KOPIS_PERFORMANCE_FACILITY"] : []),
    ...(resolvedJurisdiction || requestedEventTypes.includes("festival") ? ["LOCAL_ORDINANCE_PACK_2026"] : [])
  ]));
  const sources = findByIds(DATA.sources.sources, sourceIds);
  const venueRules = venue?.rules ?? [];
  const workerSafetyReferences = uniqueById([
    ...duties.flatMap((duty) => findWorkerSafetyReferences({ dutyId: duty.id })),
    ...hazards.flatMap((hazard) => findWorkerSafetyReferences({ hazardId: hazard.id }))
  ]);
  const localOrdinances = findLocalOrdinances({
    jurisdiction: resolvedJurisdiction,
    venueId: input.venueId,
    eventType: requestedEventTypes.includes("festival") ? "festival" : requestedEventTypes[0],
    eventTypes: requestedEventTypes,
    roadUse: input.roadUse,
    outdoor: input.outdoor,
    outdoorEvent: input.outdoorEvent,
    temporaryStructures: input.temporaryStructures,
    limit: input.jurisdiction ? 30 : 12
  });

  const scopeWarnings = [];
  if (typeof input.expectedCrowd === "number" && input.expectedCrowd > 100000) {
    scopeWarnings.push(`예상 인원 ${input.expectedCrowd.toLocaleString("ko-KR")}명은 본 도구의 검증 범위(약 10만 명)를 초과합니다. 초대형 다중운집은 별도 정밀 계획과 관계기관 사전협의가 필요합니다.`);
  }

  return {
    version: DATA.applicability.version,
    input,
    resolvedJurisdiction,
    scopeWarnings,
    dataAsOf: DATA.sources.freshnessPolicy?.appliedAt ?? "2026-05-31",
    matchedEventTypes: matchedEvents.map((event) => ({ id: event.id, label: event.label, conditions: event.conditions })),
    matchedFeatureRules: matchedFeatureRules.map((rule) => ({ id: rule.id, label: rule.label })),
    venue: resolvedVenue,
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
    ["outdoorAdvertising", "옥외광고물"],
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
      title: "도로점용/교통통제·옥외광고물",
      status: input.roadUse ? "필수 후보" : input.outdoorAdvertising ? "적용 후보" : hasOutdoor ? "조건부 확인" : "비적용",
      reason: input.roadUse ? "도로·보도·광장 점용 또는 통행 제한이 입력되었습니다." : input.outdoorAdvertising ? "현수막·배너·옥외 광고물 설치 조건이 있어 옥외광고물 신고·허가 확인이 필요합니다." : hasOutdoor ? "외부 대기열, 승하차장, 보도 점용 여부를 확인해야 합니다." : "도로점용·옥외광고물 조건이 없습니다."
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

function personaStableHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function personaAgeBand(age) {
  if (age < 35) return "19–34세";
  if (age < 50) return "35–49세";
  if (age < 65) return "50–64세";
  if (age < 75) return "65–74세";
  return "75세 이상";
}

function personaProvince(value) {
  const token = String(value ?? "").replace(/\s+/g, "");
  const aliases = {
    서울특별시: "서울", 부산광역시: "부산", 대구광역시: "대구", 인천광역시: "인천",
    광주광역시: "광주", 대전광역시: "대전", 울산광역시: "울산", 세종특별자치시: "세종",
    경기도: "경기", 강원특별자치도: "강원", 강원도: "강원", 충청북도: "충북", 충청남도: "충남",
    전북특별자치도: "전북", 전라북도: "전북", 전라남도: "전남", 경상북도: "경북", 경상남도: "경남",
    제주특별자치도: "제주"
  };
  const exact = Object.keys(aliases).find((key) => token.includes(key));
  return exact ? aliases[exact] : token.replace(/특별자치도|특별자치시|특별시|광역시|도/g, "");
}

function personaFamilySignal(persona) {
  return /자녀|3세대|한부모|모와|부와/.test(persona.familyType ?? "");
}

function personaPlainLanguageSignal(persona) {
  return /무학|초등학교|중학교/.test(persona.educationLevel ?? "");
}

function personaOccupationGroup(persona) {
  const value = persona.occupation ?? "";
  if (/간호|의사|의료|응급|보건/.test(value)) return "의료·응급";
  if (/경비|보안|경찰|소방/.test(value)) return "경비·보안";
  if (/운전|운송|택배|지게차|화물|물류/.test(value)) return "운송·물류";
  if (/조리|음식|식품|서비스|판매|급식/.test(value)) return "식음료·서비스";
  if (/전기|시설|건설|정비|설치|기계|청소/.test(value)) return "시설·작업";
  if (/사무|개발|연구|교사|공무원|관리|전문/.test(value)) return "사무·전문";
  return "기타";
}

function personaWorkforceSignal(persona) {
  return ["의료·응급", "경비·보안", "운송·물류", "식음료·서비스", "시설·작업"].includes(personaOccupationGroup(persona));
}

function samplePersonaCohort(input) {
  const source = DATA.personas.personas ?? [];
  const preset = input.personaPreset || "national";
  const requestedSize = Math.max(10, Math.min(200, Math.trunc(input.cohortSize || 100)));
  const seed = 20260710;
  const ordered = [...source].sort((a, b) => personaStableHash(`${seed}:${a.id}`) - personaStableHash(`${seed}:${b.id}`));
  const selected = [];
  const selectedIds = new Set();
  const warnings = [];
  const add = (items, target) => {
    for (const item of items) {
      if (selected.length >= target) break;
      if (selectedIds.has(item.id)) continue;
      selected.push(item);
      selectedIds.add(item.id);
    }
  };
  if (preset === "host_region") {
    const target = personaProvince(input.jurisdiction || "");
    if (target) add(ordered.filter((persona) => personaProvince(persona.province) === target), requestedSize);
    if (!target) warnings.push("관할 지역이 없어 전국 샘플로 보충했습니다.");
    else if (selected.length < requestedSize) warnings.push(`${target} 표본이 ${selected.length}명이라 전국 샘플로 보충했습니다.`);
  }
  if (preset === "senior_inclusive") add(ordered.filter((persona) => persona.age >= 65), Math.ceil(requestedSize * 0.4));
  if (preset === "family_inclusive") add(ordered.filter(personaFamilySignal), Math.ceil(requestedSize * 0.45));
  if (preset === "operations_workforce") add(ordered.filter(personaWorkforceSignal), Math.ceil(requestedSize * 0.5));
  add(ordered, requestedSize);
  const count = (predicate) => selected.filter(predicate).length;
  const actualSize = selected.length;
  const ratio = (value) => actualSize ? Number((value / actualSize).toFixed(3)) : 0;
  const counts = {
    senior: count((persona) => persona.age >= 65),
    verySenior: count((persona) => persona.age >= 75),
    familyCoordination: count(personaFamilySignal),
    plainLanguageSupport: count(personaPlainLanguageSignal),
    operationsWorkforce: count(personaWorkforceSignal)
  };
  const shares = Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, ratio(value)]));
  const presetMeta = PERSONA_PRESETS.find(([id]) => id === preset) ?? PERSONA_PRESETS[0];
  const profiles = [];
  const ageBands = new Set();
  for (const persona of selected) {
    const band = personaAgeBand(persona.age);
    if (ageBands.has(band)) continue;
    profiles.push({
      id: persona.id,
      ageBand: band,
      province: persona.province,
      familyType: persona.familyType,
      educationLevel: persona.educationLevel,
      occupation: persona.occupation,
      occupationGroup: personaOccupationGroup(persona)
    });
    ageBands.add(band);
    if (profiles.length >= 6) break;
  }
  for (const persona of selected) {
    if (profiles.length >= 6) break;
    if (profiles.some((profile) => profile.id === persona.id)) continue;
    profiles.push({
      id: persona.id,
      ageBand: personaAgeBand(persona.age),
      province: persona.province,
      familyType: persona.familyType,
      educationLevel: persona.educationLevel,
      occupation: persona.occupation,
      occupationGroup: personaOccupationGroup(persona)
    });
  }
  return {
    preset,
    presetLabel: presetMeta[1],
    presetDescription: presetMeta[2],
    actualSize,
    counts,
    shares,
    profiles,
    warnings,
    provenance: DATA.personas.provenance,
    limitations: DATA.personas.limitations ?? []
  };
}

function staticPlanCoverageText(result) {
  return [
    ...result.duties.flatMap((item) => [item.title, item.requiredWhen]),
    ...result.hazards.flatMap((item) => [item.label, ...(item.controls ?? [])]),
    ...result.venueRules.flatMap((item) => [item.summary, ...(item.checkpoints ?? [])]),
    ...result.workerSafetyReferences.flatMap((item) => [item.title, item.summary]),
    "현장 방송 문자 전광판 스태프 안내",
    "한국어 English 日本語 中文 다국어 방문객 안전 안내"
  ].filter(Boolean).join(" ");
}

function buildPersonaStressTest(input, result) {
  const cohort = samplePersonaCohort(input);
  const text = staticPlanCoverageText(result);
  const findings = [];
  const hasAny = (terms) => terms.some((term) => text.includes(term));
  const hasAtLeast = (terms, needed) => terms.filter((term) => text.includes(term)).length >= needed;
  const add = (id, title, priority, covered, recommendation, sentinel = false, audienceShare) => findings.push({
    id, title, priority, status: covered ? "covered" : "gap", recommendation, sentinel, audienceShare
  });
  if (cohort.shares.senior >= 0.15 || cohort.shares.verySenior >= 0.05) {
    add("senior_assisted_egress", "고령층 보조 이동·단계적 대피", "high",
      hasAny(["이동지원", "보조 이동", "대피 도우미"]) && hasAny(["고령자", "노약자"]),
      "대피 도우미, 계단 회피 대안, 휴식 지점, 승강기 정지 시 이동지원 절차를 명시하세요.", false, cohort.shares.senior);
    add("channel_redundancy", "방송·표지·대면 안내 중복", "medium",
      hasAtLeast(["방송", "안내판", "문자", "전광판", "스태프"], 3),
      "앱·문자만 의존하지 말고 방송, 큰 글자 안내판, 전광판, 스태프 구두 안내를 같은 행동 문구로 맞추세요.", false, cohort.shares.senior);
  }
  if ((input.outdoor || input.outdoorEvent) && cohort.counts.senior > 0) {
    add("outdoor_rest_medical", "옥외 휴식·폭염·의료 여유", "high",
      hasAny(["그늘", "휴식구역", "냉방쉼터"]) && hasAny(["폭염", "온열질환", "의료"]),
      "그늘·좌석·급수·냉방쉼터와 온열질환 관찰, 의료 이송 기준을 동선도와 런시트에 넣으세요.", false, cohort.shares.senior);
  }
  if (cohort.shares.familyCoordination >= 0.2) {
    add("family_reunification", "미아·보호자 인계·가족 재결합", "high",
      hasAny(["가족 재결합", "보호자 인계", "미아", "실종자"]),
      "가족 분리 신고, 보호자 신원 확인, 재결합 장소와 개인정보 보호 절차를 추가하세요.", false, cohort.shares.familyCoordination);
  }
  if (cohort.shares.plainLanguageSupport >= 0.1) {
    add("plain_language_pictogram", "쉬운 한국어·그림문자", "medium",
      hasAny(["쉬운 한국어", "그림문자", "픽토그램", "행동형 문구"]),
      "안내문을 한 문장 한 행동 원칙으로 줄이고 출구·금지·대기·도움 요청을 그림문자와 함께 제공하세요.", false, cohort.shares.plainLanguageSupport);
  }
  if (cohort.preset === "operations_workforce" || input.setupTeardown) {
    add("workforce_briefing", "작업자·협력업체 브리핑", "medium",
      hasAny(["TBM", "작업 전 교육", "작업자 안전교육"]) && hasAny(["작업중지", "비상연락"]),
      "협력업체별 TBM, 작업중지권, 비상연락, 교대 인수인계를 훈련 시나리오로 만드세요.", false, cohort.shares.operationsWorkforce);
  }
  add("accessibility_sentinel", "장애·이동 접근성 센티널", "high",
    hasAny(["휠체어", "이동약자"]) && hasAny(["시각장애", "청각장애", "수어", "촉지도"]),
    "휠체어, 시각·청각 장애, 보조견, 이동지원 대피를 고정 테스트 케이스로 검증하세요.", true);
  add("child_guardian_sentinel", "아동·보호자 센티널", "high",
    hasAny(["아동", "영유아"]) && hasAny(["보호자", "미아", "가족 재결합"]),
    "성인 전용 데이터셋의 공백을 보완하도록 아동 분리, 유모차, 보호자 인계 시나리오를 항상 실행하세요.", true);
  add("non_korean_sentinel", "비한국어 방문객 센티널", "medium",
    hasAny(["다국어", "English", "日本語", "中文"]) && hasAny(["그림문자", "픽토그램", "통역"]),
    "다국어 문구, 그림문자, 통역·도움 요청 지점을 고정 점검하세요.", true);
  const weights = { high: 3, medium: 2, low: 1 };
  const totalWeight = findings.reduce((sum, finding) => sum + weights[finding.priority], 0);
  const coveredWeight = findings.filter((finding) => finding.status === "covered").reduce((sum, finding) => sum + weights[finding.priority], 0);
  return {
    cohort,
    findings,
    gaps: findings.filter((finding) => finding.status === "gap"),
    covered: findings.filter((finding) => finding.status === "covered"),
    score: totalWeight ? Math.round((coveredWeight / totalWeight) * 100) : 100
  };
}

function renderPersonaPanel(stress, focused = false) {
  const { cohort, gaps, covered } = stress;
  const pct = (value) => `${Math.round(Number(value || 0) * 100)}%`;
  const body = [
    '<section class="card persona-audit" id="persona-audit">',
    '<div class="card-topline"><div><p class="eyebrow">Synthetic audience safety QA</p><h2>한국형 관람객 안전 스트레스 테스트</h2></div>',
    `<span class="pill">${escapeHtml(stress.score)}/100</span></div>`,
    `<p><strong>${escapeHtml(cohort.presetLabel)}</strong> ${escapeHtml(cohort.actualSize)}명 · 실제 참석자 예측이 아닌 합성 계획서 QA</p>`,
    '<div class="chips">',
    [
      `고령층 ${pct(cohort.shares.senior)}`,
      `가족·보호자 ${pct(cohort.shares.familyCoordination)}`,
      `쉬운 안내 지원 ${pct(cohort.shares.plainLanguageSupport)}`,
      `현장 직군 ${pct(cohort.shares.operationsWorkforce)}`
    ].map((item) => chip(item)).join(""),
    '</div>',
    cohort.warnings.map((warning) => `<div class="notice">${escapeHtml(warning)}</div>`).join(""),
    '</section>',
    '<section class="card"><h2>사람 중심 보완 필요</h2><div class="list">',
    gaps.length ? gaps.map((finding) => card(
      finding.title,
      finding.sentinel ? "필수 센티널" : finding.priority,
      finding.recommendation,
      finding.priority === "high" ? "tone-danger" : "tone-warning"
    )).join("") : '<p class="muted">주요 페르소나 QA 공백 없음</p>',
    '</div></section>',
    '<section class="card"><h2>확인된 항목</h2><div class="chips">',
    covered.length ? covered.map((finding) => chip(finding.title, "good")).join("") : '<span class="muted">확인된 항목 없음</span>',
    '</div></section>',
    '<details class="collapsed-section"' + (focused ? " open" : "") + '><summary>대표 합성 프로필</summary><div class="grid">',
    cohort.profiles.map((profile) => card(
      `${profile.ageBand} · ${profile.province}`,
      profile.occupationGroup,
      [profile.familyType, profile.educationLevel, profile.occupation].filter(Boolean).join(" / ")
    )).join(""),
    '</div></details>',
    '<section class="card"><div class="notice">아동·장애 접근성·비한국어 방문객은 표본 빈도와 무관하게 필수 센티널로 검사합니다. 이 점수는 법적 적합성 또는 실제 사고확률 점수가 아닙니다.</div>',
    `<details class="evidence"><summary>데이터 출처·제약</summary><p>NVIDIA ${escapeHtml(cohort.provenance?.dataset || "Nemotron-Personas-Korea")} · revision ${escapeHtml(String(cohort.provenance?.revision || "확인 필요").slice(0, 12))} · ${escapeHtml(cohort.provenance?.license || "license 확인 필요")}</p>${list(cohort.limitations)}</details>`,
    '</section>'
  ].join("");
  return body;
}

function lawRefEvidence(lawRefs) {
  const lines = [];
  for (const ref of lawRefs ?? []) {
    const [lawId, article] = String(ref).split(":");
    const law = DATA.laws.laws.find((item) => item.id === lawId);
    if (!law) continue;
    const articleEntry = article ? (law.articles ?? []).find((item) => item.article === article) : undefined;
    lines.push(`${law.shortName ?? law.name ?? lawId}${article ? ` ${article}` : ""}${articleEntry?.summary ? ` — ${articleEntry.summary}` : ""}`);
  }
  return lines;
}

function buildPriorityActions(input, result) {
  const actions = [];
  for (const item of result.localOrdinances.slice(0, 3)) {
    actions.push({
      title: `관할 조례 확인: ${item.jurisdiction}`,
      detail: `${item.name ?? item.ordinanceName ?? "조례"} / 제출기한 ${item.submissionDeadline ?? "확인 필요"}`,
      evidence: {
        lines: [
          item.name ?? item.ordinanceName ?? "조례",
          `관할: ${item.jurisdiction ?? "확인 필요"}`,
          `제출기한: ${item.submissionDeadline ?? "확인 필요"}`,
          `시행일: ${item.effectiveAt ?? "확인 필요"}`,
          ...(item.appliesWhen ? [`적용 조건: ${item.appliesWhen}`] : [])
        ],
        link: item.sourceUrl
      }
    });
  }
  for (const duty of result.duties.slice(0, 5)) {
    actions.push({
      title: duty.title ?? duty.id,
      detail: `${strictnessLabel(duty.strictness)} / ${duty.requiredWhen ?? "조건 확인 필요"}`,
      evidence: { lines: lawRefEvidence(duty.lawRefs) }
    });
  }
  for (const hazard of result.hazards.slice(0, 3)) {
    actions.push({
      title: `위험 통제: ${hazard.label ?? hazard.id}`,
      detail: hazard.controls?.[0] ?? "현장 통제대책 지정 필요",
      evidence: { lines: hazard.controls ?? [] }
    });
  }
  if (input.unhostedCrowd === true) {
    actions.unshift({
      title: "무주최 다중운집 공동대응",
      detail: "지자체·경찰·소방·교통·시설 주체의 상황판단권과 방송/차단 기준을 먼저 확정합니다.",
      evidence: { lines: ["재난안전법 제66조의11(다중운집인파사고 안전관리)"] }
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

function evidenceDetails(evidence) {
  if (!evidence || (!evidence.lines?.length && !evidence.link)) return "";
  const items = (evidence.lines ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const link = evidence.link ? `<p><a href="${escapeHtml(evidence.link)}" target="_blank" rel="noopener">원문 보기</a></p>` : "";
  return `<details class="evidence"><summary>근거 보기</summary><ul class="compact-list">${items}</ul>${link}</details>`;
}

function renderResult(result) {
  const input = result.input;
  const decisions = decisionSummary(input);
  const actions = buildPriorityActions(input, result);
  const personaStress = buildPersonaStressTest(input, result);
  const resultEl = $("#result");
  resultEl.innerHTML = [
    '<section class="card">',
    `<div class="notice">데이터 기준일 ${escapeHtml(result.dataAsOf ?? "확인 필요")} · 법령·조례·베뉴 규정은 수시로 개정됩니다. 제출 전 관할기관과 원문(법제처 law.go.kr, 지자체 고시, 베뉴 규정)을 확인하세요.</div>`,
    (result.scopeWarnings ?? []).map((warning) => `<div class="notice error">⚠ ${escapeHtml(warning)}</div>`).join(""),
    '</section>',
    '<section class="card">',
    `<h2>${escapeHtml(input.eventName || "시뮬레이션 결과")}</h2>`,
    `<div class="chips">${inputFlags(input).map((item) => chip(item)).join("")}</div>`,
    result.venue ? `<p class="muted">베뉴: <strong>${escapeHtml(result.venue.name)}</strong> · ${escapeHtml(result.venue.region ?? "관할 확인 필요")} · ${escapeHtml(result.venue.source === "kopis_performance_facility" ? "KOPIS 공연시설 오프라인 인덱스" : "거점 베뉴 안전규정")}</p>` : "",
    '<p class="muted">자동 점수는 법적 적합성 점수가 아니라 입력 조건 대비 커버리지 점검값입니다. 최종 적용은 관할기관과 최신 원문 확인이 필요합니다.</p>',
    '</section>',
    '<section class="stats">',
    `<div class="card stat"><strong>${result.laws.length}</strong><span>적용 법령·지침</span></div>`,
    `<div class="card stat"><strong>${result.duties.length}</strong><span>의무·문서</span></div>`,
    `<div class="card stat"><strong>${result.hazards.length}</strong><span>위험요인</span></div>`,
    `<div class="card stat"><strong>${result.localOrdinances.length}</strong><span>조례 후보</span></div>`,
    '</section>',
    '<section class="card"><h2>✅ 이것부터 하세요</h2>',
    actions.length
      ? `<ol class="action-list">${actions.map((item) => `<li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.detail)}${evidenceDetails(item.evidence)}</li>`).join("")}</ol>`
      : '<p class="muted">우선 액션 후보가 없습니다.</p>',
    '</section>',
    renderPersonaPanel(personaStress),
    '<section class="card"><h2>적용/비적용 판단</h2><div class="grid">',
    decisions.map((item) => card(item.title, item.status, item.reason, toneForDecision(item.status))).join(""),
    '</div></section>',
    '<details class="collapsed-section"><summary>주요 위험요인</summary><div class="grid">',
    result.hazards.slice(0, 8).map((hazard) => card(hazard.label ?? hazard.id, hazard.riskLevel ?? "확인", hazard.controls?.[0] ?? "통제대책 확인 필요", toneForRisk(hazard.riskLevel))).join("") || '<p class="muted">조건부 위험요인 없음</p>',
    '</div></details>',
    '<details class="collapsed-section"><summary>의무 문서·체크리스트</summary><div class="list">',
    result.duties.slice(0, 10).map((duty) => card(duty.title ?? duty.id, strictnessLabel(duty.strictness), duty.requiredWhen ?? "적용 조건 확인 필요", ["statutory_required", "local_required"].includes(duty.strictness) ? "tone-good" : "tone-muted")).join("") || '<p class="muted">조건부 문서 없음</p>',
    '</div></details>',
    '<details class="collapsed-section"><summary>법령·조례 근거</summary><div class="grid">',
    result.laws.slice(0, 10).map((law) => card(law.shortName ?? law.name ?? law.id, law.verificationStatus ?? "확인", law.miceUse ?? "MICE 적용 근거 확인 필요", "tone-muted")).join(""),
    result.localOrdinances.slice(0, 6).map((ord) => card(ord.jurisdiction ?? "지자체", ord.categoryLabel ?? "조례", `${ord.name ?? ord.ordinanceName ?? "조례"} / 제출기한: ${ord.submissionDeadline ?? "확인 필요"}`, ord.priorityBand === "primary" ? "tone-warning" : "tone-muted")).join(""),
    '</div></details>',
    '<details class="collapsed-section"><summary>베뉴 체크포인트·작업자 안전</summary><div class="grid">',
    `<div class="mini-card"><h3>베뉴 체크포인트</h3>${result.venue?.facilityFacts?.length ? list(result.venue.facilityFacts) : ""}${result.venueRules.length ? list(result.venueRules.slice(0, 8).map((rule) => rule.summary ?? rule.id)) : '<p class="muted">세부 베뉴 규정 후보 없음. KOPIS 공연시설은 주소·관할·분류까지만 제공하므로 수용인원·피난·반입·작업 규정은 시설 원문 확인이 필요합니다.</p>'}</div>`,
    `<div class="mini-card"><h3>작업자 안전 근거</h3>${result.workerSafetyReferences.length ? list(result.workerSafetyReferences.slice(0, 8).map((ref) => `${ref.title} — ${ref.summary}`)) : '<p class="muted">설치·철거/고소/전기/화기/중량물 조건 없음</p>'}</div>`,
    '</div></details>',
    '<section class="card"><div class="notice">이 결과는 안전관리 실무 초안입니다. 법률 자문이나 관할기관 승인을 대체하지 않으며, 실제 도면·배치·운영계획으로 보정해야 합니다.</div></section>'
  ].join("");
}

function renderCheckboxes(target, items, checked = []) {
  target.innerHTML = items.map(([value, label]) =>
    `<label class="check"><input type="checkbox" value="${escapeHtml(value)}"${checked.includes(value) ? " checked" : ""}> ${escapeHtml(label)}</label>`
  ).join("");
}

function renderFeatureGroups(target) {
  target.innerHTML = FEATURE_GROUPS.map(([groupLabel, items]) =>
    `<fieldset class="field-group"><legend>${escapeHtml(groupLabel)}</legend>${items.map(([value, label]) =>
      `<label class="check"><input type="checkbox" value="${escapeHtml(value)}"> ${escapeHtml(label)}</label>`
    ).join("")}</fieldset>`
  ).join("");
}

function renderTemplateCards(target) {
  target.innerHTML = TEMPLATES.map(([key, title, desc]) =>
    `<button type="button" class="template-card" data-sample="${escapeHtml(key)}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(desc)}</span></button>`
  ).join("");
}

function formInput() {
  const eventTypes = Array.from(document.querySelectorAll("#eventTypes input:checked")).map((item) => item.value);
  const input = {
    eventName: $("#eventName").value.trim() || undefined,
    eventTypes,
    venueId: $("#venueId").value || undefined,
    jurisdiction: $("#jurisdiction").value.trim() || undefined,
    expectedCrowd: $("#expectedCrowd").value ? Number($("#expectedCrowd").value) : undefined,
    personaPreset: $("#personaPreset").value || "national",
    cohortSize: $("#cohortSize").value ? Number($("#cohortSize").value) : 100
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
  if (input.personaPreset) $("#personaPreset").value = input.personaPreset;
  if (input.cohortSize) $("#cohortSize").value = input.cohortSize;
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

function runPersonaSimulation() {
  if (!DATA) return;
  $("#status").textContent = "관람객 QA 중";
  try {
    const input = formInput();
    const result = simulate(input);
    const stress = buildPersonaStressTest(input, result);
    $("#result").innerHTML = renderPersonaPanel(stress, true);
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
  renderFeatureGroups($("#featureFlags"));
  renderTemplateCards($("#templateCards"));
  $("#personaPreset").innerHTML = PERSONA_PRESETS.map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`).join("");
  $("#sim-form").addEventListener("submit", runSimulation);
  $("#personaBtn").addEventListener("click", runPersonaSimulation);
  $("#personaPreset").addEventListener("change", () => {
    const preset = PERSONA_PRESETS.find(([id]) => id === $("#personaPreset").value) ?? PERSONA_PRESETS[0];
    $("#personaDescription").textContent = `${preset[2]} 실제 참석자 예측에는 사용하지 않습니다.`;
  });
  $("#printBtn").addEventListener("click", () => window.print());
  let printOpenedDetails = [];
  window.addEventListener("beforeprint", () => {
    printOpenedDetails = Array.from(document.querySelectorAll("details:not([open])"));
    for (const detail of printOpenedDetails) detail.open = true;
  });
  window.addEventListener("afterprint", () => {
    for (const detail of printOpenedDetails) detail.open = false;
    printOpenedDetails = [];
  });
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
    const performanceVenues = DATA.performanceVenues.venues ?? [];
    const jurisdictions = Array.from(new Set((DATA.localOrdinances.records ?? [])
      .map((item) => item.jurisdiction)
      .filter(Boolean))).sort((a, b) => a.localeCompare(b, "ko"));
    $("#venueId").innerHTML = '<option value="">베뉴 미지정</option>'
      + `<optgroup label="MICE 거점 베뉴">${venues.map((venue) =>
      `<option value="${escapeHtml(venue.id)}">${escapeHtml(`${venue.name} / ${venue.region}`)}</option>`
    ).join("")}</optgroup>`
      + `<optgroup label="KOPIS 공연시설 ${performanceVenues.length.toLocaleString("ko-KR")}곳">${performanceVenues.map((venue) =>
      `<option value="${escapeHtml(venue.venueId)}">${escapeHtml(`${venue.name} / ${venue.jurisdiction || venue.sido || "관할 미상"}`)}</option>`
    ).join("")}</optgroup>`;
    $("#jurisdictionOptions").innerHTML = jurisdictions.map((item) => `<option value="${escapeHtml(item)}"></option>`).join("");
    applyInput(SAMPLES.exhibition);
    runSimulation();
  } catch (err) {
    $("#result").innerHTML = `<div class="notice error">데이터를 불러오지 못했습니다: ${escapeHtml(err.message || err)}</div>`;
    $("#status").textContent = "데이터 오류";
  }
}

init();
