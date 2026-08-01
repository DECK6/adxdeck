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
var P09_magnetic_field_effect_exports = {};
__export(P09_magnetic_field_effect_exports, {
  default: () => P09_magnetic_field_effect_default
});
module.exports = __toCommonJS(P09_magnetic_field_effect_exports);
const TAU = Math.PI * 2;
const pointOnField = (phase, line, side, curvature) => {
  const angle = phase + side * Math.PI;
  const shell = 0.15 + line * 0.33;
  const pinch = 0.42 + 0.58 * Math.sin(angle) ** 2;
  return {
    x: 0.5 + Math.cos(angle) * shell * pinch,
    y: 0.5 + Math.sin(angle) * shell * curvature
  };
};
const stateful = {
  init: (ctx) => {
    const density = Math.min(140, Math.max(20, Math.round(Number(ctx.params.density ?? 76))));
    return {
      particles: Array.from({ length: density }, (_, index) => ({
        phase: ctx.random(\`m:\${index}:phase\`) * TAU,
        line: ctx.random(\`m:\${index}:line\`),
        side: index % 2,
        scale: 0.55 + ctx.random(\`m:\${index}:scale\`) * 0.95,
        alpha: 0.4 + ctx.random(\`m:\${index}:alpha\`) * 0.55
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      particles: state.particles.map((particle) => ({
        ...particle,
        phase: (particle.phase + TAU * speed / duration) % TAU
      }))
    };
  },
  render: (g, state, ctx) => {
    const curvature = Math.min(1.4, Math.max(0.4, Number(ctx.params.curvature ?? 0.86)));
    const size = Math.min(6, Math.max(1, Number(ctx.params.size ?? 2.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2;
    g.lineCap = "round";
    for (const particle of state.particles) {
      const current = pointOnField(particle.phase, particle.line, particle.side, curvature);
      const next = pointOnField(particle.phase + 0.035, particle.line, particle.side, curvature);
      const dx = (next.x - current.x) * ctx.width;
      const dy = (next.y - current.y) * ctx.height;
      const length = size * particle.scale * 3.5;
      const magnitude = Math.max(1e-3, Math.hypot(dx, dy));
      g.globalAlpha = particle.alpha;
      g.lineWidth = Math.max(1, size * particle.scale * 0.55);
      g.beginPath();
      g.moveTo(current.x * ctx.width - dx / magnitude * length, current.y * ctx.height - dy / magnitude * length);
      g.lineTo(current.x * ctx.width + dx / magnitude * length, current.y * ctx.height + dy / magnitude * length);
      g.stroke();
    }
    g.restore();
  }
};
const kernel = { kind: "canvas", stateful };
var P09_magnetic_field_effect_default = kernel;
`;export{e as default};
