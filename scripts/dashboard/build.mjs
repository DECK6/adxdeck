import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {encryptDashboard,openCallsAdapter,sanitizeRadar} from './lib.mjs';
import {latestRevenuePlan,sanitizeRevenue} from './revenue.mjs';
import {readVaultJson,applyReplies,sanitizeReceivables} from './ledgers.mjs';
import {sanitizeCalendar} from './calendar.mjs';
import {applyState} from '../../dash/state.mjs';

import {DEFAULT_VAULT,DEFAULT_KEY,ROOT,readKeyConfig,atomicWrite} from './io.mjs';
export {DEFAULT_VAULT,DEFAULT_KEY,ROOT,readKeyConfig,atomicWrite};
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));

export async function writeEncryptedDashboard(radars,config,out,extras={}) {
  // Validate and encrypt everything before touching the previous export.
  const envelope=await encryptDashboard(radars,config,extras);
  const data=JSON.stringify(envelope)+'\n';
  atomicWrite(out,data);
  return {output:out,bytes:Buffer.byteLength(data),sha256:createHash('sha256').update(data).digest('hex'),radars:radars.map(r=>({id:r.id,updatedAt:r.updatedAt,occurrenceId:r.occurrenceId,runStatus:r.runStatus,items:r.items.length}))};
}

function runFolders(root) {
  return fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>path.join(root,e.name));
}

export function findLatestAdapter(root,filename) {
  const found=[];
  for(const dir of runFolders(root)){
    const file=path.join(dir,filename);if(!fs.existsSync(file))continue;
    const data=json(file);if(!Number.isFinite(Date.parse(data.updatedAt)))throw Error('Invalid adapter timestamp: '+file);
    found.push({path:file,data});
  }
  found.sort((a,b)=>Date.parse(b.data.updatedAt)-Date.parse(a.data.updatedAt));
  if(!found.length)throw Error('No radar adapter in '+root);
  sanitizeRadar(found[0].data);
  return found[0];
}

// A radar that has not produced its first run yet simply has no tab.
export function optionalAdapter(root,filename) {
  if(!fs.existsSync(root)||!runFolders(root).some(dir=>fs.existsSync(path.join(dir,filename))))return null;
  return findLatestAdapter(root,filename);
}

export function latestOpenCalls(vault=DEFAULT_VAULT) {
  const root=path.join(vault,'60-actions/runs/media-art-open-call-radar');
  const found=[];
  for(const dir of runFolders(root)){
    const stateFile=path.join(dir,'candidate-state.json'),receiptFile=path.join(dir,'receipt.json'),checkpointFile=path.join(dir,'checkpoint.json');
    if(![stateFile,receiptFile,checkpointFile].every(f=>fs.existsSync(f)))continue;
    const checkpoint=json(checkpointFile);if(checkpoint.status!=='complete')continue;
    const state=json(stateFile),receipt=json(receiptFile);
    if(state.occurrence_id!==receipt.occurrence_id||state.occurrence_id!==checkpoint.occurrence_id)throw Error('Mismatched open-call occurrence: '+dir);
    if(!Number.isFinite(Date.parse(state.generated_at)))throw Error('Invalid open-call timestamp: '+dir);
    found.push({dir,state,receipt});
  }
  found.sort((a,b)=>Date.parse(b.state.generated_at)-Date.parse(a.state.generated_at));
  if(!found.length)throw Error('No completed open-call source');
  const current=found[0];
  // Detailed allowlisted fields provide the report without exporting raw vault prose.
  const analysisFile=path.join(vault,'60-actions/runs/radar-dashboard/open-call-analysis/latest.json');
  const analysis=fs.existsSync(analysisFile)?json(analysisFile):null;
  const data=openCallsAdapter(current.state,current.receipt,'',analysis);
  const adapterPath=path.join(current.dir,'open-call-radar.v1.json');
  atomicWrite(adapterPath,JSON.stringify(data,null,2)+'\n',0o600);
  return {path:adapterPath,data};
}

// Official links the radars could not supply are kept in a small vault ledger and applied at build time.
export function applyLinkOverrides(radars,overrides){
  if(!overrides)return radars;
  if(overrides.schemaVersion!=='radar-link-overrides.v1'||!Array.isArray(overrides.records))throw Error('Invalid link override ledger');
  return radars.map(radar=>({...radar,items:radar.items.map(item=>{
    const o=overrides.records.find(r=>r.radarId===radar.id&&r.itemId===item.id);
    if(!o||!o.officialUrl||(item.officialUrl&&!o.force))return item;
    const fields=[...(item.fields||[])];if(o.note)fields.push({label:'링크 출처',value:o.note});
    return {...item,officialUrl:o.officialUrl,fields};
  })}));
}
export function readLinkOverrides(vault=DEFAULT_VAULT){
  const file=path.join(vault,'60-actions/runs/radar-dashboard/link-overrides/latest.json');
  return fs.existsSync(file)?json(file):null;
}

export function assertPrivateExport(radars) {
  const text=JSON.stringify(radars);
  if(/\/(?:Users|Volumes|home)\/|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:010|011)[ -]?\d{3,4}[ -]?\d{4}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/i.test(text))throw Error('Private path/contact/credential found in export');
  for(const radar of radars)for(const item of radar.items){
    if(!item.officialUrl)continue;
    const u=new URL(item.officialUrl);
    if(u.username||u.password||[...u.searchParams.keys()].some(k=>/^(?:access_token|refresh_token|token|auth|password|secret|signature|sig|session|credential)$/i.test(k)))throw Error('Authentication link found in export');
  }
}

export async function build({vault=DEFAULT_VAULT,keyFile=DEFAULT_KEY,out=path.join(ROOT,'dash/data.enc.json')}={}) {
  const key=readKeyConfig(keyFile);
  const {syncState}=await import('./sync-state.mjs');
  const state=await syncState({vault,keyConfig:key});
  const sources=[latestOpenCalls(vault),findLatestAdapter(path.join(vault,'60-actions/runs/lecture-opportunity-radar'),'lecture-radar.v1.json'),optionalAdapter(path.join(vault,'60-actions/runs/grant-radar'),'grant-radar.v1.json')].filter(Boolean);
  const radars=applyReplies(applyLinkOverrides(sources.map(s=>sanitizeRadar(applyState(s.data,state.records))),readLinkOverrides(vault)),readVaultJson(vault,'60-actions/runs/radar-dashboard/replies/latest.json')).map(sanitizeRadar);
  const receivablesRaw=readVaultJson(vault,'60-actions/runs/radar-dashboard/receivables/latest.json'),receivables=receivablesRaw?sanitizeReceivables(receivablesRaw):null;
  const calendarRaw=readVaultJson(vault,'60-actions/runs/radar-dashboard/calendar/latest.json'),calendar=calendarRaw?sanitizeCalendar(calendarRaw):null;
  const revenueSource=latestRevenuePlan(vault),revenue=revenueSource?sanitizeRevenue(revenueSource.data):null;
  assertPrivateExport([...radars,...(revenue?[revenue]:[]),...(receivables?[{...receivables,items:[]}]:[]),...(calendar?[{...calendar,items:[]}]:[])]);
  const snapshot='/Volumes/data/Dev/nara-bid-finder/.data/dashboard-payload.json';
  const nara=vault===DEFAULT_VAULT?json(snapshot):null;
  const result=await writeEncryptedDashboard(radars,key,out,{nara,revenue,receivables,calendar});
  return {...result,calendar:calendar?{busy:calendar.busy.length,from:calendar.from,to:calendar.to,updatedAt:calendar.updatedAt}:null,receivables:receivables?{records:receivables.records.length,open:receivables.records.filter(r=>['pending','invoiced','blocked','unknown'].includes(r.status)).length}:null,revenue:revenue?{source:revenueSource.path,noteModified:revenue.noteModified,baseDate:revenue.baseDate,items:revenue.items.length,milestones:revenue.milestones.length,actions:revenue.actions.length}:null,nara:nara?{source:snapshot,generatedAt:nara.generatedAt,items:nara.items.length,recommendations:nara.recommendations.length,drafts:nara.items.reduce((n,i)=>n+(i.drafts?.length||0),0)}:null,sources:sources.map(s=>s.path),applicationState:{path:state.path,syncedAt:state.syncedAt,records:state.records.length,userOverrides:state.records.filter(r=>r.source==='dashboard-user').length}};
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  const args=process.argv.slice(2),options={};
  for(let i=0;i<args.length;i+=2){const name={'--vault':'vault','--key-file':'keyFile','--out':'out'}[args[i]];if(!name||!args[i+1])throw Error('Usage: node scripts/dashboard/build.mjs [--vault PATH] [--key-file PATH] [--out PATH]');options[name]=path.resolve(args[i+1]);}
  try{console.log(JSON.stringify(await build(options),null,2));}catch(e){console.error('Dashboard build stopped: '+e.message);process.exitCode=1;}
}
