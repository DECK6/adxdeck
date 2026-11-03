/* Separate worker: no camera access, no uploads, transferred input bitmap only. */
importScripts('./vendor/hand/vision_bundle.js');
let hand;
onmessage=async({data})=>{
 try{
  if(data.type==='init'){
   const base=new URL('./vendor/hand/',self.location.href).href;
   const files=await Vision.FilesetResolver.forVisionTasks(base);
   hand=await Vision.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:base+'hand_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.5});
   postMessage({type:'ready'});
  }else if(data.type==='frame'){
   try{const r=hand.detectForVideo(data.bitmap,data.time);postMessage({type:'sample',landmarks:r.landmarks,worldLandmarks:r.worldLandmarks,time:data.time});}
   finally{data.bitmap.close();}
  }
 }catch(e){postMessage({type:'error',message:String(e.message||e)});}
};
