function t(e){const o=String(e??"#5EE7F3").replace("#",""),n=/^[0-9a-f]{6}$/i.test(o)?o:"5EE7F3";return[0,2,4].map(a=>Number.parseInt(n.slice(a,a+2),16)/255)}const u={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_grade;
uniform float u_moonlight;
uniform float u_exposure;
uniform float u_vignette;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float filmNoise(vec2 pixel, float phase) {
  float loopSeed = u_seed + sin(phase) * 17.0 + cos(phase) * 11.0;
  return fract(sin(dot(pixel + loopSeed, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float phase = u_t * TAU;
  float night = 0.5 - 0.5 * cos(phase);
  night = smoothstep(0.04, 0.96, night) * u_grade;
  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 source = mix(background, subject.rgb, subject.a);

  float luminance = dot(source, vec3(0.299, 0.587, 0.114));
  vec3 day = source * mix(1.0, u_exposure, night);
  day = mix(day, vec3(luminance), night * 0.42);
  vec3 blueBlack = vec3(luminance * 0.12, luminance * 0.25, luminance * 0.39);
  vec3 cyanMoon = u_signal * luminance * (0.18 + u_moonlight * 0.34);
  vec3 nightGrade = blueBlack + cyanMoon;

  float skyFalloff = pow(max(0.0, 1.0 - v_uv.y), 2.4);
  float moonPool = exp(-length((v_uv - vec2(0.78, 0.18)) * vec2(1.0, 1.8)) * 5.2);
  nightGrade += u_signal * (skyFalloff * 0.055 + moonPool * 0.12) * u_moonlight;
  vec3 color = mix(day, nightGrade, night);

  vec2 centered = v_uv - 0.5;
  float vignette = smoothstep(0.24, 0.76, dot(centered, centered));
  color *= 1.0 - vignette * u_vignette * night * 0.72;
  float grain = filmNoise(floor(v_uv * u_resolution), phase) - 0.5;
  color += grain * (0.008 + night * 0.018);
  color += u_signal * moonPool * night * 0.045;
  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`,uniforms:e=>({u_grade:Math.min(1,Math.max(0,Number(e.params.grade??.9))),u_moonlight:Math.min(1.5,Math.max(0,Number(e.params.moonlight??.78))),u_exposure:Math.min(1.2,Math.max(.35,Number(e.params.exposure??.72))),u_vignette:Math.min(1,Math.max(0,Number(e.params.vignette??.58))),u_signal:t(e.params.signal)})}};export{u as default};
