import{c as pe,i as Ee,s as Te,a as Se}from"./hud-BKAypk3y.js";/* empty css                   */import{c as Fe}from"./cover-Co5bYYBp.js";import{c as we,F as Re,a as De,u as Me}from"./gl-BA_3AQBI.js";import{F as J,P as re,c as Ve}from"./hands2-QXTthtXD.js";const b=[94/255,231/255,243/255],Q=[1,90/255,31/255],Ce=.0025,be=[-.08,.04,-.04,.08,0],ue=(e,r)=>Math.hypot(e.x-r.x,e.y-r.y);function de(e){const r=ue(e.landmarks[re.wrist],e.landmarks[re.middleMcp]);return r<=1e-6?!1:ue(e.landmarks[J[0]],e.landmarks[J[1]])/r<.4}function _e(e,r,l){const m=(r%J.length+J.length)%J.length,o=.15*(1+Math.sin(l*.22+m*.71)),a=be[m],u=e%2===0?Math.min(1,Math.max(0,.08+a+o)):Math.min(1,Math.max(0,.92+a-o));return[b[0]+(Q[0]-b[0])*u,b[1]+(Q[1]-b[1])*u,b[2]+(Q[2]-b[2])*u]}function Ae(e,r,l,m){const o=Pe(e,r),a=l>1e-6?l:0,u=[];return r.forEach((y,T)=>{const L=o[T],N=de(y);J.forEach((I,V)=>{const _=y.landmarks[I],M=L?.landmarks[I];u.push({x:_.x,y:_.y,dx:M&&a?(_.x-M.x)/a:0,dy:M&&a?(_.y-M.y)/a:0,radius:Ce*(N?4:1),color:_e(T,V,m),burst:N})})}),u}function Ie(e,r){const l=.2+r()*.6,m=.2+r()*.6,o=e*.37;return{x:l,y:m,dx:Math.cos(o)*.018,dy:Math.sin(o*1.13)*.018,radius:.009,color:Le(.5+.22*Math.sin(e*.17)),burst:!1}}function Pe(e,r){if(!e?.length)return r.map(()=>{});if(e.length===r.length)return r.map((m,o)=>e[o]);const l=new Set;return r.map(m=>{const o=m.landmarks[re.wrist];let a=-1,u=1/0;if(e.forEach((y,T)=>{if(l.has(T))return;const L=ue(o,y.landmarks[re.wrist]);L<u&&(a=T,u=L)}),!(a<0))return l.add(a),e[a]})}function Le(e){const r=Math.min(1,Math.max(0,e));return[b[0]+(Q[0]-b[0])*r,b[1]+(Q[1]-b[1])*r,b[2]+(Q[2]-b[2])*r]}const $=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
out vec4 fragColor;
`,Y=`
#ifdef LOW_PRECISION
const float FIELD_ZERO = 128.0 / 255.0;
const float VELOCITY_SCALE = 0.04;
const float SCALAR_SCALE = 0.04;
vec2 readVelocity(vec4 value) { return (value.rg - FIELD_ZERO) / VELOCITY_SCALE; }
vec4 writeVelocity(vec2 value) {
  return vec4(clamp(value * VELOCITY_SCALE + FIELD_ZERO, 0.0, 1.0), FIELD_ZERO, 1.0);
}
float readScalar(vec4 value) { return (value.r - FIELD_ZERO) / SCALAR_SCALE; }
vec4 writeScalar(float value) {
  float packed = clamp(value * SCALAR_SCALE + FIELD_ZERO, 0.0, 1.0);
  return vec4(packed, FIELD_ZERO, FIELD_ZERO, 1.0);
}
#else
vec2 readVelocity(vec4 value) { return value.rg; }
vec4 writeVelocity(vec2 value) { return vec4(value, 0.0, 1.0); }
float readScalar(vec4 value) { return value.r; }
vec4 writeScalar(float value) { return vec4(value, 0.0, 0.0, 1.0); }
#endif
`,me=`
vec4 sampleField(sampler2D field, vec2 uv, bool manualFilter) {
  if (!manualFilter) return texture(field, uv);
  ivec2 size = textureSize(field, 0);
  vec2 pixel = clamp(uv, vec2(0.0), vec2(1.0)) * vec2(size) - 0.5;
  ivec2 base = ivec2(floor(pixel));
  vec2 f = fract(pixel);
  ivec2 hi = size - 1;
  ivec2 p00 = clamp(base, ivec2(0), hi);
  ivec2 p10 = clamp(base + ivec2(1, 0), ivec2(0), hi);
  ivec2 p01 = clamp(base + ivec2(0, 1), ivec2(0), hi);
  ivec2 p11 = clamp(base + ivec2(1, 1), ivec2(0), hi);
  vec4 a = mix(texelFetch(field, p00, 0), texelFetch(field, p10, 0), f.x);
  vec4 b = mix(texelFetch(field, p01, 0), texelFetch(field, p11, 0), f.x);
  return mix(a, b, f.y);
}
`,ze=`${$}
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
${Y}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  float left = readVelocity(texture(uVelocity, uv - vec2(uTexelSize.x, 0.0))).y;
  float right = readVelocity(texture(uVelocity, uv + vec2(uTexelSize.x, 0.0))).y;
  float bottom = readVelocity(texture(uVelocity, uv - vec2(0.0, uTexelSize.y))).x;
  float top = readVelocity(texture(uVelocity, uv + vec2(0.0, uTexelSize.y))).x;
  float curl = 0.5 * (right - left - top + bottom);
  fragColor = writeScalar(curl);
}
`,Ue=`${$}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uStrength;
${Y}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  float left = abs(readScalar(texture(uCurl, uv - vec2(uTexelSize.x, 0.0))));
  float right = abs(readScalar(texture(uCurl, uv + vec2(uTexelSize.x, 0.0))));
  float bottom = abs(readScalar(texture(uCurl, uv - vec2(0.0, uTexelSize.y))));
  float top = abs(readScalar(texture(uCurl, uv + vec2(0.0, uTexelSize.y))));
  float centre = readScalar(texture(uCurl, uv));
  vec2 gradient = 0.5 * vec2(right - left, top - bottom);
  gradient /= length(gradient) + 1e-5;
  vec2 force = vec2(gradient.y, -gradient.x) * centre * uStrength;
  vec2 velocity = readVelocity(texture(uVelocity, uv));
  fragColor = writeVelocity(velocity + clamp(force, vec2(-8.0), vec2(8.0)) * uDt);
}
`,Oe=`${$}
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
${Y}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  float left = readVelocity(texture(uVelocity, uv - vec2(uTexelSize.x, 0.0))).x;
  float right = readVelocity(texture(uVelocity, uv + vec2(uTexelSize.x, 0.0))).x;
  float bottom = readVelocity(texture(uVelocity, uv - vec2(0.0, uTexelSize.y))).y;
  float top = readVelocity(texture(uVelocity, uv + vec2(0.0, uTexelSize.y))).y;
  float divergence = 0.5 * (right - left + top - bottom);
  fragColor = writeScalar(divergence);
}
`,Ne=`${$}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;
${Y}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  float left = readScalar(texture(uPressure, uv - vec2(uTexelSize.x, 0.0)));
  float right = readScalar(texture(uPressure, uv + vec2(uTexelSize.x, 0.0)));
  float bottom = readScalar(texture(uPressure, uv - vec2(0.0, uTexelSize.y)));
  float top = readScalar(texture(uPressure, uv + vec2(0.0, uTexelSize.y)));
  float divergence = readScalar(texture(uDivergence, uv));
  float pressure = (left + right + bottom + top - divergence) * 0.25;
  fragColor = writeScalar(pressure);
}
`,ge=`${$}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
${Y}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  float left = readScalar(texture(uPressure, uv - vec2(uTexelSize.x, 0.0)));
  float right = readScalar(texture(uPressure, uv + vec2(uTexelSize.x, 0.0)));
  float bottom = readScalar(texture(uPressure, uv - vec2(0.0, uTexelSize.y)));
  float top = readScalar(texture(uPressure, uv + vec2(0.0, uTexelSize.y)));
  vec2 gradient = 0.5 * vec2(right - left, top - bottom);
  vec2 velocity = readVelocity(texture(uVelocity, uv));
  fragColor = writeVelocity(velocity - gradient);
}
`,ke=`${$}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform vec2 uVelocityToUv;
uniform float uDt;
uniform float uDissipation;
uniform bool uManualFilter;
uniform bool uSourceEncoded;
uniform bool uTargetEncoded;
${Y}
${me}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  vec2 velocity = readVelocity(sampleField(uVelocity, uv, uManualFilter));
  vec2 coord = uv - uDt * velocity * uVelocityToUv;
  vec4 source = sampleField(uSource, coord, uManualFilter);
  float decay = exp(-uDissipation * uDt);
  if (uSourceEncoded) {
    vec2 advected = readVelocity(source) * decay;
    fragColor = uTargetEncoded ? writeVelocity(advected) : vec4(advected, 0.0, 1.0);
  } else {
    fragColor = max(source, vec4(0.0)) * decay;
  }
}
`,Be=`${$}
uniform sampler2D uTarget;
uniform vec2 uTexelSize;
uniform vec2 uAspect;
uniform vec2 uPoints[10];
uniform vec2 uVelocities[10];
uniform vec3 uColors[10];
uniform float uRadii[10];
uniform float uIntensities[10];
uniform float uBursts[10];
uniform int uCount;
uniform int uKind;
${Y}
void main() {
  vec2 uv = gl_FragCoord.xy * uTexelSize;
  vec4 current = texture(uTarget, uv);
  if (uKind == 0) {
    vec2 total = readVelocity(current);
    for (int i = 0; i < 10; i++) {
      if (i >= uCount) break;
      vec2 offset = (uv - uPoints[i]) * uAspect;
      float ink = exp(-dot(offset, offset) / max(uRadii[i], 1e-8));
      vec2 radial = offset / (length(offset) + 1e-5);
      vec2 tangent = normalize(vec2(-offset.y, offset.x) + vec2(1e-5)) * 0.025;
      vec2 impulse = uVelocities[i] + tangent + radial * uBursts[i] * 0.72;
      total += impulse * ink * uIntensities[i];
    }
    fragColor = writeVelocity(total);
  } else {
    vec4 total = current;
    for (int i = 0; i < 10; i++) {
      if (i >= uCount) break;
      vec2 offset = (uv - uPoints[i]) * uAspect;
      float ink = exp(-dot(offset, offset) / max(uRadii[i], 1e-8));
      total += vec4(uColors[i], 1.0) * ink * uIntensities[i];
    }
    fragColor = total;
  }
}
`,Xe=`${$}
uniform sampler2D uDye;
uniform sampler2D uVideo;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uVideoDim;
uniform bool uHasVideo;
uniform bool uManualFilter;
${me}
const vec3 INK = vec3(13.0, 14.0, 16.0) / 255.0;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 base = INK;
  if (uHasVideo) {
    vec2 videoUv = (uv - 0.5) * uCover + 0.5;
    // Video rows start at the top while gl_FragCoord starts at the bottom: flip v, mirror u.
    vec3 feed = texture(uVideo, vec2(1.0 - videoUv.x, 1.0 - videoUv.y)).rgb;
    base = mix(INK, feed, clamp(uVideoDim, 0.0, 1.0));
  }
  vec3 dye = max(sampleField(uDye, uv, uManualFilter).rgb, vec3(0.0));
  vec3 neon = 1.0 - exp(-dye * 1.35);
  vec3 screened = 1.0 - (1.0 - base) * (1.0 - neon);
  fragColor = vec4(clamp(screened, 0.0, 1.0), 1.0);
}
`,G=10,$e=20,He=30;function Ge(e,r){const l=!!e.getExtension("EXT_color_buffer_float"),m=l&&!!e.getExtension("OES_texture_float_linear"),o=!l,a=l&&!m,u=l?e.RGBA16F:e.RGBA8,y=l?e.HALF_FLOAT:e.UNSIGNED_BYTE,T=a?e.NEAREST:e.LINEAR,L=e.createVertexArray(),N=e.getParameter(e.MAX_TEXTURE_SIZE),I=k(ze,["uVelocity","uTexelSize"]),V=k(Ue,["uVelocity","uCurl","uTexelSize","uDt","uStrength"]),_=k(Oe,["uVelocity","uTexelSize"]),M=k(Ne,["uPressure","uDivergence","uTexelSize"]),A=k(ge,["uPressure","uVelocity","uTexelSize"]),d=k(ke,["uVelocity","uSource","uTexelSize","uVelocityToUv","uDt","uDissipation","uManualFilter","uSourceEncoded","uTargetEncoded"]),f=k(Be,["uTarget","uTexelSize","uAspect","uPoints[0]","uVelocities[0]","uColors[0]","uRadii[0]","uIntensities[0]","uBursts[0]","uCount","uKind"]),S=k(Xe,["uDye","uVideo","uResolution","uCover","uVideoDim","uHasVideo","uManualFilter"]),g=new Float32Array(G*2),F=new Float32Array(G*2),C=new Float32Array(G*3),ee=new Float32Array(G),Z=new Float32Array(G),z=new Float32Array(G);let p=0,v=0,K=[],n=null,E=null,D=null,W=null,q=null;e.disable(e.BLEND),e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE);function k(t,c){const i=o?Ye(t):t,s=we(e,Re,i),x={};for(const H of c)x[H]=e.getUniformLocation(s,H);return{program:s,uniforms:x}}function te(t,c){const i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,T),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,T),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,u,t,c,0,e.RGBA,y,null);const s=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("[fluid] framebuffer is incomplete");const x={texture:i,fbo:s,width:t,height:c};return K.push(x),x}function ie(t,c){const i={read:te(t,c),write:te(t,c),swap(){const s=i.read;i.read=i.write,i.write=s}};return i}function U(t,c,i,s){e.useProgram(t.program),e.bindVertexArray(L),e.bindFramebuffer(e.FRAMEBUFFER,c?.fbo??null),e.viewport(0,0,c?.width??i??p,c?.height??s??v)}function O(){e.drawArrays(e.TRIANGLES,0,3)}function w(t,c,i,s){e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,s),e.uniform1i(t.uniforms[c],i)}function B(t,c){e.uniform2f(t.uniforms.uTexelSize,1/c.width,1/c.height)}function X(t,c,i=!1){e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,t.width,t.height);const s=c&&!i?128/255:0;e.clearColor(s,s,s,i?0:1),e.clear(e.COLOR_BUFFER_BIT)}function ae(){!n||!E||!D||!W||!q||(X(n.read,o),X(n.write,o),X(D.read,o),X(D.write,o),X(W,o),X(q,o),X(E.read,!1,!0),X(E.write,!1,!0))}function ve(){for(const t of K)e.deleteFramebuffer(t.fbo),e.deleteTexture(t.texture);K=[]}function xe(t,c){const i=Math.max(1,Math.round(t)),s=Math.max(1,Math.round(c)),x=fe(Math.max(1,r.simRes),i,s,N),H=Math.max(1,Math.min(r.dyeRes,Math.min(i,s))),h=fe(H,i,s,N);if(n?.read.width===x.width&&n.read.height===x.height&&E?.read.width===h.width&&E.read.height===h.height){p=i,v=s;return}ve(),p=i,v=s,n=ie(x.width,x.height),D=ie(x.width,x.height),W=te(x.width,x.height),q=te(x.width,x.height),E=ie(h.width,h.height),ae()}function he(t,c){if(!n||!E||!D||!W||!q)return;const i=Math.min(Math.max(t,0),.1);U(I,q),w(I,"uVelocity",0,n.read.texture),B(I,n.read),O(),U(V,n.write),w(V,"uVelocity",0,n.read.texture),w(V,"uCurl",1,q.texture),B(V,n.read),e.uniform1f(V.uniforms.uDt,i),e.uniform1f(V.uniforms.uStrength,He),O(),n.swap(),U(_,W),w(_,"uVelocity",0,n.read.texture),B(_,n.read),O();for(let s=0;s<$e;s++)U(M,D.write),w(M,"uPressure",0,D.read.texture),w(M,"uDivergence",1,W.texture),B(M,D.read),O(),D.swap();U(A,n.write),w(A,"uPressure",0,D.read.texture),w(A,"uVelocity",1,n.read.texture),B(A,n.read),O(),n.swap(),U(d,n.write),w(d,"uVelocity",0,n.read.texture),w(d,"uSource",1,n.read.texture),B(d,n.write),e.uniform2f(d.uniforms.uVelocityToUv,Math.min(p,v)/p,Math.min(p,v)/v),e.uniform1f(d.uniforms.uDt,i),e.uniform1f(d.uniforms.uDissipation,.2),e.uniform1i(d.uniforms.uManualFilter,a?1:0),e.uniform1i(d.uniforms.uSourceEncoded,o?1:0),e.uniform1i(d.uniforms.uTargetEncoded,o?1:0),O(),n.swap(),U(d,E.write),w(d,"uVelocity",0,n.read.texture),w(d,"uSource",1,E.read.texture),B(d,E.write),e.uniform2f(d.uniforms.uVelocityToUv,Math.min(p,v)/p,Math.min(p,v)/v),e.uniform1f(d.uniforms.uDt,i),e.uniform1f(d.uniforms.uDissipation,1),e.uniform1i(d.uniforms.uManualFilter,a?1:0),e.uniform1i(d.uniforms.uSourceEncoded,0),e.uniform1i(d.uniforms.uTargetEncoded,0),O(),E.swap(),c.length&&(ne(n,c,0),ne(E,c,1))}function ne(t,c,i){const s=Math.min(t.read.width,t.read.height),x=t.read.width/s,H=t.read.height/s;let h=0;for(let oe=0;oe<c.length&&h<G;oe++){const R=c[oe];if(!Number.isFinite(R.x)||!Number.isFinite(R.y)||!Number.isFinite(R.dx)||!Number.isFinite(R.dy)||R.radius<=0)continue;const ce=R.dx*x,se=-R.dy*H,le=Math.hypot(ce,se);g[h*2]=R.x,g[h*2+1]=1-R.y,F[h*2]=Math.max(-3,Math.min(3,ce)),F[h*2+1]=Math.max(-3,Math.min(3,se)),C[h*3]=R.color[0],C[h*3+1]=R.color[1],C[h*3+2]=R.color[2],ee[h]=R.radius,Z[h]=i===0?.18+Math.min(le,2.5)*.42:.045+Math.min(le,2.5)*.16+(R.burst?.65:0),z[h]=R.burst?1:0,h++}h&&(U(f,t.write),w(f,"uTarget",0,t.read.texture),B(f,t.write),e.uniform2f(f.uniforms.uAspect,x,H),e.uniform2fv(f.uniforms["uPoints[0]"],g),e.uniform2fv(f.uniforms["uVelocities[0]"],F),e.uniform3fv(f.uniforms["uColors[0]"],C),e.uniform1fv(f.uniforms["uRadii[0]"],ee),e.uniform1fv(f.uniforms["uIntensities[0]"],Z),e.uniform1fv(f.uniforms["uBursts[0]"],z),e.uniform1i(f.uniforms.uCount,h),e.uniform1i(f.uniforms.uKind,i),O(),t.swap())}function ye(t,c,i,s){E&&(U(S,null,p,v),w(S,"uVideo",0,t),w(S,"uDye",1,E.read.texture),e.uniform2f(S.uniforms.uResolution,p,v),e.uniform2f(S.uniforms.uCover,i,s),e.uniform1f(S.uniforms.uVideoDim,c),e.uniform1i(S.uniforms.uHasVideo,t?1:0),e.uniform1i(S.uniforms.uManualFilter,a?1:0),O())}return{resize:xe,step:he,render:ye,clear:ae}}function Ye(e){const r=e.indexOf(`
`);return`${e.slice(0,r+1)}#define LOW_PRECISION
${e.slice(r+1)}`}function fe(e,r,l,m){const o=r/l;let a=o>=1?Math.round(e*o):Math.round(e),u=o>=1?Math.round(e):Math.round(e/o);const y=Math.max(a,u);if(y>m){const T=m/y;a=Math.max(1,Math.floor(a*T)),u=Math.max(1,Math.floor(u*T))}return{width:Math.max(1,a),height:Math.max(1,u)}}const P=document.getElementById("stage"),j=document.getElementById("cam"),Ze=[];async function Ke(){const e=pe({title:"06 NEON FLUID",sub:"HAND-DRIVEN FLUID SIM",hint:"손을 들어 허공을 저어 보세요 · 엄지와 검지를 집으면 잉크가 터집니다",snapshot:()=>P,slug:"fluid"});document.body.append(e.el);try{await Ee(j)}catch(f){Te(f);return}const r=await Ve(j);window.addEventListener("pagehide",()=>{r.dispose(),Se(j)});const l=P.getContext("webgl2",{preserveDrawingBuffer:!0});if(!l){console.error("[fluid] WebGL2 is not available");return}const m=Ge(l,{simRes:128,dyeRes:1024}),o=De(l,{filter:"linear",wrap:"clamp"}),a=()=>{const f=Math.min(devicePixelRatio,2);P.width=Math.max(1,Math.round(innerWidth*f)),P.height=Math.max(1,Math.round(innerHeight*f)),m.resize(P.width,P.height)};a(),window.addEventListener("resize",a);let u=!0;window.addEventListener("keydown",f=>{const S=f.key.toLowerCase();S==="c"?(m.clear(),e.flash("CLEARED")):S==="v"&&(u=!u,e.flash(u?"FEED ON":"FEED OFF"))});const y=performance.now();let T=y,L=y,N=-1/0,I=60,V=0,_=null,M=null;const A=[!1,!1],d=()=>{const f=performance.now(),S=Math.min((f-T)/1e3,.1),g=(f-y)/1e3;T=f,I+=(1/Math.max(S,.001)-I)*.1;const F=r.read();V+=((F.present?1:0)-V)*(1-Math.exp(-S*6));let C=Ze,ee=S;if(F.hands!==_){const z=Math.min(Math.max((f-L)/1e3,.008333333333333333),.1);if(L=f,_=F.hands,F.present){C=Ae(M,F.hands,z,g),ee=z;let p=!1;for(let v=0;v<F.hands.length;v++){const K=de(F.hands[v]),n=K&&!A[v];for(let E=0;E<5;E++){const D=C[v*5+E];!n&&D.burst&&(D.burst=!1,D.radius*=.25)}A[v]=K,p||=n}for(let v=F.hands.length;v<A.length;v++)A[v]=!1;p&&e.flash("INK DROP"),M=F.hands}else M=null,A[0]=!1,A[1]=!1}const Z=Fe(j.videoWidth,j.videoHeight,P.width,P.height);if(C.length){We(C,ee,Z.toScreen,P.width,P.height);const z=.45+V*.55;for(const p of C)p.color[0]*=z,p.color[1]*=z,p.color[2]*=z}else!F.present&&g-N>=1.5&&(C=[Ie(g,Math.random)],N=g);Me(l,o,j),m.step(S,C),m.render(u?o:null,.25,Z.coverX,Z.coverY),e.setTracking(F.present),e.setFps(I),requestAnimationFrame(d)};requestAnimationFrame(d)}function We(e,r,l,m,o){const a=Math.max(r,1e-6);for(const u of e){const y=l(u),T=l({x:u.x-u.dx*a,y:u.y-u.dy*a});u.x=y.x/m,u.y=y.y/o,u.dx=(y.x-T.x)/m/a,u.dy=(y.y-T.y)/o/a}}Ke();
