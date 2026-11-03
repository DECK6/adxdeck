import {measureHands} from './hand-features.mjs?v=3.4';
export function createHandTracking({onResults,onError,getWrists=()=>({}),maxFps=15,workerFactory=url=>new Worker(url)}={}){
 let session=null,generation=0;
 function stop(){generation++;const s=session;session=null;if(s){clearTimeout(s.timer);s.resolve?.(false);s.worker.terminate();}return Promise.resolve();}
 async function start(){
  if(session)return session.readyPromise;
  const s={token:++generation,busy:false,ready:false,lastAt:-Infinity,lastFrame:-1,worker:workerFactory(new URL('./hand-worker.js?v=3.4',import.meta.url))};session=s;
  s.readyPromise=new Promise(resolve=>{s.resolve=resolve;s.timer=setTimeout(()=>fail(s,'손 추적 모델 로딩 시간 초과'),20000);});
  function fail(s,message){if(session!==s)return;stop();onError?.(message);}
  s.worker.onerror=e=>fail(s,e.message||'손 추적 오류');
  s.worker.onmessage=({data})=>{
   if(session!==s||s.token!==generation)return;
   if(data.type==='ready'){clearTimeout(s.timer);s.ready=true;s.resolve(true);}
   else if(data.type==='sample'){s.busy=false;onResults?.(measureHands(data,s.aspect,s.wrists),data.time);}
   else if(data.type==='error')fail(s,data.message);
  };
  s.worker.postMessage({type:'init'});return s.readyPromise;
 }
 async function feed(video){
  const s=session,now=performance.now();if(!s?.ready||s.busy||video.readyState<2||now-s.lastAt<1000/maxFps||s.lastFrame===video.currentTime)return false;
  s.busy=true;s.lastAt=now;s.lastFrame=video.currentTime;s.aspect=video.videoWidth/video.videoHeight;s.wrists=getWrists();
  try{const bitmap=await createImageBitmap(video);if(session!==s){bitmap.close();return false;}s.worker.postMessage({type:'frame',bitmap,time:now},[bitmap]);return true;}
  catch(e){s.busy=false;if(session===s){await stop();onError?.(String(e));}return false;}
 }
 return {start,feed,stop,get active(){return !!session?.ready;}};
}
