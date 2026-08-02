function r(e){const a=String(e??"#5EE7F3").replace("#",""),i=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(i.slice(t,t+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_t;
uniform float u_impacts;
uniform float u_spread;
uniform float u_strength;
uniform float u_refraction;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(float value) {
  return fract(sin(value * 127.1) * 43758.5453123);
}

vec2 impactPoint(float index, float aspect) {
  return vec2(
    mix(-aspect * 0.43, aspect * 0.43, hash(index * 3.17 + 1.2)),
    mix(-0.42, 0.42, hash(index * 5.31 + 8.7))
  );
}

float rippleField(vec2 p, float aspect) {
  float field = 0.0;
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    float active = 1.0 - step(u_impacts - 0.5, fi);
    float age = fract(u_t * 2.0 + hash(fi * 7.13 + 2.4));
    vec2 center = impactPoint(fi, aspect);
    float distanceToImpact = length(p - center);
    float radius = age * u_spread;
    float ring = exp(-pow((distanceToImpact - radius) / max(0.008, 0.016 + age * 0.018), 2.0));
    float lifetime = sin(age * 3.14159265359) * (1.0 - age * 0.45);
    float secondary = exp(-pow((distanceToImpact - radius * 0.68) / 0.012, 2.0)) * age;
    field += (ring - secondary * 0.38) * lifetime * active;
  }
  return field / max(1.0, sqrt(u_impacts));
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float e = 0.0035;
  float field = rippleField(p, aspect);
  vec2 gradient = vec2(
    rippleField(p + vec2(e, 0.0), aspect) - rippleField(p - vec2(e, 0.0), aspect),
    rippleField(p + vec2(0.0, e), aspect) - rippleField(p - vec2(0.0, e), aspect)
  ) / (2.0 * e);
  vec2 displacement = gradient * u_refraction * u_strength / vec2(aspect, 1.0);
  vec4 subject = texture2D(u_subject, clamp(v_uv + displacement, 0.0, 1.0));
  float crest = smoothstep(0.08, 0.58, abs(field)) * u_strength;
  float specular = pow(max(0.0, dot(normalize(vec3(-gradient * u_strength, 1.0)), normalize(vec3(-0.5, 0.7, 1.0)))), 12.0);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 water = background + u_signal * (crest * 0.34 + specular * crest * 0.32);
  vec3 subjectColor = mix(subject.rgb, u_signal, crest * 0.13);
  vec3 color = mix(water, subjectColor, subject.a * 0.82);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>{const a=String(e.params.impacts??"7");return{u_impacts:a==="4"?4:a==="10"?10:7,u_spread:Math.min(.7,Math.max(.18,Number(e.params.spread??.46))),u_strength:Math.min(1,Math.max(.15,Number(e.params.strength??.62))),u_refraction:Math.min(.06,Math.max(0,Number(e.params.refraction??.024))),u_signal:r(e.params.signal)}}}};export{c as default};
