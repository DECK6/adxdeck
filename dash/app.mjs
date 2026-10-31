import {decryptDashboard,escapeHtml as e,safeUrl,itemBucket,isUrgent,deadlineText,renderMarkdown} from './core.mjs';

const $=id=>document.getElementById(id);
const labels={review:'검토 가능',submitted:'제출 완료',hold:'보류',waiting:'대기',excluded:'제외',closed:'마감',information:'참고'};
const filters=[['review','검토 가능'],['urgent','7일 이내'],['submitted','제출 완료'],['hold','보류'],['waiting','대기'],['excluded','제외'],['closed','마감'],['all','전체']];
let payload=null,activeId=null,filter='review',search='',envelope=null,unlockEpoch=0;
const dateTime=at=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(at))+' KST';
const radar=()=>payload?.radars.find(r=>r.id===activeId);

$('unlock-form').addEventListener('submit',async event=>{
  event.preventDefault();const epoch=++unlockEpoch,password=$('password').value;$('password').value='';$('unlock').disabled=true;
  $('gate-message').classList.remove('error');$('gate-message').textContent='대시보드를 여는 중입니다…';
  let fetching=false;
  try{
    if(!envelope){fetching=true;const response=await fetch('./data.enc.json',{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('fetch');envelope=await response.json();fetching=false;}
    const decoded=await decryptDashboard(envelope,password);if(epoch!==unlockEpoch)return;payload=decoded;
    const requested=location.hash.slice(1);activeId=payload.radars.some(r=>r.id===requested)?requested:payload.radars[0].id;
    $('gate').hidden=true;$('workspace').hidden=false;renderTabs();renderRadar();$('tabs').querySelector('[aria-selected=true]').focus();
  }catch{
    payload=null;$('gate-message').classList.add('error');$('gate-message').textContent=fetching?'데이터를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.':'비밀번호가 맞지 않거나 데이터를 열 수 없습니다. 다시 입력해 주세요.';$('password').focus();
  }finally{$('unlock').disabled=false;}
});

function lock(){
  unlockEpoch++;
  if($('detail').open)$('detail').close();
  payload=null;activeId=null;search='';filter='review';envelope=null;
  for(const id of ['tabs','cards','stats','urgent','limitations','radar-title','radar-summary','run-status','updated','occurrence','detail-content','dialog-label','filters','result-count','today'])$(id).replaceChildren();
  $('search').value='';$('workspace').hidden=true;$('gate').hidden=false;$('password').value='';$('gate-message').classList.remove('error');$('gate-message').textContent='대시보드가 잠겼습니다.';$('password').focus();
}
$('lock').addEventListener('click',lock);
window.addEventListener('pagehide',lock);
window.addEventListener('hashchange',()=>{if(payload&&payload.radars.some(r=>r.id===location.hash.slice(1)))selectRadar(location.hash.slice(1));});

function renderTabs(){
  $('tabs').innerHTML=payload.radars.map(r=>`<button id="tab-${e(r.id)}" role="tab" type="button" aria-controls="radar-panel" aria-selected="${r.id===activeId}" tabindex="${r.id===activeId?0:-1}" data-radar="${e(r.id)}">${e(r.title)}<span class="tab-count">${r.items.length}</span></button>`).join('');
}
function selectRadar(id){activeId=id;filter='review';search='';$('search').value='';history.replaceState(null,'','#'+id);renderTabs();renderRadar();}
$('tabs').addEventListener('click',event=>{const tab=event.target.closest('[data-radar]');if(tab)selectRadar(tab.dataset.radar);});
$('tabs').addEventListener('keydown',event=>{
  const tabs=[...$('tabs').querySelectorAll('[role=tab]')];let idx=tabs.findIndex(t=>t.dataset.radar===activeId);
  if(event.key==='ArrowRight')idx=(idx+1)%tabs.length;else if(event.key==='ArrowLeft')idx=(idx+tabs.length-1)%tabs.length;else if(event.key==='Home')idx=0;else if(event.key==='End')idx=tabs.length-1;else return;
  event.preventDefault();selectRadar(tabs[idx].dataset.radar);$('tabs').querySelector('[aria-selected=true]').focus();
});

function renderRadar(){
  const r=radar(),now=new Date();$('radar-panel').setAttribute('aria-labelledby','tab-'+r.id);
  $('today').textContent=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(now);
  $('radar-title').textContent=r.title;$('radar-summary').textContent=r.summary;
  $('run-status').textContent=r.runStatus==='VERIFIED'?'검증 완료':r.runStatus==='HOLD'?'일부 확인 보류':r.runStatus;
  $('run-status').className='badge'+(r.runStatus==='VERIFIED'?'':' hold');$('updated').textContent=dateTime(r.updatedAt)+' 갱신';$('updated').dateTime=r.updatedAt;
  const counts={};for(const item of r.items){const b=itemBucket(item,now);counts[b]=(counts[b]||0)+1;}
  const confirmed=r.items.filter(i=>i.status==='recommended'&&itemBucket(i,now)==='review').length;
  const stats=[['검토 가능',counts.review||0],['확정 추천',confirmed],['제출 완료',counts.submitted||0],['보류·대기',(counts.hold||0)+(counts.waiting||0)]];
  $('stats').innerHTML=stats.map(([label,count])=>`<div class="stat"><span>${label}</span><strong>${count}</strong></div>`).join('');
  const limits=r.limitations||[];$('limitations').hidden=!limits.length;$('limitations').innerHTML=limits.length?`<details><summary>확인 범위와 남은 조건 ${limits.length}건</summary><ul>${limits.map(l=>`<li>${e(l)}</li>`).join('')}</ul></details>`:'';
  const urgent=r.items.filter(i=>isUrgent(i,now)).sort((a,b)=>(a.deadlineAt||a.deadlineDate).localeCompare(b.deadlineAt||b.deadlineDate));
  $('urgent').hidden=!urgent.length;$('urgent').innerHTML=`<span class="urgent-label">● 7일 이내 ${urgent.length}건</span><div class="urgent-items">${urgent.map(i=>`<button data-item="${e(i.id)}">${e(i.title)}<small>${e(deadlineText(i))}</small></button>`).join('')}</div>`;
  $('filters').innerHTML=filters.map(([key,label])=>`<button type="button" data-filter="${key}" aria-pressed="${filter===key}">${label}</button>`).join('');
  $('report-button').hidden=!r.reportMarkdown;$('occurrence').textContent=r.occurrenceId;renderCards();
}
function renderCards(){
  const now=new Date(),r=radar();
  const items=r.items.filter(i=>(filter==='all'||filter==='urgent'&&isUrgent(i,now)||itemBucket(i,now)===filter)&&(!search||[i.title,i.organization,i.summary,i.nextAction,...(i.fields||[]).map(f=>f.value)].join(' ').toLocaleLowerCase().includes(search)));
  items.sort((a,b)=>Number(isUrgent(b,now))-Number(isUrgent(a,now))||(a.deadlineAt||a.deadlineDate||'9999').localeCompare(b.deadlineAt||b.deadlineDate||'9999'));
  $('result-count').textContent=`${filters.find(([key])=>key===filter)?.[1]||''} ${items.length}건 · 전체 ${r.items.length}건`;
  $('empty').hidden=items.length>0;
  $('cards').innerHTML=items.map(i=>{
    const b=itemBucket(i,now),urgent=isUrgent(i,now);
    const status=b==='review'?(i.status==='recommended'?'추천':'조건부 검토'):labels[b];
    return `<article class="card${urgent?' urgent-card':''}"><div class="card-tags"><span class="tag ${b}">${e(status)}</span>${i.grade?`<span class="tag">${e(i.grade)}등급</span>`:''}${i.track?`<span class="tag">트랙 ${e(i.track)}</span>`:''}${urgent?'<span class="tag urgent-tag">7일 이내</span>':''}</div>${i.organization?`<p class="card-organization">${e(i.organization)}</p>`:''}<h3>${e(i.title)}</h3><p class="card-summary">${e(i.summary||i.nextAction||'상세 조건을 확인해 주세요.')}</p><p class="card-deadline"><span>마감</span><span>${e(deadlineText(i))}</span></p><div class="card-bottom"><span class="application">${e(i.applicationStatusLabel||({submitted:'제출 완료',preparing:'준비 중',not_applied:'미지원',on_hold:'지원 보류',cancelled:'지원 취소',unknown:'지원 여부 미확인'}[i.applicationStatus]))}</span><button type="button" data-item="${e(i.id)}" aria-label="${e(i.title)} 상세 보기">상세 보기 ↗</button></div></article>`;
  }).join('');
}
$('filters').addEventListener('click',event=>{const b=event.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;for(const f of $('filters').children)f.setAttribute('aria-pressed',String(f===b));renderCards();});
$('search').addEventListener('input',event=>{search=event.target.value.trim().toLocaleLowerCase();renderCards();});
function showItem(id){
  const i=radar().items.find(item=>item.id===id);if(!i)return;
  $('dialog-label').textContent=radar().title+' / '+labels[itemBucket(i)];
  const href=safeUrl(i.officialUrl);
  $('detail-content').innerHTML=`<h2>${e(i.title)}</h2>${i.organization?`<p>${e(i.organization)}</p>`:''}<p>${e(i.summary)}</p>${href?`<a class="official-link" href="${e(href)}" target="_blank" rel="noopener noreferrer">공식 공고 열기 ↗</a>`:''}<dl><dt>마감</dt><dd>${e(deadlineText(i))}${i.deadlineLabel?'<br>'+e(i.deadlineLabel):''}</dd><dt>지원 상태</dt><dd>${e(i.applicationStatusLabel||i.applicationStatus)}</dd>${(i.fields||[]).map(f=>`<dt>${e(f.label)}</dt><dd>${e(f.value)}</dd>`).join('')}${i.checkedAt&&Number.isFinite(Date.parse(i.checkedAt))?`<dt>근거 확인 시점</dt><dd>${e(i.checkedAt.includes('T')?dateTime(i.checkedAt):i.checkedAt+' · 시각 미확인')}</dd>`:''}</dl>${i.nextAction?`<div class="next-action"><span class="eyebrow">다음 확인</span><p>${e(i.nextAction)}</p></div>`:''}`;
  $('detail').showModal();$('close-detail').focus();
}
for(const id of ['cards','urgent'])$(id).addEventListener('click',event=>{const b=event.target.closest('[data-item]');if(b)showItem(b.dataset.item);});
$('report-button').addEventListener('click',()=>{$('dialog-label').textContent=radar().title+' / 전체 보고서';$('detail-content').innerHTML=renderMarkdown(radar().reportMarkdown);$('detail').showModal();$('close-detail').focus();});
$('close-detail').addEventListener('click',()=>$('detail').close());
$('detail').addEventListener('close',()=>{$('detail-content').replaceChildren();$('dialog-label').textContent='';});
