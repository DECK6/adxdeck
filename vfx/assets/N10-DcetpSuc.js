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
var N10_bubble_rise_effect_exports = {};
__export(N10_bubble_rise_effect_exports, {
  default: () => N10_bubble_rise_effect_default
});
module.exports = __toCommonJS(N10_bubble_rise_effect_exports);
function createBubbles(ctx) {
  const count = Math.min(72, Math.max(12, Math.round(Number(ctx.params.count ?? 34))));
  return {
    bubbles: Array.from({ length: count }, (_, index) => ({
      lane: 0.05 + ctx.random(\`bubble:\${index}:lane\`) * 0.9,
      progress: ctx.random(\`bubble:\${index}:progress\`),
      radius: 3 + ctx.random(\`bubble:\${index}:radius\`) * 11,
      phase: ctx.random(\`bubble:\${index}:phase\`) * Math.PI * 2,
      pace: 0.72 + ctx.random(\`bubble:\${index}:pace\`) * 0.56,
      alpha: 0.38 + ctx.random(\`bubble:\${index}:alpha\`) * 0.48
    }))
  };
}
const stateful = {
  init: createBubbles,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createBubbles(ctx);
    const riseSpeed = Math.min(2, Math.max(0.5, Number(ctx.params.riseSpeed ?? 1)));
    return {
      bubbles: state.bubbles.map((bubble) => ({
        ...bubble,
        progress: (bubble.progress + bubble.pace * riseSpeed / ctx.durationInFrames) % 1
      }))
    };
  },
  render: (g, state, ctx) => {
    const wobble = Math.min(1, Math.max(0, Number(ctx.params.wobble ?? 0.55)));
    const size = Math.min(2, Math.max(0.5, Number(ctx.params.size ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.72;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, ctx.width * 8e-3);
    for (const bubble of state.bubbles) {
      const radius = bubble.radius * size;
      const travel = ctx.height + radius * 3;
      const y = ctx.height + radius - bubble.progress * travel;
      const x = bubble.lane * ctx.width + Math.sin(bubble.progress * Math.PI * 4 + bubble.phase) * radius * 2.4 * wobble;
      g.globalAlpha = bubble.alpha;
      g.lineWidth = Math.max(1, radius * 0.14);
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.stroke();
      g.globalAlpha = bubble.alpha * 0.72;
      g.beginPath();
      g.arc(x - radius * 0.32, y - radius * 0.34, Math.max(0.8, radius * 0.16), 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
};
const kernel = { kind: "canvas", stateful };
var N10_bubble_rise_effect_default = kernel;
`;export{e as default};
