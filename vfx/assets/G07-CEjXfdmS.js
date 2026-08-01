const t=`var __defProp = Object.defineProperty;
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
var G07_block_corrupt_effect_exports = {};
__export(G07_block_corrupt_effect_exports, {
  default: () => G07_block_corrupt_effect_default
});
module.exports = __toCommonJS(G07_block_corrupt_effect_exports);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const blockSize = Math.round(clamp(Number(ctx.params.blockSize ?? 22), 8, 48));
    const corruption = clamp(Number(ctx.params.corruption ?? 0.62), 0.1, 1);
    const displacement = clamp(Number(ctx.params.displacement ?? 34), 4, 80);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    const tickCount = 36;
    const exactTick = ctx.t * tickCount;
    const tick = Math.floor(exactTick) % tickCount;
    const tickMix = exactTick - Math.floor(exactTick);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    const columns = Math.ceil(ctx.width / blockSize);
    const rows = Math.ceil(ctx.height / blockSize);
    const source = ctx.subject.bitmap;
    g.save();
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        if (ctx.random(\`active:\${tick}:\${index}\`) > corruption * 0.48) continue;
        const x = column * blockSize;
        const y = row * blockSize;
        const width = Math.min(blockSize, ctx.width - x);
        const height = Math.min(blockSize, ctx.height - y);
        const direction = ctx.random(\`direction:\${tick}:\${index}\`) * 2 - 1;
        const travel = direction * displacement * (0.35 + 0.65 * Math.sin(tickMix * Math.PI));
        if (source) {
          const sourceColumn = Math.floor(ctx.random(\`source-x:\${tick}:\${index}\`) * columns);
          const sourceRow = Math.floor(ctx.random(\`source-y:\${tick}:\${index}\`) * rows);
          g.globalAlpha = 0.72 + ctx.random(\`alpha:\${tick}:\${index}\`) * 0.28;
          g.drawImage(
            source,
            sourceColumn * (source.width / columns),
            sourceRow * (source.height / rows),
            source.width / columns,
            source.height / rows,
            x + travel,
            y,
            width,
            height
          );
        }
        if (ctx.random(\`signal:\${tick}:\${index}\`) < 0.32) {
          g.globalAlpha = 0.16 + 0.2 * Math.sin(tickMix * Math.PI);
          g.fillStyle = signal;
          g.fillRect(x + travel, y, width, Math.max(1, height * 0.14));
        }
      }
    }
    const scanY = ctx.t * 2.4 % 1 * ctx.height;
    g.globalAlpha = 0.3 + 0.18 * Math.sin(phase * 3) ** 2;
    g.fillStyle = signal;
    g.fillRect(0, scanY, ctx.width, Math.max(1, ctx.height * 0.012));
    g.restore();
  }
};
var G07_block_corrupt_effect_default = kernel;
`;export{t as default};
