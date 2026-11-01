import {withKoreanAnalysis} from './analysis.mjs';
import {sanitizeRevenue} from './revenue.mjs';
import {sanitizeReceivables,REPLY_STATUSES} from './ledgers.mjs';
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
    if(item.resultStatus!=null&&!['awaiting','selected','not_selected','withdrawn'].includes(item.resultStatus))throw Error('Invalid resultStatus');
    if(item.stateUpdatedAt!=null&&!iso(item.stateUpdatedAt))throw Error('Invalid stateUpdatedAt');
    return {id:text(item.id,120),reason:text(item.reason,400),holdKind:['blocker','check'].includes(item.holdKind)?item.holdKind:null,replyStatus:REPLY_STATUSES.includes(item.replyStatus)?item.replyStatus:null,replyAt:item.replyAt==null?null:text(item.replyAt,40),replyNote:text(item.replyNote,300),title:text(item.title,500),organization:text(item.organization,500),track:item.track==null?null:text(item.track,100),grade:['A','B','C'].includes(item.grade)?item.grade:null,status:item.status,applicationStatus:item.applicationStatus,applicationStatusLabel:text(item.applicationStatusLabel,500),resultStatus:item.resultStatus??(item.applicationStatus==='submitted'?'awaiting':null),stateUpdatedAt:item.stateUpdatedAt??null,stateSource:text(item.stateSource,100),stateRevision:Number.isSafeInteger(item.stateRevision)&&item.stateRevision>=0?item.stateRevision:0,deadlineAt:item.deadlineAt??null,deadlineDate:item.deadlineDate??null,deadlineLabel:text(item.deadlineLabel,500),checkedAt:item.checkedAt==null?null:text(item.checkedAt,100),officialUrl:safeUrl(item.officialUrl),summary:text(item.summary),highlights:Array.isArray(item.highlights)?item.highlights.filter(f=>typeof f?.label==='string'&&typeof f?.value==='string').map(f=>({label:text(f.label,100),value:text(f.value)})):[],nextAction:text(item.nextAction),fields:Array.isArray(item.fields)?item.fields.filter(f=>typeof f?.label==='string'&&typeof f?.value==='string').map(f=>({label:text(f.label,100),value:text(f.value)})):[]};
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

export async function encryptDashboard(radars,keyConfig,extras={}) {
  validateKeyConfig(keyConfig);
  const cleaned=radars.map(sanitizeRadar);
  if(!cleaned.length||new Set(cleaned.map(r=>r.id)).size!==cleaned.length)throw Error('Empty or duplicate radar ids');
  const key=await webcrypto.subtle.importKey('raw',Buffer.from(keyConfig.key,'base64'),{name:'AES-GCM'},false,['encrypt']);
  const iv=randomBytes(12);
  if(extras.nara&&(extras.nara.v!==2||!Array.isArray(extras.nara.items)||!Array.isArray(extras.nara.recommendations)))throw Error('Invalid NARA snapshot');
  const revenue=extras.revenue?sanitizeRevenue(extras.revenue):null;
  const receivables=extras.receivables?sanitizeReceivables(extras.receivables):null;
  const payload={schemaVersion:'dexa-dash.v1',generatedAt:new Date().toISOString(),radars:cleaned,...extras.nara?{nara:extras.nara}:{},...revenue?{revenue}:{},...receivables?{receivables}:{}};
  const ct=await webcrypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
  return {v:1,kdf:{...keyConfig.kdf},cipher:{name:'AES-GCM',iv:iv.toString('base64')},ct:Buffer.from(ct).toString('base64')};
}

export function openCallsAdapter(state,receipt,reportMarkdown,analysis) {
  const detailFields=[['qualification','지원 자격'],['work_fit','작품 적합성'],['rights_gate','권리 확인'],['cost_gate','비용 확인'],['benefits','지원·혜택'],['presence','현장 참여'],['deadline_conflict','마감 대조'],['next_action','다음 확인'],['change','이번 확인 범위']];
  const items=state.candidates.map(c=>{
    const status=c.status||'';const p=c.participation_status||'';
    const applicationStatus=/submitted/.test(status+' '+p)?'submitted':/cancelled/.test(p)?'cancelled':/prepared|draft/.test(p)?'preparing':'unknown';
    const normalized=status.startsWith('excluded')?'excluded':/closed|deadline-elapsed/.test(status)?'closed':status.startsWith('hold')?'hold':status.startsWith('waiting')?'waiting':/conditional-review/.test(status)?'conditional':'information';
    const labels={submitted:'제출 완료 · 회신/결과 대기',preparing:'자료 준비 중',cancelled:'지원 취소',unknown:'지원 여부 미확인'};
    const submittedSummary=applicationStatus==='submitted'?`${c.sent_at_kst?c.sent_at_kst.slice(0,16).replace('T',' ')+' KST · ':''}제출 완료${/sent-verified/.test(p)?' · 보낸 메일 확인':''}. 주최 측 회신·결과 확인을 기다립니다.`:null;
    const fields=detailFields.filter(([key])=>typeof c[key]==='string'&&!(submittedSummary&&key==='work_fit')).map(([key,label])=>({label,value:c[key]}));
    if(submittedSummary)fields.unshift({label:'제출 확인',value:submittedSummary});
    return {id:c.id,title:c.title,organization:c.organization||null,track:c.track??null,status:normalized,applicationStatus,applicationStatusLabel:labels[applicationStatus],grade:c.grade??null,deadlineAt:c.deadline_kst??null,deadlineDate:c.deadline_date??c.deadline_kst?.slice(0,10)??null,deadlineLabel:c.deadline_source_text||c.discovery_deadline||'',checkedAt:c.checked_at_this_occurrence?.at(-1)||c.last_official_check||null,officialUrl:c.official_url||null,summary:submittedSummary||c.work_fit||c.qualification||c.change||'',nextAction:c.next_action||'',fields};
  });
  for(const p of state.participation_context||[]){
    let entry;
    if(/^CTxAI/.test(p.project)&&/submitted/.test(p.state||''))entry={id:'ctxai-personal-2026',title:'CTxAI 성과공유회 · 개인작품 2건',organization:'KAIST CTxAI',summary:'개인작품 동의서 2건과 작품정보·영상 제출 메일 완료 기록. 팀 제출과 구별합니다.',nextAction:'개인작품 진행·회신을 확인하며 재제출하지 않습니다.',fields:[{label:'제출 근거',value:'10/21 개인 동의서 2건과 제출 메일 발송 확인 기록'},{label:'확인 범위',value:'제출 확인을 새 선정·수상 또는 주최 측 수신 확인으로 해석하지 않습니다.'}]};
    if(p.project==='LED.ART'&&p.state==='reply-sent-contract-pending')entry={id:'led-art-onboarding',title:'LED.ART · 6작품 입점 정보 회신',organization:'LED.ART',summary:'6작품 입점 정보 회신 발송 기록. 주수신자 수신·계약 체결·입점·납품 완료는 미확정입니다.',nextAction:'담당자 회신·작품별 조건·계약안을 확인합니다. 중복 회신하지 않습니다.',fields:[{label:'진행 구분',value:'입점 정보 회신 · 공모 선정이나 계약 완료와 구별'},{label:'제출 근거',value:'10/27 발송 확인 기록. 참조 주소 반송 이력과 주수신자 수신 확인을 구별합니다.'}]};
    if(entry&&!items.some(i=>i.id===entry.id))items.push({...entry,status:'information',applicationStatus:'submitted',applicationStatusLabel:'지원 완료 · 발표·회신 대기',resultStatus:'awaiting',stateSource:'verified-record',stateUpdatedAt:p.recorded_time||null,checkedAt:p.recorded_time||null,deadlineAt:null,deadlineDate:null,deadlineLabel:'제출 완료 · 중복 지원 불필요'});
  }
  const reviewed=items.map(item=>withKoreanAnalysis(item,state.candidates.find(c=>c.id===item.id)||{id:item.id,title:item.title},analysis));
  return sanitizeRadar({schemaVersion:'open-call-radar.v1',id:'open-calls',title:'공모 레이더',updatedAt:state.generated_at,occurrenceId:state.occurrence_id,runStatus:receipt.purpose_status,summary:'미디어아트·AI 아트 공모의 자격, 권리, 마감과 지원 상태를 함께 확인합니다.',limitations:analysis?.limitationsKo||[...new Set((receipt.limits||[]).map(l=>/[가-힣]/.test(l)?l:'기존 조사에서 미확인 조건이 남아 있습니다. 공식 세부 규정을 재확인해 주세요.'))],items:reviewed,reportMarkdown});
}
