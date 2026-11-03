/* Classic worker keeps MediaPipe's local WASM loader off the render thread. */
importScripts('./vision_bundle.js');
let hand,segmenter;
onmessage=async({data})=>{
  try{
    if(data.type==='init'){
      const files=await Vision.FilesetResolver.forVisionTasks(new URL('vision/',data.base).href);
      hand=await Vision.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:new URL('models/hand_landmarker.task',data.base).href,delegate:'CPU'},runningMode:'VIDEO',numHands:data.numHands??2,minHandDetectionConfidence:.55,minTrackingConfidence:.5});
      try{
        segmenter=await Vision.ImageSegmenter.createFromOptions(files,{baseOptions:{modelAssetPath:new URL('models/selfie_segmenter_landscape.tflite',data.base).href,delegate:'CPU'},runningMode:'VIDEO',outputConfidenceMasks:true,outputCategoryMask:false});
      }catch{postMessage({type:'warning',message:'실루엣을 준비하지 못했습니다. 손으로 선을 그릴 수 있으며, 새로 고침하면 다시 준비합니다.'});}
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
        let silhouette;
        if(segmenter){
          segmenter.segmentForVideo(data.bitmap,data.time,result=>{
            // Some binary models expose just the foreground confidence channel.
            const mask=result.confidenceMasks[result.confidenceMasks.length===1?0:1];
            const values=mask.getAsFloat32Array(),pixels=new Uint8Array(values.length);
            for(let i=0;i<values.length;i++)pixels[i]=Math.round(Math.max(0,Math.min(1,values[i]))*255);
            silhouette={width:mask.width,height:mask.height,pixels};
          });
        }
        postMessage({type:'sample',hands,silhouette},silhouette?[silhouette.pixels.buffer]:[]);
      }finally{data.bitmap.close();}
    }
  }catch(error){postMessage({type:'error',message:String(error.message??error)});}
};
