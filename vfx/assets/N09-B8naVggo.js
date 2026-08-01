const n=`var __defProp = Object.defineProperty;
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
var N09_sand_flow_effect_exports = {};
__export(N09_sand_flow_effect_exports, {
  default: () => N09_sand_flow_effect_default
});
module.exports = __toCommonJS(N09_sand_flow_effect_exports);
function createSand(ctx) {
  const count = Math.min(480, Math.max(120, Math.round(Number(ctx.params.count ?? 320))));
  const spread = Math.min(0.8, Math.max(0.15, Number(ctx.params.spread ?? 0.46)));
  const grainSize = Math.min(2.4, Math.max(0.8, Number(ctx.params.grainSize ?? 1.35)));
  const bins = Math.max(32, Math.round(ctx.width / Math.max(3, grainSize * 3.2)));
  return {
    bed: new Array(bins).fill(0),
    particles: Array.from({ length: count }, (_, index) => ({
      x: ctx.width * (0.5 + (ctx.random(\`sand:\${index}:x\`) - 0.5) * spread),
      y: -ctx.height * (0.05 + ctx.random(\`sand:\${index}:delay\`) * 1.85),
      vx: (ctx.random(\`sand:\${index}:vx\`) - 0.5) * ctx.width * 0.045,
      vy: ctx.height * (0.025 + ctx.random(\`sand:\${index}:vy\`) * 0.04),
      radius: grainSize * (0.55 + ctx.random(\`sand:\${index}:size\`) * 0.75),
      alpha: 0.5 + ctx.random(\`sand:\${index}:alpha\`) * 0.5,
      resting: false
    }))
  };
}
const stateful = {
  init: createSand,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createSand(ctx);
    const dt = 1 / Math.max(1, ctx.fps);
    const flow = Math.min(1.8, Math.max(0.35, Number(ctx.params.flow ?? 1)));
    const bed = [...state.bed];
    const binWidth = ctx.width / bed.length;
    const particles = state.particles.map((particle, index) => {
      if (particle.resting) return particle;
      const flutter = (ctx.random(\`sand:\${ctx.frame}:\${index}:flutter\`) - 0.5) * ctx.width * 0.018;
      const vx = particle.vx * 0.985 + flutter * dt;
      const vy = particle.vy + ctx.height * 0.31 * flow * dt;
      const x = Math.min(ctx.width - particle.radius, Math.max(particle.radius, particle.x + vx * dt));
      const y = particle.y + vy * dt;
      const centerBin = Math.min(bed.length - 1, Math.max(0, Math.floor(x / binWidth)));
      let landingBin = centerBin;
      for (let offset = -2; offset <= 2; offset += 1) {
        const candidate = centerBin + offset;
        if (candidate >= 0 && candidate < bed.length && bed[candidate] < bed[landingBin]) landingBin = candidate;
      }
      const surface = ctx.height - bed[landingBin];
      if (y + particle.radius < surface) return { ...particle, x, y, vx, vy };
      const deposit = Math.max(0.45, Math.PI * particle.radius * particle.radius / binWidth) * 0.78;
      bed[landingBin] = Math.min(ctx.height * 0.48, bed[landingBin] + deposit);
      return {
        ...particle,
        x: (landingBin + 0.5) * binWidth,
        y: ctx.height - bed[landingBin] + particle.radius * 0.35,
        vx: 0,
        vy: 0,
        resting: true
      };
    });
    return { particles, bed };
  },
  render: (g, state, ctx) => {
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const binWidth = ctx.width / state.bed.length;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.globalAlpha = 0.2;
    g.beginPath();
    g.moveTo(0, ctx.height);
    for (let index = 0; index < state.bed.length; index += 1) {
      g.lineTo((index + 0.5) * binWidth, ctx.height - state.bed[index]);
    }
    g.lineTo(ctx.width, ctx.height);
    g.closePath();
    g.fill();
    g.restore();
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.7;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, ctx.width * 6e-3);
    for (const particle of state.particles) {
      g.globalAlpha = particle.resting ? particle.alpha * 0.7 : particle.alpha;
      g.beginPath();
      g.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
};
const kernel = { kind: "canvas", stateful };
var N09_sand_flow_effect_default = kernel;
`;export{n as default};
