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
var K05_cga_palette_effect_exports = {};
__export(K05_cga_palette_effect_exports, {
  default: () => K05_cga_palette_effect_default
});
module.exports = __toCommonJS(K05_cga_palette_effect_exports);
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
uniform float u_pixelWidth;
uniform float u_saturation;
uniform float u_scanline;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  vec2 pixelShape = vec2(u_pixelWidth * 2.0, u_pixelWidth);
  vec2 grid = max(floor(u_resolution / pixelShape), vec2(1.0));
  float horizontalKick = floor(sin(phase) * 1.5 + 0.5);
  vec2 cell = floor(v_uv * grid + vec2(horizontalKick, 0.0));
  vec2 sampleUv = clamp((cell + 0.5 - vec2(horizontalKick, 0.0)) / grid, 0.0, 1.0);
  vec4 subject = texture2D(u_subject, sampleUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 source = mix(background, subject.rgb, subject.a);
  float luminance = dot(source, vec3(0.2126, 0.7152, 0.0722));
  float cyanScore = source.g + source.b - source.r * 0.7;
  float magentaScore = source.r + source.b - source.g * 0.7;
  float checker = mod(cell.x + cell.y, 2.0);
  vec3 black = background;
  vec3 cyan = mix(vec3(0.20, 1.0, 1.0), u_signal, 0.18);
  vec3 magenta = vec3(1.0, 0.20, 1.0);
  vec3 white = vec3(1.0);
  vec3 chroma = cyanScore > magentaScore ? cyan : magenta;
  chroma = mix(vec3(luminance), chroma, u_saturation);
  vec3 color;
  if (luminance < 0.18) color = black;
  else if (luminance < 0.48) color = checker < luminance * 2.0 ? chroma : black;
  else if (luminance < 0.82) color = checker < (luminance - 0.48) * 2.9 ? white : chroma;
  else color = white;

  float darkRow = step(0.5, mod(cell.y, 2.0));
  color *= 1.0 - darkRow * u_scanline;
  float phosphorEdge = step(0.94, fract(v_uv.x * grid.x));
  color += u_signal * phosphorEdge * subject.a * 0.06;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_pixelWidth: Math.min(10, Math.max(2, Math.round(Number(ctx.params.pixelWidth ?? 5)))),
      u_saturation: Math.min(1.5, Math.max(0.5, Number(ctx.params.saturation ?? 1.1))),
      u_scanline: Math.min(0.7, Math.max(0, Number(ctx.params.scanline ?? 0.35))),
      u_signal: colorToRgb(ctx.params.signal),
      u_fps: ctx.fps,
      u_seed: ctx.random("shader-seed") * 4096
    })
  }
};
var K05_cga_palette_effect_default = kernel;
`;export{e as default};
