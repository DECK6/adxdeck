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
var X20_pixel_melt_effect_exports = {};
__export(X20_pixel_melt_effect_exports, {
  default: () => X20_pixel_melt_effect_default
});
module.exports = __toCommonJS(X20_pixel_melt_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const columns = Math.round(Number(ctx.params.columns ?? 28));
    const drop = Number(ctx.params.drop ?? 0.72);
    const blocks = Math.round(Number(ctx.params.blocks ?? 6));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const melt = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;
    const sourceW = ctx.subject.bitmap.width;
    const sourceH = ctx.subject.bitmap.height;
    const destW = ctx.width / columns;
    g.imageSmoothingEnabled = false;
    for (let column = 0; column < columns; column += 1) {
      const sourceX = column * sourceW / columns;
      const delay = ctx.random(\`delay:\${column}\`) * 0.48;
      const local = Math.max(0, Math.min(1, (melt - delay) / Math.max(0.01, 1 - delay)));
      const fall = local * local * ctx.height * drop;
      const jitter = Math.sin(ctx.t * Math.PI * 2 * (2 + column % 4) + column) * destW * 0.3 * local;
      g.globalAlpha = 1 - local * 0.5;
      g.drawImage(ctx.subject.bitmap, sourceX, 0, sourceW / columns + 1, sourceH, column * destW + jitter, fall, destW + 1, ctx.height);
      g.fillStyle = signal;
      for (let block = 0; block < blocks; block += 1) {
        const by = fall - block * ctx.height * 0.055 - ctx.random(\`b:\${column}:\${block}\`) * 22;
        g.globalAlpha = local * (1 - block / blocks) * 0.34;
        g.fillRect(column * destW, by, destW * 0.82, destW * (0.35 + ctx.random(\`s:\${column}:\${block}\`)));
      }
    }
    g.globalAlpha = 1;
  }
};
var X20_pixel_melt_effect_default = kernel;
`;export{e as default};
