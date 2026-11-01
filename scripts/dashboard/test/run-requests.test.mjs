import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';
import {deriveSigningKey,signedHeaders} from '../../../dash/state.mjs';
import {completedRequests} from '../run-requests.mjs';
const worker=await import('../worker/index.mjs');
class D1{
 constructor(){this.db=new DatabaseSync(':memory:');this.db.exec(fs.readFileSync(new URL('../worker/schema.sql',import.meta.url),'utf8'));}
 prepare(sql){const make=values=>({sql,values,bind:(...v)=>make(v),all:async()=>({results:this.db.prepare(sql).all(...values)}),first:async()=>this.db.prepare(sql).get(...values)??null,run:async()=>{this.db.prepare(sql).run(...values);return {success:true};}});return make([]);}
 async batch(statements){this.db.exec('BEGIN');try{const results=statements.map(s=>({results:this.db.prepare(s.sql).all(...s.values)}));this.db.exec('COMMIT');return results;}catch(error){this.db.exec('ROLLBACK');throw error;}}
}
async function setup(){const key=await deriveSigningKey(new Uint8Array(32).fill(5));return {key,env:{DB:new D1(),AUTH_KEY:Buffer.from(key).toString('base64'),ALLOWED_ORIGINS:'https://dexa.art',RUN_WEBHOOKS:JSON.stringify({'open-calls':'https://relay.example/hook',lectures:'https://relay.example/hook',gangsaya:'https://relay.example/hook',grants:'https://relay.example/hook',commissions:'https://relay.example/hook'})}};}
async function request(ctx,method,path,value){const body=value?JSON.stringify(value):'';return new Request('https://state.example'+path,{method,body:body||undefined,headers:{...await signedHeaders(ctx.key,method,path,body),origin:'https://dexa.art'}});}
test('a run request is stored, relayed to the T3 webhook once, and deduplicated while in flight',async()=>{
 const ctx=await setup(),calls=[];const realFetch=globalThis.fetch;globalThis.fetch=async(url,init)=>{calls.push({url,body:JSON.parse(init.body)});return new Response('ok',{status:200});};
 try{
  const first=await worker.default.fetch(await request(ctx,'POST','/v1/run',{radarId:'lectures'}),ctx.env);assert.equal(first.status,200);
  const row=(await first.json()).request;assert.equal(row.status,'started');assert.equal(row.radarId,'lectures');assert.equal(calls.length,1);assert.equal(calls[0].body.requestId,row.requestId);
  const again=await worker.default.fetch(await request(ctx,'POST','/v1/run',{radarId:'lectures'}),ctx.env);assert.equal(again.status,409);assert.equal(calls.length,1);
  const other=await worker.default.fetch(await request(ctx,'POST','/v1/run',{radarId:'gangsaya'}),ctx.env);assert.equal(other.status,200);
  const list=await worker.default.fetch(await request(ctx,'GET','/v1/run'),ctx.env);assert.deepEqual((await (list.json())).requests.map(r=>r.radarId).sort(),['gangsaya','lectures']);
  const done=await worker.default.fetch(await request(ctx,'PUT','/v1/run',{requestId:row.requestId,status:'done',note:'ok'}),ctx.env);assert.equal((await done.json()).request.status,'done');
  assert.equal((await worker.default.fetch(await request(ctx,'POST','/v1/run',{radarId:'bogus'}),ctx.env)).status,400);
  assert.equal((await worker.default.fetch(new Request('https://state.example/v1/run',{method:'POST',body:'{}'}),ctx.env)).status,401);
 }finally{globalThis.fetch=realFetch;}
});
test('a relay failure is recorded instead of pretending the radar started',async()=>{
 const ctx=await setup();const realFetch=globalThis.fetch;globalThis.fetch=async()=>new Response('no',{status:500});
 try{const r=await worker.default.fetch(await request(ctx,'POST','/v1/run',{radarId:'open-calls'}),ctx.env);assert.equal(r.status,502);const body=await r.json();assert.equal(body.request.status,'failed');assert.match(body.request.note,/relay 500/);
  const retry=await worker.default.fetch(await request(ctx,'POST','/v1/run',{radarId:'open-calls'}),ctx.env);assert.equal(retry.status,502);}
 finally{globalThis.fetch=realFetch;}
});
test('the master hold is accepted by the state API without a result status',async()=>{
 const ctx=await setup();
 const ok=await worker.default.fetch(await request(ctx,'PUT','/v1/state',{radarId:'lectures',itemId:'one',applicationStatus:'on_hold',resultStatus:null,expectedRevision:0}),ctx.env);assert.equal(ok.status,200);assert.equal((await ok.json()).record.applicationStatus,'on_hold');
 const bad=await worker.default.fetch(await request(ctx,'PUT','/v1/state',{radarId:'lectures',itemId:'two',applicationStatus:'on_hold',resultStatus:'awaiting',expectedRevision:0}),ctx.env);assert.equal(bad.status,400);
});
test('only requests older than a newer published radar result are marked complete',()=>{
 const requests=[{requestId:'a',radarId:'lectures',status:'started',requestedAt:'2026-11-01T03:00:00Z'},{requestId:'b',radarId:'gangsaya',status:'started',requestedAt:'2026-11-01T05:00:00Z'},{requestId:'c',radarId:'open-calls',status:'done',requestedAt:'2026-11-01T01:00:00Z'}];
 const radars=[{id:'lectures',updatedAt:'2026-11-01T04:00:00Z'},{id:'open-calls',updatedAt:'2026-11-01T06:00:00Z'}];
 assert.deepEqual(completedRequests(requests,radars,new Date('2026-11-01T06:30:00Z')).map(r=>r.requestId),['a']);
});
