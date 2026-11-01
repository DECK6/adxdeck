import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {makeKeyConfig} from '../lib.mjs';
import {decryptDashboard} from '../../../dash/core.mjs';
import {spawnSync} from 'node:child_process';
const build=await import('../build.mjs').catch(()=>null);
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'dexa-dash-test-'));
const adapter=id=>({schemaVersion:'radar.v1',id,title:id,updatedAt:'2026-10-31T22:00:00+09:00',occurrenceId:id+':1',runStatus:'HOLD',summary:'Test',items:[]});

test('private key files with broad permissions or symlinks are rejected',async()=>{
  assert.ok(build,'private build CLI is not implemented');
  const dir=temp(),key=path.join(dir,'key.json');fs.writeFileSync(key,JSON.stringify(await makeKeyConfig('fixture-private-file')), {mode:0o600});
  assert.equal(build.readKeyConfig(key).v,1);
  fs.chmodSync(key,0o644);assert.throws(()=>build.readKeyConfig(key),/permission|0600/i);
  fs.chmodSync(key,0o600);fs.symlinkSync(key,path.join(dir,'link.json'));assert.throws(()=>build.readKeyConfig(path.join(dir,'link.json')),/symbolic|symlink/i);
});

test('invalid input never replaces the last valid encrypted export',async()=>{
  assert.ok(build,'atomic dashboard exporter is not implemented');
  const dir=temp(),out=path.join(dir,'data.enc.json'),cfg=await makeKeyConfig('fixture-atomic-file');
  await build.writeEncryptedDashboard([adapter('open-calls'),adapter('lectures')],cfg,out);
  const before=fs.readFileSync(out,'utf8');
  await assert.rejects(build.writeEncryptedDashboard([{...adapter('open-calls'),runStatus:'INVALID'}],cfg,out));
  assert.equal(fs.readFileSync(out,'utf8'),before);
  const decoded=await decryptDashboard(JSON.parse(before),'fixture-atomic-file');assert.equal(decoded.radars.length,2);
  assert.deepEqual(fs.readdirSync(dir),['data.enc.json']);
});

test('latest adapter selection uses actual update time, not directory or lexical filename order',()=>{
  assert.ok(build,'latest adapter discovery is not implemented');
  const dir=temp();
  for(const [folder,at]of [['zzz','2026-10-30T12:00:00Z'],['aaa','2026-10-31T12:00:00Z']]){fs.mkdirSync(path.join(dir,folder));fs.writeFileSync(path.join(dir,folder,'lecture-radar.v1.json'),JSON.stringify({...adapter('lectures'),updatedAt:at}));}
  assert.equal(build.findLatestAdapter(dir,'lecture-radar.v1.json').data.updatedAt,'2026-10-31T12:00:00Z');
});

test('missing local keys and private source details fail before a public export is created',async()=>{
 const dir=temp(),out=path.join(dir,'data.enc.json');
 await assert.rejects(build.build({keyFile:path.join(dir,'missing.json'),out}),/ENOENT/);
 assert.equal(fs.existsSync(out),false);
 for(const patch of [{summary:'/Users/example/private.md'},{summary:'private@example.org'},{items:[{id:'i',title:'i',status:'hold',applicationStatus:'unknown',officialUrl:'https://example.org/?access_token=fixture'}]}])assert.throws(()=>build.assertPrivateExport([{...adapter('lectures'),...patch}]),/Private|Authentication/);
 assert.doesNotThrow(()=>build.assertPrivateExport([{...adapter('lectures'),items:[{officialUrl:'https://example.org/board?code=notice'}]}]));
});

test('the real build CLI initializes state sync and writes a decryptable export without an import deadlock',async()=>{
 const dir=temp(),vault=path.join(dir,'vault'),key=path.join(dir,'key.json'),out=path.join(dir,'data.enc.json'),preload=path.join(dir,'transport.mjs');
 fs.writeFileSync(key,JSON.stringify(await makeKeyConfig('fixture-cli-cycle')),{mode:0o600});
 const calls=path.join(vault,'60-actions/runs/media-art-open-call-radar/one'),lectures=path.join(vault,'60-actions/runs/lecture-opportunity-radar/one');fs.mkdirSync(calls,{recursive:true});fs.mkdirSync(lectures,{recursive:true});
 for(const [file,data] of Object.entries({'candidate-state.json':{occurrence_id:'one',generated_at:'2026-11-01T00:00:00Z',candidates:[]},'checkpoint.json':{occurrence_id:'one',status:'complete'},'receipt.json':{occurrence_id:'one',purpose_status:'VERIFIED'}}))fs.writeFileSync(path.join(calls,file),JSON.stringify(data));
 fs.writeFileSync(path.join(lectures,'lecture-radar.v1.json'),JSON.stringify(adapter('lectures')));
 fs.writeFileSync(preload,'globalThis.fetch=async()=>new Response(JSON.stringify({records:[]}));');
 const result=spawnSync(process.execPath,['--import',preload,'scripts/dashboard/build.mjs','--vault',vault,'--key-file',key,'--out',out],{cwd:new URL('../../../',import.meta.url),encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,result.stderr);assert.equal((await decryptDashboard(JSON.parse(fs.readFileSync(out)),'fixture-cli-cycle')).radars.length,2);
});
