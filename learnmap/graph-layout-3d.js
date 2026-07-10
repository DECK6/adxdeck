export const TAU = Math.PI * 2;

export const DEFAULT_CAMERA = Object.freeze({
  yaw: -0.56,
  pitch: -0.14,
  distance: 2200,
  focalLength: 1200,
  zoom: 1,
  panX: 0,
  panY: 0,
});

export const CAMERA_LIMITS = Object.freeze({
  minPitch: -0.58,
  maxPitch: 0.34,
  minZoom: 0.06,
  maxZoom: 4.8,
});

export function buildGraphLayout3D({ nodes = [], subjects = [], grades = [], clusters = [] } = {}) {
  const nodeList = [...nodes];
  const subjectIds = orderedIds(subjects, nodeList, (node) => node.subject);
  const gradeIds = orderedGradeIds(grades, nodeList);
  const subjectOrder = new Map(subjectIds.map((id, index) => [id, index]));
  const gradeOrder = new Map(gradeIds.map((id, index) => [id, index]));
  const clusterOrder = new Map(orderedIds(clusters, nodeList, firstClusterFor).map((id, index) => [id, index]));

  const subjectGradeBuckets = new Map();
  const layouts = [];

  for (const node of nodeList) {
    const gradeId = String(node.grade ?? "");
    const subjectId = String(node.subject ?? "");
    if (!gradeOrder.has(gradeId)) {
      gradeOrder.set(gradeId, gradeIds.length);
      gradeIds.push(gradeId);
    }
    if (!subjectOrder.has(subjectId)) {
      subjectOrder.set(subjectId, subjectIds.length);
      subjectIds.push(subjectId);
    }
    const key = `${gradeId}\u0000${subjectId}`;
    const bucket = subjectGradeBuckets.get(key) ?? [];
    bucket.push(node);
    subjectGradeBuckets.set(key, bucket);
  }

  const gradeCount = Math.max(1, gradeIds.length);
  for (const gradeId of gradeIds) {
    const gradeIndex = gradeOrder.get(gradeId) ?? 0;
    for (const subjectId of subjectIds) {
      const subjectIndex = subjectOrder.get(subjectId) ?? 0;
      const bucket = subjectGradeBuckets.get(`${gradeId}\u0000${subjectId}`) ?? [];
      const sorted = [...bucket].sort(compareNodesForLayout);
      const bucketSize = Math.max(1, sorted.length);

      sorted.forEach((node, rank) => {
        const clusterId = firstClusterFor(node);
        const clusterIndex = clusterOrder.get(clusterId) ?? 0;
        // Every subject ribbon traverses the full height of each grade band.
        // This interleaves subject filaments vertically instead of stacking
        // disconnected subject islands one after another.
        const localProgress = (rank + 0.5) / bucketSize;
        const progression = (gradeIndex + localProgress) / gradeCount;
        const clusterLift = (stableUnit(`${clusterId}:lift`) - 0.5) * 24;
        const nodeLift = (stableUnit(`${node.id}:lift`) - 0.5) * 14;
        const y = -740 + progression * 1480 + clusterLift + nodeLift;

        // Subjects are continuous helices rather than radial sectors. Nearby
        // domain and cluster offsets stay stable along each ribbon, while the
        // small per-subject twist-rate difference creates real interleavings.
        const subjectFraction = subjectIndex / Math.max(1, subjectIds.length);
        const subjectPhase = -Math.PI * 0.68
          + subjectFraction * TAU
          + (stableUnit(`${subjectId}:phase`) - 0.5) * 0.24;
        const twistTurns = 1.56 + (stableUnit(`${subjectId}:twist`) - 0.5) * 0.24;
        const helixAngle = progression * TAU * twistTurns
          + Math.sin(progression * TAU * 1.85 + subjectPhase) * 0.16;
        const clusterAngle = (stableUnit(`${clusterId}:angle`) - 0.5) * 0.24;
        const domainAngle = (stableUnit(`${subjectId}:${node.domain ?? ""}:domain`) - 0.5) * 0.14;
        const nodeAngle = (stableUnit(`${node.id}:angle`) - 0.5) * 0.045;
        const angle = normalizeAngle(subjectPhase + helixAngle + clusterAngle + domainAngle + nodeAngle);

        // The envelope grows steadily but remains subordinate to the vertical
        // span, preventing the upper ribbons from becoming divergent fan arms.
        const crown = Math.pow(progression, 0.82);
        const radiusBase = 34 + crown * 318;
        const subjectRadius = (stableUnit(`${subjectId}:radius`) - 0.5) * (16 + progression * 18);
        const clusterRadius = (stableUnit(`${clusterId}:radius`) - 0.5) * (18 + progression * 18);
        const laneRadius = (((clusterIndex % 7) - 3) / 3) * (5 + progression * 10);
        const domainRadius = (stableUnit(`${subjectId}:${node.domain ?? ""}:radius`) - 0.5) * (10 + progression * 10);
        const nodeRadius = (stableUnit(`${node.id}:radius`) - 0.5) * (8 + progression * 8);
        const ribbonPulse = Math.sin(progression * TAU * 2.35 + subjectPhase) * (6 + progression * 10);
        const radius = clamp(
          radiusBase + subjectRadius + clusterRadius + laneRadius + domainRadius + nodeRadius + ribbonPulse,
          28,
          420,
        );
        const filamentOffset = (stableUnit(`${node.id}:filament`) - 0.5) * (9 + progression * 12);
        const lobeSign = subjectIndex % 2 === 0 ? -1 : 1;
        const lobeAxis = -0.28 + progression * 0.52;
        const lobeStrength = smoothstep(0.69, 0.98, progression)
          * (18 + stableUnit(`${subjectId}:lobe`) * 12)
          * lobeSign;

        let x = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * filamentOffset;
        let z = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * filamentOffset;
        x += Math.cos(lobeAxis) * lobeStrength;
        z += Math.sin(lobeAxis) * lobeStrength;

        layouts.push({
          id: String(node.id),
          x,
          y,
          z,
          angle,
          radius: Math.hypot(x, z),
          progression,
          grade: gradeId,
          gradeIndex,
          gradeRank: rank,
          subject: subjectId,
          subjectIndex,
          clusterId,
        });
      });
    }
  }

  layouts.sort((a, b) => a.id.localeCompare(b.id, "en"));
  return {
    positions: new Map(layouts.map((layout) => [layout.id, layout])),
    layouts,
    bounds: boundsFor(layouts),
    metrics: layoutMetrics(layouts, gradeIds),
  };
}

export function createCamera(overrides = {}) {
  const camera = { ...DEFAULT_CAMERA, ...overrides };
  camera.pitch = clamp(camera.pitch, CAMERA_LIMITS.minPitch, CAMERA_LIMITS.maxPitch);
  camera.zoom = clamp(camera.zoom, CAMERA_LIMITS.minZoom, CAMERA_LIMITS.maxZoom);
  return camera;
}

export function fitCameraToLayout(layouts, viewport, camera = DEFAULT_CAMERA, options = {}) {
  const points = iterableLayouts(layouts);
  if (!points.length) {
    return createCamera(camera);
  }

  const padding = options.padding ?? 58;
  const rawCamera = createCamera({ ...camera, zoom: 1, panX: 0, panY: 0 });
  const projected = points.map((point) => projectPoint(point, rawCamera, viewport));
  const bounds = screenBounds(projected);
  const usableWidth = Math.max(1, viewport.width - padding * 2);
  const usableHeight = Math.max(1, viewport.height - padding * 2);
  const projectedWidth = Math.max(1, bounds.maxX - bounds.minX);
  const projectedHeight = Math.max(1, bounds.maxY - bounds.minY);
  const zoom = clamp(
    Math.min(usableWidth / projectedWidth, usableHeight / projectedHeight),
    options.minZoom ?? CAMERA_LIMITS.minZoom,
    options.maxZoom ?? CAMERA_LIMITS.maxZoom,
  );
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const rawCenterX = (bounds.minX + bounds.maxX) / 2;
  const rawCenterY = (bounds.minY + bounds.maxY) / 2;

  return createCamera({
    ...camera,
    zoom,
    panX: -(rawCenterX - centerX) * zoom,
    panY: -(rawCenterY - centerY) * zoom,
  });
}

export function projectPoint(point, camera = DEFAULT_CAMERA, viewport = { width: 1, height: 1 }) {
  const yaw = camera.yaw ?? DEFAULT_CAMERA.yaw;
  const pitch = clamp(camera.pitch ?? DEFAULT_CAMERA.pitch, CAMERA_LIMITS.minPitch, CAMERA_LIMITS.maxPitch);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const rotatedX = point.x * cy - point.z * sy;
  const rotatedZ = point.x * sy + point.z * cy;
  const pitchedY = point.y * cp - rotatedZ * sp;
  const depth = point.y * sp + rotatedZ * cp;
  const cameraZ = Math.max(96, (camera.distance ?? DEFAULT_CAMERA.distance) - depth);
  const scale = ((camera.focalLength ?? DEFAULT_CAMERA.focalLength) / cameraZ) * (camera.zoom ?? 1);

  return {
    id: point.id,
    x: viewport.width / 2 + (camera.panX ?? 0) + rotatedX * scale,
    y: viewport.height / 2 + (camera.panY ?? 0) - pitchedY * scale,
    depth,
    scale,
    cameraZ,
  };
}

export function focusYawForPosition(point) {
  return normalizeAngle(Math.atan2(point.x, point.z));
}

export function compareNodesForLayout(a, b) {
  const clusterA = firstClusterFor(a);
  const clusterB = firstClusterFor(b);
  return (
    clusterA.localeCompare(clusterB, "en") ||
    String(a.domainLabel ?? a.domain ?? "").localeCompare(String(b.domainLabel ?? b.domain ?? ""), "ko") ||
    String(a.code ?? "").localeCompare(String(b.code ?? ""), "en") ||
    String(a.type ?? "").localeCompare(String(b.type ?? ""), "en") ||
    String(a.id).localeCompare(String(b.id), "en")
  );
}

export function stableUnit(text) {
  let hash = 2166136261;
  const value = String(text ?? "");
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

export function normalizeAngle(value) {
  let angle = value;
  while (angle <= -Math.PI) angle += TAU;
  while (angle > Math.PI) angle -= TAU;
  return angle;
}

function orderedIds(records, nodes, selector) {
  const ids = [];
  const seen = new Set();
  for (const record of records ?? []) {
    const id = String(record?.id ?? "");
    if (id && !seen.has(id)) {
      ids.push(id);
      seen.add(id);
    }
  }
  for (const node of nodes) {
    const id = String(selector(node) ?? "");
    if (id && !seen.has(id)) {
      ids.push(id);
      seen.add(id);
    }
  }
  return ids;
}

function orderedGradeIds(grades, nodes) {
  const fromRecords = orderedIds(grades, nodes, (node) => node.grade);
  return fromRecords.sort((a, b) => gradeSortValue(a) - gradeSortValue(b) || a.localeCompare(b, "en"));
}

function firstClusterFor(node) {
  return String(Array.isArray(node?.clusters) ? node.clusters[0] ?? "" : "");
}

function gradeSortValue(value) {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function boundsFor(layouts) {
  return layouts.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
      minZ: Math.min(acc.minZ, point.z),
      maxZ: Math.max(acc.maxZ, point.z),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity },
  );
}

function layoutMetrics(layouts, gradeIds) {
  const byGrade = new Map(gradeIds.map((grade) => [grade, []]));
  for (const point of layouts) {
    const bucket = byGrade.get(point.grade) ?? [];
    bucket.push(point);
    byGrade.set(point.grade, bucket);
  }
  return {
    grades: [...byGrade.entries()].map(([grade, points]) => ({
      grade,
      count: points.length,
      medianY: median(points.map((point) => point.y)),
      p90Radius: quantile(points.map((point) => point.radius), 0.9),
      maxRadius: Math.max(...points.map((point) => point.radius)),
    })),
  };
}

function iterableLayouts(layouts) {
  if (!layouts) return [];
  if (layouts instanceof Map) return [...layouts.values()];
  return [...layouts];
}

function screenBounds(points) {
  return points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
}

function median(values) {
  return quantile(values, 0.5);
}

function quantile(values, q) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
