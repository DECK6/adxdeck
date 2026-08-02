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
var K01_pixel_quantize_effect_exports = {};
__export(K01_pixel_quantize_effect_exports, {
  default: () => K01_pixel_quantize_effect_default
});
module.exports = __toCommonJS(K01_pixel_quantize_effect_exports);
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
uniform float u_pixelSize;
uniform float u_paletteMix;
uniform float u_contrast;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void consider(vec3 source, vec3 candidate, inout vec3 best, inout float bestDistance) {
  float candidateDistance = dot(source - candidate, source - candidate);
  if (candidateDistance < bestDistance) {
    best = candidate;
    bestDistance = candidateDistance;
  }
}

void main() {
  float phase = u_t * TAU;
  float breathingPixel = max(2.0, floor(u_pixelSize * (0.86 + 0.14 * (0.5 - 0.5 * cos(phase))) + 0.5));
  vec2 grid = max(floor(u_resolution / breathingPixel), vec2(1.0));
  vec2 cell = floor(v_uv * grid);
  vec2 sampleUv = clamp((cell + 0.5) / grid, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 source = mix(background, subject.rgb, subject.a);
  source = clamp((source - 0.5) * u_contrast + 0.5, 0.0, 1.0);

  vec3 best = background;
  float bestDistance = dot(source - best, source - best);
  consider(source, vec3(0.055, 0.145, 0.235), best, bestDistance);
  consider(source, u_signal * 0.48, best, bestDistance);
  consider(source, u_signal, best, bestDistance);
  consider(source, vec3(1.0, 0.43, 0.15), best, bestDistance);
  consider(source, vec3(0.92, 0.96, 0.91), best, bestDistance);

  vec2 local = fract(v_uv * grid);
  float border = max(step(0.91, local.x), step(0.91, local.y));
  float subjectCell = smoothstep(0.01, 0.25, subject.a);
  vec3 quantized = best + u_signal * border * subjectCell * 0.075;
  vec3 color = mix(source, quantized, u_paletteMix);
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_pixelSize: Math.min(24, Math.max(3, Math.round(Number(ctx.params.pixelSize ?? 10)))),
      u_paletteMix: Math.min(1, Math.max(0.4, Number(ctx.params.paletteMix ?? 0.92))),
      u_contrast: Math.min(1.8, Math.max(0.7, Number(ctx.params.contrast ?? 1.2))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed") * 4096
    })
  }
};
var K01_pixel_quantize_effect_default = kernel;
`;export{e as default};
