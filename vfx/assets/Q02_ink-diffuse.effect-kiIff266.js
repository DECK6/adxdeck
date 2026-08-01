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
uniform float u_spread;
uniform float u_turbulence;
uniform float u_detail;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.7, 289.1))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  value += noise2(p) * 0.50;
  p = p * 2.02 + vec2(13.4, 7.6);
  value += noise2(p) * 0.25;
  p = p * 2.03 + vec2(5.1, 19.8);
  value += noise2(p) * 0.125;
  p = p * 2.01 + vec2(27.2, 3.7);
  value += noise2(p) * 0.0625;
  p = p * 2.04 + vec2(9.3, 31.1);
  value += noise2(p) * 0.03125;
  return value;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = TAU * u_t * u_speed;
  vec2 loopA = vec2(cos(phase), sin(phase));
  vec2 loopB = vec2(cos(phase * 2.0 + 2.4), sin(phase * 2.0 + 2.4));
  vec2 base = p * u_detail;

  vec2 flow = vec2(
    fbm(base * 0.61 + loopA * 1.18),
    fbm(base * 0.61 + loopB * 0.82 + 14.2)
  ) - 0.5;
  vec2 warped = base + flow * (2.4 * u_turbulence);
  float plumeA = fbm(warped + loopA * 0.92);
  float plumeB = fbm(warped * 1.37 - loopB * 0.76 + 8.7);
  float radius = length(p + flow * 0.17);
  float radialBody = smoothstep(0.86, 0.08, radius - (plumeA - 0.5) * 0.34 * u_turbulence);
  float veins = smoothstep(0.42, 0.76, plumeA * 0.66 + plumeB * 0.34);
  float ink = clamp(radialBody * (0.48 + veins * 0.68) * u_spread, 0.0, 1.0);
  float edge = smoothstep(0.08, 0.0, abs(radialBody - 0.5)) * veins;

  vec2 sampleUv = clamp(v_uv + flow * ink * 0.026, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 deepInk = mix(background, u_signal, 0.13 + plumeB * 0.22);
  vec3 field = mix(background, deepInk, ink * 0.92);
  field += u_signal * edge * 0.26;
  vec3 subjectColor = mix(subject.rgb, u_signal, ink * 0.18);
  vec3 color = mix(field, subjectColor, subject.a);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_spread: Math.min(1, Math.max(0.2, Number(ctx.params.spread ?? 0.72))),
      u_turbulence: Math.min(1.4, Math.max(0.2, Number(ctx.params.turbulence ?? 0.88))),
      u_detail: Math.min(6, Math.max(2, Number(ctx.params.detail ?? 4.1))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
