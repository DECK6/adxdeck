const n=`import type { FxKernel } from '../../src/fx/types';

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
uniform float u_density;
uniform float u_pointSize;
uniform float u_scatter;
uniform float u_threshold;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  return fract(sin(dot(p + u_seed, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash22(vec2 p) {
  return vec2(hash21(p), hash21(p + 41.37));
}

void main() {
  float phase = u_t * TAU;
  float convergence = 0.5 - 0.5 * cos(phase);
  convergence = convergence * convergence * (3.0 - 2.0 * convergence);
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 grid = vec2(u_density * aspect, u_density);
  vec2 cell = floor(v_uv * grid);
  vec2 local = fract(v_uv * grid);
  vec2 randomOffset = (hash22(cell) - 0.5) * u_scatter;
  vec2 pointCenter = 0.5 + randomOffset * (1.0 - convergence);
  float distanceToPoint = length(local - pointCenter);
  float point = 1.0 - smoothstep(u_pointSize * 0.72, u_pointSize, distanceToPoint);

  vec2 targetUv = (cell + 0.5) / grid;
  vec4 target = texture2D(u_subject, clamp(targetUv, 0.0, 1.0));
  float probability = smoothstep(u_threshold, min(1.0, u_threshold + 0.26), target.a);
  float accepted = step(hash21(cell + 93.4), probability);
  float orbitDust = (1.0 - convergence) * step(0.86, hash21(cell + 17.2));
  float visible = point * max(accepted, orbitDust * 0.55);

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 sourceColor = mix(u_signal * (0.42 + hash21(cell + 7.0) * 0.38), target.rgb, target.a * convergence);
  float glow = (1.0 - smoothstep(u_pointSize, u_pointSize * 2.2, distanceToPoint)) * accepted;
  vec3 color = background + sourceColor * visible;
  color += u_signal * glow * (0.05 + convergence * 0.11);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_density: Math.min(96, Math.max(24, Math.round(Number(ctx.params.density ?? 58)))),
      u_pointSize: Math.min(0.48, Math.max(0.15, Number(ctx.params.pointSize ?? 0.29))),
      u_scatter: Math.min(1, Math.max(0.1, Number(ctx.params.scatter ?? 0.72))),
      u_threshold: Math.min(0.9, Math.max(0.02, Number(ctx.params.threshold ?? 0.16))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
