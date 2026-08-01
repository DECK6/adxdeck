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
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_amount;
uniform float u_scale;
uniform float u_viscosity;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(float value) {
  return fract(sin(value * 127.1) * 43758.5453123);
}

float columnNoise(float x) {
  float cell = floor(x);
  float f = fract(x);
  float eased = f * f * (3.0 - 2.0 * f);
  return mix(hash(cell), hash(cell + 1.0), eased);
}

void main() {
  float phase = u_t * TAU * u_speed;
  float columns = v_uv.x * u_scale;
  float coarse = columnNoise(columns + sin(phase) * 0.72);
  float detail = columnNoise(columns * 2.17 - cos(phase) * 1.13);
  float dripLength = pow(mix(coarse, detail, 0.34), 2.0) * u_amount;
  float verticalWave = 0.5 + 0.5 * sin(v_uv.y * 13.0 - phase + coarse * TAU);
  float meltZone = smoothstep(0.08, 0.46, v_uv.y) * (1.0 - smoothstep(0.78, 1.0, v_uv.y));
  float pull = dripLength * mix(0.42, 1.0, verticalWave) * mix(1.25, 0.72, u_viscosity);
  float sway = sin(v_uv.y * 17.0 + phase * 2.0 + coarse * 8.0) * u_amount * 0.055;
  vec2 sampleUv = clamp(v_uv + vec2(sway, pull * meltZone), 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 trailing = texture2D(u_subject, clamp(sampleUv + vec2(0.0, pull * 0.22), 0.0, 1.0));
  float alpha = max(subject.a, trailing.a * u_viscosity);
  vec3 melted = mix(trailing.rgb, subject.rgb, subject.a);

  float falling = fract(v_uv.y * (5.0 + u_scale * 0.18) - u_t * u_speed + coarse);
  float bead = pow(1.0 - abs(falling * 2.0 - 1.0), 12.0);
  float channel = pow(1.0 - abs(fract(columns) * 2.0 - 1.0), 8.0);
  float streak = bead * channel * (0.14 + dripLength * 1.3);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * streak;
  vec3 color = mix(field, melted + u_signal * trailing.a * 0.08, alpha);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_amount: Math.min(0.32, Math.max(0, Number(ctx.params.amount ?? 0.19))),
      u_scale: Math.min(18, Math.max(4, Number(ctx.params.scale ?? 10))),
      u_viscosity: Math.min(1, Math.max(0.25, Number(ctx.params.viscosity ?? 0.68))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
