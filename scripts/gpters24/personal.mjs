import {parseWorkspace,toTTL,scoreReport,validate} from './core.mjs';
import {validationScript} from './check-source.mjs';

import {personalWeeks,weeklyAssignment} from './assignments.mjs';
export {personalWeeks} from './assignments.mjs';
export function createProject(){return {
 format:'gpters24-personal-v1',title:'',scope:'',excluded:'',questions:['','',''],
 model:{id:'personal',name:'내 주제',classes:{Concept:'개념'},relations:{},nodes:[],edges:[],notes:[]},
 records:{},reflection:['','','',''],operations:'',revision:'v1'
};}
const string=(v,max=20000)=>typeof v==='string'&&v.length<=max;
export function parseProject(text){
 if(text.length>1_000_000)throw Error('프로젝트 파일은 1MB 이하로 준비하세요.');
 let p;try{p=JSON.parse(text);}catch{throw Error('JSON 형식을 확인하세요.');}
 if(p?.format!=='gpters24-personal-v1'||!string(p.title,120)||!string(p.scope)||!string(p.excluded)||!Array.isArray(p.questions)||p.questions.length!==3||p.questions.some(q=>!string(q,500))||!Array.isArray(p.reflection)||p.reflection.length!==4||p.reflection.some(s=>!string(s))||!string(p.operations)||!string(p.revision,100)||p.model?.id!=='personal')throw Error('내 주제 프로젝트 JSON 형식이 필요합니다.');
 const model=parseWorkspace(JSON.stringify(p.model),{allowPersonal:true});
 if(new Set(model.notes.map(n=>n.id)).size!==model.notes.length||model.notes.some(n=>!string(n.source||'',2000)||!string(n.date||'',100)))throw Error('자료 ID와 출처 형식을 확인하세요.');
 const records={};for(const qid of ['Q1','Q2','Q3'])for(const phase of ['before','after']){
  const r=p.records?.[qid]?.[phase];if(!r)continue;
  if(!string(r.answer??'')||!string(r.evidence??''))throw Error('답변과 근거 형식을 확인하세요.');
  records[qid]??={};records[qid][phase]={answer:r.answer??'',evidence:r.evidence??''};
  for(const k of ['accuracy','consistency','source'])records[qid][phase][k]=Number.isInteger(r[k])&&r[k]>=0&&r[k]<=2?r[k]:null;
 }
 if(p.records?.runs){records.runs={};for(const phase of ['before','after']){const r=p.records.runs[phase];if(r)records.runs[phase]={model:String(r.model||'').slice(0,200),runAt:String(r.runAt||'').slice(0,100)};}}
 return {format:p.format,title:p.title,scope:p.scope,excluded:p.excluded,questions:p.questions,model,records,reflection:p.reflection,operations:p.operations,revision:p.revision};
}
export function applyResponses(project,text){
 if(text.length>1_000_000)throw Error('응답 파일은 1MB 이하로 준비하세요.');
 let r;try{r=JSON.parse(text);}catch{throw Error('JSON 형식을 확인하세요.');}
 if(r.domain!=='personal'||r.projectTitle!==project.title||!['before','after'].includes(r.phase)||r.responses?.length!==3)throw Error('이 주제의 response-template.json 형식인지 확인하세요.');
 const seen=new Set();for(const x of r.responses){const i=Number(x.id?.slice(1))-1;if(!/^Q[1-3]$/.test(x.id)||seen.has(x.id)||x.question!==project.questions[i]||!x.answer?.trim()||!string(x.answer)||!Array.isArray(x.evidence))throw Error('고정 질문 3개와 실제 답변·근거 배열을 확인하세요.');seen.add(x.id);}
 const p=structuredClone(project);p.records.runs??={};p.records.runs[r.phase]={model:String(r.model||''),runAt:String(r.runAt||'')};
 for(const x of r.responses){p.records[x.id]??={};p.records[x.id][r.phase]={answer:x.answer,evidence:x.evidence.map(e=>typeof e==='string'?e:JSON.stringify(e)).join('\n')||'없음',accuracy:null,consistency:null,source:null};}
 return parseProject(JSON.stringify(p));
}
export function personalPrompt(p,w){
 const questions=p.questions.map((q,i)=>`Q${i+1}. ${q||'[내 질문을 입력하세요]'}`).join('\n');
 if(w===1)return `주제: ${p.title||'[내 주제]'}\n범위: ${p.scope||'[다루는 범위]'}\n제외: ${p.excluded||'[다루지 않는 범위]'}\n\n같은 모델·설정의 새 대화에서 정리 전 기준선을 측정합니다. 00-inbox의 내 원자료와 practice/questions.json만 읽고 아래 질문에 답하세요. 모델·완성 Wiki·예시 답안은 읽지 마세요. 답변/실제 근거 문장/판단 불가 사항을 구분해 response-template.json 형식의 새 before 파일로 저장하세요.\n${questions}\n\n기준선 기록이 끝난 뒤 별도 작업으로 공식 AKM https://github.com/DECK6/akm 의 INDEX·ROUTER·LOOP를 읽고 원본을 보존하면서 정리 노트와 링크를 만드세요.`;
 return `주제: ${p.title||'[내 주제]'}\n범위: ${p.scope||'[다루는 범위]'}\n제외: ${p.excluded||'[다루지 않는 범위]'}\n모델 리비전: ${p.revision}\n\n이 실습 AKM의 INDEX·ROUTER·LOOP와 practice/README.md를 읽으세요. 원자료 10-sources, 직접 검토한 정리 노트 20-knowledge, practice/model.json의 종류·관계·속성·근거를 함께 확인하세요. 정리 노트의 빈칸을 실제 지식으로 취급하지 마세요.\n같은 모델·설정의 새 대화에서 아래 고정 질문에 답하세요. 답변/실제 근거 문장/따라간 관계/판단 불가 사항을 구분하고 근거가 없으면 보류하세요. 일반 지식으로 빈칸을 채우지 마세요. practice/response-template.json 형식의 새 after 파일에 실제 모델명과 실행일을 기록하세요. before를 덮어쓰지 마세요.\n${questions}`;
}
export function personalFiles(p,w){
 const j=x=>JSON.stringify(x,null,2)+'\n',m={...p.model,name:p.title||'내 주제'};
 const f={
 'README.md':`# 내 주제 실습 · ${p.title||'아직 입력하지 않음'}\n\n${w}주차 작업 파일입니다. 공식 AKM https://github.com/DECK6/akm 을 새 실습 폴더에 준비하고 자료를 추가하세요. 이 ZIP은 AKM 본체가 아닙니다. 1주차 before 기록과 직접 검토한 Wiki를 다음 주에도 이어 사용하세요. 기존 파일은 먼저 보관하고 비교한 뒤 적용합니다.\n\n웹에서 personal-project.json을 불러오면 주제·자료·관계·평가를 이어 편집할 수 있습니다. 이 파일은 비공개 개인 작업이며 공개 사이트에 자동 업로드되지 않습니다.\n`,
 'personal-project.json':j(p),
 'practice/this-week.md':weeklyAssignment(w),
 'practice/source-note-template.md':'# 내 원자료 양식\n\nID: N1\n제목:\n출처 URL 또는 작성자·문서명:\n작성일:\n\n## 원문\n실제 자료를 붙여 넣습니다.\n\n원문과 에이전트의 해석을 분리하세요.\n',
 'practice/README.md':`# 내 도메인\n\n주제: ${p.title}\n\n범위: ${p.scope}\n\n제외: ${p.excluded}\n\n리비전: ${p.revision}\n\n원자료 ${m.notes.length}개, 대상 ${m.nodes.length}개, 관계 ${m.edges.length}개. 원자료 10개는 수업 권장량입니다. 빈 양식은 완성 지식이 아니므로 작성·검토한 뒤 에이전트에 사용하세요.\n`,
 'practice/questions.json':j(p.questions.map((question,i)=>({id:`Q${i+1}`,question}))),
 'practice/model.json':j(m),
 'practice/agent-prompt.md':personalPrompt(p,w)+'\n',
 'practice/response-template.json':j({domain:'personal',projectTitle:p.title,phase:w===1?'before':'after',model:'',runAt:'',responses:p.questions.map((question,i)=>({id:`Q${i+1}`,question,answer:'',evidence:[],limitations:''}))}),
 'practice/evaluation.json':j({questions:p.questions,records:p.records,summary:scoreReport(p.records)}),
 'practice/reflection.md':`# 이번 주 실제 작업 기록\n\n${p.reflection[w-1]||'문제 → 바꾼 구조 → 실제 결과 → 실패·보류 → 다음 변경을 기록하세요.'}\n`,
 'practice/OPERATIONS.md':`# 운영 규칙\n\n${p.operations||'새 자료의 출처·날짜를 확인할 사람:\n원본과 정리 노트를 구분하는 위치:\n관계 변경을 검토할 사람:\n자료·스키마 버전 기록 방법:\n추가·수정·폐기 시 재실행할 질문:\n보관 또는 휴지통으로 이동할 기준:'}\n`
 };
 for(const n of m.notes){
  const meta=`---\ndescription: "Learner-provided source for a personal knowledge project."\nakmLayer: source\nakmType: source\ntrustLevel: raw\nsourcePath: ${JSON.stringify(n.source||'출처 미입력')}\ndate created: ${JSON.stringify(n.date||'2026-09-12')}\ndate modified: ${JSON.stringify(n.date||'2026-09-12')}\n---\n\n`;
  f[`00-inbox/${n.id}.md`]=meta+`# ${n.id} · ${n.title}\n\n${n.body}\n`;
  if(w>=2)f[`10-sources/${n.id}.md`]=f[`00-inbox/${n.id}.md`];
  f[`wiki-drafts/${n.id}.md`]=`# ${n.title}\n\n## 정리할 내용\n내가 이해한 핵심을 직접 적거나 에이전트의 정리 결과를 검토하세요. 이 파일은 빈 초안입니다.\n\n## 출처\n[[10-sources/${n.id}]]\n\n## 연결\n${n.links.map(id=>`- [[20-knowledge/${id}]]`).join('\n')}\n\n## 검토할 관계\n${m.edges.filter(e=>m.nodes.find(x=>x.id===e.from)?.noteId===n.id).map(e=>`- ${e.from} — ${e.rel} → ${e.to} (근거: ${e.source})`).join('\n')}\n`;
 }
 f['wiki-drafts/README.md']='# Wiki 초안 적용\n\n이 폴더는 완성 지식이 아닙니다. 각 초안에 핵심·출처·관계를 작성하고 검토한 뒤 AKM의 20-knowledge에 승격하세요. Obsidian에서 같은 AKM 폴더를 열어 그래프를 확인합니다. 99-system/INDEX.local.md에는 검토한 노트의 링크를 추가하세요. 이미 완성한 노트에 빈 초안을 덮어쓰지 마세요.\n';
 if(w>=2){f['practice/schema.json']=j({classes:m.classes,relations:m.relations});f['practice/check.py']=validationScript;f['practice/schema-decisions.md']=`# 관계 설계 기록\n\n해결할 질문:\n대상 종류와 구분 기준:\n관계 이름과 시작→끝 종류:\n근거 문서와 문장:\n추가한 속성과 단위:\n잘못 연결한 반례와 검사 결과:\n변경 이유와 검토자:\n`;
  if(!validate(m).length&&m.nodes.length)f['practice/ontology.ttl']=toTTL(m);
 }
 if(w===4)f['practice/final-presentation.md']='# 최종 발표 순서\n\n1. 내 주제와 처음의 질문 3개\n2. Wiki 구조와 온톨로지 관계망\n3. 실제 에이전트의 답변과 출처\n4. 적용 전후 평가와 남은 한계\n5. 새 자료를 넣고 계속 운영할 규칙\n\n점수의 상승을 미리 가정하지 않습니다. 빈 평가를 실행 결과로 제출하지 않습니다.\n';
 return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.trimEnd()+'\n']));
}

// Standard ZIP, stored entries. Small text projects need no compression dependency.
export function zipFiles(files){
 const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;
 const crc=bytes=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
 for(const [path,text] of Object.entries(files)){
  if(path.startsWith('/')||path.split('/').includes('..'))throw Error('ZIP 경로를 확인하세요.');
  const name=enc.encode(path),data=enc.encode(text),sum=crc(data),local=new Uint8Array(30+name.length+data.length),v=new DataView(local.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,23852,true);v.setUint32(14,sum,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);local.set(name,30);local.set(data,30+name.length);locals.push(local);
  const center=new Uint8Array(46+name.length),c=new DataView(center.buffer);c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,23852,true);c.setUint32(16,sum,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);center.set(name,46);centrals.push(center);offset+=local.length;
 }
 const centralSize=centrals.reduce((n,x)=>n+x.length,0),end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,centrals.length,true);e.setUint16(10,centrals.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);
 const out=new Uint8Array(offset+centralSize+22);let pos=0;for(const bytes of [...locals,...centrals,end]){out.set(bytes,pos);pos+=bytes.length;}return out;
}
