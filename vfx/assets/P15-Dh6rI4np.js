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
var P15_fireflies_effect_exports = {};
__export(P15_fireflies_effect_exports, {
  default: () => P15_fireflies_effect_default
});
module.exports = __toCommonJS(P15_fireflies_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(48, Math.max(10, Math.round(Number(ctx.params.count ?? 26))));
    const wander = Math.min(1.4, Math.max(0.3, Number(ctx.params.wander ?? 0.82)));
    const glow = Math.min(12, Math.max(2, Number(ctx.params.glow ?? 7)));
    const trail = Math.min(5, Math.max(0, Math.round(Number(ctx.params.trail ?? 3))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.globalAlpha = 0.62;
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.restore();
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = signal;
    g.shadowColor = signal;
    for (let index = 0; index < count; index += 1) {
      const anchorX = 0.12 + ctx.random(\`fly:\${index}:x\`) * 0.76;
      const anchorY = 0.18 + ctx.random(\`fly:\${index}:y\`) * 0.68;
      const offset = ctx.random(\`fly:\${index}:phase\`) * TAU;
      const cycleX = 1 + Math.floor(ctx.random(\`fly:\${index}:cx\`) * 2);
      const cycleY = 1 + Math.floor(ctx.random(\`fly:\${index}:cy\`) * 3);
      const radius = (0.025 + ctx.random(\`fly:\${index}:radius\`) * 0.055) * wander;
      const size = 0.8 + ctx.random(\`fly:\${index}:size\`) * 1.8;
      const pulseCycles = 2 + Math.floor(ctx.random(\`fly:\${index}:pulse\`) * 4);
      for (let history = trail; history >= 0; history -= 1) {
        const past = phase - history * 0.055;
        const x = anchorX + Math.sin(past * cycleX + offset) * radius + Math.cos(past * 3 + offset) * radius * 0.25;
        const y = anchorY + Math.cos(past * cycleY + offset * 1.31) * radius * 0.72;
        const pulse = Math.pow(Math.max(0, 0.5 + 0.5 * Math.sin(phase * pulseCycles + offset)), 4);
        const historyFade = history === 0 ? 1 : (1 - history / (trail + 1)) * 0.32;
        g.globalAlpha = (0.12 + pulse * 0.88) * historyFade;
        g.shadowBlur = history === 0 ? glow : glow * 0.35;
        g.beginPath();
        g.arc(x * ctx.width, y * ctx.height, size * (history === 0 ? 1 : 0.56), 0, TAU);
        g.fill();
      }
    }
    g.restore();
  }
};
var P15_fireflies_effect_default = kernel;
`;export{t as default};
