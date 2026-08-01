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
uniform float u_coverage;
uniform float u_density;
uniform float u_scale;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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
  value += noise2(p) * 0.52;
  p = p * 2.03 + vec2(17.1, 9.2);
  value += noise2(p) * 0.26;
  p = p * 2.01 + vec2(8.3, 23.7);
  value += noise2(p) * 0.14;
  p = p * 2.04 + vec2(31.4, 5.8);
  value += noise2(p) * 0.08;
  return value;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = TAU * u_t * u_speed;
  vec2 orbit = vec2(cos(phase), sin(phase));
  vec2 counter = vec2(cos(phase * 2.0 + 1.4), sin(phase * 2.0 + 1.4));

  vec2 domain = p * u_scale;
  vec2 warp = vec2(
    fbm(domain * 0.68 + orbit * 1.35),
    fbm(domain * 0.68 + counter * 0.72 + 11.7)
  ) - 0.5;
  float body = fbm(domain + warp * 2.1 + orbit * 1.15);
  float wisps = fbm(domain * vec2(1.45, 2.1) - counter * 1.2 + warp);
  float cloud = smoothstep(0.74 - u_coverage * 0.45, 0.78, body * 0.73 + wisps * 0.27);
  cloud *= u_density;

  vec2 refractUv = clamp(v_uv + warp * cloud * 0.018, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, refractUv);
  vec3 background = vec3(0.051, 0.055, 0.063);
  float depth = smoothstep(0.0, 1.0, body) * cloud;
  vec3 cloudColor = mix(background, u_signal, 0.10 + depth * 0.48);
  cloudColor += vec3(0.16) * cloud * smoothstep(0.44, 0.82, wisps);
  vec3 field = mix(background, cloudColor, cloud * 0.82);
  vec3 subjectColor = subject.rgb + u_signal * cloud * 0.11;
  vec3 color = mix(field, subjectColor, subject.a);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_coverage: Math.min(0.85, Math.max(0.2, Number(ctx.params.coverage ?? 0.58))),
      u_density: Math.min(1, Math.max(0.3, Number(ctx.params.density ?? 0.76))),
      u_scale: Math.min(6, Math.max(1.5, Number(ctx.params.scale ?? 3.2))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
