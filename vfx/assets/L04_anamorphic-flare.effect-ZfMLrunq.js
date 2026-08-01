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
uniform float u_intensity;
uniform float u_width;
uniform float u_streak;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 source = vec2(0.5 + cos(phase) * 0.29, 0.49 + sin(phase * 2.0) * 0.11);
  vec2 delta = (v_uv - source) * vec2(aspect, 1.0);
  float radius = length(delta);

  float horizontal = exp(-abs(delta.y) / max(u_streak, 0.001));
  horizontal *= 1.0 - smoothstep(u_width * 0.42, u_width, abs(delta.x));
  float core = exp(-radius * 38.0);
  float star = exp(-abs(delta.y) * 90.0) * exp(-abs(delta.x) * 2.8);

  vec2 axis = vec2(aspect, 1.0) * (v_uv - 0.5);
  vec2 ghostCenterA = (source - 0.5) * -0.58;
  vec2 ghostCenterB = (source - 0.5) * -1.18;
  float ghostA = 1.0 - smoothstep(0.035, 0.09, abs(length(axis - ghostCenterA * vec2(aspect, 1.0)) - 0.10));
  float ghostB = 1.0 - smoothstep(0.02, 0.055, length(axis - ghostCenterB * vec2(aspect, 1.0)));

  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = mix(background, subject.rgb, subject.a);
  float flare = horizontal * 0.42 + star * 0.48 + core * 1.35 + ghostA * 0.10 + ghostB * 0.20;
  color += u_signal * flare * u_intensity;
  color += vec3(1.0) * core * u_intensity * 0.38;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_intensity: Math.min(2, Math.max(0, Number(ctx.params.intensity ?? 1.15))),
      u_width: Math.min(1.4, Math.max(0.2, Number(ctx.params.width ?? 0.82))),
      u_streak: Math.min(0.12, Math.max(0.01, Number(ctx.params.streak ?? 0.045))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
