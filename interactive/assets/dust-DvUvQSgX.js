import{Z as ne,S as J,c as ae,i as se,s as ie,a as Q}from"./hud-BKAypk3y.js";/* empty css                   */import{c as ce}from"./cover-Co5bYYBp.js";import{O as k}from"./one-euro-B79NrZW_.js";import{c as g,a as fe,u as ue,F as de}from"./gl-BA_3AQBI.js";const K=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],ee={mouthUpper:13,mouthLower:14};async function me(e){const n="/interactive/",t=await ne.forVisionTasks(`${n}wasm`),s={baseOptions:{modelAssetPath:`${n}models/face_landmarker.task`,delegate:"GPU"},runningMode:"VIDEO",numFaces:1,outputFaceBlendshapes:!0};let o;try{o=await J.createFromOptions(t,s)}catch{o=await J.createFromOptions(t,{...s,baseOptions:{...s.baseOptions,delegate:"CPU"}})}const r={};let a={landmarks:null,blend:r,present:!1},i=-1;return{read(){if(e.readyState<2||e.currentTime===i)return a;i=e.currentTime;const f=o.detectForVideo(e,performance.now()),d=f.faceLandmarks[0];if(!d)return a={landmarks:null,blend:r,present:!1},a;const u=f.faceBlendshapes[0]?.categories;if(u)for(const m of u)r[m.categoryName]=m.score;return a={landmarks:d.map(m=>({x:1-m.x,y:m.y})),blend:r,present:!0},a},dispose(){o.close()}}}const le=.5,Z=.35,z=new WeakMap;function oe(e,n){return n>=(e?Z:le)}function te(e){const n=Math.max(0,Math.floor(e)),t={n,pos:new Float32Array(n*2),vel:new Float32Array(n*2),home:new Float32Array(n*2),scatter:new Float32Array(n),seeded:!1};return z.set(t,{wasOpen:!1,missingFor:0}),t}function re(e){if(e.length===0)return{x:0,y:0,w:0,h:0};let n=e[0].x,t=e[0].y,s=n,o=t;for(let r=1;r<e.length;r++){const a=e[r];a.x<n&&(n=a.x),a.y<t&&(t=a.y),a.x>s&&(s=a.x),a.y>o&&(o=a.y)}return{x:n,y:t,w:s-n,h:o-t}}function he(e,n){if(n.length<3)return!1;let t=!1,s=n.length-1;for(let o=0;o<n.length;o++){const r=n[s],a=n[o],i=a.x-r.x,f=a.y-r.y,d=(e.x-r.x)*f-(e.y-r.y)*i,u=1e-9*Math.max(1,Math.abs(i),Math.abs(f));if(Math.abs(d)<=u&&e.x>=Math.min(r.x,a.x)-u&&e.x<=Math.max(r.x,a.x)+u&&e.y>=Math.min(r.y,a.y)-u&&e.y<=Math.max(r.y,a.y)+u)return!0;if(r.y>e.y!=a.y>e.y){const m=r.x+(e.y-r.y)*i/f;e.x<m&&(t=!t)}s=o}return t}function q(e,n,t){const s=re(n);if(n.length<3||s.w<=0||s.h<=0)throw new Error("Cannot seed dust into a degenerate face oval");const o={x:0,y:0};for(let r=0;r<e.n;r++){let a=n[0].x,i=n[0].y;for(let d=0;d<512;d++)if(o.x=s.x+t()*s.w,o.y=s.y+t()*s.h,he(o,n)){a=o.x,i=o.y;break}const f=r*2;e.home[f]=(a-s.x)/s.w,e.home[f+1]=(i-s.y)/s.h,e.pos[f]=a,e.pos[f+1]=i}e.vel.fill(0),e.scatter.fill(0),e.seeded=!0,z.set(e,{wasOpen:!1,missingFor:0})}function pe(e){const n=e[1],t=e[33],s=e[263];if(!n||!t||!s)return 0;const o=Math.abs(s.x-t.x);if(o<1e-6)return 0;const r=(t.x+s.x)*.5;return Math.max(-1,Math.min(1,(n.x-r)/(o*.5)))}function xe(e,n,t,s){const o=t.bbox;if(!e.seeded||!o||o.w<=0||o.h<=0||n<=0)return;const r=Math.min(n,.1),a=z.get(e)??{wasOpen:!1,missingFor:0};z.set(e,a),a.missingFor=t.present?0:a.missingFor+r;const i=t.present&&oe(a.wasOpen,t.jawOpen)&&t.mouth!==null,f=i&&!a.wasOpen,d=Math.max(o.w,1),u=i?Math.min(1,Math.max(0,(t.jawOpen-Z)/(1-Z))):0,m=t.browUp>=.5?4:1,B=!t.present&&a.missingFor>=30,l=i||B?0:18*(t.present?1:.2),E=Math.exp(-(i?1.5:B?.25:t.present?6:2.4)*r),D=Math.exp(-(t.present?4:.5)*r),P=1-Math.exp(-8*r),S=i?d*.75*m:B?d*.02:d*.004*l*m,_=f?d*(1.25+1.35*u):0,L=i?d*(.35+1.2*u):0,Y=i?t.yaw*d*1.6*u:0,p=t.present?0:d*(B?.008:.012),w=Math.max((o.x+o.w*.5)*2,o.x+o.w*2.5),b=Math.max((o.y+o.h*.5)*2,o.y+o.h+o.w*.6);for(let c=0;c<e.n;c++){const y=c*2,V=o.x+e.home[y]*o.w,N=o.y+e.home[y+1]*o.h;let x=e.pos[y],v=e.pos[y+1],F=e.vel[y]*E,h=e.vel[y+1]*E;const U=c*12.9898+s*1.73,A=Math.sin(U+v*.006),G=-Math.sin(c*78.233-s*1.31+x*.006);if(F+=((V-x)*l+A*S+Y)*r,h+=((N-v)*l+G*S)*r,p>0&&(F+=(Math.sin(s*.37+c*.013)+.35)*p*r,h+=Math.cos(s*.29+c*.017)*p*r),i&&t.mouth){let R=x-t.mouth.x,C=v-t.mouth.y,O=Math.hypot(R,C);if(O<1e-4){const I=c*2.399963229728653;R=Math.cos(I),C=Math.sin(I),O=1}const W=R/O,X=C/O;F+=W*L*r,h+=X*L*r,_>0&&(F+=W*_,h+=X*_)}x+=F*r,v+=h*r;const M=12;x<0?F+=-x*M*r:x>w&&(F+=(w-x)*M*r),v<0?h+=-v*M*r:v>b&&(h+=(b-v)*M*r),Number.isFinite(x+v+F+h)||(x=V,v=N,F=0,h=0),e.pos[y]=x,e.pos[y+1]=v,e.vel[y]=F,e.vel[y+1]=h,e.scatter[c]=i?e.scatter[c]+(1-e.scatter[c])*P:e.scatter[c]*D}a.wasOpen=i}const ve=`#version 300 es
precision highp float;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aHome;
layout(location = 2) in float aScatter;

uniform sampler2D uVideo;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform vec4 uBBox;
uniform float uDpr;
uniform float uPresence;

out vec3 vColor;
out float vScatter;
out float vPresence;

void main() {
  vec2 clip = aPosition / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  vec2 homePx = uBBox.xy + aHome * uBBox.zw;
  vec2 screenUv = homePx / uResolution;
  vec2 videoUv = screenUv * uCover + (1.0 - uCover) * 0.5;
  videoUv.x = 1.0 - videoUv.x;
  vec3 liveColor = texture(uVideo, clamp(videoUv, 0.0, 1.0)).rgb;
  vec3 cyan = vec3(0.368627, 0.905882, 0.952941);
  vColor = mix(liveColor, cyan, clamp(aScatter * 0.8, 0.0, 0.8));
  vScatter = aScatter;
  vPresence = uPresence;
  gl_PointSize = (3.0 + aScatter * 1.5) * uDpr;
}
`,we=`#version 300 es
precision highp float;

in vec3 vColor;
in float vScatter;
in float vPresence;
out vec4 outColor;

void main() {
  float radius = length(gl_PointCoord - 0.5) * 2.0;
  if (radius >= 1.0) discard;
  float soft = 1.0 - smoothstep(0.12, 1.0, radius);
  float core = 1.0 - smoothstep(0.0, 0.32, radius);
  vec3 white = vec3(0.968627, 0.980392, 0.988235);
  vec3 lit = mix(vColor, white, core * 0.22);
  // Bright enough that the assembled face reads as a face; scattered sparks
  // are sparser so they can afford to be a little dimmer.
  float energy = (1.15 - vScatter * 0.25) * (0.58 + vPresence * 0.42);
  outColor = vec4(lit * soft * energy, soft);
}
`,ye=`#version 300 es
precision highp float;

uniform sampler2D uVideo;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uDpr;
uniform float uTime;
uniform bool uShowVideo;
out vec4 outColor;

void main() {
  vec3 ink = vec3(0.050980, 0.054902, 0.062745);
  vec3 key = vec3(0.164706, 0.168627, 0.180392);
  vec2 screenUv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
  vec2 videoUv = screenUv * uCover + (1.0 - uCover) * 0.5;
  videoUv.x = 1.0 - videoUv.x;
  vec3 color = ink;
  if (uShowVideo) color = mix(ink, texture(uVideo, clamp(videoUv, 0.0, 1.0)).rgb, 0.12);

  float spacing = 40.0 * uDpr;
  vec2 drift = vec2(uTime * 2.4, uTime * -1.6) * uDpr;
  vec2 gridCell = mod(gl_FragCoord.xy + drift, spacing) - spacing * 0.5;
  float dot = 1.0 - smoothstep(0.3 * uDpr, 1.1 * uDpr, length(gridCell));
  float breathe = 0.32 + 0.10 * sin(uTime * 0.8);
  color = mix(color, key, dot * breathe);
  outColor = vec4(color, 1.0);
}
`;function Fe(e){const n=g(e,ve,we),t=g(e,de,ye),s=fe(e,{filter:"linear",wrap:"clamp"}),o=e.createVertexArray(),r=e.createVertexArray(),a=e.createBuffer(),i=e.createBuffer(),f=e.createBuffer();e.bindVertexArray(o),e.bindBuffer(e.ARRAY_BUFFER,a),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,i),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,f),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,1,e.FLOAT,!1,0,0),e.useProgram(n),e.uniform1i(e.getUniformLocation(n,"uVideo"),0),e.useProgram(t),e.uniform1i(e.getUniformLocation(t,"uVideo"),0);const d=e.getUniformLocation(n,"uResolution"),u=e.getUniformLocation(n,"uCover"),m=e.getUniformLocation(n,"uBBox"),B=e.getUniformLocation(n,"uDpr"),l=e.getUniformLocation(n,"uPresence"),E=e.getUniformLocation(t,"uResolution"),D=e.getUniformLocation(t,"uCover"),P=e.getUniformLocation(t,"uDpr"),S=e.getUniformLocation(t,"uTime"),_=e.getUniformLocation(t,"uShowVideo");let L=-1;const Y=p=>{L!==p.n&&(L=p.n,e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,p.pos.byteLength,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,p.home.byteLength,e.DYNAMIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,f),e.bufferData(e.ARRAY_BUFFER,p.scatter.byteLength,e.DYNAMIC_DRAW))};return{render(p,w,b,c){e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clearColor(.05098,.054902,.062745,1),e.clear(e.COLOR_BUFFER_BIT),e.activeTexture(e.TEXTURE0),ue(e,s,p),e.disable(e.BLEND),e.useProgram(t),e.bindVertexArray(r),e.uniform2f(E,e.drawingBufferWidth,e.drawingBufferHeight),e.uniform2f(D,c.coverX,c.coverY),e.uniform1f(P,c.dpr),e.uniform1f(S,c.time),e.uniform1i(_,c.showVideo?1:0),e.drawArrays(e.TRIANGLES,0,3),!(!w.seeded||!b)&&(Y(w),e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferSubData(e.ARRAY_BUFFER,0,w.pos),e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferSubData(e.ARRAY_BUFFER,0,w.home),e.bindBuffer(e.ARRAY_BUFFER,f),e.bufferSubData(e.ARRAY_BUFFER,0,w.scatter),e.useProgram(n),e.bindVertexArray(o),e.uniform2f(d,e.drawingBufferWidth,e.drawingBufferHeight),e.uniform2f(u,c.coverX,c.coverY),e.uniform4f(m,b.x,b.y,b.w,b.h),e.uniform1f(B,c.dpr),e.uniform1f(l,c.presence),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.drawArrays(e.POINTS,0,w.n),e.disable(e.BLEND))},dispose(){e.deleteBuffer(a),e.deleteBuffer(i),e.deleteBuffer(f),e.deleteVertexArray(o),e.deleteVertexArray(r),e.deleteTexture(s),e.deleteProgram(n),e.deleteProgram(t)}}}const H=document.getElementById("stage"),T=document.getElementById("cam");async function be(){const e=ae({title:"05 DUST FACE",sub:"BLENDSHAPE PARTICLES",hint:"카메라를 정면으로 보세요 · 입을 벌리면 얼굴이 흩어집니다 · 다물면 돌아옵니다",snapshot:()=>H,slug:"dust"});document.body.append(e.el);try{await se(T)}catch(h){ie(h);return}const n=await me(T),t=H.getContext("webgl2",{preserveDrawingBuffer:!0});if(!t){console.error("[dust] WebGL2 is not available"),n.dispose(),Q(T);return}const s=Fe(t);let o=te(2e4),r=1;const a=()=>{r=Math.min(window.devicePixelRatio,2),H.width=Math.round(window.innerWidth*r),H.height=Math.round(window.innerHeight*r)};a(),window.addEventListener("resize",a);const i={x:new k(1.2,.35),y:new k(1.2,.35),w:new k(1,.25),h:new k(1,.25)},f={x:new k(1.4,.45),y:new k(1.4,.45)},d=new k(1.1,.2),u=K.map(()=>({x:0,y:0})),m={x:0,y:0,w:0,h:0},B={x:0,y:0},l={present:!1,bbox:null,mouth:null,jawOpen:0,browUp:0,yaw:0};let E=!1,D=!1,P=!1;const S=h=>{const U=h.key.toLowerCase();U==="v"?(P=!P,e.flash(P?"LIVE FEED ON":"LIVE FEED OFF")):U==="r"&&(E?(q(o,u,Math.random),e.flash("RESEEDED")):D=!0)};window.addEventListener("keydown",S);const _=()=>{i.x.reset(),i.y.reset(),i.w.reset(),i.h.reset(),f.x.reset(),f.y.reset(),d.reset()},L=performance.now();let Y=L,p=60,w=0,b=!1,c=0,y=!1,V=!1,N=!0,x=0;const v=()=>{if(!N)return;const h=performance.now(),U=Math.min((h-Y)/1e3,.1),A=(h-L)/1e3;Y=h;const G=1/Math.max(U,.001);p+=(G-p)*(1-Math.exp(-U*3)),w=p<40?w+U:0;const M=ce(T.videoWidth,T.videoHeight,H.width,H.height),R=n.read(),C=R.landmarks;if(R.present&&C){y||_();for(let j=0;j<K.length;j++){const $=M.toScreen(C[K[j]]);u[j].x=$.x,u[j].y=$.y}const O=re(u);m.x=i.x.filter(O.x,A),m.y=i.y.filter(O.y,A),m.w=i.w.filter(O.w,A),m.h=i.h.filter(O.h,A);const W=M.toScreen(C[ee.mouthUpper]),X=M.toScreen(C[ee.mouthLower]);B.x=f.x.filter((W.x+X.x)*.5,A),B.y=f.y.filter((W.y+X.y)*.5,A),E=!0,(!o.seeded||D)&&(q(o,u,Math.random),D&&e.flash("RESEEDED"),D=!1),l.present=!0,l.bbox=m,l.mouth=B,l.jawOpen=R.blend.jawOpen??0,l.browUp=R.blend.browInnerUp??0,l.yaw=d.filter(pe(C),A);const I=oe(V,l.jawOpen);I!==V&&e.flash(I?"SCATTER":"REFORM"),V=I}else l.present=!1,l.bbox=E?m:null,l.mouth=null,l.jawOpen=0,l.browUp=0,l.yaw=0,V=!1;y=R.present,c+=((R.present?1:0)-c)*(1-Math.exp(-U*6)),!b&&w>=3&&(b=!0,o=te(1e4),E&&q(o,u,Math.random),e.flash("PERFORMANCE MODE")),xe(o,U,l,A),s.render(T,o,E?m:null,{coverX:M.coverX,coverY:M.coverY,dpr:r,time:A,presence:c,showVideo:P}),e.setTracking(R.present),e.setFps(p),x=requestAnimationFrame(v)},F=()=>{N&&(N=!1,cancelAnimationFrame(x),window.removeEventListener("resize",a),window.removeEventListener("keydown",S),s.dispose(),n.dispose(),Q(T))};window.addEventListener("pagehide",F,{once:!0}),x=requestAnimationFrame(v)}be();
