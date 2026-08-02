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
var E13_brushed_metal_effect_exports = {};
__export(E13_brushed_metal_effect_exports, {
  default: () => E13_brushed_metal_effect_default
});
module.exports = __toCommonJS(E13_brushed_metal_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const grain = Math.min(180, Math.max(40, Math.round(Number(ctx.params.grain ?? 112))));
    const roughness = Math.min(1, Math.max(0.1, Number(ctx.params.roughness ?? 0.52)));
    const sweepWidth = Math.min(0.42, Math.max(0.08, Number(ctx.params.sweepWidth ?? 0.22)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const steel = g.createLinearGradient(0, 0, 0, ctx.height);
    steel.addColorStop(0, "#11161A");
    steel.addColorStop(0.34, "#262D31");
    steel.addColorStop(0.52, "#111416");
    steel.addColorStop(0.76, "#20272B");
    steel.addColorStop(1, "#0D0E10");
    g.fillStyle = steel;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.globalAlpha = 0.78;
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.restore();
    g.save();
    g.lineCap = "round";
    for (let index = 0; index < grain; index += 1) {
      const y = ctx.random(\`hair:\${index}:y\`) * ctx.height;
      const start = ctx.random(\`hair:\${index}:start\`) * ctx.width * 0.45;
      const length = ctx.width * (0.22 + ctx.random(\`hair:\${index}:length\`) * 0.72);
      const light = ctx.random(\`hair:\${index}:light\`) > 0.43;
      g.strokeStyle = light ? "#E8F4F5" : "#030506";
      g.globalAlpha = (0.035 + ctx.random(\`hair:\${index}:alpha\`) * 0.13) * roughness;
      g.lineWidth = 0.35 + ctx.random(\`hair:\${index}:width\`) * 1.15;
      g.beginPath();
      g.moveTo(start, y);
      g.lineTo(Math.min(ctx.width, start + length), y + (ctx.random(\`hair:\${index}:tilt\`) - 0.5) * 1.8);
      g.stroke();
    }
    g.restore();
    const sweepCenter = ctx.width * (0.5 + Math.sin(phase) * 0.46);
    const sweepRadius = ctx.width * sweepWidth;
    const sheen = g.createLinearGradient(sweepCenter - sweepRadius, 0, sweepCenter + sweepRadius, 0);
    sheen.addColorStop(0, "rgba(255,255,255,0)");
    sheen.addColorStop(0.42, "rgba(255,255,255,0.035)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.34)");
    sheen.addColorStop(0.58, "rgba(255,255,255,0.035)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    g.save();
    g.globalCompositeOperation = "screen";
    g.fillStyle = sheen;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.strokeStyle = signal;
    g.globalAlpha = 0.18;
    g.lineWidth = Math.max(1, ctx.height * 4e-3);
    g.beginPath();
    g.moveTo(sweepCenter, ctx.height * 0.08);
    g.lineTo(sweepCenter, ctx.height * 0.92);
    g.stroke();
    g.restore();
  }
};
var E13_brushed_metal_effect_default = kernel;
`;export{e as default};
