function s(e){const a=String(e??"#5EE7F3").replace("#",""),t=/^[0-9a-f]{6}$/i.test(a)?a:"5EE7F3";return[0,2,4].map(o=>Number.parseInt(t.slice(o,o+2),16)/255)}const n={kind:"webgl",shader:{frag:`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_gain;
uniform float u_grain;
uniform float u_scan;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float phase = u_t * TAU;
  vec2 pixel = 1.0 / max(u_resolution, vec2(1.0));
  vec4 subject = texture2D(u_subject, v_uv);
  vec4 blurA = texture2D(u_subject, clamp(v_uv + vec2(pixel.x * 2.0, 0.0), 0.0, 1.0));
  vec4 blurB = texture2D(u_subject, clamp(v_uv - vec2(pixel.x * 2.0, 0.0), 0.0, 1.0));
  float luminance = dot(subject.rgb, vec3(0.299, 0.587, 0.114));
  float bloom = max(blurA.a * dot(blurA.rgb, vec3(0.333)), blurB.a * dot(blurB.rgb, vec3(0.333)));
  float tick = floor(mod(u_t, 1.0) * max(1.0, u_fps));
  float noise = hash21(floor(v_uv * u_resolution * 0.6) + tick);
  float phosphor = clamp((luminance * subject.a + bloom * 0.24) * u_gain + (noise - 0.5) * u_grain, 0.0, 1.0);
  vec3 green = vec3(0.055, 1.0, 0.31) * phosphor;
  green += vec3(0.03, 0.35, 0.08) * bloom * 0.3;

  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float leftLens = length(p - vec2(-0.19, 0.0));
  float rightLens = length(p - vec2(0.19, 0.0));
  float lens = 1.0 - smoothstep(0.39, 0.48, min(leftLens, rightLens));
  float edgeGlow = 1.0 - smoothstep(0.006, 0.018, abs(min(leftLens, rightLens) - 0.435));
  float scanline = 0.5 + 0.5 * sin(v_uv.y * u_resolution.y * 1.57 + phase * 4.0);
  float scanBar = 1.0 - smoothstep(0.0, 0.055, abs(fract(v_uv.y - u_t) - 0.5));

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, green * (0.84 + scanline * 0.16 * u_scan), lens);
  color += vec3(0.08, 0.72, 0.2) * scanBar * lens * u_scan * 0.08;
  color += u_signal * edgeGlow * 0.13;
  float centerMark = (1.0 - smoothstep(0.001, 0.004, abs(p.x))) * step(abs(p.y), 0.025);
  centerMark += (1.0 - smoothstep(0.001, 0.004, abs(p.y))) * step(abs(p.x), 0.025);
  color += u_signal * centerMark * (0.32 + 0.08 * cos(phase));
  gl_FragColor = vec4(color, 1.0);
}
`,uniforms:e=>({u_gain:Math.min(2.4,Math.max(.7,Number(e.params.gain??1.55))),u_grain:Math.min(.3,Math.max(0,Number(e.params.grain??.11))),u_scan:Math.min(1,Math.max(0,Number(e.params.scan??.62))),u_signal:s(e.params.signal),u_fps:e.fps,u_seed:e.random("shader-seed")*4096})}};export{n as default};
