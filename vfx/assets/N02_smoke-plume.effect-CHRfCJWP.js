function s(e){const o=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(t.slice(a,a+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_density;
uniform float u_scale;
uniform float u_drift;
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
  float value = noise2(p) * 0.52;
  value += noise2(p * 2.02 + 5.1) * 0.27;
  value += noise2(p * 4.06 - 8.4) * 0.14;
  value += noise2(p * 8.11 + 2.7) * 0.07;
  return value;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - vec2(0.5, 0.03)) * vec2(aspect, 1.0);
  vec2 orbit = vec2(cos(phase), sin(phase));
  vec2 q = vec2(p.x * u_scale, p.y * u_scale * 0.72);
  float broad = fbm(q + orbit * (0.9 + u_drift));
  float curl = fbm(q * 1.55 + vec2(-orbit.y, orbit.x) * 1.7 + 11.0);
  float sway = sin(p.y * 8.0 - phase * 2.0) * 0.11 * u_drift;
  sway += (broad - 0.5) * 0.28 * u_drift;
  float width = mix(0.14, 0.49, smoothstep(0.02, 0.9, p.y));
  float column = 1.0 - smoothstep(width * 0.42, width, abs(p.x - sway));
  float vertical = smoothstep(-0.03, 0.1, p.y) * (1.0 - smoothstep(0.82, 1.06, p.y));
  float billow = smoothstep(0.29, 0.79, broad * 0.72 + curl * 0.45);
  float smoke = clamp(column * vertical * (0.3 + billow * 0.9) * u_density, 0.0, 1.0);

  vec2 refraction = vec2(
    curl - broad,
    fbm(q + orbit * 1.2 + vec2(0.0, 0.16)) - broad
  ) * smoke * 0.045 * u_drift;
  vec4 subject = texture2D(u_subject, clamp(v_uv + refraction, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  float ambientFlow = 0.5 + 0.5 * sin(v_uv.y * 15.0 + broad * 8.0 - phase * 3.0);
  vec3 base = background + u_signal * ambientFlow * 0.025;
  vec3 subjectColor = mix(base, subject.rgb, subject.a * (1.0 - smoke * 0.34));
  vec3 smokeColor = mix(background * 1.28, u_signal * 0.42, 0.38 + billow * 0.42);
  vec3 color = mix(subjectColor, smokeColor, smoke * (0.38 + billow * 0.34));
  float rim = smoothstep(0.08, 0.34, smoke) * (1.0 - smoothstep(0.34, 0.72, smoke));
  color += u_signal * rim * 0.11;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_density:Math.min(1.25,Math.max(.25,Number(e.params.density??.78))),u_scale:Math.min(6,Math.max(1.5,Number(e.params.scale??3.6))),u_drift:Math.min(1.2,Math.max(.1,Number(e.params.drift??.58))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:s(e.params.signal)})}};export{r as default};
