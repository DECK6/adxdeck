import * as T from './assets/three/three.module.js';
import {MeshSurfaceSampler} from './assets/three/MeshSurfaceSampler.js';
const V=(a)=>new T.Vector3(...a),identity=new T.Quaternion();
function merged(geometries){const attrs={position:[],normal:[]};for(const g of geometries){const n=g.index?g.toNonIndexed():g;for(const key of Object.keys(attrs))attrs[key].push(...n.getAttribute(key).array);}const out=new T.BufferGeometry();for(const key of Object.keys(attrs))out.setAttribute(key,new T.Float32BufferAttribute(attrs[key],3));return out;}
function tube(points,r=.007){return new T.TubeGeometry(new T.CatmullRomCurve3(points.map(V)),Math.max(12,points.length*5),r,5,false);}
function sphere(p,s){const g=new T.SphereGeometry(1,12,9);g.scale(...s);g.translate(...p);return g;}
export function createAvatar(canvas){
 const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(50,1,.05,30);camera.position.z=3.8;const bodyGroup=new T.Group();scene.add(bodyGroup);scene.add(new T.HemisphereLight(0xc4ffeb,0x152624,2));const light=new T.DirectionalLight(0xd0fff1,3);light.position.set(-2,3,4);scene.add(light);const rim=new T.DirectionalLight(0x6ef4c5,2.5);rim.position.set(2,1,-3);scene.add(rim);
 let fpsStarted=performance.now(),fpsFrames=0;let ready=false,model,skeleton,bones,byName={},order=[],root,mesh,particles,pointUniforms,atlas,atlasData,atlasSide,frameHistory=[],organs=new T.Group(),heart,leftLung,rightLung,ribs,slowEnergy=0,lastTime=0,palette='';
 const internals=[];const q=new T.Quaternion(),pQ=new T.Quaternion(),tempV=new T.Vector3(),torsoQ=new T.Quaternion();let count=innerWidth<761?16000:32000;
 const stats={ready:false,vertices:0,bones:0,particles:count,surfaceFraction:.82,drawCalls:0,frameMs:0,frames:0,limitedFrames:0};
 const api={get ready(){return ready;},renderer,stats,
 resize(W,H,originX,originY,scale,dpr){renderer.setPixelRatio(Math.min(dpr,2));renderer.setSize(W,H,false);camera.aspect=W/H;camera.fov=T.MathUtils.radToDeg(2*Math.atan(H/(2*scale*3.8)));camera.updateProjectionMatrix();camera.projectionMatrix.elements[8]=-(originX/W*2-1);camera.projectionMatrix.elements[9]=-(1-originY/H*2);camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();},
 render(joints,state,time,rotation){if(!ready)return;const start=performance.now();const dt=Math.min(.06,Math.max(.001,time-lastTime));lastTime=time;slowEnergy+=(state.energy-slowEnergy)*(1-Math.exp(-dt*2));
 bodyGroup.rotation.y=rotation+.12;retarget(joints,state,time);bodyGroup.updateMatrixWorld(true);skeleton.update();
 const current=new Float32Array(skeleton.boneMatrices);frameHistory.unshift(current);if(frameHistory.length>55)frameHistory.pop();for(let f=0;f<4;f++){const delay=f===0?0:Math.min(frameHistory.length-1,Math.floor(f*state.trail*16));atlasData.set(frameHistory[delay],f*atlasSide*atlasSide*4);}atlas.needsUpdate=true;
 if(palette!==state.palette){palette=state.palette;const color=new T.Color({mint:0xa3ffd8,ember:0xffb57e,violet:0xc6a7ff}[palette]);mesh.material.color.copy(color).multiplyScalar(.32);mesh.material.emissive.copy(color).multiplyScalar(.13);pointUniforms.uColor.value.copy(color);for(const m of internals)m.color.copy(color);}
 const visibility=state.input==='camera'&&!state.tracked?.22:1;
 mesh.material.visible=false;mesh.material.opacity=0;mesh.material.depthWrite=false;mesh.material.colorWrite=false;particles.visible=visibility>.25;pointUniforms.uTime.value=time;pointUniforms.uEnergy.value=state.high;pointUniforms.uMode.value={flow:0,echo:1,field:2}[state.visual];pointUniforms.uScatter.value=state.intensity;pointUniforms.uTrail.value=state.trail;pointUniforms.uBeat.value=state.beat;pointUniforms.uDpr.value=Math.min(devicePixelRatio,2);
 for(const m of internals)m.opacity=(m.userData.opacity||.5)*state.internal*visibility;
 heart.scale.setScalar(1+state.beat*.105);leftLung.scale.set(1+slowEnergy*.07,1+slowEnergy*.045,1+slowEnergy*.06);rightLung.scale.copy(leftLung.scale);ribs.scale.x=1+slowEnergy*.022;
 renderer.render(scene,camera);stats.drawCalls=renderer.info.render.calls;stats.visibleTriangles=renderer.info.render.triangles;fpsFrames++;if(performance.now()-fpsStarted>1000){stats.fps=Math.round(fpsFrames*1000/(performance.now()-fpsStarted));fpsFrames=0;fpsStarted=performance.now();}stats.frameMs+=(performance.now()-start-stats.frameMs)*.05;stats.frames++;
 },dispose(){renderer.dispose();}};
 api.readyPromise=(async()=>{
 const response=await fetch('./assets/human-rig.json');if(!response.ok)throw Error('인체 모델을 불러오지 못했습니다.');model=await response.json();
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(model.positions,3));geo.setAttribute('skinIndex',new T.Uint16BufferAttribute(model.skinIndex,4));geo.setAttribute('skinWeight',new T.Float32BufferAttribute(model.skinWeight,4));geo.setIndex(model.indices);geo.computeVertexNormals();
 bones=model.bones.map((b,i)=>{const bone=new T.Bone();bone.name=b.name;bone.userData.index=i;bone.userData.rest=V(b.head);bone.position.copy(bone.userData.rest);if(b.parent>=0)bone.position.sub(V(model.bones[b.parent].head));byName[b.name]=bone;return bone;});
 model.bones.forEach((b,i)=>{if(b.parent<0)root=bones[i];else bones[b.parent].add(bones[i]);});
 const visit=b=>{order.push(b);b.children.forEach(visit);};visit(root);
 const material=new T.MeshPhongMaterial({color:0x385f50,emissive:0x112d22,transparent:true,opacity:0,shininess:42,specular:0x9dcbb8,depthWrite:false,colorWrite:false,side:T.FrontSide});
 mesh=new T.SkinnedMesh(geo,material);mesh.add(root);bodyGroup.add(mesh);mesh.updateMatrixWorld(true);skeleton=new T.Skeleton(bones);mesh.bind(skeleton);mesh.normalizeSkinWeights();mesh.frustumCulled=false;mesh.renderOrder=1;
 // Surface particles interpolate the same skin weights as the underlying mesh.
 atlasSide=T.MathUtils.ceilPowerOfTwo(Math.ceil(Math.sqrt(bones.length*4)));atlasData=new Float32Array(atlasSide*atlasSide*4*4);atlas=new T.DataTexture(atlasData,atlasSide,atlasSide*4,T.RGBAFormat,T.FloatType);atlas.minFilter=atlas.magFilter=T.NearestFilter;atlas.needsUpdate=true;
 const pos=geo.getAttribute('position'),norm=geo.getAttribute('normal'),skinIndex=geo.getAttribute('skinIndex'),skinWeight=geo.getAttribute('skinWeight');
 const weighted=[];for(let i=0;i<pos.count;i++){const y=pos.getY(i),x=Math.abs(pos.getX(i));weighted.push(y>.84?3:x>.59?3.2:y<-1?1.8:1);}geo.setAttribute('samplingWeight',new T.Float32BufferAttribute(weighted,1));
 const sampler=new MeshSurfaceSampler(mesh).setWeightAttribute('samplingWeight').build();const idx=geo.index.array;const tri=new T.Triangle(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),sample=new T.Vector3(),bary=new T.Vector3();
 const pp=[],pn=[],pi=[],pw=[],extra=[];
 for(let n=0;n<count;n++){
  // sampleFace is used to retain the triangle and interpolate its skin indices.
  const distribution=sampler.distribution;let target=Math.random()*distribution[distribution.length-1],lo=0,hi=distribution.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(target>distribution[mid])lo=mid+1;else hi=mid;}const face=lo,ids=[idx[face*3],idx[face*3+1],idx[face*3+2]];
  a.fromBufferAttribute(pos,ids[0]);b.fromBufferAttribute(pos,ids[1]);c.fromBufferAttribute(pos,ids[2]);let u=Math.random(),v=Math.random();if(u+v>1){u=1-u;v=1-v;}bary.set(1-u-v,u,v);sample.copy(a).multiplyScalar(bary.x).addScaledVector(b,bary.y).addScaledVector(c,bary.z);pp.push(...sample.toArray());
  const normal=new T.Vector3();ids.forEach((id,j)=>normal.addScaledVector(tempV.fromBufferAttribute(norm,id),bary.getComponent(j)));normal.normalize();pn.push(...normal.toArray());
  const influence=new Map();ids.forEach((id,j)=>{for(let k=0;k<4;k++){const bone=skinIndex.getComponent(id,k),w=skinWeight.getComponent(id,k)*bary.getComponent(j);influence.set(bone,(influence.get(bone)||0)+w);}});const top=[...influence].sort((a,b)=>b[1]-a[1]).slice(0,4),total=top.reduce((s,p)=>s+p[1],0);for(let k=0;k<4;k++){pi.push(top[k]?.[0]||0);pw.push(top[k]?top[k][1]/total:0);}
  const ghost=Math.random()>.82?1+Math.floor(Math.random()*3):0;extra.push(ghost,.55+Math.random()*1.25,Math.random()*100);
 }
 const pointGeo=new T.BufferGeometry();for(const [name,arr,size] of [['position',pp,3],['normal',pn,3],['skinIndex',pi,4],['skinWeight',pw,4],['aExtra',extra,3]])pointGeo.setAttribute(name,new T.Float32BufferAttribute(arr,size));
 pointUniforms={uBones:{value:atlas},uSide:{value:atlasSide},uTime:{value:0},uEnergy:{value:0},uMode:{value:0},uScatter:{value:.45},uTrail:{value:.6},uBeat:{value:0},uDpr:{value:1},uColor:{value:new T.Color(0xa3ffd8)}};
 const pointMat=new T.ShaderMaterial({uniforms:pointUniforms,transparent:true,depthWrite:false,depthTest:true,blending:T.AdditiveBlending,vertexShader:`
 attribute vec4 skinIndex;attribute vec4 skinWeight;attribute vec3 aExtra;
 uniform sampler2D uBones;uniform float uSide,uTime,uEnergy,uMode,uScatter,uTrail,uBeat,uDpr;varying float vAlpha;varying float vGlow;uniform vec3 uColor;
 mat4 bone(float i,float f){float j=i*4.;float x=mod(j,uSide),y=f*uSide+floor(j/uSide);vec2 ts=vec2(uSide,uSide*4.);return mat4(texture2D(uBones,(vec2(x,y)+vec2(.5,.5))/ts),texture2D(uBones,(vec2(x+1.,y)+vec2(.5,.5))/ts),texture2D(uBones,(vec2(x+2.,y)+vec2(.5,.5))/ts),texture2D(uBones,(vec2(x+3.,y)+vec2(.5,.5))/ts));}
 void main(){float ghost=step(.5,aExtra.x);float past=uTrail<.02?0.:aExtra.x;mat4 skin=bone(skinIndex.x,past)*skinWeight.x+bone(skinIndex.y,past)*skinWeight.y+bone(skinIndex.z,past)*skinWeight.z+bone(skinIndex.w,past)*skinWeight.w;
 vec3 p=(skin*vec4(position,1.)).xyz;vec3 n=normalize((skin*vec4(normal,0.)).xyz);float turbulence=(.006+uEnergy*.012)*(1.-ghost)+ghost*uScatter*(uMode>1.5?.15:.035);p+=n*sin(aExtra.z+uTime*2.3)*turbulence;
 if(ghost>.5){p+=vec3(sin(aExtra.z+uTime*.6),cos(aExtra.z+uTime*.5),sin(aExtra.z*.7))*.035*uScatter;}
 vec4 view=viewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=aExtra.y*uDpr*(3.8/-view.z)*(1.+uBeat*.12);float facing=.4+.6*abs(dot(n,vec3(0.,0.,1.)));vAlpha=mix(.72,.18+uTrail*.23,ghost)*facing;vGlow=ghost;
 }`,fragmentShader:`uniform vec3 uColor;varying float vAlpha;varying float vGlow;void main(){float d=length(gl_PointCoord-vec2(.5))*2.;if(d>1.)discard;gl_FragColor=vec4(mix(uColor,vec3(.94,1.,.97),.3),exp(-d*d*4.)*vAlpha);}`});
 particles=new T.Points(pointGeo,pointMat);particles.frustumCulled=false;particles.renderOrder=2;scene.add(particles);
 buildAnatomy();stats.vertices=pos.count;stats.bones=bones.length;stats.ready=true;ready=true;return api;
 })();
 function retarget(j,state,time){
  const up=new T.Vector3().subVectors(V([j[33].x,j[33].y,j[33].z]),V([j[34].x,j[34].y,j[34].z])).normalize();const right=V([j[12].x-j[11].x,j[12].y-j[11].y,j[12].z-j[11].z]).normalize();const front=new T.Vector3().crossVectors(right,up).normalize();right.crossVectors(up,front).normalize();torsoQ.setFromRotationMatrix(new T.Matrix4().makeBasis(right,up,front));
  const desired=new Map();for(const side of ['L','R']){const ids=side==='L'?[12,14,16,24,26,28,32]:[11,13,15,23,25,27,31];const [shoulder,elbow,wrist,hip,knee,ankle,toe]=ids;
   for(const [prefix,startName,endName,a,b] of [['upperarm','upperarm01','lowerarm01',shoulder,elbow],['lowerarm','lowerarm01','wrist',elbow,wrist],['upperleg','upperleg01','lowerleg01',hip,knee],['lowerleg','lowerleg01','foot',knee,ankle]]){
    const rest=new T.Vector3().subVectors(byName[endName+'.'+side].userData.rest,byName[startName+'.'+side].userData.rest).normalize();const target=V([j[b].x-j[a].x,j[b].y-j[a].y,j[b].z-j[a].z]).normalize();const rot=new T.Quaternion().setFromUnitVectors(rest,target);desired.set(prefix+'01.'+side,rot);desired.set(prefix+'02.'+side,rot);if(prefix==='lowerarm')desired.set('wrist.'+side,rot.clone());
   }
  }
  for(const bone of order){const name=bone.name,bi=bone.userData.index,parent=model.bones[bi].parent,rest=bone.userData.rest;bone.quaternion.identity();bone.scale.set(1,1,1);
   if(parent<0){bone.position.copy(rest);bone.position.x+=j[34].x;bone.position.y+=j[34].y;bone.position.z+=j[34].z;bone.userData.worldQ=bone.quaternion.clone();continue;}
   pQ.copy(bones[parent].userData.worldQ||identity);
   if(name.startsWith('spine'))q.identity().slerp(torsoQ,.85);
   else if(name.startsWith('neck')||name==='head'){const dir=V([j[0].x-j[33].x,j[0].y-j[33].y,j[0].z-j[33].z]).normalize();q.setFromUnitVectors(new T.Vector3(0,1,0),dir);if(name==='head')q.slerp(torsoQ,.15);}
   else if(desired.has(name))q.copy(desired.get(name));else q.copy(pQ);
   bone.quaternion.copy(pQ).invert().multiply(q);
   const limit=name.startsWith('lowerarm')?2.25:name.startsWith('lowerleg')?1.95:Math.PI;if(bone.quaternion.angleTo(identity)>limit){bone.quaternion.slerp(identity,1-limit/bone.quaternion.angleTo(identity));stats.limitedFrames++;}
   if(name.startsWith('finger'))bone.quaternion.setFromAxisAngle(new T.Vector3(1,0,0),(.07+.08*Math.sin(time*2+bi*.3)+state.high*.22)*Math.min(1,state.drive));
   if(name.startsWith('toe'))bone.quaternion.setFromAxisAngle(new T.Vector3(1,0,0),Math.sin(time+bi)*state.low*.045);
   bone.userData.worldQ=pQ.clone().multiply(bone.quaternion);
  }
 }
 const spriteCanvas=document.createElement('canvas');spriteCanvas.width=spriteCanvas.height=32;const spriteCtx=spriteCanvas.getContext('2d'),gradient=spriteCtx.createRadialGradient(16,16,0,16,16,16);gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.28,'rgba(255,255,255,.85)');gradient.addColorStop(1,'rgba(255,255,255,0)');spriteCtx.fillStyle=gradient;spriteCtx.fillRect(0,0,32,32);const sprite=new T.CanvasTexture(spriteCanvas);
 function material(color,opacity){const m=new T.PointsMaterial({color,size:.009,map:sprite,transparent:true,opacity,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,sizeAttenuation:true});m.userData.opacity=opacity;internals.push(m);return m;}
 function particleGeometry(geometry,number){const helper=new T.Mesh(geometry);const sampler=new MeshSurfaceSampler(helper).build();const p=new T.Vector3(),out=[];const count=Math.floor(number*(innerWidth<761?.55:1));for(let i=0;i<count;i++){sampler.sample(p);out.push(p.x,p.y,p.z);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(out,3));stats.internalParticles=(stats.internalParticles||0)+count;return g;}
 function attachGeometry(geometry,boneName,mat){const bone=byName[boneName];geometry.translate(-bone.userData.rest.x,-bone.userData.rest.y,-bone.userData.rest.z);const count=Math.min(6500,Math.max(350,Math.floor(geometry.getAttribute('position').count*.4)));const obj=new T.Points(particleGeometry(geometry,count),mat);obj.renderOrder=3;bone.add(obj);return obj;}
 function buildAnatomy(){
  const boneMat=material(0x9cd5c0,.30),organMat=material(0xa6ffe1,.62),vesselMat=material(0xa6ffe1,.35);
  const cage=[];for(let i=0;i<12;i++){const y=.685-i*.026,width=.205-Math.pow((i-5)/12,2)*.13;for(const s of [-1,1]){cage.push(tube([[0,y-.01,-.035],[s*width*.75,y+.017,-.005],[s*width,y,.045],[s*width*.67,y-.02,.136],[s*.025,y-.026,.16]],.004));}}
  for(let i=0;i<19;i++){const y=.10+i*.035;const z=-.075+.018*Math.sin(i*.22);cage.push(sphere([0,y,z],[.018,.012,.015]));}
  cage.push(tube([[0,.73,.055],[0,.64,.16],[0,.43,.15]],.009));
  for(const s of [-1,1])cage.push(tube([[s*.012,.73,.12],[s*.08,.74,.12],[s*.18,.70,.07],[s*.23,.67,.03]],.006));
  ribs=attachGeometry(merged(cage),'spine01',boneMat);
  const pelvis=[];for(const s of [-1,1]){pelvis.push(tube([[0,.03,-.045],[s*.12,.04,-.03],[s*.19,-.04,.04],[s*.12,-.15,.1],[0,-.16,.07]],.012));pelvis.push(tube([[s*.12,.04,-.03],[s*.13,-.08,.055],[0,-.16,.07]],.007));}attachGeometry(merged(pelvis),'root',boneMat);
  for(const name of ['upperarm01.L','upperarm02.L','lowerarm01.L','lowerarm02.L','upperarm01.R','upperarm02.R','lowerarm01.R','lowerarm02.R','upperleg01.L','upperleg02.L','lowerleg01.L','lowerleg02.L','upperleg01.R','upperleg02.R','lowerleg01.R','lowerleg02.R']){const b=model.bones[byName[name].userData.index];attachGeometry(tube([b.head,b.tail],name.includes('leg')?.009:.006),name,boneMat);}
  // Anatomical left is +X in the model, to the viewer's right from the front.
  for(const left of [true,false]){const g=new T.SphereGeometry(1,24,18);const a=g.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i),x=a.getX(i),z=a.getZ(i);let width=(left?.082:.102)*(1-.2*y);let px=x*width;if(left&&x<0&&y<.1&&y>-.65)px+=.025*(1-Math.abs(y+.25));a.setXYZ(i,px,y*(left?.153:.143),z*.073);}g.computeVertexNormals();const lung=new T.Points(particleGeometry(g,1800),organMat.clone());lung.renderOrder=3;byName.spine01.add(lung);internals.push(lung.material);lung.material.userData.opacity=.32;lung.position.set((left?.105:-.11)-byName.spine01.userData.rest.x,.565-byName.spine01.userData.rest.y,.045-byName.spine01.userData.rest.z);if(left)leftLung=lung;else rightLung=lung;}
  const heartShape=new T.LatheGeometry([new T.Vector2(0,-.105),new T.Vector2(.018,-.083),new T.Vector2(.044,-.025),new T.Vector2(.055,.035),new T.Vector2(.046,.075),new T.Vector2(.025,.092),new T.Vector2(0,.09)],24);heartShape.scale(1,1,.72);heart=new T.Points(particleGeometry(heartShape,1300),organMat);heart.renderOrder=3;byName.spine01.add(heart);heart.position.set(.027-byName.spine01.userData.rest.x,.49-byName.spine01.userData.rest.y,.105-byName.spine01.userData.rest.z);heart.rotation.z=.30;
  const vessels=[tube([[0,.82,.045],[0,.69,.07],[0,.64,.075]],.01),tube([[0,.64,.075],[-.04,.61,.07],[-.13,.59,.035]],.007),tube([[0,.64,.075],[.04,.61,.07],[.12,.59,.035]],.007),tube([[.025,.56,.105],[.035,.64,.10],[.005,.67,.09],[-.035,.63,.07],[-.02,.48,-.01],[-.015,.34,-.025]],.009),tube([[.07,.55,.11],[.08,.65,.08],[.055,.74,.05]],.007)];
  for(const s of [-1,1]){for(const d of [-1,1])vessels.push(tube([[s*.06,.615,.055],[s*.115,.60,.035],[s*.15,.60+d*.06,.025]],.003));}
  attachGeometry(merged(vessels),'spine01',vesselMat);
  const eyeMat=new T.PointsMaterial({color:0xc8ffea,size:.005,map:sprite,transparent:true,opacity:.28,depthWrite:false});for(const side of ['L','R']){const eye=new T.Points(particleGeometry(new T.SphereGeometry(.015,12,8),90),eyeMat);eye.position.copy(V(model.eyes[side])).sub(byName.head.userData.rest);byName.head.add(eye);}
 }
 return api;
}
