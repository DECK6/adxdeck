import {weeklyAssignment} from './assignments.mjs';
import {weeks} from './data.mjs';
import {validationScript} from './check-source.mjs';
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const idPattern=/^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
export function validate(m){
 const errors=[],add=(code,message,nodeIds=[])=>errors.push({code,message,nodeIds});
 const ids=new Set(),notes=new Set(m.notes.map(n=>n.id));
 for(const n of m.nodes){
  if(!idPattern.test(n.id)||ids.has(n.id))add('ID',`ID ${n.id}: 중복되었거나 형식이 맞지 않습니다.`,[n.id]);ids.add(n.id);
  if(!n.label?.trim()||!Object.hasOwn(m.classes,n.type))add('CLASS',`${n.id}: 이름과 정의된 종류가 필요합니다.`,[n.id]);
  if(!notes.has(n.noteId))add('SOURCE',`${n.id}: 출처 문서가 없습니다.`,[n.id]);
  for(const [k,v] of Object.entries(n.attrs||{}))if(typeof v==='number'&&(!Number.isFinite(v)||v<0))add('VALUE',`${n.id}: ${k} 값이 올바르지 않습니다.`,[n.id]);
 }
 const by=Object.fromEntries(m.nodes.map(n=>[n.id,n])),edgeKeys=new Set();
 for(const e of m.edges){
  const a=by[e.from],b=by[e.to],r=m.relations[e.rel],key=[e.from,e.rel,e.to].join('|');
  if(edgeKeys.has(key))add('DUPLICATE',`${e.from} → ${e.to}: 같은 관계가 두 번 있습니다.`,[e.from,e.to]);edgeKeys.add(key);
  if(!a||!b){add('ENDPOINT',`${e.from} → ${e.to}: 연결 대상이 없습니다.`,[e.from,e.to]);continue;}
  if(!r||!r.from.includes(a.type)||!r.to.includes(b.type))add('TYPE',`${a.label} → ${b.label}: 관계의 시작·끝 종류가 맞지 않습니다.`,[e.from,e.to]);
  if(!notes.has(e.source))add('SOURCE',`${a.label} → ${b.label}: 관계의 근거 문서가 없습니다.`,[e.from,e.to]);
 }
 const done=new Set(),active=new Set();
 function visit(id){if(active.has(id)){add('CYCLE','선수 관계가 원을 이룹니다. 시작할 수 있는 순서를 다시 정하세요.',[...active,id]);return;}if(done.has(id))return;active.add(id);for(const e of m.edges.filter(e=>e.from===id&&e.rel==='requires'))if(by[e.to])visit(e.to);active.delete(id);done.add(id);}
 for(const n of m.nodes)visit(n.id);
 return errors;
}
export function query(m,i){
 if(validate(m).length)return{status:'INVALID',answer:'먼저 관계망 검사 오류를 해결하세요. 잘못된 모델로 답을 만들지 않습니다.',nodes:[],evidence:[]};
 const by=Object.fromEntries(m.nodes.map(n=>[n.id,n]));
 const pack=(status,answer,nodes,evidence)=>({status,answer,nodes,evidence:[...new Set(evidence)]});
 if(i===2)return m.id==='education'?pack('UNKNOWN','판단 보류. 확인 질문은 있지만 민지A의 실제 답변·관찰·평가 결과가 없습니다. 학습 자료의 존재를 학습자의 성취로 바꿔 읽을 수 없습니다.',['A1'],['E08','E10']):pack('UNKNOWN','판단 보류. 이 자료는 공간 배치와 요구 조건을 담은 개념 모델입니다. 구조 검토·대지 조건·적용 절차·허가 증거가 없어 안전이나 허가 완료를 판단할 수 없습니다.',['DRAWING','BRIEF'],['A09','A10']);
 if(m.id==='education'){
  if(i===0){if(!by.T5)return pack('UNKNOWN','도달 목표 T5가 없습니다.',[],[]);const result=[],evidence=[],seen=new Set();const walk=id=>{if(seen.has(id))return;seen.add(id);for(const e of m.edges.filter(e=>e.from===id&&e.rel==='requires')){evidence.push(e.source);walk(e.to);}result.push(id);};walk('T5');return pack('SUPPORTED',result.map(id=>by[id].label).join(' → ')+' 순서입니다. 이 수업 설계에 한정된 제안 경로이며, 학생별 필수 순서나 진단 결과는 아닙니다.',result,evidence);}
  const es=m.edges.filter(e=>e.to==='T4'&&['teaches','checks'].includes(e.rel));return pack(es.length?'SUPPORTED':'UNKNOWN',es.length?es.map(e=>`${by[e.from].label}: ${m.relations[e.rel].label}`).join(' / ')+' — 실제 문서에서 활동 내용과 확인 질문을 읽으세요.':'교재·확인 질문 연결이 없습니다.',[...es.map(e=>e.from),'T4'],es.map(e=>e.source));
 }
 if(i===0){
  const spaces=m.edges.filter(e=>e.from==='HOUSE'&&e.rel==='contains').map(e=>by[e.to]);
  const bed=spaces.filter(n=>n.attrs.role==='bedroom').length,bath=spaces.filter(n=>n.attrs.role==='bathroom').length;
  const separate=['living','kitchen','dining'].every(role=>spaces.some(n=>n.attrs.role===role));
  return pack(bed===3&&bath===2&&separate?'SUPPORTED':'MISMATCH',`이 모델은 침실 ${bed}개, 욕실 ${bath}개입니다. 거실·주방·다이닝의 별도 공간 기록은 ${separate?'있습니다':'충분하지 않습니다'}. 이는 기록된 공간 요구의 확인이며 거주 품질·시공·법규 적합 판정은 아닙니다.`,['HOUSE',...spaces.map(n=>n.id)],['A01',...spaces.map(n=>n.noteId)]);
 }
 const path=['WINDOW'],evidence=[];let current='WINDOW';
 for(const rel of ['fillsOpening','hostedBy','bounds']){const e=m.edges.find(e=>e.from===current&&e.rel===rel);if(!e)return pack('UNKNOWN','창에서 공간으로 이어지는 근거 연결이 끊어져 있습니다.',path,evidence);evidence.push(e.source);path.push(e.to);current=e.to;}
 return pack('SUPPORTED',path.map(id=>by[id].label).join(' → ')+`. 창의 기록 치수는 폭 ${by.WINDOW.attrs.widthMm??'미기록'}mm, 높이 ${by.WINDOW.attrs.heightMm??'미기록'}mm입니다.`,path,evidence);
}
export function toTTL(m){
 const lit=v=>JSON.stringify(String(v));
 const lines=['@prefix ex: <https://dexa.art/ontology/study/vocab/'+m.id+'#> .','@prefix owl: <http://www.w3.org/2002/07/owl#> .','@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .','@prefix prov: <http://www.w3.org/ns/prov#> .','@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .','ex:ontology a owl:Ontology ; rdfs:label '+lit(m.name+' 실습 온톨로지')+' .'];
 for(const [k,label] of Object.entries(m.classes))lines.push(`ex:${k} a owl:Class ; rdfs:label ${lit(label)} .`);
 for(const [k,r] of Object.entries(m.relations)){
  // Multiple domains in OWL mean intersection; emit unionOf when needed.
  const expr=types=>types.length===1?'ex:'+types[0]:'[ a owl:Class ; owl:unionOf ( '+types.map(t=>'ex:'+t).join(' ')+' ) ]';
  lines.push(`ex:${k} a owl:ObjectProperty ; rdfs:label ${lit(r.label)} ; rdfs:domain ${expr(r.from)} ; rdfs:range ${expr(r.to)} .`);
 }
 for(const n of m.nodes){lines.push(`ex:${n.id} a ex:${n.type} ; rdfs:label ${lit(n.label)} ; prov:wasDerivedFrom ex:${n.noteId} .`);for(const [k,v] of Object.entries(n.attrs||{})){if(idPattern.test(k))lines.push(`ex:${k} a owl:DatatypeProperty .\nex:${n.id} ex:${k} ${typeof v==='number'?v:lit(v)} .`);}}
 for(const e of m.edges)lines.push(`ex:${e.from} ex:${e.rel} ex:${e.to} .\n[] a owl:Axiom ; owl:annotatedSource ex:${e.from} ; owl:annotatedProperty ex:${e.rel} ; owl:annotatedTarget ex:${e.to} ; prov:wasDerivedFrom ex:${e.source} .`);
 for(const n of m.notes)lines.push(`ex:${n.id} a prov:Entity ; rdfs:label ${lit(n.title)} .`);
 return lines.join('\n')+'\n';
}
export function setEvaluation(records,key,value){
 const [qid,phase,field]=key.split('|');
 if(!/^Q[1-3]$/.test(qid)||!['before','after'].includes(phase)||!['answer','evidence','accuracy','consistency','source'].includes(field))throw Error('평가 입력 경로를 확인하세요.');
 records[qid]??={};records[qid][phase]??={};
 records[qid][phase][field]=['accuracy','consistency','source'].includes(field)?(value===''?null:Number(value)):String(value);
}
export function scoreReport(records){
 const out={before:null,after:null,beforeCount:0,afterCount:0};
 for(const phase of ['before','after']){let sum=0,count=0;for(const id of ['Q1','Q2','Q3']){const r=records[id]?.[phase];if(r?.answer?.trim()&&r?.evidence?.trim()&&['accuracy','consistency','source'].every(k=>Number.isInteger(r[k])&&r[k]>=0&&r[k]<=2)){count++;sum+=r.accuracy+r.consistency+r.source;}}out[phase+'Count']=count;if(count===3)out[phase]=sum;}
 return out;
}
export function parseWorkspace(text,{allowPersonal=false}={}){
 if(text.length>1_000_000)throw Error('파일은 1MB 이하로 준비하세요.');let m;try{m=JSON.parse(text);}catch{throw Error('JSON 형식을 확인하세요.');}
 if(!m||!['education','architecture',...(allowPersonal?['personal']:[])].includes(m.id)||!Array.isArray(m.nodes)||(!m.nodes.length&&m.id!=='personal')||m.nodes.length>200||!Array.isArray(m.edges)||m.edges.length>400||!Array.isArray(m.notes)||m.notes.length>100||!m.classes||!m.relations)throw Error('실습 model.json 형식이 필요합니다. 최대 대상 200개·관계 400개입니다.');
 for(const obj of [m.classes,m.relations])if(Object.keys(obj).length>40||Object.keys(obj).some(k=>!idPattern.test(k)||['__proto__','constructor','prototype'].includes(k)))throw Error('종류·관계 이름을 확인하세요.');
 for(const n of m.nodes)if(!n||typeof n.id!=='string'||!idPattern.test(n.id)||typeof n.label!=='string'||n.label.length>100||!n.attrs||typeof n.attrs!=='object'||Array.isArray(n.attrs)||Object.values(n.attrs).some(v=>!['string','number','boolean'].includes(typeof v)))throw Error('대상의 이름·종류·속성 형식을 확인하세요.');
 for(const n of m.notes)if(!n||!idPattern.test(n.id)||typeof n.title!=='string'||typeof n.body!=='string'||!Array.isArray(n.links)||n.links.some(l=>typeof l!=='string'))throw Error('문서 형식을 확인하세요.');
 for(const e of m.edges)if(!e||!['from','rel','to','source'].every(k=>typeof e[k]==='string'))throw Error('관계 형식을 확인하세요.');
 for(const r of Object.values(m.relations))if(!r||typeof r.label!=='string'||!Array.isArray(r.from)||!Array.isArray(r.to)||!r.from.length||!r.to.length||[...r.from,...r.to].some(t=>!Object.hasOwn(m.classes,t)))throw Error('관계의 시작·끝 종류를 확인하세요.');
 if(Object.values(m.classes).some(v=>typeof v!=='string'))throw Error('종류의 표시 이름은 문자열이어야 합니다.');
 return m;
}
const fm=(layer,type,description)=>`---\ndescription: "${description}"\nakmLayer: ${layer}\nakmType: ${type}\ntrustLevel: draft\ndate created: 2026-09-12\ndate modified: 2026-09-12\n---\n\n`;
export function noteMarkdown(m,n,compiled=false){
 const edges=m.edges.filter(e=>m.nodes.find(x=>x.id===e.from)?.noteId===n.id);
 return fm(compiled?'knowledge':'source',compiled?'guide':'source',compiled?'Compiled practice knowledge with explicit source links.':'Synthetic source note for a knowledge management exercise.')+`# ${n.id} · ${n.title}\n\n${n.body}\n\n`+(compiled?`## 출처\n\n[[10-sources/${n.id}]]\n\n## 연결\n\n${n.links.map(id=>`- [[20-knowledge/${id}]]`).join('\n')}\n\n## 의미가 있는 관계\n\n${edges.map(e=>`- ${e.from} — ${e.rel} → ${e.to} (근거: ${e.source}, 교수학습/모델 가정)`).join('\n')}`:'원본 상태를 보존하고 해석은 별도 지식 노트에 기록하세요.')+'\n';
}
export function agentPrompt(m){return `이 폴더는 GPTers 24기 ${m.name} 실습용 AKM입니다.\n1. AKM의 99-system/INDEX.md, ROUTER.md, LOOP.md와 이 폴더의 practice/README.md를 읽으세요.\n2. practice/model.json과 practice/questions.json을 읽고, 관계의 뜻·방향·출처를 먼저 확인하세요. 원본 자료는 10-sources, 합성 지식은 20-knowledge에 있습니다.\n3. 질문마다 답변 / 사용한 문서 ID와 근거 문장 / 따라간 관계 / 판단 불가 사항을 분리하세요. 연결이 없는 내용을 상식으로 메우지 마세요.\n4. 학생 성취나 건축 허가·구조 안전을 자료 없이 판정하지 마세요.\n5. expected-answers.json이나 웹의 참고 답변을 읽거나 답안으로 복사하지 마세요. 비교할 때는 같은 모델·설정의 새 대화에서 같은 질문·응답 형식을 유지하세요.\n6. 결과를 practice/response-template.json의 형식으로 새 파일에 저장하세요. phase를 실제 실행 단계(before 또는 after)로 정하고 모델명·실행일·질문을 기록하세요. 템플릿의 미측정 상태를 실행 결과로 오인하지 마세요.\n7. 질문은 다음 3개를 그대로 사용하세요.\n${m.questions.map((q,i)=>`Q${i+1}. ${q}`).join('\n')}\n\n웹의 관계 질의 미리보기는 규칙으로 계산한 예시입니다. 실제 LLM 답변은 직접 실행해 기록하세요.`;}
export function baselinePrompt(m){return `같은 모델·설정의 새 대화에서 적용 전 기준선을 측정합니다.
이 폴더의 00-inbox 원자료 10개와 practice/questions.json만 근거로 질문 3개에 답하세요.
reference, practice/model.json, ontology.ttl, expected-answers.json 및 완성 지식 노트는 읽지 마세요.
질문마다 답변, 원문 ID와 근거 문장, 판단 불가 사항을 분리하세요.
원자료를 수정하지 말고 practice/response-template.json 형식의 새 before 응답 파일에 실제 모델명·실행일·답변·출처를 기록하세요.
${m.questions.map((q,i)=>`Q${i+1}. ${q}`).join('\n')}
미리보기나 참고 답변을 실제 실행 결과로 복사하지 마세요.`;}
export function filesForWeek(m,w){
 const f={},phase=weeks[w-1],j=v=>JSON.stringify(v,null,2)+'\n';
 f['my-topic/this-week.md']=weeklyAssignment(w);
 f['my-topic/README.md']='# 내 주제로 적용하기\n\n웹의 내 주제 실습실 https://dexa.art/ontology/study/my-topic.html 에서 내 자료와 질문을 입력하세요. 예시를 확인한 뒤 같은 방법을 자기 업무·연구에 적용합니다. 입력한 프로젝트 JSON과 주차별 작업 ZIP을 따로 보관하세요.\n';
 f['README.md']=`# GPTers 24기 · ${m.name} · ${w}주차\n\n${phase.lead}\n\n${m.scope}\n\n## 시작\n\n1. 공식 AKM https://github.com/DECK6/akm 을 새 폴더에 준비하세요. 에이전트에 “공식 AKM을 새 gpters24-${m.id} 폴더에 설치해줘”라고 요청하거나 GitHub의 Code → Download ZIP을 사용하세요. 기존 개인 볼트에서 시작하지 않는 것을 권장합니다.\n2. 이 ZIP은 AKM 본체가 아니라 주차별 실습 자료입니다. 1주차에는 00-inbox와 practice를 새 AKM 폴더에 복사하세요. reference는 완성 예시입니다.\n3. 2주차 이후에는 같은 사례 폴더를 이어 사용하세요. 직접 만든 파일은 먼저 별도 보관하고, 패키지의 완성 예시와 나란히 비교하세요. before 답변 기록을 덮어쓰지 마세요.\n4. Obsidian에서 AKM 폴더를 볼트로 열고 Graph view를 확인하세요. 문서 링크망의 선은 관계의 의미까지 자동 검증하지 않습니다.\n\n## 이번 주\n\n${phase.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n결과물: ${phase.output}\n\n${phase.homework}\n\n## 파일 안내\n\n- practice/questions.json: 4주간 동일하게 사용할 질문 3개\n- practice/model.json: 웹과 동일한 완성 참고 모델\n- practice/response-template.json: 실제 에이전트 응답 기록용 빈 양식\n- practice/agent-prompt.md: 에이전트에 연결하는 요청문\n- practice/evaluation.csv: 답·출처·평가를 기록하는 빈 표\n- reference 또는 20-knowledge: 비교용 합성 지식\n\n${w>=2?'## 모델 검사\n\npractice 폴더에서 `python3 check.py model.json`을 실행하세요. 정상 모델은 valid: true, `python3 check.py model-error.json`은 의도한 오류를 반환합니다. expected-answers.json은 비교용 참고 답변이며 LLM 실행 결과가 아닙니다.\n\n':''}웹에서 보인 참고 답변은 실제 LLM 실행 성적이 아닙니다.\n`;
 f['practice/README.md']=`# ${m.name} 실습 범위\n\n${m.scope}\n\n${m.provenance}\n\n질문과 원문 ID는 4주 내내 유지합니다. 관계 수정은 model.json의 작업 복사본에 기록하세요. 출처 문서가 바뀌면 새 리비전을 기록하고 같은 질문을 재실행하세요.\n`;
 f['practice/domain-definition.md']=`# 내 지식 도메인 정의서\n\n예시 도메인: ${m.name}\n\n${m.scope}\n\n## 내가 답하려는 질문\n${m.questions.map((q,i)=>`- Q${i+1}: ${q}`).join('\n')}\n\n## 내 자료로 바꾸기\n- 다루는 범위:\n- 다루지 않는 범위:\n- 자료의 출처·날짜:\n- 주로 등장하는 대상:\n- 질문을 사용하는 사람과 업무:\n`;
 f['practice/diagnosis.md']=`# 지식베이스 진단\n\n- 원자료 10개가 모두 열리는가?\n- 같은 대상에 서로 다른 이름을 쓰는가?\n- 최신 정보와 과거 정보가 섞여 있는가?\n- 출처를 되짚을 수 있는가?\n- 문서 링크가 있지만 어떤 관계인지 모호한 곳은?\n- Q1·Q2·Q3 중 답하지 못한 질문과 원인은?\n\n## 기준선 실행\n같은 모델·설정의 새 대화에서 00-inbox 원자료만 읽힙니다. reference와 model.json, ontology.ttl, expected-answers.json을 기준선에 사용하지 않습니다. 1주차 practice/agent-prompt.md에 기준선용 요청문이 있습니다. 실제 답변은 before 파일로 따로 보관합니다.\n`;
 if(w>=2)f['practice/schema-decisions.md']=`# 관계 설계 기록\n\n- 해결할 질문:\n- 종류와 대상 ID:\n- 관계 ID·읽는 말:\n- 시작 종류 → 끝 종류:\n- 근거 문서와 문장:\n- 모델링 가정과 미확인 범위:\n- 검사할 반례:\n- 변경 전후 및 검토자:\n`;
 if(w>=3)f['practice/run-log.md']=`# 실제 에이전트 실행 기록\n\n- 단계: after\n- 실행일·도구·모델·설정:\n- 새 대화 여부:\n- 모델 파일 리비전:\n- 읽도록 허용한 파일:\n- 동일 질문 3개 유지 여부:\n- 출력 파일과 출처 확인 결과:\n- 실패하거나 보류한 판단:\n\n1주차 before 파일을 덮어쓰지 않습니다. 참고 답변은 실행이 끝난 뒤 비교용으로 읽습니다.\n`;
 if(w===4)f['practice/final-report.md']=`# 4주차 최종 발표\n\n1. 처음 해결하려던 문제와 질문 3개\n2. LLM Wiki에서 바꾼 구조\n3. 추가한 개념·관계·속성\n4. 실제 에이전트가 근거를 찾아 답하는 장면\n5. 같은 질문의 적용 전후 답·출처·평가 비교\n6. 개선되지 않은 부분과 아직 판단할 수 없는 범위\n7. 계속 운영할 규칙과 다음 변경\n\n점수 향상을 미리 가정하지 않습니다. 차이가 없거나 나빠진 결과도 원인과 함께 기록합니다.\n`;
 f['practice/model.json']=j(m);f['practice/questions.json']=j(m.questions.map((question,i)=>({id:'Q'+(i+1),question})));
 f['practice/agent-prompt.md']=(w===1?baselinePrompt(m):agentPrompt(m))+'\n';
 f['practice/response-template.json']=j({domain:m.id,phase:w===1?'before':'after',model:'',runAt:'',status:'unmeasured',responses:m.questions.map((question,i)=>({id:'Q'+(i+1),question,answer:'',evidence:[],limitations:''}))});
 f['practice/evaluation.csv']='question_id,phase,answer,evidence,accuracy_0_2,consistency_0_2,source_0_2\n'+m.questions.flatMap((q,i)=>['before','after'].map(p=>`Q${i+1},${p},,,,,`)).join('\n')+'\n';
 for(const n of m.notes){f[(w===1?'00-inbox/':'10-sources/')+n.id+'.md']=noteMarkdown(m,n);f[(w===1?'reference/':'')+'20-knowledge/'+n.id+'.md']=noteMarkdown(m,n,true);}
 f[(w===1?'reference/':'')+'99-system/INDEX.local.md']='# 실습 문서 색인\n\n'+m.notes.map(n=>`- [[20-knowledge/${n.id}|${n.title}]]`).join('\n')+'\n';
 if(w>=2){f['practice/check.py']=validationScript;f['practice/model-error.json']=j({...m,edges:[...m.edges,m.error]});f['practice/expected-answers.json']=j(m.questions.map((question,i)=>({id:'Q'+(i+1),question,...query(m,i),kind:'deterministic-reference-not-LLM-run'})));f['practice/ontology.ttl']=toTTL(m);f['practice/schema.json']=j({classes:m.classes,relations:m.relations,requiredNodeFields:['id','label','type','noteId','attrs'],rules:['unique IDs','known endpoints','domain/range','source exists','acyclic requires']});f['practice/ONTOLOGY.md']=`# ${m.name} 온톨로지 설계\n\n${m.scope}\n\n## 종류\n${Object.entries(m.classes).map(([k,v])=>`- ${k}: ${v}`).join('\n')}\n\n## 관계\n${Object.entries(m.relations).map(([k,v])=>`- ${k}: ${v.label} (${v.from.join('/')} → ${v.to.join('/')})`).join('\n')}\n\nOWL 파일은 종류·관계·개체·출처를 표현합니다. 웹의 순환/필수값 검사는 별도의 경량 검사이며 OWL reasoner나 SHACL 엔진 실행 결과가 아닙니다.\n`;}
 if(w===4)f['practice/OPERATIONS.md']='# 지속 운영 규칙\n\n1. 새 자료는 inbox에 넣고 출처·날짜·범위를 확인한다.\n2. 원본과 해석을 분리한다. 같은 대상을 중복 ID로 만들지 않는다.\n3. 관계의 방향·뜻·출처를 검토한 뒤 승인한다.\n4. 자료나 스키마를 바꾸면 변경 이유·담당자·리비전을 기록한다.\n5. 세 질문을 재실행하고 답변·출처·보류 판단을 비교한다.\n6. 폐기할 자료는 근거 연결을 확인하고 보관 폴더나 휴지통으로 이동한다.\n7. 오류가 나면 모델·원자료·검색·응답 중 어느 단계가 원인인지 구분해 수정한다.\n\n## 평가 기준\n정확성: 0 근거와 충돌 / 1 일부 맞음 또는 누락 / 2 근거에 맞게 답하거나 필요한 판단 보류.\n일관성: 0 같은 질문·관계를 모순되게 해석 / 1 일부 용어·방향 흔들림 / 2 ID·관계 의미·판단 범위를 일관되게 사용.\n출처: 0 없거나 다른 자료 / 1 문서만 제시 / 2 실제 근거 문장과 연결을 확인할 수 있음.\n반복 실행 일관성을 평가하려면 같은 질문을 반복 실행하고 그 결과도 보관한다. 한 번의 답변 비교를 모델 안정성 검증으로 확대하지 않는다.\n';
 return Object.fromEntries(Object.entries(f).map(([path,text])=>[path,text.trimEnd()+'\n']));
}
