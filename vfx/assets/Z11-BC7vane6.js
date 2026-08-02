const e=`var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Z11_lcd_subpixel_effect_exports = {};
__export(Z11_lcd_subpixel_effect_exports, {
  default: () => Z11_lcd_subpixel_effect_default
});
module.exports = __toCommonJS(Z11_lcd_subpixel_effect_exports);
function colorToRgb(value) {
  const hex = String(value ?? "#5EE7F3").replace("#", "");
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : "5EE7F3";
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}
const kernel = {
  kind: "webgl",
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
uniform float u_scale;
uniform float u_gap;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 grid = vec2(u_scale * aspect, u_scale);
  vec2 cellId = floor(v_uv * grid);
  vec2 local = fract(v_uv * grid);
  vec2 sampleUv = (cellId + 0.5) / grid;
  vec4 source = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));

  float subIndex = floor(local.x * 3.0);
  float withinSubpixel = fract(local.x * 3.0);
  vec3 stripe = vec3(1.0, 0.0, 0.0) * (1.0 - step(0.5, subIndex));
  stripe += vec3(0.0, 1.0, 0.0) * step(0.5, subIndex) * (1.0 - step(1.5, subIndex));
  stripe += vec3(0.0, 0.0, 1.0) * step(1.5, subIndex);
  float apertureX = smoothstep(u_gap, u_gap * 2.2, withinSubpixel) * (1.0 - smoothstep(1.0 - u_gap * 2.2, 1.0 - u_gap, withinSubpixel));
  float apertureY = smoothstep(u_gap, u_gap * 2.2, local.y) * (1.0 - smoothstep(1.0 - u_gap * 2.2, 1.0 - u_gap, local.y));
  float aperture = apertureX * apertureY;

  vec3 corrected = clamp((source.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float luminance = dot(corrected, vec3(0.299, 0.587, 0.114));
  float response = 0.88 + 0.12 * sin(u_t * TAU + cellId.x * 0.07 + u_seed * TAU);
  response += 0.035 * sin((u_frame / max(u_fps, 1.0)) * TAU * 2.0 + cellId.y * 0.11);
  vec3 lcd = corrected * (stripe * 2.42 + vec3(0.08)) * aperture * response;
  lcd += stripe * luminance * 0.08 * aperture;

  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 inactive = background + u_signal * 0.012 * aperture;
  vec3 color = mix(inactive, lcd, source.a);
  float gridEdge = 1.0 - aperture;
  color = mix(color, background * 0.45, gridEdge * 0.78);
  float refresh = exp(-abs(v_uv.y - u_t) * 38.0);
  color += u_signal * refresh * 0.07;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_fps: ctx.fps,
      u_seed: ctx.random("lcd-seed"),
      u_scale: Math.min(96, Math.max(18, Math.round(Number(ctx.params.scale ?? 42)))),
      u_gap: Math.min(0.22, Math.max(0.02, Number(ctx.params.gap ?? 0.08))),
      u_contrast: Math.min(1.8, Math.max(0.7, Number(ctx.params.contrast ?? 1.22))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var Z11_lcd_subpixel_effect_default = kernel;
`;export{e as default};
