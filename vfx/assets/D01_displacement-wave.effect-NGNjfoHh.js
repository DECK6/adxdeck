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
uniform float u_strength;
uniform float u_scale;
uniform float u_speed;
uniform vec3 u_signal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = v_uv;
  float clock = u_time * u_speed;
  float broad = valueNoise(vec2(uv.y * u_scale - clock, clock * 0.17));
  float detail = valueNoise(vec2(uv.y * u_scale * 2.1 + clock * 0.6, uv.x * 1.8));
  float wave = sin(uv.y * 18.0 + clock * 4.0 + broad * 6.28318);
  vec2 displaced = uv + vec2((broad - 0.5 + wave * 0.35) * u_strength, (detail - 0.5) * u_strength * 0.18);
  vec4 subject = texture2D(u_subject, clamp(displaced, 0.0, 1.0));
  vec4 fringe = texture2D(u_subject, clamp(displaced + vec2(u_strength * 0.11, 0.0), 0.0, 1.0));
  float edge = clamp(abs(subject.a - fringe.a) * 1.8 + abs(wave) * 0.035, 0.0, 1.0);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = mix(background, subject.rgb, subject.a);
  color += u_signal * edge * (0.65 + 0.35 * sin(u_t * 6.28318 + u_frame * 0.01));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_strength: Math.min(0.2, Math.max(0, Number(ctx.params.strength ?? 0.075))),
      u_scale: Math.min(12, Math.max(1, Number(ctx.params.scale ?? 5.2))),
      u_speed: Math.min(4, Math.max(0, Number(ctx.params.speed ?? 1.25))),
      u_signal: colorToRgb(ctx.params.signal),
      // The native live/Remotion drivers override these standard values. Keeping
      // them here also makes the framework-neutral kernel degrade safely in older exporters.
      u_resolution: [ctx.width, ctx.height],
      u_time: ctx.frame / ctx.fps,
      u_frame: ctx.frame,
      u_t: ctx.t,
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
