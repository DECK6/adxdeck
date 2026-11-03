importScripts('./assets/vision_bundle.js');
const {FilesetResolver,PoseLandmarker}=Vision;
let detector;
self.onmessage = async ({data}) => {
 if (data.type === 'init') {
  try {
   const files = await FilesetResolver.forVisionTasks(new URL('./assets/wasm',self.location.href).href);
   detector = await PoseLandmarker.createFromOptions(files, {
    baseOptions: {modelAssetPath:new URL('./assets/pose_landmarker_lite.task',self.location.href).href,delegate:'CPU'},
    runningMode:'VIDEO',numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5
   });
   self.postMessage({type:'ready'});
  } catch(error) { self.postMessage({type:'error',message:error.message}); }
 }
 if(data.type === 'frame') {
  try {
   if(!detector) throw new Error('Pose detector is not initialized');
   const result=detector.detectForVideo(data.frame,data.time);
   self.postMessage({type:'pose',landmarks:result.landmarks[0]||null});
  } catch(error) {self.postMessage({type:'error',message:error.message});}
  finally {data.frame.close();}
 }
};
