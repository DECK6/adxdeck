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
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_bands;
uniform float u_speed;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec3 cyclePalette(float position) {
  vec3 wheel = 0.5 + 0.5 * cos(TAU * (position + vec3(0.0, 0.3333, 0.6667)));
  vec3 accent = mix(wheel, u_signal, 0.42 + 0.18 * sin(position * TAU));
  return accent;
}

void main() {
  vec4 subject = texture2D(u_subject, v_uv);
  float luminance = dot(subject.rgb, vec3(0.299, 0.587, 0.114));
  luminance = clamp((luminance - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float interference = sin((v_uv.x * 2.0 + v_uv.y) * TAU * 2.0 + u_seed * 0.01) * 0.35;
  float band = floor(clamp(luminance * u_bands + interference, 0.0, u_bands - 0.001));
  float cycle = mod(band + u_t * u_speed * u_bands, u_bands) / u_bands;
  vec3 paletteColor = cyclePalette(cycle);
  float level = 0.18 + 0.82 * (band + 1.0) / u_bands;
  paletteColor *= level;

  vec2 texel = 1.5 / max(u_resolution, vec2(1.0));
  vec4 rightSample = texture2D(u_subject, clamp(v_uv + vec2(texel.x, 0.0), 0.0, 1.0));
  vec4 downSample = texture2D(u_subject, clamp(v_uv + vec2(0.0, texel.y), 0.0, 1.0));
  float edge = clamp(
    abs(subject.a - rightSample.a) + abs(subject.a - downSample.a)
      + length(subject.rgb - rightSample.rgb) * 0.25
      + length(subject.rgb - downSample.rgb) * 0.25,
    0.0,
    1.0
  );
  float raster = 0.96 + 0.04 * sin(v_uv.y * u_resolution.y * 3.14159265);
  float clock = u_frame / max(u_fps, 1.0);
  float demoBar = exp(-abs(v_uv.y - (0.5 + sin(clock * TAU / 6.0) * 0.34)) * 30.0);

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 color = mix(background, paletteColor * raster, subject.a);
  color += u_signal * (edge * 0.44 + demoBar * (0.045 + subject.a * 0.16));
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_bands: Math.min(12, Math.max(4, Math.round(Number(ctx.params.bands ?? 8)))),
      u_speed: Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2)))),
      u_contrast: Math.min(2, Math.max(0.6, Number(ctx.params.contrast ?? 1.25))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
