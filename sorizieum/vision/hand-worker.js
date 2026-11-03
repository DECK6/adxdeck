/* Classic worker keeps MediaPipe's local WASM loader off the render thread. */
importScripts('./vision_bundle.js');
let hand;
onmessage=async({data})=>{
  try{
    if(data.type==='init'){
      const files=await Vision.FilesetResolver.forVisionTasks(new URL('vision/',data.base).href);
      hand=await Vision.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:new URL('models/hand_landmarker.task',data.base).href,delegate:'CPU'},runningMode:'VIDEO',numHands:data.numHands??2,minHandDetectionConfidence:.55,minTrackingConfidence:.5});
      postMessage({type:'ready'});
    }else if(data.type==='frame'){
      try{const result=hand.detectForVideo(data.bitmap,data.time),aspect=data.bitmap.width/data.bitmap.height;
        const hands=result.landmarks.map((lm,i)=>{
          const distance=(a,b)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y);
          return {id:result.handedness[i]?.[0]?.categoryName??String(i),
            point:{x:1-(lm[4].x+lm[8].x)/2,y:(lm[4].y+lm[8].y)/2},
            palm:{x:1-(lm[0].x+lm[5].x+lm[17].x)/3,y:(lm[0].y+lm[5].y+lm[17].y)/3},
            pinch:distance(lm[4],lm[8])/Math.max(.02,distance(lm[5],lm[17]))};
        });
        postMessage({type:'sample',hands});
      }finally{data.bitmap.close();}
    }
  }catch(error){postMessage({type:'error',message:String(error.message??error)});}
};
