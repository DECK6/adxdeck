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
uniform float u_pull;
uniform float u_spin;
uniform float u_radius;
uniform float u_depth;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 rotate2(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * p;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float angle = atan(p.y, p.x);
  float phase = u_t * TAU * u_spin;
  float basin = 1.0 - smoothstep(u_radius * 0.25, u_radius, radius);
  float core = 1.0 - smoothstep(u_radius * 0.02, u_radius * 0.24, radius);
  float twist = basin * u_pull * (1.15 + 0.32 / max(radius, 0.075));
  vec2 spun = rotate2(p, phase * basin + twist);
  float inwardPulse = sin(phase + radius * 24.0 - angle * 3.0) * 0.008 * basin * u_pull;
  spun *= 1.0 + inwardPulse - core * u_depth * 0.16;
  vec2 sampleUv = spun / vec2(aspect, 1.0) + 0.5;
  vec4 subject = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));

  float spiralA = 0.5 + 0.5 * sin(angle * 5.0 + radius * 42.0 - phase * 2.0);
  float spiralB = 0.5 + 0.5 * sin(angle * 3.0 + radius * 71.0 + phase);
  float crest = pow(spiralA, 10.0) * basin;
  float foam = pow(spiralB, 18.0) * basin * (1.0 - core);
  float funnel = pow(core, 1.4) * u_depth;
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 water = background + u_signal * (basin * 0.07 + crest * 0.38 + foam * 0.24);
  vec3 subjectColor = mix(subject.rgb, u_signal, crest * 0.18);
  vec3 color = mix(water, subjectColor, subject.a * (0.78 - funnel * 0.52));
  color *= 1.0 - funnel * 0.72;
  color += u_signal * smoothstep(u_radius * 0.3, u_radius * 0.23, radius) * (1.0 - core) * 0.18;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => {
      const spin = String(ctx.params.spin ?? '2');
      return {
        u_pull: Math.min(1, Math.max(0.1, Number(ctx.params.pull ?? 0.64))),
        u_spin: spin === '1' ? 1 : spin === '3' ? 3 : 2,
        u_radius: Math.min(0.75, Math.max(0.25, Number(ctx.params.radius ?? 0.52))),
        u_depth: Math.min(1, Math.max(0.2, Number(ctx.params.depth ?? 0.7))),
        u_signal: colorToRgb(ctx.params.signal),
      };
    },
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
