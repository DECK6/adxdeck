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
var G09_interlace_tear_effect_exports = {};
__export(G09_interlace_tear_effect_exports, {
  default: () => G09_interlace_tear_effect_default
});
module.exports = __toCommonJS(G09_interlace_tear_effect_exports);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const lineHeight = Math.round(clamp(Number(ctx.params.lineHeight ?? 3), 1, 8));
    const tear = clamp(Number(ctx.params.tear ?? 28), 2, 64);
    const bandCount = Math.round(clamp(Number(ctx.params.bands ?? 4), 1, 8));
    const intensity = clamp(Number(ctx.params.intensity ?? 0.72), 0, 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const source = ctx.subject.bitmap;
    if (source) {
      for (let y = 0; y < ctx.height; y += lineHeight) {
        let shift = Math.sin(phase * 2 + y * 0.105) * tear * 0.1 * intensity;
        for (let band = 0; band < bandCount; band += 1) {
          const center = (ctx.t * (0.36 + band * 0.07) + ctx.random(\`band:\${band}\`)) % 1 * ctx.height;
          const distance = Math.abs(y - center);
          const radius = ctx.height * (0.045 + ctx.random(\`radius:\${band}\`) * 0.08);
          if (distance < radius) {
            const envelope = 1 - distance / radius;
            const direction = ctx.random(\`direction:\${band}\`) > 0.5 ? 1 : -1;
            shift += direction * tear * envelope * Math.sin(envelope * Math.PI) * intensity;
          }
        }
        const sourceY = y / ctx.height * source.height;
        const sourceHeight = Math.max(1, lineHeight / ctx.height * source.height);
        g.globalAlpha = y % (lineHeight * 2) === 0 ? 0.84 : 1;
        g.drawImage(source, 0, sourceY, source.width, sourceHeight, shift, y, ctx.width, lineHeight);
      }
    }
    g.save();
    g.globalCompositeOperation = "screen";
    for (let y = 0; y < ctx.height; y += lineHeight * 2) {
      const alpha = 0.035 + 0.055 * intensity * (0.5 + 0.5 * Math.sin(phase * 4 + y));
      g.globalAlpha = alpha;
      g.fillStyle = signal;
      g.fillRect(0, y, ctx.width, Math.max(1, lineHeight * 0.34));
    }
    const tearY = (ctx.t * 1.75 + 0.15) % 1 * ctx.height;
    g.globalAlpha = 0.2 + intensity * 0.28;
    g.fillStyle = signal;
    g.fillRect(0, tearY, ctx.width, Math.max(1, lineHeight * 0.5));
    g.restore();
  }
};
var G09_interlace_tear_effect_default = kernel;
`;export{e as default};
