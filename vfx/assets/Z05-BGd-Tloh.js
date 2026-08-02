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
var Z05_eink_refresh_effect_exports = {};
__export(Z05_eink_refresh_effect_exports, {
  default: () => Z05_eink_refresh_effect_default
});
module.exports = __toCommonJS(Z05_eink_refresh_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const grain = Math.min(1, Math.max(0, Number(ctx.params.grain ?? 0.42)));
    const bands = Math.max(3, Math.round(Number(ctx.params.bands ?? 8)));
    const ghosting = Math.min(1, Math.max(0, Number(ctx.params.ghosting ?? 0.56)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % Math.max(1, ctx.durationInFrames) / Math.max(1, ctx.durationInFrames);
    g.save();
    g.clearRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    const source = g.getImageData(0, 0, ctx.width, ctx.height);
    const data = source.data;
    const sweep = phase * bands * 2 % 2;
    const activeBand = Math.floor(phase * bands) % bands;
    const bandHeight = ctx.height / bands;
    const flash = phase < 0.08 || phase > 0.48 && phase < 0.56;
    for (let y2 = 0; y2 < ctx.height; y2 += 1) {
      const band = Math.min(bands - 1, Math.floor(y2 / bandHeight));
      const updated = band <= activeBand;
      for (let x = 0; x < ctx.width; x += 1) {
        const offset = (y2 * ctx.width + x) * 4;
        const alpha = data[offset + 3] / 255;
        const luma = (data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722) / 255;
        const noise = (ctx.random(\`ink:\${x % 47}:\${y2 % 43}\`) - 0.5) * grain * 0.32;
        const threshold = 0.48 + noise;
        let ink = alpha * (luma > threshold ? 0.18 : 0.92);
        if (!updated) ink = ink * ghosting + 0.12 * (1 - ghosting);
        if (flash) ink = 1 - ink;
        const paper = 214 - Math.round(ctx.random(\`fiber:\${x % 61}:\${y2 % 59}\`) * 16 * grain);
        const value = Math.round(paper * (1 - ink) + 27 * ink);
        data[offset] = value;
        data[offset + 1] = value + 2;
        data[offset + 2] = value;
        data[offset + 3] = 255;
      }
    }
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const inset = Math.max(8, Math.round(Math.min(ctx.width, ctx.height) * 0.045));
    g.save();
    g.beginPath();
    g.rect(inset, inset, ctx.width - inset * 2, ctx.height - inset * 2);
    g.clip();
    g.putImageData(source, 0, 0);
    g.globalAlpha = ghosting * 0.12;
    g.globalCompositeOperation = "multiply";
    g.drawImage(g.canvas, inset + 2, inset, ctx.width - inset * 2, ctx.height - inset * 2, inset, inset, ctx.width - inset * 2, ctx.height - inset * 2);
    g.restore();
    const y = Math.min(ctx.height - inset, inset + (activeBand + sweep * 0.5) / bands * (ctx.height - inset * 2));
    g.fillStyle = signal;
    g.globalAlpha = flash ? 0.42 : 0.24;
    g.fillRect(inset, y, ctx.width - inset * 2, Math.max(1, ctx.height * 6e-3));
    g.globalAlpha = 1;
    g.strokeStyle = "#4C5557";
    g.lineWidth = 2;
    g.strokeRect(inset, inset, ctx.width - inset * 2, ctx.height - inset * 2);
    g.restore();
  }
};
var Z05_eink_refresh_effect_default = kernel;
`;export{t as default};
