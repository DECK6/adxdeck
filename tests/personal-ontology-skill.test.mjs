import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {sample} from '../ontology/study/assets/personal-ontology-core.mjs';
const script=resolve('ontology/study/downloads/personal-ontology-interview/scripts/ontology.mjs');
const run=(...args)=>spawnSync(process.execPath,[script,...args],{encoding:'utf8'});
test('interview starter creates a blank person and resumable files without overwriting answers',()=>{
 const dir=mkdtempSync(join(tmpdir(),'personal-ontology-skill-'));
 const first=run('init','--dir',dir,'--name','테스트 사용자');assert.equal(first.status,0,first.stderr);
 const file=join(dir,'ontology.json'),d=JSON.parse(readFileSync(file));
 assert.equal(d.nodes.length,1);assert.equal(d.nodes[0].label,'테스트 사용자');assert.equal(d.relations.length,0);
 for(const name of ['interview.md','interview-state.json','questions.md'])assert.ok(existsSync(join(dir,name)));
 d.question='이미 기록한 내 질문';writeFileSync(file,JSON.stringify(d));
 assert.equal(run('init','--dir',dir,'--name','다른 이름').status,1);
 assert.equal(JSON.parse(readFileSync(file)).question,d.question);
});
test('portable skill validates, exports and queries the same model as the webpage',()=>{
 const dir=mkdtempSync(join(tmpdir(),'personal-ontology-portable-')),file=join(dir,'ontology.json'),d=sample(4);writeFileSync(file,JSON.stringify(d));
 assert.equal(run('validate',file).status,0);
 const out=join(dir,'ontology.md');assert.equal(run('export',file,'--out',out).status,0);assert.match(readFileSync(out,'utf8'),/K096/);
 const q=run('query',file,'--kind','career','--topic','AX','--date','2026-10-07');assert.equal(q.status,0,q.stderr);assert.ok(JSON.parse(q.stdout).items.some(n=>n.title.includes('RFP')));
 assert.equal(run('query',file,'--kind','career','--topic','없는주제').status,1);
 assert.equal(run('export',file,'--out',file).status,1);
 assert.deepEqual(JSON.parse(readFileSync(file)),d);
});
test('invalid interview relationships fail without emitting a misleading export',()=>{
 const dir=mkdtempSync(join(tmpdir(),'personal-ontology-invalid-')),file=join(dir,'ontology.json'),out=join(dir,'ontology.md'),d=sample(1);
 d.relations[0].predicate='responsible';writeFileSync(file,JSON.stringify(d));
 assert.equal(run('validate',file).status,1);
 assert.equal(run('export',file,'--out',out).status,1);assert.equal(existsSync(out),false);
});
