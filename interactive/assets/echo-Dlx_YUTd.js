import{c as F,i as b,s as P,a as D}from"./vision_bundle-DMihNofT.js";/* empty css                   */import{c as X}from"./cover-Co5bYYBp.js";import{c as G}from"./segmenter-BjlhupWi.js";import{c as l,a as O,u as B,F as H}from"./gl-BA_3AQBI.js";const C=[94/255,231/255,243/255],I=[255/255,90/255,31/255];class W{capacity;stamps;cursor=0;written=0;constructor(n){if(!Number.isInteger(n)||n<1)throw new RangeError("FrameRing capacity must be a positive integer");this.capacity=n,this.stamps=new Float64Array(n)}get size(){return this.written}push(n){const r=this.cursor;return this.stamps[r]=n,this.cursor=(r+1)%this.capacity,this.written=Math.min(this.written+1,this.capacity),r}pick(n){if(this.written===0)return-1;let r=0,i=Math.abs(this.stamps[0]-n);const a=this.written<this.capacity?this.written:this.capacity;for(let c=1;c<a;c++){const T=Math.abs(this.stamps[c]-n);T<i&&(r=c,i=T)}return r}newest(){return this.written===0?-1/0:this.stamps[(this.cursor-1+this.capacity)%this.capacity]}}function Y(e,n){const r=Math.min(1,Math.max(0,(e-1)/(n-1))),i=(a,c)=>a+(c-a)*r;return[i(C[0],I[0]),i(C[1],I[1]),i(C[2],I[2]),i(.6,.15)]}function V(e){return Math.min(.3,Math.max(.04,e))}const S=6,z=`#version 300 es
precision highp float;

uniform sampler2D uFrame;
uniform sampler2D uMask;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform vec4 uTint;
uniform float uPresence;
uniform float uFeed;
uniform float uTime;
uniform int uMode;

out vec4 fragColor;

const vec3 INK = vec3(13.0, 14.0, 16.0) / 255.0;

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
  vec2 sourceUv = (uv - 0.5) * uCover + 0.5;
  vec2 mirroredUv = vec2(1.0 - sourceUv.x, sourceUv.y);
  vec3 frame = texture(uFrame, mirroredUv).rgb;

  if (uMode == 0) {
    float sweepY = fract(uTime * 0.035);
    float sweep = exp(-110.0 * abs(uv.y - sweepY));
    vec3 idleInk = INK * (0.94 + 0.06 * sweep);
    fragColor = vec4(idleInk + frame * (0.18 * uFeed), 1.0);
    return;
  }

  float mask = texture(uMask, mirroredUv).r;
  float m = smoothstep(0.35, 0.65, mask);
  float presenceMask = m * uPresence;

  if (uMode == 1) {
    float luminance = dot(frame, vec3(0.2126, 0.7152, 0.0722));
    vec3 color = mix(vec3(luminance), uTint.rgb, 0.85) * (uTint.a * presenceMask);
    fragColor = vec4(color, uTint.a * presenceMask);
    return;
  }

  fragColor = vec4(frame * presenceMask, presenceMask);
}
`;function K(e){const n=e.createTexture();return e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.R8,1,1,0,e.RED,e.UNSIGNED_BYTE,new Uint8Array([0])),n}function $(e,n){const r=l(e,H,z),i=e.createVertexArray(),a=Array.from({length:n},()=>({frame:O(e),mask:K(e),maskWidth:1,maskHeight:1})),c=Array.from({length:S},(t,v)=>new Float32Array(Y(S-v,S))),T=e.getUniformLocation(r,"uResolution"),R=e.getUniformLocation(r,"uCover"),U=e.getUniformLocation(r,"uTint"),k=e.getUniformLocation(r,"uPresence"),x=e.getUniformLocation(r,"uFeed"),N=e.getUniformLocation(r,"uTime"),p=e.getUniformLocation(r,"uMode");let f=new Uint8Array(0),d=0,E=0;e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.useProgram(r),e.bindVertexArray(i),e.uniform1i(e.getUniformLocation(r,"uFrame"),0),e.uniform1i(e.getUniformLocation(r,"uMask"),1);const w=t=>{e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.frame),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,t.mask)},_=t=>{f.length!==0&&(e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,t.mask),t.maskWidth!==d||t.maskHeight!==E?(e.texImage2D(e.TEXTURE_2D,0,e.R8,d,E,0,e.RED,e.UNSIGNED_BYTE,f),t.maskWidth=d,t.maskHeight=E):e.texSubImage2D(e.TEXTURE_2D,0,0,0,d,E,e.RED,e.UNSIGNED_BYTE,f))};return{writeSlot(t,v,o,s,u){const A=a[t];if(!A)throw new RangeError(`Echo texture slot ${t} is out of range`);if(e.activeTexture(e.TEXTURE0),B(e,A.frame,v),o&&s>0&&u>0&&o.length===s*u){f.length!==o.length&&(f=new Uint8Array(o.length));for(let h=0;h<o.length;h++){const y=o[h];f[h]=y<=0?0:y>=1?255:Math.round(y*255)}d=s,E=u}_(A)},draw(t){const v=a[t.liveSlot>=0?t.liveSlot:0];e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.useProgram(r),e.bindVertexArray(i),e.uniform2f(T,e.drawingBufferWidth,e.drawingBufferHeight),e.uniform2f(R,t.coverX,t.coverY),e.uniform1f(k,t.presence),e.uniform1f(x,t.feed&&t.liveSlot>=0?1:0),e.uniform1f(N,t.time),e.disable(e.BLEND),w(v),e.uniform1i(p,0),e.drawArrays(e.TRIANGLES,0,3),e.enable(e.BLEND),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_COLOR),e.uniform1i(p,1);const o=Math.min(S,t.echoSlots.length);for(let s=0;s<o;s++){const u=t.echoSlots[s];u<0||(w(a[u]),e.uniform4fv(U,c[s]),e.drawArrays(e.TRIANGLES,0,3))}t.liveSlot>=0&&(e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),w(a[t.liveSlot]),e.uniform1i(p,2),e.drawArrays(e.TRIANGLES,0,3))},dispose(){for(const t of a)e.deleteTexture(t.frame),e.deleteTexture(t.mask);e.deleteVertexArray(i),e.deleteProgram(r)}}}const q=32,L=6,Q=.12,M=document.getElementById("stage"),m=document.getElementById("cam");async function j(){const e=F({title:"04 TIME ECHO",sub:"SEGMENTATION TRAILS",hint:"움직여 보세요 · 과거의 내가 잔상으로 따라옵니다 · [ ] 간격 조절",snapshot:()=>M,slug:"echo"});document.body.append(e.el);try{await b(m)}catch(o){P(o);return}const n=await G(m),r=M.getContext("webgl2",{preserveDrawingBuffer:!0});if(!r){n.dispose(),D(m),e.flash("WEBGL2 REQUIRED"),console.error("[echo] WebGL2 is not available");return}const i=new W(q),a=$(r,i.capacity),c=new Int32Array(L);c.fill(-1);const T=()=>{const o=Math.min(window.devicePixelRatio,2);M.width=Math.round(window.innerWidth*o),M.height=Math.round(window.innerHeight*o)};T(),window.addEventListener("resize",T);let R=Q,U=!0;const k=o=>{if(o.key==="["||o.key==="]"){const s=o.key==="["?-.02:.02;R=V(R+s),e.flash(`SPACING ${Math.round(R*1e3)}MS`)}else(o.key==="v"||o.key==="V")&&!o.repeat&&(U=!U,e.flash(`FEED ${U?"ON":"OFF"}`))};window.addEventListener("keydown",k);const x=performance.now();let N=x,p=-1,f=-1,d=60,E=0,w=0,_=!1;const t=()=>{_||(_=!0,cancelAnimationFrame(w),window.removeEventListener("resize",T),window.removeEventListener("keydown",k),a.dispose(),n.dispose(),D(m))};window.addEventListener("pagehide",t,{once:!0});const v=()=>{if(_)return;const o=performance.now(),s=Math.min((o-N)/1e3,.1);N=o,d+=(1/Math.max(s,.001)-d)*.1;const u=n.read();E+=((u.present?1:0)-E)*(1-Math.exp(-s*6)),m.readyState>=2&&m.currentTime!==p&&(p=m.currentTime,f=i.push(p),a.writeSlot(f,m,u.data,u.width,u.height));for(let h=0;h<L;h++){const y=L-h;c[h]=i.pick(m.currentTime-y*R)}const A=X(m.videoWidth,m.videoHeight,M.width,M.height);a.draw({liveSlot:f,echoSlots:c,coverX:A.coverX,coverY:A.coverY,presence:E,feed:U,time:(o-x)/1e3}),e.setTracking(u.present),e.setFps(d),w=requestAnimationFrame(v)};w=requestAnimationFrame(v)}j();
