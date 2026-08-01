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
uniform float u_radius;
uniform float u_compression;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU * u_speed;
  float pulse = 0.5 - 0.5 * cos(phase);
  float animatedStrength = u_strength * pulse;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 center = vec2(0.5);
  vec2 p = (v_uv - center) * vec2(aspect, 1.0);
  float radius = length(p);
  float normalized = radius / max(u_radius, 0.001);
  float inLens = 1.0 - smoothstep(0.94, 1.02, normalized);

  float curve = max(0.0, 1.0 - normalized * normalized);
  float innerRadius = radius / (1.0 + animatedStrength * curve);
  float outerRadius = u_radius + (radius - u_radius) * (1.0 + u_compression * pulse);
  float sourceRadius = mix(outerRadius, innerRadius, inLens);
  vec2 direction = p / max(radius, 0.0001);
  vec2 sampleUv = center + direction * sourceRadius / vec2(aspect, 1.0);
  float inside = step(0.0, sampleUv.x) * step(sampleUv.x, 1.0) * step(0.0, sampleUv.y) * step(sampleUv.y, 1.0);

  vec2 chroma = direction / vec2(aspect, 1.0) * animatedStrength * curve * 0.004;
  vec4 middle = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
  vec4 redSample = texture2D(u_subject, clamp(sampleUv + chroma, 0.0, 1.0));
  vec4 blueSample = texture2D(u_subject, clamp(sampleUv - chroma, 0.0, 1.0));
  vec3 refracted = vec3(redSample.r, middle.g, blueSample.b);
  float alpha = max(middle.a, max(redSample.a, blueSample.a)) * inside;

  float rim = 1.0 - smoothstep(0.0, 0.018, abs(radius - u_radius));
  float glass = inLens * pow(max(0.0, dot(normalize(vec3(p, 0.32)), normalize(vec3(-0.5, 0.7, 1.0)))), 12.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 field = background + u_signal * (rim * 0.12 * pulse + glass * 0.045);
  vec3 color = mix(field, refracted, alpha);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_strength: Math.min(1.2, Math.max(0.1, Number(ctx.params.strength ?? 0.72))),
      u_radius: Math.min(0.72, Math.max(0.3, Number(ctx.params.radius ?? 0.52))),
      u_compression: Math.min(0.8, Math.max(0.1, Number(ctx.params.compression ?? 0.48))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
