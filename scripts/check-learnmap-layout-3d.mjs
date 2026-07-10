#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildGraphLayout3D,
  createCamera,
  fitCameraToLayout,
  projectPoint,
} from "../learnmap/graph-layout-3d.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const payloadText = await readFile(path.join(ROOT, "learnmap", "data", "learnmap.json"), "utf8");
const payload = JSON.parse(payloadText);
const appSource = await readFile(path.join(ROOT, "learnmap", "app.js"), "utf8");
const htmlSource = await readFile(path.join(ROOT, "learnmap", "index.html"), "utf8");
const payloadBefore = JSON.stringify(payload);

const layout = buildGraphLayout3D({
  nodes: payload.nodes,
  subjects: payload.subjects,
  grades: payload.grades,
  clusters: payload.clusters,
});
const repeat = buildGraphLayout3D({
  nodes: payload.nodes,
  subjects: payload.subjects,
  grades: payload.grades,
  clusters: payload.clusters,
});
const shuffled = buildGraphLayout3D({
  nodes: [...payload.nodes].reverse(),
  subjects: payload.subjects,
  grades: payload.grades,
  clusters: payload.clusters,
});

assert.equal(JSON.stringify(payload), payloadBefore, "3D layout builder must not mutate the runtime payload");
assert.match(appSource, /function visibleFocusId\(\)/, "filtered focus must use the visible-node guard");
assert.match(appSource, /state\.pointers\.size === 0[\s\S]*!state\.drag[\s\S]*!state\.pinch/, "autorotation must stay blocked during active pointer gestures");
assert.doesNotMatch(appSource, /setLineDash\(level ===/, "direct edge levels must not reuse the indirect dash encoding");
assert.doesNotMatch(htmlSource, /legend-line indirect/, "indirect paths belong in detail summaries, not direct canvas edge encoding");
assert.equal(layout.layouts.length, 1956);
assert.equal(layout.positions.size, 1956);

const coordinateKeys = new Set();
for (const point of layout.layouts) {
  assert(Number.isFinite(point.x), `x must be finite for ${point.id}`);
  assert(Number.isFinite(point.y), `y must be finite for ${point.id}`);
  assert(Number.isFinite(point.z), `z must be finite for ${point.id}`);
  const key = `${point.x.toFixed(6)}:${point.y.toFixed(6)}:${point.z.toFixed(6)}`;
  assert.equal(coordinateKeys.has(key), false, `duplicate xyz position ${key}`);
  coordinateKeys.add(key);
}

const digest = digestLayout(layout);
assert.equal(digestLayout(repeat), digest, "layout digest changed across repeated construction");
assert.equal(digestLayout(shuffled), digest, "layout digest changed after source node order reconstruction");

const gradeMetrics = layout.metrics.grades.filter((grade) => grade.count > 0);
assert.equal(gradeMetrics.length, 3, "expected three grade bands");
for (let index = 1; index < gradeMetrics.length; index += 1) {
  assert(
    gradeMetrics[index].medianY > gradeMetrics[index - 1].medianY,
    `grade median Y must increase: ${gradeMetrics[index - 1].grade} -> ${gradeMetrics[index].grade}`,
  );
  assert(
    gradeMetrics[index].p90Radius > gradeMetrics[index - 1].p90Radius,
    `grade radial envelope must widen: ${gradeMetrics[index - 1].grade} -> ${gradeMetrics[index].grade}`,
  );
}

const yRange = layout.bounds.maxY - layout.bounds.minY;
const zRange = layout.bounds.maxZ - layout.bounds.minZ;
assert(yRange > 1400, `vertical span is too short: ${yRange.toFixed(2)}`);
assert(zRange > yRange * 0.42, `z range is degenerate: ${zRange.toFixed(2)} / ${yRange.toFixed(2)}`);
const angleBins = new Set(layout.layouts.map((point) => Math.floor(((point.angle + Math.PI) / (Math.PI * 2)) * 48)));
assert(angleBins.size >= 24, `ribbon angles are too concentrated: ${angleBins.size} bins`);

const p98Radius = quantile(layout.layouts.map((point) => point.radius), 0.98);
const compactness = (p98Radius * 2) / yRange;
assert(compactness >= 0.4, `layout collapsed into a thin column: ${compactness.toFixed(3)}`);
assert(compactness <= 0.62, `layout regressed toward a wide fan: ${compactness.toFixed(3)}`);

const progressionBands = progressionBandMetrics(layout.layouts, 5);
for (let index = 1; index < progressionBands.length; index += 1) {
  assert(
    progressionBands[index].p90Radius > progressionBands[index - 1].p90Radius,
    `progression radial envelope must widen: band ${index} -> ${index + 1}`,
  );
  assert(
    progressionBands[index].angleBins >= 32,
    `progression band ${index + 1} lost volumetric angular coverage: ${progressionBands[index].angleBins}`,
  );
}
const crown = progressionBands.at(-1);
const crownTailRatio = crown.p98Radius / crown.p90Radius;
assert(crownTailRatio <= 1.12, `crown has divergent radial arms: ${crownTailRatio.toFixed(3)}`);

const ribbonMetrics = subjectRibbonMetrics(layout.layouts);
assert(ribbonMetrics.p95Step / yRange <= 0.032, `subject ribbons are discontinuous: ${ribbonMetrics.p95Step.toFixed(2)}`);
assert(ribbonMetrics.medianTurnRate >= 1.4, `subject ribbons do not twist enough: ${ribbonMetrics.medianTurnRate.toFixed(3)} turns/span`);
assert(ribbonMetrics.turnRateSpread >= 0.1, `subject ribbons do not interleave: ${ribbonMetrics.turnRateSpread.toFixed(3)} turns/span`);

const desktopBounds = assertBoundedProjection(layout.layouts, { width: 1280, height: 800 }, "desktop");
const mobileBounds = assertBoundedProjection(layout.layouts, { width: 390, height: 844 }, "mobile");
const shortLandscapeBounds = assertBoundedProjection(layout.layouts, { width: 844, height: 195 }, "short landscape");
const desktopAspect = projectionAspect(desktopBounds);
const mobileAspect = projectionAspect(mobileBounds);
assert(desktopAspect >= 0.3 && desktopAspect <= 0.62, `desktop silhouette is not a compact tall sculpture: ${desktopAspect.toFixed(3)}`);
assert(mobileAspect >= 0.3 && mobileAspect <= 0.62, `mobile silhouette is not a compact tall sculpture: ${mobileAspect.toFixed(3)}`);

const subset = payload.nodes.filter((node) => node.subject === "Mathematics" && node.grade === "3-4");
assert(subset.length > 0, "expected a non-empty filter subset");
for (const node of subset) {
  const original = layout.positions.get(node.id);
  const reconstructed = repeat.positions.get(node.id);
  assert.deepEqual(
    pickPosition(reconstructed),
    pickPosition(original),
    `filter subset reconstruction moved ${node.id}`,
  );
}

console.log(
  [
    `learnmap 3d layout: PASS (${layout.layouts.length} xyz positions)`,
    `digest ${digest}`,
    `grade medianY ${gradeMetrics.map((item) => `${item.grade}:${item.medianY.toFixed(2)}`).join(" / ")}`,
    `p90 radius ${gradeMetrics.map((item) => `${item.grade}:${item.p90Radius.toFixed(2)}`).join(" / ")}`,
    `bands p90 radius ${progressionBands.map((item) => item.p90Radius.toFixed(2)).join(" / ")}`,
    `yRange ${yRange.toFixed(2)} zRange ${zRange.toFixed(2)} angleBins ${angleBins.size}`,
    `compactness ${compactness.toFixed(3)} crownTail ${crownTailRatio.toFixed(3)}`,
    `ribbons p95Step ${ribbonMetrics.p95Step.toFixed(2)} medianTurnRate ${ribbonMetrics.medianTurnRate.toFixed(3)} spread ${ribbonMetrics.turnRateSpread.toFixed(3)}`,
    `desktop bounds ${formatBounds(desktopBounds)} aspect ${desktopAspect.toFixed(3)}`,
    `mobile bounds ${formatBounds(mobileBounds)} aspect ${mobileAspect.toFixed(3)}`,
    `short landscape bounds ${formatBounds(shortLandscapeBounds)}`,
  ].join("\n"),
);

function digestLayout(result) {
  const serialized = result.layouts
    .map((point) => [
      point.id,
      point.x.toFixed(6),
      point.y.toFixed(6),
      point.z.toFixed(6),
      point.angle.toFixed(6),
      point.radius.toFixed(6),
      point.progression.toFixed(6),
    ].join(":"))
    .join("\n");
  return createHash("sha256").update(serialized).digest("hex");
}

function assertBoundedProjection(layouts, viewport, label) {
  const camera = fitCameraToLayout(layouts, viewport, createCamera(), { padding: 44 });
  const points = layouts.map((point) => projectPoint(point, camera, viewport));
  const bounds = points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
  for (const point of points) {
    assert(Number.isFinite(point.x), `${label} projection x must be finite`);
    assert(Number.isFinite(point.y), `${label} projection y must be finite`);
    assert(Number.isFinite(point.depth), `${label} projection depth must be finite`);
  }
  assert(bounds.minX >= 40, `${label} projection left bound escaped: ${bounds.minX}`);
  assert(bounds.maxX <= viewport.width - 40, `${label} projection right bound escaped: ${bounds.maxX}`);
  assert(bounds.minY >= 40, `${label} projection top bound escaped: ${bounds.minY}`);
  assert(bounds.maxY <= viewport.height - 40, `${label} projection bottom bound escaped: ${bounds.maxY}`);
  return bounds;
}

function pickPosition(point) {
  return {
    x: point.x.toFixed(6),
    y: point.y.toFixed(6),
    z: point.z.toFixed(6),
    angle: point.angle.toFixed(6),
    radius: point.radius.toFixed(6),
  };
}

function formatBounds(bounds) {
  return `${bounds.minX.toFixed(1)},${bounds.minY.toFixed(1)}-${bounds.maxX.toFixed(1)},${bounds.maxY.toFixed(1)}`;
}

function progressionBandMetrics(layouts, bandCount) {
  return Array.from({ length: bandCount }, (_, index) => {
    const min = index / bandCount;
    const max = (index + 1) / bandCount;
    const points = layouts.filter((point) => point.progression >= min && (index === bandCount - 1 || point.progression < max));
    return {
      count: points.length,
      p90Radius: quantile(points.map((point) => point.radius), 0.9),
      p98Radius: quantile(points.map((point) => point.radius), 0.98),
      angleBins: new Set(points.map((point) => Math.floor(((point.angle + Math.PI) / (Math.PI * 2)) * 48))).size,
    };
  });
}

function subjectRibbonMetrics(layouts) {
  const bySubject = new Map();
  for (const point of layouts) {
    const points = bySubject.get(point.subject) ?? [];
    points.push(point);
    bySubject.set(point.subject, points);
  }

  const steps = [];
  const turnRates = [];
  for (const points of bySubject.values()) {
    points.sort((a, b) => a.progression - b.progression || a.id.localeCompare(b.id, "en"));
    let accumulatedAngle = 0;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const point = points[index];
      steps.push(Math.hypot(point.x - previous.x, point.y - previous.y, point.z - previous.z));
      accumulatedAngle += circularDelta(point.angle - previous.angle);
    }
    const progressionSpan = Math.max(0.000001, points.at(-1).progression - points[0].progression);
    turnRates.push(Math.abs(accumulatedAngle) / (Math.PI * 2) / progressionSpan);
  }

  return {
    p95Step: quantile(steps, 0.95),
    medianTurnRate: quantile(turnRates, 0.5),
    turnRateSpread: Math.max(...turnRates) - Math.min(...turnRates),
  };
}

function circularDelta(angle) {
  let delta = angle;
  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  return delta;
}

function projectionAspect(bounds) {
  return (bounds.maxX - bounds.minX) / Math.max(1, bounds.maxY - bounds.minY);
}

function quantile(values, q) {
  assert(values.length > 0, "quantile requires values");
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}
