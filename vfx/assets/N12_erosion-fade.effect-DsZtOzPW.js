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
uniform float u_scale;
uniform float u_edgeWidth;
uniform float u_roughness;
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
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = noise2(p) * 0.54;
  value += noise2(p * 2.03 + vec2(4.7, 9.2)) * 0.27;
  value += noise2(p * 4.07 - vec2(2.1, 5.4)) * 0.13;
  value += noise2(p * 8.11 + vec2(8.3, 1.6)) * 0.06;
  return value;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float progress = 0.5 - 0.5 * cos(phase);
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * u_scale;
  vec2 orbit = vec2(cos(phase), sin(phase)) * 0.62;
  float broad = fbm(p + orbit);
  float detail = fbm(p * 1.83 - orbit.yx + 7.4);
  float erosionField = mix(broad, broad * 0.68 + detail * 0.32, u_roughness);
  erosionField += (v_uv.y - 0.5) * 0.08;
  float threshold = mix(-0.12, 1.12, progress);
  float keep = smoothstep(threshold - u_edgeWidth, threshold + u_edgeWidth, erosionField);
  float edge = 1.0 - smoothstep(u_edgeWidth, u_edgeWidth * 2.25, abs(erosionField - threshold));

  vec4 subject = texture2D(u_subject, v_uv);
  float visibleAlpha = subject.a * keep;
  float erodingEdge = subject.a * edge;
  float motes = pow(max(0.0, sin((p.x + broad * 2.0) * 19.0 + p.y * 13.0 - phase * 3.0)), 22.0);
  motes *= edge * (0.25 + progress * 0.75);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  float halo = edge * subject.a * 0.08 + motes * 0.2;
  vec3 field = background + u_signal * halo;
  vec3 color = mix(field, subject.rgb, visibleAlpha);
  color += u_signal * erodingEdge * (0.34 + u_roughness * 0.16);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_scale: Math.min(10, Math.max(2, Number(ctx.params.scale ?? 5.5))),
      u_edgeWidth: Math.min(0.18, Math.max(0.02, Number(ctx.params.edgeWidth ?? 0.075))),
      u_roughness: Math.min(1.2, Math.max(0.2, Number(ctx.params.roughness ?? 0.78))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
