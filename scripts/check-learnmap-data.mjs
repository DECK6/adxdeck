#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildProjection } from './build-learnmap-data.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const SOURCE_DIR = path.resolve(process.argv[2] ?? process.env.LEARNMAP_DATA_DIR ?? path.join(REPO_ROOT, '..', 'korean-elementary-learning-map', 'data', 'kr'));
const OUTPUT = path.resolve(process.argv[3] ?? path.join(REPO_ROOT, 'learnmap', 'data', 'learnmap.json'));

const committed = JSON.parse(await readFile(OUTPUT, 'utf8'));
const rebuilt = await buildProjection(SOURCE_DIR);

assert.deepEqual(committed, rebuilt, 'committed projection differs from a deterministic rebuild');
assert.deepEqual(committed.meta.counts, {
  standards: 620,
  nodes: 1956,
  edges: 1894,
  clusters: 153,
});

const { meta, ...core } = committed;
const hash = createHash('sha256').update(JSON.stringify(core)).digest('hex');
assert.equal(hash, meta.payloadSha256, 'payload checksum mismatch');

const ids = new Set(committed.nodes.map((node) => node.id));
for (const edge of committed.edges) {
  assert(ids.has(edge.from), `missing edge source ${edge.from}`);
  assert(ids.has(edge.to), `missing edge target ${edge.to}`);
}

console.log(`learnmap smoke: PASS (${meta.counts.nodes} nodes / ${meta.counts.edges} edges / ${meta.payloadSha256})`);
