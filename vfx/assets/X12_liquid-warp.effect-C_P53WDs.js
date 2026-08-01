function i(e){const a=String(e??"#5EE7F3").replace("#",""),r=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(r.slice(o,o+2),16)/255)}const t={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_warp;
uniform float u_flowScale;
uniform float u_edgeWidth;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.58;
  value += noise2(p * 2.03 + 7.1) * 0.28;
  value += noise2(p * 4.07 - 3.4) * 0.14;
  return value;
}

void main() {
  float phase = u_t * TAU;
  vec2 orbit = vec2(cos(phase), sin(phase));
  vec2 p = v_uv * u_flowScale;
  float field = fbm(p + orbit * 1.35);
  float fieldX = fbm(p + orbit * 1.35 + vec2(0.19, 0.0));
  float fieldY = fbm(p + orbit * 1.35 + vec2(0.0, 0.19));
  vec2 flow = vec2(fieldX - field, fieldY - field) * 4.0;
  flow += vec2(sin(v_uv.y * 18.0 + phase * 2.0), cos(v_uv.x * 15.0 - phase)) * 0.18;

  vec2 warpedUv = clamp(v_uv + flow * u_warp, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, warpedUv);
  float progress = mix(-0.12, 1.12, 0.5 - 0.5 * cos(phase));
  float liquidFront = v_uv.x + (field - 0.5) * 0.42 + flow.y * 0.05;
  float reveal = smoothstep(liquidFront - u_edgeWidth, liquidFront + u_edgeWidth, progress);
  float edge = 1.0 - smoothstep(u_edgeWidth, u_edgeWidth * 2.5, abs(progress - liquidFront));

  vec3 background = vec3(0.051, 0.055, 0.063);
  float current = 0.025 + 0.035 * fbm(p * 0.72 - orbit * 1.7);
  vec3 base = background + u_signal * current;
  vec3 subjectColor = mix(base, subject.rgb, subject.a);
  vec3 color = mix(base, subjectColor, reveal);
  color += u_signal * edge * (0.22 + subject.a * 0.38);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_warp:Math.min(.16,Math.max(.01,Number(e.params.warp??.085))),u_flowScale:Math.min(8,Math.max(1.5,Number(e.params.flowScale??4.2))),u_edgeWidth:Math.min(.16,Math.max(.01,Number(e.params.edgeWidth??.065))),u_signal:i(e.params.signal)})}};export{t as default};
