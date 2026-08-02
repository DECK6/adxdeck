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
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_levels;
uniform float u_offset;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

float poster(float value) {
  float steps = max(1.0, u_levels - 1.0);
  value = clamp((value - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  return floor(value * steps + 0.5) / steps;
}

void main() {
  float phase = u_t * TAU;
  vec2 texel = 1.0 / max(u_resolution, vec2(1.0));
  vec2 orbit = vec2(cos(phase), sin(phase));
  vec2 cyanShift = orbit * u_offset * texel;
  vec2 magentaShift = vec2(-orbit.y, orbit.x) * u_offset * texel;
  vec2 yellowShift = -orbit * u_offset * texel;
  vec4 cyanTap = texture2D(u_subject, clamp(v_uv + cyanShift, 0.0, 1.0));
  vec4 magentaTap = texture2D(u_subject, clamp(v_uv + magentaShift, 0.0, 1.0));
  vec4 yellowTap = texture2D(u_subject, clamp(v_uv + yellowShift, 0.0, 1.0));
  vec4 center = texture2D(u_subject, v_uv);

  float cyanPlate = poster((1.0 - cyanTap.r) * cyanTap.a);
  float magentaPlate = poster((1.0 - magentaTap.g) * magentaTap.a);
  float yellowPlate = poster((1.0 - yellowTap.b) * yellowTap.a);
  float blackPlate = poster((1.0 - dot(center.rgb, vec3(0.2126, 0.7152, 0.0722))) * center.a);
  float unionAlpha = max(max(cyanTap.a, magentaTap.a), max(yellowTap.a, center.a));

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 cyanInk = mix(vec3(0.01, 0.72, 0.84), u_signal, 0.72);
  vec3 magentaInk = vec3(0.98, 0.08, 0.48);
  vec3 yellowInk = vec3(1.0, 0.76, 0.04);
  vec3 plates = background;
  plates += cyanInk * cyanPlate * 0.72;
  plates += magentaInk * magentaPlate * 0.62;
  plates += yellowInk * yellowPlate * 0.48;
  plates = mix(plates, background * 0.2, blackPlate * 0.72);

  float centerLuma = dot(center.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 centerPoster = floor(clamp(center.rgb * u_contrast, 0.0, 1.0) * (u_levels - 1.0) + 0.5) / max(1.0, u_levels - 1.0);
  centerPoster = mix(centerPoster, u_signal * (0.25 + centerLuma * 0.62), 0.16);
  plates = mix(plates, centerPoster, center.a * 0.22);
  float registrationEdge = clamp(unionAlpha - min(min(cyanTap.a, magentaTap.a), yellowTap.a), 0.0, 1.0);
  plates += u_signal * registrationEdge * 0.1;
  vec3 color = mix(background, plates, unionAlpha);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_levels: Math.min(5, Math.max(2, Math.round(Number(ctx.params.levels ?? 3)))),
      u_offset: Math.min(14, Math.max(0, Number(ctx.params.offset ?? 6))),
      u_contrast: Math.min(2, Math.max(0.7, Number(ctx.params.contrast ?? 1.35))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random('shader-seed'),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
