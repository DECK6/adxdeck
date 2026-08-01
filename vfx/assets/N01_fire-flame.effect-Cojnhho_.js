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
uniform float u_intensity;
uniform float u_scale;
uniform float u_turbulence;
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
  value += noise2(p * 2.03 + 4.7) * 0.27;
  value += noise2(p * 4.07 - 7.2) * 0.13;
  value += noise2(p * 8.13 + 1.9) * 0.06;
  return value;
}

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - vec2(0.5, 0.04)) * vec2(aspect, 1.0);
  vec2 orbit = vec2(cos(phase), sin(phase));
  vec2 noisePoint = vec2(p.x * u_scale, p.y * u_scale * 0.82);
  float broad = fbm(noisePoint + orbit * 1.35);
  float detail = fbm(noisePoint * 1.72 - orbit.yx * 1.1 + 9.3);
  float sideMotion = sin(p.y * 13.0 + phase * 2.0) * 0.055 * u_turbulence;
  float width = mix(0.42, 0.055, smoothstep(0.04, 0.93, p.y));
  float body = 1.0 - smoothstep(width * 0.52, width, abs(p.x + sideMotion + (broad - 0.5) * 0.16 * u_turbulence));
  float heightMask = smoothstep(-0.04, 0.08, p.y) * (1.0 - smoothstep(0.58 + broad * 0.2, 0.92 + broad * 0.08, p.y));
  float flame = clamp(body * heightMask + (detail - 0.58) * u_turbulence * 1.7, 0.0, 1.0);
  flame = smoothstep(0.08, 0.78, flame) * u_intensity;
  float core = smoothstep(0.38, 0.95, flame) * (1.0 - smoothstep(0.18, 0.72, p.y));

  vec2 heatOffset = vec2(
    sin(v_uv.y * 24.0 + phase * 3.0),
    cos(v_uv.x * 17.0 - phase * 2.0)
  ) * flame * u_turbulence * 0.014;
  vec4 subject = texture2D(u_subject, clamp(v_uv + heatOffset, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  float emberField = pow(max(0.0, sin(v_uv.x * 43.0 + v_uv.y * 29.0 - phase * 4.0)), 18.0)
    * smoothstep(0.12, 0.8, v_uv.y) * (0.25 + broad * 0.75);
  vec3 flameColor = u_signal * (0.18 + flame * 0.74) + vec3(0.12, 0.16, 0.18) * core;
  vec3 atmosphere = background + u_signal * (flame * 0.15 + emberField * 0.32);
  vec3 subjectColor = mix(atmosphere, subject.rgb, subject.a * (0.74 + flame * 0.2));
  vec3 color = mix(subjectColor, flameColor, clamp(flame * (0.5 + subject.a * 0.25), 0.0, 0.88));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_intensity: Math.min(1.4, Math.max(0.35, Number(ctx.params.intensity ?? 0.9))),
      u_scale: Math.min(7, Math.max(2, Number(ctx.params.scale ?? 4.2))),
      u_turbulence: Math.min(1.2, Math.max(0.2, Number(ctx.params.turbulence ?? 0.72))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
