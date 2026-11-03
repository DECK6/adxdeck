import {createCamera} from './camera.mjs?v=3.4';import {createMotion} from './motion.mjs?v=3.6';import {createRenderer} from './renderer.mjs?v=3.6';
import {createHandTracking} from './hand-tracking.mjs?v=3.4';
const $=id=>document.getElementById(id),video=$('camera'),button=$('camera-toggle'),status=$('status'),motion=createMotion(),camera=createCamera();
let token=0,session=null,view=null,ready=false,active=false,lastStatus=0,calibrationTimer=0;
function say(s){status.textContent=s;}
function modeInstruction(){return motion.mode==='full'?'머리부터 발끝까지 보이도록 한 걸음 물러서 주세요.':'얼굴과 양팔이 화면에 보이도록 서 주세요.';}
function setMode(mode){motion.setMode(mode);view?.setMode(mode);$('mode-upper').setAttribute('aria-pressed',String(mode==='upper'));$('mode-full').setAttribute('aria-pressed',String(mode==='full'));$('camera-panel').dataset.mode=mode;$('instruction').innerHTML=mode==='full'?'머리부터 발끝까지 보이도록 서 주세요.<br>온몸을 움직여 작은 숲을 키워 보세요.':'얼굴과 양팔이 보이도록 서 주세요.<br>몸과 손을 움직이면 주변에 식물이 자라나요.';say(modeInstruction());}
$('mode-upper').addEventListener('click',()=>setMode('upper'));$('mode-full').addEventListener('click',()=>setMode('full'));
function closeFace(s){if(!s||s.closing)return;s.closing=true;Promise.resolve(s.pending).catch(()=>{}).then(()=>s.face?.close()).catch(()=>{});}
function stop(message='카메라가 꺼져 있습니다. 편하게 감상해 주세요.'){
 token++;active=false;const s=session;session=null;camera.stop();if(s){s.stopped=true;s.body?.stop();s.hands?.stop();closeFace(s);}clearTimeout(calibrationTimer);video.pause();video.srcObject=null;motion.setCamera(false);$('camera-panel').hidden=true;$('recenter').hidden=true;$('camera-label').textContent='카메라 켜기';button.disabled=!ready;button.setAttribute('aria-pressed','false');say(message);
}
async function start(){
 const id=++token;const s=session={stopped:false,face:null,body:null,busy:false,lastFaceFrame:-1,lastFaceAt:-Infinity,lastSeen:-Infinity,pending:null,calibrating:false};
 $('camera-label').textContent='준비 중 · 취소';say('카메라 권한을 허용해 주세요.');motion.setCamera(true);
 try{
  const stream=await camera.start();if(id!==token||!stream)return;video.srcObject=stream;await video.play();if(id!==token)return;
  stream.getVideoTracks().forEach(t=>t.addEventListener('ended',()=>{if(id===token)stop('카메라 연결이 종료되었습니다. 다시 켜 주세요.');},{once:true}));
  $('camera-panel').hidden=false;say('움직임을 읽을 준비를 하고 있습니다…');
  s.features=new FaceFeatures.Tracker({smoothing:.35,autoEyeCalibration:true,linkEyes:false});
  s.face=new FaceMesh({locateFile:f=>new URL('lib/vendor/face_mesh/'+f,document.baseURI).href});s.face.setOptions({maxNumFaces:1,refineLandmarks:false,selfieMode:false,minDetectionConfidence:.55,minTrackingConfidence:.55});
  s.face.onResults(r=>{if(id!==token||s.stopped)return;s.faceFrames=(s.faceFrames||0)+1;const p=s.features.update(r.multiFaceLandmarks?.[0],s.capturedAt/1000,video.videoWidth/video.videoHeight);if(p){motion.face(p,s.capturedAt);s.lastSeen=s.lastFaceSeen=performance.now();}});
  s.body=BodyTracking.create({maxFps:15,modelComplexity:0,onResults(p,lm,world,meta){if(id!==token||s.stopped)return;s.bodyFrames=(s.bodyFrames||0)+1;s.wrists={};for(const [side,i] of [['left',15],['right',16]])if(lm?.[i]?.visibility>.55){s.wrists[side]={x:lm[i].x,y:lm[i].y};const elbow=lm[i-2];if(elbow?.visibility>.55)Object.assign(s.wrists[side],{elbowX:elbow.x,elbowY:elbow.y});}s.bodyValid={left:p.leftValid,right:p.rightValid,torso:p.torsoValid,leftUpper:p.leftUpperValid,rightUpper:p.rightUpperValid,lower:p.lowerValid,leftLeg:p.leftLegValid,rightLeg:p.rightLegValid};motion.body(p,meta.capturedAt);if(p.leftValid||p.rightValid||p.torsoValid)s.lastSeen=performance.now();},onState(kind){if(kind==='error'&&id===token)say('몸 추적을 다시 시작하려면 카메라를 껐다 켜 주세요.');}});
  s.hands=createHandTracking({getWrists:()=>s.wrists||{},onResults(p,at){if(id!==token||s.stopped)return;s.handFrames=(s.handFrames||0)+1;s.handValid={left:p.left.valid,right:p.right.valid};motion.hands(p,at);},onError(){if(id===token)s.handError=true;}});
  s.pending=Promise.all([s.face.initialize(),s.body.start(),s.hands.start()]);const results=await s.pending;if(id!==token||s.stopped)return;if(!results[1]||!results[2])throw new Error('tracking-model');
  active=true;$('camera-label').textContent='카메라 끄기';button.setAttribute('aria-pressed','true');$('recenter').hidden=false;say(modeInstruction());
 }catch(error){if(id===token){const name=error?.name;stop(name==='NotAllowedError'?'카메라 권한이 필요합니다. 주소창의 카메라 권한을 허용한 뒤 다시 켜 주세요.':name==='NotFoundError'?'연결된 카메라를 찾지 못했습니다. 카메라를 연결한 뒤 다시 켜 주세요.':'카메라를 준비하지 못했습니다. 연결을 확인하고 다시 켜 주세요.');console.error('Camera start failed',error);}}
}
button.addEventListener('click',()=>session?stop():start());
$('recenter').addEventListener('click',()=>{const s=session;if(!active||!s)return;motion.recenter();s.features.startCalibration();s.calibrating=true;say('정면을 보고 잠시 가만히 있어 주세요.');clearTimeout(calibrationTimer);calibrationTimer=setTimeout(()=>{if(session===s){motion.recenter();const result=s.features.finishCalibration();s.calibrating=false;say(result?'정면을 맞췄습니다. 다시 움직여 보세요.':'얼굴이 잘 보이지 않습니다. 정면을 보고 다시 눌러 주세요.');}},1400);});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{say('이 브라우저에서는 전체 화면을 지원하지 않습니다.');}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').firstChild.textContent=document.fullscreenElement?'전체 화면 나가기 ':'전체 화면 ';});
window.addEventListener('pagehide',()=>stop());
function frame(now){
 const s=session;
 if(active&&s&&!s.stopped&&video.readyState>=2){
  s.body.feed(video);
  s.hands.feed(video);
  if(!s.busy&&video.currentTime!==s.lastFaceFrame&&now-s.lastFaceAt>=50){s.busy=true;s.lastFaceFrame=video.currentTime;s.lastFaceAt=now;s.capturedAt=now;s.pending=Promise.resolve().then(()=>s.face.send({image:video})).catch(e=>{if(session===s){console.error('Face tracking failed',e);stop('움직임 추적이 중지되었습니다. 카메라를 다시 켜 주세요.');}}).finally(()=>s.busy=false);}
  if(now-lastStatus>500&&!s.calibrating){lastStatus=now;const p=motion.sample(now);say(s.handError?'손 추적이 중지되었습니다. 카메라를 다시 켜 주세요.':(!p.bodyTracked||(p.faceTracked&&!p.leftUpperWeight&&!p.rightUpperWeight))?(p.faceTracked?'팔꿈치와 손까지 보이도록 조금 물러서 주세요.':modeInstruction()):motion.mode==='full'&&!p.lowerTracked?'발끝까지 보여 주세요. 얼굴과 상체는 계속 따라갑니다.':!p.faceTracked?'몸을 따라가고 있어요. 표정은 얼굴이 보이면 다시 이어집니다.':motion.mode==='full'?'온몸·표정·손을 함께 움직여 보세요.':'상체·표정·손을 함께 움직여 보세요.');}
 }
 view?.draw(motion.sample(now),now);requestAnimationFrame(frame);
}
try{view=await createRenderer($('stage'));view.setMode(motion.mode);ready=true;button.disabled=false;$('loading').hidden=true;say('카메라를 켜면 멜루트와 함께 움직일 수 있어요.');requestAnimationFrame(frame);}catch(e){$('loading').textContent='캐릭터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.';say('로컬 실행 폴더와 브라우저의 WebGL 지원을 확인해 주세요.');console.error(e);}
window.melrootDiagnostics=()=>({ready,active,mode:motion.mode,motion:motion.sample(performance.now()),cameraActive:camera.active,video:video.srcObject?{width:video.videoWidth,height:video.videoHeight,tracks:video.srcObject.getTracks().map(t=>({kind:t.kind,state:t.readyState}))}:null,tracking:session?{lastSeen:session.lastSeen,lastFaceSeen:session.lastFaceSeen,faceFrames:session.faceFrames,bodyFrames:session.bodyFrames,bodyValid:session.bodyValid,bodyActive:session.body?.active,faceBusy:session.busy,handFrames:session.handFrames,handValid:session.handValid,handsActive:session.hands?.active,handError:!!session.handError}:null,renderer:view?.diagnostics()});
