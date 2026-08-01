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
uniform float u_turns;
uniform float u_radius;
uniform float u_speed;
uniform vec3 u_signal;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float blendAmount = (0.5 - 0.5 * cos(phase)) * u_amount;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float radial = length(p);
  float angle = atan(p.y, p.x);

  vec2 polarUv = vec2(fract(angle / TAU * u_turns + 0.5), radial / max(u_radius, 0.001));
  vec2 sampleUv = mix(v_uv, polarUv, blendAmount);
  float inside = step(0.0, sampleUv.x) * step(sampleUv.x, 1.0) * step(0.0, sampleUv.y) * step(sampleUv.y, 1.0);
  vec4 subject = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
  vec4 tangentSample = texture2D(u_subject, clamp(sampleUv + vec2(0.003, 0.0), 0.0, 1.0));
  float subjectEdge = abs(subject.a - tangentSample.a) + length(subject.rgb - tangentSample.rgb) * 0.28;

  float ring = pow(0.5 + 0.5 * cos(radial * 72.0 - phase * 2.0), 18.0);
  float spoke = pow(0.5 + 0.5 * cos(angle * 12.0 + phase), 26.0);
  float polarGuide = blendAmount * (ring * 0.7 + spoke * 0.3) * (1.0 - smoothstep(u_radius * 0.78, u_radius, radial));
  float seam = (1.0 - smoothstep(0.0, 0.035, abs(sin(angle * u_turns)))) * blendAmount;
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * (polarGuide * 0.045 + seam * 0.06);
  vec3 color = mix(field, subject.rgb, subject.a * inside);
  color += u_signal * subjectEdge * inside * blendAmount * 0.34;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_amount: Math.min(1, Math.max(0.2, Number(ctx.params.amount ?? 0.9))),
      u_turns: Math.min(2.5, Math.max(0.5, Number(ctx.params.turns ?? 1))),
      u_radius: Math.min(1.2, Math.max(0.55, Number(ctx.params.radius ?? 0.9))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
