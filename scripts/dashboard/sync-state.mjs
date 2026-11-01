import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {deriveSigningKey,stateRequest} from '../../dash/state.mjs';
import {readKeyConfig,DEFAULT_VAULT,ROOT,atomicWrite} from './io.mjs';

export function validateRecords(records){
 if(!Array.isArray(records))throw Error('Invalid application state list');
 const ids=new Set();
 for(const r of records){
  const id=r.radarId+':'+r.itemId;
  const results=r.source==='verified-record'?['awaiting','selected','not_selected','withdrawn']:['awaiting'];
  if(!['verified-record','dashboard-user'].includes(r.source)||!/^[a-z][a-z0-9-]{0,39}$/.test(r.radarId)||typeof r.itemId!=='string'||!r.itemId||r.itemId.length>120||ids.has(id)||!['submitted','not_applied','on_hold'].includes(r.applicationStatus)||(r.applicationStatus==='submitted'?!results.includes(r.resultStatus):r.resultStatus!==null)||!Number.isSafeInteger(r.revision)||r.revision<1||!Number.isFinite(Date.parse(r.updatedAt)))throw Error('Invalid application state record');ids.add(id);
 }
 return records.map(r=>({radarId:r.radarId,itemId:r.itemId,applicationStatus:r.applicationStatus,resultStatus:r.resultStatus,updatedAt:r.updatedAt,revision:r.revision,source:r.source==='verified-record'?'verified-record':'dashboard-user'}));
}
export async function syncState({vault=DEFAULT_VAULT,keyConfig=readKeyConfig(),apiUrl}={}){
 apiUrl??=JSON.parse(fs.readFileSync(path.join(ROOT,'dash/config.json'),'utf8')).stateApiUrl;
 const key=await deriveSigningKey(Buffer.from(keyConfig.key,'base64'));
 let response;try{response=await stateRequest(apiUrl,key);}finally{key.fill(0);}
 const records=validateRecords(response.records),data={schemaVersion:'radar-application-state.v1',syncedAt:new Date().toISOString(),records};
 const file=path.join(vault,'60-actions/runs/radar-dashboard/application-state/latest.json');atomicWrite(file,JSON.stringify(data,null,2)+'\n',0o600);
 const readback=JSON.parse(fs.readFileSync(file,'utf8'));if(readback.syncedAt!==data.syncedAt)throw Error('Application state readback mismatch');
 return {path:file,...data};
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 try{const result=await syncState();console.log(JSON.stringify({purpose_status:'VERIFIED',path:result.path,syncedAt:result.syncedAt,records:result.records.length},null,2));}catch(e){console.error('Application sync stopped: '+e.message);process.exitCode=1;}
}
