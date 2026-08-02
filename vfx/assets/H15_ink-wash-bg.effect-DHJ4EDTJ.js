const e=`import type { FxKernel } from '../../src/fx/types';

function colorToRgb(value: unknown): number[] {
  const hex = String(value ?? '#5EE7F3').replace('#', '');
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : '5EE7F3';
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}

const kernel = {
  kind: 'webgl',
  shader: {
    frag: \`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_scale;
uniform float u_bleed;
uniform float u_layers;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32 + u_seed);
  return fract(p.x * p.y);
}

float noise21(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  local = local * local * (3.0 - 2.0 * local);
  return mix(mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), local.x), mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + 1.0), local.x), local.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int octave = 0; octave < 5; octave++) {
    value += noise21(p) * amplitude;
    p = p * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  float phase = u_t * TAU;
  vec2 loop = vec2(cos(phase), sin(phase)) * 0.42;
  float warp = fbm(p * 0.64 + loop + u_seed * 0.3);
  vec2 warped = p + vec2(fbm(p + loop) - 0.5, fbm(p - loop + 8.4) - 0.5) * (0.55 + u_bleed);
  float washA = smoothstep(0.34, 0.76, fbm(warped + loop * 0.8));
  float washB = smoothstep(0.42, 0.78, fbm(warped * 1.32 - loop * 0.7 + 13.0));
  float washC = smoothstep(0.48, 0.8, fbm(warped * 0.74 + vec2(loop.y, -loop.x) + 27.0));
  float layerMix = clamp((washA + washB * step(2.5, u_layers) + washC * step(4.5, u_layers)) / max(1.0, min(u_layers, 3.0)), 0.0, 1.0);
  float feather = smoothstep(0.18, 0.82, warp + layerMix * u_bleed * 0.3);

  vec3 paper = vec3(0.041, 0.052, 0.056);
  vec3 darkInk = mix(vec3(0.006, 0.012, 0.015), u_signal * 0.055, 0.58);
  vec3 color = mix(paper + u_signal * 0.025, darkInk, layerMix * (0.48 + feather * 0.44));
  color += u_signal * abs(washA - washB) * 0.055;
  vec4 subject = texture2D(u_subject, uv);
  color = mix(color, subject.rgb, subject.a * 0.23);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_resolution: [ctx.width, ctx.height],
      u_frame: ctx.frame,
      u_t: ctx.t,
      u_fps: ctx.fps,
      u_seed: ctx.random('ink-wash-seed'),
      u_scale: Math.min(6, Math.max(1.5, Number(ctx.params.scale ?? 3.2))),
      u_bleed: Math.min(1, Math.max(0.2, Number(ctx.params.bleed ?? 0.7))),
      u_layers: Math.min(6, Math.max(2, Math.round(Number(ctx.params.layers ?? 4)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
