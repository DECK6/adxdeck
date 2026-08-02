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
var N20_moth_swarm_effect_exports = {};
__export(N20_moth_swarm_effect_exports, {
  default: () => N20_moth_swarm_effect_default
});
module.exports = __toCommonJS(N20_moth_swarm_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const count = Math.min(48, Math.max(10, Math.round(Number(ctx.params.count ?? 28))));
    const attraction = Math.min(1, Math.max(0.25, Number(ctx.params.attraction ?? 0.68)));
    const flutter = Math.min(1, Math.max(0.2, Number(ctx.params.flutter ?? 0.72)));
    const size = Math.min(6, Math.max(1.5, Number(ctx.params.size ?? 3.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.48;
    const scale = Math.min(ctx.width, ctx.height);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.35;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    const lamp = g.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 0.42);
    lamp.addColorStop(0, signal);
    lamp.addColorStop(0.07, signal);
    lamp.addColorStop(1, "#0D0E10");
    g.save();
    g.globalAlpha = 0.26;
    g.fillStyle = lamp;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.globalAlpha = 0.95;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = scale * 0.08;
    g.beginPath();
    g.arc(centerX, centerY, scale * 0.018, 0, TAU);
    g.fill();
    g.restore();
    for (let index = 0; index < count; index += 1) {
      const seed = ctx.random(\`moth:\${index}:phase\`) * TAU;
      const orbit = 1 + Math.floor(ctx.random(\`moth:\${index}:orbit\`) * 3);
      const radiusSeed = ctx.random(\`moth:\${index}:radius\`);
      const radius = scale * (0.07 + radiusSeed * 0.35) * (1.2 - attraction * 0.72);
      const phase = seed + ctx.t * TAU * orbit;
      const wobblePhase = seed * 1.7 + ctx.t * TAU * (orbit + 2);
      const x = centerX + Math.cos(phase) * radius * (1.15 + Math.sin(wobblePhase) * 0.18);
      const y = centerY + Math.sin(phase * 2 + seed) * radius * 0.58 + Math.cos(wobblePhase) * radius * 0.14;
      const dx = -Math.sin(phase) * radius;
      const dy = Math.cos(phase * 2 + seed) * radius * 1.16;
      const heading = Math.atan2(dy, dx);
      const mothSize = size * (0.62 + ctx.random(\`moth:\${index}:size\`) * 0.74);
      const wingCycles = orbit * 4 + 3 + Math.floor(ctx.random(\`moth:\${index}:wing-cycles\`) * 4);
      const wing = 0.28 + Math.abs(Math.sin(seed + ctx.t * TAU * wingCycles)) * flutter * 0.9;
      g.save();
      g.translate(x, y);
      g.rotate(heading);
      g.fillStyle = signal;
      g.strokeStyle = signal;
      g.shadowColor = signal;
      g.shadowBlur = mothSize * 1.8;
      g.globalAlpha = 0.42 + (1 - radiusSeed) * 0.5;
      g.beginPath();
      g.ellipse(-mothSize * 0.52, -mothSize * wing, mothSize * 0.9, mothSize * 0.38, -0.42, 0, TAU);
      g.ellipse(-mothSize * 0.52, mothSize * wing, mothSize * 0.9, mothSize * 0.38, 0.42, 0, TAU);
      g.fill();
      g.globalAlpha = 0.86;
      g.lineWidth = Math.max(0.7, mothSize * 0.22);
      g.beginPath();
      g.moveTo(-mothSize * 0.7, 0);
      g.lineTo(mothSize * 0.8, 0);
      g.stroke();
      g.restore();
    }
  }
};
var N20_moth_swarm_effect_default = kernel;
`;export{t as default};
