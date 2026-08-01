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
var E12_ascii_map_effect_exports = {};
__export(E12_ascii_map_effect_exports, {
  default: () => E12_ascii_map_effect_default
});
module.exports = __toCommonJS(E12_ascii_map_effect_exports);
const TAU = Math.PI * 2;
const GLYPHS = " .:-=+*#%@";
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const cellSize = Math.min(22, Math.max(7, Math.round(Number(ctx.params.cellSize ?? 12))));
    const contrast = Math.min(2.5, Math.max(0.5, Number(ctx.params.contrast ?? 1.35)));
    const motion = Math.min(3, Math.max(1, Math.round(Number(ctx.params.motion ?? 1))));
    const invert = Boolean(ctx.params.invert ?? false);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * motion;
    let pixels;
    if (ctx.subject.bitmap) {
      g.clearRect(0, 0, ctx.width, ctx.height);
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      pixels = g.getImageData(0, 0, ctx.width, ctx.height);
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.font = \`700 \${cellSize}px monospace\`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const shiftX = Math.sin(phase) * cellSize * 2.2;
    const shiftY = Math.cos(phase) * cellSize * 1.3;
    for (let y = -cellSize; y < ctx.height + cellSize; y += cellSize) {
      for (let x = -cellSize; x < ctx.width + cellSize; x += cellSize) {
        const sampleX = Math.min(ctx.width - 1, Math.max(0, Math.round(x - shiftX)));
        const sampleY = Math.min(ctx.height - 1, Math.max(0, Math.round(y - shiftY)));
        const offset = (sampleY * ctx.width + sampleX) * 4;
        const alpha = pixels ? pixels.data[offset + 3] / 255 : 0;
        const luminance = pixels ? (pixels.data[offset] * 0.2126 + pixels.data[offset + 1] * 0.7152 + pixels.data[offset + 2] * 0.0722) / 255 : 0;
        const field = 0.5 + 0.28 * Math.sin(x * 0.025 + phase) + 0.22 * Math.cos(y * 0.032 - phase * 1.4);
        let value = alpha > 0.04 ? luminance * 0.82 + field * 0.18 : field * 0.42;
        value = Math.min(1, Math.max(0, (value - 0.5) * contrast + 0.5));
        if (invert) value = 1 - value;
        const glyph = GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(value * GLYPHS.length))];
        g.globalAlpha = alpha > 0.04 ? 0.52 + value * 0.48 : 0.1 + value * 0.22;
        g.fillText(glyph, x + shiftX, y + shiftY);
      }
    }
    g.restore();
  }
};
var E12_ascii_map_effect_default = kernel;
`;export{e as default};
