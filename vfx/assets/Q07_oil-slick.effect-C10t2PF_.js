function c(e){const o=String(e??"#5EE7F3").replace("#",""),s=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(s.slice(a,a+2),16)/255)}const i={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_scale;
uniform float u_thickness;
uniform float u_iridescence;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.55;
  p = p * 2.08 + 9.3;
  value += noise2(p) * 0.28;
  p = p * 2.03 + 17.1;
  value += noise2(p) * 0.14;
  return value;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  float phase = TAU * u_t * u_speed;
  vec2 loopA = vec2(cos(phase), sin(phase));
  vec2 loopB = vec2(cos(phase + 2.2), sin(phase + 2.2));
  float broad = fbm(p * 0.52 + loopA * 1.15);
  float fine = fbm(p * 1.18 - loopB * 0.72 + broad * 2.1);
  float thickness = (broad * 0.68 + fine * 0.32) * u_thickness;

  vec3 spectrum = 0.5 + 0.5 * cos(TAU * (thickness * 2.4 + vec3(0.0, 0.33, 0.67)));
  spectrum = pow(spectrum, vec3(1.25));
  float contour = pow(0.5 + 0.5 * cos(thickness * TAU * 5.0), 7.0);
  float pool = smoothstep(0.88, 0.18, length((v_uv - 0.5) * vec2(aspect, 1.0)) + (fine - 0.5) * 0.22);

  float e = 0.012;
  vec2 slope = vec2(
    fbm((p + vec2(e, 0.0)) * 0.52 + loopA * 1.15) - broad,
    fbm((p + vec2(0.0, e)) * 0.52 + loopA * 1.15) - broad
  ) / e;
  vec4 subject = texture2D(u_subject, clamp(v_uv + slope * 0.012 * pool, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 oil = mix(u_signal * 0.1, spectrum, u_iridescence);
  oil += u_signal * contour * 0.26;
  vec3 field = mix(background, oil, pool * 0.8);
  vec3 subjectColor = mix(subject.rgb, spectrum, pool * u_iridescence * 0.18);
  vec3 color = mix(field, subjectColor, subject.a * (0.76 + pool * 0.18));
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_scale:Math.min(7,Math.max(1.5,Number(e.params.scale??3.8))),u_thickness:Math.min(2,Math.max(.2,Number(e.params.thickness??1.08))),u_iridescence:Math.min(1,Math.max(0,Number(e.params.iridescence??.84))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:c(e.params.signal)})}};export{i as default};
