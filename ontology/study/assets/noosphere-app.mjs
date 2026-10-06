import {noosphere as data} from './noosphere-data.mjs';
import {TYPES,DOMAINS,RELATIONS,validate,connections,findPaths} from './noosphere-core.mjs';
const $=id=>document.getElementById(id);
const nodeMap=new Map(data.nodes.map(n=>[n.id,n]));
let selected='work-chaos',page=0,activeQuestion=data.questions[0];
const el=(tag,text,className)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(className)x.className=className;return x;};
const includeProposed=()=>$('include-proposed').checked;
const nodeButton=(id,className)=>{const n=nodeMap.get(id),b=el('button',n.label,className);b.type='button';b.addEventListener('click',()=>selectNode(id));return b;};
function badge(text,className=''){return el('span',text,'badge '+className);}
function selectNode(id){if(!nodeMap.has(id))return;selected=id;page=0;renderCatalog();renderDetail();}
function renderCatalog(){
 const search=$('node-search').value.trim().toLocaleLowerCase(),type=$('type-filter').value;
 const found=data.nodes.filter(n=>(!type||n.type===type)&&[n.label,n.note,n.author??'',n.id].join(' ').toLocaleLowerCase().includes(search));
 $('catalog-count').textContent=`${found.length}개 대상 / 전체 ${data.nodes.length}개`;
 const list=$('node-list');list.replaceChildren();
 if(!found.length){list.append(el('p','일치하는 대상이 없습니다. 검색어나 종류를 바꿔보세요.','empty'));return;}
 for(const n of found){const b=nodeButton(n.id,'node-button');b.setAttribute('aria-pressed',String(n.id===selected));b.append(el('small',TYPES[n.type]+(n.domain==='fiction'?' · 서사 설정':'')));list.append(b);}
}
function renderDetail(){
 const n=nodeMap.get(selected),detail=$('node-detail');detail.replaceChildren();
 const meta=el('div',undefined,'meta');meta.append(badge(TYPES[n.type]),badge(DOMAINS[n.domain],n.domain==='fiction'?'fiction':''));if(n.status)meta.append(badge(n.status));
 detail.append(meta,el('h3',n.label),el('p',n.note,'detail-note'));
 if(n.author)detail.append(el('p',n.author,'caption'));
 if(n.readingScope)detail.append(el('p',n.readingScope,'caption'));
 const source=data.sources.find(s=>s.id===n.source);detail.append(el('p',`근거: ${n.source} · ${source.title} · ${n.section}`,'caption'));
 if(n.url){const a=el('a',n.urlScope);a.href=n.url;a.target='_blank';a.rel='noopener noreferrer';a.className='caption';detail.append(a);}
 const all=connections(data,selected,{includeProposed:includeProposed()}),pages=Math.max(1,Math.ceil(all.length/12));page=Math.max(0,Math.min(page,pages-1));
 const shown=all.slice(page*12,page*12+12);renderGraph(n,shown);
 $('graph-count').textContent=all.length?`연결 ${all.length}개 · ${page+1}/${pages}쪽 · 화살표는 실제 관계 방향입니다.`:'이 설정에서 확인할 연결이 없습니다. 해석 제안도 살펴볼 수 있습니다.';
 $('graph-prev').disabled=page===0;$('graph-next').disabled=page>=pages-1;
 $('relations').replaceChildren();
 for(const e of shown){
  const card=el('article',undefined,'relation-card'),route=el('div',undefined,'relation-route');
  route.append(nodeButton(e.from),el('span',`→ ${RELATIONS[e.predicate].label} →`),nodeButton(e.to));
  card.append(route,el('p',e.meaning),badge(e.status==='proposed'?'해석 제안':'정본에 기록',e.status==='proposed'?'proposed':''),el('p',e.evidence.map(x=>`${x.source} ${x.section}`).join(' · '),'caption'));
  $('relations').append(card);
 }
}
const svgEl=(tag,attrs={},text)=>{const x=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))x.setAttribute(k,String(v));if(text!==undefined)x.textContent=text;return x;};
function svgNode(n,x,y,active=false){
 const g=svgEl('g',{class:'graph-node'+(active?' selected':''),transform:`translate(${x} ${y})`});
 g.append(svgEl('rect',{width:220,height:58,rx:5}),svgEl('text',{x:110,y:25,'text-anchor':'middle'},n.label.length>18?n.label.slice(0,17)+'…':n.label),svgEl('text',{x:110,y:43,'text-anchor':'middle',class:'node-kind'},TYPES[n.type]));
 if(!active){g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label+' 연결 보기');g.addEventListener('click',()=>selectNode(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(n.id);}});}
 return g;
}
function renderGraph(center,edges){
 const svg=$('graph');svg.replaceChildren();svg.setAttribute('aria-label',center.label+'의 관계 지도');
 const defs=svgEl('defs'),marker=svgEl('marker',{id:'arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'});marker.append(svgEl('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'#849479'}));defs.append(marker);svg.append(defs);
 const dots=[];
 edges.forEach((e,i)=>{
  const left=i%2===0,row=Math.floor(i/2),id=e.from===center.id?e.to:e.from,x=left?18:662,y=22+row*87;
  const a=left?[340,270]:[560,270],b=left?[238,y+29]:[662,y+29],from=e.from===center.id?a:b,to=e.from===center.id?b:a;
  const curve=svgEl('path',{d:`M ${from[0]} ${from[1]} C 450 ${from[1]},450 ${to[1]},${to[0]} ${to[1]}`,class:'graph-edge'+(e.status==='proposed'?' proposed':''),'marker-end':'url(#arrow)'});
  curve.append(svgEl('title',{},`${nodeMap.get(e.from).label} → ${RELATIONS[e.predicate].label} → ${nodeMap.get(e.to).label}`));svg.append(curve);dots.push(svgNode(nodeMap.get(id),x,y));
 });
 svg.append(...dots,svgNode(center,340,241,true));
}
function renderPath(path){
 const group=el('div',undefined,'path-group'),line=el('div',undefined,'path-line');
 path.nodes.forEach((id,i)=>{
  if(i){const e=path.relations[i-1],forward=e.from===path.nodes[i-1];line.append(el('span',`${forward?'→':'←'} ${RELATIONS[e.predicate].label}`,'path-arrow'));}
  line.append(nodeButton(id));
 });
 group.append(line,el('p',path.relations.map(e=>`${nodeMap.get(e.from).label} → ${nodeMap.get(e.to).label}: ${e.evidence.map(x=>x.source+' '+x.section).join(', ')}${e.status==='proposed'?' [해석 제안]':''}`).join(' / '),'path-evidence'));
 return group;
}
function queryPaths(){
 const from=$('path-from').value,to=$('path-to').value,result=$('path-result');result.replaceChildren();
 const paths=findPaths(data,from,to,{includeProposed:includeProposed()});
 if(activeQuestion&&activeQuestion.from===from&&activeQuestion.to===to){
  const exact=paths.find(p=>p.nodes.join('|')===activeQuestion.route.join('|'));
  result.append(el('p',activeQuestion.answer));if(exact)result.append(renderPath(exact));
  else result.append(el('p','기록된 경로를 확인할 수 없습니다. 대상이나 해석 제안 표시를 확인해주세요.','empty'));
 }else if(paths.length){result.append(el('p',`현재 근거에서 ${paths.length}개 경로를 찾았습니다. 경로의 각 관계를 확인해 읽어주세요.`));paths.slice(0,4).forEach(p=>result.append(renderPath(p)));if(paths.length>4)result.append(el('p','가까운 경로 4개를 표시합니다.','caption'));}
 else result.append(el('p','현재 기록에서 이 두 대상을 연결할 근거 경로를 찾지 못했습니다. 관계가 없다는 뜻은 아닙니다. 추가 원문이나 해석 제안을 확인해 보세요.','empty'));
 document.querySelectorAll('.preset').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.question===activeQuestion?.id)));
}
function init(){
 const errors=validate(data);if(errors.length)throw Error(errors.join(' / '));
 for(const [count,label] of [[data.nodes.filter(n=>n.type==='theory').length,'참고 이론'],[data.nodes.filter(n=>n.type==='work').length,'작품·기획'],[data.nodes.length,'전체 대상'],[data.relations.length,'근거를 붙인 관계']]){const d=el('div',undefined,'stat');d.append(el('strong',String(count)),el('span',label));$('stats').append(d);}
 for(const [id,label] of Object.entries(TYPES)){const option=el('option',label);option.value=id;$('type-filter').append(option);}
 for(const n of data.nodes){const a=el('option',`${n.label} · ${TYPES[n.type]}`);a.value=n.id;$('path-from').append(a);$('path-to').append(a.cloneNode(true));}
 $('path-from').value=activeQuestion.from;$('path-to').value=activeQuestion.to;
 data.questions.forEach((q,i)=>{const b=el('button',undefined,'preset');b.dataset.question=q.id;b.append(el('span',`QUESTION 0${i+1}`),document.createTextNode(q.label));b.addEventListener('click',()=>{activeQuestion=q;$('path-from').value=q.from;$('path-to').value=q.to;queryPaths();selectNode(q.from);});$('question-presets').append(b);});
 for(const id of ['node-search','type-filter'])$(id).addEventListener(id==='node-search'?'input':'change',renderCatalog);
 for(const id of ['path-from','path-to'])$(id).addEventListener('change',()=>{activeQuestion=null;});
 $('find-path').addEventListener('click',queryPaths);
 $('include-proposed').addEventListener('change',()=>{page=0;renderDetail();queryPaths();});
 $('graph-prev').addEventListener('click',()=>{page--;renderDetail();});$('graph-next').addEventListener('click',()=>{page++;renderDetail();});
 document.querySelectorAll('[data-node]').forEach(b=>b.addEventListener('click',()=>{selectNode(b.dataset.node);$('explore').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 for(const s of data.sources){const details=el('details');details.append(el('summary',`${s.id} · ${s.title} · ${s.version}`),el('p',s.scope));$('source-list').append(details);}
 data.openQuestions.forEach(q=>$('open-questions').append(el('li',q)));
 renderCatalog();renderDetail();queryPaths();
}
try{init();}catch(error){$('app-status').textContent='관계 지도를 불러오지 못했습니다. 새로고침하거나 아래의 Markdown 자료를 내려받아 주세요.';console.error(error);}
