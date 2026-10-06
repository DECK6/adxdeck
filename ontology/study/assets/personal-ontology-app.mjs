import {TYPES,RELATIONS,STATUS,TASK_STATUS,sample,validate,query,toMarkdown,promptFor,parseImport,eligible} from './personal-ontology-core.mjs';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='gpters24-personal-ontology-v2',BACKUP=KEY+'-backup';
function blank(){return {version:1,title:'나를 둘러싼 세계',question:'지금 내가 맡은 작업에 필요한 사람과 지식은?',nodes:[{id:'self',label:'나',type:'person',note:'내 소개를 익명 표기로 적으세요.'}],relations:[],actualAnswer:'',reflection:''};}
let mine=blank(),mode='demo',stage=1,selected='self',kind='work',timer,storageProblem='',graphPage=0;
try{const saved=localStorage.getItem(KEY);if(saved)mine=parseImport(saved);}catch{storageProblem='저장된 작업을 읽지 못했습니다. 기존 저장본은 덮어쓰지 않았습니다. JSON 가져오기를 이용하세요.';}
const active=()=>mode==='mine'?mine:sample(stage);
const day=()=>$('#query-date').value;
function notice(message){$('#notice').textContent=message;$('#notice').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#notice').classList.remove('show'),6500);}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(mine));$('#save-state').textContent='이 브라우저에 저장됨';storageProblem='';}catch{$('#save-state').textContent='브라우저 저장 불가 · JSON으로 내려받으세요';}updateExport();}
function backup(){try{localStorage.setItem(BACKUP,JSON.stringify(mine));return true;}catch{notice('이전 작업을 브라우저에 보관하지 못해 전환을 멈췄습니다. 먼저 JSON을 내려받으세요.');return false;}}
function replaceMine(next){if(!backup())return;mine=next;mode='mine';selected='self';persist();renderAll();resetNode();resetEdge();notice('이전 작업은 보관했습니다. 「이전 작업 복원」으로 되돌릴 수 있습니다.');}
function commit(next){const errors=validate(next);if(errors.length){notice(errors.slice(0,3).join('\n'));return false;}mine=next;persist();mode='mine';renderAll();return true;}
function opt(value,label,checked=''){return `<option value="${esc(value)}" ${value===checked?'selected':''}>${esc(label)}</option>`;}
function renderGraph(){
 const all=active(),map=new Map(all.nodes.map(n=>[n.id,n]));if(!map.has(selected))selected='self';
 const neighborIds=new Set([selected]);for(const e of all.relations)if(e.from===selected||e.to===selected){neighborIds.add(e.from);neighborIds.add(e.to);}
 const neighbors=[...neighborIds].filter(id=>id!==selected),pageCount=Math.max(1,Math.ceil(neighbors.length/12));
 graphPage=Math.min(graphPage,pageCount-1);
 const visibleIds=new Set([selected,...neighbors.slice(graphPage*12,(graphPage+1)*12)]);
 const d=all.nodes.length>14?{...all,nodes:all.nodes.filter(n=>visibleIds.has(n.id)),relations:all.relations.filter(e=>visibleIds.has(e.from)&&visibleIds.has(e.to))}:all;
 $('#graph-paging').hidden=all.nodes.length<=14||pageCount===1;
 $('#graph-page-info').textContent=`직접 연결 ${neighbors.length}개 · ${graphPage+1} / ${pageCount}쪽`;
 $('#graph-prev').disabled=graphPage===0;$('#graph-next').disabled=graphPage===pageCount-1;
 $('#focus-node').innerHTML=all.nodes.map(n=>opt(n.id,`${TYPES[n.type].label} · ${n.label}`,selected)).join('');
 document.querySelectorAll('[data-focus]').forEach(b=>{b.hidden=!map.has(b.dataset.focus);b.setAttribute('aria-pressed',b.dataset.focus===selected?'true':'false');});
 const points=new Map();points.set(selected,[480,325]);
 const others=d.nodes.filter(n=>n.id!==selected);
 others.forEach((n,i)=>{const angle=-Math.PI/2+2*Math.PI*i/Math.max(others.length,1);points.set(n.id,[480+370*Math.cos(angle),325+255*Math.sin(angle)]);});
 const height=650;
 const lines=d.relations.map(e=>{
 const [x1,y1]=points.get(e.from),[x2,y2]=points.get(e.to),dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
 const off=Math.min(85,len*.26),endx=x2-dx/len*off,endy=y2-dy/len*off,startx=x1+dx/len*off,starty=y1+dy/len*off;
 const hot=e.from===selected||e.to===selected,valid=eligible(e,day());
 return `<g opacity="${hot?1:.22}"><line x1="${startx}" y1="${starty}" x2="${endx}" y2="${endy}" stroke="${valid?'#7b9475':'#aa907a'}" stroke-width="${hot?1.8:1.2}" ${valid?'':'stroke-dasharray="5 4"'} marker-end="url(#arrow)"><title>${esc(RELATIONS[e.predicate].label)} · ${esc(e.source||'근거 미입력')}</title></line>${hot?`<text class="edge-label" x="${(x1+x2)/2}" y="${(y1+y2)/2-5}" text-anchor="middle">${esc(RELATIONS[e.predicate].label)}</text>`:''}</g>`;
 }).join('');
 const nodes=d.nodes.map(n=>{
 const [x,y]=points.get(n.id),t=TYPES[n.type],sel=n.id===selected,label=n.label.length>14?n.label.slice(0,13)+'…':n.label;
 return `<g class="graph-node" data-node="${esc(n.id)}" role="button" tabindex="0" aria-label="${esc(n.label)} 관계 보기" transform="translate(${x},${y})"><title>${esc(n.label)} · ${esc(t.label)}</title><rect x="-82" y="-30" width="164" height="60" rx="8" fill="${sel?'#285e47':'#fffefa'}" stroke="${sel?'#285e47':t.color}" stroke-width="${sel?2:1.2}"/><circle cx="-64" cy="-11" r="3" fill="${sel?'#d6e7bb':t.color}"/><text x="-53" y="-7" font-size="9" fill="${sel?'#d6e7bb':t.color}">${esc(t.label)}</text><text x="0" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="${sel?'#fff':'#243b32'}">${esc(label)}</text></g>`;
 }).join('');
 $('#graph').innerHTML=`<svg viewBox="0 0 960 ${height}" role="group" aria-label="${mode==='mine'?'내':'육대근의'} 온톨로지 관계 지도"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#7b9475"/></marker></defs>${lines}${nodes}</svg>`;
 $('#map-count').textContent=`전체 ${all.nodes.length}개 중 ${d.nodes.length}개 대상 · 연결 ${d.relations.length}개`;
 $('#map-caption').textContent=mode==='mine'?'내 작업 · 대상을 눌러 관계를 따라가세요.':['나와 직업, 프로젝트, 지금 맡은 작업부터 시작합니다.','실제 대화 상대와 역할, 작업에 필요한 개념·자료를 더합니다.','작품과 프로젝트를 개념으로 연결합니다. 선택한 대상의 이웃을 따라가세요.','커리어 DB와 후속 프로젝트를 함께 탐색합니다. 아래 목록에서 분야·이름으로 찾아보세요.'][stage-1];
 $('#active-model').textContent=mode==='mine'?'현재 조회: 내 작업':`현재 조회: 육대근 사례 ${stage}단계`;
 document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',mode==='demo'&&Number(b.dataset.stage)===stage?'true':'false'));
 const n=map.get(selected),rels=all.relations.filter(e=>e.from===selected||e.to===selected);
 $('#inspector').innerHTML=`<span class="badge">${esc(TYPES[n.type].label)}</span><h3>${esc(n.label)}</h3><p>${esc(n.note)}</p><p>${esc([n.group,n.period,n.evidence,n.sourceCodes?.join(', ')].filter(Boolean).join(' · '))}</p>${n.status?`<p>상태 · ${esc(n.status)}</p>`:''}<ul>${rels.map(e=>`<li><b>${esc(map.get(e.from).label)} → ${esc(RELATIONS[e.predicate].label)} → ${esc(map.get(e.to).label)}</b>${e.scope?`<br>범위: ${esc(map.get(e.scope).label)}`:''}<small>${esc(STATUS[e.status])}${e.validFrom||e.validTo?` · ${esc(e.validFrom||'시작 미지정')} ~ ${esc(e.validTo||'종료 미지정')}`:''}<br>${esc(e.source||'근거가 아직 없습니다.')}</small></li>`).join('')||'<li>아직 연결된 관계가 없습니다.</li>'}</ul>`;
 const present=new Set(d.nodes.map(n=>n.type));$('#legend').innerHTML=Object.entries(TYPES).filter(([k])=>present.has(k)).map(([,t])=>`<span><i class="dot" style="background:${t.color}"></i>${t.label}</span>`).join('');
}
function renderQuery(){
 const d=active(),prev=$('#query-task').value,tasks=d.nodes.filter(n=>n.type==='task');
 $('#query-task').innerHTML=tasks.map(n=>opt(n.id,n.label,prev)).join('')||opt('','작업을 먼저 추가하세요');
 const oldTopic=$('#query-topic').value;
 const topics=d.nodes.filter(n=>n.type==='concept');
 $('#query-topic').innerHTML=opt('','전체 주제',oldTopic)+topics.map(n=>opt(n.id,n.label,oldTopic)).join('');
 $('#query-topic-label').hidden=kind!=='career';
 const q=query(d,kind,kind==='career'?$('#query-topic').value:$('#query-task').value,day());
 document.querySelectorAll('[data-query]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.query===kind?'true':'false'));
 $('#query-result').innerHTML=`<p class="result-summary">${esc(q.summary)}</p>${q.items.map(item=>`<article class="result-card"><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p>${item.paths.map(p=>`<div class="result-path">${esc(p.text)}<small>근거 · ${esc(p.source)}</small></div>`).join('')}</article>`).join('')}<p class="hint">${kind==='reuse'&&mode==='demo'&&stage<3?'3단계 예제로 확장하면 같은 개념을 활용한 과거 작업을 찾을 수 있습니다. ':''}확인 상태·근거·유효기간 기준으로 제외된 관계 ${q.excluded}개. 기록이 없다는 이유만으로 관계가 없다고 단정하지 않습니다.</p>`;
}
function renderCatalog(){
 const d=active(),group=$('#catalog-group').value,needle=$('#catalog-search').value.trim().toLowerCase();
 $('#career-browser').hidden=!d.nodes.some(n=>n.sourceCodes?.length);
 const groups=[...new Set(d.nodes.map(n=>n.group).filter(Boolean))];
 $('#catalog-group').innerHTML=opt('','모든 활동',group)+groups.map(g=>opt(g,g,group)).join('');
 const all=d.nodes.filter(n=>['project','artwork','experience'].includes(n.type));
 const filtered=all.filter(n=>(!$('#catalog-group').value||n.group===$('#catalog-group').value)&&[n.label,n.note,n.period,...(n.topics||[])].join(' ').toLowerCase().includes(needle));
 $('#catalog-count').textContent=`${all.length}개 활동 중 ${filtered.length}개 · 같은 활동의 여러 기록은 하나로 연결했습니다.`;
 $('#career-list').innerHTML=filtered.map(n=>`<button class="career-card" data-catalog-node="${esc(n.id)}"><small>${esc(TYPES[n.type].label)}${n.group?` · ${esc(n.group)}`:""} · ${esc(n.period||'일자 미기록')}</small><b>${esc(n.label)}</b><span>${esc(n.note)}</span><small>${esc(n.sourceCodes?.join(', ')||'작업 기록')} · 관계 보기 ↗</small></button>`).join('')||'<p class="empty">조건에 맞는 기록이 없습니다.</p>';
}
function schema(){
 $('#schema').innerHTML=`<div class="schema-types">${Object.values(TYPES).map(t=>`<div><b>${t.label}</b><p>${t.definition}</p></div>`).join('')}</div><div class="table-wrap"><table><thead><tr><th>관계</th><th>방향</th><th>의미와 범위</th></tr></thead><tbody>${Object.values(RELATIONS).map(r=>`<tr><td>${r.label}</td><td>${TYPES[r.from].label} → ${TYPES[r.to].label}</td><td>${r.definition}</td></tr>`).join('')}</tbody></table></div>`;
 $('#node-type').innerHTML=Object.entries(TYPES).map(([k,v])=>opt(k,v.label)).join('');
 $('#node-status').innerHTML=TASK_STATUS.map(s=>opt(s,s)).join('');
 $('#edge-predicate').innerHTML=Object.entries(RELATIONS).map(([k,v])=>opt(k,v.label)).join('');
 $('#edge-status').innerHTML=Object.entries(STATUS).map(([k,v])=>opt(k,v)).join('');
}
function edgeOptions(){
 const pred=$('#edge-predicate').value,r=RELATIONS[pred],from=$('#edge-from').value,to=$('#edge-to').value,scope=$('#edge-scope').value;
 $('#edge-from').innerHTML=mine.nodes.filter(n=>n.type===r.from).map(n=>opt(n.id,n.label,from)).join('')||opt('','대상 추가 필요');
 $('#edge-to').innerHTML=mine.nodes.filter(n=>n.type===r.to&&n.id!==$('#edge-from').value).map(n=>opt(n.id,n.label,to)).join('')||opt('','대상 추가 필요');
 $('#edge-scope').innerHTML=opt('','범위 없음',scope)+mine.nodes.filter(n=>['project','artwork','experience'].includes(n.type)).map(n=>opt(n.id,n.label,scope)).join('');
 $('#relation-help').textContent=`${TYPES[r.from].label} → ${TYPES[r.to].label} · ${r.definition}`;
 $('#edge-scope').required=r.scope;
}
function renderEditor(){
 $('#world-title').value=mine.title;$('#world-question').value=mine.question;
 $('#actual-answer').value=mine.actualAnswer||'';$('#reflection').value=mine.reflection||'';
 $('#node-list').innerHTML=mine.nodes.map(n=>`<button type="button" class="item-row" data-edit-node="${esc(n.id)}"><span>${esc(n.label)}<small>${TYPES[n.type].label}${n.status?' · '+esc(n.status):''}</small></span><span class="edit-mark">수정 ↗</span></button>`).join('');
 const label=id=>mine.nodes.find(n=>n.id===id)?.label||id;
 $('#edge-list').innerHTML=mine.relations.map(e=>`<button type="button" class="item-row" data-edit-edge="${esc(e.id)}"><span>${esc(label(e.from))} → ${RELATIONS[e.predicate].label} → ${esc(label(e.to))}<small>${STATUS[e.status]} · ${e.source.trim()?'근거 있음':'근거 필요'}</small></span><span class="edit-mark">수정 ↗</span></button>`).join('')||'<p class="empty">대상을 저장한 뒤 첫 관계를 연결하세요.</p>';
 edgeOptions();
 const errors=validate(mine),unconfirmed=mine.relations.filter(e=>!eligible(e,day())).length;
 $('#validation').classList.toggle('bad',!!errors.length);$('#validation').textContent=errors.length?errors.join(' / '):`구조 검사 통과 · 대상 ${mine.nodes.length}개, 관계 ${mine.relations.length}개. ${unconfirmed?`근거·확인 상태·기간을 검토할 관계 ${unconfirmed}개.`:'관계를 질문에 활용해 보세요.'} 이 검사는 원문 사실의 진위를 판정하지 않습니다.`;
 $('#workspace-status').textContent=storageProblem||'예제 단계 전환은 내 작업에 영향을 주지 않습니다. 복사·새로 시작·가져오기 전 작업은 한 단계 보관합니다.';
}
function updateExport(){$('#export-name').textContent=`내 작업 · ${mine.title}`;$('#prompt-preview').textContent=promptFor(mine,day());}
function renderAll(){renderGraph();renderCatalog();renderQuery();renderEditor();updateExport();}
function resetNode(){const f=$('#node-form');f.reset();f.elements.id.value='';$('#node-type').disabled=false;$('#node-status').disabled=true;}
function resetEdge(){const f=$('#edge-form');f.reset();f.elements.id.value='';edgeOptions();}
function editNode(id){const n=mine.nodes.find(x=>x.id===id);if(!n)return;const f=$('#node-form');for(const key of ['id','label','type','note'])f.elements[key].value=n[key]||'';f.elements.status.value=n.status||'예정';$('#node-type').disabled=id==='self';$('#node-status').disabled=n.type!=='task';f.elements.label.focus();}
function editEdge(id){const e=mine.relations.find(x=>x.id===id);if(!e)return;const f=$('#edge-form');f.elements.predicate.value=e.predicate;edgeOptions();for(const key of ['id','from','to','scope','status','source','validFrom','validTo'])f.elements[key].value=e[key]||'';f.elements.source.focus();}
function download(name,text,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice(`${name} 다운로드를 시작했습니다.`);}
function newId(prefix,rows){let id;do{id=prefix+'-'+Math.random().toString(36).slice(2,10);}while(rows.some(x=>x.id===id));return id;}
$('#graph').addEventListener('click',event=>{const n=event.target.closest('[data-node]');if(n){selected=n.dataset.node;graphPage=0;renderGraph();}});
$('#graph').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){const n=event.target.closest('[data-node]');if(n){event.preventDefault();selected=n.dataset.node;graphPage=0;renderGraph();}}});
document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{mode='demo';stage=Number(b.dataset.stage);selected='self';graphPage=0;renderGraph();renderCatalog();renderQuery();}));
document.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.focus;graphPage=0;renderGraph();}));
document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.query;renderQuery();}));
$('#query-task').addEventListener('change',renderQuery);
$('#query-topic').addEventListener('change',renderQuery);
$('#focus-node').addEventListener('change',e=>{selected=e.target.value;graphPage=0;renderGraph();});
$('#graph-prev').addEventListener('click',()=>{graphPage--;renderGraph();});
$('#graph-next').addEventListener('click',()=>{graphPage++;renderGraph();});
$('#catalog-group').addEventListener('change',renderCatalog);
$('#catalog-search').addEventListener('input',renderCatalog);
$('#career-list').addEventListener('click',e=>{const b=e.target.closest('[data-catalog-node]');if(b){selected=b.dataset.catalogNode;graphPage=0;renderGraph();$('#focus-node').scrollIntoView({behavior:'smooth'});}});
$('#query-date').addEventListener('change',()=>{renderGraph();renderQuery();renderEditor();updateExport();});
$('#use-mine').addEventListener('click',()=>{mode='mine';selected='self';graphPage=0;renderGraph();renderCatalog();renderQuery();$('#lab').scrollIntoView({behavior:'smooth'});});
$('#copy-demo').addEventListener('click',()=>replaceMine(sample(stage)));
$('#start-blank').addEventListener('click',()=>replaceMine(blank()));
$('#restore-backup').addEventListener('click',()=>{try{const raw=localStorage.getItem(BACKUP);if(!raw){notice('보관된 이전 작업이 없습니다.');return;}const next=parseImport(raw);replaceMine(next);}catch(e){notice(e.message);}});
$('#import-file').addEventListener('change',async event=>{const f=event.target.files[0];if(!f)return;try{if(f.size>1000000)throw new Error('파일 크기는 1MB까지입니다.');const next=parseImport(await f.text());replaceMine(next);}catch(e){notice(e.message);}finally{event.target.value='';}});
$('#new-node').addEventListener('click',resetNode);$('#new-edge').addEventListener('click',resetEdge);
$('#node-type').addEventListener('change',()=>{$('#node-status').disabled=$('#node-type').value!=='task';});
$('#edge-predicate').addEventListener('change',edgeOptions);$('#edge-from').addEventListener('change',edgeOptions);
$('#node-list').addEventListener('click',e=>{const b=e.target.closest('[data-edit-node]');if(b)editNode(b.dataset.editNode);});
$('#edge-list').addEventListener('click',e=>{const b=e.target.closest('[data-edit-edge]');if(b)editEdge(b.dataset.editEdge);});
$('#node-form').addEventListener('submit',event=>{event.preventDefault();const f=event.currentTarget,id=f.elements.id.value||newId('n',mine.nodes),type=f.elements.type.value;const n={...(mine.nodes.find(x=>x.id===id)||{}),id,label:f.elements.label.value.trim(),type,note:f.elements.note.value.trim(),...(type==='task'?{status:f.elements.status.value}:{})};const next=structuredClone(mine),i=next.nodes.findIndex(x=>x.id===id);if(i<0)next.nodes.push(n);else next.nodes[i]=n;if(commit(next)){resetNode();notice('대상을 저장했습니다.');}});
$('#edge-form').addEventListener('submit',event=>{event.preventDefault();const f=event.currentTarget,e={};for(const key of ['id','from','predicate','to','scope','status','source','validFrom','validTo'])e[key]=f.elements[key].value.trim();e.id ||=newId('r',mine.relations);const next=structuredClone(mine),i=next.relations.findIndex(x=>x.id===e.id);if(i<0)next.relations.push(e);else next.relations[i]=e;if(commit(next)){resetEdge();notice('관계를 저장했습니다.');}});
for(const [id,key] of [['world-title','title'],['world-question','question'],['actual-answer','actualAnswer'],['reflection','reflection']])$('#'+id).addEventListener('input',event=>{mine[key]=event.target.value;persist();});
$('#download-md').addEventListener('click',()=>download('my-ontology.md',toMarkdown(mine,day()),'text/markdown;charset=utf-8'));
$('#download-json').addEventListener('click',()=>download('my-ontology.json',JSON.stringify(mine,null,2),'application/json'));
$('#download-prompt').addEventListener('click',()=>download('ontology-agent-prompt.txt',promptFor(mine,day()),'text/plain;charset=utf-8'));
$('#copy-prompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(promptFor(mine,day()));notice('내 온톨로지와 질문이 포함된 프롬프트를 복사했습니다.');}catch{const p=$('#prompt-preview');p.closest('details').open=true;const range=document.createRange();range.selectNodeContents(p);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);notice('자동 복사를 사용할 수 없어 내용을 선택했습니다. 직접 복사하거나 TXT를 내려받으세요.');}});
schema();renderAll();resetNode();resetEdge();$('#save-state').textContent=storageProblem?'저장본 확인 필요':'개인 작업 준비됨 · 입력하면 자동 저장';

$('#copy-interview').addEventListener('click',async()=>{const el=$('#interview-prompt');try{await navigator.clipboard.writeText(el.textContent);notice('인터뷰 시작 요청문을 복사했습니다.');}catch{const range=document.createRange();range.selectNodeContents(el);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);notice('요청문을 선택했습니다. 직접 복사해 주세요.');}});
