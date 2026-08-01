function l(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_advection;
uniform float u_turbulence;
uniform float u_detail;
uniform float u_dye;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.5;
  p = p * 2.03 + 7.1;
  value += noise2(p) * 0.25;
  p = p * 2.01 + 13.7;
  value += noise2(p) * 0.125;
  p = p * 2.04 + 3.9;
  value += noise2(p) * 0.0625;
  return value;
}

vec2 curl(vec2 p, vec2 loopOffset) {
  float e = 0.035;
  float x1 = fbm(p + vec2(e, 0.0) + loopOffset);
  float x0 = fbm(p - vec2(e, 0.0) + loopOffset);
  float y1 = fbm(p + vec2(0.0, e) + loopOffset);
  float y0 = fbm(p - vec2(0.0, e) + loopOffset);
  return vec2(y1 - y0, x0 - x1) / (2.0 * e);
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = TAU * u_t;
  vec2 loopA = vec2(cos(phase), sin(phase));
  vec2 loopB = vec2(cos(phase + 2.094), sin(phase + 2.094));

  vec2 base = p * u_detail;
  vec2 velocityA = curl(base * 0.72, loopA * 1.4) * u_turbulence;
  vec2 velocityB = curl(base * 1.31 + 8.4, loopB * 1.1) * u_turbulence;
  vec2 advected = base - (velocityA * 0.72 + velocityB * 0.28) * u_advection;
  float dyeA = fbm(advected + loopA * 0.85);
  float dyeB = fbm(advected * 1.46 - loopB * 0.72 + 17.3);
  float dyeC = fbm(advected * 0.63 + loopB * 1.24 + 31.7);
  float density = smoothstep(0.28, 0.78, dyeA * 0.55 + dyeB * 0.3 + dyeC * 0.15);
  density *= u_dye;
  float filaments = smoothstep(0.035, 0.0, abs(dyeA - dyeB * 0.78 - 0.08));

  vec2 displacement = (velocityA + velocityB * 0.45) * density * 0.018 * u_advection;
  displacement /= vec2(aspect, 1.0);
  vec4 subject = texture2D(u_subject, clamp(v_uv + displacement, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 fluid = mix(background, u_signal * (0.16 + dyeB * 0.22), density * 0.88);
  fluid += u_signal * filaments * density * 0.52;
  vec3 subjectColor = mix(subject.rgb, u_signal, density * 0.24);
  vec3 color = mix(fluid, subjectColor, subject.a * (0.74 + density * 0.26));
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_advection:Math.min(1.4,Math.max(.1,Number(e.params.advection??.82))),u_turbulence:Math.min(2,Math.max(.2,Number(e.params.turbulence??1.1))),u_detail:Math.min(7,Math.max(2,Number(e.params.detail??4.2))),u_dye:Math.min(1,Math.max(.2,Number(e.params.dye??.78))),u_signal:l(e.params.signal)})}};export{c as default};
