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
var P01_particle_burst_effect_exports = {};
__export(P01_particle_burst_effect_exports, {
  default: () => P01_particle_burst_effect_default
});
module.exports = __toCommonJS(P01_particle_burst_effect_exports);
const stateful = {
  init: (ctx) => {
    const count = Math.min(300, Math.max(20, Math.round(Number(ctx.params.count ?? 120))));
    const particles = Array.from({ length: count }, (_, i) => {
      const angle = ctx.random(\`p:\${i}:angle\`) * Math.PI * 2;
      const speed = 55 + ctx.random(\`p:\${i}:speed\`) * 175;
      return {
        x: ctx.width / 2,
        y: ctx.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: 0.45 + ctx.random(\`p:\${i}:scale\`) * 0.85,
        alpha: 0.48 + ctx.random(\`p:\${i}:alpha\`) * 0.52
      };
    });
    return { particles };
  },
  step: (state, ctx) => {
    const dt = 1 / ctx.fps;
    const gravity = Number(ctx.params.gravity ?? 0.65) * ctx.height * 0.18;
    const drag = Math.min(0.2, Math.max(0, Number(ctx.params.drag ?? 0.025)));
    const damping = Math.pow(1 - drag, dt * 30);
    return {
      particles: state.particles.map((particle) => {
        const vx = particle.vx * damping;
        const vy = (particle.vy + gravity * dt) * damping;
        return {
          ...particle,
          x: particle.x + vx * dt,
          y: particle.y + vy * dt,
          vx,
          vy,
          alpha: particle.alpha * 0.992
        };
      })
    };
  },
  render: (g, state, ctx) => {
    const size = Math.min(6, Math.max(1, Number(ctx.params.size ?? 2.8)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2.5;
    for (const particle of state.particles) {
      g.globalAlpha = particle.alpha;
      g.beginPath();
      g.arc(particle.x, particle.y, size * particle.scale, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
};
const kernel = {
  kind: "canvas",
  stateful
};
var P01_particle_burst_effect_default = kernel;
`;export{t as default};
