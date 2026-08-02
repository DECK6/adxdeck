function r(e){const l=String(e??"#5EE7F3").replace("#",""),o=/^[0-9a-f]{6}$/i.test(l)?l:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(o.slice(a,a+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_columns;
uniform float u_refraction;
uniform float u_bevel;
uniform float u_shimmer;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  p += u_seed * 0.017;
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  float phase = u_t * TAU * u_shimmer;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 gridSize = vec2(u_columns, max(2.0, floor(u_columns / aspect + 0.5)));
  vec2 gridUv = v_uv * gridSize;
  vec2 cell = floor(gridUv);
  vec2 local = fract(gridUv);
  vec2 centered = local - 0.5;
  float cellSeed = hash(cell);

  float radius = length(centered * vec2(1.0, 1.08));
  float bulge = max(0.0, 1.0 - radius * 1.85);
  float pulse = sin(phase + cellSeed * TAU);
  vec2 facet = vec2(
    sin((local.y + cellSeed) * TAU + phase),
    cos((local.x - cellSeed) * TAU - phase)
  );
  vec2 lensLocal = centered * (1.0 - u_refraction * (1.8 + bulge * 2.4));
  lensLocal += facet * u_refraction * (0.09 + bulge * 0.13) * pulse;
  vec2 sampleUv = clamp((cell + 0.5 + lensLocal) / gridSize, 0.0, 1.0);

  vec4 subject = texture2D(u_subject, sampleUv);
  vec2 borderDistance = min(local, 1.0 - local);
  float nearestBorder = min(borderDistance.x, borderDistance.y);
  float grout = 1.0 - smoothstep(0.012, 0.035, nearestBorder);
  float bevelBand = 1.0 - smoothstep(u_bevel, u_bevel + 0.045, nearestBorder);
  bevelBand *= 1.0 - grout;
  vec2 bevelNormal = normalize(centered + vec2(0.0001));
  float bevelLight = clamp(dot(bevelNormal, normalize(vec2(-0.62, 0.78))) * 0.5 + 0.5, 0.0, 1.0);
  float travelingGlint = pow(max(0.0, sin((cell.x - cell.y * 0.7) * 0.8 - phase + cellSeed)), 14.0);
  travelingGlint *= bevelBand;

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 glassField = background + u_signal * (0.018 + bulge * 0.025);
  vec3 color = mix(glassField, subject.rgb, subject.a * (0.9 - bevelBand * 0.16));
  color = mix(color, background * 0.58, grout * 0.92);
  color += u_signal * bevelBand * (0.035 + bevelLight * 0.11);
  color += mix(vec3(0.9, 1.0, 1.0), u_signal, 0.45) * travelingGlint * 0.36;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_fps:e.fps,u_seed:e.random("shader-seed")*1e3,u_columns:Math.min(14,Math.max(4,Math.round(Number(e.params.columns??8)))),u_refraction:Math.min(.16,Math.max(.01,Number(e.params.refraction??.075))),u_bevel:Math.min(.22,Math.max(.04,Number(e.params.bevel??.12))),u_shimmer:Math.min(3,Math.max(1,Math.round(Number(e.params.shimmer??1)))),u_signal:r(e.params.signal)})}};export{c as default};
