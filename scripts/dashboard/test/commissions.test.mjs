import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {makeKeyConfig} from '../lib.mjs';
import {applyReplies} from '../ledgers.mjs';
import {assertSingleHome} from '../build.mjs';
import {decryptDashboard} from '../../../dash/core.mjs';

const radar=(id,items)=>({schemaVersion:'radar.v1',id,title:id,updatedAt:'2026-11-01T08:00:00Z',occurrenceId:id+':1',runStatus:'HOLD',summary:'',limitations:[],items});
const item=(id,extra={})=>({id,title:id,status:'conditional',applicationStatus:'not_applied',officialUrl:'https://example.org/'+id,...extra});

test('an item moved from open calls to commissions keeps its reply and final result',()=>{
 const ledger={schemaVersion:'radar-reply-ledger.v1',records:[{radarId:'open-calls',itemId:'led-art-onboarding',replyStatus:'selected',replyAt:'2026-10-29T02:11:37.130Z',replyNote:'입점 안내'}]};
 const [moved]=applyReplies([radar('commissions',[item('led-art-onboarding',{applicationStatus:'submitted',resultStatus:'awaiting'})])],ledger);
 assert.equal(moved.items[0].replyStatus,'selected');assert.equal(moved.items[0].resultStatus,'selected');
 const [other]=applyReplies([radar('lectures',[item('led-art-onboarding')])],ledger);
 assert.equal(other.items[0].replyStatus,undefined);
});

test('one opportunity cannot be listed in both open calls and commissions',()=>{
 assert.throws(()=>assertSingleHome([radar('open-calls',[item('niio-curated')]),radar('commissions',[item('niio-curated')])]),/niio-curated/);
 assert.doesNotThrow(()=>assertSingleHome([radar('open-calls',[item('busan')]),radar('commissions',[item('niio-curated')])]));
 assert.doesNotThrow(()=>assertSingleHome([radar('open-calls',[item('a')]),radar('lectures',[item('a')])]));
});

test('the real build CLI adds the commissions tab from its own run root',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dexa-dash-commissions-')),vault=path.join(dir,'vault'),key=path.join(dir,'key.json'),out=path.join(dir,'data.enc.json'),preload=path.join(dir,'transport.mjs');
 fs.writeFileSync(key,JSON.stringify(await makeKeyConfig('fixture-commissions')),{mode:0o600});
 const calls=path.join(vault,'60-actions/runs/media-art-open-call-radar/one'),lectures=path.join(vault,'60-actions/runs/lecture-opportunity-radar/one'),commissions=path.join(vault,'60-actions/runs/commission-opportunity-radar/one');
 for(const d of [calls,lectures,commissions])fs.mkdirSync(d,{recursive:true});
 for(const [file,data] of Object.entries({'candidate-state.json':{occurrence_id:'one',generated_at:'2026-11-01T00:00:00Z',candidates:[]},'checkpoint.json':{occurrence_id:'one',status:'complete'},'receipt.json':{occurrence_id:'one',purpose_status:'VERIFIED'}}))fs.writeFileSync(path.join(calls,file),JSON.stringify(data));
 fs.writeFileSync(path.join(lectures,'lecture-radar.v1.json'),JSON.stringify(radar('lectures',[])));
 fs.writeFileSync(path.join(commissions,'commission-radar.v1.json'),JSON.stringify({...radar('commissions',[item('api-job',{track:'개발 의뢰'})]),title:'의뢰·입점'}));
 fs.writeFileSync(preload,'globalThis.fetch=async()=>new Response(JSON.stringify({records:[]}));');
 const result=spawnSync(process.execPath,['--import',preload,'scripts/dashboard/build.mjs','--vault',vault,'--key-file',key,'--out',out],{cwd:new URL('../../../',import.meta.url),encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,result.stderr);
 const plain=await decryptDashboard(JSON.parse(fs.readFileSync(out)),'fixture-commissions');
 const tab=plain.radars.find(r=>r.id==='commissions');assert.equal(tab.title,'의뢰·입점');assert.equal(tab.items[0].track,'개발 의뢰');
});

test('a manual commissions run is marked done once the commissions radar publishes newer data',async()=>{
 const {completedRequests}=await import('../run-requests.mjs');
 const worker=fs.readFileSync(new URL('../worker/index.mjs',import.meta.url),'utf8');
 assert.match(worker,/RUN_TARGETS=\[[^\]]*'commissions'/);
 const req={requestId:'r1',radarId:'commissions',status:'started',requestedAt:'2026-11-01T07:00:00Z'};
 assert.deepEqual(completedRequests([req],[radar('commissions',[])],new Date('2026-11-01T08:10:00Z')).map(r=>r.requestId),['r1']);
});
