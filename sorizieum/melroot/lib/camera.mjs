export function createCamera(getMedia=constraints=>navigator.mediaDevices.getUserMedia(constraints)) {
 let token=0,stream=null,pending=null;
 return {
  start(){
   if(stream)return Promise.resolve(stream);
   if(pending)return pending;
   const id=++token;
   const request=(async()=>{const s=await getMedia({audio:false,video:{width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30},facingMode:'user'}});
    if(id!==token){s.getTracks().forEach(t=>t.stop());return null;}
    stream=s;return s;
   })();
   pending=request.finally(()=>{if(id===token)pending=null;});return pending;
  },
  stop(){token++;pending=null;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}},
  get active(){return !!stream;}
 };
}
