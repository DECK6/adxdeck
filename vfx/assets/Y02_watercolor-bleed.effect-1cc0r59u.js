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
uniform float u_bleed;
uniform float u_grain;
uniform float u_pigment;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p + u_seed * 17.0, vec2(127.1, 311.7))) * 43758.5453);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.54;
  value += noise2(p * 2.03 + 8.7) * 0.28;
  value += noise2(p * 4.09 - 3.4) * 0.12;
  value += noise2(p * 8.17 + 14.1) * 0.06;
  return value;
}

void main() {
  float phase = u_t * TAU;
  vec2 loop = vec2(cos(phase), sin(phase));
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 paperPoint = v_uv * aspect * 7.0;
  float broad = fbm(paperPoint + loop * 1.4);
  float fiber = fbm(paperPoint * 5.2 - loop * 0.7 + 23.0);
  vec2 warp = vec2(
    fbm(paperPoint * 0.72 + loop * 1.1),
    fbm(paperPoint * 0.72 - loop.yx * 1.1 + 11.0)
  ) - 0.5;
  vec2 texel = 1.0 / max(u_resolution, vec2(1.0));
  vec2 warpedUv = clamp(v_uv + warp * texel * 9.0 * u_bleed, 0.0, 1.0);
  vec4 center = texture2D(u_subject, warpedUv);

  float radius = (3.0 + broad * 8.0) * u_bleed;
  vec2 dx = vec2(radius, 0.0) * texel;
  vec2 dy = vec2(0.0, radius) * texel;
  vec2 dd = vec2(radius * 0.7071) * texel;
  float spread = center.a;
  spread = max(spread, texture2D(u_subject, clamp(warpedUv + dx, 0.0, 1.0)).a);
  spread = max(spread, texture2D(u_subject, clamp(warpedUv - dx, 0.0, 1.0)).a);
  spread = max(spread, texture2D(u_subject, clamp(warpedUv + dy, 0.0, 1.0)).a);
  spread = max(spread, texture2D(u_subject, clamp(warpedUv - dy, 0.0, 1.0)).a);
  spread = max(spread, texture2D(u_subject, clamp(warpedUv + dd, 0.0, 1.0)).a);
  spread = max(spread, texture2D(u_subject, clamp(warpedUv - dd, 0.0, 1.0)).a);
  float bloom = smoothstep(0.04 + broad * 0.1, 0.72, spread) * (0.62 + broad * 0.38);
  float boundary = clamp(bloom - center.a * 0.58, 0.0, 1.0);
  float pool = smoothstep(0.03, 0.18, abs(spread - center.a)) * (0.42 + fiber * 0.58);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 paper = background + u_signal * (0.012 + fiber * u_grain * 0.025);
  float luma = dot(center.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 wash = mix(u_signal * 0.16, center.rgb + u_signal * 0.09, center.a);
  wash *= 0.68 + luma * 0.38;
  float granulation = mix(1.0, 0.54 + fiber * 0.72, u_grain);
  vec3 color = mix(paper, wash * granulation, bloom * u_pigment * 0.88);
  color += u_signal * boundary * 0.12;
  color = mix(color, u_signal * 0.11, pool * u_pigment * 0.22);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_bleed: Math.min(1.5, Math.max(0.2, Number(ctx.params.bleed ?? 0.85))),
      u_grain: Math.min(1, Math.max(0.1, Number(ctx.params.grain ?? 0.58))),
      u_pigment: Math.min(1.3, Math.max(0.35, Number(ctx.params.pigment ?? 0.9))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random('shader-seed'),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
