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
var P06_snow_fall_effect_exports = {};
__export(P06_snow_fall_effect_exports, {
  default: () => P06_snow_fall_effect_default
});
module.exports = __toCommonJS(P06_snow_fall_effect_exports);
const TAU = Math.PI * 2;
const stateful = {
  init: (ctx) => {
    const count = Math.min(180, Math.max(24, Math.round(Number(ctx.params.count ?? 96))));
    return {
      flakes: Array.from({ length: count }, (_, index) => ({
        baseX: ctx.random(\`s:\${index}:x\`),
        y: ctx.random(\`s:\${index}:y\`),
        fallCycles: 1 + Math.floor(ctx.random(\`s:\${index}:fall\`) * 3),
        swayPhase: ctx.random(\`s:\${index}:phase\`) * TAU,
        swayCycles: 1 + Math.floor(ctx.random(\`s:\${index}:sway\`) * 2),
        swayAmount: 8e-3 + ctx.random(\`s:\${index}:amount\`) * 0.025,
        scale: 0.45 + ctx.random(\`s:\${index}:scale\`) * 1.25,
        alpha: 0.42 + ctx.random(\`s:\${index}:alpha\`) * 0.5
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      flakes: state.flakes.map((flake) => ({
        ...flake,
        y: (flake.y + flake.fallCycles * speed / duration) % 1,
        swayPhase: flake.swayPhase + TAU * flake.swayCycles * speed / duration
      }))
    };
  },
  render: (g, state, ctx) => {
    const wind = Math.min(1, Math.max(-1, Number(ctx.params.wind ?? 0.2)));
    const size = Math.min(6, Math.max(1, Number(ctx.params.size ?? 2.6)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 1.4;
    for (const flake of state.flakes) {
      const x = (flake.baseX + Math.sin(flake.swayPhase) * flake.swayAmount + wind * 0.045 * Math.sin(flake.y * Math.PI) + 1) % 1;
      const radius = size * flake.scale;
      g.globalAlpha = flake.alpha;
      g.beginPath();
      g.arc(x * ctx.width, flake.y * ctx.height, radius, 0, TAU);
      g.fill();
    }
    g.restore();
  }
};
const kernel = {
  kind: "canvas",
  stateful
};
var P06_snow_fall_effect_default = kernel;
`;export{e as default};
