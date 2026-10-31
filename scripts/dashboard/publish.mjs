import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {build,ROOT,DEFAULT_VAULT,atomicWrite} from './build.mjs';

const args=process.argv.slice(2);
if(args.some(a=>!['--check'].includes(a)))throw Error('Usage: python3 scripts/dashboard/publish.py [--check]');
const check=args.includes('--check');
const now=new Date().toISOString(),id=now.replace(/[:.]/g,'-');
const run=path.join(DEFAULT_VAULT,'60-actions/runs/radar-dashboard',id);
const receiptFile=path.join(run,'receipt.json');
const live=path.join(path.dirname(ROOT),'radar-dash-live');
const git=(cwd,...argv)=>execFileSync('git',argv,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
let evidence=[];
try{
  let target=ROOT;
  if(!check){
    if(git(ROOT,'rev-parse','--show-toplevel')!==ROOT)throw Error('Unexpected repository scope');
    git(ROOT,'fetch','origin','main');
    if(!fs.existsSync(live))git(ROOT,'worktree','add','-b','publish/radar-dashboard',live,'origin/main');
    if(git(live,'rev-parse','--show-toplevel')!==live||git(live,'branch','--show-current')!=='publish/radar-dashboard')throw Error('Unexpected publication worktree');
    const dirty=git(live,'status','--porcelain=v1','-z').split('\0').filter(Boolean);
    if(dirty.some(line=>line.slice(3)!=='dash/data.enc.json'))throw Error('Publication worktree contains unrelated changes');
    // A failed prior push can be retried only when its pending commits change ciphertext alone.
    const pending=git(live,'diff','--name-only','origin/main...HEAD').split('\n').filter(Boolean);
    if(pending.some(f=>f!=='dash/data.enc.json'))throw Error('Publication worktree has unrelated unpushed commits');
    git(live,'merge','--ff-only','origin/main');target=live;
  }
  const out=check?path.join(run,'data.enc.json'):path.join(target,'dash/data.enc.json');
  const result=await build({out});evidence.push(result);
  if(!check){
    git(target,'add','--','dash/data.enc.json');
    if(git(target,'diff','--cached','--name-only'))git(target,'commit','-m','data: refresh encrypted opportunity radars');
    git(target,'push','origin','HEAD:main');
    const commit=git(target,'rev-parse','HEAD');
    const remote=git(target,'ls-remote','origin','refs/heads/main').split(/\s/)[0];
    if(commit!==remote)throw Error('Remote revision changed; verify the published ciphertext before retrying');
    evidence.push({commit,remote,sha256:hash(out),url:'https://dexa.art/dash/'});
  }
  const receipt={occurrence_id:'radar-dashboard:'+now,purpose_status:check?'VERIFIED':'PUBLISHED',mode:check?'build-check':'publish',verified_at:new Date().toISOString(),evidence,limits:check?['Local build only; no remote publication']:['Git push verified; Pages propagation and browser unlock are separate checks']};
  atomicWrite(receiptFile,JSON.stringify(receipt,null,2)+'\n',0o600);
  const readback=JSON.parse(fs.readFileSync(receiptFile,'utf8'));
  console.log(JSON.stringify({purpose_status:readback.purpose_status,receipt:receiptFile,evidence},null,2));
}catch(error){
  const message=String(error.message).replace(/https?:\/\/[^\s@]+@/g,'https://[redacted]@');
  atomicWrite(receiptFile,JSON.stringify({occurrence_id:'radar-dashboard:'+now,purpose_status:'REPAIR_PENDING',failed_at:new Date().toISOString(),evidence,error:message},null,2)+'\n',0o600);
  console.error(JSON.stringify({purpose_status:'REPAIR_PENDING',receipt:receiptFile,error:message}));process.exitCode=1;
}
