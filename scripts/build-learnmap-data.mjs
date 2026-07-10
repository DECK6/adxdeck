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

const EXPECTED = Object.freeze({
  standards: 620,
  nodes: 1956,
  edges: 1894,
  clusters: 153,
});

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
  ];

  for (const key of forbidden) {
    assert.equal(serialized.includes(`\"${key}\"`), false, `projection leaked forbidden field ${key}`);
  }

  assert.equal(/https?:\/\//i.test(serialized), false, 'projection must not contain source URLs');
}

export async function buildProjection(sourceDir = DEFAULT_SOURCE_DIR) {
  const [curriculum, topicsFile, dependenciesFile, clustersFile] = await Promise.all([
    readJson(sourceDir, 'curriculum-standards.json'),
    readJson(sourceDir, 'topics.json'),
    readJson(sourceDir, 'dependencies.json'),
    readJson(sourceDir, 'clusters.json'),
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
    ]))
    .sort((a, b) => compareText(a.id, b.id));

  assertCount('projected standards', standards.length, EXPECTED.standards);
  assertUnique('standard ids', standards.map((standard) => standard.id));
  assertSorted('standards', standards, (standard) => standard.id);

  const standardIds = new Set(standards.map((standard) => standard.id));
  const standardByTopic = new Map();
  for (const mapping of curriculum.standardMappings) {
    assert(standardIds.has(mapping.standardKey), `unknown standard ${mapping.standardKey}`);
    assert.equal(standardByTopic.has(mapping.microTopicId), false, `duplicate standard mapping for ${mapping.microTopicId}`);
    standardByTopic.set(mapping.microTopicId, mapping.standardKey);
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
      const standardId = standardByTopic.get(topic.id);
      assert(standardId, `topic ${topic.id} has no standard mapping`);
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
  assert.equal(standardByTopic.size, nodeIds.size, 'every node must have exactly one standard mapping');
  assert.equal(clustersByTopic.size, nodeIds.size, 'cluster membership must cover every node');

  const edges = dependenciesFile.dependencies
    .map((edge) => compactObject([
      ['from', edge.prerequisiteId],
      ['to', edge.topicId],
      ['strength', edge.strength],
      ['reason', edge.reason],
    ]))
    .sort((a, b) => compareText(`${a.from}\u0000${a.to}`, `${b.from}\u0000${b.to}`));

  assertCount('projected edges', edges.length, EXPECTED.edges);
  assertUnique('edge pairs', edges.map((edge) => `${edge.from}\u0000${edge.to}`));
  for (const edge of edges) {
    assert(nodeIds.has(edge.from), `edge prerequisite missing: ${edge.from}`);
    assert(nodeIds.has(edge.to), `edge topic missing: ${edge.to}`);
    assert.notEqual(edge.from, edge.to, `self edge: ${edge.from}`);
  }

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
    'id', 'code', 'subject', 'subjectLabel', 'domain', 'domainLabel', 'grade', 'summary',
  ]);
  assertAllowedFields('cluster projection', clusters, [
    'id', 'title', 'subject', 'subjectLabel', 'domain', 'domainLabel', 'grade', 'summary', 'parentSummary', 'count',
  ]);
  assertAllowedFields('node projection', nodes, [
    'id', 'title', 'description', 'subject', 'subjectLabel', 'domain', 'domainLabel', 'grade', 'type',
    'code', 'standard', 'evidence', 'assessmentPrompt', 'clusters', 'focus', 'lifeQuestion',
  ]);
  assertAllowedFields('edge projection', edges, ['from', 'to', 'strength', 'reason']);
  assertAllowedFields('subject projection', subjects, ['id', 'label', 'color', 'count']);
  assertAllowedFields('grade projection', grades, ['id', 'label', 'count']);
  assertNoPrivateSourceFields(core);

  const payloadSha256 = createHash('sha256').update(JSON.stringify(core)).digest('hex');
  const payload = {
    meta: {
      schemaVersion: 1,
      title: '대한민국 초등 배움 지도',
      locale: 'ko-KR',
      taxonomyVersion: topicsFile.taxonomyVersion,
      counts: { ...EXPECTED },
      payloadSha256,
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
