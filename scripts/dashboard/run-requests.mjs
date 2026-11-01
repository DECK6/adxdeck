import {deriveSigningKey,stateRequest} from '../../dash/state.mjs';
// A dashboard run request is done once the radar it targeted has a newer published updatedAt.
export const ADAPTER_FOR={'open-calls':'open-calls',lectures:'lectures',gangsaya:'lectures',grants:'grants',commissions:'commissions'};
export function completedRequests(requests,radars,now=new Date()){
 return requests.filter(r=>['pending','started'].includes(r.status)).filter(r=>{const radar=radars.find(x=>x.id===ADAPTER_FOR[r.radarId]);return radar&&Date.parse(radar.updatedAt)>Date.parse(r.requestedAt)&&Date.parse(r.requestedAt)<=now.getTime();});
}
export async function markRunsPublished({apiUrl,keyConfig,radars}){
 const key=await deriveSigningKey(Buffer.from(keyConfig.key,'base64'));
 try{
  const {requests=[]}=await stateRequest(apiUrl,key,'GET',undefined,'/v1/run');
  const done=[];
  for(const r of completedRequests(requests,radars)){await stateRequest(apiUrl,key,'PUT',{requestId:r.requestId,status:'done',note:'대시보드 갱신 완료'},'/v1/run');done.push(r.requestId);}
  return done;
 }finally{key.fill(0);}
}
