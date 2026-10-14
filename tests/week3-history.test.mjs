import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshots} from '../ontology/study/assets/week3-history-data.mjs';
import {answerQuestion, comparison, stats, validateClaim} from '../ontology/study/assets/week3-history-core.mjs';

test('original and expanded snapshots keep actual counts and stable IDs', () => {
  assert.deepEqual(stats(snapshots.initial), {notes:3,concepts:16,claims:18,sources:5,answered:4,deferred:2});
  assert.deepEqual(stats(snapshots.expanded), {notes:5,concepts:24,claims:27,sources:7,answered:6,deferred:2});
  for(const c of snapshots.initial.concepts) assert.ok(snapshots.expanded.concepts.some(x=>x.id===c.id));
});
test('capital continuity is unknown initially and sourced after expansion', () => {
  assert.equal(answerQuestion(snapshots.initial,'capital').status,'unknown');
  const a=answerQuestion(snapshots.expanded,'capital');
  assert.equal(a.status,'supported');
  assert.match(a.answer,/1399/); assert.match(a.answer,/1405/);
  assert.ok(a.sourceIds.includes('S007')); assert.ok(a.claimIds.includes('A19'));
});
test('Taejo remains ambiguous without a dynasty even after expansion', () => {
  const a=answerQuestion(snapshots.expanded,'taejo');
  assert.equal(a.status,'ambiguous'); assert.match(a.answer,/왕건/); assert.match(a.answer,/이성계/);
  assert.equal(snapshots.expanded.concepts.find(x=>x.id==='C05').type_ids[0],'T-label');
});
test('palace construction and relocation use different events and years', () => {
  assert.equal(answerQuestion(snapshots.initial,'palace').status,'unknown');
  const a=answerQuestion(snapshots.expanded,'palace');
  assert.match(a.answer,/1394/); assert.match(a.answer,/1395/);
  assert.ok(a.sourceIds.includes('S008'));
});
test('unsupported precise date and source conflict stay unresolved', () => {
  assert.equal(answerQuestion(snapshots.expanded,'date').status,'unknown');
  assert.equal(answerQuestion(snapshots.expanded,'conflict').status,'unknown');
});
test('claim support requires source, current status and valid endpoints', () => {
  const d=structuredClone(snapshots.expanded);
  d.sources=d.sources.filter(s=>s.id!=='S007');
  assert.equal(answerQuestion(d,'capital').status,'unknown');
  const bad={...snapshots.expanded.claims.find(a=>a.id==='A10'),subject:'C01'};
  assert.equal(validateClaim(snapshots.expanded,bad).valid,false);
});
test('schema graph describes types while fact graph keeps people and events', () => {
  const view=comparison(snapshots.expanded,'taejo');
  assert.ok(view.facts.nodes.some(n=>n.id==='C01'));
  assert.ok(view.facts.nodes.some(n=>n.id==='C02'));
  assert.ok(view.schema.nodes.some(n=>n.id==='T-person'));
  assert.ok(!view.schema.nodes.some(n=>n.id==='C01'));
  assert.ok(view.schema.edges.some(e=>e.id==='R06'));
});
