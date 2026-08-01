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
var P08_swarm_flock_effect_exports = {};
__export(P08_swarm_flock_effect_exports, {
  default: () => P08_swarm_flock_effect_default
});
module.exports = __toCommonJS(P08_swarm_flock_effect_exports);
const TAU = Math.PI * 2;
const stateful = {
  init: (ctx) => {
    const count = Math.min(180, Math.max(24, Math.round(Number(ctx.params.count ?? 108))));
    return {
      flight: 0,
      boids: Array.from({ length: count }, (_, index) => ({
        phase: ctx.random(\`b:\${index}:phase\`) * TAU,
        orbit: 1 + Math.floor(ctx.random(\`b:\${index}:orbit\`) * 3),
        layer: ctx.random(\`b:\${index}:layer\`),
        radius: 0.3 + ctx.random(\`b:\${index}:radius\`) * 0.7,
        scale: 0.55 + ctx.random(\`b:\${index}:scale\`) * 1.05,
        alpha: 0.42 + ctx.random(\`b:\${index}:alpha\`) * 0.54
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      flight: (state.flight + TAU * speed / duration) % TAU,
      boids: state.boids.map((boid) => ({
        ...boid,
        phase: (boid.phase + TAU * boid.orbit * speed / duration) % TAU
      }))
    };
  },
  render: (g, state, ctx) => {
    const cohesion = Math.min(1, Math.max(0.2, Number(ctx.params.cohesion ?? 0.66)));
    const size = Math.min(7, Math.max(1, Number(ctx.params.size ?? 3.2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const centerX = ctx.width * (0.5 + Math.sin(state.flight) * 0.2);
    const centerY = ctx.height * (0.5 + Math.sin(state.flight * 2) * 0.15);
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 1.6;
    for (const boid of state.boids) {
      const spread = (1.12 - cohesion) * boid.radius;
      const x = centerX + Math.cos(boid.phase) * ctx.width * 0.3 * spread;
      const y = centerY + Math.sin(boid.phase * 1.5 + boid.layer * TAU) * ctx.height * 0.28 * spread;
      const dx = Math.cos(boid.phase + 0.12) - Math.cos(boid.phase - 0.12);
      const dy = Math.sin((boid.phase + 0.12) * 1.5 + boid.layer * TAU) - Math.sin((boid.phase - 0.12) * 1.5 + boid.layer * TAU);
      const heading = Math.atan2(dy * ctx.height, dx * ctx.width);
      const length = size * boid.scale * 2.5;
      g.globalAlpha = boid.alpha;
      g.save();
      g.translate(x, y);
      g.rotate(heading);
      g.beginPath();
      g.moveTo(length, 0);
      g.lineTo(-length * 0.72, length * 0.48);
      g.lineTo(-length * 0.32, 0);
      g.lineTo(-length * 0.72, -length * 0.48);
      g.closePath();
      g.fill();
      g.restore();
    }
    g.restore();
  }
};
const kernel = { kind: "canvas", stateful };
var P08_swarm_flock_effect_default = kernel;
`;export{t as default};
