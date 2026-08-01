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
uniform float u_frequency;
uniform float u_sources;
uniform float u_contrast;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = TAU * u_t * u_speed;
  vec2 s1 = vec2(-0.42, 0.08) + vec2(cos(phase), sin(phase)) * 0.19;
  vec2 s2 = vec2(0.43, -0.04) + vec2(cos(-phase + 2.1), sin(-phase + 2.1)) * 0.17;
  vec2 s3 = vec2(0.02, 0.35) + vec2(cos(phase * 2.0 + 4.0), sin(phase * 2.0 + 4.0)) * 0.10;
  vec2 s4 = vec2(-0.04, -0.37) + vec2(cos(-phase * 2.0 + 0.6), sin(-phase * 2.0 + 0.6)) * 0.09;

  float w1 = sin(length(p - s1) * u_frequency - phase * 2.0);
  float w2 = sin(length(p - s2) * u_frequency + phase * 2.0 + 0.8);
  float w3 = sin(length(p - s3) * u_frequency * 0.91 - phase * 3.0 + 2.2);
  float w4 = sin(length(p - s4) * u_frequency * 1.08 + phase * 3.0 + 4.1);
  float use3 = step(2.5, u_sources);
  float use4 = step(3.5, u_sources);
  float count = 2.0 + use3 + use4;
  float interference = (w1 + w2 + w3 * use3 + w4 * use4) / count;
  float bands = pow(abs(interference), mix(2.4, 0.72, clamp(u_contrast - 0.4, 0.0, 1.0)));
  float nodes = smoothstep(0.03, 0.28, abs(interference));

  vec2 displacement = vec2(w1 - w2, w3 - w4) * 0.0045 * nodes;
  vec4 subject = texture2D(u_subject, clamp(v_uv + displacement, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 field = mix(background, u_signal, bands * (0.22 + u_contrast * 0.34));
  field += u_signal * smoothstep(0.82, 0.98, bands) * 0.22;
  vec3 subjectColor = subject.rgb + u_signal * bands * 0.12;
  vec3 color = mix(field, subjectColor, subject.a);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_frequency: Math.min(32, Math.max(8, Number(ctx.params.frequency ?? 19))),
      u_sources: Math.min(4, Math.max(2, Math.round(Number(ctx.params.sources ?? 3)))),
      u_contrast: Math.min(1.5, Math.max(0.4, Number(ctx.params.contrast ?? 1))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
