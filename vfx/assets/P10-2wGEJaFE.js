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
var P10_orbit_ring_effect_exports = {};
__export(P10_orbit_ring_effect_exports, {
  default: () => P10_orbit_ring_effect_default
});
module.exports = __toCommonJS(P10_orbit_ring_effect_exports);
const TAU = Math.PI * 2;
const stateful = {
  init: (ctx) => {
    const count = Math.min(120, Math.max(16, Math.round(Number(ctx.params.count ?? 64))));
    const rings = Math.min(4, Math.max(1, Math.round(Number(ctx.params.rings ?? 3))));
    return {
      orbiters: Array.from({ length: count }, (_, index) => ({
        angle: ctx.random(\`o:\${index}:angle\`) * TAU,
        ring: index % rings,
        direction: index % 2 === 0 ? 1 : -1,
        scale: 0.55 + ctx.random(\`o:\${index}:scale\`) * 1.2,
        alpha: 0.42 + ctx.random(\`o:\${index}:alpha\`) * 0.56
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      orbiters: state.orbiters.map((orbiter) => ({
        ...orbiter,
        angle: (orbiter.angle + orbiter.direction * (TAU * speed) / duration + TAU) % TAU
      }))
    };
  },
  render: (g, state, ctx) => {
    const ringCount = Math.min(4, Math.max(1, Math.round(Number(ctx.params.rings ?? 3))));
    const radius = Math.min(0.48, Math.max(0.2, Number(ctx.params.radius ?? 0.36)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const base = Math.min(ctx.width, ctx.height) * radius;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, base * 0.035);
    for (const orbiter of state.orbiters) {
      const ring = orbiter.ring % ringCount;
      const ringRadius = base * (0.58 + ring / Math.max(1, ringCount - 1) * 0.42);
      const tilt = -0.52 + ring / Math.max(1, ringCount - 1) * 1.04;
      const x = ctx.width * 0.5 + Math.cos(orbiter.angle) * ringRadius;
      const y = ctx.height * 0.5 + Math.sin(orbiter.angle) * ringRadius * (0.36 + Math.abs(tilt) * 0.34) + Math.cos(orbiter.angle) * tilt * ringRadius * 0.18;
      const depth = 0.55 + 0.45 * (Math.sin(orbiter.angle) * 0.5 + 0.5);
      const particleSize = Math.max(1.2, base * 0.018 * orbiter.scale * depth);
      g.globalAlpha = orbiter.alpha * depth;
      g.beginPath();
      g.arc(x, y, particleSize, 0, TAU);
      g.fill();
    }
    g.restore();
  }
};
const kernel = { kind: "canvas", stateful };
var P10_orbit_ring_effect_default = kernel;
`;export{t as default};
