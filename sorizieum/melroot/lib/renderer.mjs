import * as THREE from 'three';
import {screenRollQuaternion,palmQuaternion} from './screen-axis.mjs?v=3.4';
import {GLTFLoader} from './vendor/three/GLTFLoader.js';
import {rootOffsets,fingerOffsets,lensExpression} from './character-rig.mjs?v=3.4';
import {createGarden} from './garden.mjs?v=3.6';
export async function createRenderer(container,options={}){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;container.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera();camera.position.set(0,.54,3);camera.lookAt(0,.51,0);
 scene.add(new THREE.HemisphereLight(0xfff8e6,0x78735e,2.2));
 for(const [color,intensity,pos] of [[0xffedd2,3,[-2,3,4]],[0xedf5ff,1.3,[3,1,2]],[0xffffff,1.5,[0,2,-3]]]){const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);}
 const gltf=await new GLTFLoader().loadAsync(options.modelUrl||'assets/melroot-optimized-v3.glb?v=3.4');const model=gltf.scene;scene.add(model);model.updateMatrixWorld(true);
 const garden=createGarden();scene.add(garden.group);
 const bones=new Map(),roots=[];
 model.traverse(o=>{
  if(o.isBone){const world=o.getWorldQuaternion(new THREE.Quaternion());bones.set(o.name,{bone:o,rest:o.quaternion.clone(),restWorld:world.clone(),smoothed:o.quaternion.clone(),axes:['x','y','z'].map((_,i)=>new THREE.Vector3(i===0?1:0,i===1?1:0,i===2?1:0).applyQuaternion(world.clone().invert()))});}
  if(o.isMesh){o.frustumCulled=false;const positions=o.geometry.attributes.position.array,offsets=rootOffsets(positions);o.geometry.morphTargetsRelative=true;o.geometry.morphAttributes.position=[offsets.left,offsets.right,...fingerOffsets(positions)].map(a=>new THREE.Float32BufferAttribute(a,3));o.updateMorphTargets();roots.push(o);}
 });
 // A thin mechanical shutter sits over the original single projector lens.
 // It follows Head in its bind pose; no source eye morph or added human mouth.
 const lensMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{open:{value:1},aperture:{value:.78},warmth:{value:0},brow:{value:0}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
 varying vec2 vUv;uniform float open;uniform float aperture;uniform float warmth;uniform float brow;
 void main(){vec2 p=(vUv-.5)*2.;float r=length(p);if(r>1.)discard;
 float edge=sqrt(max(0.,1.-p.x*p.x));float smileCurve=warmth*.17*(1.-p.x*p.x);
 bool shutter=abs(p.y+smileCurve+brow*.06)>open*edge;
 bool iris=aperture>1.01&&r>1./aperture;
 float glow=(aperture-1.)*1.2+warmth*.12;
 if(!shutter&&!iris){if(glow<.005)discard;gl_FragColor=vec4(1.,.7,.3,glow*(1.-r));return;}
 vec3 metal=mix(vec3(.28,.24,.16),vec3(.63,.43,.19),warmth*.7);
 metal*=.7+.3*(p.y+1.)*.5;metal*=1.-.45*exp(-abs(p.y+smileCurve)*150.);gl_FragColor=vec4(metal,shutter?1.:.8);
 }`});
 const lens=new THREE.Mesh(new THREE.PlaneGeometry(.108,.108),lensMaterial);lens.position.set(-.035,.823,.236);lens.rotation.z=.17;lens.visible=options.faceOverlay!==false;scene.add(lens);bones.get('Head')?.bone.attach(lens);
 // Retarget shoulder and elbow directions independently, in world coordinates.
 const chains=[['left','UpperArmL','ForearmL','HandL'],['right','UpperArmR','ForearmR','HandR']];
 for(const [side,upper,fore,hand] of chains)for(const [name,child] of [[upper,fore],[fore,hand]]){
  const r=bones.get(name),c=bones.get(child);if(r&&c)r.direction=c.bone.getWorldPosition(new THREE.Vector3()).sub(r.bone.getWorldPosition(new THREE.Vector3())).normalize();
 }
 const aimWorld=new THREE.Quaternion(),aimLocal=new THREE.Quaternion(),parentWorld=new THREE.Quaternion(),aimVector=new THREE.Vector3();
 function aim(name,direction,weight,dt){const r=bones.get(name);if(!r?.direction)return;
  aimLocal.copy(r.bone.quaternion);
  if(Array.isArray(direction)&&direction.length===3&&direction.every(Number.isFinite)&&weight>0){
   aimVector.fromArray(direction).normalize();r.bone.parent.updateWorldMatrix(true,false);
   aimWorld.setFromUnitVectors(r.direction,aimVector).multiply(r.restWorld);
   r.bone.parent.getWorldQuaternion(parentWorld);aimWorld.premultiply(parentWorld.invert());
   aimLocal.slerp(aimWorld,Math.min(1,weight));
  }
  r.smoothed.slerp(aimLocal,1-Math.exp(-dt*14));r.bone.quaternion.copy(r.smoothed);r.bone.updateWorldMatrix(false,true);
 }
 const cv=document.createElement('canvas');cv.width=cv.height=128;const ctx=cv.getContext('2d'),g=ctx.createRadialGradient(64,64,2,64,64,64);g.addColorStop(0,'rgba(65,72,43,.18)');g.addColorStop(1,'rgba(65,72,43,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(.8,.42),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.014;scene.add(shadow);
 const quat=new THREE.Quaternion();let rendered=0,mode='upper';const start=performance.now();
 function turn(name,angles){const r=bones.get(name);if(!r)return;r.bone.quaternion.copy(r.rest);angles.forEach((a,i)=>{if(a)r.bone.quaternion.multiply(quat.setFromAxisAngle(r.axes[i],a));});}
 const size=()=>{const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const range=Math.max(mode==='full'?1.38:1.20,(mode==='full'?1.08:.92)*h/w);camera.left=-range*w/h/2;camera.right=range*w/h/2;camera.top=.51+range/2-.54;camera.bottom=.51-range/2-.54;camera.updateProjectionMatrix();};new ResizeObserver(size).observe(container);size();
 const current={yaw:0,pitch:0,roll:0,leftArm:0,rightArm:0,lean:0,float:0,rootX:0,crouch:0,hipLean:0,leftLift:0,rightLift:0,leftKnee:0,rightKnee:0,blink:0,mouth:0,smile:0,brow:0,leftWrist:0,rightWrist:0};const fingers={left:[0,0,0,0,0],right:[0,0,0,0,0]};let last=performance.now();
 return {
  setMode(next){mode=next;size();},
  draw(p,now){const dt=Math.max(0,Math.min(.1,(now-last)/1000));last=now;for(const k in current){const target=Number.isFinite(p[k])?p[k]:0;const rate=k==='blink'?45:12;current[k]+=(target-current[k])*(1-Math.exp(-dt*rate));}
   turn('Head',[current.pitch,current.yaw,current.roll]);turn('UpperArmL',[0,0,-current.leftArm]);turn('UpperArmR',[0,0,current.rightArm]);
   turn('UpperArm.L',[0,0,-current.leftArm]);turn('UpperArm.R',[0,0,current.rightArm]);turn('Spine',[current.crouch*.18,0,current.lean+current.hipLean]);
   for(const [side,upper,fore] of chains){turn(fore,[0,0,0]);aim(upper,p[side+'UpperDir'],p[side+'UpperWeight'],dt);aim(fore,p[side+'ForeDir'],p[side+'ForeWeight'],dt);}
   for(const [side,,,name] of chains){const r=bones.get(name);if(r){r.bone.parent.updateWorldMatrix(true,false);r.bone.parent.getWorldQuaternion(parentWorld);let q=screenRollQuaternion(parentWorld,r.rest,current[side+'Wrist']*.9);if(p[side+'PalmWeight']>0&&p[side+'PalmForward']&&p[side+'PalmNormal'])q.slerp(palmQuaternion(parentWorld,r.restWorld,p[side+'PalmForward'],p[side+'PalmNormal']),p[side+'PalmWeight']);r.smoothed.slerp(q,1-Math.exp(-dt*18));r.bone.quaternion.copy(r.smoothed);}}
   for(const side of ['left','right'])for(let i=0;i<5;i++){const v=p[side+'Fingers']?.[i];fingers[side][i]+=((Number.isFinite(v)?v:0)-fingers[side][i])*(1-Math.exp(-dt*20));}
   for(const m of roots){m.morphTargetInfluences[0]=Math.min(1,current.leftLift+current.leftKnee*.35);m.morphTargetInfluences[1]=Math.min(1,current.rightLift+current.rightKnee*.35);for(let i=0;i<5;i++){m.morphTargetInfluences[2+i]=fingers.left[i];m.morphTargetInfluences[7+i]=fingers.right[i];}}
   model.position.set(current.rootX,current.float-current.crouch*.045,0);model.scale.y=1-current.crouch*.07;shadow.position.x=current.rootX;
   const expression=lensExpression(current);for(const k of Object.keys(expression))lensMaterial.uniforms[k].value=expression[k];
   garden.update(p,now);renderer.render(scene,camera);rendered++;
  },
  diagnostics(){return {renderedFrames:rendered,boneNames:[...bones.keys()],triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,averageFps:rendered/((performance.now()-start)/1000),canvas:{width:renderer.domElement.width,height:renderer.domElement.height},mode,armQuaternions:Object.fromEntries(chains.flatMap(([,u,f])=>[u,f]).map(n=>[n,bones.get(n)?.bone.quaternion.toArray()])),motion:{...current},fingers:{left:[...fingers.left],right:[...fingers.right]},expression:lensExpression(current),rootMorphs:roots.map(m=>[...m.morphTargetInfluences]),modelLoaded:true,garden:garden.diagnostics()};}
 };
}
