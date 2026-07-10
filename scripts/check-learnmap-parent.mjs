#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const read = (relativePath) => readFile(path.join(ROOT, relativePath), "utf8");

const [app, html, css, sitemap, readme, payloadText] = await Promise.all([
  read("learnmap/app.js"),
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

for (const label of ["전체 배움 지도", "우리 아이 경로", "이번 주 집에서 해볼 것"]) {
  assert(html.includes(label), `missing mode label: ${label}`);
}
for (const label of ["익숙해요", "연습 중이에요", "먼저 살펴봐요"]) {
  assert(html.includes(label), `missing topic status: ${label}`);
}
for (const marker of ["ACTION", "EVIDENCE", "PROMPT"]) {
  assert(html.includes(marker), `missing parent card marker: ${marker}`);
}

assert.match(app, /const STORAGE_KEY = "dexa\.learnmap\.v1"/);
assert.match(app, /window\.localStorage\.getItem\(STORAGE_KEY\)/);
assert.match(app, /window\.localStorage\.setItem\(STORAGE_KEY/);
assert.match(app, /window\.localStorage\.removeItem\(STORAGE_KEY\)/);
assert.match(html, /서버 전송이나 계정 동기화는 하지 않습니다/);
assert.match(html, /id="topic-list-panel"/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(sitemap, /https:\/\/dexa\.art\/learnmap\//);
assert.match(readme, /"version": 1/);
assert.match(readme, /진단, 성적, 처방이 아닙니다/);

const fetchCalls = [...app.matchAll(/\bfetch\s*\(/g)];
assert.equal(fetchCalls.length, 1, "app must have exactly one fetch call for the public JSON payload");
assert.match(app, /fetch\(DATA_URL, \{ method: "GET" \}\)/);
assert.doesNotMatch(app, /navigator\.sendBeacon|\bWebSocket\b|\bXMLHttpRequest\b/);
assert.doesNotMatch(app, /method\s*:\s*["'](?:POST|PUT|PATCH|DELETE)["']/i);

console.log(
  `learnmap parent static: PASS (${payload.meta.counts.nodes} nodes / ${payload.meta.counts.edges} edges / localStorage only)`,
);
