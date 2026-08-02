function l(e){const o=String(e??"#5EE7F3").replace("#",""),s=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(s.slice(a,a+2),16)/255)}const u={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_scale;
uniform float u_contrast;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p + u_seed * 17.0, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 eased = local * local * (3.0 - 2.0 * local);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), eased.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), eased.x),
    eased.y
  );
}

float fbm(vec2 p) {
  float sum = noise(p) * 0.58;
  sum += noise(p * 2.03 + 4.7) * 0.28;
  sum += noise(p * 4.07 + 9.2) * 0.14;
  return sum;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  vec2 loopA = vec2(cos(phase), sin(phase)) * 0.62;
  vec2 loopB = vec2(cos(phase + 2.1), sin(phase + 2.1)) * 0.44;
  vec2 domain = vec2(fbm(p * 0.72 + loopA), fbm(p * 0.72 + loopB));
  float flow = fbm(p + (domain - 0.5) * 2.2 + loopA * 0.34);
  float ribbon = 1.0 - abs(flow * 2.0 - 1.0);
  ribbon = smoothstep(0.35, 0.88, ribbon);

  vec3 ink = vec3(0.05098, 0.05490, 0.06275);
  float tone = (flow - 0.5) * u_contrast;
  vec3 field = ink + u_signal * (0.018 + tone * 0.09 + ribbon * u_contrast * 0.035);
  field += vec3(0.04, 0.03, 0.07) * (1.0 - flow) * 0.12;

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 color = mix(field, subject.rgb, subject.a * 0.24);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,uniforms:e=>({u_resolution:[e.width,e.height],u_frame:e.frame,u_t:e.t,u_fps:e.fps,u_seed:e.random("shader-seed"),u_scale:Math.min(6,Math.max(1.4,Number(e.params.scale??3.2))),u_contrast:Math.min(.8,Math.max(.15,Number(e.params.contrast??.38))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:l(e.params.signal)})}};export{u as default};
