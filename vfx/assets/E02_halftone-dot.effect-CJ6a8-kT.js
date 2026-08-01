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
uniform float u_dotSize;
uniform float u_contrast;
uniform float u_motionSpeed;
uniform float u_motionIntensity;
uniform vec3 u_signal;

void main() {
  const float TAU = 6.28318530718;
  float phase = u_t * TAU * u_motionSpeed;
  float angle = radians(18.0);
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  mat2 inverseRotation = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  vec2 pixel = v_uv * u_resolution;
  vec2 rotatedPixel = rotation * (pixel - u_resolution * 0.5);
  vec2 cell = floor(rotatedPixel / u_dotSize) + 0.5;
  vec2 samplePixel = inverseRotation * (cell * u_dotSize) + u_resolution * 0.5;
  vec2 sampleUv = clamp(samplePixel / u_resolution, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);

  float luminance = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722));
  float ink = clamp((luminance - 0.5) * u_contrast + 0.5, 0.0, 1.0) * subject.a;
  vec2 sweepUv = rotatedPixel / max(u_resolution.x, u_resolution.y);
  float diagonalWave = sin((sweepUv.x + sweepUv.y) * TAU * 3.0 - phase);
  float sweptInk = clamp(ink + diagonalWave * u_motionIntensity * 0.42, 0.0, 1.0);
  float radius = sqrt(sweptInk) * 0.49;
  float distanceInCell = length(fract(rotatedPixel / u_dotSize) - 0.5);
  float antialias = max(0.006, 1.25 / u_dotSize);
  float dotMask = 1.0 - smoothstep(radius - antialias, radius + antialias, distanceInCell);

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 inkColor = mix(u_signal * 0.38, u_signal, clamp(luminance * 1.25, 0.0, 1.0));
  vec3 color = mix(background, inkColor, dotMask);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_dotSize: Math.min(24, Math.max(4, Number(ctx.params.dotSize ?? 10))),
      u_contrast: Math.min(2, Math.max(0.5, Number(ctx.params.contrast ?? 1.25))),
      u_motionSpeed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.motionSpeed ?? 1)))),
      u_motionIntensity: Math.min(1, Math.max(0.15, Number(ctx.params.motionIntensity ?? 0.72))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
