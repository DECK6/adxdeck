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
var N14_falling_leaves_effect_exports = {};
__export(N14_falling_leaves_effect_exports, {
  default: () => N14_falling_leaves_effect_default
});
module.exports = __toCommonJS(N14_falling_leaves_effect_exports);
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(52, Math.max(10, Math.round(Number(ctx.params.leaves ?? 28))));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    const sway = Math.min(1, Math.max(0.1, Number(ctx.params.sway ?? 0.68)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.64;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    const glow = g.createRadialGradient(ctx.width * 0.5, ctx.height * 0.45, 0, ctx.width * 0.5, ctx.height * 0.45, ctx.width * 0.55);
    glow.addColorStop(0, \`\${signal}15\`);
    glow.addColorStop(1, "#0D0E1000");
    g.fillStyle = glow;
    g.fillRect(0, 0, ctx.width, ctx.height);
    for (let index = 0; index < count; index += 1) {
      const fallCycles = 1 + Math.floor(ctx.random(\`leaf:\${index}:cycles\`) * 2);
      const progress = (ctx.random(\`leaf:\${index}:phase\`) + ctx.t * speed * fallCycles) % 1;
      const baseX = ctx.random(\`leaf:\${index}:x\`);
      const spiralCycles = 1 + Math.floor(ctx.random(\`leaf:\${index}:spiral\`) * 3);
      const phase = ctx.random(\`leaf:\${index}:sway\`) * Math.PI * 2;
      const depth = 0.42 + ctx.random(\`leaf:\${index}:depth\`) * 0.88;
      const size = Math.min(ctx.width, ctx.height) * 0.025 * depth;
      const x = (baseX + Math.sin(progress * Math.PI * 2 * spiralCycles + phase) * 0.09 * sway * depth + 1) % 1;
      const y = -0.08 + progress * 1.16;
      const rotation = phase + progress * Math.PI * 2 * (2 + spiralCycles);
      const edgeOn = 0.24 + Math.abs(Math.cos(rotation * 0.7)) * 0.76;
      g.save();
      g.translate(x * ctx.width, y * ctx.height);
      g.rotate(rotation);
      g.scale(1, edgeOn);
      g.globalAlpha = 0.32 + depth * 0.42;
      g.fillStyle = signal;
      g.shadowColor = signal;
      g.shadowBlur = size * 0.55;
      g.beginPath();
      g.moveTo(-size * 0.95, 0);
      g.bezierCurveTo(-size * 0.35, -size * 0.7, size * 0.55, -size * 0.52, size, 0);
      g.bezierCurveTo(size * 0.45, size * 0.65, -size * 0.42, size * 0.58, -size * 0.95, 0);
      g.fill();
      g.globalAlpha = 0.72;
      g.strokeStyle = "#0D0E10";
      g.lineWidth = Math.max(0.5, size * 0.06);
      g.beginPath();
      g.moveTo(-size * 0.8, 0);
      g.lineTo(size * 0.82, 0);
      g.stroke();
      g.restore();
    }
  }
};
var N14_falling_leaves_effect_default = kernel;
`;export{e as default};
