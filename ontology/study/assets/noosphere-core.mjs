export const TYPES={world:'세계관',theory:'참고 이론',publication:'참고 문헌',concept:'개념',dynamic:'4역학',condition:'조건',series:'작품 시리즈',work:'작품·기획',law:'서사 법칙',character:'서사 인물',artist:'참조 아티스트',referenceWork:'참조 작품'};
export const DOMAINS={worldview:'작가의 세계관',reference:'이론·예술 참조',fiction:'서사 설정'};
export const RELATIONS={
 contains:{label:'포함한다',from:['world','work'],to:['dynamic','series','work','law','character']},
 references:{label:'참조한다',from:['world'],to:['theory','artist','referenceWork']},
 bibliography:{label:'참고 문헌',from:['theory'],to:['publication']},
 usesConcept:{label:'참고한 개념',from:['theory'],to:['concept']},
 groundedIn:{label:'개념적 근거',from:['dynamic','concept','condition'],to:['concept']},
 explores:{label:'다룬다',from:['work','series'],to:['concept','dynamic']},
 belongsTo:{label:'시리즈에 대응',from:['work'],to:['series']},
 leadsTo:{label:'이어진다',from:['dynamic','concept','condition'],to:['dynamic','concept','condition']},
 dependsOn:{label:'조건을 확인한다',from:['dynamic','concept','work'],to:['condition']},
 takesRole:{label:'역할을 갖는다',from:['concept'],to:['concept']},
 sharesDataWith:{label:'같은 데이터를 쓴다',from:['work'],to:['work']},
 suggests:{label:'해석을 제안한다',from:['work'],to:['concept','condition','dynamic']},
 echoes:{label:'설정으로 대응',from:['law'],to:['concept','dynamic','condition']},
 storyRelation:{label:'서사 속 관계',from:['character'],to:['character']},
 storyBridge:{label:'서사 확장 계획',from:['work'],to:['work']},
 referenceFor:{label:'참조한 접점',from:['artist','referenceWork'],to:['concept','dynamic']}
};
const statuses=new Set(['documented','proposed']);
const traversable=new Set(['explores','groundedIn','usesConcept','suggests','bibliography','referenceFor']);
export function validate(d){
 const errors=[];
 if(d?.version!==1||d?.id!=='noosphere-layer'||!Array.isArray(d.nodes)||!Array.isArray(d.relations)||!Array.isArray(d.sources))return ['누스피어 데이터 형식을 확인하세요.'];
 const ids=new Map(),sources=new Set(d.sources.map(s=>s.id)),edgeIds=new Set();
 for(const n of d.nodes){
  if(!n||typeof n.id!=='string'||ids.has(n.id)||!TYPES[n.type]){errors.push('대상 ID·종류 오류');continue;}
  ids.set(n.id,n);
  if(!n.label||!n.note||!DOMAINS[n.domain]||!sources.has(n.source)||!n.section)errors.push(`${n.id}: 설명·범위·근거 누락`);
  if(n.url&&!/^https:\/\//.test(n.url))errors.push(`${n.id}: 출처 URL 오류`);
  if(['law','character'].includes(n.type)&&n.domain!=='fiction')errors.push(`${n.id}: 서사 설정 표기 누락`);
 }
 for(const e of d.relations){
  const rule=RELATIONS[e.predicate],from=ids.get(e.from),to=ids.get(e.to);
  if(!e.id||edgeIds.has(e.id))errors.push('관계 ID 오류');edgeIds.add(e.id);
  if(!from||!to||!rule||!rule.from.includes(from.type)||!rule.to.includes(to.type))errors.push(`${e.id}: 관계의 대상 종류·방향 오류`);
  if(!e.meaning||!statuses.has(e.status))errors.push(`${e.id}: 관계 의미·확인 상태 오류`);
  if(e.predicate==='suggests'&&e.status!=='proposed')errors.push(`${e.id}: 제안의 확정 금지`);
  if(!Array.isArray(e.evidence)||!e.evidence.length||e.evidence.some(x=>!sources.has(x.source)||!x.section))errors.push(`${e.id}: 근거 누락`);
 }
 for(const q of d.questions??[]){
  if(!q.route?.length||q.route[0]!==q.from||q.route.at(-1)!==q.to||q.route.some(id=>!ids.has(id)))errors.push(`${q.id}: 질문 경로 오류`);
  for(let i=1;i<(q.route?.length??0);i++)if(!d.relations.some(e=>e.status==='documented'&&traversable.has(e.predicate)&&((e.from===q.route[i-1]&&e.to===q.route[i])||(e.to===q.route[i-1]&&e.from===q.route[i]))))errors.push(`${q.id}: 근거 없는 경로`);
 }
 return errors;
}
export function connections(d,id,{includeProposed=false}={}){return d.relations.filter(e=>(e.from===id||e.to===id)&&(includeProposed||e.status==='documented'));}
// Undirected traversal is navigation only: every returned edge retains its actual direction and meaning.
// Structural membership/reference hubs never create a theoretical-influence shortcut.
export function findPaths(d,from,to,{includeProposed=false,maxDepth=4,maxResults=8}={}){
 if(!d.nodes.some(n=>n.id===from)||!d.nodes.some(n=>n.id===to)||from===to)return [];
 const adj=new Map(),found=[],queue=[{nodes:[from],relations:[]}];
 for(const e of d.relations){
  if(!traversable.has(e.predicate)||(!includeProposed&&e.status!=='documented'))continue;
  for(const [a,b] of [[e.from,e.to],[e.to,e.from]]){if(!adj.has(a))adj.set(a,[]);adj.get(a).push([b,e]);}
 }
 for(let head=0;head<queue.length&&found.length<Math.min(maxResults,24)&&head<10000;head++){
  const path=queue[head];if(path.relations.length>=Math.min(maxDepth,6))continue;
  for(const [id,e] of adj.get(path.nodes.at(-1))??[]){
   if(path.nodes.includes(id))continue;
   const next={nodes:[...path.nodes,id],relations:[...path.relations,e]};
   if(id===to)found.push(next);else queue.push(next);
   if(found.length>=Math.min(maxResults,24))break;
  }
 }
 return found;
}
const cell=s=>String(s??'').replaceAll('|','／').replaceAll('\n',' ');
const scope=n=>DOMAINS[n.domain];
export function toMarkdown(d){
 const nodes=new Map(d.nodes.map(n=>[n.id,n]));
 const out=[`# ${d.title}`,`작성: ${d.owner} · 개정: ${d.updated}`,d.scope,
 '## 읽는 기준','정본에 기록된 연결은 작가 문서의 내용입니다. 이론의 원문 대조나 작품 효과 검증을 대신하지 않습니다. 해석 제안은 별도로 표시하며 서사 설정은 현실의 법칙과 구별합니다.',
 '## 네 역학과 회복','감응 → 융해 → 결정 → 발산 → 잔향 → 회복의 조건 → 다음 감응. 회복은 다섯 번째 역학이 아닙니다.',
 '## 질문으로 따라가기',...d.questions.map(q=>`### ${q.label}\n\n${q.route.map(id=>nodes.get(id).label).join(' → ')}\n\n${q.answer}`),
 '## 대상과 개념',['| ID | 이름 | 종류 | 범위·상태 | 설명 | 근거 |','|---|---|---|---|---|---|',
 ...d.nodes.map(n=>`| ${n.id} | ${cell(n.label)} | ${TYPES[n.type]} | ${scope(n)}${n.status?' · '+cell(n.status):''} | ${cell(n.note)} | ${n.source} ${cell(n.section)} |`)].join('\n'),
 '## 뜻이 있는 관계',['| 시작 | 관계 | 도착 | 확인 상태 | 의미 | 근거 |','|---|---|---|---|---|---|',
 ...d.relations.map(e=>`| ${cell(nodes.get(e.from)?.label)} | ${RELATIONS[e.predicate].label} | ${cell(nodes.get(e.to)?.label)} | ${e.status==='documented'?'정본에 기록':'해석 제안'} | ${cell(e.meaning)} | ${e.evidence.map(s=>s.source+' '+cell(s.section)).join('; ')} |`)].join('\n'),
 '## 다음 확인',...d.openQuestions.map(q=>'- '+q),'## 근거 문서',...d.sources.map(s=>`- ${s.id} · ${s.title} · ${s.version}: ${s.scope}`)];
 return out.join('\n\n')+'\n';
}
export function sourceRegister(d){
 return ['# 누스피어 근거와 원문 대조 범위','## 작가 문서',...d.sources.map(s=>`### ${s.id} ${s.title}\n\n${s.version}\n\n${s.scope}`),
 '## 이론 문헌','개념과 작품의 대응은 작가 문서에서 가져왔습니다. 아래 링크는 출판사 또는 저자 자료로 확인한 저작 식별·보충 자료이며, 모든 대응의 원전 검증을 뜻하지 않습니다. 원문의 쪽수·정확한 인용은 추가 대조 대상입니다.',
 ...d.nodes.filter(n=>n.type==='publication').map(n=>`- ${n.author} · ${n.label}${n.url?` — [${n.urlScope}](${n.url})`:' — 정본 서지 목록, 원문 대조 필요'}`),
 '## 표현의 경계','근거가 확인되지 않은 직접 인용, 누스피어 개념의 최초 제안자·연도 단정, 기획의 완성·상영 주장, 사적 인물·기관·의료 기록은 이 공개 예제에 포함하지 않았습니다. 후기 개념을 앞선 저작에 귀속하거나 창작 법칙을 실제 물리 법칙으로 설명하지 않습니다.'].join('\n\n')+'\n';
}
