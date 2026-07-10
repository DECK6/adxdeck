#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const read = (relativePath) => readFile(path.join(ROOT, relativePath), "utf8");

const [app, profileSchema, html, css, sitemap, readme, payloadText] = await Promise.all([
  read("learnmap/app.js"),
  read("learnmap/profile-schema.js"),
  read("learnmap/index.html"),
  read("learnmap/styles.css"),
  read("sitemap.xml"),
  read("learnmap/README.md"),
  read("learnmap/data/learnmap.json"),
]);
const payload = JSON.parse(payloadText);

assert.equal(payload.meta.counts.nodes, 1956);
assert.equal(payload.meta.counts.edges, 1894);
assert.equal(payload.meta.counts.standards, 620);
assert.equal(payload.meta.counts.clusters, 153);
assert.equal(payload.meta.schemaVersion, 2);
assert.equal(payload.meta.ontology.version, "0.3.0-p3");
assert.equal(payload.meta.ontology.rights.status, "HOLD");
assert.equal("learnerDiagnosisSupported" in payload.meta.ontology, false);
assert.doesNotMatch(payloadText, /diagnos|clinical|진단|임상|처방/i);

for (const label of ["전체 배움 지도", "우리 아이 경로", "이번 주 집에서 해볼 것"]) {
  assert(html.includes(label), `missing mode label: ${label}`);
}
for (const label of ["익숙해요", "연습 중이에요", "먼저 살펴봐요"]) {
  assert(html.includes(label), `missing topic status: ${label}`);
}
for (const marker of ["ACTION", "EVIDENCE", "PROMPT"]) {
  assert(html.includes(marker), `missing parent card marker: ${marker}`);
}
for (const label of ["왜 이 순서인가", "검토된 학습 순서 제안", "직접·간접", "필수·권장", "데이터 릴리스", "화면 데이터 해시", "Turtle / TTL", "JSON-LD"]) {
  assert(html.includes(label), `missing ontology UI label: ${label}`);
}

assert.match(app, /PROFILE_STORAGE_KEY as STORAGE_KEY/);
assert.match(profileSchema, /PROFILE_STORAGE_KEY = 'dexa\.learnmap\.v2'/);
assert.match(profileSchema, /LEGACY_PROFILE_STORAGE_KEYS = Object\.freeze\(\['dexa\.learnmap\.v1'\]\)/);
assert.match(app, /window\.localStorage\.getItem\(key\)/);
assert.match(app, /window\.localStorage\.setItem\(STORAGE_KEY/);
assert.match(app, /window\.localStorage\.removeItem\(STORAGE_KEY\)/);
assert.match(app, /window\.addEventListener\("hashchange", \(\) => applyRouteFromHash\(\)\)/);
assert.match(app, /#\/\$?\{kind\}\/\$?\{encodeURIComponent\(id\)\}/);
assert.match(app, /window\.history\.replaceState/);
assert.match(html, /서버 전송이나 계정 동기화는 하지 않습니다/);
assert.match(html, /id="topic-list-panel"/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.equal((sitemap.match(/<loc>https:\/\/dexa\.art\/learnmap\/<\/loc>/g) ?? []).length, 1);
assert.match(readme, /"version": 2/);
assert.match(readme, /v1 설정 마이그레이션/);
assert.match(readme, /진단, 성적, 처방이 아닙니다/);
assert.doesNotMatch(html, /<base\b/i);
for (const relativePath of ["./favicon.svg", "./styles.css", "./app.js"]) {
  assert(html.includes(relativePath), `missing relative page path: ${relativePath}`);
}
assert.equal(payload.meta.ontology.artifacts.turtle.href, "./ontology/learning-map.ttl");
assert.equal(payload.meta.ontology.artifacts.jsonLd.href, "./ontology/learning-map.jsonld");
assert.match(payload.nodes[0].uri, /^https:\/\/dexa\.art\/learnmap\/#\/topic\//);
assert.match(payload.standards[0].uri, /^https:\/\/dexa\.art\/learnmap\/#\/standard\//);
assert.match(payload.clusters[0].uri, /^https:\/\/dexa\.art\/learnmap\/#\/cluster\//);
assert.equal(payload.nodes.some((node) => node.pathSummary.indirectPrerequisiteExamples.length > 0), true);
assert.equal(payload.nodes.some((node) => node.pathSummary.indirectUnlockExamples.length > 0), true);
assert.doesNotMatch(app + html, /\/learnmap\/(?:topic|standard|cluster)\//);

const fetchCalls = [...app.matchAll(/\bfetch\s*\(/g)];
assert.equal(fetchCalls.length, 1, "app must have exactly one fetch call for the public JSON payload");
assert.match(app, /fetch\(DATA_URL, \{ method: "GET" \}\)/);
assert.doesNotMatch(app, /navigator\.sendBeacon|\bWebSocket\b|\bXMLHttpRequest\b/);
assert.doesNotMatch(app, /method\s*:\s*["'](?:POST|PUT|PATCH|DELETE)["']/i);

console.log(
  `learnmap parent static: PASS (${payload.meta.counts.nodes} nodes / P3 UI / relative routing + sitemap / localStorage only)`,
);
