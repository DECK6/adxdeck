import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash,randomBytes} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {encryptDashboard,openCallsAdapter,sanitizeRadar,validateKeyConfig} from './lib.mjs';

export const DEFAULT_VAULT='/Volumes/data/Obsidian/akm';
export const DEFAULT_KEY=path.join(os.homedir(),'.config/dexa-dash/key.json');
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));

export function readKeyConfig(file=DEFAULT_KEY) {
  const st=fs.lstatSync(file);
  if(st.isSymbolicLink())throw Error('Local key must not be a symbolic link');
  if(!st.isFile()||(st.mode&0o077)!==0||st.uid!==process.getuid())throw Error('Local key requires owner-only permissions (0600)');
  return validateKeyConfig(json(file));
}

export function atomicWrite(file,content,mode=0o644) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const temp=file+'.tmp-'+randomBytes(8).toString('hex');
  const fd=fs.openSync(temp,'wx',mode);
  try{fs.writeFileSync(fd,content);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  fs.renameSync(temp,file);
  const dir=fs.openSync(path.dirname(file),'r');try{fs.fsyncSync(dir);}finally{fs.closeSync(dir);}
}

export async function writeEncryptedDashboard(radars,config,out) {
  // Validate and encrypt everything before touching the previous export.
  const envelope=await encryptDashboard(radars,config);
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
  const data=openCallsAdapter(current.state,current.receipt,'');
  const adapterPath=path.join(current.dir,'open-call-radar.v1.json');
  atomicWrite(adapterPath,JSON.stringify(data,null,2)+'\n',0o600);
  return {path:adapterPath,data};
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
  const sources=[latestOpenCalls(vault),findLatestAdapter(path.join(vault,'60-actions/runs/lecture-opportunity-radar'),'lecture-radar.v1.json')];
  const radars=sources.map(s=>sanitizeRadar(s.data));assertPrivateExport(radars);
  const result=await writeEncryptedDashboard(radars,key,out);
  return {...result,sources:sources.map(s=>s.path)};
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  const args=process.argv.slice(2),options={};
  for(let i=0;i<args.length;i+=2){const name={'--vault':'vault','--key-file':'keyFile','--out':'out'}[args[i]];if(!name||!args[i+1])throw Error('Usage: node scripts/dashboard/build.mjs [--vault PATH] [--key-file PATH] [--out PATH]');options[name]=path.resolve(args[i+1]);}
  try{console.log(JSON.stringify(await build(options),null,2));}catch(e){console.error('Dashboard build stopped: '+e.message);process.exitCode=1;}
}
