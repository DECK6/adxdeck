// Smoke tests for app.js engine logic: load app.js in a vm sandbox (no DOM, no fetch),
// inject the real data/*.json bundle, and call simulate()/decisionSummary() directly.
// Run: node tests/simulate-smoke.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import assert from "node:assert/strict";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let src = readFileSync(join(root, "app.js"), "utf8").replace(/\ninit\(\);\s*$/, "\n");
src += "\nglobalThis.__setData = (d) => { DATA = d; };\nglobalThis.__simulate = simulate;\nglobalThis.__decisionSummary = decisionSummary;\n";

const ctx = vm.createContext({
  document: { querySelector: () => null, querySelectorAll: () => [] },
  window: { addEventListener: () => {} },
  fetch: () => { throw new Error("no fetch in tests"); },
  console,
});
vm.runInContext(src, ctx);

const DATA_FILES = {
  applicability: "mice-safety-applicability.json",
  laws: "law-registry.json",
  duties: "mice-duty-master.json",
  hazards: "hazard-controls.json",
  venues: "venue-safety-rules.json",
  performanceVenues: "kopis-venue-directory.json",
  workerSafety: "worker-safety-references.json",
  localOrdinances: "local-ordinance-pack.json",
  sources: "source-registry.json",
};
ctx.__setData(Object.fromEntries(Object.entries(DATA_FILES).map(([key, file]) =>
  [key, JSON.parse(readFileSync(join(root, "data", file), "utf8"))])));

const hasId = (items, id) => items.some((item) => item.id === id);
let failures = 0;
const check = (name, fn) => {
  try { fn(); console.log(`ok - ${name}`); }
  catch (err) { failures += 1; console.error(`FAIL - ${name}: ${err.message}`); }
};

check("outdoorAdvertising -> act + signage duty", () => {
  const r = ctx.__simulate({ outdoorAdvertising: true });
  assert.equal(hasId(r.laws, "outdoor_advertisements_act"), true);
  assert.equal(hasId(r.duties, "road_traffic_and_outdoor_signage_permit"), true);
});
check("mid crowd (500) -> crowd/medical duties", () => {
  const r = ctx.__simulate({ expectedCrowd: 500 });
  assert.equal(hasId(r.duties, "mice_crowd_management_plan"), true);
  assert.equal(hasId(r.duties, "medical_aed_response_plan"), true);
});
check("personalDataProcessing does not fabricate conference, keeps privacy rule", () => {
  const r = ctx.__simulate({ personalDataProcessing: true });
  assert.equal(r.matchedEventTypes.some((event) => event.id === "conference"), false);
  assert.equal(r.matchedFeatureRules.some((rule) => rule.id === "personal_data_rule"), true);
});
check("hotWork alone infers exhibition", () => {
  const r = ctx.__simulate({ hotWork: true });
  assert.equal(r.matchedEventTypes.some((event) => event.id === "exhibition"), true);
});
check("crowd over 100k -> scope warning", () => {
  const r = ctx.__simulate({ expectedCrowd: 150000 });
  assert.equal(Array.isArray(r.scopeWarnings) && r.scopeWarnings.length > 0, true);
});
check("dataAsOf exposed from source-registry freshnessPolicy", () => {
  const r = ctx.__simulate({});
  assert.equal(r.dataAsOf, "2026-05-31");
});
check("decisionSummary recognizes outdoorAdvertising", () => {
  const cards = ctx.__decisionSummary({ outdoorAdvertising: true });
  const target = cards.find((card) => card.title.includes("도로점용"));
  assert.notEqual(target.status, "비적용");
});
process.exit(failures ? 1 : 0);
