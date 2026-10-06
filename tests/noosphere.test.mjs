import test from 'node:test';
import assert from 'node:assert/strict';
import {noosphere} from '../ontology/study/assets/noosphere-data.mjs';
import {validate,connections,findPaths,toMarkdown,sourceRegister} from '../ontology/study/assets/noosphere-core.mjs';

test('the independent worldview is valid and every connection has evidence',()=>{
 assert.deepEqual(validate(noosphere),[]);
 assert.equal(noosphere.id,'noosphere-layer');
 assert.ok(noosphere.nodes.filter(n=>n.type==='theory').length>=15);
 assert.ok(noosphere.nodes.filter(n=>n.type==='work').length>=9);
 assert.ok(noosphere.relations.every(e=>e.evidence.length && e.meaning));
});
test('every included theory, concept and work can be reached through a meaningful relation',()=>{
 assert.deepEqual(noosphere.nodes.filter(n=>!noosphere.relations.some(e=>e.from===n.id||e.to===n.id)).map(n=>n.id),[]);
});
test('recovery is a transition condition, not a fifth dynamic or fictional law',()=>{
 assert.equal(noosphere.nodes.filter(n=>n.type==='dynamic').length,4);
 assert.equal(noosphere.nodes.find(n=>n.id==='recovery').type,'condition');
 assert.equal(noosphere.nodes.filter(n=>n.type==='law').length,4);
 assert.ok(noosphere.nodes.filter(n=>n.type==='law').every(n=>n.domain==='fiction'));
});
test('series, work, sensory residue and fictional character remain separate identities',()=>{
 assert.equal(noosphere.nodes.find(n=>n.id==='series-afterglow').type,'series');
 assert.equal(noosphere.nodes.find(n=>n.id==='work-afterglow').type,'work');
 assert.equal(noosphere.nodes.find(n=>n.id==='residue').type,'concept');
 assert.equal(noosphere.nodes.find(n=>n.id==='character-residue').type,'character');
});
test('documented path connects a work through meaning to its actual theoretical reference',()=>{
 const paths=findPaths(noosphere,'work-chaos','theory-barad');
 assert.ok(paths.some(p=>p.nodes.join('|')==='work-chaos|dissolution|intra-action|theory-barad'));
 assert.ok(paths.every(p=>p.relations.every(e=>e.status==='documented')));
});
test('world membership does not become an invented theoretical influence',()=>{
 const d=structuredClone(noosphere);
 d.relations=d.relations.filter(e=>!['work-chaos','theory-barad'].includes(e.from)||['contains','references'].includes(e.predicate));
 d.relations=d.relations.filter(e=>!['work-chaos','theory-barad'].includes(e.to)||['contains','references'].includes(e.predicate));
 assert.deepEqual(findPaths(d,'work-chaos','theory-barad'),[]);
});
test('proposed interpretation is excluded by default and shown only when requested',()=>{
 assert.ok(!connections(noosphere,'work-forgetting').some(e=>e.to==='irreversibility'));
 assert.ok(connections(noosphere,'work-forgetting',{includeProposed:true}).some(e=>e.to==='irreversibility'&&e.status==='proposed'));
 assert.deepEqual(findPaths(noosphere,'work-forgetting','irreversibility'),[]);
 assert.ok(findPaths(noosphere,'work-forgetting','irreversibility',{includeProposed:true}).length);
});
test('validator catches dangling nodes, missing evidence, wrong relation types and false certainty',()=>{
 for(const mutate of [
  d=>d.relations[0].to='missing',
  d=>d.relations[0].evidence=[],
  d=>d.relations.find(e=>e.predicate==='belongsTo').to='recovery',
  d=>d.relations[0].status='proven',
  d=>d.relations[0].evidence=[{source:'unknown-source',section:'missing'}]
 ]){const d=structuredClone(noosphere);mutate(d);assert.ok(validate(d).length);}
});
test('exports keep source scopes, proposals and open questions without private source paths',()=>{
 const text=toMarkdown(noosphere)+'\n'+sourceRegister(noosphere);
 assert.match(text,/회복/);assert.match(text,/해석 제안/);assert.match(text,/서사 설정/);
 assert.match(text,/원문 대조/);
 assert.doesNotMatch(text,/\/Volumes\/|뇌경색|병원|Space 458|Ayako Rokkaku|Total Gallery/);
 assert.ok(noosphere.nodes.find(n=>n.id==='work-threshold').status.includes('기획'));
 assert.ok(noosphere.nodes.find(n=>n.id==='work-voyage').status.includes('파일럿'));
});
