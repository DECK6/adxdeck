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
var R08_phyllotaxis_effect_exports = {};
__export(R08_phyllotaxis_effect_exports, {
  default: () => R08_phyllotaxis_effect_default
});
module.exports = __toCommonJS(R08_phyllotaxis_effect_exports);
const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(600, Math.max(80, Math.round(Number(ctx.params.count ?? 360))));
    const spread = Math.min(1, Math.max(0.55, Number(ctx.params.spread ?? 0.88)));
    const dotSize = Math.min(5, Math.max(0.8, Number(ctx.params.dotSize ?? 2.4)));
    const motion = Math.min(1, Math.max(0, Number(ctx.params.motion ?? 0.55)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const radius = Math.min(ctx.width, ctx.height) * 0.47 * spread;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.28;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = dotSize * 1.8;
    for (let index = count - 1; index >= 0; index -= 1) {
      const ratio = (index + 0.5) / count;
      const wave = Math.sin(phase - ratio * TAU * 2);
      const angle = index * GOLDEN_ANGLE + phase * motion;
      const distance = Math.sqrt(ratio) * radius * (1 + wave * motion * 0.025);
      const size = dotSize * (0.58 + ratio * 0.72) * (1 + wave * motion * 0.32);
      g.globalAlpha = 0.28 + ratio * 0.54 + (wave + 1) * motion * 0.08;
      g.beginPath();
      g.arc(
        centerX + Math.cos(angle) * distance,
        centerY + Math.sin(angle) * distance,
        Math.max(0.35, size),
        0,
        TAU
      );
      g.fill();
    }
    g.restore();
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.72;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
  }
};
var R08_phyllotaxis_effect_default = kernel;
`;export{t as default};
