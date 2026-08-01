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
var P04_dust_motes_effect_exports = {};
__export(P04_dust_motes_effect_exports, {
  default: () => P04_dust_motes_effect_default
});
module.exports = __toCommonJS(P04_dust_motes_effect_exports);
const TAU = Math.PI * 2;
const stateful = {
  init: (ctx) => {
    const count = Math.min(96, Math.max(16, Math.round(Number(ctx.params.count ?? 52))));
    return {
      motes: Array.from({ length: count }, (_, index) => ({
        anchorX: ctx.random(\`m:\${index}:x\`),
        anchorY: ctx.random(\`m:\${index}:y\`),
        radiusX: 0.018 + ctx.random(\`m:\${index}:rx\`) * 0.055,
        radiusY: 0.012 + ctx.random(\`m:\${index}:ry\`) * 0.045,
        phase: ctx.random(\`m:\${index}:phase\`) * TAU,
        phaseOffset: ctx.random(\`m:\${index}:offset\`) * TAU,
        cycles: 1 + Math.floor(ctx.random(\`m:\${index}:cycles\`) * 2),
        scale: 0.45 + ctx.random(\`m:\${index}:scale\`) * 1.15,
        alpha: 0.22 + ctx.random(\`m:\${index}:alpha\`) * 0.56
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    return {
      motes: state.motes.map((mote) => ({
        ...mote,
        phase: mote.phase + TAU * mote.cycles / duration
      }))
    };
  },
  render: (g, state, ctx) => {
    const drift = Math.min(1.5, Math.max(0.2, Number(ctx.params.drift ?? 0.65)));
    const size = Math.min(4, Math.max(0.5, Number(ctx.params.size ?? 1.8)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2.2;
    for (const mote of state.motes) {
      const x = (mote.anchorX + Math.sin(mote.phase) * mote.radiusX * drift + 1) % 1;
      const y = (mote.anchorY + Math.cos(mote.phase + mote.phaseOffset) * mote.radiusY * drift + 1) % 1;
      const shimmer = 0.62 + 0.38 * Math.sin(mote.phase * 2 + mote.phaseOffset);
      g.globalAlpha = mote.alpha * shimmer;
      g.beginPath();
      g.arc(x * ctx.width, y * ctx.height, size * mote.scale, 0, TAU);
      g.fill();
    }
    g.restore();
  }
};
const kernel = {
  kind: "canvas",
  stateful
};
var P04_dust_motes_effect_default = kernel;
`;export{t as default};
