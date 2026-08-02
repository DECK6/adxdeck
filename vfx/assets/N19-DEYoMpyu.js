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
var N19_volcano_ember_effect_exports = {};
__export(N19_volcano_ember_effect_exports, {
  default: () => N19_volcano_ember_effect_default
});
module.exports = __toCommonJS(N19_volcano_ember_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(120, Math.max(24, Math.round(Number(ctx.params.count ?? 72))));
    const eruption = Math.min(1, Math.max(0.35, Number(ctx.params.eruption ?? 0.76)));
    const gravity = Math.min(1.4, Math.max(0.4, Number(ctx.params.gravity ?? 0.92)));
    const cyclesValue = String(ctx.params.cycles ?? "2");
    const cycles = cyclesValue === "1" ? 1 : cyclesValue === "3" ? 3 : 2;
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const baseX = ctx.width * 0.5;
    const baseY = ctx.height * 0.82;
    const scale = Math.min(ctx.width, ctx.height);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.48;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    const craterGlow = g.createRadialGradient(baseX, baseY, 0, baseX, baseY, scale * 0.34);
    craterGlow.addColorStop(0, signal);
    craterGlow.addColorStop(0.18, signal);
    craterGlow.addColorStop(1, "#0D0E10");
    g.save();
    g.globalAlpha = 0.18 + eruption * 0.14;
    g.fillStyle = craterGlow;
    g.fillRect(0, baseY - scale * 0.35, ctx.width, scale * 0.5);
    g.restore();
    g.save();
    g.fillStyle = "#17181B";
    g.strokeStyle = signal;
    g.globalAlpha = 0.92;
    g.lineWidth = Math.max(1, scale * 6e-3);
    g.beginPath();
    g.moveTo(baseX - scale * 0.42, ctx.height);
    g.lineTo(baseX - scale * 0.12, baseY);
    g.quadraticCurveTo(baseX, baseY + scale * 0.035, baseX + scale * 0.12, baseY);
    g.lineTo(baseX + scale * 0.42, ctx.height);
    g.closePath();
    g.fill();
    g.stroke();
    g.restore();
    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, scale * 0.025);
    g.lineCap = "round";
    for (let index = 0; index < count; index += 1) {
      const offset = ctx.random(\`volcano:\${index}:offset\`);
      const progress = (ctx.t * cycles + offset) % 1;
      const life = Math.sin(progress * Math.PI);
      const power = 0.58 + ctx.random(\`volcano:\${index}:power\`) * 0.58;
      const lateral = (ctx.random(\`volcano:\${index}:lateral\`) - 0.5) * scale * (0.5 + eruption * 0.46);
      const rise = scale * eruption * power * 1.35;
      const x = baseX + lateral * progress + Math.sin(progress * TAU * 2 + offset * TAU) * scale * 0.018;
      const ballistic = Math.sin(progress * Math.PI) * rise - gravity * scale * 0.16 * progress * progress;
      const y = baseY - ballistic;
      const size = scale * (5e-3 + ctx.random(\`volcano:\${index}:size\`) * 0.012) * (0.55 + life * 0.72);
      const trailX = x - lateral * 0.035;
      const trailY = y + rise * Math.cos(progress * Math.PI) * 0.025;
      g.globalAlpha = life * (0.42 + ctx.random(\`volcano:\${index}:alpha\`) * 0.56);
      g.lineWidth = Math.max(0.7, size * 0.55);
      g.beginPath();
      g.moveTo(trailX, trailY);
      g.lineTo(x, y);
      g.stroke();
      g.beginPath();
      g.arc(x, y, size, 0, TAU);
      g.fill();
    }
    g.restore();
  }
};
var N19_volcano_ember_effect_default = kernel;
`;export{e as default};
