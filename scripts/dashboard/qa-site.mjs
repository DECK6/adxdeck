// Local browser-QA site: serves a copy of dash/ with the current vault data encrypted under a
// synthetic password, plus a same-origin mock of the state API seeded from the synced ledger.
// Never publishes and never touches the production key or ciphertext.
//   node scripts/dashboard/qa-site.mjs --password '<fixture>' [--port 8765] [--out DIR]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {makeKeyConfig} from './lib.mjs';
import {latestRevenuePlan,sanitizeRevenue} from './revenue.mjs';
import {writeEncryptedDashboard,latestOpenCalls,findLatestAdapter,assertPrivateExport,DEFAULT_VAULT,ROOT} from './build.mjs';
import {applyState} from '../../dash/state.mjs';

const args=process.argv.slice(2),opt=(name,fallback)=>{const i=args.indexOf('--'+name);return i>=0&&args[i+1]?args[i+1]:fallback;};
const password=opt('password',''),port=Number(opt('port','8765')),out=opt('out',fs.mkdtempSync(path.join(os.tmpdir(),'dexa-dash-qa-')));
if(password.length<8)throw Error('Usage: node scripts/dashboard/qa-site.mjs --password <fixture, 8+ chars> [--port N] [--out DIR]');
const vault=DEFAULT_VAULT,json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const state=json(path.join(vault,'60-actions/runs/radar-dashboard/application-state/latest.json'));
let records=state.records,requests=[];
const sources=[latestOpenCalls(vault),findLatestAdapter(path.join(vault,'60-actions/runs/lecture-opportunity-radar'),'lecture-radar.v1.json')];
const radars=sources.map(s=>applyState(s.data,records));
const revenueSource=latestRevenuePlan(vault),revenue=revenueSource?sanitizeRevenue(revenueSource.data):null;
assertPrivateExport([...radars,...(revenue?[revenue]:[])]);
const naraFile='/Volumes/data/Dev/nara-bid-finder/.data/dashboard-payload.json',nara=fs.existsSync(naraFile)?json(naraFile):null;
const site=path.join(out,'dash');fs.mkdirSync(site,{recursive:true});
for(const name of fs.readdirSync(path.join(ROOT,'dash'))){const src=path.join(ROOT,'dash',name);if(fs.statSync(src).isFile()&&name!=='data.enc.json')fs.copyFileSync(src,path.join(site,name));}
fs.writeFileSync(path.join(site,'config.json'),JSON.stringify({stateApiUrl:`http://127.0.0.1:${port}`}));
const result=await writeEncryptedDashboard(radars,await makeKeyConfig(password),path.join(site,'data.enc.json'),{nara,revenue});
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const send=(res,status,body,type='application/json')=>{res.writeHead(status,{'content-type':type,'cache-control':'no-store'});res.end(body);};
http.createServer((req,res)=>{
 const url=new URL(req.url,`http://127.0.0.1:${port}`);
 if(url.pathname==='/v1/run'){
  if(req.method==='GET')return send(res,200,JSON.stringify({requests}));
  let body='';req.on('data',c=>body+=c);req.on('end',()=>{const v=JSON.parse(body);const at=new Date().toISOString();
   if(req.method==='PUT'){const r=requests.find(x=>x.requestId===v.requestId);if(!r)return send(res,404,'{}');Object.assign(r,{status:v.status,note:v.note??null,updatedAt:at});return send(res,200,JSON.stringify({request:r}));}
   if(requests.some(r=>r.radarId===v.radarId&&['pending','started'].includes(r.status)))return send(res,409,JSON.stringify({error:'이미 요청한 실행이 진행 중입니다.'}));
   const r={requestId:crypto.randomUUID(),radarId:v.radarId,status:'started',requestedAt:at,updatedAt:at,note:null};requests=[...requests.filter(x=>x.radarId!==v.radarId),r];send(res,200,JSON.stringify({request:r}));});return;
 }
 if(url.pathname==='/v1/state'){
  if(req.method==='GET')return send(res,200,JSON.stringify({records}));
  let body='';req.on('data',c=>body+=c);req.on('end',()=>{
   const v=JSON.parse(body),prev=records.find(r=>r.radarId===v.radarId&&r.itemId===v.itemId);
   if((prev?.revision||0)!==v.expectedRevision)return send(res,409,JSON.stringify({error:'conflict'}));
   const record={radarId:v.radarId,itemId:v.itemId,applicationStatus:v.applicationStatus,resultStatus:v.resultStatus,updatedAt:new Date().toISOString(),revision:v.expectedRevision+1,source:'dashboard-user'};
   records=[...records.filter(r=>r!==prev),record];send(res,200,JSON.stringify({record}));
  });return;
 }
 let file=path.join(out,decodeURIComponent(url.pathname));if(url.pathname.endsWith('/'))file=path.join(file,'index.html');
 if(!file.startsWith(out)||!fs.existsSync(file)||fs.statSync(file).isDirectory())return send(res,404,'not found','text/plain');
 send(res,200,fs.readFileSync(file),types[path.extname(file)]||'application/octet-stream');
}).listen(port,'127.0.0.1',()=>console.log(JSON.stringify({url:`http://127.0.0.1:${port}/dash/`,site,radars:result.radars,revenue:revenue?{items:revenue.items.length,milestones:revenue.milestones.length}:null,nara:nara?nara.items.length:null,records:records.length})));
