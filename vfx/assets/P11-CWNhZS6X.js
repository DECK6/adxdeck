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
var P11_trail_emitter_effect_exports = {};
__export(P11_trail_emitter_effect_exports, {
  default: () => P11_trail_emitter_effect_default
});
module.exports = __toCommonJS(P11_trail_emitter_effect_exports);
const TAU = Math.PI * 2;
const pathPoint = (phase) => ({
  x: 0.5 + Math.sin(phase * 2) * 0.32,
  y: 0.5 + Math.sin(phase * 3 + Math.PI / 2) * 0.28
});
const stateful = {
  init: (ctx) => {
    const count = Math.min(160, Math.max(24, Math.round(Number(ctx.params.count ?? 96))));
    return {
      phase: 0,
      particles: Array.from({ length: count }, (_, index) => ({
        age: index / count,
        spread: ctx.random(\`t:\${index}:spread\`) * 2 - 1,
        scale: 0.5 + ctx.random(\`t:\${index}:scale\`) * 1.15,
        alpha: 0.45 + ctx.random(\`t:\${index}:alpha\`) * 0.52
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      phase: (state.phase + TAU * speed / duration) % TAU,
      particles: state.particles
    };
  },
  render: (g, state, ctx) => {
    const trail = Math.min(0.8, Math.max(0.1, Number(ctx.params.trail ?? 0.46)));
    const size = Math.min(7, Math.max(1, Number(ctx.params.size ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2.8;
    for (const particle of state.particles) {
      const lag = particle.age * trail * TAU;
      const phase = state.phase - lag;
      const point = pathPoint(phase);
      const tangent = pathPoint(phase + 8e-3);
      const dx = (tangent.x - point.x) * ctx.width;
      const dy = (tangent.y - point.y) * ctx.height;
      const magnitude = Math.max(1e-3, Math.hypot(dx, dy));
      const spread = particle.spread * size * 2.4 * Math.sin(particle.age * Math.PI);
      const x = point.x * ctx.width - dy / magnitude * spread;
      const y = point.y * ctx.height + dx / magnitude * spread;
      const fade = (1 - particle.age) ** 1.4;
      g.globalAlpha = particle.alpha * fade;
      g.beginPath();
      g.arc(x, y, Math.max(0.7, size * particle.scale * (0.28 + fade * 0.72)), 0, TAU);
      g.fill();
    }
    const emitter = pathPoint(state.phase);
    g.globalAlpha = 1;
    g.beginPath();
    g.arc(emitter.x * ctx.width, emitter.y * ctx.height, size * 1.8, 0, TAU);
    g.fill();
    g.restore();
  }
};
const kernel = { kind: "canvas", stateful };
var P11_trail_emitter_effect_default = kernel;
`;export{t as default};
