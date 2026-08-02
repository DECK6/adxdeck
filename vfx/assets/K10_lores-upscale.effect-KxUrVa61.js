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
uniform float u_pixelSize;
uniform float u_interpolation;
uniform float u_scanlines;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 value) {
  return fract(sin(dot(value + u_seed, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 grid = max(vec2(1.0), floor(u_resolution / u_pixelSize));
  vec2 samplePosition = v_uv * grid - 0.5;
  vec2 base = floor(samplePosition);
  vec2 fraction = smoothstep(vec2(0.0), vec2(1.0), fract(samplePosition));
  vec2 texel = 1.0 / grid;
  vec2 uv00 = clamp((base + 0.5) * texel, 0.0, 1.0);
  vec2 uv10 = clamp((base + vec2(1.5, 0.5)) * texel, 0.0, 1.0);
  vec2 uv01 = clamp((base + vec2(0.5, 1.5)) * texel, 0.0, 1.0);
  vec2 uv11 = clamp((base + 1.5) * texel, 0.0, 1.0);
  vec4 nearestSample = texture2D(u_subject, uv00);
  vec4 smoothSample = mix(
    mix(texture2D(u_subject, uv00), texture2D(u_subject, uv10), fraction.x),
    mix(texture2D(u_subject, uv01), texture2D(u_subject, uv11), fraction.x),
    fraction.y
  );
  vec4 subject = mix(nearestSample, smoothSample, u_interpolation);

  vec2 local = fract(v_uv * grid);
  float horizontalScan = 0.5 + 0.5 * cos(local.y * TAU);
  float scanShade = mix(1.0, 0.58 + horizontalScan * 0.42, u_scanlines);
  float gridEdge = max(
    1.0 - smoothstep(0.0, 0.08, min(local.x, 1.0 - local.x)),
    1.0 - smoothstep(0.0, 0.08, min(local.y, 1.0 - local.y))
  );
  float sweep = exp(-abs(v_uv.y - fract(u_t + u_seed * 0.001)) * 42.0);
  float cellNoise = hash21(base) * 0.025;
  float framePulse = 0.98 + 0.02 * sin((u_frame / max(u_fps, 1.0)) * TAU);

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = mix(background, subject.rgb, subject.a);
  color *= scanShade * framePulse;
  color += u_signal * (gridEdge * 0.055 + sweep * 0.1 + cellNoise * subject.a);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_pixelSize: Math.min(24, Math.max(3, Math.round(Number(ctx.params.pixelSize ?? 11)))),
      u_interpolation: Math.min(1, Math.max(0, Number(ctx.params.interpolation ?? 0.18))),
      u_scanlines: Math.min(1, Math.max(0, Number(ctx.params.scanlines ?? 0.72))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
