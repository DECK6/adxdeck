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
uniform float u_twist;
uniform float u_radius;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float radius = length(p);
  float falloff = 1.0 - smoothstep(0.0, u_radius, radius);
  falloff *= falloff;
  float angle = atan(p.y, p.x);
  float rotation = u_twist * falloff * sin(phase);
  float sampleAngle = angle + rotation;
  vec2 sampleP = vec2(cos(sampleAngle), sin(sampleAngle)) * radius;
  vec2 sampleUv = clamp(sampleP / vec2(aspect, 1.0) + 0.5, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);

  float spiral = 0.5 + 0.5 * sin(angle * 4.0 - radius * 34.0 + phase * 3.0);
  float filament = pow(spiral, 12.0) * falloff;
  float ring = (1.0 - smoothstep(0.0, 0.018, abs(radius - u_radius * (0.55 + 0.12 * sin(phase))))) * 0.5;
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 base = background + u_signal * (filament * 0.11 + ring * 0.06);
  vec3 color = mix(base, subject.rgb, subject.a);

  vec4 edgeSample = texture2D(u_subject, clamp(sampleUv + vec2(0.004, -0.003), 0.0, 1.0));
  float edge = clamp(abs(subject.a - edgeSample.a) + length(subject.rgb - edgeSample.rgb) * 0.22, 0.0, 1.0);
  color += u_signal * edge * falloff * 0.45;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_twist: Math.min(7, Math.max(0.5, Number(ctx.params.twist ?? 4.2))),
      u_radius: Math.min(0.85, Math.max(0.2, Number(ctx.params.radius ?? 0.58))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
