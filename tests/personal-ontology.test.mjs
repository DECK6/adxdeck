import test from 'node:test';
import assert from 'node:assert/strict';
import { sample, validate, query, eligible, toMarkdown, promptFor, parseImport, TYPES, RELATIONS } from '../ontology/study/assets/personal-ontology-core.mjs';
const day = '2026-10-07';
test('three demo stages are valid and grow beyond self', () => {
 const a=sample(1), b=sample(2), c=sample(3);
 for(const d of [a,b,c]) assert.deepEqual(validate(d),[]);
 assert.ok(a.nodes.length < b.nodes.length && b.nodes.length < c.nodes.length);
 assert.ok(c.relations.some(e=>e.from!=='self' && e.to!=='self'));
});
test('typed relations reject invalid direction and role without project scope',()=>{
 const d=sample(3); d.relations.push({id:'bad',from:'task1',predicate:'responsible',to:'self',source:'test',status:'confirmed',scope:'',validFrom:'',validTo:''});
 assert.ok(validate(d).some(x=>x.includes('종류')));
 const r=d.relations.find(x=>x.predicate==='hasRole'); r.scope='';
 assert.ok(validate(d).some(x=>x.includes('프로젝트')));
});
test('evidence, certainty, calendar and validity intervals govern answers',()=>{
 const d=sample(3), edge=d.relations.find(x=>x.predicate==='responsible'&&x.to==='task1');
 assert.equal(eligible(edge,day),true);
 edge.status='hypothesis'; assert.equal(eligible(edge,day),false);
 edge.status='confirmed'; edge.source=' '; assert.equal(eligible(edge,day),false);
 edge.source='test'; edge.validFrom='2026-10-08'; assert.equal(eligible(edge,day),false);
 edge.validFrom=''; edge.validTo='2026-10-06'; assert.equal(eligible(edge,day),false);
 edge.validFrom='2026-02-30'; edge.validTo=''; assert.ok(validate(d).some(x=>x.includes('날짜')));
});
test('query work follows actual assignment and evidence, not occupation',()=>{
 const d=sample(3); assert.ok(query(d,'work','task1',day).items.some(x=>x.title.includes('실습')));
 d.relations=d.relations.filter(x=>!(x.from==='self'&&x.predicate==='responsible'));
 assert.equal(query(d,'work','task1',day).items.length,0);
});
test('work responsibility is explicit and discussion does not imply review authority',()=>{
 const d=sample(3), q=query(d,'people','task1',day);
 assert.ok(q.items.some(x=>x.title.includes('담당')&&x.title.includes('육대근')));
 assert.ok(!q.items.some(x=>x.title.includes('안OO')));
 assert.ok(q.items.every(x=>x.paths.length&&x.paths.every(p=>p.source)));
 d.relations.push({id:'test-review',from:'peer',predicate:'reviews',to:'task1',source:'통제 테스트: 검토 관계를 명시적으로 추가',status:'confirmed',scope:'',validFrom:'',validTo:''});
 assert.ok(query(d,'people','task1',day).items.some(x=>x.title.includes('검토')&&x.title.includes('안OO')));
});
test('reuse follows a shared concept and does not invent a prior project',()=>{
 const d=sample(3); const q=query(d,'reuse','task1',day);
 assert.ok(q.items.some(x=>x.title.includes('장면·개념')));
 d.relations.find(x=>x.from==='task2'&&x.predicate==='uses').status='unknown';
 assert.equal(query(d,'reuse','task1',day).items.length,0);
});
test('unknown is a lack of evidence, not proof of no relationship',()=>{
 const q=query(sample(1),'people','missing',day);
 assert.equal(q.items.length,0); assert.match(q.summary,/확인할 근거/);
});
test('JSON import validates before replacing state and rejects oversized or malformed records',()=>{
 assert.throws(()=>parseImport('{bad'),/JSON/);
 assert.throws(()=>parseImport(JSON.stringify({...sample(1),version:99})),/버전/);
 const d=sample(1);d.nodes[1].id=d.nodes[0].id;assert.throws(()=>parseImport(JSON.stringify(d)),/중복/);
 assert.deepEqual(parseImport(JSON.stringify(sample(3))),sample(3));
 assert.throws(()=>parseImport(' '.repeat(1000001)),/크기/);
});
test('exports include reusable schema, evidence, limitations and questions',()=>{
 const d=sample(3), md=toMarkdown(d,day), p=promptFor(d,day);
 for(const term of ['관계 정의','확인 상태','근거','담당한다','직업','역할'])assert.ok(md.includes(term),term);
 assert.match(p,/실제 답변/);assert.match(p,/추측/);assert.match(p,/원문/);
 assert.ok(Object.keys(TYPES).length>=6&&Object.keys(RELATIONS).length>=10);
});

test('owner stays identifiable while surrounding case identities are anonymized',()=>{
 const d=sample(3),text=JSON.stringify(d);
 assert.equal(d.nodes.find(n=>n.id==='self').label,'육대근 · DECK');
 assert.equal(d.nodes.find(n=>n.id==='peer').label,'안OO');
 assert.ok(text.includes('A커뮤니티')&&text.includes('B기관'));
 assert.ok(!text.includes('민서')&&!text.includes('지우')&&!text.includes('가상'));
});
test('works remain separate from projects and conceptual work is not asserted exhibited',()=>{
 const d=sample(3),q=query(d,'artworks','task1',day);
 assert.equal(d.nodes.filter(n=>n.type==='artwork').length,5);
 assert.equal(q.items.length,5);
 const project=d.nodes.find(n=>n.id==='project4');
 assert.equal(project.type,'project');
 assert.deepEqual(d.relations.filter(e=>e.from===project.id&&e.predicate==='produces').map(e=>e.to),['work1','work2']);
 assert.ok(q.items.find(i=>i.title.includes('역치')).detail.includes('완료는 이 기록으로 확인하지 않는다'));
});

test('project participation is displayed without inventing task authority',()=>{
 const q=query(sample(3),'people','task3',day);
 assert.equal(q.items.length,2);
 assert.ok(q.items.some(i=>i.title.includes('안OO')));
 assert.ok(q.items.every(i=>i.title.includes('프로젝트 참여')&&i.detail.includes('권한은 미확인')));
});

test('career expansion covers the database across domains without replacing the small lesson',()=>{
 const d=sample(4);assert.deepEqual(validate(d),[]);
 assert.equal(sample(1).nodes.length,4);
 assert.ok(d.nodes.length>150);
 const codes=new Set(d.nodes.flatMap(n=>n.sourceCodes||[]).filter(c=>c.startsWith('K')));
 assert.equal(codes.size,95,'96 career rows minus the excluded book row');
 for(const label of ['상상유랑','PRECTXE','AKM Agent Knowledge Management','ringsplat','Anamorphic Sim','MICE 안전관리 에이전트','DEXA Memora','버추어미','Human in the Loop','하루배움'])assert.ok(d.nodes.some(n=>n.label.includes(label)),label);
 for(const group of ['경력','기업 교육·컨설팅','공공 교육·자문','교육·멘토링','커뮤니티','학습','수상·자격'])assert.ok(d.nodes.some(n=>n.group===group),group);
 assert.equal(d.nodes.filter(n=>n.label==='손의 잔향').length,1);
 assert.ok(!JSON.stringify(d).includes('Hermes Agent book'));
});
test('career lookup crosses project and career records with evidence and preserves uncertainty',()=>{
 const d=sample(4),topic=d.nodes.find(n=>n.type==='concept'&&n.label==='AX');
 assert.ok(topic);const q=query(d,'career',topic.id,day);
 assert.ok(q.items.some(i=>i.title.includes('RFP')));
 assert.ok(q.items.some(i=>i.title.includes('AX 응용과정')));
 assert.ok(q.items.every(i=>i.paths.length&&i.paths.every(p=>p.source)));
 const uncertain=d.nodes.find(n=>n.sourceCodes?.includes('K040'));
 assert.ok(uncertain.note.includes('증빙 보강'));
 const edge=d.relations.find(e=>e.from==='self'&&e.to===uncertain.id);assert.equal(edge.status,'unknown');
 assert.ok(!query(d,'career','',day).items.some(i=>i.title===uncertain.label));
});
test('career metadata survives export and import and validates type and scope',()=>{
 const d=sample(4);assert.deepEqual(parseImport(JSON.stringify(d)),d);
 const n=d.nodes.find(n=>n.group==='경력');const md=toMarkdown(d,day);
 assert.ok(md.includes(n.period)&&md.includes(n.sourceCodes[0]));
 const r=d.relations.find(e=>e.predicate==='hasRole'&&e.scope===n.id);assert.ok(r);
 n.topics='bad';assert.ok(validate(d).length);
});
