import{Z as rt,P as Fe,c as nt,a as J,i as it}from"./hud-BKAypk3y.js";/* empty css                   */import{O as ot}from"./one-euro-B79NrZW_.js";import{W as st,S as ct,O as lt,A as dt,D as He,C as Ge,c as We,h as ft,f as de,e as fe,M as _e,d as ht,G as ut,i as pt,E as Be,L as Oe,j as Ue}from"./three.module-D4n9SMDw.js";import{r as vt}from"./lab-layout-BXuItOE4.js";function mt(t){const e=(t[0].x+t[1].x+t[2].x+t[3].x)/4,r=(t[0].y+t[1].y+t[2].y+t[3].y)/4,a=t.slice(0,4).map(n=>({p:n,a:Math.atan2(n.y-r,n.x-e)})).sort((n,o)=>n.a-o.a).map(n=>n.p);return[a[0],a[1],a[2],a[3]]}function gt(t,e,r,a,n){const{x:o,y:i}=t,c={x:e.x+(r.x-e.x)*o,y:e.y+(r.y-e.y)*o},l={x:n.x+(a.x-n.x)*o,y:n.y+(a.y-n.y)*o};return{x:c.x+(l.x-c.x)*i,y:c.y+(l.y-c.y)*i}}const xt=4,bt=8;async function yt(t){const e="/interactive/",r=await rt.forVisionTasks(`${e}wasm`),a={baseOptions:{modelAssetPath:`${e}models/hand_landmarker.task`,delegate:"GPU"},runningMode:"VIDEO",numHands:2};let n;try{n=await Fe.createFromOptions(r,a)}catch{n=await Fe.createFromOptions(r,{...a,baseOptions:{...a.baseOptions,delegate:"CPU"}})}const o={corners:null,roll:0,present:!1};let i=o,c=-1;return{read(){if(t.readyState<2||t.currentTime===c)return i;c=t.currentTime;const l=n.detectForVideo(t,performance.now()).landmarks;if(l.length!==2)return i=o,i;const p=l.map(f=>{const E=f[xt],S=f[bt];return!E||!S?null:{thumb:{x:1-E.x,y:E.y},index:{x:1-S.x,y:S.y}}});if(p.some(f=>f===null))return i=o,i;const d=p,s=d.map(f=>({x:(f.thumb.x+f.index.x)/2,y:(f.thumb.y+f.index.y)/2})),[v,g]=s[0].x<=s[1].x?[s[0],s[1]]:[s[1],s[0]];return i={corners:mt([d[0].thumb,d[0].index,d[1].thumb,d[1].index]),roll:Math.atan2(g.y-v.y,g.x-v.x),present:!0},i},dispose(){n.close()}}}class wt{constructor(e=35,r=15,a=600){this.fireDeg=e,this.rearmDeg=r,this.cooldownMs=a}armed=!0;lastFireMs=-1/0;update(e,r){const a=e*180/Math.PI,n=Math.abs(a);return this.armed?n<this.fireDeg||r-this.lastFireMs<this.cooldownMs?0:(this.armed=!1,this.lastFireMs=r,a>0?1:-1):(n<this.rearmDeg&&(this.armed=!0),0)}reset(){this.armed=!0,this.lastFireMs=-1/0}}const ne=[{name:"FROSTED GLASS"},{name:"REEDED GLASS"},{name:"RIPPLE GLASS"},{name:"STAINED GLASS"},{name:"PRISM GLASS"},{name:"CRACKED ICE"},{name:"GLASS BLOCK"},{name:"CRT PHOSPHOR"},{name:"LED WALL"},{name:"HALFTONE PRINT"},{name:"NEWSPRINT"},{name:"FILM GRAIN"}],Et=`#version 300 es
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
const vec3 PAPER = vec3(0.945, 0.925, 0.878);
const vec3 NEWS = vec3(0.862, 0.847, 0.792);
const float BAND = 0.012;   // border width, in quad-height units

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
vec2 hash22(vec2 p) {
  vec2 k = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(k) * 43758.5453123);
}

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

// Square space: quad-local q centred and stretched by the aspect, so an offset
// of 0.01 is the same distance on screen whichever axis it points along.
vec2 sq(vec2 q, float a) { return (q - 0.5) * vec2(a, 1.0); }
vec3 tapS(vec2 p, float a) { return tap(p / vec2(a, 1.0) + 0.5); }

// Nearest / second-nearest cell over a 3x3 neighbourhood. f2 - f1 is the
// distance to the cell border, which is what draws lead lines and fractures.
void cells(vec2 p, float n, out vec2 centre, out vec2 id, out float f1, out float f2) {
  vec2 x = p * n;
  vec2 base = floor(x);
  vec2 f = x - base;
  centre = vec2(0.0);
  id = base;
  f1 = 1e9;
  f2 = 1e9;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(base + g);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < f1) {
        f2 = f1;
        f1 = d;
        id = base + g;
        centre = (base + g + o) / n;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  f1 = sqrt(f1);
  f2 = sqrt(f2);
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

// 01 — sandblasted glass: spiral of taps plus a per-pixel micro-normal.
vec3 fxFrosted(vec2 q, float a) {
  vec2 p = sq(q, a);
  vec2 micro = vec2(hash21(q * 517.0), hash21(q * 517.0 + 41.0)) - 0.5;
  float phase = hash21(q * 93.0) * 6.2831853;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 14; i++) {
    float f = (float(i) + 0.5) / 14.0;
    float ang = phase + f * 21.9911;
    acc += tapS(p + vec2(cos(ang), sin(ang)) * 0.018 * sqrt(f) + micro * 0.007, a);
  }
  return acc / 14.0 * 1.06 + 0.028;
}

// 02 — fluted reeded glass: each rib is a half-cylinder, refracting by its slope.
vec3 fxReeded(vec2 q, float a) {
  float ribs = 20.0 * a;
  float f = fract(q.x * ribs) - 0.5;
  float h = sqrt(max(0.25 - f * f, 1e-4));
  vec2 p = sq(q, a);
  vec2 off = vec2(clamp(-f / h, -3.0, 3.0) * 0.020, 0.0);
  vec3 col = tapS(p + off + vec2(0.0, -0.006), a) * 0.25
           + tapS(p + off, a) * 0.5
           + tapS(p + off + vec2(0.0, 0.006), a) * 0.25;
  float seam = smoothstep(0.40, 0.5, abs(f));
  float spec = pow(max(1.0 - abs(f + 0.20) * 3.6, 0.0), 3.0);
  return col * (1.0 - 0.38 * seam) + spec * 0.11;
}

// 03 — bathroom wavy glass. The surface is static; only the refraction moves
// the feed, and the sheen picks out slopes facing up-left.
vec3 fxRipple(vec2 q, float a) {
  vec2 p = sq(q, a);
  float c1 = cos(p.x * 34.0 + p.y * 9.0);
  float c2 = cos(p.y * 29.0 - p.x * 12.0);
  float c3 = cos((p.x + p.y) * 19.0);
  vec2 grad = vec2(c1 * 34.0 - c2 * 12.0 + c3 * 19.0, c1 * 9.0 + c2 * 29.0 + c3 * 19.0);
  vec3 col = tapS(p + grad * 0.00042, a);
  float sheen = clamp(dot(normalize(grad + 1e-5), normalize(vec2(-1.0, -1.0))), 0.0, 1.0);
  return col * (0.94 + 0.12 * sheen) + CYAN * pow(sheen, 8.0) * 0.10;
}

// 04 — leaded cathedral glass: hue per cell, dark cames on the borders.
vec3 fxStained(vec2 q, float a) {
  vec2 p = sq(q, a);
  vec2 pt = p + 0.5;
  vec2 centre, id;
  float f1, f2;
  cells(pt, 9.0, centre, id, f1, f2);
  vec2 facet = (centre - pt) * 0.12 + (hash22(id + 7.0) - 0.5) * 0.012;
  vec3 col = tapS(p + facet, a);
  vec3 tint = 0.55 + 0.45 * cos(6.2831853 * (hash21(id) + vec3(0.0, 0.33, 0.67)));
  col *= tint * 1.55;
  return mix(col, INK * 0.45, smoothstep(0.055, 0.0, f2 - f1));
}

// 05 — prismatic dispersion, splitting harder toward the quad edge.
vec3 fxPrism(vec2 q, float a) {
  vec2 p = sq(q, a);
  float r = length(p);
  vec2 dir = r > 1e-4 ? p / r : vec2(0.0);
  float amt = 0.055 * r * smoothstep(0.05, 0.62, r);
  vec3 col = vec3(
    tapS(p + dir * amt, a).r,
    tapS(p + dir * amt * 0.4, a).g,
    tapS(p - dir * amt * 0.55, a).b
  );
  vec3 fringe = 0.5 + 0.5 * cos(6.2831853 * (r * 3.2 + vec3(0.0, 0.33, 0.67)));
  return col + fringe * smoothstep(0.24, 0.72, r) * 0.09;
}

// 06 — shattered pane: every shard offsets and tilts its own slice of the feed.
vec3 fxIce(vec2 q, float a) {
  vec2 p = sq(q, a);
  vec2 centre, id;
  float f1, f2;
  cells(p + 0.5, 7.0, centre, id, f1, f2);
  vec2 seed = hash22(id);
  float ang = (seed.x - 0.5) * 0.32;
  float s = sin(ang), c = cos(ang);
  vec2 pivot = centre - 0.5;
  vec2 shard = pivot + mat2(c, s, -s, c) * (p - pivot) + (seed - 0.5) * 0.05;
  vec3 col = tapS(shard, a) * (0.90 + 0.20 * seed.y);
  float fracture = smoothstep(0.042, 0.0, f2 - f1);
  return mix(col, col * 1.35 + vec3(0.28, 0.44, 0.50), fracture);
}

// 07 — glass-brick wall: each block is a lens showing only what sits behind it.
vec3 fxGlassBlock(vec2 q, float a) {
  vec2 grid = vec2(5.0, 4.0);
  vec2 g = q * grid;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  vec2 bulge = f * (1.0 - 0.8 * dot(f, f));
  vec3 col = tap((id + 0.5 + bulge) / grid) * (0.92 + 0.16 * hash21(id));
  vec2 d = 0.5 - abs(f);
  float seam = 1.0 - smoothstep(0.0, 0.09, min(d.x, d.y));
  return mix(col, col * 0.42 + vec3(0.05, 0.09, 0.10), seam);
}

// 08 — the feed as a shadow-mask tube: RGB triads, scanlines, tube bulge.
vec3 fxCrt(vec2 q, float a, float t) {
  vec2 p = sq(q, a);
  vec2 b = p * (1.0 + 0.10 * dot(p, p));
  vec3 col = tapS(b, a);
  vec3 bloom = (tapS(b + vec2(0.013, 0.0), a) + tapS(b - vec2(0.013, 0.0), a)
              + tapS(b + vec2(0.0, 0.013), a) + tapS(b - vec2(0.0, 0.013), a)) * 0.25;
  col += max(bloom - 0.55, 0.0) * 0.75;
  float m = fract(q.x * 90.0 * a);
  vec3 mask = vec3(step(m, 0.3334), step(0.3334, m) * step(m, 0.6667), step(0.6667, m));
  float scan = 0.80 + 0.20 * cos(q.y * 6.2831853 * 120.0);
  float flick = 1.0 + 0.015 * sin(t * 62.0);
  return col * (mask * 1.05 + 0.42) * scan * flick * 1.4;
}

// 09 — coarse LED panel. Emitters carry the cell average and swell with luma.
vec3 fxLed(vec2 q, float a) {
  vec2 grid = vec2(58.0 * a, 58.0);
  vec2 c0 = (floor(q * grid) + 0.5) / grid;
  vec2 e = 0.22 / grid;
  vec3 avg = (tap(c0 + vec2(-e.x, -e.y)) + tap(c0 + vec2(e.x, -e.y))
            + tap(c0 + vec2(-e.x, e.y)) + tap(c0 + vec2(e.x, e.y))) * 0.25;
  vec2 f = abs(fract(q * grid) - 0.5);
  float d = max(f.x, f.y);
  float l = luma(avg);
  float size = 0.28 + 0.15 * sqrt(l);
  float emit = 1.0 - smoothstep(size - 0.07, size + 0.02, d);
  float halo = exp(-d * 5.0) * l * 0.30;
  return avg * (emit * 1.2 + halo) + INK * (1.0 - emit);
}

// 10 — DEXA inks on stock: 15° dot screen, dot area driven by ink coverage.
vec3 fxHalftone(vec2 q, float a) {
  vec2 grid = vec2(46.0 * a, 46.0);
  float c = cos(0.2618), s = sin(0.2618);
  vec2 rq = mat2(c, s, -s, c) * (q * grid);
  vec2 cell = fract(rq) - 0.5;
  vec2 qc = (mat2(c, -s, s, c) * (floor(rq) + 0.5)) / grid;
  float l = clamp(luma(tap(clamp(qc, 0.0, 1.0))), 0.0, 1.0);
  float ink = 1.0 - l;
  float rad = sqrt(ink) * 0.72;
  float dot_ = smoothstep(rad, rad - 0.10, length(cell));
  vec3 tint = mix(ORANGE, CYAN * 0.72, smoothstep(0.25, 0.85, ink));
  vec3 stock = PAPER * (0.96 + 0.06 * hash21(q * 730.0));
  return mix(stock, tint * 0.9, dot_);
}

// 11 — newsprint: grey screen at 45°, absorbent paper, ink bleeding in the darks.
vec3 fxNewsprint(vec2 q, float a) {
  vec2 grid = vec2(34.0 * a, 34.0);
  float c = cos(0.7854), s = sin(0.7854);
  vec2 rq = mat2(c, s, -s, c) * (q * grid);
  vec2 cell = fract(rq) - 0.5;
  vec2 qc = clamp((mat2(c, -s, s, c) * (floor(rq) + 0.5)) / grid, 0.0, 1.0);
  vec3 s0 = tap(qc);
  float sharp = luma(s0);
  float bleed = luma((s0 + tap(qc + vec2(0.006 / a, 0.0)) + tap(qc + vec2(0.0, 0.006))) / 3.0);
  float l = clamp(mix(sharp, bleed, smoothstep(0.55, 0.12, sharp)), 0.0, 1.0);
  float rad = sqrt(1.0 - l) * 0.78;
  float dot_ = smoothstep(rad, rad - 0.16, length(cell));
  float grain = hash21(q * 640.0);
  return mix(NEWS * (0.93 + 0.11 * grain), vec3(0.10, 0.10, 0.115) * (0.85 + 0.3 * grain), dot_);
}

// 12 — film stock: S-curve, warm fade, soft gate edge, live grain.
vec3 fxFilm(vec2 q, float a, float t) {
  vec2 p = sq(q, a);
  float r = length(p);
  vec3 soft = (tapS(p + vec2(0.007, 0.0), a) + tapS(p - vec2(0.007, 0.0), a)
             + tapS(p + vec2(0.0, 0.007), a) + tapS(p - vec2(0.0, 0.007), a)) * 0.25;
  vec3 col = mix(tap(q), soft, smoothstep(0.30, 0.62, r) * 0.8);
  col = col * col * (3.0 - 2.0 * col);
  col = col * vec3(1.06, 0.99, 0.90) + vec3(0.045, 0.032, 0.028);
  col += (hash21(q * 900.0 + fract(t) * 313.0) - 0.5) * 0.075 * (1.0 - 0.6 * luma(col));
  return col * (1.0 - 0.55 * smoothstep(0.28, 0.72, r));
}

vec3 effectColor(vec2 q, float a, float t) {
  if (uEffect == 0) return fxFrosted(q, a);
  if (uEffect == 1) return fxReeded(q, a);
  if (uEffect == 2) return fxRipple(q, a);
  if (uEffect == 3) return fxStained(q, a);
  if (uEffect == 4) return fxPrism(q, a);
  if (uEffect == 5) return fxIce(q, a);
  if (uEffect == 6) return fxGlassBlock(q, a);
  if (uEffect == 7) return fxCrt(q, a, t);
  if (uEffect == 8) return fxLed(q, a);
  if (uEffect == 9) return fxHalftone(q, a);
  if (uEffect == 10) return fxNewsprint(q, a);
  return fxFilm(q, a, t);
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
`,G=(t,e,r)=>Math.max(e,Math.min(r,t));function St(t,e=!1){if(!t||!Object.values(t).every(Number.isFinite))return!1;const r=e?.035:.08;return t.width>=r&&t.height>=r&&t.width/t.height<5&&t.height/t.width<5}function qt(t){return{x:G(t.x,0,1),y:G(t.y,0,1),width:G(t.width,.08,.95),height:G(t.height,.08,.85),roll:Math.atan2(Math.sin(t.roll),Math.cos(t.roll)),tilt:G(t.tilt,-.85,.85)}}function Mt(t,e){return Math.hypot(t.x-e.x,t.y-e.y)>.035||Math.abs(t.width-e.width)>.045||Math.abs(t.height-e.height)>.045||Math.abs(Math.atan2(Math.sin(t.roll-e.roll),Math.cos(t.roll-e.roll)))>.16}class Ct{pieces=[];phase="idle";progress=0;active=null;dwell=0;loss=0;anchor=null;blocked=!1;nextId=1;maxPieces;dwellSeconds;constructor(e={}){this.maxPieces=Math.max(1,Math.floor(e.maxPieces??5)),this.dwellSeconds=e.dwellSeconds??.7}update(e,r){const a=Number.isFinite(r)?G(r,0,.1):0;if(!St(e,!!this.active)){if(this.loss+=a,this.dwell=0,this.progress=0,this.anchor=null,this.active){if(this.phase="recovering",this.loss>=.65){const l=this.place();return this.blocked=!1,this.phase="idle",l}}else this.loss>=.25?(this.blocked=!1,this.phase="idle"):this.blocked||(this.phase="idle");return[]}this.loss=0;const o=qt(e);if(this.active)return this.active.pose=o,this.phase="holding",[];if(this.blocked)return this.phase="cooldown",[];if((!this.anchor||Mt(this.anchor,o))&&(this.anchor=o,this.dwell=0),this.dwell+=a,this.progress=G(this.dwell/this.dwellSeconds,0,1),this.phase="focusing",this.dwell+1e-6<this.dwellSeconds)return[];const i=[];for(;this.pieces.length>=this.maxPieces;)i.push({type:"dispose",id:this.pieces.shift().id});const c={id:this.nextId++,pose:o,pinned:!1};return this.pieces.push(c),this.active=c,this.phase="holding",i.push({type:"capture",id:c.id}),i}place(){if(!this.active)return[];const e=this.active;return e.pinned=!0,this.active=null,this.blocked=!0,this.dwell=this.progress=0,this.anchor=null,this.phase="cooldown",[{type:"place",id:e.id}]}armManualCapture(){return this.active?!1:(this.blocked=!1,this.dwell=this.progress=this.loss=0,this.anchor=null,this.phase="idle",!0)}reset(){const e=this.pieces.map(r=>({type:"dispose",id:r.id}));return this.pieces.length=0,this.active=null,this.phase="idle",this.progress=this.dwell=this.loss=0,this.blocked=!1,this.anchor=null,e}}function Tt(t){const e=t.getContext("webgl2");if(!e)throw new Error("WebGL2를 사용할 수 없습니다.");const r=[],a=(p,d)=>{const s=e.createShader(p);if(e.shaderSource(s,d),e.compileShader(s),!e.getShaderParameter(s,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(s)??"Shader error");return r.push(s),s},n=e.createProgram();if(e.attachShader(n,a(e.VERTEX_SHADER,`#version 300 es
void main() { vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); gl_Position=vec4(p*2.-1.,0.,1.); }`)),e.attachShader(n,a(e.FRAGMENT_SHADER,Et)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(n)??"Link error");e.useProgram(n);const o=e.createVertexArray();e.bindVertexArray(o);const i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const c=Object.fromEntries(["uTex","uResolution","uCover","uCorners","uTime","uHasFrame","uEffect"].map(p=>[p,e.getUniformLocation(n,p)]));e.uniform1i(c.uTex,0);const l=new Float32Array(8);return{render(p,d,s,v,g){const f=Math.min(devicePixelRatio,1.5),E=Math.round(innerWidth*f),S=Math.round(innerHeight*f);(t.width!==E||t.height!==S)&&(t.width=E,t.height=S),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,p),d.forEach((q,y)=>{l[y*2]=q.x,l[y*2+1]=q.y}),e.viewport(0,0,E,S),e.uniform2f(c.uResolution,E,S),e.uniform2f(c.uCover,-1,1),e.uniform2fv(c.uCorners,l),e.uniform1f(c.uTime,g),e.uniform1f(c.uHasFrame,s),e.uniform1i(c.uEffect,v),e.drawArrays(e.TRIANGLES,0,3)},dispose(){e.deleteTexture(i),e.deleteVertexArray(o),e.deleteProgram(n),r.forEach(p=>e.deleteShader(p))}}}function kt(t,e){const r=document.createElement("canvas");r.width=240,r.height=180;const a=r.getContext("2d"),n=t.getContext("2d").getImageData(0,0,t.width,t.height),o=a.createImageData(r.width,r.height);for(let i=0;i<r.height;i++)for(let c=0;c<r.width;c++){const l=gt({x:c/(r.width-1),y:i/(r.height-1)},...e),p=Math.max(0,Math.min(t.width-1,Math.round(l.x*(t.width-1)))),s=(Math.max(0,Math.min(t.height-1,Math.round(l.y*(t.height-1))))*t.width+p)*4,v=(i*r.width+c)*4;o.data[v]=n.data[s],o.data[v+1]=n.data[s+1],o.data[v+2]=n.data[s+2],o.data[v+3]=255}return a.putImageData(o,0,0),r}function Rt(t,e){const r=new st({canvas:t,antialias:!0,alpha:!1});r.setClearColor("#0d0e10"),r.setPixelRatio(Math.min(devicePixelRatio,1.5));const a=new ct,n=new lt(-1,1,1,-1,.1,3e3);n.position.z=1200;const o=new dt(16777215,1.5),i=new He(14679295,2.6);i.position.set(-500,600,800);const c=new He(16741441,1.3);c.position.set(600,-180,350),a.add(o,i,c);const l=new Ge(e);l.colorSpace=We;const p=new ft({map:l,color:6449776}),d=new de(1,1),s=new fe(d,p);s.position.z=-150,a.add(s);const v=new Map;let g=1,f=1;const E=()=>{g=innerWidth,f=innerHeight,r.setSize(g,f,!1),n.left=-g/2,n.right=g/2,n.top=f/2,n.bottom=-f/2,n.updateProjectionMatrix(),s.scale.set(g,f,1)};E();const S=q=>{const y=v.get(q);y&&(a.remove(y.group),y.texture.dispose(),y.geometries.forEach(F=>F.dispose()),y.materials.forEach(F=>F.dispose()),v.delete(q))};return{capture(q,y,F){const b=kt(e,y),R=new Ge(b);R.colorSpace=We;const M=b.getContext("2d").getImageData(0,0,b.width,b.height).data,H=new de(1,1,80,60),X=H.attributes.position,Se=H.attributes.uv,qe=[1,4,6,4,1];for(let P=0;P<X.count;P++){const te=Math.round(Se.getX(P)*(b.width-1)),et=Math.round((1-Se.getY(P))*(b.height-1));let Ne=0;for(let ae=-2;ae<=2;ae++)for(let re=-2;re<=2;re++){const at=Math.max(0,Math.min(b.width-1,te+re)),le=(Math.max(0,Math.min(b.height-1,et+ae))*b.width+at)*4;Ne+=(M[le]*.299+M[le+1]*.587+M[le+2]*.114)*qe[re+2]*qe[ae+2]}const tt=Ne/(255*256);X.setZ(P,.018+Math.pow(tt,1.3)*.23)}H.computeVertexNormals();const Me=new _e({map:R,side:ht,roughness:.65,metalness:.08}),Ce=new fe(H,Me),V=new ut;V.add(Ce);const ce=new pt(1.035,1.045,.025),Te=new _e({color:"#12272b",metalness:.72,roughness:.27}),ke=new fe(ce,Te);ke.position.z=-.016,V.add(ke);const Re=new Be(ce),Pe=new Oe({color:"#5ee7f3",transparent:!0,opacity:.95}),Ae=new Ue(Re,Pe);Ae.position.z=-.016,V.add(Ae);const Le=new de(1,1),Ie=new Be(Le);Le.dispose();const De=new Oe({color:"#5ee7f3",transparent:!0,opacity:.22});for(let P=1;P<=3;P++){const te=new Ue(Ie,De);te.position.z=-P*.035,V.add(te)}a.add(V),v.set(q,{group:V,surface:Ce,texture:R,geometries:[H,ce,Re,Ie],materials:[Me,Te,Pe,De],created:F})},render(q,y,F){(innerWidth!==g||innerHeight!==f)&&E(),l.needsUpdate=!0;for(const b of q){const R=v.get(b.id);if(!R)continue;const M=b.pose,H=Math.min(1,Math.max(0,(y-R.created)/.7)),X=1-Math.pow(1-H,3);R.group.position.set((M.x-.5)*g,(.5-M.y)*f,30+b.id%10),R.group.scale.set(M.width*g,M.height*f,M.height*f),R.group.rotation.set(-.28*X,M.tilt*X,-M.roll),R.surface.scale.z=Math.max(.02,F*X)}r.render(a,n)},disposePiece:S,dispose(){for(const q of v.keys())S(q);l.dispose(),p.dispose(),d.dispose(),r.dispose()}}}class Pt{revision=0;pending=null;get busy(){return this.pending!==null}begin(){return this.busy?null:(this.pending=++this.revision,this.pending)}accepts(e){return this.pending===e&&this.revision===e}cancel(){this.revision++}finish(e){this.pending===e&&(this.pending=null)}}vt();const xe=document.getElementById("stage"),m=document.getElementById("cam"),D=document.querySelector(".stage"),oe=document.createElement("canvas");oe.id="relief-stage";D.append(oe);const W=document.createElement("canvas");W.className="frame-guide";D.append(W);const _=document.createElement("canvas"),At=_.getContext("2d",{willReadFrequently:!0}),Lt=W.getContext("2d"),B=nt({title:"02 FINGER FRAME",sub:"CAPTURE / TRANSFORM / PLACE",hint:"양손 엄지와 검지로 사각형을 만들어 보세요 · 0.7초 유지 → 이동·기울이기 → 손을 놓아 배치"});document.body.append(B.el);const w=document.createElement("section");w.className="ff-controls";w.setAttribute("aria-label","핑거프레임 조작");w.innerHTML=`
  <div class="ff-switch" role="group" aria-label="표현 모드"><button data-mode="relief" aria-pressed="true">영상 부조</button><button data-mode="filters" aria-pressed="false">12 FILTERS</button></div>
  <div class="ff-eyebrow">FREEZE A MOMENT</div><h1>시간을 집어<br><span>공간에 남기다.</span></h1>
  <p class="ff-intro">장면 한 조각을 떼어내고,<br>기울여 보고, 여기 남겨 두세요.</p>
  <div class="ff-source"><span class="ff-source-dot"></span><span data-readout="input">포인터 프리뷰 · 생성 패턴</span></div>
  <button class="ff-mobile-toggle" type="button" aria-controls="ff-mobile-settings" aria-expanded="false">조작 설정 ▾</button>
  <div class="ff-camera-row"><button data-action="camera">카메라 켜기</button><button data-action="preview" aria-pressed="true">포인터 프리뷰</button></div>
  <p class="ff-notice" data-readout="notice">카메라 없이도 아래 버튼으로 체험할 수 있습니다.</p>
  <div class="ff-relief-controls">
    <ol class="ff-steps"><li data-step="capture"><b>01</b> 프레임 유지</li><li data-step="hold"><b>02</b> 이동 · 변형</li><li data-step="place"><b>03</b> 공간에 배치</li></ol>
    <div class="ff-progress"><i></i></div>
    <div class="ff-status" role="status" aria-live="polite" data-readout="status">프레임을 잡아 시작하세요</div>
    <div class="ff-actions"><button data-action="capture" class="primary">조각 잡기</button><button data-action="place" disabled>여기에 놓기</button></div>
    <div class="ff-transform">
    <label>기울기 <input aria-label="조각 기울기" data-control="tilt" type="range" min="-85" max="85" value="36"></label>
    <label>회전 <input aria-label="프레임 회전" data-control="rotation" type="range" min="-80" max="80" value="0"></label>
    <label>크기 <input aria-label="프레임 크기" data-control="scale" type="range" min="65" max="150" value="100"></label>
    <label>부조 깊이 <input aria-label="부조 깊이" data-control="depth" type="range" min="0" max="150" value="100"></label>
    </div>
    <p class="ff-gesture-help">프리뷰: 화면을 누른 채 0.7초 유지<br>드래그 이동 · 휠 크기 · 손을 떼면 배치</p>
  </div>
  <div class="ff-filter-controls" hidden><label for="effect-select">MATERIAL LIBRARY</label><select id="effect-select">${ne.map((t,e)=>`<option value="${e}">${String(e+1).padStart(2,"0")} / ${t.name}</option>`).join("")}</select><p>프레임을 비틀거나 목록에서 재질을 고르세요.<br>프리뷰에서는 포인터로 프레임을 옮깁니다.</p></div>
  <div class="ff-collection"><span data-readout="count">0 / 5 PIECES</span><button data-action="reset">비우기</button></div>
  <p class="ff-footnote">밝기로 만든 얕은 부조 · 실제 깊이 스캔 아님<br>카메라 영상은 이 브라우저 안에서만 처리합니다.</p>`;document.body.append(w);const u=t=>w.querySelector(t),ve=u('[data-action="capture"]'),Ye=u('[data-action="place"]'),K=u('[data-action="camera"]'),It=u('[data-readout="status"]'),Dt=u('[data-readout="count"]'),I=u('[data-readout="notice"]'),me=u('[data-readout="input"]'),ge=u("#effect-select"),L=matchMedia("(max-width: 720px)"),ee=u(".ff-mobile-toggle"),O=document.createElement("div");O.id="ff-mobile-settings";O.className="ff-mobile-settings";O.setAttribute("aria-label","카메라와 조각 조절 설정");O.tabIndex=0;const ze=[".ff-transform",".ff-switch",".ff-camera-row",".ff-notice",".ff-filter-controls",".ff-footnote"].map(t=>{const e=u(t),r=document.createComment("desktop setting position");return e.before(r),{node:e,marker:r}});function be(){w.dataset.expanded="false",ee.setAttribute("aria-expanded","false"),ee.textContent="조작 설정 ▾",L.matches?(ze.forEach(({node:t})=>O.append(t)),w.append(O)):(ze.forEach(({node:t,marker:e})=>e.after(t)),O.remove())}ee.addEventListener("click",()=>{const t=w.dataset.expanded!=="true";w.dataset.expanded=String(t),ee.setAttribute("aria-expanded",String(t)),ee.textContent=t?"설정 닫기 ▴":"조작 설정 ▾"});L.addEventListener("change",be);be();const h=new Ct,$e=t=>{I.textContent="화면을 시작하지 못했습니다. WebGL을 지원하는 브라우저에서 다시 열어 주세요.",I.setAttribute("role","alert"),console.error("[fingerframe renderer]",t)},ye=(()=>{try{return Tt(xe)}catch(t){throw $e(t),t}})(),ie=(()=>{try{return Rt(oe,_)}catch(t){throw ye.dispose(),$e(t),t}})(),he=Array.from({length:8},()=>new ot(1.2,.55)),Nt=new wt;let C="relief",x="preview",U=null;const T=new Pt;let j=!1,ue=!1,z=!1,A=!1,$=0,je=1,Q=1,k=L.matches?{x:.5,y:.36,width:.52,height:.39*innerWidth/innerHeight,roll:0,tilt:.36}:{x:.61,y:.5,width:.31,height:.34,roll:0,tilt:.36},Z=Qe(k),Y=null,Xe=performance.now(),pe=60,we=0,Ve="";function Ke(){h.active||z||A||(k=L.matches?{...k,x:.5,y:.36,width:.52,height:.39*innerWidth/innerHeight}:{...k,x:.61,y:.5,width:.31,height:.34})}L.addEventListener("change",Ke);function Qe(t){const e=Math.cos(t.roll),r=Math.sin(t.roll);return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([a,n])=>{const o=a*t.width*innerWidth,i=n*t.height*innerHeight;return{x:t.x+(o*e-i*r)/innerWidth,y:t.y+(o*r+i*e)/innerHeight}})}function Ft(t,e){if(!t.present||!t.corners||!m.videoWidth)return ue=!1,null;ue||he.forEach(d=>d.reset()),ue=!0;const r=m.videoWidth/m.videoHeight,a=innerWidth/innerHeight,n=a>r?1:a/r,o=a>r?r/a:1;Z=t.corners.map((d,s)=>({x:(he[s*2].filter(d.x,e)-.5)/n+.5,y:(he[s*2+1].filter(d.y,e)-.5)/o+.5}));const i=Z,c=(d,s)=>Math.hypot((i[d].x-i[s].x)*innerWidth,(i[d].y-i[s].y)*innerHeight),l=c(0,3),p=c(1,2);return{x:i.reduce((d,s)=>d+s.x,0)/4,y:i.reduce((d,s)=>d+s.y,0)/4,width:(c(0,1)+c(3,2))/(2*innerWidth),height:(l+p)/(2*innerHeight),roll:t.roll,tilt:Math.max(-.85,Math.min(.85,.3+(l-p)/Math.max(1,l+p)*2))}}function se(t,e=performance.now()/1e3){for(const r of t)r.type==="capture"&&(ie.capture(r.id,Z,e),B.flash("CAPTURED · 이제 움직여 보세요")),r.type==="dispose"&&ie.disposePiece(r.id),r.type==="place"&&B.flash("PLACED · 한 순간이 남았습니다")}function N(){se(h.place()),A=!1,z=!1}function Ee(){T.cancel(),U?.dispose(),U=null,J(m),x="preview",N(),K.disabled=T.busy,K.textContent="카메라 켜기",me.textContent="포인터 프리뷰 · 생성 패턴",u('[data-action="preview"]').setAttribute("aria-pressed","true"),I.textContent=T.busy?"카메라 요청의 응답을 기다리는 동안 포인터 프리뷰를 사용할 수 있습니다.":"생성 패턴을 입력으로 사용합니다. 화면 또는 조각 잡기를 눌러 보세요."}async function Ht(){if(T.busy)return;if(x==="camera"){Ee();return}const t=T.begin();if(t===null)return;K.disabled=!0,I.textContent="카메라와 손 추적을 준비하고 있습니다…";let e=null;try{if(await it(m),j||!T.accepts(t)){J(m);return}if(e=await yt(m),j||!T.accepts(t)){e.dispose(),J(m);return}U=e,N(),x="camera",K.textContent="카메라 끄기",me.textContent="라이브 카메라 · 양손 추적",u('[data-action="preview"]').setAttribute("aria-pressed","false"),I.textContent="엄지·검지로 사각형을 만든 뒤 잠시 멈추세요. 손을 내리면 조각이 남습니다."}catch{if(e?.dispose(),!T.accepts(t)||j)return;J(m),x="preview",I.textContent="카메라를 시작하지 못했습니다. 포인터 프리뷰는 계속 사용할 수 있습니다.",me.textContent="포인터 프리뷰 · 카메라 연결 안 됨"}finally{T.finish(t),j||(K.disabled=T.busy)}}K.addEventListener("click",()=>{Ht()});u('[data-action="preview"]').addEventListener("click",Ee);ve.addEventListener("click",()=>{h.active||(x==="preview"?(A=!A,A&&h.armManualCapture()):I.textContent="양손으로 사각형을 0.7초 유지하면 자동으로 잡힙니다.")});Ye.addEventListener("click",N);function Ze(){se(h.reset()),A=z=!1,B.flash("COLLECTION CLEARED")}u('[data-action="reset"]').addEventListener("click",Ze);w.querySelectorAll("[data-mode]").forEach(t=>t.addEventListener("click",()=>{N(),C=t.dataset.mode,w.querySelectorAll("[data-mode]").forEach(e=>e.setAttribute("aria-pressed",String(e===t))),u(".ff-relief-controls").hidden=C!=="relief",u(".ff-transform").hidden=C!=="relief",u(".ff-filter-controls").hidden=C!=="filters",xe.hidden=C!=="filters",oe.hidden=C!=="relief",document.body.dataset.mode=C}));ge.addEventListener("change",()=>{$=Number(ge.value)});u('[data-control="tilt"]').addEventListener("input",t=>{k.tilt=Number(t.target.value)/100});u('[data-control="rotation"]').addEventListener("input",t=>{k.roll=Number(t.target.value)*Math.PI/180});u('[data-control="scale"]').addEventListener("input",t=>{Q=Number(t.target.value)/100});u('[data-control="depth"]').addEventListener("input",t=>{je=Number(t.target.value)/100});D.addEventListener("pointermove",t=>{x==="preview"&&(k.x=Math.max(.1,Math.min(.9,t.clientX/innerWidth)),k.y=Math.max(.12,Math.min(.86,t.clientY/innerHeight)))});D.addEventListener("pointerdown",t=>{x==="preview"&&(h.active||h.armManualCapture(),z=!0,D.setPointerCapture(t.pointerId))});D.addEventListener("pointerup",()=>{z&&N()});D.addEventListener("pointercancel",()=>{z&&N()});D.addEventListener("wheel",t=>{x==="preview"&&(t.preventDefault(),Q=Math.max(.65,Math.min(1.5,Q-t.deltaY*.001)),u('[data-control="scale"]').value=String(Q*100))},{passive:!1});window.addEventListener("keydown",t=>{t.target instanceof HTMLInputElement||t.target instanceof HTMLSelectElement||t.target instanceof HTMLButtonElement||(t.code==="Space"&&(t.preventDefault(),h.active?N():x==="preview"&&(h.armManualCapture(),A=!0)),t.key==="Escape"&&N(),t.key.toLowerCase()==="r"&&Ze())});function Gt(t){const e=Math.min(960,innerWidth),r=Math.round(e*innerHeight/innerWidth);(_.width!==e||_.height!==r)&&(_.width=e,_.height=r);const a=At;if(x==="camera"&&m.readyState>=2){const s=Math.max(e/m.videoWidth,r/m.videoHeight);a.save(),a.translate(e,0),a.scale(-1,1),a.drawImage(m,(e-m.videoWidth*s)/2,(r-m.videoHeight*s)/2,m.videoWidth*s,m.videoHeight*s),a.restore();return}a.fillStyle="#0a161c",a.fillRect(0,0,e,r);const n=e*(L.matches?.5:.61),o=r*(L.matches?.36:.48),i=Math.min(e*.31,r*.41),c=a.createRadialGradient(n,o,5,n,o,i*1.5);c.addColorStop(0,"#31535c"),c.addColorStop(1,"#0a161c"),a.fillStyle=c,a.fillRect(0,0,e,r),a.strokeStyle="#9eeaff15",a.lineWidth=.7;for(let s=-24;s<25;s++)a.beginPath(),a.moveTo(n+s*36,0),a.lineTo(n+s*36,r),a.stroke(),a.beginPath(),a.moveTo(0,o+s*36),a.lineTo(e,o+s*36),a.stroke();const l=a.createRadialGradient(n-i*.35,o-i*.5,i*.02,n,o,i);l.addColorStop(0,"#f1f1c0"),l.addColorStop(.3,"#91ebd4"),l.addColorStop(.67,"#279c9c"),l.addColorStop(.92,"#123d52"),l.addColorStop(1,"#040b10"),a.fillStyle=l,a.beginPath(),a.arc(n,o,i,0,Math.PI*2),a.fill(),a.save(),a.beginPath(),a.arc(n,o,i,0,Math.PI*2),a.clip();for(let s=0;s<38;s++){a.strokeStyle=s%4===0?"#eeffdc99":"#0b3b4988",a.lineWidth=s%4===0?1.5:.8,a.beginPath();for(let v=0;v<=70;v++){const g=n-i+v/70*i*2,f=o-i+s/37*i*2+Math.sin(v/70*8+s*.24+t*.17)*i*.13;v===0?a.moveTo(g,f):a.lineTo(g,f)}a.stroke()}a.restore(),a.strokeStyle="#ff7745",a.lineWidth=5,a.beginPath(),a.ellipse(n,o,i*1.2,i*.23,-.35,0,Math.PI),a.stroke();const p=n+Math.cos(t*.25)*i*1.13,d=o+Math.sin(t*.25)*i*.37;a.fillStyle="#ff8750",a.beginPath(),a.arc(p,d,i*.055,0,Math.PI*2),a.fill(),a.fillStyle="#c2e5df",a.font=`${Math.max(9,e/85)}px monospace`,a.fillText("GENERATED STUDY / 02",e*.43,r*.84),a.fillStyle="#5d8d94",a.fillText(`T + ${t.toFixed(1).padStart(6,"0")}     NO CAMERA FEED`,e*.43,r*.88)}function Wt(t,e){const r=Math.min(devicePixelRatio,1.5);(W.width!==Math.round(innerWidth*r)||W.height!==Math.round(innerHeight*r))&&(W.width=Math.round(innerWidth*r),W.height=Math.round(innerHeight*r));const a=Lt;if(a.setTransform(r,0,0,r,0,0),a.clearRect(0,0,innerWidth,innerHeight),!e||h.active||C==="filters")return;const n=t.map(o=>({x:o.x*innerWidth,y:o.y*innerHeight}));a.strokeStyle=h.phase==="focusing"?"#ff8255":"#5ee7f3aa",a.lineWidth=1,a.setLineDash([5,7]),a.beginPath(),n.forEach((o,i)=>{i===0?a.moveTo(o.x,o.y):a.lineTo(o.x,o.y)}),a.closePath(),a.stroke(),a.setLineDash([]),a.lineWidth=3;for(let o=0;o<4;o++){const i=n[o],c=n[(o+1)%4],l=n[(o+3)%4];a.beginPath(),a.moveTo(i.x+(l.x-i.x)*.08,i.y+(l.y-i.y)*.08),a.lineTo(i.x,i.y),a.lineTo(i.x+(c.x-i.x)*.08,i.y+(c.y-i.y)*.08),a.stroke()}a.fillStyle="#b9e7e8",a.font="10px monospace",a.fillText(h.phase==="focusing"?`HOLD  ${Math.round(h.progress*100)}%`:"HOLD TO CAPTURE",n[0].x,n[0].y-13)}function _t(){const e={idle:"프레임을 잡아 시작하세요",focusing:"잠시 멈추세요 · 장면을 잡는 중",holding:"잡았습니다 · 움직이고 기울여 보세요",recovering:"손을 찾는 중 · 마지막 위치를 유지합니다",cooldown:"놓았습니다 · 손을 펴서 다음 조각을 준비하세요"}[h.phase];e!==Ve&&(It.textContent=e,Ve=e),w.dataset.phase=h.phase,u(".ff-progress i").style.width=`${h.progress*100}%`,ve.disabled=!!h.active||x==="camera",ve.textContent=A&&!h.active?"잡기 취소":"조각 잡기",Ye.disabled=!h.active,Dt.textContent=`${h.pieces.length} / 5 PIECES`,document.body.dataset.pieces=String(h.pieces.length),document.body.dataset.phase=h.phase}function Je(){if(j)return;const t=performance.now(),e=t/1e3,r=Math.min(.1,(t-Xe)/1e3);if(Xe=t,pe+=(1/Math.max(.001,r)-pe)*.06,Gt(e),x==="camera"&&U){let a={present:!1,corners:null,roll:0};try{a=U.read()}catch{Ee(),I.textContent="손 추적이 중단되어 포인터 프리뷰로 전환했습니다."}if(Y=Ft(a,e),C==="filters"){const n=a.present?Nt.update(a.roll,t):0;n&&($=($+n+ne.length)%ne.length,ge.value=String($),B.flash(ne[$].name))}}else{const a={...k,width:k.width*Q,height:k.height*Q};Z=Qe(a),Y=z||A?a:null}C==="relief"?(se(h.update(Y,r),e),ie.render(h.pieces,e,je)):ye.render(_,Z,x==="preview"||Y?1:0,$,e),Wt(Z,x==="preview"||!!Y),B.setTracking(x==="camera"&&!!Y),B.setFps(pe),_t(),we=requestAnimationFrame(Je)}xe.hidden=!0;document.body.dataset.mode=C;we=requestAnimationFrame(Je);addEventListener("pagehide",()=>{j=!0,T.cancel(),cancelAnimationFrame(we),L.removeEventListener("change",be),L.removeEventListener("change",Ke),U?.dispose(),U=null,J(m),se(h.reset()),ie.dispose(),ye.dispose()});
