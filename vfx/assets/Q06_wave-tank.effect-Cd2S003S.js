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
uniform float u_t;
uniform float u_sources;
uniform float u_frequency;
uniform float u_refraction;
uniform float u_damping;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float heightField(vec2 p, float phase) {
  float height = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float active = 1.0 - step(u_sources - 0.5, fi);
    float angle = fi * TAU / max(u_sources, 1.0) + 0.22 * sin(phase + fi);
    vec2 source = vec2(cos(angle), sin(angle)) * (0.24 + 0.025 * sin(phase * 2.0 + fi));
    float distanceToSource = length(p - source);
    float attenuation = exp(-distanceToSource * u_damping);
    height += sin(distanceToSource * u_frequency - phase * 3.0 + fi * 0.7) * attenuation * active;
  }
  return height / max(u_sources, 1.0);
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float phase = TAU * u_t;
  float e = 0.0035;
  float height = heightField(p, phase);
  vec2 gradient = vec2(
    heightField(p + vec2(e, 0.0), phase) - heightField(p - vec2(e, 0.0), phase),
    heightField(p + vec2(0.0, e), phase) - heightField(p - vec2(0.0, e), phase)
  ) / (2.0 * e);
  vec2 normal = normalize(vec2(-gradient.x, 3.5));
  float light = clamp(dot(normal, normalize(vec2(-0.55, 1.0))), 0.0, 1.0);
  float caustic = pow(0.5 + 0.5 * sin(height * 11.0 + phase), 8.0);

  vec2 displacement = gradient * u_refraction / vec2(aspect, 1.0);
  vec4 subject = texture2D(u_subject, clamp(v_uv + displacement, 0.0, 1.0));
  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 water = background + u_signal * (0.055 + light * 0.2 + caustic * 0.34);
  vec3 subjectColor = mix(subject.rgb, u_signal, caustic * 0.18);
  vec3 color = mix(water, subjectColor, subject.a * 0.82);
  color += u_signal * smoothstep(0.76, 0.98, light) * 0.14;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => {
      const sources = String(ctx.params.sources ?? '4');
      return {
        u_sources: sources === '3' ? 3 : sources === '5' ? 5 : 4,
        u_frequency: Math.min(28, Math.max(8, Number(ctx.params.frequency ?? 17))),
        u_refraction: Math.min(0.08, Math.max(0, Number(ctx.params.refraction ?? 0.032))),
        u_damping: Math.min(4, Math.max(0.5, Number(ctx.params.damping ?? 1.8))),
        u_signal: colorToRgb(ctx.params.signal),
      };
    },
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
