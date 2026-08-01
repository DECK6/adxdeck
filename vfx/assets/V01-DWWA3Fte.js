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
var V01_bar_race_effect_exports = {};
__export(V01_bar_race_effect_exports, {
  default: () => V01_bar_race_effect_default
});
module.exports = __toCommonJS(V01_bar_race_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const barCount = Math.max(4, Math.min(9, Math.round(Number(ctx.params.bars ?? 6))));
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const spacing = Number(ctx.params.spacing ?? 0.2);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2 * cycles;
    const values = Array.from({ length: barCount }, (_, index) => {
      const base = 0.34 + ctx.random(\`base:\${index}\`) * 0.25;
      const amplitude = 0.18 + ctx.random(\`amp:\${index}\`) * 0.2;
      const offset = ctx.random(\`phase:\${index}\`) * Math.PI * 2;
      const harmonic = 1 + index % 3;
      return Math.max(0.12, Math.min(1, base + Math.sin(phase * harmonic + offset) * amplitude));
    });
    const order = values.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value || a.index - b.index);
    const rankByIndex = new Map(order.map((entry, rank) => [entry.index, rank]));
    const top = ctx.height * 0.14;
    const availableHeight = ctx.height * 0.72;
    const rowHeight = availableHeight / barCount;
    const barHeight = rowHeight * (1 - spacing);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "17%", opacity: 0.1, filter: "grayscale(1)" } }, ctx.subjectNode), values.map((value, index) => {
      const rank = rankByIndex.get(index) ?? index;
      const opacity = 1 - rank * (0.58 / Math.max(1, barCount - 1));
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: "11%",
            top: top + rank * rowHeight,
            width: \`\${24 + value * 62}%\`,
            height: barHeight,
            borderRadius: barHeight * 0.18,
            background: signal,
            opacity,
            boxShadow: rank === 0 ? \`0 0 \${barHeight * 0.8}px \${signal}55\` : "none"
          }
        }
      );
    }));
  }
};
var V01_bar_race_effect_default = kernel;
`;export{e as default};
