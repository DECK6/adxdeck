function l(a){const e=String(a??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(e)?e:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const s={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_scale;
uniform float u_density;
uniform float u_rotation;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  local = local * local * (3.0 - 2.0 * local);
  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}

float cloud(vec2 p) {
  float value = 0.0;
  float weight = 0.52;
  for (int octave = 0; octave < 4; octave++) {
    value += noise2(p) * weight;
    p = p * 2.03 + vec2(7.1, 3.7);
    weight *= 0.5;
  }
  return value;
}

void main() {
  float phase = u_t * TAU;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float angle = phase * u_rotation;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

  vec2 orbitA = vec2(cos(phase), sin(phase)) * 0.34;
  vec2 orbitB = vec2(cos(phase + 2.094), sin(phase + 2.094)) * 0.27;
  float nearLayer = cloud(rotation * p * u_scale + orbitA + 8.0);
  float farLayer = cloud(rotation * p * (u_scale * 1.72) - orbitB + 19.0);
  float spiral = sin(atan(p.y, p.x) * 3.0 - length(p) * 11.0 + phase) * 0.5 + 0.5;
  float gas = smoothstep(0.38, 0.86, nearLayer * 0.72 + farLayer * 0.44 + spiral * 0.16);
  gas *= u_density * smoothstep(0.92, 0.12, length(p));
  float stars = step(0.9965, hash21(floor(v_uv * u_resolution * 0.55))) * (0.45 + 0.55 * sin(phase + hash21(floor(v_uv * u_resolution)) * TAU));

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 violet = vec3(0.20, 0.08, 0.34);
  vec3 color = background + mix(violet, u_signal, farLayer) * gas * 0.72;
  color += u_signal * pow(gas, 2.0) * 0.22 + vec3(stars * 0.34);
  vec4 subject = texture2D(u_subject, v_uv);
  color = mix(color, subject.rgb, subject.a * 0.27);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:a=>({u_resolution:[a.width,a.height],u_frame:a.frame,u_t:a.t,u_fps:a.fps,u_seed:a.random("shader-seed")*4096,u_scale:Math.min(5,Math.max(1.5,Number(a.params.scale??2.8))),u_density:Math.min(1.4,Math.max(.3,Number(a.params.density??.9))),u_rotation:Math.min(2,Math.max(.5,Number(a.params.rotation??1))),u_signal:l(a.params.signal)})}};export{s as default};
