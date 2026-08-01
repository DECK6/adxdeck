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
uniform float u_amount;
uniform float u_radius;
uniform float u_travel;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 lensCenter = vec2(0.5) + vec2(cos(phase), sin(phase * 2.0) * 0.58) * u_travel;
  vec2 p = (v_uv - lensCenter) * vec2(aspect, 1.0);
  float distanceFromLens = length(p);
  float normalizedRadius = clamp(distanceFromLens / u_radius, 0.0, 1.0);
  float lensMask = 1.0 - smoothstep(0.0, 1.0, normalizedRadius);
  lensMask *= lensMask;
  float breathing = 0.76 + 0.24 * sin(phase + 0.65);
  float scale = max(0.18, 1.0 - u_amount * lensMask * breathing * 0.72);
  vec2 sampleP = p * scale;
  vec2 sampleUv = clamp(lensCenter + sampleP / vec2(aspect, 1.0), 0.0, 1.0);

  vec2 radial = p / max(distanceFromLens, 0.0001) / vec2(aspect, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec4 edgeSample = texture2D(u_subject, clamp(sampleUv + radial * 0.005, 0.0, 1.0));
  float subjectEdge = abs(subject.a - edgeSample.a) + length(subject.rgb - edgeSample.rgb) * 0.3;
  float rim = 1.0 - smoothstep(0.0, 0.025, abs(distanceFromLens - u_radius));
  float glass = pow(max(0.0, 1.0 - normalizedRadius), 5.0) * 0.08;

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background + u_signal * (rim * 0.055 + glass), subject.rgb, subject.a);
  color += u_signal * subjectEdge * lensMask * 0.48;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_amount: Math.min(1, Math.max(-1, Number(ctx.params.amount ?? 0.72))),
      u_radius: Math.min(0.72, Math.max(0.18, Number(ctx.params.radius ?? 0.42))),
      u_travel: Math.min(0.28, Math.max(0, Number(ctx.params.travel ?? 0.16))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
