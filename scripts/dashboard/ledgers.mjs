// Vault ledgers that enrich the dashboard beyond the radar adapters:
//  - replies/latest.json   : institution replies detected by the reply radar (접수·미팅·선정·미선정·지급)
//  - receivables/latest.json: money already earned but not yet collected (회수 원장)
import fs from 'node:fs';
import path from 'node:path';
const text=(v,max)=>typeof v==='string'?v.slice(0,max):'';
const iso=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
const dateOnly=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\d$/.test(v)&&Number.isFinite(Date.parse(v));

export function readVaultJson(vault,rel){const file=path.join(vault,rel);return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;}

export const REPLY_STATUSES=['none','acknowledged','meeting','documents','selected','not_selected','withdrawn','paid'];
const FINAL_REPLIES={selected:'selected',not_selected:'not_selected',withdrawn:'withdrawn'};
export function applyReplies(radars,ledger){
 if(!ledger)return radars;
 if(ledger.schemaVersion!=='radar-reply-ledger.v1'||!Array.isArray(ledger.records))throw Error('Invalid reply ledger');
 return radars.map(radar=>({...radar,items:radar.items.map(item=>{
  const r=ledger.records.find(x=>x.radarId===radar.id&&x.itemId===item.id);
  if(!r||!REPLY_STATUSES.includes(r.replyStatus))return item;
  const next={...item,replyStatus:r.replyStatus,replyAt:iso(r.replyAt)||dateOnly(r.replyAt)?r.replyAt:null,replyNote:text(r.replyNote,300)};
  // An institution's final answer outranks the producer's awaiting state, but never turns a non-submission into a result.
  if(FINAL_REPLIES[r.replyStatus]&&item.applicationStatus==='submitted')next.resultStatus=FINAL_REPLIES[r.replyStatus];
  return next;
 })}));
}

export const RECEIVABLE_STATUSES=['pending','invoiced','paid','blocked','unknown','dropped'];
export function sanitizeReceivables(input){
 if(!input||input.schemaVersion!=='receivables.v1'||!Array.isArray(input.records))throw Error('Invalid receivables ledger');
 const ids=new Set();
 const records=input.records.map(r=>{
  if(!r?.id||ids.has(r.id)||!r.counterparty||!RECEIVABLE_STATUSES.includes(r.status))throw Error('Invalid receivable '+(r?.id||'?'));ids.add(r.id);
  return {id:text(r.id,80),counterparty:text(r.counterparty,120),item:text(r.item,300),amountKrw:Number.isFinite(r.amountKrw)?Math.round(r.amountKrw):null,amountLabel:text(r.amountLabel,80),status:r.status,expectedAt:dateOnly(r.expectedAt)?r.expectedAt:null,basis:text(r.basis,300),lastCheckedAt:dateOnly(r.lastCheckedAt)||iso(r.lastCheckedAt)?r.lastCheckedAt:null,nextAction:text(r.nextAction,300),note:text(r.note,300)};
 });
 return {schemaVersion:'receivables.v1',updatedAt:iso(input.updatedAt)?input.updatedAt:new Date().toISOString(),records};
}
