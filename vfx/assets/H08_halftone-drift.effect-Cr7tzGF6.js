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
uniform float u_cellSize;
uniform float u_amplitude;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  vec2 pixel = v_uv * u_resolution;
  float angle = 0.22;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 rotated = rotation * (pixel - u_resolution * 0.5);
  vec2 cellUv = fract(rotated / u_cellSize) - 0.5;
  vec2 gradientCenter = vec2(0.5 + cos(phase + u_seed) * 0.34, 0.5 + sin(phase + u_seed) * 0.27);
  float distanceToGradient = length((v_uv - gradientCenter) * vec2(1.18, 1.0));
  float wave = 0.5 + 0.5 * sin((v_uv.x * 1.3 + v_uv.y) * TAU * 1.45 - phase);
  float radius = 0.08 + u_amplitude * (0.42 * exp(-distanceToGradient * 2.8) + wave * 0.16);
  float antialias = 1.25 / u_cellSize;
  float dotMask = 1.0 - smoothstep(radius - antialias, radius + antialias, length(cellUv));

  vec3 ink = vec3(0.05098, 0.05490, 0.06275);
  vec3 dotColor = mix(u_signal * 0.24, u_signal * 0.62, wave);
  vec3 field = mix(ink, dotColor, dotMask * (0.36 + u_amplitude * 0.3));
  field += u_signal * exp(-distanceToGradient * 4.0) * 0.035;

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 color = mix(field, subject.rgb, subject.a * 0.26);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_resolution: [ctx.width, ctx.height],
      u_frame: ctx.frame,
      u_t: ctx.t,
      u_fps: ctx.fps,
      u_seed: ctx.random('shader-seed') * 6.28318530718,
      u_cellSize: Math.min(22, Math.max(7, Number(ctx.params.cellSize ?? 13))),
      u_amplitude: Math.min(0.8, Math.max(0.15, Number(ctx.params.amplitude ?? 0.48))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
