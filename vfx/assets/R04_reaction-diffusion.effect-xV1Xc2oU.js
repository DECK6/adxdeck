function i(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const l={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_scale;
uniform float u_growth;
uniform float u_detail;
uniform float u_speed;
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
  float value = noise2(p) * 0.53;
  value += noise2(p * 2.02 + vec2(6.3, 1.7)) * 0.27;
  value += noise2(p * 4.06 + vec2(2.4, 8.8)) * 0.13;
  value += noise2(p * 8.12 - vec2(5.1, 3.2)) * 0.07;
  return value;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float cycle = 0.5 - 0.5 * cos(phase);
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  vec2 orbit = vec2(cos(phase), sin(phase));

  float coarse = fbm(p * 0.72 + orbit * 0.68);
  vec2 domain = vec2(
    fbm(p + orbit * 0.9 + 3.1),
    fbm(p - orbit.yx * 0.9 + 8.7)
  );
  float medium = fbm(p * 1.38 + (domain - 0.5) * 2.8);
  float fine = fbm(p * 2.75 - orbit * 1.1 + 12.4);
  float layered = mix(coarse, medium, 0.38 + cycle * 0.32);
  layered = mix(layered, fine, cycle * u_detail * 0.24);

  float threshold = mix(0.74, 0.36, cycle * u_growth);
  float colonies = smoothstep(threshold - 0.055, threshold + 0.055, layered);
  float membranes = 1.0 - smoothstep(0.035, 0.13, abs(layered - threshold));
  float subdivision = 1.0 - smoothstep(0.018, 0.09, abs(fine - 0.5));
  subdivision *= colonies * cycle * u_detail;
  float pattern = clamp(colonies * 0.58 + membranes * 0.74 + subdivision * 0.32, 0.0, 1.0);

  vec2 normal = vec2(
    fbm(p + vec2(0.06, 0.0) + domain) - fbm(p - vec2(0.06, 0.0) + domain),
    fbm(p + vec2(0.0, 0.06) + domain) - fbm(p - vec2(0.0, 0.06) + domain)
  );
  vec2 sampleUv = clamp(v_uv + normal * pattern * 0.018, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * (pattern * 0.16 + membranes * 0.12);
  field += vec3(0.025, 0.034, 0.04) * colonies;
  vec3 subjectColor = subject.rgb + u_signal * membranes * 0.11;
  vec3 color = mix(field, subjectColor, subject.a * (0.76 + pattern * 0.2));
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_scale:Math.min(9,Math.max(2,Number(e.params.scale??4.8))),u_growth:Math.min(1.2,Math.max(.2,Number(e.params.growth??.82))),u_detail:Math.min(1.4,Math.max(.2,Number(e.params.detail??.9))),u_speed:Math.min(2,Math.max(.5,Number(e.params.speed??1))),u_signal:i(e.params.signal)})}};export{l as default};
