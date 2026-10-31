import {webcrypto, pbkdf2Sync, randomBytes} from 'node:crypto';
import {safeUrl} from '../../dash/core.mjs';

export const ITERATIONS=600000;
const versions=new Set(['radar.v1','lecture-radar.v1','open-call-radar.v1']);
const runStatuses=new Set(['VERIFIED','HOLD','BLOCKED_HUMAN_REQUIRED','REPAIR_PENDING','CRON_FAILURE']);
const statuses=new Set(['recommended','conditional','hold','waiting','excluded','closed','information']);
const applications=new Set(['not_applied','preparing','submitted','on_hold','cancelled','unknown']);
const text=(value,max=8000)=>typeof value==='string'?value.slice(0,max):'';
const dateOnly=value=>typeof value==='string'&&/^\d{4}-\d\d-\d\d$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const iso=value=>typeof value==='string'&&/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value)&&Number.isFinite(Date.parse(value));

export function sanitizeRadar(input) {
  if(!versions.has(input?.schemaVersion))throw Error('Invalid radar schemaVersion');
  if(!/^[a-z][a-z0-9-]{0,39}$/.test(input.id))throw Error('Invalid radar id');
  if(!iso(input.updatedAt))throw Error('Invalid updatedAt');
  if(!runStatuses.has(input.runStatus))throw Error('Invalid runStatus');
  if(!input.title || !input.occurrenceId || typeof input.summary!=='string' || !Array.isArray(input.items))throw Error('Missing radar fields');
  const ids=new Set();
  const items=input.items.map(item=>{
    if(!item.id || ids.has(item.id))throw Error('Missing or duplicate item id');ids.add(item.id);
    if(!item.title || !statuses.has(item.status)||!applications.has(item.applicationStatus))throw Error(`Invalid item ${item.id}`);
    if(item.deadlineAt!=null&&!iso(item.deadlineAt))throw Error('Invalid deadlineAt');
    if(item.deadlineDate!=null&&!dateOnly(item.deadlineDate))throw Error('Invalid deadlineDate');
    if(item.officialUrl&&!safeUrl(item.officialUrl))throw Error('Invalid official URL');
    return {id:text(item.id,120),title:text(item.title,500),organization:text(item.organization,500),track:item.track==null?null:text(item.track,100),grade:['A','B','C'].includes(item.grade)?item.grade:null,status:item.status,applicationStatus:item.applicationStatus,applicationStatusLabel:text(item.applicationStatusLabel,500),deadlineAt:item.deadlineAt??null,deadlineDate:item.deadlineDate??null,deadlineLabel:text(item.deadlineLabel,500),checkedAt:item.checkedAt==null?null:text(item.checkedAt,100),officialUrl:safeUrl(item.officialUrl),summary:text(item.summary),nextAction:text(item.nextAction),fields:Array.isArray(item.fields)?item.fields.filter(f=>typeof f?.label==='string'&&typeof f?.value==='string').map(f=>({label:text(f.label,100),value:text(f.value)})):[]};
  });
  return {schemaVersion:'radar.v1',id:input.id,title:text(input.title,100),updatedAt:input.updatedAt,occurrenceId:text(input.occurrenceId,300),runStatus:input.runStatus,summary:text(input.summary),limitations:Array.isArray(input.limitations)?input.limitations.map(x=>text(x,3000)):[],reportMarkdown:text(input.reportMarkdown,300000),items};
}

export async function makeKeyConfig(password) {
  if(typeof password!=='string'||password.length<8)throw Error('Password must have at least 8 characters');
  const salt=randomBytes(16);
  return {v:1,kdf:{name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt:salt.toString('base64')},key:pbkdf2Sync(password,salt,ITERATIONS,32,'sha256').toString('base64')};
}

export function validateKeyConfig(config) {
  if(config?.v!==1||config.kdf?.name!=='PBKDF2'||config.kdf?.hash!=='SHA-256'||!Number.isInteger(config.kdf.iterations)||config.kdf.iterations<100000||config.kdf.iterations>2000000||Buffer.from(config.kdf.salt||'','base64').length!==16||Buffer.from(config.key||'','base64').length!==32)throw Error('Invalid local key configuration');
  return config;
}

export async function encryptDashboard(radars,keyConfig) {
  validateKeyConfig(keyConfig);
  const cleaned=radars.map(sanitizeRadar);
  if(!cleaned.length||new Set(cleaned.map(r=>r.id)).size!==cleaned.length)throw Error('Empty or duplicate radar ids');
  const key=await webcrypto.subtle.importKey('raw',Buffer.from(keyConfig.key,'base64'),{name:'AES-GCM'},false,['encrypt']);
  const iv=randomBytes(12);
  const payload={schemaVersion:'dexa-dash.v1',generatedAt:new Date().toISOString(),radars:cleaned};
  const ct=await webcrypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
  return {v:1,kdf:{...keyConfig.kdf},cipher:{name:'AES-GCM',iv:iv.toString('base64')},ct:Buffer.from(ct).toString('base64')};
}

export function openCallsAdapter(state,receipt,reportMarkdown) {
  const detailFields=[['qualification','지원 자격'],['work_fit','작품 적합성'],['rights_gate','권리 확인'],['cost_gate','비용 확인'],['benefits','지원·혜택'],['presence','현장 참여'],['deadline_conflict','마감 대조'],['next_action','다음 확인'],['change','이번 확인 범위']];
  const items=state.candidates.map(c=>{
    const status=c.status||'';const p=c.participation_status||'';
    const applicationStatus=/submitted/.test(status+' '+p)?'submitted':/cancelled/.test(p)?'cancelled':/prepared|draft/.test(p)?'preparing':'unknown';
    const normalized=status.startsWith('excluded')?'excluded':/closed|deadline-elapsed/.test(status)?'closed':status.startsWith('hold')?'hold':status.startsWith('waiting')?'waiting':/conditional-review/.test(status)?'conditional':'information';
    const labels={submitted:'제출 완료 · 회신/결과 대기',preparing:'자료 준비 중',cancelled:'지원 취소',unknown:'지원 여부 미확인'};
    const submittedSummary=applicationStatus==='submitted'?`${c.sent_at_kst?c.sent_at_kst.slice(0,16).replace('T',' ')+' KST · ':''}제출 완료${/sent-verified/.test(p)?' · 보낸 메일 확인':''}. 주최 측 회신·결과 확인을 기다립니다.`:null;
    const fields=detailFields.filter(([key])=>typeof c[key]==='string'&&!(submittedSummary&&key==='work_fit')).map(([key,label])=>({label,value:c[key]}));
    if(submittedSummary)fields.unshift({label:'제출 확인',value:submittedSummary});
    return {id:c.id,title:c.title,status:normalized,applicationStatus,applicationStatusLabel:labels[applicationStatus],grade:c.grade??null,deadlineAt:c.deadline_kst??null,deadlineDate:c.deadline_kst?.slice(0,10)??null,deadlineLabel:c.deadline_source_text||c.discovery_deadline||'',checkedAt:c.checked_at_this_occurrence?.at(-1)||c.last_official_check||null,officialUrl:c.official_url||null,summary:submittedSummary||c.work_fit||c.qualification||c.change||'',nextAction:c.next_action||'',fields};
  });
  return sanitizeRadar({schemaVersion:'open-call-radar.v1',id:'open-calls',title:'공모 레이더',updatedAt:state.generated_at,occurrenceId:state.occurrence_id,runStatus:receipt.purpose_status,summary:'미디어아트·AI 아트 공모의 자격, 권리, 마감과 지원 상태를 함께 확인합니다.',limitations:receipt.limits||[],items,reportMarkdown});
}
