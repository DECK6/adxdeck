function r(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const l={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_density;
uniform float u_exposure;
uniform float u_decay;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float subjectEnergy(vec4 sampleColor) {
  float luminance = dot(sampleColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  return max(sampleColor.a, luminance * sampleColor.a);
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 lightPosition = vec2(0.5 + cos(phase) * 0.31, 0.25 + sin(phase * 2.0) * 0.10);
  vec2 sampleStep = (lightPosition - v_uv) * u_density / 32.0;
  vec2 sampleUv = v_uv;
  float illumination = 1.0;
  float scattered = 0.0;

  for (int index = 0; index < 32; index++) {
    sampleUv += sampleStep;
    vec4 sampleColor = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
    scattered += subjectEnergy(sampleColor) * illumination;
    illumination *= u_decay;
  }
  scattered /= 32.0;

  vec2 ray = (v_uv - lightPosition) * vec2(aspect, 1.0);
  float angle = atan(ray.y, ray.x);
  float distanceFromLight = length(ray);
  float angularField = sin(angle * 9.0 + sin(angle * 4.0 - phase) * 2.3 + phase * 2.0);
  angularField += sin(angle * 17.0 - phase * 3.0) * 0.48;
  float proceduralRays = pow(clamp(angularField * 0.34 + 0.48, 0.0, 1.0), 5.0);
  proceduralRays *= exp(-distanceFromLight * 1.7) * smoothstep(0.015, 0.12, distanceFromLight);
  float sourceGlow = exp(-distanceFromLight * 18.0);

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = mix(background, subject.rgb, subject.a);
  float rays = scattered * 1.9 + proceduralRays * 0.52 + sourceGlow * 0.75;
  color += u_signal * rays * u_exposure;
  color += vec3(1.0) * sourceGlow * u_exposure * 0.24;
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_density:Math.min(1.2,Math.max(.3,Number(e.params.density??.76))),u_exposure:Math.min(1.5,Math.max(0,Number(e.params.exposure??.78))),u_decay:Math.min(.98,Math.max(.82,Number(e.params.decay??.93))),u_speed:Math.min(3,Math.max(1,Math.round(Number(e.params.speed??1)))),u_signal:r(e.params.signal)})}};export{l as default};
