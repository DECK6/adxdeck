function i(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_strength;
uniform float u_scale;
uniform float u_flow;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 eased = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), eased.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), eased.x),
    eased.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  value += noise(p) * 0.5;
  p = p * 2.03 + vec2(7.1, 3.7);
  value += noise(p) * 0.25;
  p = p * 2.01 + vec2(5.4, 8.3);
  value += noise(p) * 0.125;
  p = p * 2.04 + vec2(9.2, 1.6);
  value += noise(p) * 0.0625;
  return value / 0.9375;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  vec2 orbitA = vec2(cos(phase), sin(phase)) * u_flow;
  vec2 orbitB = vec2(cos(phase + 2.1), sin(phase + 2.1)) * u_flow;
  float low = fbm(p + orbitA);
  vec2 domain = vec2(fbm(p * 0.82 + orbitA + 4.2), fbm(p * 0.82 + orbitB + 9.7));
  float high = fbm(p + (domain - 0.5) * 3.2 - orbitB);
  vec2 direction = vec2(low - 0.5, high - 0.5);
  direction += vec2(high - low, low + high - 1.0) * 0.42;
  vec2 sampleUv = clamp(v_uv + direction * u_strength, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 edgeSample = texture2D(u_subject, clamp(sampleUv + direction * 0.045, 0.0, 1.0));
  float subjectEdge = abs(subject.a - edgeSample.a) + length(subject.rgb - edgeSample.rgb) * 0.28;

  float ridge = 1.0 - abs(high * 2.0 - 1.0);
  ridge = pow(ridge, 7.0);
  float current = 0.5 + 0.5 * sin((low + high) * 17.0 + phase * 2.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * (ridge * 0.055 + current * 0.018);
  vec3 color = mix(field, subject.rgb, subject.a);
  color += u_signal * subjectEdge * 0.52;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_strength:Math.min(.18,Math.max(0,Number(e.params.strength??.095))),u_scale:Math.min(9,Math.max(1.5,Number(e.params.scale??4.6))),u_flow:Math.min(1.4,Math.max(.2,Number(e.params.flow??.85))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:i(e.params.signal)})}};export{r as default};
