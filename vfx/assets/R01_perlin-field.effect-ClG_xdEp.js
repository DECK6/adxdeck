function r(a){const o=String(a??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(e=>Number.parseInt(t.slice(e,e+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_scale;
uniform float u_contrast;
uniform float u_contours;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 gradient(vec2 cell) {
  float angle = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453123) * TAU;
  return vec2(cos(angle), sin(angle));
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 fade = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(gradient(i), f);
  float b = dot(gradient(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(gradient(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(gradient(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, fade.x), mix(c, d, fade.x), fade.y);
}

float field(vec2 p) {
  float total = 0.0;
  float weight = 0.58;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    total += perlin(p) * weight;
    p = turn * p * 2.03 + vec2(5.2, 1.7);
    weight *= 0.5;
  }
  return total * 0.72 + 0.5;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float loopPhase = TAU * u_t;
  vec2 orbit = vec2(cos(loopPhase), sin(loopPhase)) * 0.72;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * u_scale + orbit;
  float noiseValue = clamp((field(p) - 0.5) * u_contrast + 0.5, 0.0, 1.0);

  float bands = abs(fract(noiseValue * max(u_contours, 1.0)) - 0.5) * 2.0;
  float contour = u_contours < 0.5 ? 0.0 : pow(1.0 - bands, 7.0);
  vec4 subject = texture2D(u_subject, uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 procedural = background + u_signal * (noiseValue * 0.16 + contour * 0.25);
  vec3 subjectColor = subject.rgb * (0.72 + noiseValue * 0.38) + u_signal * contour * 0.10;
  vec3 color = mix(procedural, subjectColor, subject.a);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:a=>({u_scale:Math.min(10,Math.max(1,Number(a.params.scale??4.2))),u_contrast:Math.min(2.4,Math.max(.4,Number(a.params.contrast??1.35))),u_contours:Math.min(18,Math.max(0,Math.round(Number(a.params.contours??9)))),u_signal:r(a.params.signal)})}};export{c as default};
