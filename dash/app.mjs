import {unlockDashboard,escapeHtml as e,safeUrl,itemBucket,isUrgent,deadlineText,renderMarkdown,kstDate} from './core.mjs';
import {deriveSigningKey,stateRequest,applyState,isArchived,applicationLabel,resultLabels,toggleComparison,comparisonTable,visibleSelection} from './state.mjs';

const $=id=>document.getElementById(id);
const labels={review:'검토 가능',submitted:'지원 완료',hold:'보류',waiting:'대기',excluded:'제외',closed:'마감',information:'참고'};
const filters=[['review','검토 가능'],['awaiting','발표 대기'],['submitted','지원 완료'],['hold','보류'],['waiting','모집 대기'],['excluded','제외'],['all','전체']];
// Non-radar tabs render into their own panels; radar tabs share #radar-panel.
const panels={overview:'overview-panel',applications:'applications-panel',revenue:'revenue-panel',nara:'nara-panel'};
let payload=null,activeId=null,envelope=null,epoch=0,authKey=null,apiUrl=null,records=[],ready=false;
let filter='review',search='',selectedId=null,compareIds=[],mode='detail',visibleItems=[];
const hiddenSources=new Set();
const tabStates=new Map(),saving=new Set();
const dateTime=at=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(at))+' KST';
const dayText=date=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',weekday:'short'}).format(new Date(date+'T12:00:00+09:00'));
const kstOf=at=>new Date(new Date(at).getTime()+9*3600000).toISOString().slice(0,10);
const deadlineDate=item=>item.deadlineAt?kstOf(item.deadlineAt):item.deadlineDate||null;
const daysUntil=(date,now)=>Math.round((Date.parse(date)-Date.parse(kstDate(now)))/86400000);
const ddayText=days=>days===0?'D-day':days>0?`D-${days}`:`D+${-days}`;
const choices=()=>{
 if(!payload)return [];
 const list=[{id:'overview',title:'종합'},...payload.radars,{id:'applications',title:'지원'}];
 if(payload.revenue)list.push({id:'revenue',title:'수익 설계'});
 if(payload.nara)list.push({id:'nara',title:'나라장터 파인더'});
 return list;
};
const isRadar=id=>Boolean(payload?.radars.some(r=>r.id===id));
const radars=()=>payload?payload.radars.map(r=>applyState(r,records)):[];
const radar=()=>{const base=payload?.radars.find(r=>r.id===activeId);return base?applyState(base,records):null;};
const workingItems=now=>radars().flatMap(r=>r.items.filter(i=>!isArchived(i,now)).map(i=>({...i,radarId:r.id,radarTitle:r.title})));
function naraEntries(){
 if(!payload?.nara)return [];
 const seen=new Map();
 for(const i of [...payload.nara.items,...payload.nara.recommendations.flatMap(b=>b.items)]){const key=i.bidNtceNo||i.id;if(key&&!seen.has(key))seen.set(key,i);}
 return [...seen.values()];
}
function message(text,error=false){$('sync-message').textContent=text;$('sync-message').classList.toggle('error',error);$('retry-sync').hidden=!error||ready;}

$('unlock-form').addEventListener('submit',async event=>{
 event.preventDefault();const attempt=++epoch,password=$('password').value;$('password').value='';$('unlock').disabled=true;
 $('gate-message').classList.remove('error');$('gate-message').textContent='대시보드를 여는 중입니다…';let fetching=false;
 try{
  if(!envelope){fetching=true;const response=await fetch('./data.enc.json',{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('fetch');envelope=await response.json();fetching=false;}
  const decoded=await unlockDashboard(envelope,password);
  if(attempt!==epoch){decoded.keyBytes.fill(0);return;}
  authKey=await deriveSigningKey(decoded.keyBytes);decoded.keyBytes.fill(0);if(attempt!==epoch){authKey.fill(0);authKey=null;return;}payload=decoded.payload;
  const requested=location.hash.slice(1);activeId=choices().some(r=>r.id===requested)?requested:'overview';
  $('gate').hidden=true;$('workspace').hidden=false;renderTabs();renderRadar();$('tabs').querySelector('[aria-selected=true]').focus();
  await loadState(attempt);
 }catch{
  if(!payload){authKey?.fill(0);authKey=null;$('gate-message').classList.add('error');$('gate-message').textContent=fetching?'데이터를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.':'비밀번호가 맞지 않거나 데이터를 열 수 없습니다. 다시 입력해 주세요.';$('password').focus();}
 }finally{$('unlock').disabled=false;}
});
async function loadState(attempt=epoch){
 ready=false;message('지원 기록 확인 중…');
 try{
  if(!apiUrl){const response=await fetch('./config.json',{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('config');apiUrl=(await response.json()).stateApiUrl;}
  const data=await stateRequest(apiUrl,authKey);if(!payload||attempt!==epoch)return;
  if(!Array.isArray(data.records))throw Error('records');records=data.records;ready=true;renderTabs();renderRadar();message('지원 기록 동기화됨 · 체크하면 지원 완료·발표 대기로 저장됩니다.');
 }catch{if(payload&&attempt===epoch){ready=false;renderCards();message('지원 기록을 확인하지 못했습니다. 지금은 조회만 가능합니다. 다시 확인해 주세요.',true);}}
}
function lock(){
 $('nara-host').replaceChildren();
 epoch++;authKey?.fill(0);authKey=null;payload=null;activeId=null;envelope=null;apiUrl=null;records=[];ready=false;
 filter='review';search='';selectedId=null;compareIds=[];mode='detail';visibleItems=[];tabStates.clear();saving.clear();
 if($('detail').open)$('detail').close();$('browse').append($('inspector'));
 for(const id of ['tabs','cards','stats','urgent','limitations','radar-title','radar-summary','run-status','updated','occurrence','detail-content','dialog-label','filters','result-count','today','comparison-bar','inspector-tools','inspector-content','sync-message','overview-summary','overview-updated','overview-stats','timeline','overview-kpis','overview-actions','applications-stats','applications-groups','revenue-title','revenue-summary','revenue-updated','revenue-content'])$(id).replaceChildren();
 for(const panel of Object.values(panels))$(panel).hidden=true;$('radar-panel').hidden=false;
 $('inspector').hidden=true;$('search').value='';$('workspace').hidden=true;$('gate').hidden=false;$('password').value='';$('gate-message').classList.remove('error');$('gate-message').textContent='대시보드가 잠겼습니다.';$('password').focus();
}
$('lock').addEventListener('click',lock);window.addEventListener('pagehide',lock);
$('retry-sync').addEventListener('click',()=>loadState());
window.addEventListener('hashchange',()=>{if(payload&&choices().some(r=>r.id===location.hash.slice(1)))selectRadar(location.hash.slice(1));});
function renderTabs(){
 const now=new Date(),working=workingItems(now);
 const counts={overview:timelineEntries(now).filter(t=>t.kind!=='nara'&&t.days<=7).length,applications:working.filter(i=>i.applicationStatus==='submitted'&&i.resultStatus==='awaiting').length,revenue:payload.revenue?.items.length||0,nara:naraEntries().length};
 $('tabs').innerHTML=choices().map(t=>{const count=t.id in counts?counts[t.id]:working.filter(i=>i.radarId===t.id).length;return `<button id="tab-${e(t.id)}" role="tab" type="button" aria-controls="${t.id in panels?panels[t.id]:'radar-panel'}" aria-selected="${t.id===activeId}" tabindex="${t.id===activeId?0:-1}" data-radar="${e(t.id)}">${e(t.title)}<span class="tab-count">${count}</span></button>`;}).join('');
}
function selectRadar(id){
 if(activeId)tabStates.set(activeId,{filter,search,selectedId,compareIds:[...compareIds],mode});activeId=id;
 const saved=tabStates.get(id)||{filter:'review',search:'',selectedId:null,compareIds:[],mode:'detail'};({filter,search,selectedId,compareIds,mode}=saved);
 $('search').value=search;history.replaceState(null,'','#'+id);renderTabs();renderRadar();
}
// Overview, application and revenue rows jump to the source radar with the item selected.
function jumpTo(radarId,itemId){
 if(!isRadar(radarId)){if(choices().some(t=>t.id===radarId))selectRadar(radarId);return;}
 tabStates.set(radarId,{filter:'all',search:'',selectedId:itemId||null,compareIds:[],mode:'detail'});selectRadar(radarId);
 if(itemId)$('inspector').scrollIntoView({block:'nearest'});
}
$('tabs').addEventListener('click',event=>{const t=event.target.closest('[data-radar]');if(t)selectRadar(t.dataset.radar);});
$('tabs').addEventListener('keydown',event=>{
 const tabs=[...$('tabs').querySelectorAll('[role=tab]')];let idx=tabs.findIndex(t=>t.dataset.radar===activeId);
 if(event.key==='ArrowRight')idx=(idx+1)%tabs.length;else if(event.key==='ArrowLeft')idx=(idx+tabs.length-1)%tabs.length;else if(event.key==='Home')idx=0;else if(event.key==='End')idx=tabs.length-1;else return;
 event.preventDefault();selectRadar(tabs[idx].dataset.radar);$('tabs').querySelector('[aria-selected=true]').focus();
});
for(const id of ['timeline','applications-groups','revenue-content']){
 $(id).addEventListener('click',event=>{if(event.target.closest('a'))return;const t=event.target.closest('[data-jump]');if(t)jumpTo(t.dataset.jump,t.dataset.item);});
 $(id).addEventListener('keydown',event=>{if(event.key!=='Enter'||event.target.closest('button,a'))return;const t=event.target.closest('[data-jump]');if(t){event.preventDefault();jumpTo(t.dataset.jump,t.dataset.item);}});
}
function renderRadar(){
 const now=new Date();
 $('today').textContent=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(now);
 for(const [id,panel] of Object.entries(panels))$(panel).hidden=activeId!==id;$('radar-panel').hidden=!isRadar(activeId);
 if(activeId==='nara'){mountNara();return;}if(activeId==='overview'){renderOverview();return;}if(activeId==='applications'){renderApplications();return;}if(activeId==='revenue'){renderRevenue();return;}
 const r=radar();if(!r)return;$('radar-panel').setAttribute('aria-labelledby','tab-'+r.id);
 $('radar-title').textContent=r.title;$('radar-summary').textContent=r.summary;
 $('run-status').textContent=r.runStatus==='VERIFIED'?'검증 완료':r.runStatus==='HOLD'?'일부 확인 보류':r.runStatus;
 $('run-status').className='badge'+(r.runStatus==='VERIFIED'?'':' hold');$('updated').textContent=dateTime(r.updatedAt)+' 조사';$('updated').dateTime=r.updatedAt;
 const working=r.items.filter(i=>!isArchived(i,now));const counts={};for(const i of working){const b=itemBucket(i,now);counts[b]=(counts[b]||0)+1;}
 const awaiting=working.filter(i=>i.applicationStatus==='submitted'&&i.resultStatus==='awaiting').length;
 const stats=[['검토 가능',counts.review||0],['발표 대기',awaiting],['지원 완료',counts.submitted||0],['보류·모집 대기',(counts.hold||0)+(counts.waiting||0)]];
 $('stats').innerHTML=stats.map(([label,count])=>`<div class="stat"><span>${label}</span><strong>${count}</strong></div>`).join('');
 const limits=r.limitations||[];$('limitations').hidden=!limits.length;$('limitations').innerHTML=limits.length?`<details><summary>확인 범위와 남은 조건 ${limits.length}건</summary><ul>${limits.map(l=>`<li>${e(l)}</li>`).join('')}</ul></details>`:'';
 const urgent=working.filter(i=>isUrgent(i,now));$('urgent').hidden=!urgent.length;$('urgent').innerHTML=`<span class="urgent-label">● 7일 이내 ${urgent.length}건</span><div class="urgent-items">${urgent.map(i=>`<button data-item="${e(i.id)}">${e(i.title)}<small>${e(deadlineText(i))}</small></button>`).join('')}</div>`;
 $('filters').innerHTML=filters.map(([key,label])=>`<button type="button" data-filter="${key}" aria-pressed="${filter===key}">${label}</button>`).join('');
 $('archive-toggle').textContent=`보관함 · ${r.items.length-working.length}`;$('archive-toggle').setAttribute('aria-pressed',String(filter==='archive'));
 $('report-button').hidden=!r.reportMarkdown;$('occurrence').textContent=r.occurrenceId;renderCards();
}
function timelineEntries(now){
 const out=[];
 for(const i of workingItems(now)){
  if(i.applicationStatus==='submitted')continue;
  const date=deadlineDate(i);if(!date)continue;const days=daysUntil(date,now);if(days<0||days>60)continue;
  const b=itemBucket(i,now);if(b==='excluded')continue;
  out.push({kind:'radar',radarId:i.radarId,itemId:i.id,date,days,when:i.deadlineAt?deadlineText(i,now):dayText(date)+' · 시각 미확인',title:i.title,sub:i.organization||'',source:i.radarTitle,bucket:b,status:b==='review'?(i.status==='recommended'?'추천':'조건부 검토'):b==='hold'?'조건 확인 필요':labels[b],grade:i.grade,track:i.track});
 }
 for(const m of payload.revenue?.milestones||[]){const days=daysUntil(m.date,now);if(days<-1||days>60)continue;out.push({kind:'plan',radarId:'revenue',date:m.date,days,when:dayText(m.date),title:m.label,sub:m.note,source:'수익 계획',bucket:'plan',status:'결정 지점'});}
 for(const n of naraEntries()){
  if(!n.bidCloseAt||!Number.isFinite(Date.parse(n.bidCloseAt)))continue;
  const date=kstOf(n.bidCloseAt),days=daysUntil(date,now);if(days<0||days>14)continue;
  out.push({kind:'nara',radarId:'nara',date,days,when:dateTime(n.bidCloseAt),title:n.title,sub:[n.agency,n.budgetLabel].filter(Boolean).join(' · '),source:'나라장터',bucket:'information',status:n.drafts?.length?`초안 ${n.drafts.length}건`:'추천'});
 }
 return out.sort((a,b)=>a.date.localeCompare(b.date)||a.kind.localeCompare(b.kind));
}
const kpiCards=kpis=>kpis.map(k=>`<div class="kpi"><span>${e(k.label)}</span><strong>${e(k.base)}</strong><small>보수 ${e(k.conservative)} · 확장 ${e(k.stretch)}</small></div>`).join('');
const actionList=actions=>actions.map(a=>`<li>${a.label?`<strong>${e(a.label)}</strong> `:''}${e(a.text)}</li>`).join('');
function renderOverview(){
 const now=new Date(),rs=radars(),working=workingItems(now),p=payload.revenue;
 const review=working.filter(i=>itemBucket(i,now)==='review'),urgent=working.filter(i=>isUrgent(i,now)),awaiting=working.filter(i=>i.applicationStatus==='submitted'&&i.resultStatus==='awaiting'),preparing=working.filter(i=>i.applicationStatus==='preparing');
 const latest=rs.map(r=>r.updatedAt).sort().at(-1);
 $('overview-summary').textContent=[...rs.map(r=>`${r.title} ${r.items.filter(i=>!isArchived(i,now)).length}건`),...(payload.nara?[`나라장터 ${naraEntries().length}건`]:[]),...(p?[`수익 아이템 ${p.items.length}종`]:[])].join(' · ')+'을 한 화면에서 봅니다.';
 $('overview-updated').textContent=latest?dateTime(latest)+' 최근 조사':'';
 $('overview-stats').innerHTML=[['검토 가능',review.length],['7일 이내 마감',urgent.length],['발표 대기',awaiting.length],['준비 중',preparing.length]].map(([label,count])=>`<div class="stat"><span>${label}</span><strong>${count}</strong></div>`).join('');
 renderTimeline(now);
 $('overview-kpis').innerHTML=p?kpiCards(p.kpis):'<p class="block-note">수익 계획 데이터가 없습니다.</p>';
 $('overview-actions').innerHTML=p?actionList(p.actions):'';
}
function renderTimeline(now=new Date()){
 const all=timelineEntries(now),sources=[...new Set(all.map(t=>t.source))];
 $('timeline-sources').innerHTML=sources.map(src=>`<button type="button" data-source="${e(src)}" aria-pressed="${!hiddenSources.has(src)}">${e(src)} ${all.filter(t=>t.source===src).length}</button>`).join('');
 const entries=all.filter(t=>!hiddenSources.has(t.source));
 $('timeline').innerHTML=entries.length?entries.map(t=>`<li class="tl-row kind-${t.kind}${t.days<=7?' tl-soon':''}" data-jump="${e(t.radarId)}"${t.itemId?` data-item="${e(t.itemId)}"`:''} tabindex="0"><span class="tl-day">${ddayText(t.days)}</span><span class="tl-date">${e(t.when)}</span><span class="tl-body"><strong>${e(t.title)}</strong>${t.sub?`<small>${e(t.sub)}</small>`:''}</span><span class="tl-tags"><span class="tag">${e(t.source)}</span><span class="tag ${e(t.bucket)}">${e(t.status)}</span>${t.grade?`<span class="tag">${e(t.grade)}등급</span>`:''}${t.track?`<span class="tag">트랙 ${e(t.track)}</span>`:''}</span></li>`).join(''):'<li class="empty">선택한 출처에 60일 이내 마감이나 결정 지점이 없습니다.</li>';
}
$('timeline-sources').addEventListener('click',event=>{const b=event.target.closest('[data-source]');if(!b)return;const src=b.dataset.source;if(hiddenSources.has(src))hiddenSources.delete(src);else hiddenSources.add(src);renderTimeline();});
function renderApplications(){
 const now=new Date();
 const rows=radars().flatMap(r=>r.items.filter(i=>['submitted','preparing','on_hold','cancelled'].includes(i.applicationStatus)).map(i=>({...i,radarId:r.id,radarTitle:r.title})));
 const groups=[['발표·회신 대기',i=>i.applicationStatus==='submitted'&&i.resultStatus==='awaiting'],['결과 확정',i=>i.applicationStatus==='submitted'&&i.resultStatus!=='awaiting'],['준비 중',i=>i.applicationStatus==='preparing'],['보류·취소',i=>['on_hold','cancelled'].includes(i.applicationStatus)]]
  .map(([label,fn])=>({label,items:rows.filter(fn).sort((a,b)=>(deadlineDate(a)||'9999').localeCompare(deadlineDate(b)||'9999')||a.title.localeCompare(b.title))}));
 $('applications-stats').innerHTML=groups.map(g=>`<div class="stat"><span>${g.label}</span><strong>${g.items.length}</strong></div>`).join('');
 $('applications-groups').innerHTML=groups.filter(g=>g.items.length).map(g=>`<section class="app-group"><h3>${g.label}<span>${g.items.length}</span></h3><div class="table-scroll"><table class="app-table"><thead><tr><th>출처</th><th>기관 · 제목</th><th>지원 근거 · 상태</th><th>마감</th><th>상태 확인</th><th>다음 확인</th></tr></thead><tbody>${g.items.map(i=>`<tr data-jump="${e(i.radarId)}" data-item="${e(i.id)}" tabindex="0"><td><span class="tag">${e(i.radarTitle)}</span></td><td><strong>${e(i.title)}</strong>${i.organization?`<br><small>${e(i.organization)}</small>`:''}</td><td>${e(i.applicationStatusLabel||applicationLabel(i))}${['selected','not_selected','withdrawn'].includes(i.resultStatus)?` <span class="tag ${i.resultStatus==='selected'?'review':'hold'}">${e(resultLabels[i.resultStatus])}</span>`:''}</td><td>${e(deadlineText(i,now))}</td><td>${i.stateUpdatedAt?e(dateTime(i.stateUpdatedAt)):'—'}${i.stateSource==='dashboard-user'?'<br><small>마스터 직접 확인</small>':''}</td><td>${e(i.nextAction||'')}</td></tr>`).join('')}</tbody></table></div></section>`).join('')||'<p class="empty">지원·준비 중인 항목이 없습니다.</p>';
}
function renderRevenue(){
 const p=payload.revenue;if(!p)return;const now=new Date(),rs=radars();
 $('revenue-title').textContent=p.title;$('revenue-summary').textContent=`기준일 ${p.baseDate||'미표기'} · 세전 · 확인값과 가정값을 구분한 계획이며 정본은 AKM 수익 계획 노트입니다.`;
 $('revenue-updated').textContent=p.noteModified?'정본 수정 '+p.noteModified.replace('T',' ').slice(0,16):'';
 const live=id=>{
  if(id==='nara')return payload.nara?`나라장터 추천 ${naraEntries().length}건`:'';
  const r=rs.find(x=>x.id===id);if(!r)return '';const w=r.items.filter(i=>!isArchived(i,now)),n=f=>w.filter(f).length;
  return `${r.title} 현재: 검토 ${n(i=>itemBucket(i,now)==='review')} · 지원 ${n(i=>i.applicationStatus==='submitted')} · 발표 대기 ${n(i=>i.applicationStatus==='submitted'&&i.resultStatus==='awaiting')} · 준비 ${n(i=>i.applicationStatus==='preparing')}`;
 };
 const table=(cls,head,body,widths=[])=>`<div class="table-scroll"><table class="${cls}">${widths.length?`<colgroup>${widths.map(()=>'<col>').join('')}</colgroup>`:''}<thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
 const details=(title,inner)=>`<details class="revenue-details"><summary>${title}</summary>${inner}</details>`;
 const groups=[...new Map(p.items.map(i=>[i.category,i.categoryLabel])).entries()];
 const itemRows=groups.map(([cat,label])=>`<tr class="grp"><td colspan="7">${e(cat)} · ${e(label)}</td></tr>`+p.items.filter(i=>i.category===cat).map(i=>`<tr><td><strong>${e(i.code)}</strong> ${e(i.name)}${i.tag?`<span class="tag hold">${e(i.tag)}</span>`:''}</td><td>${e(i.status)}${i.radar?`<span class="live">${e(live(i.radar))}<button type="button" data-jump="${e(i.radar)}">탭 열기 ↗</button></span>`:''}</td><td class="n">${e(i.short)}</td><td class="n">${e(i.h1)}</td><td class="n">${e(i.h2)}</td><td class="n">${e(i.longTerm)}</td><td>${e(i.prep)}</td></tr>`).join('')).join('');
 const milestoneRows=p.milestones.map(m=>`<tr><td class="n"><strong>${e(ddayText(daysUntil(m.date,now)))}</strong> ${e(dayText(m.date))}</td><td>${e(m.label)}</td><td>${e(m.note)}</td></tr>`).join('');
 $('revenue-content').innerHTML=`<section class="revenue-block"><h3>결론 먼저</h3><ol class="conclusions">${p.conclusions.map(c=>`<li>${e(c)}</li>`).join('')}</ol></section>
<section class="revenue-block"><h3>기간별 기대수익</h3><div class="kpis">${p.kpis.map(k=>`<div class="kpi"><span>${e(k.label)}</span><strong>${e(k.base)}</strong><small>보수 ${e(k.conservative)} · 확장 ${e(k.stretch)}</small><small>${e(k.premise)}</small></div>`).join('')}</div></section>
<section class="revenue-block"><h3>수익 아이템 ${p.items.length}종 · 현재 상태와 기간별 기대</h3><p>단기 = ~12/31 입금 · H1 = 2027 상반기 · H2 = 2027 하반기 · 장기 = 2028~ 연 단위. 레이더와 연결된 아이템은 현재 조사 수치를 함께 표시합니다.</p>${table('plan-table plan-items',['아이템','현재 상태','단기','2027 H1','2027 H2','장기(연)','준비물'],itemRows,[1,2,3,4,5,6,7])}</section>
<section class="revenue-block"><h3>결정 지점</h3>${milestoneRows?table('plan-table plan-compact',['날짜','결정 지점','비고'],milestoneRows):'<p>등록된 결정 지점이 없습니다.</p>'}</section>
<section class="revenue-block"><h3>이번 주 행동</h3><ol class="actions">${actionList(p.actions)}</ol></section>
<section class="revenue-block"><h3>즉시 회수 (기발생 현금)</h3>${table('plan-table plan-compact',['항목','금액','상태','행동'],p.recoveries.map(r=>`<tr><td>${e(r.item)}</td><td class="n">${e(r.amount)}</td><td>${e(r.status)}</td><td>${e(r.action)}</td></tr>`).join(''))}</section>
<section class="revenue-block">${details(`상충·충돌 ${p.conflicts.length}건과 해소안`,table('plan-table plan-compact',['#','충돌','내용','해소안'],p.conflicts.map(c=>`<tr><td class="n">${c.n}</td><td><strong>${e(c.title)}</strong></td><td>${e(c.text)}</td><td>${e(c.resolution)}</td></tr>`).join('')))}${details(`준비물 총괄 ${p.preparations.length}건`,table('plan-table plan-compact',['분류','항목','상태'],p.preparations.map(r=>`<tr><td>${e(r.category)}</td><td>${e(r.item)}</td><td>${e(r.status)}</td></tr>`).join('')))}${details('확인된 단가 · 청중·자산',table('plan-table plan-compact',['항목','값','출처'],p.rates.map(r=>`<tr><td>${e(r.item)}</td><td>${e(r.value)}</td><td>${e(r.source)}</td></tr>`).join(''))+table('plan-table plan-compact',['채널','값'],p.audience.map(r=>`<tr><td>${e(r.channel)}</td><td>${e(r.value)}</td></tr>`).join('')))}${details('가정과 한계 · 정정 이력',`<ul>${[...p.assumptions,...p.corrections].map(c=>`<li>${e(c)}</li>`).join('')}</ul>`)}</section>`;
}
$('revenue-full').addEventListener('click',()=>{if(!payload?.revenue)return;$('dialog-label').textContent=payload.revenue.title+' / 전문';$('detail-content').innerHTML=renderMarkdown(payload.revenue.markdown);$('detail').showModal();});
function highlightList(i){return i.highlights?.length?`<dl class="highlights">${i.highlights.map(f=>`<div><dt>${e(f.label)}</dt><dd>${e(f.value)}</dd></div>`).join('')}</dl>`:'';}
function submittedControl(i){return `<label class="submission-check"><input type="checkbox" data-submit="${e(i.id)}" aria-label="${e(i.title)} 지원 완료" ${i.applicationStatus==='submitted'?'checked':''} ${!ready||saving.has(activeId+':'+i.id)?'disabled':''}><span>${saving.has(activeId+':'+i.id)?'저장 중…':'지원 완료'}</span></label>`;}
function renderCards(){
 const r=radar();if(!r)return;const now=new Date();$('browse').append($('inspector'));
 visibleItems=r.items.filter(i=>{
  if((filter==='archive')!==isArchived(i,now))return false;
  if(filter!=='archive'&&filter!=='all'&&(filter==='awaiting'?! (i.applicationStatus==='submitted'&&i.resultStatus==='awaiting'):itemBucket(i,now)!==filter))return false;
  return !search||[i.title,i.organization,i.summary,i.nextAction,...(i.fields||[]).map(f=>f.value)].join(' ').toLocaleLowerCase().includes(search);
 });
 visibleItems.sort((a,b)=>Number(isUrgent(b,now))-Number(isUrgent(a,now))||(a.deadlineAt||a.deadlineDate||'9999').localeCompare(b.deadlineAt||b.deadlineDate||'9999'));
 selectedId=visibleSelection(selectedId,visibleItems);
 $('result-count').textContent=`${filter==='archive'?'미지원 마감 보관함':filters.find(([k])=>k===filter)?.[1]} ${visibleItems.length}건`;
 $('empty').hidden=visibleItems.length>0;
 $('cards').innerHTML=visibleItems.map(i=>{
  const b=itemBucket(i,now),urgent=isUrgent(i,now),status=b==='review'?(i.status==='recommended'?'추천':'조건부 검토'):labels[b];
  return `<article class="card${selectedId===i.id?' selected-card':''}${urgent?' urgent-card':''}" data-row="${e(i.id)}"><div class="card-tags"><span class="tag ${b}">${e(status)}</span>${i.grade?`<span class="tag">${e(i.grade)}등급</span>`:''}${i.track?`<span class="tag">트랙 ${e(i.track)}</span>`:''}${urgent?'<span class="tag urgent-tag">7일 이내</span>':''}<label class="compare-check"><input type="checkbox" data-compare="${e(i.id)}" aria-label="${e(i.title)} 비교" ${compareIds.includes(i.id)?'checked':''}><span>비교</span></label></div>${i.organization?`<p class="card-organization">${e(i.organization)}</p>`:''}<h3><button class="card-title" data-item="${e(i.id)}" aria-label="${e(i.title)} 상세 보기" aria-controls="inspector" aria-expanded="${selectedId===i.id&&mode==='detail'}">${e(i.title)}</button></h3><p class="card-deadline"><span>마감</span><span>${e(deadlineText(i))}</span></p><p class="card-summary">${e(i.summary)}</p>${highlightList(i)}<div class="card-bottom">${submittedControl(i)}<span class="application">${e(applicationLabel(i))}</span></div></article>`;
 }).join('');renderComparisonBar();renderInspector();
}
function renderComparisonBar(){
 const r=radar();compareIds=compareIds.filter(id=>r.items.some(i=>i.id===id));
 $('comparison-bar').innerHTML=`<span>${compareIds.length?`비교할 항목 ${compareIds.length}/3`:'목록에서 비교할 항목을 최대 3개 선택하세요.'}</span><div class="comparison-chips">${compareIds.map(id=>{const i=r.items.find(x=>x.id===id);return `<button data-remove="${e(id)}" aria-label="${e(i.title)} 비교에서 제외">${e(i.organization||i.title)} ×</button>`;}).join('')}</div><button id="compare-now" class="button-primary" ${compareIds.length<2?'disabled':''}>나란히 비교</button>${mode==='compare'?'<button id="show-detail" class="button-quiet">상세 보기</button>':''}`;
 $('compare-now').addEventListener('click',()=>{mode='compare';renderComparisonBar();renderInspector();if(matchMedia('(max-width:900px)').matches)$('inspector').scrollIntoView({block:'start'});});
 $('show-detail')?.addEventListener('click',()=>{mode='detail';renderComparisonBar();renderInspector();});
}
function renderInspector(){
 const r=radar();if(!r)return;const i=r.items.find(x=>x.id===selectedId),compared=compareIds.map(id=>r.items.find(x=>x.id===id)).filter(Boolean);
 if(mode==='compare'&&compared.length<2)mode='detail';$('inspector').hidden=!i&&mode!=='compare';
 if(mode==='compare'){
  $('inspector-tools').innerHTML=`<strong>${compared.length}건 나란히 비교</strong><span>같은 기준으로 읽어 보세요.</span>`;$('inspector-content').innerHTML=comparisonTable(compared);
 }else if(i){
  const idx=visibleItems.findIndex(x=>x.id===i.id),href=safeUrl(i.officialUrl);
  $('inspector-tools').innerHTML=`<span>상세 · ${idx>=0?idx+1+'/'+visibleItems.length:'선택한 항목'}</span><div><button data-step="-1" ${idx<=0?'disabled':''} aria-label="이전 항목">← 이전</button><button data-step="1" ${idx<0||idx>=visibleItems.length-1?'disabled':''} aria-label="다음 항목">다음 →</button></div>`;
  $('inspector-content').innerHTML=`<div class="inspector-heading"><p class="eyebrow">${e(i.organization||r.title)}</p><h2>${e(i.title)}</h2></div><div class="application-control">${submittedControl(i)}<strong>${e(applicationLabel(i))}</strong>${i.stateSource==='dashboard-user'?'<small>마스터가 직접 확인한 지원 상태</small>':''}</div><p>${e(i.summary)}</p>${href?`<a class="official-link" href="${e(href)}" target="_blank" rel="noopener noreferrer">공식 공고 열기 ↗</a>`:''}<dl><dt>마감</dt><dd>${e(deadlineText(i))}${i.deadlineLabel?'<br>'+e(i.deadlineLabel):''}</dd>${(i.fields||[]).map(f=>`<dt>${e(f.label)}</dt><dd>${e(f.value)}</dd>`).join('')}${i.checkedAt&&Number.isFinite(Date.parse(i.checkedAt))?`<dt>근거 확인 시점</dt><dd>${e(i.checkedAt.includes('T')?dateTime(i.checkedAt):i.checkedAt+' · 시각 미확인')}</dd>`:''}</dl><div class="next-action"><span class="eyebrow">다음 확인</span><p>${e(i.applicationStatus==='submitted'?(i.resultStatus==='awaiting'?'재지원하지 않고 발표·회신을 기다립니다.':resultLabels[i.resultStatus]+' 결과 확인'):i.nextAction||'공식 조건을 확인해 주세요.')}</p></div>`;
 }
 placeInspector();
}
function placeInspector(){
 if(!$('inspector')||!payload)return;
 if(matchMedia('(max-width:900px)').matches){
  const row=[...$('cards').children].find(c=>c.dataset.row===selectedId);
  if(mode==='compare')$('browse').prepend($('inspector'));else if(row)row.after($('inspector'));else $('browse').append($('inspector'));
 }else $('browse').append($('inspector'));
}
window.addEventListener('resize',placeInspector);
function chooseItem(id){selectedId=id;mode='detail';renderCards();if(matchMedia('(max-width:900px)').matches)$('inspector').scrollIntoView({block:'nearest'});}
$('cards').addEventListener('click',event=>{const b=event.target.closest('[data-item]');if(b){chooseItem(b.dataset.item);return;}if(event.target.closest('button,input,label,a,select,textarea'))return;const row=event.target.closest('[data-row]');if(row)chooseItem(row.dataset.row);});
$('urgent').addEventListener('click',event=>{const b=event.target.closest('[data-item]');if(b)chooseItem(b.dataset.item);});
$('comparison-bar').addEventListener('click',event=>{const b=event.target.closest('[data-remove]');if(b){compareIds=toggleComparison(compareIds,b.dataset.remove);renderCards();}});
$('browse').addEventListener('change',event=>{
 const compare=event.target.dataset.compare,submit=event.target.dataset.submit;
 if(compare){const next=toggleComparison(compareIds,compare);if(next===compareIds)message('비교는 최대 3개까지 선택할 수 있습니다.',true);compareIds=next;renderCards();}
 if(submit)saveSubmission(submit,event.target.checked);
});
$('inspector-tools').addEventListener('click',event=>{const b=event.target.closest('[data-step]');if(b){const idx=visibleItems.findIndex(i=>i.id===selectedId),next=visibleItems[idx+Number(b.dataset.step)];if(next)chooseItem(next.id);}});
async function saveSubmission(id,checked){
 const r=radar();if(!r||!ready)return;const radarId=r.id,key=radarId+':'+id,attempt=epoch;if(saving.has(key))return;
 const previous=records.find(x=>x.radarId===radarId&&x.itemId===id);saving.add(key);renderCards();message('지원 상태 저장 중…');
 try{
  const data=await stateRequest(apiUrl,authKey,'PUT',{radarId,itemId:id,applicationStatus:checked?'submitted':'not_applied',resultStatus:checked?'awaiting':null,expectedRevision:previous?.revision||0});
  if(!payload||attempt!==epoch)return;records=records.filter(x=>!(x.radarId===radarId&&x.itemId===id));records.push(data.record);
  const finalResult=['selected','not_selected','withdrawn'].includes(r.items.find(i=>i.id===id)?.resultStatus);
  if(activeId===radarId){mode='detail';selectedId=id;search='';$('search').value='';filter=checked?(finalResult?'submitted':'awaiting'):isArchived({...r.items.find(i=>i.id===id),applicationStatus:'not_applied'})?'archive':'all';}
  message(checked?(finalResult?'지원 완료로 저장했습니다. 확인된 결과는 유지합니다.':'지원 완료 · 발표 대기로 저장했습니다.'):'미지원으로 저장했습니다. 마감 건은 보관함에 보관됩니다.');
 }catch(error){
  if(!payload||attempt!==epoch)return;
  if(error.status===409)await loadState(attempt);
  message(error.status===409?'다른 화면의 최신 상태를 불러왔습니다. 확인 후 다시 체크해 주세요.':'저장하지 못했습니다. 지원 기록을 확인한 뒤 다시 시도해 주세요.',true);
 }finally{saving.delete(key);if(payload&&attempt===epoch){renderTabs();renderRadar();}}
}
function chooseFilter(value){filter=value;selectedId=null;mode='detail';renderRadar();}
$('filters').addEventListener('click',event=>{const b=event.target.closest('[data-filter]');if(b)chooseFilter(b.dataset.filter);});
$('archive-toggle').addEventListener('click',()=>chooseFilter(filter==='archive'?'review':'archive'));
$('search').addEventListener('input',event=>{search=event.target.value.trim().toLocaleLowerCase();selectedId=null;renderCards();});
$('report-button').addEventListener('click',()=>{$('dialog-label').textContent=radar().title+' / 전체 보고서';$('detail-content').innerHTML=renderMarkdown(radar().reportMarkdown);$('detail').showModal();});
$('close-detail').addEventListener('click',()=>$('detail').close());$('detail').addEventListener('close',()=>{$('detail-content').replaceChildren();});

function mountNara(){
 if(!payload?.nara||$('nara-host').firstChild)return;
 const frame=document.createElement('iframe');frame.src='../nara/?embedded=dashboard';frame.title='나라장터 파인더';frame.className='nara-frame';
 $('nara-host').append(frame);
}
window.addEventListener('message',event=>{
 const frame=$('nara-host').firstChild;
 if(!payload?.nara||!frame||event.origin!==location.origin||event.source!==frame.contentWindow)return;
 if(event.data?.type==='nara:ready')frame.contentWindow.postMessage({type:'dexa:nara-payload',payload:payload.nara},location.origin);
 if(event.data?.type==='nara:lock')lock();
});
