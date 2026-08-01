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
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_bitDepth;
uniform float u_blockSize;
uniform float u_intensity;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  vec2 gridSize = max(u_resolution / u_blockSize, vec2(1.0));
  vec2 gridShift = vec2(sin(phase), cos(phase * 2.0)) * (0.48 + u_intensity * 0.72);
  vec2 cell = floor(v_uv * gridSize + gridShift);
  vec2 sampleUv = clamp((cell + 0.5 - gridShift) / gridSize, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);

  vec2 p = sampleUv - 0.5;
  float field = 0.5
    + 0.24 * sin(p.x * 18.0 - phase)
    + 0.20 * cos(p.y * 15.0 + phase * 2.0)
    + 0.16 * sin((p.x + p.y) * 22.0 + phase * 3.0);
  field = clamp(field, 0.0, 1.0);

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 generated = background + u_signal * field * 0.30;
  vec3 source = mix(generated, subject.rgb, subject.a);
  float levels = max(3.0, pow(2.0, floor(u_bitDepth + 0.5)) - 1.0);
  vec3 crushed = floor(source * levels + 0.5) / levels;

  float band = step(0.70, sin((cell.y + cell.x * 0.37) * 0.72 - phase * 3.0) * 0.5 + 0.5);
  crushed = mix(crushed, floor((crushed + u_signal * band * 0.16) * levels) / levels, u_intensity);
  vec3 color = mix(source, crushed, u_intensity);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_bitDepth: Math.min(8, Math.max(2, Math.round(Number(ctx.params.bitDepth ?? 4)))),
      u_blockSize: Math.min(20, Math.max(2, Math.round(Number(ctx.params.blockSize ?? 8)))),
      u_intensity: Math.min(1, Math.max(0, Number(ctx.params.intensity ?? 0.86))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 2)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
