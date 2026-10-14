import {snapshots} from './week3-history-data.mjs';
import {topics,stats,comparison,answerQuestion,validateClaim} from './week3-history-core.mjs';

const $=id=>document.getElementById(id);
let revision='initial',topic='taejo',selected='A06',question='capital';
const originalIds=new Set(snapshots.initial.concepts.map(c=>c.id));
const sourceTitles={S002:'태조의 수창궁 즉위 기사',S003:'국호를 조선으로 정하는 자문',S004:'한양으로 서울을 옮기다',S005:'태조실록 왕대별 해제',S006:'한국민족문화대백과 · 고려 태조',S007:'우리역사넷 · 조선의 건국과 시전 상인',S008:'궁능유적본부 · 경복궁 소개·역사'};
const d=()=>snapshots[revision];
const readingPath=(folder,path)=>`${folder}/${path}`.replace('downloads/week3/','week3-readings/').replace(/\.md$/,'.html');
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function link(text,href,cls){const a=el('a',text,cls);a.href=href;a.target='_blank';a.rel='noreferrer';return a;}
function svg(tag,attrs={}){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;}
function label(id){return d().concepts.find(c=>c.id===id)?.label||id;}
function sourceLinks(ids){const box=el('div');for(const id of ids){const source=d().sources.find(s=>s.id===id);if(source?.url)box.append(link(`${id} · ${sourceTitles[id]}`,source.url,'source-chip'));}return box;}

function positions(kind){
  if(kind==='facts')return {
    taejo:{C01:[125,90],C02:[125,320],C03:[455,70],C04:[455,340],C05:[455,205]},
    capital:{C10:[125,70],C18:[125,205],C19:[125,340],C07:[455,100],C17:[455,295]},
    record:{C11:[125,205],C08:[455,95],C16:[455,315]}
  }[topic];
  return {
    taejo:{'T-person':[125,205],'T-polity':[455,95],'T-label':[455,315]},
    capital:{'T-event':[125,205],'T-place':[455,205]},
    record:{'T-document':[125,205],'T-event':[455,95],'T-date':[455,315]}
  }[topic];
}

function graph(container,view,kind){
  const s=svg('svg',{viewBox:'0 0 600 420',role:'group','aria-label':kind==='facts'?'역사 사실의 개체와 관계':'타입과 관계 정의'});
  const defs=svg('defs');const marker=svg('marker',{id:`arrow-${kind}`,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'});
  marker.append(svg('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'#7b9472'}));defs.append(marker);s.append(defs);
  const pos=positions(kind),selectedClaim=d().claims.find(a=>a.id===selected);
  for(const edge of view.edges){
    const [x1,y1]=pos[edge.from],[x2,y2]=pos[edge.to];
    const active=kind==='facts'?edge.id===selected:edge.id===selectedClaim?.predicate;
    const path=svg('path',{d:`M ${x1+94} ${y1} C ${x1+155} ${y1}, ${x2-155} ${y2}, ${x2-96} ${y2}`,class:`graph-edge${active?' active':''}`,'marker-end':`url(#arrow-${kind})`});s.append(path);
    const t=svg('text',{x:(x1+x2)/2,y:(y1+y2)/2-9,'text-anchor':'middle',class:'edge-label'});t.textContent=edge.label;s.append(t);
  }
  for(const node of view.nodes){
    const [x,y]=pos[node.id];
    const active=kind==='facts'?[selectedClaim?.subject,selectedClaim?.object].includes(node.id):view.edges.some(e=>e.id===selectedClaim?.predicate&&[e.from,e.to].includes(node.id));
    const added=kind==='facts'&&!originalIds.has(node.id);
    const g=svg('g',{class:`graph-node${active?' active':''}${added?' added':''}`,transform:`translate(${x},${y})`,tabindex:0,role:'button','aria-label':`${node.label}의 연결 보기`});
    g.append(svg('rect',{x:-94,y:-33,width:188,height:66}));
    const meta=svg('text',{x:0,y:-9,'text-anchor':'middle',class:'node-meta'});meta.textContent=kind==='facts'?`${node.id} · ${d().types.find(t=>t.id===node.type_ids[0]).label}`:`${node.id} · 타입`;g.append(meta);
    const text=svg('text',{x:0,y:14,'text-anchor':'middle'});text.textContent=node.label;g.append(text);
    const choose=()=>{const edge=view.edges.find(e=>[e.from,e.to].includes(node.id));if(edge){selected=kind==='facts'?edge.id:d().claims.find(a=>topics[topic].claims.includes(a.id)&&a.predicate===edge.id).id;renderComparison();}};
    g.addEventListener('click',choose);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});s.append(g);
  }
  container.replaceChildren(s);
}

function renderComparison(){
  const model=d(),view=comparison(model,topic);
  if(!view.facts.edges.some(e=>e.id===selected))selected=topics[topic].initial;
  graph($('fact-graph'),view.facts,'facts');graph($('schema-graph'),view.schema,'schema');
  $('claim-picker').replaceChildren();
  for(const edge of view.facts.edges){const button=el('button',`${edge.id} · ${label(edge.subject)} → ${edge.label} → ${label(edge.object)}`);button.setAttribute('aria-pressed',String(edge.id===selected));button.addEventListener('click',()=>{selected=edge.id;renderComparison();});$('claim-picker').append(button);}
  const a=model.claims.find(c=>c.id===selected),r=model.relations.find(r=>r.id===a.predicate);
  const fact=el('div');fact.append(el('span','선택한 사실 · '+a.id,'inspector-label'),el('h3',`${label(a.subject)} → ${r.label} → ${label(a.object)}`),el('p',a.conditions));fact.append(sourceLinks(a.evidence.map(e=>e.source_id)));
  for(const e of a.evidence)fact.append(el('p',`${e.source_id} 읽은 위치 · ${e.locator}`,'hint'));
  const meaning=el('div');meaning.append(el('span','이 연결을 읽는 약속 · '+r.id,'inspector-label'),el('h3',`${r.domain_types.map(id=>model.types.find(t=>t.id===id).label).join(', ')} → ${r.range_types.map(id=>model.types.find(t=>t.id===id).label).join(', ')}`),el('p',r.definition));
  const lesson={taejo:'같은 호칭을 공유한다는 사실은 동일 인물이라는 근거가 아닙니다. 호칭에서 인물로 돌아가면 여러 후보가 나올 수 있습니다.',capital:'이동 사건에 대한 관계입니다. “이후 영원히 수도다”라는 상태를 자동 생성하지 않습니다. 확장 전후를 바꾸어 환도 사건을 확인해 보세요.',record:'문헌이 기록한 사건의 시점과 문헌을 편찬한 시점을 서로 다른 관계로 읽습니다. 기록의 존재가 모든 해석의 참을 뜻하지는 않습니다.'};meaning.append(el('p',lesson[topic]));$('meaning-inspector').replaceChildren(fact,meaning);
  document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));
}

function renderCheck(){
  const value=$('check-example').value,a=d().claims.find(x=>x.id==='A10');
  const box=$('check-result');
  if(value==='scope'){box.replaceChildren(el('p','타입이 맞아도, 이 추론은 별도 검토가 필요합니다.','check-result-title'),el('p','A10의 조건은 1394년 천도 사건에 한정됩니다. 타입 검사만으로 영구 지속 여부를 판정할 수 없습니다. 확장 자료의 1399년 환도는 “계속 수도”라는 가정의 반례입니다.','check-result-body'));return;}
  const result=validateClaim(d(),value==='type'?{...a,subject:'C01'}:a);
  box.replaceChildren(el('p',result.valid?'관계에 지정된 타입과 맞습니다.':'관계의 주어 타입이 맞지 않습니다.','check-result-title'),el('p',value==='type'?'R03의 주어는 이동 사건입니다. 이성계는 인물이므로 C01을 주어로 넣으면 현재 정의와 맞지 않습니다. 누가 이동했는지는 별도 관계로 모델링해야 합니다.':result.reason,'check-result-body'));
}

function renderWiki(){
  const model=d(),s=stats(model),metrics=$('metrics');metrics.replaceChildren();
  for(const [key,title]of [['notes','위키 노트'],['concepts','개념·개체'],['claims','근거가 연결된 주장'],['sources','읽은 역사 출처'],['answered','답변한 질문']]){const card=el('div',undefined,'metric');card.append(el('b',String(s[key])),el('span',title));if(key==='answered')card.append(el('small','현재 질문 6개 · 보류 2개 별도'));metrics.append(card);}
  const g=svg('svg',{viewBox:'0 0 600 450',role:'group','aria-label':'위키 노트의 읽기 링크'}),pos={N1:[300,65],N2:[125,210],N3:[475,210],N4:[145,375],N5:[455,375]},short={N1:'사건 구별',N2:'두 태조',N3:'실록 읽기',N4:'수도 이동',N5:'궁궐과 천도'},pairs=new Set();
  for(const n of model.notes)for(const to of n.links){const id=[n.id,to].sort().join('-');if(pairs.has(id))continue;pairs.add(id);const [x1,y1]=pos[n.id],[x2,y2]=pos[to];g.append(svg('line',{x1,y1,x2,y2,class:'wiki-edge'}));}
  for(const n of model.notes){const [x,y]=pos[n.id],a=svg('a',{href:readingPath(model.folder,n.path),target:'_blank','aria-label':`${n.id} ${n.title} 원문 읽기`}),group=svg('g',{class:`graph-node${['N4','N5'].includes(n.id)?' added':''}`,transform:`translate(${x},${y})`});group.append(svg('rect',{x:-78,y:-30,width:156,height:60}));const meta=svg('text',{x:0,y:-7,'text-anchor':'middle',class:'node-meta'});meta.textContent=n.id;const title=svg('text',{x:0,y:15,'text-anchor':'middle'});title.textContent=short[n.id];group.append(meta,title);a.append(group);g.append(a);}
  $('wiki-graph').replaceChildren(g);
  $('note-list').replaceChildren();
  for(const n of model.notes){const item=el('article',undefined,`note-item${['N4','N5'].includes(n.id)?' new':''}`),text=el('div');item.append(el('span',n.id));const h=el('h3');h.append(link(n.title,readingPath(model.folder,n.path)));text.append(h,el('p',`${n.question_ids.join(' · ')} / ${n.claim_ids.length}개 주장 연결${['N4','N5'].includes(n.id)?' · 확장에서 새로 작성':''}`));item.append(text);$('note-list').append(item);}
}

function renderAnswer(){
  const model=d(),answer=answerQuestion(model,question),box=$('query-result');
  box.replaceChildren(el('span',{supported:'근거로 답할 수 있음',ambiguous:'맥락 확인 필요',unknown:'현재 근거로는 미확인'}[answer.status],'answer-state'),el('p',answer.answer,'answer-text'),el('p',answer.next,'answer-detail'));
  const p=el('p',`조회한 주장: ${answer.claimIds.join(', ')||'없음'} · ${revision==='initial'?'초기':'확장'} 리비전 ${model.revision}`,'answer-detail');box.append(p,sourceLinks(answer.sourceIds));
  const paths=el('details');paths.append(el('summary','조회에 사용한 관계와 조건 펼치기'));
  for(const aid of answer.claimIds){const a=model.claims.find(c=>c.id===aid),r=model.relations.find(r=>r.id===a.predicate);paths.append(el('p',`${aid} · ${label(a.subject)} → ${r.label} → ${label(a.object)} / ${a.conditions}`,'claim-path'));}
  box.append(paths);document.querySelectorAll('[data-question]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.question===question)));
}

function render(){
  document.querySelectorAll('[data-revision]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.revision===revision)));
  document.querySelectorAll('.revision-label').forEach(n=>n.textContent=`${revision==='initial'?'초기':'자동 확장'} 리비전 ${d().revision} · 이 페이지의 그래프·위키·조회에 함께 적용`);
  renderComparison();renderWiki();renderAnswer();renderCheck();
  $('app-status').textContent='원본 한국사 모델을 불러왔습니다. 초기·확장 전환은 페이지 전체에 함께 적용됩니다.';
}

async function copy(id,button){
  const text=$(id).textContent;
  try{await navigator.clipboard.writeText(text);$('copy-status').textContent='요청문을 복사했습니다. 본인의 에이전트에서 실행하세요.';button.textContent='복사됨 ✓';setTimeout(()=>button.textContent='요청문 복사',1600);}
  catch{const range=document.createRange();range.selectNodeContents($(id));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('copy-status').textContent='자동 복사를 사용할 수 없어 요청문을 선택했습니다. 복사 단축키를 사용하세요.';}
}

try{
  document.querySelectorAll('[data-revision]').forEach(b=>b.addEventListener('click',()=>{revision=b.dataset.revision;render();}));
  document.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>{topic=b.dataset.topic;selected=topics[topic].initial;renderComparison();}));
  document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>{question=b.dataset.question;renderAnswer();}));
  $('check-example').addEventListener('change',renderCheck);
  const prompts=['prompt-connect','prompt-query','prompt-grow','prompt-start'];
  const originals=Object.fromEntries(prompts.map(id=>[id,$(id).textContent]));
  $('platform').addEventListener('change',()=>{for(const id of prompts)$(id).textContent=originals[id].replace(/^\$akm/,$('platform').value);});
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy,b)));
  for(const source of snapshots.expanded.sources.filter(s=>s.url))$('source-list').append(link(`${source.id} · ${sourceTitles[source.id]}`,source.url));
  render();
}catch(error){console.error(error);$('app-status').textContent='그래프를 불러오지 못했습니다. 본문과 한국사 사례 ZIP에서 같은 자료를 확인할 수 있습니다.';}
