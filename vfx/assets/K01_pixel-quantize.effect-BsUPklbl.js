function o(e){const a=String(e??"#5EE7F3").replace("#",""),s=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(t=>Number.parseInt(s.slice(t,t+2),16)/255)}const c={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_pixelSize;
uniform float u_paletteMix;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void consider(vec3 source, vec3 candidate, inout vec3 best, inout float bestDistance) {
  float candidateDistance = dot(source - candidate, source - candidate);
  if (candidateDistance < bestDistance) {
    best = candidate;
    bestDistance = candidateDistance;
  }
}

void main() {
  float phase = u_t * TAU;
  float breathingPixel = max(2.0, floor(u_pixelSize * (0.86 + 0.14 * (0.5 - 0.5 * cos(phase))) + 0.5));
  vec2 grid = max(floor(u_resolution / breathingPixel), vec2(1.0));
  vec2 cell = floor(v_uv * grid);
  vec2 sampleUv = clamp((cell + 0.5) / grid, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 source = mix(background, subject.rgb, subject.a);
  source = clamp((source - 0.5) * u_contrast + 0.5, 0.0, 1.0);

  vec3 best = background;
  float bestDistance = dot(source - best, source - best);
  consider(source, vec3(0.055, 0.145, 0.235), best, bestDistance);
  consider(source, u_signal * 0.48, best, bestDistance);
  consider(source, u_signal, best, bestDistance);
  consider(source, vec3(1.0, 0.43, 0.15), best, bestDistance);
  consider(source, vec3(0.92, 0.96, 0.91), best, bestDistance);

  vec2 local = fract(v_uv * grid);
  float border = max(step(0.91, local.x), step(0.91, local.y));
  float subjectCell = smoothstep(0.01, 0.25, subject.a);
  vec3 quantized = best + u_signal * border * subjectCell * 0.075;
  vec3 color = mix(source, quantized, u_paletteMix);
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_pixelSize:Math.min(24,Math.max(3,Math.round(Number(e.params.pixelSize??10)))),u_paletteMix:Math.min(1,Math.max(.4,Number(e.params.paletteMix??.92))),u_contrast:Math.min(1.8,Math.max(.7,Number(e.params.contrast??1.2))),u_signal:o(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")*4096})}};export{c as default};
