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
uniform float u_t;
uniform float u_modeA;
uniform float u_modeB;
uniform float u_density;
uniform float u_transition;
uniform vec3 u_signal;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float phase = TAU * u_t;
  float morph = 0.5 - 0.5 * cos(phase * 2.0);
  morph = mix(0.0, morph, u_transition);

  float n = u_modeA;
  float m = u_modeB;
  float plateA = sin(n * PI * p.x) * sin(m * PI * p.y)
    - sin(m * PI * p.x) * sin(n * PI * p.y);
  float plateB = sin((n + 1.0) * PI * p.x) * sin((m - 1.0) * PI * p.y)
    - sin((m - 1.0) * PI * p.x) * sin((n + 1.0) * PI * p.y);
  float field = mix(plateA, plateB, morph);
  float node = 1.0 - smoothstep(0.012, 0.012 + u_density * 0.18, abs(field));
  float halo = 1.0 - smoothstep(0.04, 0.28, abs(field));
  float plateMask = 1.0 - smoothstep(0.88, 1.02, max(abs(p.x), abs(p.y)));
  float rim = smoothstep(0.92, 0.98, max(abs(p.x), abs(p.y)))
    * (1.0 - smoothstep(0.98, 1.02, max(abs(p.x), abs(p.y))));
  float scan = 0.82 + 0.18 * sin(field * 18.0 + phase);

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 plate = mix(background, u_signal * 0.16, plateMask * 0.66);
  plate += u_signal * (node * scan * 0.82 + halo * 0.12 + rim * 0.5) * plateMask;
  vec3 subjectColor = mix(subject.rgb, u_signal, node * 0.34);
  vec3 color = mix(plate, subjectColor, subject.a * (0.72 + node * 0.28));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_modeA: Math.min(9, Math.max(2, Math.round(Number(ctx.params.modeA ?? 4)))),
      u_modeB: Math.min(9, Math.max(2, Math.round(Number(ctx.params.modeB ?? 7)))),
      u_density: Math.min(0.8, Math.max(0.15, Number(ctx.params.density ?? 0.48))),
      u_transition: Math.min(1, Math.max(0, Number(ctx.params.transition ?? 0.72))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
