import {escapeHtml as e,deadlineText,kstDate} from './core.mjs';

export const resultLabels={awaiting:'발표 대기',selected:'선정',not_selected:'미선정',withdrawn:'취소'};
export function applicationLabel(item){
  if(item.applicationStatus==='submitted')return '지원 완료 · '+(resultLabels[item.resultStatus]||'발표 대기');
  return {not_applied:'미지원',preparing:'준비 중',on_hold:'지원 보류',cancelled:'지원 취소',unknown:'지원 여부 미확인'}[item.applicationStatus]||'미확인';
}
export function isArchived(item,now=new Date()){
  if(item.applicationStatus==='submitted')return false;
  return item.status==='closed'||Boolean(item.deadlineAt&&new Date(item.deadlineAt)<=now)||Boolean(!item.deadlineAt&&item.deadlineDate&&item.deadlineDate<kstDate(now));
}
export function applyState(radar,records){
  const changes=new Map(records.filter(r=>r.radarId===radar.id).map(r=>[r.itemId,r]));
  return {...radar,items:radar.items.map(item=>{
    const change=changes.get(item.id);let next={...item};
    if(change&&change.source!=='verified-record'){
      next={...next,applicationStatus:change.applicationStatus,resultStatus:change.resultStatus,stateUpdatedAt:change.updatedAt,stateSource:change.source||'dashboard-user',stateRevision:change.revision};
      if(change.applicationStatus==='submitted'&&['selected','not_selected','withdrawn'].includes(item.resultStatus))next.resultStatus=item.resultStatus;
    }
    if(next.applicationStatus==='submitted'&&!next.resultStatus)next.resultStatus='awaiting';
    if(change?.source==='dashboard-user'&&next.applicationStatus==='submitted'){
      const current=f=>f.label==='검토 의견'?{...f,value:f.value.replace(/^미지원 마감 보관\./,'지원 완료로 확인했습니다. 발표·회신 대기 중입니다.')}:f;
      next.fields=next.fields?.map(current);next.highlights=next.highlights?.map(current);
    }
    if(change?.source==='dashboard-user'&&next.applicationStatus==='not_applied'&&item.applicationStatus==='submitted')next.summary='기존 제출 기록을 마스터가 미지원으로 수정했습니다. 아래 설명은 이전 확인 기록입니다. '+item.summary;
    next.applicationStatusLabel=applicationLabel(next);return next;
  })};
}
export function visibleSelection(selectedId,items){return items.some(i=>i.id===selectedId)?selectedId:items[0]?.id||null;}
export function toggleComparison(ids,id){return ids.includes(id)?ids.filter(x=>x!==id):ids.length<3?[...ids,id]:ids;}
export function comparisonTable(items){
  const common=[['마감',i=>deadlineText(i)+(i.deadlineLabel?' · '+i.deadlineLabel:'')],['지원·발표',applicationLabel],['요약',i=>i.summary],['다음 확인',i=>i.applicationStatus==='submitted'?'재지원 없이 발표·회신 확인':i.nextAction]];
  const labels=[...new Set(items.flatMap(i=>(i.fields||[]).map(f=>f.label)))];
  const rows=[...common,...labels.map(label=>[label,i=>i.fields?.find(f=>f.label===label)?.value])];
  return `<div class="comparison-scroll" tabindex="0" aria-label="선택 항목 비교표"><table class="comparison-table"><thead><tr><th scope="col">비교 기준</th>${items.map(i=>`<th scope="col">${e(i.organization||'')}<strong>${e(i.title)}</strong></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${e(label)}</th>${items.map(i=>`<td>${e(value(i)||'미확인')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

const utf8=s=>new TextEncoder().encode(s);
const hex=bytes=>[...new Uint8Array(bytes)].map(v=>v.toString(16).padStart(2,'0')).join('');
const fromHex=s=>Uint8Array.from(s.match(/../g)||[],c=>parseInt(c,16));
export async function deriveSigningKey(raw){
  const key=await crypto.subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC',key,utf8('dexa-radar-state:v1')));
}
async function canonical(method,path,body,timestamp,nonce){return [method,path,timestamp,nonce,hex(await crypto.subtle.digest('SHA-256',utf8(body)))].join('\n');}
export async function signedHeaders(raw,method,path,body='',options={}){
  const timestamp=options.timestamp||String(Math.floor(Date.now()/1000)),nonce=options.nonce||crypto.randomUUID().replaceAll('-','');
  const key=await crypto.subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=hex(await crypto.subtle.sign('HMAC',key,utf8(await canonical(method,path,body,timestamp,nonce))));
  return {'content-type':'application/json','x-dash-timestamp':timestamp,'x-dash-nonce':nonce,'x-dash-signature':signature};
}
export async function verifySignedRequest(raw,method,path,body,headers,now=Math.floor(Date.now()/1000)){
  const timestamp=headers['x-dash-timestamp'],nonce=headers['x-dash-nonce'],signature=headers['x-dash-signature'];
  if(!/^\d{10}$/.test(timestamp||'')||Math.abs(now-Number(timestamp))>300||!/^[a-f0-9]{32}$/.test(nonce||'')||!/^[a-f0-9]{64}$/.test(signature||''))return false;
  const key=await crypto.subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-256'},false,['verify']);
  return crypto.subtle.verify('HMAC',key,fromHex(signature),utf8(await canonical(method,path,body,timestamp,nonce)));
}
export async function stateRequest(base,key,method='GET',value){
  const url=new URL('/v1/state',base),body=value?JSON.stringify(value):'';
  const response=await fetch(url,{method,body:body||undefined,headers:await signedHeaders(key,method,url.pathname,body),cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(15000)});
  const data=await response.json();if(!response.ok){const error=Error(data.error||'상태를 저장하지 못했습니다.');error.status=response.status;throw error;}return data;
}
