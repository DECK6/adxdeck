import test from 'node:test';
import assert from 'node:assert/strict';
import {domains} from './data.mjs';
import {filesForWeek} from './core.mjs';
import {createProject,personalFiles} from './personal.mjs';

const expected=['01-case-study.md','02-workshop.md','03-runner.md','05-research.md','definition-card.md'];
test('week-one common and personal exports carry the complete current lesson without teacher holdout answers',()=>{
 for(const files of [...Object.values(domains).map(d=>filesForWeek(d,1)),personalFiles(createProject(),1)]){
  for(const name of expected)assert.ok(files['week1/'+name],name);
  const all=Object.entries(files).filter(([p])=>p.startsWith('week1/')).map(([,s])=>s).join('\n');
  assert.match(all,/Jev_Ontology/);assert.match(all,/robebots\/kb-jev/);assert.match(all,/2026-09-29/);
  assert.match(all,/0\.0045/);assert.match(all,/수동 \/ 일반 에이전트 \/ 실제 Jev/);
  assert.doesNotMatch(all,/\[\[|\/Volumes\/|\/Users\/|H01|cucumber/);
  assert.ok(!files['week1/04-instructor.md']);
 }
});
test('week-one definitions material does not silently extend later-week assignment bundles',()=>{
 for(const w of [2,3,4]){
  assert.ok(!filesForWeek(domains.recipe,w)['week1/definition-card.md']);
  assert.ok(!personalFiles(createProject(),w)['week1/definition-card.md']);
 }
});

test('browser lesson content does not embed instructor holdout answers',async()=>{
 const {readFile}=await import('node:fs/promises');
 const content=await readFile(new URL('./week1-content.json',import.meta.url),'utf8');
 assert.doesNotMatch(content,/H01|cucumber/);
});
