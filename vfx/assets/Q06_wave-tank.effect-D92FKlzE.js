function o(e){const a=String(e??"#5EE7F3").replace("#",""),i=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(i.slice(t,t+2),16)/255)}const r={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_sources;
uniform float u_frequency;
uniform float u_refraction;
uniform float u_damping;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float heightField(vec2 p, float phase) {
  float height = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float active = 1.0 - step(u_sources - 0.5, fi);
    float angle = fi * TAU / max(u_sources, 1.0) + 0.22 * sin(phase + fi);
    vec2 source = vec2(cos(angle), sin(angle)) * (0.24 + 0.025 * sin(phase * 2.0 + fi));
    float distanceToSource = length(p - source);
    float attenuation = exp(-distanceToSource * u_damping);
    height += sin(distanceToSource * u_frequency - phase * 3.0 + fi * 0.7) * attenuation * active;
  }
  return height / max(u_sources, 1.0);
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = TAU * u_t;
  float e = 0.0035;
  float height = heightField(p, phase);
  vec2 gradient = vec2(
    heightField(p + vec2(e, 0.0), phase) - heightField(p - vec2(e, 0.0), phase),
    heightField(p + vec2(0.0, e), phase) - heightField(p - vec2(0.0, e), phase)
  ) / (2.0 * e);
  vec2 normal = normalize(vec2(-gradient.x, 3.5));
  float light = clamp(dot(normal, normalize(vec2(-0.55, 1.0))), 0.0, 1.0);
  float caustic = pow(0.5 + 0.5 * sin(height * 11.0 + phase), 8.0);

  vec2 displacement = gradient * u_refraction / vec2(aspect, 1.0);
  vec4 subject = texture2D(u_subject, clamp(v_uv + displacement, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 water = background + u_signal * (0.055 + light * 0.2 + caustic * 0.34);
  vec3 subjectColor = mix(subject.rgb, u_signal, caustic * 0.18);
  vec3 color = mix(water, subjectColor, subject.a * 0.82);
  color += u_signal * smoothstep(0.76, 0.98, light) * 0.14;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>{const a=String(e.params.sources??"4");return{u_sources:a==="3"?3:a==="5"?5:4,u_frequency:Math.min(28,Math.max(8,Number(e.params.frequency??17))),u_refraction:Math.min(.08,Math.max(0,Number(e.params.refraction??.032))),u_damping:Math.min(4,Math.max(.5,Number(e.params.damping??1.8))),u_signal:o(e.params.signal)}}}};export{r as default};
