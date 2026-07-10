#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_SOURCE_DIR = path.resolve(REPO_ROOT, '..', 'korean-elementary-learning-map', 'data', 'kr');
const DEFAULT_OUTPUT = path.join(REPO_ROOT, 'learnmap', 'data', 'learnmap.json');
const INSTANCE_NAMESPACE = 'https://dexa.art/learnmap/#/';
const ONTOLOGY_SERIES_IRI = 'https://dexa.art/learnmap/ontology';

const EXPECTED = Object.freeze({
  standards: 620,
  nodes: 1956,
  edges: 1894,
  clusters: 153,
});
const MAX_PATH_EXAMPLES = 3;

const SUBJECT_ORDER = [
  'Korean Language',
  'Mathematics',
  'Social Studies',
  'Science',
  'English as a Foreign Language',
  'Moral Education',
  'Physical Education',
  'Music',
  'Art',
  'Practical Arts / Informatics',
  'Integrated Subjects',
];

const SUBJECT_COLORS = Object.freeze({
  'Korean Language': '#E63329',
  Mathematics: '#1D5F9E',
  'Social Studies': '#A55C2A',
  Science: '#23816C',
  'English as a Foreign Language': '#77509A',
  'Moral Education': '#B98213',
  'Physical Education': '#D8642A',
  Music: '#7D3854',
  Art: '#28788B',
  'Practical Arts / Informatics': '#657330',
  'Integrated Subjects': '#67625C',
});

function compareText(a, b) {
  return String(a).localeCompare(String(b), 'en');
}

function compactObject(entries) {
  return Object.fromEntries(entries.filter(([, value]) => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }));
}

async function readJson(sourceDir, filename) {
  const raw = await readFile(path.join(sourceDir, filename), 'utf8');
  return JSON.parse(raw);
}

function unique(values) {
  return [...new Set(values)];
}

function instanceUri(kind, id) {
  return `${INSTANCE_NAMESPACE}${kind}/${encodeURIComponent(id)}`;
}

function requirementLevel(strength) {
  if (strength === 'hard') return 'required';
  if (strength === 'soft') return 'recommended';
  throw new Error(`unknown prerequisite strength: ${strength}`);
}

function relationSummary(nodes, edges) {
  const prerequisites = new Map(nodes.map((node) => [node.id, new Set()]));
  const unlocks = new Map(nodes.map((node) => [node.id, new Set()]));
  const prerequisiteEdges = new Map(nodes.map((node) => [node.id, []]));
  const unlockEdges = new Map(nodes.map((node) => [node.id, []]));

  for (const edge of edges) {
    prerequisites.get(edge.from).add(edge.to);
    unlocks.get(edge.to).add(edge.from);
    prerequisiteEdges.get(edge.from).push(edge);
    unlockEdges.get(edge.to).push(edge);
  }

  for (const adjacency of [prerequisiteEdges, unlockEdges]) {
    for (const edgeList of adjacency.values()) {
      edgeList.sort((a, b) => compareText(`${a.to}\u0000${a.from}`, `${b.to}\u0000${b.from}`));
    }
  }

  const reachable = (startId, adjacency) => {
    const visited = new Set();
    const pending = [...adjacency.get(startId)];
    while (pending.length > 0) {
      const current = pending.pop();
      if (current === startId || visited.has(current)) continue;
      visited.add(current);
      for (const next of adjacency.get(current) ?? []) pending.push(next);
    }
    return visited;
  };

  for (const node of nodes) {
    const directPrerequisites = prerequisites.get(node.id);
    const directUnlocks = unlocks.get(node.id);
    node.pathSummary = {
      directPrerequisites: directPrerequisites.size,
      indirectPrerequisites: reachable(node.id, prerequisites).size - directPrerequisites.size,
      directUnlocks: directUnlocks.size,
      indirectUnlocks: reachable(node.id, unlocks).size - directUnlocks.size,
      indirectPrerequisiteExamples: indirectPathExamples({
        startId: node.id,
        adjacency: prerequisiteEdges,
        nextIdForEdge: (edge) => edge.to,
        directIds: directPrerequisites,
      }),
      indirectUnlockExamples: indirectPathExamples({
        startId: node.id,
        adjacency: unlockEdges,
        nextIdForEdge: (edge) => edge.from,
        directIds: directUnlocks,
      }),
    };
  }
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

function assertCount(label, actual, expected) {
  assert.equal(actual, expected, `${label}: expected ${expected}, got ${actual}`);
}

function assertUnique(label, values) {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

function assertSorted(label, values, selector) {
  const sorted = [...values].sort((a, b) => compareText(selector(a), selector(b)));
  assert.deepEqual(values, sorted, `${label} must be deterministically sorted`);
}

function assertAllowedFields(label, records, allowedFields) {
  const allowed = new Set(allowedFields);
  for (const record of records) {
    for (const field of Object.keys(record)) {
      assert(allowed.has(field), `${label} leaked unexpected field ${field}`);
    }
  }
}

function assertNoPrivateSourceFields(payload) {
  const serialized = JSON.stringify(payload);
  const forbidden = [
    'sourceLocator',
    'sourceRefs',
    'sourceText',
    'sourcePage',
    'sourceSection',
    'sourceSha256',
    'sourceAttachmentNo',
    'pdfPage',
    'printedPage',
    'attachmentNo',
    'workstreamFile',
    'generationBasis',
    'provenanceEvidence',
    'verificationNotes',
    'sourceUrl',
  ];

  for (const key of forbidden) {
    assert.equal(serialized.includes(`\"${key}\"`), false, `projection leaked forbidden field ${key}`);
  }

  const urls = serialized.match(/https?:\/\/[^"\\]+/gi) ?? [];
  for (const url of urls) {
    assert(
      url.startsWith(INSTANCE_NAMESPACE),
      `projection must not contain source URLs or non-instance web URLs: ${url}`,
    );
  }
}

export async function buildProjection(sourceDir = DEFAULT_SOURCE_DIR) {
  const ontologyRoot = path.resolve(sourceDir, '..', '..');
  const [curriculum, topicsFile, dependenciesFile, clustersFile, ontologyManifest, releaseManifest] = await Promise.all([
    readJson(sourceDir, 'curriculum-standards.json'),
    readJson(sourceDir, 'topics.json'),
    readJson(sourceDir, 'dependencies.json'),
    readJson(sourceDir, 'clusters.json'),
    readJson(path.join(ontologyRoot, 'dist', 'ontology'), 'manifest.json'),
    readJson(path.join(ontologyRoot, 'dist', 'ontology'), 'release-manifest.json'),
  ]);

  assertCount('source standardCount', curriculum.standardCount, EXPECTED.standards);
  assertCount('source topicCount', topicsFile.topicCount, EXPECTED.nodes);
  assertCount('source edgeCount', dependenciesFile.edgeCount, EXPECTED.edges);
  assertCount('source clusterCount', clustersFile.clusterCount, EXPECTED.clusters);

  const standards = curriculum.curricula
    .flatMap((entry) => entry.standards)
    .map((standard) => compactObject([
      ['id', standard.key],
      ['code', standard.code],
      ['subject', standard.subject],
      ['subjectLabel', standard.subjectKorean],
      ['domain', standard.domain],
      ['domainLabel', standard.domainKorean],
      ['grade', standard.gradeBand],
      ['summary', standard.summary ?? standard.titleKorean],
      ['uri', instanceUri('standard', standard.key)],
      ['verificationStatus', standard.verificationStatus],
    ]))
    .sort((a, b) => compareText(a.id, b.id));

  assertCount('projected standards', standards.length, EXPECTED.standards);
  assertUnique('standard ids', standards.map((standard) => standard.id));
  assertSorted('standards', standards, (standard) => standard.id);

  const standardIds = new Set(standards.map((standard) => standard.id));
  const alignmentByTopic = new Map();
  for (const mapping of curriculum.standardMappings) {
    assert(standardIds.has(mapping.standardKey), `unknown standard ${mapping.standardKey}`);
    assert.equal(alignmentByTopic.has(mapping.microTopicId), false, `duplicate standard mapping for ${mapping.microTopicId}`);
    alignmentByTopic.set(mapping.microTopicId, mapping);
  }

  const sourceClusters = clustersFile.clusters
    .map((cluster) => ({ ...cluster, topics: [...cluster.topics].sort(compareText) }))
    .sort((a, b) => compareText(a.id, b.id));

  const clusters = sourceClusters
    .map((cluster) => compactObject([
      ['id', cluster.id],
      ['title', cluster.titleKorean ?? cluster.title ?? cluster.name],
      ['subject', cluster.subject],
      ['subjectLabel', cluster.subjectKorean],
      ['domain', cluster.domain],
      ['domainLabel', cluster.domainKorean],
      ['grade', cluster.gradeBand],
      ['summary', cluster.summary],
      ['parentSummary', cluster.parentSummary],
      ['count', cluster.topics.length],
      ['uri', instanceUri('cluster', cluster.id)],
    ]))
    .sort((a, b) => compareText(a.id, b.id));

  assertCount('projected clusters', clusters.length, EXPECTED.clusters);
  assertUnique('cluster ids', clusters.map((cluster) => cluster.id));
  assertSorted('clusters', clusters, (cluster) => cluster.id);

  const clusterIds = new Set(clusters.map((cluster) => cluster.id));
  const clustersByTopic = new Map();
  for (const cluster of sourceClusters) {
    for (const topicId of cluster.topics) {
      const memberships = clustersByTopic.get(topicId) ?? [];
      memberships.push(cluster.id);
      clustersByTopic.set(topicId, memberships);
    }
  }

  const nodes = topicsFile.topics
    .map((topic) => {
      const alignment = alignmentByTopic.get(topic.id);
      assert(alignment, `topic ${topic.id} has no standard mapping`);
      const standardId = alignment.standardKey;
      const memberships = unique(clustersByTopic.get(topic.id) ?? []).sort(compareText);
      assert(memberships.length > 0, `topic ${topic.id} has no cluster membership`);
      for (const clusterId of memberships) assert(clusterIds.has(clusterId));

      return compactObject([
        ['id', topic.id],
        ['title', topic.titleKorean ?? topic.title ?? topic.name],
        ['description', topic.description ?? topic.summary],
        ['subject', topic.subject],
        ['subjectLabel', topic.subjectKorean],
        ['domain', topic.domain],
        ['domainLabel', topic.domainKorean],
        ['grade', topic.gradeBand],
        ['type', topic.type],
        ['code', topic.sourceStandardCode],
        ['standard', standardId],
        ['uri', instanceUri('topic', topic.id)],
        ['standardUri', instanceUri('standard', standardId)],
        ['alignmentKind', alignment.relationship],
        ['alignmentVerificationStatus', alignment.verificationStatus ?? 'workstream-reviewed'],
        ['verificationStatus', topic.verificationStatus],
        ['evidence', topic.evidence],
        ['assessmentPrompt', topic.assessmentPrompt],
        ['clusters', memberships],
        ['focus', topic.focus],
        ['lifeQuestion', topic.lifeQuestionKorean],
      ]);
    })
    .sort((a, b) => compareText(a.id, b.id));

  assertCount('projected nodes', nodes.length, EXPECTED.nodes);
  assertUnique('node ids', nodes.map((node) => node.id));
  assertSorted('nodes', nodes, (node) => node.id);

  const nodeIds = new Set(nodes.map((node) => node.id));
  assert.equal(alignmentByTopic.size, nodeIds.size, 'every node must have exactly one standard mapping');
  assert.equal(clustersByTopic.size, nodeIds.size, 'cluster membership must cover every node');

  const edges = dependenciesFile.dependencies
    .map((edge) => compactObject([
      ['from', edge.topicId],
      ['to', edge.prerequisiteId],
      ['relation', 'directRequires'],
      ['strength', edge.strength],
      ['requirementLevel', requirementLevel(edge.strength)],
      ['verificationStatus', 'workstream-reviewed'],
      ['reason', edge.reason],
    ]))
    .sort((a, b) => compareText(`${a.from}\u0000${a.to}`, `${b.from}\u0000${b.to}`));

  assertCount('projected edges', edges.length, EXPECTED.edges);
  assertUnique('edge pairs', edges.map((edge) => `${edge.from}\u0000${edge.to}`));
  for (const edge of edges) {
    assert(nodeIds.has(edge.from), `edge dependent topic missing: ${edge.from}`);
    assert(nodeIds.has(edge.to), `edge prerequisite topic missing: ${edge.to}`);
    assert.notEqual(edge.from, edge.to, `self edge: ${edge.from}`);
  }

  relationSummary(nodes, edges);

  const subjects = SUBJECT_ORDER.map((id) => {
    const subjectNodes = nodes.filter((node) => node.subject === id);
    assert(subjectNodes.length > 0, `subject ${id} has no nodes`);
    return {
      id,
      label: subjectNodes[0].subjectLabel,
      color: SUBJECT_COLORS[id],
      count: subjectNodes.length,
    };
  });

  assert.equal(subjects.reduce((sum, subject) => sum + subject.count, 0), nodes.length);

  const grades = ['1-2', '3-4', '5-6'].map((id) => ({
    id,
    label: `${id}학년`,
    count: nodes.filter((node) => node.grade === id).length,
  }));

  const core = {
    standards,
    clusters,
    nodes,
    edges,
    subjects,
    grades,
  };

  assertAllowedFields('standard projection', standards, [
    'id', 'code', 'subject', 'subjectLabel', 'domain', 'domainLabel', 'grade', 'summary', 'uri',
    'verificationStatus',
  ]);
  assertAllowedFields('cluster projection', clusters, [
    'id', 'title', 'subject', 'subjectLabel', 'domain', 'domainLabel', 'grade', 'summary', 'parentSummary', 'count', 'uri',
  ]);
  assertAllowedFields('node projection', nodes, [
    'id', 'title', 'description', 'subject', 'subjectLabel', 'domain', 'domainLabel', 'grade', 'type',
    'code', 'standard', 'uri', 'standardUri', 'alignmentKind', 'alignmentVerificationStatus',
    'verificationStatus', 'evidence', 'assessmentPrompt', 'clusters', 'focus', 'lifeQuestion', 'pathSummary',
  ]);
  assertAllowedFields('edge projection', edges, [
    'from', 'to', 'relation', 'strength', 'requirementLevel', 'verificationStatus', 'reason',
  ]);
  assertAllowedFields('subject projection', subjects, ['id', 'label', 'color', 'count']);
  assertAllowedFields('grade projection', grades, ['id', 'label', 'count']);
  assertNoPrivateSourceFields(core);

  assert.equal(releaseManifest.ontologySeriesIri, ONTOLOGY_SERIES_IRI);
  assert.equal(releaseManifest.ontologyVersion, ontologyManifest.ontologyVersion);
  assert.equal(releaseManifest.datasetRelease, topicsFile.taxonomyVersion);
  assert.equal(releaseManifest.status.learnerDiagnosisSupported, false);
  assert.equal(releaseManifest.rights.officialTextIncluded, false);

  const publicArtifact = (filename) => {
    const sourcePath = `dist/ontology/${filename}`;
    const source = releaseManifest.files.find((file) => file.path === sourcePath);
    assert(source, `release manifest is missing ${sourcePath}`);
    return {
      href: `./ontology/${filename}`,
      mediaType: source.mediaType,
      bytes: source.bytes,
      sha256: source.sha256,
    };
  };

  const payloadSha256 = createHash('sha256').update(JSON.stringify(core)).digest('hex');
  const payload = {
    meta: {
      schemaVersion: 2,
      title: '대한민국 초등 배움 지도',
      locale: 'ko-KR',
      taxonomyVersion: topicsFile.taxonomyVersion,
      counts: { ...EXPECTED },
      payloadSha256,
      ontology: {
        seriesIri: releaseManifest.ontologySeriesIri,
        version: releaseManifest.ontologyVersion,
        versionIri: releaseManifest.ontologyVersionIri,
        releaseStatus: releaseManifest.releaseStatus,
        officialStatus: releaseManifest.officialStatus,
        automatedReviewStatus: releaseManifest.review.automatedGateStatus,
        formalGateCount: releaseManifest.review.formalGateCount,
        externalDomainReviewStatus: releaseManifest.review.externalDomainReviewStatus,
        rights: releaseManifest.rights,
        relationCounts: ontologyManifest.relations,
        semantics: {
          directPrerequisite: {
            relation: 'directRequires',
            direction: 'dependent-to-prerequisite',
            modelRelative: true,
            suggested: true,
            transitive: false,
            hardMeans: 'required',
            softMeans: 'recommended',
          },
          unlock: {
            relation: 'unlocks',
            direction: 'prerequisite-to-dependent',
            derived: true,
            inverseOf: 'directRequires',
          },
          indirectPrerequisite: {
            relation: 'indirectRequires',
            direction: 'dependent-to-prerequisite',
            derived: true,
            minimumHops: 2,
          },
          standardAlignment: { relation: 'alignedToStandard' },
        },
        artifacts: {
          turtle: publicArtifact('learning-map.ttl'),
          jsonLd: publicArtifact('learning-map.jsonld'),
        },
      },
    },
    ...core,
  };

  return payload;
}

export async function writeProjection({ sourceDir = DEFAULT_SOURCE_DIR, output = DEFAULT_OUTPUT } = {}) {
  const payload = await buildProjection(sourceDir);
  const serialized = `${JSON.stringify(payload)}\n`;
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, serialized, 'utf8');
  return { payload, output, bytes: Buffer.byteLength(serialized) };
}

async function main() {
  const sourceDir = path.resolve(process.argv[2] ?? process.env.LEARNMAP_DATA_DIR ?? DEFAULT_SOURCE_DIR);
  const output = path.resolve(process.argv[3] ?? DEFAULT_OUTPUT);
  const { payload, bytes } = await writeProjection({ sourceDir, output });
  const { counts, payloadSha256 } = payload.meta;
  console.log(`learnmap data: ${counts.nodes} nodes, ${counts.edges} edges, ${counts.standards} standards, ${counts.clusters} clusters`);
  console.log(`wrote ${path.relative(REPO_ROOT, output)} (${bytes} bytes, sha256 ${payloadSha256})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack ?? error);
    process.exitCode = 1;
  });
}
