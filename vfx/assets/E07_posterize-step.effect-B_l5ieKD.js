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
uniform float u_maxLevels;
uniform float u_contrast;
uniform float u_motionSpeed;
uniform float u_motionIntensity;
uniform vec3 u_signal;

void main() {
  const float TAU = 6.28318530718;
  vec4 subject = texture2D(u_subject, v_uv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  float phase = u_t * TAU * u_motionSpeed;
  // Animated smooth gradient field — posterization needs gradients to be visible
  // (the flat-color subject alone quantizes identically at every level count).
  vec2 c = v_uv - 0.5;
  float field = 0.5
    + 0.30 * sin(c.x * 4.4 + phase)
    + 0.24 * sin(c.y * 5.2 - phase * 1.3)
    + 0.22 * sin((c.x + c.y) * 6.0 + phase * 0.7)
    + 0.18 * cos(length(c) * 9.0 - phase);
  field = clamp(field * 0.5 + 0.25, 0.0, 1.0);
  float subjectLum = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  float shapedField = clamp((mix(field, subjectLum, subject.a * 0.85) - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float cycle = fract(u_t * u_motionSpeed);
  float triangle = 1.0 - abs(cycle * 2.0 - 1.0);
  float animatedLevels = floor(mix(3.0, u_maxLevels, triangle) + 0.5);
  float steps = max(2.0, animatedLevels - 1.0);
  float band = floor(shapedField * steps + 0.5) / steps;
  vec3 fieldColor = mix(background, u_signal, band * (0.28 + 0.72 * u_motionIntensity));
  vec3 subjectColor = mix(background, u_signal, band);
  vec3 color = mix(fieldColor, subjectColor, subject.a);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_maxLevels: Math.min(10, Math.max(4, Math.round(Number(ctx.params.maxLevels ?? 10)))),
      u_contrast: Math.min(2, Math.max(0.5, Number(ctx.params.contrast ?? 1.2))),
      u_motionSpeed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.motionSpeed ?? 1)))),
      u_motionIntensity: Math.min(1, Math.max(0.2, Number(ctx.params.motionIntensity ?? 0.78))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
