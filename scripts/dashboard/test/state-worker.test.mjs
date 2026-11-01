import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';
import {deriveSigningKey,signedHeaders} from '../../../dash/state.mjs';
const worker=await import('../worker/index.mjs').catch(()=>null);
// Real SQLite executes the production SQL; only the D1 transport wrapper is local.
class D1{
 constructor(){this.db=new DatabaseSync(':memory:');this.db.exec(fs.readFileSync(new URL('../worker/schema.sql',import.meta.url),'utf8'));}
 prepare(sql){const query={sql,values:[]};query.bind=(...values)=>({...query,values});query.all=async()=>({results:this.db.prepare(sql).all()});return query;}
 async batch(statements){this.db.exec('BEGIN');try{const results=statements.map(s=>({results:this.db.prepare(s.sql).all(...s.values)}));this.db.exec('COMMIT');return results;}catch(error){this.db.exec('ROLLBACK');throw error;}}
}
async function setup(){assert.ok(worker,'state worker missing');const key=await deriveSigningKey(new Uint8Array(32).fill(9));return {key,env:{DB:new D1(),AUTH_KEY:Buffer.from(key).toString('base64'),ALLOWED_ORIGINS:'https://dexa.art'}};}
async function request(ctx,method,value,headersPatch={}){const body=value?JSON.stringify(value):'';return new Request('https://state.example/v1/state',{method,body:body||undefined,headers:{...await signedHeaders(ctx.key,method,'/v1/state',body),origin:'https://dexa.art',...headersPatch}});}
const change={radarId:'lectures',itemId:'one',applicationStatus:'submitted',resultStatus:'awaiting',expectedRevision:0};
test('state API rejects missing authentication and unapproved browser origins',async()=>{
 const ctx=await setup();assert.equal((await worker.default.fetch(new Request('https://state.example/v1/state'),ctx.env)).status,401);
 assert.equal((await worker.default.fetch(await request(ctx,'PUT',change,{origin:'https://untrusted.example'}),ctx.env)).status,403);
 assert.equal(ctx.env.DB.db.prepare('SELECT count(*) AS n FROM application_states').get().n,0);
});
test('submission saves durably with an audit event and is returned on a new read',async()=>{
 const ctx=await setup(),put=await worker.default.fetch(await request(ctx,'PUT',change),ctx.env);assert.equal(put.status,200);
 const row=(await put.json()).record;assert.equal(row.applicationStatus,'submitted');assert.equal(row.resultStatus,'awaiting');assert.equal(row.revision,1);assert.equal(row.source,'dashboard-user');
 const get=await worker.default.fetch(await request(ctx,'GET'),ctx.env);assert.equal((await get.json()).records[0].itemId,'one');assert.equal(get.headers.get('cache-control'),'no-store');
 assert.equal(ctx.env.DB.db.prepare('SELECT count(*) AS n FROM state_events').get().n,1);
});
test('existing verified submissions retain their audit source instead of claiming a user checkbox click',async()=>{
 const ctx=await setup();const response=await worker.default.fetch(await request(ctx,'PUT',{...change,source:'verified-record'}),ctx.env);
 assert.equal(response.status,200);assert.equal((await response.json()).record.source,'verified-record');
 const final=await worker.default.fetch(await request(ctx,'PUT',{...change,source:'verified-record',expectedRevision:1,resultStatus:'not_selected'}),ctx.env);
 assert.equal(final.status,200);assert.equal((await final.json()).record.resultStatus,'not_selected');
});
test('replayed writes and stale revisions cannot overwrite a newer user confirmation',async()=>{
 const ctx=await setup(),req=await request(ctx,'PUT',change);assert.equal((await worker.default.fetch(req.clone(),ctx.env)).status,200);assert.equal((await worker.default.fetch(req,ctx.env)).status,409);
 const next={...change,expectedRevision:1,applicationStatus:'not_applied',resultStatus:null};
 const results=await Promise.all([worker.default.fetch(await request(ctx,'PUT',next),ctx.env),worker.default.fetch(await request(ctx,'PUT',next),ctx.env)]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
 assert.equal(ctx.env.DB.db.prepare('SELECT revision FROM application_states').get().revision,2);assert.equal(ctx.env.DB.db.prepare('SELECT count(*) AS n FROM state_events').get().n,2);
});
test('invalid state and oversized input never become accepted records',async()=>{
 const ctx=await setup();assert.equal((await worker.default.fetch(await request(ctx,'PUT',{...change,resultStatus:'selected'}),ctx.env)).status,400);
 assert.equal((await worker.default.fetch(await request(ctx,'PUT',{...change,itemId:'x'.repeat(3000)}),ctx.env)).status,413);
 assert.equal(ctx.env.DB.db.prepare('SELECT count(*) AS n FROM application_states').get().n,0);
});
