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
var N05_rain_streak_effect_exports = {};
__export(N05_rain_streak_effect_exports, {
  default: () => N05_rain_streak_effect_default
});
module.exports = __toCommonJS(N05_rain_streak_effect_exports);
const stateful = {
  init: (ctx) => {
    const density = Math.min(180, Math.max(24, Math.round(Number(ctx.params.density ?? 110))));
    return {
      drops: Array.from({ length: density }, (_, index) => ({
        baseX: ctx.random(\`r:\${index}:x\`),
        y: ctx.random(\`r:\${index}:y\`),
        fallCycles: 2 + Math.floor(ctx.random(\`r:\${index}:fall\`) * 4),
        scale: 0.55 + ctx.random(\`r:\${index}:scale\`) * 1.15,
        alpha: 0.26 + ctx.random(\`r:\${index}:alpha\`) * 0.58
      }))
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      drops: state.drops.map((drop) => ({
        ...drop,
        y: (drop.y + drop.fallCycles * speed / duration) % 1
      }))
    };
  },
  render: (g, state, ctx) => {
    const slant = Math.min(0.6, Math.max(-0.6, Number(ctx.params.slant ?? -0.18)));
    const length = Math.min(60, Math.max(8, Number(ctx.params.length ?? 28)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.strokeStyle = signal;
    g.lineCap = "round";
    g.shadowColor = signal;
    g.shadowBlur = Math.max(1, ctx.width * 25e-4);
    for (const drop of state.drops) {
      const streakLength = length * drop.scale;
      const x = (drop.baseX + slant * drop.y * 0.14 + 1) % 1;
      const endX = x * ctx.width;
      const endY = drop.y * ctx.height;
      g.globalAlpha = drop.alpha;
      g.lineWidth = Math.max(0.65, drop.scale * 0.9);
      g.beginPath();
      g.moveTo(endX - slant * streakLength, endY - streakLength);
      g.lineTo(endX, endY);
      g.stroke();
    }
    g.restore();
  }
};
const kernel = {
  kind: "canvas",
  stateful
};
var N05_rain_streak_effect_default = kernel;
`;export{n as default};
