import {verifySignedRequest} from '../../../dash/state.mjs';
const fields="radar_id AS radarId,item_id AS itemId,application_status AS applicationStatus,result_status AS resultStatus,updated_at AS updatedAt,revision,CASE WHEN mutation_id LIKE 'audit:%' THEN 'verified-record' ELSE 'dashboard-user' END AS source";
const runFields="id AS requestId,radar_id AS radarId,status,requested_at AS requestedAt,updated_at AS updatedAt,note";
const RUN_TARGETS=['open-calls','lectures','gangsaya'];
const json=(value,status=200,cors={})=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...cors}});

export default {async fetch(request,env){
 const url=new URL(request.url),origin=request.headers.get('origin');
 const allowed=(env.ALLOWED_ORIGINS||'https://dexa.art').split(',').map(s=>s.trim());
 const cors=origin&&allowed.includes(origin)?{'access-control-allow-origin':origin,vary:'Origin','access-control-allow-headers':'Content-Type,X-Dash-Timestamp,X-Dash-Nonce,X-Dash-Signature','access-control-allow-methods':'GET,PUT,POST,OPTIONS'}:{};
 if(origin&&!allowed.includes(origin))return json({error:'허용되지 않은 출처입니다.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(url.pathname==='/health'&&request.method==='GET')return json({ok:true,version:2},200,cors);
 const route=url.pathname,methods={'/v1/state':['GET','PUT'],'/v1/run':['GET','POST','PUT']}[route];
 if(!methods||!methods.includes(request.method)||url.search)return json({error:'경로를 확인해 주세요.'},404,cors);
 if(Number(request.headers.get('content-length'))>2048)return json({error:'요청이 너무 큽니다.'},413,cors);
 const body=await request.text();if(new TextEncoder().encode(body).length>2048)return json({error:'요청이 너무 큽니다.'},413,cors);
 try{
  const raw=Uint8Array.from(atob(env.AUTH_KEY||''),c=>c.charCodeAt(0));
  if(raw.length!==32||!await verifySignedRequest(raw,request.method,route,body,Object.fromEntries(request.headers)))return json({error:'비밀번호로 다시 열어 주세요.'},401,cors);
  if(route==='/v1/run')return runRoute(request,env,body,cors);
  if(request.method==='GET'){
   const result=await env.DB.prepare(`SELECT ${fields} FROM application_states ORDER BY radar_id,item_id`).all();
   return json({records:result.results},200,cors);
  }
  let value;try{value=JSON.parse(body);}catch{return json({error:'잘못된 요청입니다.'},400,cors);}
  const {radarId,itemId,applicationStatus,resultStatus,expectedRevision}=value||{};
  if(value.source!==undefined&&!['dashboard-user','verified-record'].includes(value.source))return json({error:'상태 출처를 확인해 주세요.'},400,cors);
  const allowedResults=value.source==='verified-record'?['awaiting','selected','not_selected','withdrawn']:['awaiting'];
  // on_hold is the master's own hold from the dashboard; it never carries a result.
  if(!/^[a-z][a-z0-9-]{0,39}$/.test(radarId||'')||typeof itemId!=='string'||!itemId.trim()||itemId.length>120||/[\x00-\x1f]/.test(itemId)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||expectedRevision>1000000||!['submitted','not_applied','on_hold'].includes(applicationStatus)||(applicationStatus==='submitted'?!allowedResults.includes(resultStatus):resultStatus!==null))return json({error:'지원 상태를 확인해 주세요.'},400,cors);
  const nonce=request.headers.get('x-dash-nonce'),mutation=(value.source==='verified-record'?'audit:':'user:')+nonce,at=new Date().toISOString(),revision=expectedRevision+1;
  let results;
  try{
   results=await env.DB.batch([
    env.DB.prepare('INSERT INTO used_nonces(nonce,created_at) VALUES(?,?)').bind(nonce,at),
    env.DB.prepare(`INSERT INTO application_states(radar_id,item_id,application_status,result_status,updated_at,revision,mutation_id)
      SELECT ?,?,?,?,?,?,? WHERE ?=0 OR EXISTS(SELECT 1 FROM application_states WHERE radar_id=? AND item_id=? AND revision=?)
      ON CONFLICT(radar_id,item_id) DO UPDATE SET application_status=excluded.application_status,result_status=excluded.result_status,updated_at=excluded.updated_at,revision=excluded.revision,mutation_id=excluded.mutation_id
      WHERE application_states.revision=? RETURNING ${fields}`).bind(radarId,itemId,applicationStatus,resultStatus,at,revision,mutation,expectedRevision,radarId,itemId,expectedRevision,expectedRevision),
    env.DB.prepare('INSERT INTO state_events SELECT mutation_id,radar_id,item_id,application_status,result_status,updated_at,revision FROM application_states WHERE mutation_id=?').bind(mutation)
   ]);
  }catch(error){if(/UNIQUE|constraint/i.test(String(error.message)))return json({error:'이미 처리한 요청입니다. 상태를 새로 확인해 주세요.'},409,cors);throw error;}
  if(!results[1].results.length)return json({error:'다른 화면에서 상태가 바뀌었습니다. 최신 상태를 확인해 주세요.'},409,cors);
  return json({record:results[1].results[0]},200,cors);
 }catch{return json({error:'상태 저장소를 사용할 수 없습니다.'},503,cors);}
}};

// Manual radar runs: the dashboard asks here, the Worker relays to the T3 webhook, the local
// publisher marks the request done once a newer radar result is published.
async function runRoute(request,env,body,cors){
 if(request.method==='GET'){
  const result=await env.DB.prepare(`SELECT ${runFields} FROM run_requests r WHERE requested_at=(SELECT MAX(requested_at) FROM run_requests WHERE radar_id=r.radar_id) ORDER BY radar_id`).all();
  return json({requests:result.results},200,cors);
 }
 let value;try{value=JSON.parse(body);}catch{return json({error:'잘못된 요청입니다.'},400,cors);}
 const at=new Date().toISOString();
 if(request.method==='PUT'){
  const {requestId,status,note}=value||{};
  if(typeof requestId!=='string'||!/^[a-f0-9-]{36}$/.test(requestId)||!['started','done','failed'].includes(status)||(note!=null&&(typeof note!=='string'||note.length>300)))return json({error:'실행 상태를 확인해 주세요.'},400,cors);
  const row=await env.DB.prepare(`UPDATE run_requests SET status=?,note=?,updated_at=? WHERE id=? RETURNING ${runFields}`).bind(status,note??null,at,requestId).first();
  if(!row)return json({error:'요청을 찾지 못했습니다.'},404,cors);
  return json({request:row},200,cors);
 }
 const {radarId}=value||{};
 if(!RUN_TARGETS.includes(radarId))return json({error:'실행할 레이더를 확인해 주세요.'},400,cors);
 const since=new Date(Date.now()-45*60000).toISOString();
 const open=await env.DB.prepare(`SELECT ${runFields} FROM run_requests WHERE radar_id=? AND status IN ('pending','started') AND requested_at>? ORDER BY requested_at DESC LIMIT 1`).bind(radarId,since).first();
 if(open)return json({error:'이미 요청한 실행이 진행 중입니다.',request:open},409,cors);
 const id=crypto.randomUUID();
 await env.DB.prepare('INSERT INTO run_requests(id,radar_id,status,requested_at,updated_at,note) VALUES(?,?,?,?,?,?)').bind(id,radarId,'pending',at,at,null).run();
 let status='failed',note='웹훅 미설정';
 if(env.RUN_WEBHOOK_URL){
  try{
   const relay=await fetch(env.RUN_WEBHOOK_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({radarId,requestId:id,requestedAt:at}),signal:AbortSignal.timeout(8000)});
   if(relay.ok){status='started';note=null;}else note='relay '+relay.status;
  }catch(error){note='relay '+String(error?.name||'error').slice(0,40);}
 }
 const row=await env.DB.prepare(`UPDATE run_requests SET status=?,note=?,updated_at=? WHERE id=? RETURNING ${runFields}`).bind(status,note,new Date().toISOString(),id).first();
 return json(status==='started'?{request:row}:{error:'레이더 대화에 전달하지 못했습니다.',request:row},status==='started'?200:502,cors);
}
