export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function safeUrl(value) {
  if (!value) return null;
  try { const u=new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}

const bytes = value => Uint8Array.from(atob(value), c=>c.charCodeAt(0));

function assertEnvelope(envelope) {
  const k=envelope?.kdf, c=envelope?.cipher;
  if(envelope?.v!==1 || k?.name!=='PBKDF2' || k.hash!=='SHA-256' || !Number.isInteger(k.iterations) || k.iterations<100000 || k.iterations>2000000 || c?.name!=='AES-GCM' || bytes(k.salt).length!==16 || bytes(c.iv).length!==12) throw Error('Invalid encrypted dashboard');
}

export async function unlockDashboard(envelope,password) {
  assertEnvelope(envelope);const k=envelope.kdf;
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const keyBytes=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytes(k.salt),iterations:k.iterations},base,256));
  return openWithKey(envelope,keyBytes);
}

export async function openWithKey(envelope,keyBytes) {
  assertEnvelope(envelope);const c=envelope.cipher;
  try{
  const key=await crypto.subtle.importKey('raw',keyBytes,{name:'AES-GCM'},false,['decrypt']);
  const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(c.iv)},key,bytes(envelope.ct));
  const payload=JSON.parse(new TextDecoder().decode(raw));
  if(payload.schemaVersion!=='dexa-dash.v1' || !Array.isArray(payload.radars) || !payload.radars.length)throw Error('Invalid dashboard data');
  return {payload,keyBytes};
  }catch(error){keyBytes.fill(0);throw error;}
}

export async function decryptDashboard(envelope,password){const result=await unlockDashboard(envelope,password);result.keyBytes.fill(0);return result.payload;}

export function kstDate(now=new Date()) {
  return new Date(now.getTime()+9*3600000).toISOString().slice(0,10);
}

// 2026-11-01 master rule: 보류 is only for confirmed blockers (overseas residency, eligibility failure,
// rights assignment, full-time weekday roles) or the master's own hold. Unconfirmed pay, schedule,
// fees or rights clauses keep an item reviewable as '확인 필요' with its reason shown.
// '양도' counts only as a stated condition, not a negated one ("양도로 단정하지 않음", "비양도").
const HARD_HOLD=/해외 체류|현지 체류|거주.{0,6}(?:필요|필수)|거점.{0,4}(?:필요|필수|조건)|기반(?:을)? ?(?:둔|조건)|(?<!비)양도(?!.{0,8}(?:단정|아님|없음|하지 않|여부|미확인))|주 ?5일|상근|정규직|자격.{0,6}(?:미달|불충족|없)|불충족|기준 미달|미충족|재개 금지/;
// Cross-radar organization grouping: the same host often appears as an open call and a lecture lead.
const ORG_ALIASES=[[/^(arko|아르코|한국문화예술위원회)/i,'arko'],[/서울로미디어캔버스|서울로 /,'seoullo'],[/아트코리아랩/,'artkorealab'],[/서울문화재단/,'sfac'],[/경기문화재단|경기콘텐츠진흥원/,'ggcf'],[/한국콘텐츠진흥원|kocca|nca /i,'kocca'],[/code:?art/i,'codeart'],[/강사야/,'gangsaya']];
// Busy intervals ([start,end), KST RFC3339) that touch one KST day: count, timed hours inside the day, any all-day block.
export function busyOn(date,busy=[]) {
 const dayStart=Date.parse(date+'T00:00:00+09:00'),dayEnd=dayStart+864e5;let count=0,hours=0,allDay=false;
 for(const b of busy){const s=Date.parse(b.start),e=Date.parse(b.end);if(!(s<dayEnd&&e>dayStart))continue;count++;if(b.allDay)allDay=true;else hours+=(Math.min(e,dayEnd)-Math.max(s,dayStart))/36e5;}
 return {count,hours:Math.round(hours*10)/10,allDay};
}
export function orgKey(item) {
  const raw=String(item.organization||item.title||'').trim();
  for(const [re,key] of ORG_ALIASES)if(re.test(raw))return key;
  const first=(raw.split(/[\s·:/(,]/)[0]||'').toLowerCase().replace(/[^0-9a-z가-힣]/g,'');
  return first.length>=2&&!/^\d+$/.test(first)?first:null;
}
export function reasonOf(item) {
  if(item.reason)return item.reason;
  const review=[...(item.highlights||[]),...(item.fields||[])].find(f=>f.label==='검토 의견')?.value;
  return review||item.nextAction||'';
}
export function holdKind(item) {
  if(['on_hold','cancelled'].includes(item.applicationStatus))return 'user';
  if(item.status!=='hold')return null;
  if(['blocker','check'].includes(item.holdKind))return item.holdKind;
  const scan=[reasonOf(item),...(item.fields||[]).filter(f=>['지원 자격','요건','권리 확인','권리·활용 조건'].includes(f.label)).map(f=>f.value)].join(' ');
  return HARD_HOLD.test(scan)?'blocker':'check';
}
export function itemBucket(item,now=new Date()) {
  if(item.applicationStatus==='submitted')return 'submitted';
  if(item.status==='excluded')return 'excluded';
  if(item.status==='closed')return 'closed';
  const kind=holdKind(item);
  if(kind==='user')return 'hold';
  if(item.deadlineAt && new Date(item.deadlineAt)<=now)return 'closed';
  if(!item.deadlineAt && item.deadlineDate && item.deadlineDate<kstDate(now))return 'closed';
  if(kind==='blocker')return 'hold';
  if(item.status==='waiting')return 'waiting';
  return ['recommended','conditional','hold'].includes(item.status)?'review':'information';
}
export function bucketLabel(item,now=new Date()) {
  const b=itemBucket(item,now);
  if(b==='review')return item.status==='recommended'?{label:'추천',cls:'review'}:item.status==='hold'?{label:'확인 필요',cls:'check'}:{label:'조건부 검토',cls:'review'};
  if(b==='hold')return holdKind(item)==='user'?{label:'지원 보류',cls:'hold'}:{label:'보류 · 결격',cls:'hold'};
  return {label:{submitted:'지원 완료',waiting:'모집 대기',excluded:'제외',closed:'마감',information:'참고'}[b],cls:b};
}

export function isUrgent(item,now=new Date()) {
  if(itemBucket(item,now)!=='review')return false;
  if(item.deadlineAt){const diff=new Date(item.deadlineAt)-now;return diff>0 && diff<7*86400000;}
  if(item.deadlineDate){const days=(Date.parse(item.deadlineDate)-Date.parse(kstDate(now)))/86400000;return days>=0 && days<7;}
  return false;
}

export function deadlineText(item,now=new Date()) {
  if(item.deadlineAt){const d=new Date(item.deadlineAt);return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(d)+' KST';}
  if(item.deadlineDate)return item.deadlineDate.slice(5).replace('-','/')+' · 시각 미확인';
  return item.deadlineLabel || '마감 확인 필요';
}

export function inlineMarkdown(value) {
  const source=String(value??'').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,p,label)=>label||p.split('/').pop());
  const re=/\[([^\]]+)\]\(([^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let out='',offset=0;
  for(const m of source.matchAll(re)){
    out+=escapeHtml(source.slice(offset,m.index));
    if(m[1]){const href=safeUrl(m[2]);out+=href?`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(m[1])}</a>`:escapeHtml(m[1]);}
    else if(m[3])out+=`<code>${escapeHtml(m[3])}</code>`;
    else out+=`<strong>${escapeHtml(m[4])}</strong>`;
    offset=m.index+m[0].length;
  }
  return out+escapeHtml(source.slice(offset));
}

export function renderMarkdown(input) {
  const lines=String(input??'').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'').split(/\r?\n/);
  const out=[];let i=0;
  const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
  while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue;}
    if(/^```/.test(line)){const block=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))block.push(lines[i++]);i++;out.push(`<pre><code>${escapeHtml(block.join('\n'))}</code></pre>`);continue;}
    if(/^>\s?/.test(line)){const quote=[];while(i<lines.length&&/^>\s?/.test(lines[i]))quote.push(lines[i++].replace(/^>\s?/,''));out.push(`<blockquote>${quote.map(q=>`<p>${inlineMarkdown(q)}</p>`).join('')}</blockquote>`);continue;}
    const h=line.match(/^(#{1,6})\s+(.+)/);
    if(h){const n=Math.min(h[1].length+1,6);out.push(`<h${n}>${inlineMarkdown(h[2])}</h${n}>`);i++;continue;}
    if(line.startsWith('|') && /^\|?[\s:|\-]+\|?$/.test(lines[i+1]||'')){
      const head=cells(line);i+=2;const rows=[];while(i<lines.length&&lines[i].startsWith('|'))rows.push(cells(lines[i++]));
      out.push(`<div class="table-scroll"><table><thead><tr>${head.map(c=>`<th>${inlineMarkdown(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${inlineMarkdown(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if(/^\s*(?:[-*]|\d+\.)\s+/.test(line)){
      const list=[];while(i<lines.length&&/^\s*(?:[-*]|\d+\.)\s+/.test(lines[i]))list.push(lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/,''));
      out.push(`<ul>${list.map(c=>`<li>${inlineMarkdown(c)}</li>`).join('')}</ul>`);continue;
    }
    out.push(`<p>${inlineMarkdown(line)}</p>`);i++;
  }
  return out.join('\n');
}
