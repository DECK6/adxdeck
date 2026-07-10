#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const SOURCE_ROOT = path.resolve(
  process.argv[2] ?? process.env.LEARNMAP_ONTOLOGY_ROOT ?? path.join(ROOT, '..', 'korean-elementary-learning-map'),
);
const SOURCE_DATA = path.join(SOURCE_ROOT, 'data', 'kr');
const ONTOLOGY_DIR = path.join(ROOT, 'learnmap', 'ontology');
const INSTANCE_NAMESPACE = 'https://dexa.art/learnmap/#/';
const PUBLIC_ARTIFACTS = Object.freeze(['learning-map.jsonld', 'learning-map.ttl']);
const MAX_PATH_EXAMPLES = 3;

const [payload, curriculum, dependenciesFile, ontologyManifest, releaseManifest] = await Promise.all([
  readJson(path.join(ROOT, 'learnmap', 'data', 'learnmap.json')),
  readJson(path.join(SOURCE_DATA, 'curriculum-standards.json')),
  readJson(path.join(SOURCE_DATA, 'dependencies.json')),
  readJson(path.join(SOURCE_ROOT, 'dist', 'ontology', 'manifest.json')),
  readJson(path.join(SOURCE_ROOT, 'dist', 'ontology', 'release-manifest.json')),
]);

assert.equal(payload.meta.schemaVersion, 2);
assert.equal(payload.meta.ontology.seriesIri, releaseManifest.ontologySeriesIri);
assert.equal(payload.meta.ontology.version, releaseManifest.ontologyVersion);
assert.equal(payload.meta.ontology.versionIri, releaseManifest.ontologyVersionIri);
assert.equal(payload.meta.ontology.releaseStatus, releaseManifest.releaseStatus);
assert.equal(payload.meta.ontology.officialStatus, releaseManifest.officialStatus);
assert.equal(payload.meta.ontology.automatedReviewStatus, releaseManifest.review.automatedGateStatus);
assert.equal(payload.meta.ontology.formalGateCount, releaseManifest.review.formalGateCount);
assert.equal(payload.meta.ontology.externalDomainReviewStatus, releaseManifest.review.externalDomainReviewStatus);
assert.deepEqual(payload.meta.ontology.rights, releaseManifest.rights);
assert.deepEqual(payload.meta.ontology.relationCounts, ontologyManifest.relations);
assert.deepEqual(payload.meta.ontology.semantics.directPrerequisite, {
  relation: 'directRequires',
  direction: 'dependent-to-prerequisite',
  modelRelative: true,
  suggested: true,
  transitive: false,
  hardMeans: 'required',
  softMeans: 'recommended',
});
assert.deepEqual(payload.meta.ontology.semantics.unlock, {
  relation: 'unlocks',
  direction: 'prerequisite-to-dependent',
  derived: true,
  inverseOf: 'directRequires',
});
assert.deepEqual(payload.meta.ontology.semantics.indirectPrerequisite, {
  relation: 'indirectRequires',
  direction: 'dependent-to-prerequisite',
  derived: true,
  minimumHops: 2,
});
assert.deepEqual(payload.meta.ontology.semantics.standardAlignment, { relation: 'alignedToStandard' });

const standardIds = new Set(payload.standards.map((standard) => standard.id));
const clusterIds = new Set(payload.clusters.map((cluster) => cluster.id));
const nodeById = new Map(payload.nodes.map((node) => [node.id, node]));
const alignmentByTopic = new Map(curriculum.standardMappings.map((mapping) => [mapping.microTopicId, mapping]));

for (const standard of payload.standards) {
  assert.equal(standard.uri, instanceUri('standard', standard.id));
}
for (const cluster of payload.clusters) {
  assert.equal(cluster.uri, instanceUri('cluster', cluster.id));
}
for (const node of payload.nodes) {
  const alignment = alignmentByTopic.get(node.id);
  assert(alignment, `missing source alignment for ${node.id}`);
  assert.equal(node.uri, instanceUri('topic', node.id));
  assert.equal(node.standard, alignment.standardKey);
  assert(standardIds.has(node.standard), `unknown standard for ${node.id}`);
  assert.equal(node.standardUri, instanceUri('standard', node.standard));
  assert.equal(node.alignmentKind, alignment.relationship);
  assert(['introduces', 'supports', 'extends', 'assesses'].includes(node.alignmentKind));
  assert(node.clusters.length > 0, `missing cluster for ${node.id}`);
  for (const clusterId of node.clusters) assert(clusterIds.has(clusterId));
}

const dependencyByPair = new Map(
  dependenciesFile.dependencies.map((dependency) => [
    `${dependency.topicId}\u0000${dependency.prerequisiteId}`,
    dependency,
  ]),
);
assert.equal(dependencyByPair.size, payload.edges.length);

const prerequisites = new Map(payload.nodes.map((node) => [node.id, new Set()]));
const unlocks = new Map(payload.nodes.map((node) => [node.id, new Set()]));
const prerequisiteEdges = new Map(payload.nodes.map((node) => [node.id, []]));
const unlockEdges = new Map(payload.nodes.map((node) => [node.id, []]));
const edgeByPair = new Map();
for (const edge of payload.edges) {
  const dependency = dependencyByPair.get(`${edge.from}\u0000${edge.to}`);
  assert(dependency, `projection reversed or invented directRequires edge ${edge.from} -> ${edge.to}`);
  assert.equal(edge.relation, 'directRequires');
  assert.equal(edge.strength, dependency.strength);
  assert.equal(edge.requirementLevel, edge.strength === 'hard' ? 'required' : 'recommended');
  assert.equal(edge.reason, dependency.reason);
  assert.equal(edge.verificationStatus, 'workstream-reviewed');
  assert(nodeById.has(edge.from), `missing dependent topic ${edge.from}`);
  assert(nodeById.has(edge.to), `missing prerequisite topic ${edge.to}`);
  prerequisites.get(edge.from).add(edge.to);
  unlocks.get(edge.to).add(edge.from);
  prerequisiteEdges.get(edge.from).push(edge);
  unlockEdges.get(edge.to).push(edge);
  edgeByPair.set(`${edge.from}\u0000${edge.to}`, edge);
}

for (const adjacency of [prerequisiteEdges, unlockEdges]) {
  for (const edgeList of adjacency.values()) {
    edgeList.sort((a, b) => `${a.to}\u0000${a.from}`.localeCompare(`${b.to}\u0000${b.from}`, 'en'));
  }
}

let indirectPrerequisites = 0;
let indirectUnlocks = 0;
for (const node of payload.nodes) {
  const directPrerequisites = prerequisites.get(node.id).size;
  const directUnlocks = unlocks.get(node.id).size;
  const summary = {
    directPrerequisites,
    indirectPrerequisites: reachable(node.id, prerequisites).size - directPrerequisites,
    directUnlocks,
    indirectUnlocks: reachable(node.id, unlocks).size - directUnlocks,
    indirectPrerequisiteExamples: indirectPathExamples({
      startId: node.id,
      adjacency: prerequisiteEdges,
      nextIdForEdge: (edge) => edge.to,
      directIds: prerequisites.get(node.id),
    }),
    indirectUnlockExamples: indirectPathExamples({
      startId: node.id,
      adjacency: unlockEdges,
      nextIdForEdge: (edge) => edge.from,
      directIds: unlocks.get(node.id),
    }),
  };
  assert.deepEqual(node.pathSummary, summary, `path summary mismatch for ${node.id}`);
  validatePathExamples(node.id, node.pathSummary.indirectPrerequisiteExamples, {
    direction: 'prerequisite',
    directIds: prerequisites.get(node.id),
    edgeByPair,
    expectedCount: summary.indirectPrerequisites,
  });
  validatePathExamples(node.id, node.pathSummary.indirectUnlockExamples, {
    direction: 'unlock',
    directIds: unlocks.get(node.id),
    edgeByPair,
    expectedCount: summary.indirectUnlocks,
  });
  indirectPrerequisites += summary.indirectPrerequisites;
  indirectUnlocks += summary.indirectUnlocks;
}
assert.equal(indirectPrerequisites, ontologyManifest.relations.indirectRequires.count);
assert.equal(indirectUnlocks, ontologyManifest.relations.indirectRequires.count);

assert.deepEqual((await readdir(ONTOLOGY_DIR)).sort(), [...PUBLIC_ARTIFACTS].sort());
for (const filename of PUBLIC_ARTIFACTS) {
  const key = filename.endsWith('.ttl') ? 'turtle' : 'jsonLd';
  const artifact = payload.meta.ontology.artifacts[key];
  const released = releaseManifest.files.find((file) => file.path === `dist/ontology/${filename}`);
  assert(released, `release manifest missing ${filename}`);
  assert.deepEqual(artifact, {
    href: `./ontology/${filename}`,
    mediaType: released.mediaType,
    bytes: released.bytes,
    sha256: released.sha256,
  });
  const target = path.join(ONTOLOGY_DIR, filename);
  assert.equal((await stat(target)).size, released.bytes);
  assert.equal(await sha256(target), released.sha256);
}

const projectionCore = {
  standards: payload.standards,
  clusters: payload.clusters,
  nodes: payload.nodes,
  edges: payload.edges,
  subjects: payload.subjects,
  grades: payload.grades,
};
const serialized = JSON.stringify(projectionCore);
for (const forbiddenKey of [
  'sourceLocator', 'sourceRefs', 'sourceText', 'sourcePage', 'sourceSection', 'sourceSha256',
  'sourceAttachmentNo', 'pdfPage', 'printedPage', 'attachmentNo', 'workstreamFile',
  'generationBasis', 'provenanceEvidence', 'verificationNotes', 'sourceUrl',
]) {
  assert.equal(serialized.includes(`\"${forbiddenKey}\"`), false, `projection leaked ${forbiddenKey}`);
}
for (const url of serialized.match(/https?:\/\/[^"\\]+/gi) ?? []) {
  assert(url.startsWith(INSTANCE_NAMESPACE), `projection leaked non-instance URL ${url}`);
}

const runtimeSerialized = JSON.stringify(payload);
for (const forbiddenText of [
  '/Volumes/data',
  'korean-elementary-learning-map',
  'workstream:',
  'sourceLocator',
  'sourceRefs',
  'sourceUrl',
  'pdfPage',
  'printedPage',
  'attachmentNo',
  'workstreamFile',
  'generationBasis',
  'provenanceEvidence',
  'verificationNotes',
]) {
  assert.equal(runtimeSerialized.includes(forbiddenText), false, `runtime payload leaked ${forbiddenText}`);
}
assert.doesNotMatch(runtimeSerialized, /diagnos|clinical|진단|임상|처방/i, 'runtime payload leaked diagnostic or clinical language');
for (const url of runtimeSerialized.match(/https?:\/\/[^"\\]+/gi) ?? []) {
  assert(
    url.startsWith(INSTANCE_NAMESPACE) || url.startsWith('https://dexa.art/learnmap/ontology'),
    `runtime payload leaked non-public URL ${url}`,
  );
}

console.log(
  `learnmap ontology semantics: PASS (${payload.edges.length} directed prerequisites / ${indirectPrerequisites} indirect paths / P3 artifacts verified)`,
);

function instanceUri(kind, id) {
  return `${INSTANCE_NAMESPACE}${kind}/${encodeURIComponent(id)}`;
}

function reachable(startId, adjacency) {
  const visited = new Set();
  const pending = [...adjacency.get(startId)];
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === startId || visited.has(current)) continue;
    visited.add(current);
    for (const next of adjacency.get(current) ?? []) pending.push(next);
  }
  return visited;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

function indirectPathExamples({ startId, adjacency, nextIdForEdge, directIds }) {
  const examples = [];
  const emittedTargets = new Set();
  const visitedDepth = new Map([[startId, 0]]);
  const queue = [{ current: startId, path: [startId], requirementLevels: [] }];

  for (let index = 0; index < queue.length && examples.length < MAX_PATH_EXAMPLES; index += 1) {
    const current = queue[index];
    for (const edge of adjacency.get(current.current) ?? []) {
      const nextId = nextIdForEdge(edge);
      if (current.path.includes(nextId)) continue;

      const pathIds = [...current.path, nextId];
      const requirementLevels = [...current.requirementLevels, edge.requirementLevel];
      const hopCount = pathIds.length - 1;
      const previousDepth = visitedDepth.get(nextId);
      if (previousDepth !== undefined && previousDepth <= hopCount) continue;

      visitedDepth.set(nextId, hopCount);
      queue.push({ current: nextId, path: pathIds, requirementLevels });

      if (hopCount >= 2 && !directIds.has(nextId) && !emittedTargets.has(nextId)) {
        emittedTargets.add(nextId);
        examples.push({ hops: hopCount, path: pathIds, requirementLevels });
        if (examples.length >= MAX_PATH_EXAMPLES) break;
      }
    }
  }

  return examples;
}

function validatePathExamples(startId, examples, { direction, directIds, edgeByPair, expectedCount }) {
  assert(examples.length <= MAX_PATH_EXAMPLES, `${startId} has too many ${direction} path examples`);
  if (expectedCount > 0) {
    assert(examples.length > 0, `${startId} is missing ${direction} path examples`);
  }

  for (const example of examples) {
    assert.equal(example.path[0], startId, `${direction} path must begin at selected topic`);
    assert.equal(example.hops, example.path.length - 1, `${direction} path hop count mismatch`);
    assert(example.hops >= 2, `${direction} path must be indirect`);
    assert.equal(example.requirementLevels.length, example.hops, `${direction} path level count mismatch`);
    assert(!directIds.has(example.path.at(-1)), `${direction} path target must not be a direct relation`);

    const seen = new Set();
    for (const nodeId of example.path) {
      assert(nodeById.has(nodeId), `${direction} path references unknown node ${nodeId}`);
      assert(!seen.has(nodeId), `${direction} path repeats node ${nodeId}`);
      seen.add(nodeId);
    }

    for (let index = 0; index < example.path.length - 1; index += 1) {
      const from = example.path[index];
      const to = example.path[index + 1];
      const edge = direction === 'prerequisite'
        ? edgeByPair.get(`${from}\u0000${to}`)
        : edgeByPair.get(`${to}\u0000${from}`);
      assert(edge, `${direction} path step is not backed by a directRequires edge: ${from} -> ${to}`);
      assert.equal(example.requirementLevels[index], edge.requirementLevel);
    }
  }
}
