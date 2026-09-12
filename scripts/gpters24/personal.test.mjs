import test from 'node:test';
import assert from 'node:assert/strict';
import {createProject,parseProject,applyResponses,personalFiles,personalPrompt,zipFiles} from './personal.mjs';
import {validate,scoreReport} from './core.mjs';

function project(){
 const p=createProject();p.title='내 연구 기록';p.scope='연구 질문과 실험 근거';p.questions=['어떤 실험을 했나?','어떤 결과가 질문을 뒷받침하나?','아직 모르는 것은?'];
 p.model.notes=[{id:'N1',title:'실험 메모',body:'실험 A는 질문 B를 확인한다.',source:'직접 작성',date:'2026-09-12',links:[]}];
 p.model.classes={Experiment:'실험',Question:'질문'};
 p.model.relations={tests:{label:'확인한다',from:['Experiment'],to:['Question']}};
 p.model.nodes=[{id:'A',label:'실험 A',type:'Experiment',noteId:'N1',attrs:{}},{id:'B',label:'질문 B',type:'Question',noteId:'N1',attrs:{}}];
 p.model.edges=[{from:'A',rel:'tests',to:'B',source:'N1'}];return p;
}
test('personal project starts empty, without sample questions or measured results',()=>{
 const p=createProject();assert.equal(p.model.notes.length,0);assert.equal(p.model.nodes.length,0);assert.deepEqual(p.questions,['','','']);assert.equal(scoreReport(p.records).before,null);assert.deepEqual(parseProject(JSON.stringify(p)),p);
});
test('own topic and relation graph survive export/import',()=>{
 const p=project(),restored=parseProject(JSON.stringify(p));assert.equal(restored.title,p.title);assert.deepEqual(validate(restored.model),[]);assert.equal(restored.model.edges[0].rel,'tests');
});
test('partially filled evaluation survives reload without invented totals',()=>{
 const p=project();p.records={Q1:{before:{accuracy:1}}};const r=parseProject(JSON.stringify(p));assert.equal(r.records.Q1.before.accuracy,1);assert.equal(r.records.Q1.before.answer,'');assert.equal(scoreReport(r.records).before,null);
});
test('personal import rejects foreign formats, duplicate note IDs and oversized input',()=>{
 assert.throws(()=>parseProject('{bad'));assert.throws(()=>parseProject(JSON.stringify({...project(),format:'other'})));assert.throws(()=>parseProject(' '.repeat(1_000_001)));
 const p=project();p.model.notes.push(p.model.notes[0]);assert.throws(()=>parseProject(JSON.stringify(p)));
});
test('own responses require matching questions and retain unmeasured scores',()=>{
 const p=project(),r={domain:'personal',projectTitle:p.title,phase:'before',model:'QA fixture',runAt:'2026-09-12',responses:p.questions.map((question,i)=>({id:`Q${i+1}`,question,answer:'QA answer',evidence:['N1']}))};
 const updated=applyResponses(p,JSON.stringify(r));assert.equal(updated.records.Q1.before.answer,'QA answer');assert.equal(updated.records.Q1.before.accuracy,null);assert.equal(scoreReport(updated.records).before,null);assert.equal(updated.records.runs.before.model,'QA fixture');
 r.responses[1].question='다른 질문';assert.throws(()=>applyResponses(p,JSON.stringify(r)));assert.deepEqual(p.records,{});
});
test('all four own-topic packages contain student data, assignments and no sample answer keys',()=>{
 const p=project();for(let w=1;w<=4;w++){const f=personalFiles(p,w);assert.match(f['practice/this-week.md'],new RegExp(`${w}주차`));assert.match(f['practice/questions.json'],/어떤 실험/);assert.match(f['00-inbox/N1.md'],/실험 A/);assert.ok(f['personal-project.json']);assert.ok(!f['practice/expected-answers.json']);if(w>=2)assert.match(f['practice/ontology.ttl'],/ex:A ex:tests ex:B/);}
 assert.match(personalPrompt(p,1),/00-inbox/);assert.match(personalPrompt(p,3),/model.json/);
});
test('ZIP exports real uncompressed files with UTF-8 names and valid signatures',()=>{
 const z=zipFiles({'한글.md':'나의 자료\n','model.json':'{}'});const v=new DataView(z.buffer);assert.equal(v.getUint32(0,true),0x04034b50);assert.equal(v.getUint32(z.length-22,true),0x06054b50);assert.equal(v.getUint16(z.length-12,true),2);
});
