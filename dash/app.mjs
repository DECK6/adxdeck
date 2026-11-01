import {unlockDashboard,escapeHtml as e,safeUrl,itemBucket,isUrgent,deadlineText,renderMarkdown} from './core.mjs';
import {deriveSigningKey,stateRequest,applyState,isArchived,applicationLabel,resultLabels,toggleComparison,comparisonTable,visibleSelection} from './state.mjs';

const $=id=>document.getElementById(id);
const labels={review:'검토 가능',submitted:'지원 완료',hold:'보류',waiting:'대기',excluded:'제외',closed:'마감',information:'참고'};
const filters=[['review','검토 가능'],['awaiting','발표 대기'],['submitted','지원 완료'],['hold','보류'],['waiting','모집 대기'],['excluded','제외'],['all','전체']];
let payload=null,activeId=null,envelope=null,epoch=0,authKey=null,apiUrl=null,records=[],ready=false;
let filter='review',search='',selectedId=null,compareIds=[],mode='detail',visibleItems=[];
const tabStates=new Map(),saving=new Set();
const dateTime=at=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(at))+' KST';
const choices=()=>payload?[...payload.radars,...(payload.nara?[{id:'nara',title:'나라장터 파인더',items:[]}]:[])]:[];
const radar=()=>{const base=payload?.radars.find(r=>r.id===activeId);return base?applyState(base,records):null;};
function message(text,error=false){$('sync-message').textContent=text;$('sync-message').classList.toggle('error',error);$('retry-sync').hidden=!error||ready;}

$('unlock-form').addEventListener('submit',async event=>{
 event.preventDefault();const attempt=++epoch,password=$('password').value;$('password').value='';$('unlock').disabled=true;
 $('gate-message').classList.remove('error');$('gate-message').textContent='대시보드를 여는 중입니다…';let fetching=false;
 try{
  if(!envelope){fetching=true;const response=await fetch('./data.enc.json',{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('fetch');envelope=await response.json();fetching=false;}
  const decoded=await unlockDashboard(envelope,password);
  if(attempt!==epoch){decoded.keyBytes.fill(0);return;}
  authKey=await deriveSigningKey(decoded.keyBytes);decoded.keyBytes.fill(0);if(attempt!==epoch){authKey.fill(0);authKey=null;return;}payload=decoded.payload;
  const requested=location.hash.slice(1);activeId=choices().some(r=>r.id===requested)?requested:payload.radars[0].id;
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
 for(const id of ['tabs','cards','stats','urgent','limitations','radar-title','radar-summary','run-status','updated','occurrence','detail-content','dialog-label','filters','result-count','today','comparison-bar','inspector-tools','inspector-content','sync-message'])$(id).replaceChildren();
 $('inspector').hidden=true;$('search').value='';$('workspace').hidden=true;$('gate').hidden=false;$('password').value='';$('gate-message').classList.remove('error');$('gate-message').textContent='대시보드가 잠겼습니다.';$('password').focus();
}
$('lock').addEventListener('click',lock);window.addEventListener('pagehide',lock);
$('retry-sync').addEventListener('click',()=>loadState());
window.addEventListener('hashchange',()=>{if(payload&&choices().some(r=>r.id===location.hash.slice(1)))selectRadar(location.hash.slice(1));});
function renderTabs(){
 $('tabs').innerHTML=choices().map(base=>{const r=applyState(base,records),count=r.id==='nara'?new Set([...payload.nara.items,...payload.nara.recommendations.flatMap(b=>b.items)].map(i=>i.bidNtceNo||i.id)).size:r.items.filter(i=>!isArchived(i)).length;return `<button id="tab-${e(r.id)}" role="tab" type="button" aria-controls="radar-panel" aria-selected="${r.id===activeId}" tabindex="${r.id===activeId?0:-1}" data-radar="${e(r.id)}">${e(r.title)}<span class="tab-count">${count}</span></button>`;}).join('');
}
function selectRadar(id){
 if(activeId)tabStates.set(activeId,{filter,search,selectedId,compareIds:[...compareIds],mode});activeId=id;
 const saved=tabStates.get(id)||{filter:'review',search:'',selectedId:null,compareIds:[],mode:'detail'};({filter,search,selectedId,compareIds,mode}=saved);
 $('search').value=search;history.replaceState(null,'','#'+id);renderTabs();renderRadar();
}
$('tabs').addEventListener('click',event=>{const t=event.target.closest('[data-radar]');if(t)selectRadar(t.dataset.radar);});
$('tabs').addEventListener('keydown',event=>{
 const tabs=[...$('tabs').querySelectorAll('[role=tab]')];let idx=tabs.findIndex(t=>t.dataset.radar===activeId);
 if(event.key==='ArrowRight')idx=(idx+1)%tabs.length;else if(event.key==='ArrowLeft')idx=(idx+tabs.length-1)%tabs.length;else if(event.key==='Home')idx=0;else if(event.key==='End')idx=tabs.length-1;else return;
 event.preventDefault();selectRadar(tabs[idx].dataset.radar);$('tabs').querySelector('[aria-selected=true]').focus();
});
function renderRadar(){
 $('radar-panel').hidden=activeId==='nara';$('nara-panel').hidden=activeId!=='nara';
 if(activeId==='nara'){mountNara();return;}
 const r=radar(),now=new Date();if(!r)return;$('radar-panel').setAttribute('aria-labelledby','tab-'+r.id);
 $('today').textContent=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(now);
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
