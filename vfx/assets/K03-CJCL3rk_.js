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
var K03_floyd_dither_effect_exports = {};
__export(K03_floyd_dither_effect_exports, {
  default: () => K03_floyd_dither_effect_default
});
module.exports = __toCommonJS(K03_floyd_dither_effect_exports);
function hexToRgb(value) {
  const hex = String(value ?? "#5EE7F3").replace("#", "");
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : "5EE7F3";
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16));
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const blockSize = Math.min(8, Math.max(2, Math.round(Number(ctx.params.blockSize ?? 4))));
    const contrast = Math.min(1.8, Math.max(0.6, Number(ctx.params.contrast ?? 1.15)));
    const diffusion = Math.min(1, Math.max(0.35, Number(ctx.params.diffusion ?? 0.9)));
    const signal = hexToRgb(ctx.params.signal);
    const columns = Math.ceil(ctx.width / blockSize);
    const rows = Math.ceil(ctx.height / blockSize);
    const values = new Float32Array(columns * rows);
    const phase = ctx.t * Math.PI * 2;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    const pixels = g.getImageData(0, 0, ctx.width, ctx.height).data;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const sampleX = Math.min(ctx.width - 1, column * blockSize + Math.floor(blockSize / 2));
        const sampleY = Math.min(ctx.height - 1, row * blockSize + Math.floor(blockSize / 2));
        const offset = (sampleY * ctx.width + sampleX) * 4;
        const luminance = (pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722) / 255;
        const wave = Math.sin(column * 0.17 + row * 0.11 - phase) * 0.045;
        values[row * columns + column] = Math.min(1, Math.max(0, (luminance - 0.5) * contrast + 0.5 + wave));
      }
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    for (let row = 0; row < rows; row += 1) {
      const reverse = row % 2 === 1;
      for (let scan = 0; scan < columns; scan += 1) {
        const column = reverse ? columns - 1 - scan : scan;
        const index = row * columns + column;
        const oldValue = values[index];
        const nextValue = oldValue < 0.5 ? 0 : 1;
        const error = (oldValue - nextValue) * diffusion;
        g.fillStyle = nextValue === 0 ? "#0D0E10" : \`rgb(\${signal[0]} \${signal[1]} \${signal[2]})\`;
        g.fillRect(column * blockSize, row * blockSize, blockSize, blockSize);
        const direction = reverse ? -1 : 1;
        if (column + direction >= 0 && column + direction < columns) values[index + direction] += error * (7 / 16);
        if (row + 1 < rows) {
          const below = index + columns;
          if (column - direction >= 0 && column - direction < columns) values[below - direction] += error * (3 / 16);
          values[below] += error * (5 / 16);
          if (column + direction >= 0 && column + direction < columns) values[below + direction] += error * (1 / 16);
        }
      }
    }
  }
};
var K03_floyd_dither_effect_default = kernel;
`;export{e as default};
