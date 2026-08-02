import{Z as B,P as S,c as O,i as H,s as X,a as V,O as Y}from"./one-euro-DX4ZL7y5.js";/* empty css                   */function K(t){const n=(t[0].x+t[1].x+t[2].x+t[3].x)/4,e=(t[0].y+t[1].y+t[2].y+t[3].y)/4,a=t.slice(0,4).map(r=>({p:r,a:Math.atan2(r.y-e,r.x-n)})).sort((r,s)=>r.a-s.a).map(r=>r.p);return[a[0],a[1],a[2],a[3]]}const W=4,$=8;async function j(t){const n="/interactive/",e=await B.forVisionTasks(`${n}wasm`),a={baseOptions:{modelAssetPath:`${n}models/hand_landmarker.task`,delegate:"GPU"},runningMode:"VIDEO",numHands:2};let r;try{r=await S.createFromOptions(e,a)}catch{r=await S.createFromOptions(e,{...a,baseOptions:{...a.baseOptions,delegate:"CPU"}})}const s={corners:null,roll:0,present:!1};let f=s,E=-1;return{read(){if(t.readyState<2||t.currentTime===E)return f;E=t.currentTime;const q=r.detectForVideo(t,performance.now()).landmarks;if(q.length!==2)return f=s,f;const T=q.map(c=>{const g=c[W],p=c[$];return!g||!p?null:{thumb:{x:1-g.x,y:g.y},index:{x:1-p.x,y:p.y}}});if(T.some(c=>c===null))return f=s,f;const d=T,v=d.map(c=>({x:(c.thumb.x+c.index.x)/2,y:(c.thumb.y+c.index.y)/2})),[o,x]=v[0].x<=v[1].x?[v[0],v[1]]:[v[1],v[0]];return f={corners:K([d[0].thumb,d[0].index,d[1].thumb,d[1].index]),roll:Math.atan2(x.y-o.y,x.x-o.x),present:!0},f},dispose(){r.close()}}}class z{constructor(n=35,e=15,a=600){this.fireDeg=n,this.rearmDeg=e,this.cooldownMs=a}armed=!0;lastFireMs=-1/0;update(n,e){const a=n*180/Math.PI,r=Math.abs(a);return this.armed?r<this.fireDeg||e-this.lastFireMs<this.cooldownMs?0:(this.armed=!1,this.lastFireMs=e,a>0?1:-1):(r<this.rearmDeg&&(this.armed=!0),0)}reset(){this.armed=!0,this.lastFireMs=-1/0}}const N=[{name:"WAVE RIPPLE"},{name:"RGB GLITCH"},{name:"PIXELATE"},{name:"KALEIDO"},{name:"NEON EDGE"},{name:"VORTEX"},{name:"HALFTONE"},{name:"THERMAL"}],Q=`#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uTex;
uniform vec2 uResolution;   // canvas size in device px
uniform vec2 uCover;        // display uv -> mirrored video uv (cover crop)
uniform vec2 uCorners[4];   // TL, TR, BR, BL in display uv, y down
uniform float uTime;        // seconds
uniform float uHasFrame;    // 0..1 fade of the whole viewport
uniform int uEffect;

out vec4 fragColor;

const vec3 INK = vec3(0.051, 0.055, 0.063);
const vec3 CYAN = vec3(0.369, 0.906, 0.953);
const vec3 ORANGE = vec3(1.0, 0.353, 0.122);
const float BAND = 0.012;   // border width, in quad-height units

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash11(float x) { return fract(sin(x * 91.3458) * 47453.5453); }
vec2 mirrorRepeat(vec2 v) { v = mod(v, 2.0); return 1.0 - abs(1.0 - v); }

// Display uv -> webcam texel. x is flipped so the feed reads as a mirror.
vec3 feed(vec2 uv) {
  vec2 m = (uv - 0.5) * uCover + 0.5;
  return texture(uTex, vec2(1.0 - m.x, m.y)).rgb;
}

// Quad-local (0..1, TL origin) -> display uv. Exact inverse of invBilinear.
vec2 quadToUv(vec2 q) {
  return mix(mix(uCorners[0], uCorners[1], q.x), mix(uCorners[3], uCorners[2], q.x), q.y);
}
vec3 tap(vec2 q) { return feed(quadToUv(q)); }

// Width / height of the quad on screen — keeps cells and offsets square.
float quadAspect() {
  vec2 px = vec2(uResolution.x / uResolution.y, 1.0);
  float w = 0.5 * (length((uCorners[1] - uCorners[0]) * px) + length((uCorners[2] - uCorners[3]) * px));
  float h = 0.5 * (length((uCorners[3] - uCorners[0]) * px) + length((uCorners[2] - uCorners[1]) * px));
  return clamp(w / max(h, 1e-4), 0.25, 4.0);
}

float cross2(vec2 a, vec2 b) { return a.x * b.y - a.y * b.x; }

// u from p = a + e*u + f*v + g*u*v, on whichever axis is better conditioned.
bool solveU(vec2 h, vec2 f, vec2 e, vec2 g, float v, out float u) {
  vec2 den = e + g * v;
  if (abs(den.x) >= abs(den.y)) {
    if (abs(den.x) < 1e-7) return false;
    u = (h.x - f.x * v) / den.x;
    return true;
  }
  if (abs(den.y) < 1e-7) return false;
  u = (h.y - f.y * v) / den.y;
  return true;
}

// Inverse bilinear (Inigo Quilez) — same algorithm as src/lib/math/quad.ts.
bool invBilinear(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d, out vec2 q) {
  vec2 e = b - a;
  vec2 f = d - a;
  vec2 g = a - b + c - d;
  vec2 h = p - a;

  float k2 = cross2(g, f);
  float k1 = cross2(e, f) + cross2(h, g);
  float k0 = cross2(h, e);

  float u;
  if (abs(k2) < 1e-7) {
    // Parallelogram: the quadratic degenerates to a linear solve.
    if (abs(k1) < 1e-9) return false;
    float v = -k0 / k1;
    if (!solveU(h, f, e, g, v, u)) return false;
    q = vec2(u, v);
    return true;
  }

  float disc = k1 * k1 - 4.0 * k0 * k2;
  if (disc < 0.0) return false;
  float w = sqrt(disc);

  // Two roots; keep whichever lands inside the unit square, else the first valid one.
  bool found = false;
  for (int i = 0; i < 2; i++) {
    float v = (-k1 + (i == 0 ? -w : w)) / (2.0 * k2);
    if (!solveU(h, f, e, g, v, u)) continue;
    if (u >= -1e-4 && u <= 1.0001 && v >= -1e-4 && v <= 1.0001) {
      q = vec2(u, v);
      return true;
    }
    if (!found) {
      q = vec2(u, v);
      found = true;
    }
  }
  return found;
}

// 01 — radial sine displacement, cyan crests.
vec3 fxWave(vec2 q, float a, float t) {
  vec2 p = (q - 0.5) * vec2(a, 1.0);
  float r = length(p);
  float wave = sin(r * 26.0 - t * 3.4);
  vec2 dir = r > 1e-4 ? p / r : vec2(0.0);
  vec2 off = dir * wave * 0.024 * exp(-r * 1.2);
  vec3 col = tap(q + off / vec2(a, 1.0));
  return col + CYAN * smoothstep(0.72, 1.0, wave) * 0.3;
}

// 02 — channel separation, row jitter, scanlines.
vec3 fxGlitch(vec2 q, float a, float t) {
  float band = floor(q.y * 26.0);
  float jitter = hash11(band + floor(t * 12.0)) - 0.5;
  float heavy = step(0.86, hash11(band * 1.7 + floor(t * 7.0)));
  vec2 qs = q + vec2(jitter * (0.012 + heavy * 0.07) / a, 0.0);
  float shift = (0.006 + heavy * 0.014) / a;
  vec3 col = vec3(
    tap(qs + vec2(shift, 0.0)).r,
    tap(qs).g,
    tap(qs - vec2(shift, 0.0)).b
  );
  col *= 0.8 + 0.2 * step(0.5, fract(q.y * 150.0));
  return col * (1.0 + heavy * 0.25);
}

// 03 — mosaic with a breathing cell size.
vec3 fxPixelate(vec2 q, float a, float t) {
  float cells = mix(11.0, 34.0, 0.5 + 0.5 * sin(t * 0.7));
  vec2 grid = vec2(cells * a, cells);
  vec3 col = tap((floor(q * grid) + 0.5) / grid);
  vec2 g = abs(fract(q * grid) - 0.5);
  return mix(col, col * 0.4, smoothstep(0.44, 0.5, max(g.x, g.y)));
}

// 04 — 6-fold polar mirror. The wedge samples a disc around the quad centre,
// where the subject is, so the repeat carries the subject and not the backdrop.
vec3 fxKaleido(vec2 q, float a, float t) {
  vec2 p = (q - 0.5) * vec2(a, 1.0);
  float seg = 6.2831853 / 6.0;
  float ang = mod(atan(p.y, p.x) + t * 0.25, seg);
  ang = abs(ang - seg * 0.5);
  float r = length(p) * 0.5 + 0.05;
  vec2 k = vec2(cos(ang), sin(ang)) * r;
  return tap(mirrorRepeat(k / vec2(a, 1.0) + vec2(0.5, 0.44)));
}

// 05 — sobel edges as cyan neon on ink.
vec3 fxNeon(vec2 q, float a, float t) {
  vec2 e = vec2(0.0045 / a, 0.0045);
  float l00 = luma(tap(q + vec2(-e.x, -e.y)));
  float l10 = luma(tap(q + vec2(0.0, -e.y)));
  float l20 = luma(tap(q + vec2(e.x, -e.y)));
  float l01 = luma(tap(q + vec2(-e.x, 0.0)));
  float l21 = luma(tap(q + vec2(e.x, 0.0)));
  float l02 = luma(tap(q + vec2(-e.x, e.y)));
  float l12 = luma(tap(q + vec2(0.0, e.y)));
  float l22 = luma(tap(q + vec2(e.x, e.y)));
  float gx = (l20 + 2.0 * l21 + l22) - (l00 + 2.0 * l01 + l02);
  float gy = (l02 + 2.0 * l12 + l22) - (l00 + 2.0 * l10 + l20);
  float line = smoothstep(0.10, 0.62, sqrt(gx * gx + gy * gy));
  vec3 col = INK + CYAN * line * (0.85 + 0.15 * sin(t * 2.0));
  col += CYAN * pow(line, 4.0) * 0.4;
  return col + tap(q) * 0.05;
}

// 06 — swirl whose angle falls off with radius.
vec3 fxVortex(vec2 q, float a, float t) {
  vec2 p = (q - 0.5) * vec2(a, 1.0);
  float r = length(p);
  float ang = (0.55 - r) * 4.2 + t * 0.9;
  float s = sin(ang), c = cos(ang);
  vec2 rp = mat2(c, s, -s, c) * p;
  vec3 col = tap(mirrorRepeat(rp / vec2(a, 1.0) + 0.5));
  return mix(col, col * vec3(0.78, 1.06, 1.18), smoothstep(0.0, 0.5, r));
}

// 07 — rotated dot screen, cyan for shadows, orange for highlights.
vec3 fxHalftone(vec2 q, float a, float t) {
  vec2 grid = vec2(42.0 * a, 42.0);
  float ang = 0.4 + t * 0.05;
  float c = cos(ang), s = sin(ang);
  vec2 rq = mat2(c, s, -s, c) * (q * grid);
  vec2 cell = fract(rq) - 0.5;
  vec2 qc = (mat2(c, -s, s, c) * (floor(rq) + 0.5)) / grid;
  float l = luma(tap(clamp(qc, 0.0, 1.0)));
  float rad = sqrt(clamp(l, 0.0, 1.0)) * 0.72;
  float dot_ = smoothstep(rad, rad - 0.14, length(cell));
  vec3 tint = mix(CYAN, ORANGE, smoothstep(0.25, 0.85, l));
  return mix(INK * 0.7, tint, dot_);
}

// 08 — luminance ramp ink -> cyan -> orange, with drifting contour bands.
vec3 fxThermal(vec2 q, float a, float t) {
  float l = clamp(pow(luma(tap(q)), 0.85), 0.0, 1.0);
  vec3 col = mix(INK, CYAN * 0.9, smoothstep(0.0, 0.5, l));
  col = mix(col, ORANGE, smoothstep(0.45, 0.9, l));
  col = mix(col, vec3(1.0, 0.95, 0.82), smoothstep(0.88, 1.0, l));
  return col + ORANGE * 0.18 * smoothstep(0.9, 1.0, fract(l * 9.0 - t * 0.5));
}

vec3 effectColor(vec2 q, float a, float t) {
  if (uEffect == 0) return fxWave(q, a, t);
  if (uEffect == 1) return fxGlitch(q, a, t);
  if (uEffect == 2) return fxPixelate(q, a, t);
  if (uEffect == 3) return fxKaleido(q, a, t);
  if (uEffect == 4) return fxNeon(q, a, t);
  if (uEffect == 5) return fxVortex(q, a, t);
  if (uEffect == 6) return fxHalftone(q, a, t);
  return fxThermal(q, a, t);
}

// Viewfinder brackets. dn = aspect-corrected distance to the nearest edge pair.
float ticks(vec2 dn) {
  float len = 0.13;
  float th = 0.028;
  float h = (1.0 - smoothstep(th * 0.7, th, dn.y)) * (1.0 - smoothstep(len * 0.8, len, dn.x));
  float v = (1.0 - smoothstep(th * 0.7, th, dn.x)) * (1.0 - smoothstep(len * 0.8, len, dn.y));
  return clamp(h + v, 0.0, 1.0);
}

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);

  vec2 d = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float vig = 1.0 - 0.5 * smoothstep(0.35, 0.95, length(d));
  vec3 col = feed(uv) * mix(1.0, 0.55, uHasFrame) * vig;

  vec2 q;
  if (invBilinear(uv, uCorners[0], uCorners[1], uCorners[2], uCorners[3], q) &&
      q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0) {
    float a = quadAspect();
    vec2 dn = vec2(min(q.x, 1.0 - q.x) * a, min(q.y, 1.0 - q.y));
    float edge = min(dn.x, dn.y);
    float rim = 1.0 - smoothstep(BAND * 0.55, BAND, edge);
    float glow = 1.0 - smoothstep(0.0, BAND * 7.0, edge);

    vec3 inner = mix(effectColor(q, a, uTime), CYAN, max(rim, ticks(dn)) * 0.92);
    inner += CYAN * glow * glow * 0.22;
    col = mix(col, inner, smoothstep(0.12, 0.9, uHasFrame));
  }

  fragColor = vec4(col, 1.0);
}
`,u=document.getElementById("stage"),h=document.getElementById("cam"),Z=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function J(t){const n=(a,r)=>{const s=t.createShader(a);if(t.shaderSource(s,r),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS))throw new Error(`shader compile failed: ${t.getShaderInfoLog(s)}`);return s},e=t.createProgram();if(t.attachShader(e,n(t.VERTEX_SHADER,Z)),t.attachShader(e,n(t.FRAGMENT_SHADER,Q)),t.linkProgram(e),!t.getProgramParameter(e,t.LINK_STATUS))throw new Error(`program link failed: ${t.getProgramInfoLog(e)}`);return e}async function ee(){const t=O({title:"02 FINGER FRAME",sub:"GESTURE-MASKED",hint:"양손 엄지와 검지로 사각형을 만들어 보세요 · 비틀면 이펙트 전환"});document.body.append(t.el);try{await H(h)}catch(i){X(i);return}const n=await j(h);addEventListener("pagehide",()=>{n.dispose(),V(h)});const e=u.getContext("webgl2");if(!e){console.error("[fingerframe] WebGL2 is not available");return}const a=()=>{const i=Math.min(devicePixelRatio,2);u.width=Math.round(innerWidth*i),u.height=Math.round(innerHeight*i)};a(),addEventListener("resize",a);const r=J(e);e.useProgram(r),e.bindVertexArray(e.createVertexArray());const s=e.getUniformLocation(r,"uResolution"),f=e.getUniformLocation(r,"uCover"),E=e.getUniformLocation(r,"uCorners"),q=e.getUniformLocation(r,"uTime"),T=e.getUniformLocation(r,"uHasFrame"),d=e.getUniformLocation(r,"uEffect");e.bindTexture(e.TEXTURE_2D,e.createTexture()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const v=new Uint8Array([13,14,16,255]);e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,v),e.uniform1i(e.getUniformLocation(r,"uTex"),0);const o=[{x:.36,y:.3},{x:.64,y:.3},{x:.64,y:.7},{x:.36,y:.7}],x=Array.from({length:8},()=>new Y(1,.7)),c=new Float32Array(8),g=new z,p=performance.now();let y=0,_=p,C=60,w=0,I=!1;const k=()=>{const i=performance.now(),P=Math.min((i-_)/1e3,.1);_=i,C+=(1/Math.max(P,.001)-C)*.1;const m=n.read();if(m.present&&m.corners){if(!I)for(const l of x)l.reset();m.corners.forEach((l,A)=>{o[A].x=x[A*2].filter(l.x,i/1e3),o[A].y=x[A*2+1].filter(l.y,i/1e3)})}I=m.present,w+=((m.present?1:0)-w)*(1-Math.exp(-P*6));const D=m.present?g.update(m.roll,i):0;D!==0&&(y=(y+D+N.length)%N.length,t.flash(`0${y+1} / ${N[y].name}`));const R=h.videoWidth/h.videoHeight,b=u.width/u.height,U=b>R?1:b/R,L=b>R?R/b:1,F=(o[0].x+o[1].x+o[2].x+o[3].x)/4,M=(o[0].y+o[1].y+o[2].y+o[3].y)/4,G=.3+.7*w;for(let l=0;l<4;l++)c[l*2]=(F+(o[l].x-F)*G-.5)/U+.5,c[l*2+1]=(M+(o[l].y-M)*G-.5)/L+.5;h.readyState>=2&&e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,h),e.viewport(0,0,u.width,u.height),e.uniform2f(s,u.width,u.height),e.uniform2f(f,U,L),e.uniform2fv(E,c),e.uniform1f(q,(i-p)/1e3),e.uniform1f(T,w),e.uniform1i(d,y),e.drawArrays(e.TRIANGLES,0,3),t.setTracking(m.present),t.setFps(C),requestAnimationFrame(k)};requestAnimationFrame(k)}ee();
