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
uniform float u_spacing;
uniform float u_lineWidth;
uniform float u_contrast;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float hatchLine(float coordinate, float spacing, float width) {
  float distanceToLine = abs(mod(coordinate + spacing * 0.5, spacing) - spacing * 0.5);
  return 1.0 - smoothstep(width, width + 1.15, distanceToLine);
}

void main() {
  float phase = u_t * TAU * u_speed;
  vec2 pixel = v_uv * u_resolution;
  vec2 uvFlow = v_uv + vec2(sin(phase), cos(phase)) * 0.035;
  vec4 subject = texture2D(u_subject, clamp(uvFlow, 0.0, 1.0));
  float subjectLuma = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));

  float gradientField = 0.48
    + 0.22 * sin(v_uv.x * TAU * 1.7 + phase)
    + 0.18 * cos(v_uv.y * TAU * 2.1 - phase * 2.0)
    + 0.15 * sin((v_uv.x + v_uv.y) * TAU * 1.3 + phase * 3.0);
  float tone = clamp(mix(gradientField, subjectLuma, subject.a * 0.88), 0.0, 1.0);
  tone = clamp((tone - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float darkness = 1.0 - tone;

  float drift = sin(phase) * u_spacing * 1.8;
  float first = hatchLine(pixel.x + pixel.y + drift, u_spacing, u_lineWidth);
  float second = hatchLine(pixel.x - pixel.y - cos(phase) * u_spacing * 1.8, u_spacing, u_lineWidth);
  float fine = hatchLine(pixel.x * 0.52 + pixel.y * 1.46 + sin(phase * 2.0) * u_spacing, u_spacing * 0.72, u_lineWidth * 0.72);
  float hatch = first * smoothstep(0.18, 0.55, darkness);
  hatch = max(hatch, second * smoothstep(0.42, 0.78, darkness));
  hatch = max(hatch, fine * smoothstep(0.7, 0.94, darkness));

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 paper = background + u_signal * (0.055 + tone * 0.22);
  vec3 ink = mix(background * 0.52, u_signal * 0.2, tone * 0.24);
  vec3 hatched = mix(paper, ink, hatch * 0.94);
  vec3 subjectBase = mix(background, subject.rgb, subject.a * 0.34);
  vec3 color = mix(subjectBase, hatched, 0.72 + subject.a * 0.2);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_spacing: Math.min(22, Math.max(5, Number(ctx.params.spacing ?? 11))),
      u_lineWidth: Math.min(3.5, Math.max(0.6, Number(ctx.params.lineWidth ?? 1.4))),
      u_contrast: Math.min(2, Math.max(0.6, Number(ctx.params.contrast ?? 1.25))),
      u_speed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1)))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
