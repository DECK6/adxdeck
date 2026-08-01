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
uniform float u_amplitude;
uniform float u_frequency;
uniform float u_caustics;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float loopPhase = TAU * u_t;

  vec2 d1 = normalize(vec2(0.86, 0.51));
  vec2 d2 = normalize(vec2(-0.37, 0.93));
  vec2 d3 = normalize(vec2(0.18, -0.98));
  float a = dot(p, d1) * u_frequency * TAU + loopPhase;
  float b = dot(p, d2) * u_frequency * 0.73 * TAU - loopPhase * 2.0 + 1.7;
  float c = dot(p, d3) * u_frequency * 1.31 * TAU + loopPhase * 3.0 + 3.1;

  vec2 slope = d1 * cos(a) + d2 * cos(b) * 0.52 + d3 * cos(c) * 0.27;
  vec2 refractedUv = clamp(uv + slope * u_amplitude, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, refractedUv);

  float crossing = 1.0 - abs(sin(a) * 0.56 + sin(b) * 0.31 + sin(c) * 0.13);
  float caustic = pow(clamp(crossing, 0.0, 1.0), 6.0) * u_caustics;
  float surfaceGlow = 0.018 + 0.018 * sin(a + b);
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 water = background + u_signal * (surfaceGlow + caustic * 0.19);
  vec3 color = mix(water, subject.rgb + u_signal * caustic * 0.12, subject.a);

  float vignette = smoothstep(0.86, 0.24, length(p));
  color = mix(background, color, 0.72 + vignette * 0.28);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_amplitude: Math.min(0.08, Math.max(0, Number(ctx.params.amplitude ?? 0.026))),
      u_frequency: Math.min(10, Math.max(2, Number(ctx.params.frequency ?? 5.4))),
      u_caustics: Math.min(1, Math.max(0, Number(ctx.params.caustics ?? 0.62))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
