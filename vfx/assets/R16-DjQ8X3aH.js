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
var R16_moire_rings_effect_exports = {};
__export(R16_moire_rings_effect_exports, {
  default: () => R16_moire_rings_effect_default
});
module.exports = __toCommonJS(R16_moire_rings_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const rings = Math.min(70, Math.max(20, Math.round(Number(ctx.params.rings ?? 46))));
    const separation = Math.min(0.28, Math.max(0.02, Number(ctx.params.separation ?? 0.13)));
    const drift = Math.min(1, Math.max(0, Number(ctx.params.drift ?? 0.72)));
    const lineWidth = Math.min(2, Math.max(0.4, Number(ctx.params.lineWidth ?? 0.9)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const minSide = Math.min(ctx.width, ctx.height);
    const gap = minSide / (rings * 0.62);
    const offset = minSide * separation;
    const orbitX = Math.cos(phase) * offset * drift;
    const orbitY = Math.sin(phase * 2) * offset * drift * 0.5;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.2;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    const drawSet = (cx, cy, scale, alpha) => {
      g.beginPath();
      for (let index = 1; index <= rings; index += 1) {
        g.moveTo(cx + index * gap * scale, cy);
        g.arc(cx, cy, index * gap * scale, 0, TAU);
      }
      g.globalAlpha = alpha;
      g.stroke();
    };
    g.save();
    g.strokeStyle = signal;
    g.lineWidth = lineWidth;
    g.shadowColor = signal;
    g.shadowBlur = lineWidth * 2;
    drawSet(ctx.width * 0.5 - offset + orbitX, ctx.height * 0.5 + orbitY, 1, 0.64);
    drawSet(ctx.width * 0.5 + offset - orbitX, ctx.height * 0.5 - orbitY, 1.007, 0.48);
    g.restore();
  }
};
var R16_moire_rings_effect_default = kernel;
`;export{e as default};
