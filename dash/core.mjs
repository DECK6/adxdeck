export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function safeUrl(value) {
  if (!value) return null;
  try { const u=new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}

const bytes = value => Uint8Array.from(atob(value), c=>c.charCodeAt(0));

export async function decryptDashboard(envelope,password) {
  const k=envelope?.kdf, c=envelope?.cipher;
  if(envelope?.v!==1 || k?.name!=='PBKDF2' || k.hash!=='SHA-256' || !Number.isInteger(k.iterations) || k.iterations<100000 || k.iterations>2000000 || c?.name!=='AES-GCM' || bytes(k.salt).length!==16 || bytes(c.iv).length!==12) throw Error('Invalid encrypted dashboard');
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:bytes(k.salt),iterations:k.iterations},base,{name:'AES-GCM',length:256},false,['decrypt']);
  const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(c.iv)},key,bytes(envelope.ct));
  const payload=JSON.parse(new TextDecoder().decode(raw));
  if(payload.schemaVersion!=='dexa-dash.v1' || !Array.isArray(payload.radars) || !payload.radars.length)throw Error('Invalid dashboard data');
  return payload;
}

export function kstDate(now=new Date()) {
  return new Date(now.getTime()+9*3600000).toISOString().slice(0,10);
}

export function itemBucket(item,now=new Date()) {
  if(item.applicationStatus==='submitted')return 'submitted';
  if(item.status==='excluded')return 'excluded';
  if(item.status==='closed')return 'closed';
  if(item.applicationStatus==='cancelled' || item.applicationStatus==='on_hold')return 'hold';
  if(item.deadlineAt && new Date(item.deadlineAt)<=now)return 'closed';
  if(!item.deadlineAt && item.deadlineDate && item.deadlineDate<kstDate(now))return 'closed';
  if(item.status==='hold')return 'hold';
  if(item.status==='waiting')return 'waiting';
  return ['recommended','conditional'].includes(item.status)?'review':'information';
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
