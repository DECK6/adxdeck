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
var H11_bubble_column_effect_exports = {};
__export(H11_bubble_column_effect_exports, {
  default: () => H11_bubble_column_effect_default
});
module.exports = __toCommonJS(H11_bubble_column_effect_exports);
const TAU = Math.PI * 2;
function makeState(ctx) {
  const count = Math.min(72, Math.max(18, Math.round(Number(ctx.params.count ?? 42))));
  return {
    bubbles: Array.from({ length: count }, (_, index) => ({
      x: ctx.random(\`bubble:\${index}:x\`) * 2 - 1,
      y: ctx.random(\`bubble:\${index}:y\`),
      radius: 2 + ctx.random(\`bubble:\${index}:radius\`) * 9,
      phase: ctx.random(\`bubble:\${index}:phase\`) * TAU,
      swayCycles: 1 + Math.floor(ctx.random(\`bubble:\${index}:sway\`) * 3),
      riseCycles: 1 + Math.floor(ctx.random(\`bubble:\${index}:rise\`) * 2),
      alpha: 0.22 + ctx.random(\`bubble:\${index}:alpha\`) * 0.48
    }))
  };
}
const stateful = {
  init: makeState,
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const lift = Math.min(4, Math.max(1, Math.round(Number(ctx.params.lift ?? 2))));
    return {
      bubbles: state.bubbles.map((bubble) => ({
        ...bubble,
        y: (bubble.y - bubble.riseCycles * lift / duration + 1) % 1,
        phase: (bubble.phase + TAU * bubble.swayCycles / duration) % TAU
      }))
    };
  },
  render: (g, state, ctx) => {
    const spread = Math.min(0.7, Math.max(0.15, Number(ctx.params.spread ?? 0.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#071116";
    g.fillRect(0, 0, ctx.width, ctx.height);
    const column = g.createLinearGradient(0, 0, ctx.width, 0);
    column.addColorStop(0, "transparent");
    column.addColorStop(0.5, \`\${signal}12\`);
    column.addColorStop(1, "transparent");
    g.fillStyle = column;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = 7;
    for (const bubble of state.bubbles) {
      const edgeFade = Math.min(1, bubble.y * 9, (1 - bubble.y) * 9);
      const x = ctx.width * (0.5 + bubble.x * spread + Math.sin(bubble.phase) * 0.035);
      const y = bubble.y * ctx.height;
      g.globalAlpha = bubble.alpha * Math.max(0, edgeFade);
      g.lineWidth = Math.max(0.7, bubble.radius * 0.12);
      g.beginPath();
      g.arc(x, y, bubble.radius, 0, TAU);
      g.stroke();
      g.globalAlpha *= 0.72;
      g.beginPath();
      g.arc(x - bubble.radius * 0.3, y - bubble.radius * 0.3, Math.max(0.7, bubble.radius * 0.13), 0, TAU);
      g.fill();
    }
    g.restore();
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.27;
      const insetX = ctx.width * 0.16;
      const insetY = ctx.height * 0.16;
      g.drawImage(ctx.subject.bitmap, insetX, insetY, ctx.width - insetX * 2, ctx.height - insetY * 2);
      g.restore();
    }
  }
};
const kernel = { kind: "canvas", stateful };
var H11_bubble_column_effect_default = kernel;
`;export{e as default};
