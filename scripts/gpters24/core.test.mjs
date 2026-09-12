import {test} from 'node:test';
import assert from 'node:assert/strict';
import {domains} from './data.mjs';
import {validate, query, toTTL, scoreReport, parseWorkspace, filesForWeek, setEvaluation} from './core.mjs';
const copy=x=>structuredClone(x);
for (const d of Object.values(domains)) {
  test(`${d.id}: ten notes, valid graph and fixed questions`,()=>{
    assert.equal(d.notes.length,10); assert.equal(d.questions.length,3);
    assert.deepEqual(validate(d),[]);
    assert.equal(query(d,2).status,'UNKNOWN');
    for(let i=0;i<2;i++){const q=query(d,i);assert.equal(q.status,'SUPPORTED');assert.ok(q.evidence.length);}
  });
  test(`${d.id}: dangling nodes and source evidence are rejected`,()=>{
    const m=copy(d);m.edges[0].to='MISSING';m.edges[1].source='MISSING';
    const codes=validate(m).map(e=>e.code);assert.ok(codes.includes('ENDPOINT'));assert.ok(codes.includes('SOURCE'));
  });
  test(`${d.id}: duplicate identifiers rejected`,()=>{const m=copy(d);m.nodes.push(copy(m.nodes[0]));assert.ok(validate(m).some(e=>e.code==='ID'));});
  test(`${d.id}: four weekly packages use shared graph`,()=>{
    for(let w=1;w<=4;w++){
      const files=filesForWeek(d,w);assert.ok(Object.keys(files).some(p=>p.endsWith('README.md')));
      assert.deepEqual(JSON.parse(files['practice/model.json']).nodes,d.nodes);
      assert.equal(JSON.parse(files['practice/questions.json']).length,3);
      if(w===1)assert.equal(Object.keys(files).filter(p=>p.startsWith('00-inbox/')&&p.endsWith('.md')).length,10);
      if(w>=2)assert.ok(files['practice/ontology.ttl'].includes('owl:Class'));
    }
  });
  test(`${d.id}: OWL export escapes literals and contains relations`,()=>{
    const m=copy(d);m.nodes[0].label='quote " and \\ newline\n';const ttl=toTTL(m);
    assert.ok(ttl.includes('quote \\" and \\\\ newline\\n'));assert.ok(ttl.includes('owl:ObjectProperty'));
  });
}
test('education detects prerequisite cycles',()=>{const m=copy(domains.education);m.edges.push({from:'T1',rel:'requires',to:'T5',source:'E10'});assert.ok(validate(m).some(e=>e.code==='CYCLE'));assert.equal(query(m,0).status,'INVALID');});
test('education prerequisite path is ordered and deduplicated',()=>{assert.deepEqual(query(domains.education,0).nodes,['T1','T2','T3','T4','T5']);});
test('architecture catches relationship direction/type mismatch',()=>{const m=copy(domains.architecture);m.edges.push({from:'WINDOW',rel:'fillsOpening',to:'LIVING',source:'A07'});assert.ok(validate(m).some(e=>e.code==='TYPE'));});
test('queries follow changed values, not prerecorded success',()=>{const m=copy(domains.architecture);m.nodes.find(n=>n.id==='BED-3').attrs.role='storage';assert.match(query(m,0).answer,/침실 2/);assert.equal(query(m,0).status,'MISMATCH');});
test('unmeasured or incomplete evaluations have no aggregate',()=>{assert.equal(scoreReport({}).before,null);assert.equal(scoreReport({Q1:{before:{accuracy:2}}}).before,null);});
test('complete evaluation requires answers, evidence, and three scores',()=>{
 const r={};for(let i=1;i<=3;i++)r['Q'+i]={before:{answer:'관찰 답변',evidence:'E01',accuracy:1,consistency:1,source:1},after:{answer:'관찰 답변',evidence:'E01',accuracy:2,consistency:2,source:2}};
 assert.equal(scoreReport(r).before,9);assert.equal(scoreReport(r).after,18);
 r.Q1.after.accuracy=99;assert.equal(scoreReport(r).after,null);
});
test('import is bounded and shape checked',()=>{assert.throws(()=>parseWorkspace('{}'));assert.throws(()=>parseWorkspace(JSON.stringify({...domains.education,nodes:Array(201).fill(domains.education.nodes[0])})));assert.equal(parseWorkspace(JSON.stringify(domains.education)).id,'education');});
test('evaluation form keys survive serialization and score all questions',()=>{
 const records={};for(let i=1;i<=3;i++)for(const phase of ['before','after']){
   setEvaluation(records,`Q${i}|${phase}|answer`,'observed response');
   setEvaluation(records,`Q${i}|${phase}|evidence`,'E01, source passage');
   for(const field of ['accuracy','consistency','source'])setEvaluation(records,`Q${i}|${phase}|${field}`,phase==='before'?'1':'2');
 }
 const restored=JSON.parse(JSON.stringify(records));assert.equal(restored.Q1.before.answer,'observed response');assert.equal(restored.Q,undefined);
 assert.equal(scoreReport(restored).before,9);assert.equal(scoreReport(restored).after,18);
 setEvaluation(restored,'Q1|before|accuracy','');assert.equal(scoreReport(restored).before,null);
 assert.throws(()=>setEvaluation(restored,'__proto__|before|answer','bad'));
});
