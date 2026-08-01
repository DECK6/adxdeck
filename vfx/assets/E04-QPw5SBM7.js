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
var E04_paper_fiber_effect_exports = {};
__export(E04_paper_fiber_effect_exports, {
  default: () => E04_paper_fiber_effect_default
});
module.exports = __toCommonJS(E04_paper_fiber_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const density = Math.min(180, Math.max(30, Math.round(Number(ctx.params.density ?? 96))));
    const fiberLength = Math.min(52, Math.max(8, Number(ctx.params.fiberLength ?? 28)));
    const drift = Math.min(2, Math.max(0.25, Number(ctx.params.drift ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const margin = fiberLength * 1.5;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.globalAlpha = 0.9;
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.restore();
    g.save();
    g.lineCap = "round";
    g.strokeStyle = signal;
    for (let index = 0; index < density; index += 1) {
      const seedX = ctx.random(\`fiber:\${index}:x\`);
      const seedY = ctx.random(\`fiber:\${index}:y\`);
      const angle = ctx.random(\`fiber:\${index}:angle\`) * TAU;
      const lane = ctx.random(\`fiber:\${index}:lane\`) * TAU;
      const length = fiberLength * (0.35 + ctx.random(\`fiber:\${index}:length\`) * 0.65);
      const travelX = Math.cos(phase + lane) * ctx.width * 0.1 * drift;
      const travelY = Math.sin(phase + lane * 0.73) * ctx.height * 0.12 * drift;
      const x = (seedX * (ctx.width + margin * 2) + travelX + margin) % (ctx.width + margin * 2) - margin;
      const y = (seedY * (ctx.height + margin * 2) + travelY + margin) % (ctx.height + margin * 2) - margin;
      const bend = Math.sin(phase * (index % 2 === 0 ? 1 : -1) + lane) * length * 0.34;
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;
      g.globalAlpha = 0.12 + ctx.random(\`fiber:\${index}:alpha\`) * 0.34;
      g.lineWidth = 0.55 + ctx.random(\`fiber:\${index}:width\`) * 1.25;
      g.beginPath();
      g.moveTo(x - dx * 0.5, y - dy * 0.5);
      g.quadraticCurveTo(x + Math.cos(angle + Math.PI / 2) * bend, y + Math.sin(angle + Math.PI / 2) * bend, x + dx * 0.5, y + dy * 0.5);
      g.stroke();
    }
    g.restore();
  }
};
var E04_paper_fiber_effect_default = kernel;
`;export{e as default};
