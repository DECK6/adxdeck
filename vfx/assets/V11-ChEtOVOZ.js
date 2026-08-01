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
var V11_scatter_settle_effect_exports = {};
__export(V11_scatter_settle_effect_exports, {
  default: () => V11_scatter_settle_effect_default
});
module.exports = __toCommonJS(V11_scatter_settle_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const points = Math.min(90, Math.max(16, Math.round(Number(ctx.params.points ?? 48))));
    const spread = Math.min(1, Math.max(0.25, Number(ctx.params.spread ?? 0.82)));
    const pointSize = Math.min(9, Math.max(2, Number(ctx.params.pointSize ?? 4)));
    const trails = Boolean(ctx.params.trails ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const left = ctx.width * 0.12;
    const top = ctx.height * 0.12;
    const plotWidth = ctx.width * 0.76;
    const plotHeight = ctx.height * 0.76;
    const settle = 0.1 + 0.9 * Math.pow(0.5 + 0.5 * Math.cos(phase), 1.4);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.13;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = "rgba(94,231,243,0.18)";
    g.lineWidth = 1;
    for (let grid = 0; grid <= 4; grid += 1) {
      const x = left + plotWidth * (grid / 4);
      const y = top + plotHeight * (grid / 4);
      g.beginPath();
      g.moveTo(x, top);
      g.lineTo(x, top + plotHeight);
      g.moveTo(left, y);
      g.lineTo(left + plotWidth, y);
      g.stroke();
    }
    for (let index = 0; index < points; index += 1) {
      const targetX = left + ctx.random(\`point:\${index}:x\`) * plotWidth;
      const trend = (targetX - left) / plotWidth;
      const targetY = top + plotHeight * (0.82 - trend * 0.62 + (ctx.random(\`point:\${index}:noise\`) - 0.5) * 0.34);
      const pointPhase = ctx.random(\`point:\${index}:phase\`) * TAU;
      const radiusX = plotWidth * spread * (0.08 + ctx.random(\`point:\${index}:rx\`) * 0.24) * settle;
      const radiusY = plotHeight * spread * (0.08 + ctx.random(\`point:\${index}:ry\`) * 0.27) * settle;
      const x = targetX + Math.cos(phase + pointPhase) * radiusX;
      const y = targetY + Math.sin(phase * 2 + pointPhase) * radiusY;
      if (trails) {
        g.strokeStyle = signal;
        g.globalAlpha = 0.12 + settle * 0.16;
        g.beginPath();
        g.moveTo(targetX, targetY);
        g.lineTo(x, y);
        g.stroke();
      }
      g.fillStyle = signal;
      g.globalAlpha = 0.58 + ctx.random(\`point:\${index}:alpha\`) * 0.42;
      g.beginPath();
      g.arc(x, y, pointSize * (0.65 + ctx.random(\`point:\${index}:size\`) * 0.7), 0, TAU);
      g.fill();
    }
    g.restore();
  }
};
var V11_scatter_settle_effect_default = kernel;
`;export{t as default};
