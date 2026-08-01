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
var E03_dither_bayer_effect_exports = {};
__export(E03_dither_bayer_effect_exports, {
  default: () => E03_dither_bayer_effect_default
});
module.exports = __toCommonJS(E03_dither_bayer_effect_exports);
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
uniform float u_time;
uniform float u_frame;
uniform float u_t;
uniform float u_pixelSize;
uniform float u_levels;
uniform float u_motionSpeed;
uniform float u_motionIntensity;
uniform vec3 u_signal;

float bayer4(vec2 position) {
  vec2 p = mod(floor(position), 4.0);
  float x = p.x;
  float y = p.y;
  if (y < 1.0) {
    if (x < 1.0) return 0.0 / 16.0;
    if (x < 2.0) return 8.0 / 16.0;
    if (x < 3.0) return 2.0 / 16.0;
    return 10.0 / 16.0;
  }
  if (y < 2.0) {
    if (x < 1.0) return 12.0 / 16.0;
    if (x < 2.0) return 4.0 / 16.0;
    if (x < 3.0) return 14.0 / 16.0;
    return 6.0 / 16.0;
  }
  if (y < 3.0) {
    if (x < 1.0) return 3.0 / 16.0;
    if (x < 2.0) return 11.0 / 16.0;
    if (x < 3.0) return 1.0 / 16.0;
    return 9.0 / 16.0;
  }
  if (x < 1.0) return 15.0 / 16.0;
  if (x < 2.0) return 7.0 / 16.0;
  if (x < 3.0) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

void main() {
  const float TAU = 6.28318530718;
  vec2 logicalPixel = floor(v_uv * u_resolution / u_pixelSize);
  vec2 sampleUv = (logicalPixel + 0.5) * u_pixelSize / u_resolution;
  vec4 subject = texture2D(u_subject, clamp(sampleUv, 0.0, 1.0));
  float luminance = dot(subject.rgb, vec3(0.2126, 0.7152, 0.0722)) * subject.a;
  float steps = max(1.0, u_levels - 1.0);
  float phase = u_t * TAU * u_motionSpeed;
  float patternFlow = u_t * 16.0 * u_motionSpeed;
  float threshold = bayer4(logicalPixel + vec2(patternFlow)) - 0.5;
  float brightnessSweep = sin((v_uv.x + v_uv.y) * TAU * 1.5 - phase);
  threshold += brightnessSweep * u_motionIntensity * 0.65;
  float quantized = floor(clamp(luminance * steps + threshold * u_motionIntensity + 0.5, 0.0, steps)) / steps;

  vec3 background = vec3(0.051, 0.055, 0.063);
  vec3 original = mix(background, subject.rgb, subject.a);
  vec3 dithered = mix(background, u_signal, quantized);
  vec3 color = mix(original, dithered, 0.55 + u_motionIntensity * 0.45);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_pixelSize: Math.min(10, Math.max(1, Math.round(Number(ctx.params.pixelSize ?? 3)))),
      u_levels: Math.min(8, Math.max(2, Math.round(Number(ctx.params.levels ?? 4)))),
      u_motionSpeed: Math.min(3, Math.max(1, Math.round(Number(ctx.params.motionSpeed ?? 1)))),
      u_motionIntensity: Math.min(1, Math.max(0.2, Number(ctx.params.motionIntensity ?? 0.85))),
      u_signal: colorToRgb(ctx.params.signal)
    })
  }
};
var E03_dither_bayer_effect_default = kernel;
`;export{e as default};
