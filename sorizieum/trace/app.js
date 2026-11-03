import {createAvatar} from './avatar.js';
const $ = id => document.getElementById(id);
const canvas=$('art'), overlay=$('overlay'), ctx=overlay.getContext('2d');
const audio=$('soundtrack'), video=$('cameraVideo');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={input:'demo',visual:'flow',palette:'mint',intensity:.45,trail:.6,drive:1.65,internal:.65,low:0,mid:0,high:0,beat:0,energy:0,motion:0,tracked:false,confidence:0,immersive:false};
const palettes={mint:{main:[.55,.95,.78],css:'#c4ffe1',rgb:'160,245,205'},ember:{main:[1,.53,.24],css:'#ffc694',rgb:'255,168,102'},violet:{main:[.65,.47,1],css:'#dcc5ff',rgb:'192,151,255'}};
const chapters=[['EMERGENCE','고요 속에서 형태가 태어납니다.'],['RESONANCE','소리와 몸이 서로를 울립니다.'],['SUSPENSION','멈춤에도 움직임은 남습니다.'],['AFTERIMAGE','흩어진 흔적이 다시 모입니다.']];
const bones=[[35,35,.05,3],[36,36,.07,2],[37,37,.07,2],[0,0,.12,8],[33,34,.18,19],[11,12,.085,4],[11,13,.065,8],[13,15,.05,7],[12,14,.065,8],[14,16,.05,7],[23,25,.09,9],[25,27,.06,8],[24,26,.09,9],[26,28,.06,8],[27,31,.055,2],[28,32,.055,2],[11,23,.075,2],[12,24,.075,2],[33,0,.075,3]];
const jointIds=[0,11,12,13,14,15,16,23,24,25,26,27,28,31,32];
let W=innerWidth,H=innerHeight,DPR=Math.min(devicePixelRatio,2),mobile=W<761;
let originX,originY,scale,viewRotation=0;
let pointer={x:0,y:0},joints=Array.from({length:38},()=>({x:0,y:0,z:0,v:1})),history=[];
let startedAt=performance.now(),lastFrame=0,lastOverlay=0,lastUi=0,phase=0,frame=0;
let audioContext,analyser,fft,stream,worker,workerReady=false,frameInFlight=false,lastVideoTime=-1,lastDetection=0,cameraToken=0,latestLandmarks=null,lastPoseAt=0;
let toastTimer,musicPhase=0,beatAverage=0,previousSpectrum=new Float32Array(512),lastBeatTime=-1000,beatCount=0;
let loopEnabled=true;try{loopEnabled=localStorage.getItem('trace.loop')!=='off';}catch{}
audio.loop=loopEnabled;
let loopCount=0,lastMediaTime=0,manualSeekUntil=0,loopObservations=[];
function seekTo(seconds){manualSeekUntil=performance.now()+1200;lastMediaTime=seconds;audio.currentTime=seconds;}
function observeTimeline(){const t=audio.currentTime||0,d=duration();if(loopEnabled&&!audio.paused&&performance.now()>manualSeekUntil&&lastMediaTime>d*.65&&t<d*.35&&lastMediaTime-t>.4){loopCount++;loopObservations.push({count:loopCount,phase:musicPhase,performanceTime:phase,from:lastMediaTime,to:t,playing:!audio.paused});if(loopObservations.length>12)loopObservations.shift();}lastMediaTime=t;}
function reflectLoop(){const b=$('loopButton');b.classList.toggle('selected',loopEnabled);b.setAttribute('aria-pressed',String(loopEnabled));b.setAttribute('aria-label',loopEnabled?'반복 재생 켜짐 — 끄기':'반복 재생 꺼짐 — 켜기');b.title=loopEnabled?'반복 재생 ON':'반복 재생 OFF';}
let trackDuration=120,trackName='Four Textures',customMusic=false,musicObjectUrl=null,uploadToken=0;
function duration(){return Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:trackDuration;}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),4500);}
let randSeed=42017;
function random(){randSeed=(Math.imul(randSeed,1664525)+1013904223)>>>0;return randSeed/4294967296;}
let avatar,glReady=false;
try{avatar=createAvatar(canvas);avatar.readyPromise.then(()=>{glReady=true;resize();}).catch(showGraphicsError);}catch(e){showGraphicsError(e);}
function showGraphicsError(error){console.error(error);const p=document.createElement('p');p.className='webgl-fallback';p.textContent='인체 시각화를 불러오지 못했습니다. WebGL 2 지원 브라우저에서 새로고침해 주세요. 오디오는 계속 감상할 수 있습니다.';$('experience').append(p);}
function resize(){W=innerWidth;H=$('experience').clientHeight;mobile=W<761;DPR=Math.min(devicePixelRatio,2);overlay.width=Math.round(W*DPR);overlay.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);originX=W*(mobile?.61:.515);originY=H*(mobile?.30:.435);scale=H*(mobile?.137:.235);if(state.immersive){originX=W*.5;originY=H*.48;scale=H*.29;}avatar?.resize(W,H,originX,originY,scale,DPR);}
resize();addEventListener('resize',resize);
function setJoint(i,x,y,z=0,v=1){const p=joints[i];p.x+=(x-p.x)*.19;p.y+=(y-p.y)*.19;p.z+=(z-p.z)*.19;p.v=v;}
function demoPose(t){
 const sw=Math.sin(t*.52),turn=Math.sin(t*.35)*.12,sway=Math.sin(t*.71)*.065,breathe=Math.sin(t*.93)*.025;
 const p=state.input==='pointer';const px=p?pointer.x:0,py=p?pointer.y:0;
 const shift=sw*.08+px*.13;const lift=.5+.5*Math.sin(t*.61);
 setJoint(0,shift+turn*.25,1.06+breathe,.02);
 setJoint(11,-.23+shift,.72+breathe,-.03+turn);setJoint(12,.23+shift,.7+breathe,.03-turn);
 setJoint(13,-.42+shift-px*.12,.7+lift*.24+py*.2,Math.sin(t*.57)*.16);
 setJoint(14,.44+shift+px*.14,.58+(.5+.5*Math.sin(t*.61+1.7))*.37+py*.2,-Math.sin(t*.5)*.23);
 setJoint(15,-.62+shift-px*.26,.68+lift*.56+py*.38,Math.sin(t*.57+.5)*.26);
 setJoint(16,.64+shift+px*.24,.56+(.5+.5*Math.sin(t*.61+1.7))*.66+py*.38,Math.cos(t*.45)*.28);
 setJoint(23,-.15+sway,.04,-.015);setJoint(24,.15+sway,0,.015);
 setJoint(25,-.2+sw*.07,-.48+Math.max(0,-sw)*.12,.08+sw*.12);
 setJoint(26,.24+sw*.08,-.47+Math.max(0,sw)*.1,-.05-sw*.1);
 setJoint(27,-.28+sw*.1,-1.04+Math.max(0,-sw)*.09,.12);
 setJoint(28,.31+sw*.1,-1.02+Math.max(0,sw)*.1,-.06);
 setJoint(31,joints[27].x-.06,-1.09,joints[27].z+.09);setJoint(32,joints[28].x+.08,-1.08,joints[28].z+.09);
 for(let i=1;i<11;i++)setJoint(i,joints[0].x,joints[0].y,joints[0].z);
}
function cameraPose(){
 if(!latestLandmarks||performance.now()-lastPoseAt>900){state.tracked=false;return;}
 state.tracked=true;let confidence=0;
 latestLandmarks.forEach((p,i)=>{setJoint(i,(.5-p.x)*2.7,(.56-p.y)*2.9,-p.z*1.1,p.visibility??1);confidence+=p.visibility??1;});
 state.confidence=confidence/33;
}
function midJoints(){for(const [i,a,b] of [[33,11,12],[34,23,24]]){joints[i].x=(joints[a].x+joints[b].x)/2;joints[i].y=(joints[a].y+joints[b].y)/2;joints[i].z=(joints[a].z+joints[b].z)/2;joints[i].v=Math.min(joints[a].v,joints[b].v);}
 for(const [i,side,y] of [[35,-.035,.2],[36,-.095,.14],[37,.095,.14]]){joints[i]={x:joints[33].x+side,y:joints[33].y-y,z:joints[33].z+.07,v:joints[33].v};}}
function rotateChain(ids,pivot,angle,axis='z'){
 const c=Math.cos(angle),s=Math.sin(angle),o={...joints[pivot]};
 for(const id of ids){const p=joints[id],x=p.x-o.x,y=p.y-o.y,z=p.z-o.z;if(axis==='z'){p.x=o.x+x*c-y*s;p.y=o.y+x*s+y*c;}else{p.x=o.x+x*c+z*s;p.z=o.z-x*s+z*c;}}
}
function driveBody(){
 const power=state.drive*(reducedMotion?.28:1),e=state.energy,beat=state.beat;
 if(power===0||(state.input==='camera'&&!state.tracked))return;
 const strength=Math.min(1,e*1.5+state.low*.3+beat*.55)*power;
 const q=musicPhase;
 rotateChain(jointIds,34,(Math.sin(q*1.25)*state.mid*.2+beat*.065)*power);
 rotateChain(jointIds,34,Math.sin(q*.83)*state.low*.28*power,'y');
 rotateChain([13,15],11,(Math.sin(q*1.7)*.55+beat*.28)*strength);
 rotateChain([14,16],12,(Math.sin(q*1.7+2.8)*.55-beat*.28)*strength);
 rotateChain([15],13,(Math.sin(q*2.1+.7)*.55+state.high*.3)*strength);
 rotateChain([16],14,(-Math.sin(q*2.1+2)*.55-state.high*.3)*strength);
 rotateChain([25,27,31],23,Math.sin(q*1.55)*.25*strength);
 rotateChain([26,28,32],24,Math.sin(q*1.55+Math.PI)*.25*strength);
 rotateChain([27,31],25,Math.max(0,Math.sin(q*1.55))*.5*strength);
 rotateChain([28,32],26,-Math.max(0,-Math.sin(q*1.55))*.5*strength);
 rotateChain([0,1,2,3,4,5,6,7,8,9,10],33,Math.sin(q*2.5)*.16*strength);
 const bounce=(beat*.11+Math.sin(q*3.1)*e*.045)*power;
 for(let i=0;i<33;i++){joints[i].y+=bounce;joints[i].z+=Math.sin(q*1.4+joints[i].y*2)*state.mid*.025*power;}
}
for(let n=0;n<50;n++){demoPose(0);midJoints();}
for(let n=0;n<70;n++)history.push(joints.map(p=>({...p})));
function rotate(p){const c=Math.cos(viewRotation),s=Math.sin(viewRotation);return {x:p.x*c+p.z*s,y:p.y,z:-p.x*s+p.z*c};}
function project(p){const q=rotate(p),v=3.8/(3.8-q.z);return {x:originX+q.x*scale*v,y:originY-q.y*scale*v};}
function updateParticles(t){avatar?.render(joints,state,t,viewRotation);}
const dust=Array.from({length:180},()=>({x:random(),y:random(),r:random(),phase:random()*6.28}));
function drawOverlay(t){
 ctx.clearRect(0,0,W,H);const rgb=palettes[state.palette].rgb;
 // A quiet spatial grid: an elliptical floor, fine registration marks, a horizon.
 const floor=originY+scale*1.17;
 ctx.strokeStyle=`rgba(${rgb},.045)`;ctx.lineWidth=.7;
 for(let r=1;r<=5;r++){ctx.beginPath();ctx.ellipse(originX,floor,r*scale*.27,r*scale*.054,0,0,Math.PI*2);ctx.stroke();}
 ctx.setLineDash([1,8]);ctx.strokeStyle=`rgba(${rgb},.12)`;ctx.beginPath();ctx.ellipse(originX,floor,scale*1.65,scale*.29,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 for(let i=-3;i<=3;i++){ctx.strokeStyle=`rgba(${rgb},.035)`;ctx.beginPath();ctx.moveTo(originX+i*scale*.46,floor-scale*.08);ctx.lineTo(originX+i*scale*.68,floor+scale*.32);ctx.stroke();}
 for(const p of dust){const x=originX+(p.x-.5)*scale*3.5+Math.sin(t*.09+p.phase)*12,y=originY+(p.y-.5)*scale*3.1+Math.cos(t*.08+p.phase)*10;const op=.06+(.5+.5*Math.sin(t*.5+p.phase))*.12;ctx.fillStyle=`rgba(${rgb},${op})`;ctx.fillRect(x,y,p.r> .92?2:1,1);}
 // Wrist paths use the actual smoothed joint history in camera mode.
 for(const j of [15,16]){
  ctx.beginPath();for(let h=0;h<history.length;h+=2){const p=project(history[h][j]);if(!h)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
  ctx.strokeStyle=`rgba(${rgb},${state.visual==='echo'?.22:.075})`;ctx.lineWidth=.6;ctx.stroke();
 }
 const showSkeleton=state.input==='camera'&&state.tracked;
 // Discrete tracking targets, never presented as live landmarks in demo mode.
 for(const id of [15,16,0,27,28]){const p=project(joints[id]);const rad=id===0?5:3;ctx.strokeStyle=`rgba(${rgb},${showSkeleton?.6:.17})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(p.x-rad-3,p.y);ctx.lineTo(p.x-rad,p.y);ctx.moveTo(p.x+rad,p.y);ctx.lineTo(p.x+rad+3,p.y);ctx.moveTo(p.x,p.y-rad-3);ctx.lineTo(p.x,p.y-rad);ctx.moveTo(p.x,p.y+rad);ctx.lineTo(p.x,p.y+rad+3);ctx.stroke();}
 // Side registration ticks, aligned with the generated body.
 for(const sign of [-1,1]){const x=originX+sign*scale*1.22;ctx.strokeStyle=`rgba(${rgb},.14)`;ctx.beginPath();ctx.moveTo(x,floor-scale*2.25);ctx.lineTo(x+sign*8,floor-scale*2.25);ctx.moveTo(x,floor);ctx.lineTo(x+sign*8,floor);ctx.stroke();}
}
function readAudio(dt){
 state.beat*=Math.exp(-dt*11);
 if(!analyser||audio.paused){const decay=Math.exp(-dt*9);state.low*=decay;state.mid*=decay;state.high*=decay;state.energy*=decay;return;}
 analyser.getByteFrequencyData(fft);let low=0,mid=0,high=0,lc=0,mc=0,hc=0,flux=0,fc=0;
 const hz=audioContext.sampleRate/analyser.fftSize;
 for(let i=0;i<fft.length;i++){const f=i*hz,v=fft[i]/255;if(f>=35&&f<250){low+=v;lc++;}if(f>=250&&f<2000){mid+=v;mc++;}if(f>=2000&&f<10000){high+=v;hc++;}if(f>=35&&f<8000){flux+=Math.max(0,v-previousSpectrum[i]);fc++;}previousSpectrum[i]=v;}
 const wave=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(wave);let rms=0;for(const v of wave)rms+=v*v;const energy=Math.min(1,Math.sqrt(rms/wave.length)*5);
 flux/=Math.max(1,fc);const now=performance.now();
 if(flux>Math.max(.009,beatAverage*1.6)&&energy>.025&&now-lastBeatTime>175){state.beat=1;lastBeatTime=now;beatCount++;}
 beatAverage+=(flux-beatAverage)*(1-Math.exp(-dt*3));
 const ease=1-Math.exp(-dt*22);state.low+=(Math.pow(low/Math.max(1,lc),1.7)-state.low)*ease;state.mid+=(Math.pow(mid/Math.max(1,mc),1.5)-state.mid)*ease;state.high+=(Math.pow(high/Math.max(1,hc),1.4)-state.high)*ease;state.energy+=(energy-state.energy)*ease;
}
function updateUI(){
 const length=duration(),time=Math.min(length,audio.currentTime||0),chapter=Math.min(3,Math.floor(time/length*4));$('elapsed').textContent=formatTime(time);if(document.activeElement!==$('seek'))$('seek').value=time;$('seek').style.setProperty('--progress',`${time/length*100}%`);
 $('chapterIndex').textContent=`0${chapter+1}`;$('chapterName').textContent=chapters[chapter][0];$('chapterDescription').textContent=chapters[chapter][1];
 if(state.input==='demo'){$('trackingStatus').textContent='DEMO · CHOREOGRAPHED MOTION';$('inputTag').textContent='DEMO';}
 if(state.input==='pointer'){$('trackingStatus').textContent='POINTER · INTERACTIVE MOTION';$('inputTag').textContent='POINTER';}
 if(state.input==='camera'){$('trackingStatus').textContent=state.tracked?'LIVE · BODY TRACKING / 33 LANDMARKS':workerReady?'CAMERA · SEARCHING FOR BODY':'CAMERA · INITIALIZING';$('inputTag').textContent=state.tracked?`${Math.round(state.confidence*100)}%`:'WAIT';}
 $('inputDot').style.background=state.input==='camera'&&!state.tracked?'#b79557':'var(--accent)';
 $('frameLabel').textContent=`X ${joints[34].x.toFixed(3)} / Y ${joints[34].y.toFixed(3)}`;
 for(let i=0;i<bars.length;i++){const v=fft&&!audio.paused?fft[Math.floor(i*fft.length/bars.length)]/255:0;bars[i].style.height=`${2+v*12}px`;}
}
function formatTime(t){const s=Math.floor(t);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function animate(now){requestAnimationFrame(animate);if(document.hidden)return;if(now-lastFrame<(reducedMotion?50:mobile?30:15))return;const dt=Math.min((now-(lastFrame||now))/1000,.06);lastFrame=now;frame++;phase+=dt*(reducedMotion?.3:1);const t=phase;
 observeTimeline();readAudio(dt);if(!audio.paused)musicPhase+=dt*(1.5+state.energy*6+state.beat*4);if(state.input==='camera')cameraPose();else demoPose(t+musicPhase*.7);
 midJoints();const basePose=joints.map(p=>({...p}));driveBody();midJoints();const old=history[0];let movement=0;for(const j of [15,16,27,28])movement+=Math.hypot(joints[j].x-old[j].x,joints[j].y-old[j].y);state.motion+=(movement-state.motion)*.12;
 history.unshift(joints.map(p=>({...p})));if(history.length>70)history.pop();
 viewRotation=(state.input==='camera'?.04:Math.sin(t*.15)*.15)+(state.input==='pointer'?pointer.x*.15:0);
 updateParticles(t);if(now-lastOverlay>32){drawOverlay(t);lastOverlay=now;}if(now-lastUi>110){updateUI();lastUi=now;}
 joints=basePose;requestCameraFrame(now);
}
const bars=Array.from({length:22},()=>{const b=document.createElement('i');$('meter').append(b);return b;});
requestAnimationFrame(animate);
function ensureAudio(){if(!audioContext){audioContext=new AudioContext();analyser=audioContext.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.45;const source=audioContext.createMediaElementSource(audio);source.connect(analyser);analyser.connect(audioContext.destination);fft=new Uint8Array(analyser.frequencyBinCount);}return audioContext.resume();}
audio.volume=.75;
async function togglePlay(){try{await ensureAudio();if(audio.paused){if(audio.ended||audio.currentTime>=duration()-.05)seekTo(0);await audio.play();}else audio.pause();}catch(e){toast('오디오를 시작하지 못했습니다. 재생 버튼을 다시 눌러주세요.');console.error(e);}}
function reflectPlay(){const playing=!audio.paused;$('playButton').setAttribute('aria-label',playing?'오디오 일시정지':'오디오 재생');$('playIcon').innerHTML=playing?'<path d="M7 5h4v14H7zm6 0h4v14h-4z"/>':'<path d="m8 5 11 7-11 7z"/>';$('playLabel').textContent=playing?'퍼포먼스 재생 중':audio.ended?'다시 시작':audio.currentTime>0?'이어서 감상':'퍼포먼스 시작';$('soundStatus').innerHTML=`<span class="mini-dot"></span> ${playing?'SOUND ACTIVE':audio.ended?'PERFORMANCE COMPLETE':'SOUND READY'}`;}
function clearAudioMotion(){state.low=state.mid=state.high=state.beat=state.energy=0;beatAverage=0;previousSpectrum.fill(0);lastBeatTime=-1000;beatCount=0;}
function updateTrackMetadata(){const d=duration();if(!(d>0))return;trackDuration=d;$('seek').max=d;$('totalDuration').textContent=` / ${formatTime(d)}`;$('workDuration').textContent=formatTime(d);$('seek').setAttribute('aria-label',`오디오 재생 위치 (전체 ${formatTime(d)})`);}
audio.addEventListener('loadedmetadata',updateTrackMetadata);audio.addEventListener('durationchange',updateTrackMetadata);audio.addEventListener('seeking',()=>{if(performance.now()<manualSeekUntil)clearAudioMotion();});
function setTrack(url,name,custom,length,play){
 audio.pause();clearAudioMotion();trackName=name;customMusic=custom;trackDuration=length;lastMediaTime=0;loopCount=0;loopObservations=[];manualSeekUntil=0;audio.src=url;audio.load();
 $('musicFileName').textContent=custom?name:'Four Textures · 원곡';$('musicFileName').title=name;
 $('workName').textContent=custom?'Your Sound':'Four Textures';$('trackSubtitle').textContent=custom?`LOCAL FILE · ${name}`:'FOUR TEXTURES · ORIGINAL SOUNDTRACK';$('trackSubtitle').title=name;
 $('restoreMusic').disabled=!custom;$('seek').value=0;$('elapsed').textContent='00:00';updateTrackMetadata();reflectPlay();
 if(play)ensureAudio().then(()=>audio.play()).catch(()=>toast('음악이 준비되었습니다. 재생 버튼을 눌러주세요.'));
}
function inspectMusic(url){return new Promise((resolve,reject)=>{
 const probe=new Audio();const timeout=setTimeout(()=>done(new Error('음악 정보를 읽는 데 시간이 너무 오래 걸립니다. 다른 파일을 선택해 주세요.')),20000);
 function done(error){clearTimeout(timeout);probe.onloadedmetadata=probe.onerror=null;const d=probe.duration;probe.removeAttribute('src');probe.load();error?reject(error):resolve(d);}
 probe.preload='metadata';probe.onloadedmetadata=()=>{if(!Number.isFinite(probe.duration)||probe.duration<=0)done(new Error('길이를 확인할 수 없는 음악입니다. 다른 파일을 선택해 주세요.'));else done();};probe.onerror=()=>done(new Error('이 브라우저가 재생할 수 없는 파일입니다. MP3 또는 WAV로 다시 선택해 주세요.'));probe.src=url;
 });}
async function loadMusic(file){
 if(!file)return;
 if(!(file.type.startsWith('audio/')||/\.(mp3|wav|m4a|ogg|oga|flac|aac|webm|opus|aiff?)$/i.test(file.name))){toast('음악 파일을 선택해 주세요. MP3·WAV·M4A 등을 사용할 수 있습니다.');return;}
 const request=++uploadToken;
 // Resume while the file-picker gesture is active; playback itself follows validation.
 ensureAudio().catch(()=>{});$('uploadStatus').textContent='음악 파일을 확인하고 있습니다…';$('uploadMusic').setAttribute('aria-busy','true');
 const url=URL.createObjectURL(file);
 try{
  const length=await inspectMusic(url);if(request!==uploadToken){URL.revokeObjectURL(url);return;}
  const old=musicObjectUrl;musicObjectUrl=url;setTrack(url,file.name,true,length,true);if(old)URL.revokeObjectURL(old);
  $('uploadStatus').textContent='내 음악 재생 · 파일은 서버로 전송되지 않습니다.';toast('음악을 불러왔습니다. 박자에 맞춰 몸이 반응합니다.');
 }catch(e){URL.revokeObjectURL(url);if(request!==uploadToken)return;$('uploadStatus').textContent='불러오기 실패 · 현재 음악은 유지됩니다.';toast(e.message);}
 finally{if(request===uploadToken)$('uploadMusic').removeAttribute('aria-busy');}
}
$('uploadMusic').addEventListener('click',()=>$('musicFile').click());$('musicFile').addEventListener('change',()=>{loadMusic($('musicFile').files[0]);$('musicFile').value='';});
$('restoreMusic').addEventListener('click',()=>{uploadToken++;const playing=!audio.paused;const old=musicObjectUrl;musicObjectUrl=null;setTrack('assets/four-textures.mp3','Four Textures',false,120,playing);if(old)URL.revokeObjectURL(old);$('uploadMusic').removeAttribute('aria-busy');$('uploadStatus').textContent='파일은 브라우저 안에서만 재생됩니다.';toast('기존 2분 오디오로 돌아왔습니다.');});
let dragDepth=0;const stage=$('experience');
stage.addEventListener('dragenter',e=>{if([...e.dataTransfer.types].includes('Files')){e.preventDefault();dragDepth++;stage.classList.add('dragging');}});
stage.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files')){e.preventDefault();e.dataTransfer.dropEffect='copy';}});
stage.addEventListener('dragleave',()=>{if(--dragDepth<=0){dragDepth=0;stage.classList.remove('dragging');}});
stage.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;stage.classList.remove('dragging');loadMusic(e.dataTransfer.files[0]);});
reflectLoop();$('loopButton').addEventListener('click',()=>{loopEnabled=!loopEnabled;audio.loop=loopEnabled;try{localStorage.setItem('trace.loop',loopEnabled?'on':'off');}catch{}reflectLoop();});
$('playButton').addEventListener('click',togglePlay);audio.addEventListener('play',reflectPlay);audio.addEventListener('pause',reflectPlay);audio.addEventListener('ended',()=>{if(loopEnabled)return;reflectPlay();toast('음악의 흔적이 완성되었습니다. 다시 시작하거나, 움직임을 계속 탐색해 보세요.');});audio.addEventListener('error',()=>toast('사운드 파일을 불러오지 못했습니다. 연결을 확인하고 새로고침해 주세요.'));
$('seek').addEventListener('input',()=>{if(Number.isFinite(audio.duration))seekTo(Math.min(duration(),Number($('seek').value)));});
$('restartButton').addEventListener('click',async()=>{seekTo(0);await ensureAudio();audio.play().catch(()=>toast('재생 버튼을 눌러 시작해 주세요.'));});
$('volume').addEventListener('input',()=>{audio.volume=Number($('volume').value)/100;audio.muted=false;updateMute();});
$('muteButton').addEventListener('click',()=>{audio.muted=!audio.muted;updateMute();});
function updateMute(){$('muteButton').textContent=audio.muted||audio.volume===0?'◖×':'◖))';$('muteButton').setAttribute('aria-label',audio.muted?'음소거 해제':'음소거');}
for(const id of ['intensity','trail','drive','internal'])$(id).addEventListener('input',()=>{state[id]=Number($(id).value)/100;$(id+'Value').value=`${$(id).value}%`;});
function activateButtons(selector,value,attr){document.querySelectorAll(selector).forEach(b=>{const selected=b.dataset[attr]===value;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);});}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.visual=b.dataset.mode;activateButtons('[data-mode]',state.visual,'mode');$('visualTag').textContent={flow:'01',echo:'02',field:'03'}[state.visual];}));
document.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>{state.palette=b.dataset.palette;document.documentElement.style.setProperty('--accent',palettes[state.palette].css);activateButtons('[data-palette]',state.palette,'palette');}));
$('experience').addEventListener('pointermove',e=>{pointer.x=Math.max(-1,Math.min(1,(e.clientX/W-.5)*2));pointer.y=Math.max(-1,Math.min(1,(.5-e.clientY/H)*2));});
function stopCamera(){cameraToken++;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}video.srcObject=null;latestLandmarks=null;state.tracked=false;frameInFlight=false;lastVideoTime=-1;if(worker){worker.terminate();worker=null;}workerReady=false;document.querySelector('[data-input="camera"]').disabled=false;}
async function chooseInput(input){
 if(input===state.input&&input!=='camera')return;
 stopCamera();state.input=input;activateButtons('[data-input]',input,'input');
 const hints={demo:'안무가 생성되는 자동 퍼포먼스입니다.',pointer:'화면 위에서 마우스나 손가락을 움직이세요.',camera:'카메라 준비 중 · 영상은 기기 안에서만 처리됩니다.'};$('inputHint').textContent=hints[input];
 if(input!=='camera')return;
 const token=cameraToken;
 if(!navigator.mediaDevices?.getUserMedia){toast('카메라는 HTTPS 또는 localhost에서 사용할 수 있습니다. 포인터 모드로 전환합니다.');await chooseInput('pointer');return;}
 try{
  document.querySelector('[data-input="camera"]').disabled=true;
  const incoming=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:24,max:30}},audio:false});
  if(token!==cameraToken){incoming.getTracks().forEach(t=>t.stop());return;}
  stream=incoming;video.srcObject=stream;await video.play();
  worker=new Worker(new URL('./pose-worker.js',import.meta.url));
  const initTimer=setTimeout(()=>{if(token===cameraToken&&!workerReady&&state.input==='camera'){toast('추적 모델 준비가 지연되고 있습니다. 포인터 모드로 전환합니다.');chooseInput('pointer');}},45000);
  worker.onmessage=({data})=>{
   if(token!==cameraToken)return;
   if(data.type==='ready'){clearTimeout(initTimer);workerReady=true;document.querySelector('[data-input="camera"]').disabled=false;$('inputHint').textContent='전신을 보여주세요 · 손가락은 음악 기반 생성입니다.';toast('카메라 준비 완료. 몸을 움직여 잔상을 만들어 보세요.');}
   if(data.type==='pose'){frameInFlight=false;latestLandmarks=data.landmarks;if(data.landmarks)lastPoseAt=performance.now();}
   if(data.type==='error'){clearTimeout(initTimer);console.error('Pose tracking:',data.message);toast('추적 모델을 실행하지 못했습니다. 포인터 모드로 전환합니다.');chooseInput('pointer');}
  };
  worker.onerror=e=>{clearTimeout(initTimer);console.error('Pose worker:',e.message);toast('추적 모델을 불러오지 못했습니다. 포인터 모드로 전환합니다.');chooseInput('pointer');};
  worker.postMessage({type:'init'});
 }catch(e){if(token!==cameraToken)return;console.warn('Camera:',e.name);toast(e.name==='NotAllowedError'?'카메라 권한이 허용되지 않아 포인터 모드로 전환했습니다.':'카메라를 사용할 수 없어 포인터 모드로 전환했습니다.');await chooseInput('pointer');}
}
async function requestCameraFrame(now){
 if(state.input!=='camera'||!workerReady||frameInFlight||video.readyState<2||now-lastDetection<80||video.currentTime===lastVideoTime)return;
 frameInFlight=true;lastDetection=now;lastVideoTime=video.currentTime;const activeWorker=worker;
 try{const bitmap=await createImageBitmap(video);if(worker!==activeWorker||!workerReady){bitmap.close();frameInFlight=false;return;}worker.postMessage({type:'frame',frame:bitmap,time:now},[bitmap]);}catch(e){frameInFlight=false;console.warn(e);}
}
document.querySelectorAll('[data-input]').forEach(b=>b.addEventListener('click',()=>chooseInput(b.dataset.input)));
function immersiveToggle(){state.immersive=!state.immersive;document.body.classList.toggle('immersive',state.immersive);resize();}
$('hideButton').addEventListener('click',immersiveToggle);$('showButton').addEventListener('click',immersiveToggle);
$('fullscreenButton').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('experience').requestFullscreen();}catch{toast('이 브라우저에서는 전체 화면을 지원하지 않습니다. 몰입 모드를 이용하세요.');}});
$('snapshotButton').addEventListener('click',()=>{const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;const d=c.getContext('2d');d.fillStyle='#080b0c';d.fillRect(0,0,c.width,c.height);d.drawImage(canvas,0,0);d.drawImage(overlay,0,0);d.fillStyle=palettes[state.palette].css;d.font=`${12*DPR}px monospace`;d.fillText(`TRACE / ${trackName} — ${formatTime(audio.currentTime)} — ${state.input.toUpperCase()}`,25*DPR,c.height-25*DPR);c.toBlob(blob=>{if(!blob){toast('이미지를 저장하지 못했습니다.');return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`trace-${Math.floor(audio.currentTime)}-${Date.now()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('현재 프레임을 PNG로 저장했습니다.');});});
$('helpButton').addEventListener('click',()=>$('helpDialog').showModal());$('closeHelp').addEventListener('click',()=>$('helpDialog').close());$('helpDialog').addEventListener('click',e=>{if(e.target===$('helpDialog')){const r=$('helpDialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('helpDialog').close();}});
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select,[contenteditable="true"]')||e.metaKey||e.ctrlKey||e.altKey||$('helpDialog').open)return;const key=e.key.toLowerCase();if(e.code==='Space'){if(e.target.closest('button'))return;e.preventDefault();togglePlay();}if(key==='h')immersiveToggle();if(key==='f')$('fullscreenButton').click();if(key==='r')$('restartButton').click();if(key==='c')chooseInput(state.input==='camera'?'demo':'camera');});
addEventListener('pagehide',()=>{audio.pause();stopCamera();});
// A compact read-only diagnostic used by browser QA, without exposing video frames.
window.traceDiagnostics=()=>({input:state.input,visual:state.visual,palette:state.palette,webgl:glReady,particles:avatar?.stats.particles||0,anatomy:avatar?.stats,internal:state.internal,loop:loopEnabled,loopCount,loopObservations,musicPhase,performanceTime:phase,playing:!audio.paused,time:audio.currentTime,duration:audio.duration,workerReady,tracked:state.tracked,landmarkCount:latestLandmarks?.length||0,hasStream:!!stream,energy:state.energy,low:state.low,mid:state.mid,beat:state.beat,beatCount,drive:state.drive,customMusic,trackName,renderedPose:history[0].filter((_,i)=>[0,13,15,16,25,27].includes(i)).map(p=>({x:p.x,y:p.y,z:p.z})),immersive:state.immersive});
