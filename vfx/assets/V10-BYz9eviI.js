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
var V10_stacked_grow_effect_exports = {};
__export(V10_stacked_grow_effect_exports, {
  default: () => V10_stacked_grow_effect_default
});
module.exports = __toCommonJS(V10_stacked_grow_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const segmentCount = Math.max(3, Math.min(7, Math.round(Number(ctx.params.segments ?? 5))));
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 1))));
    const spread = Math.max(0.3, Math.min(1, Number(ctx.params.spread ?? 0.72)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2 * cycles;
    const chartLeft = ctx.width * 0.1;
    const chartWidth = ctx.width * 0.8;
    const barHeight = Math.max(30, ctx.height * 0.13);
    const values = Array.from({ length: segmentCount }, (_, index) => {
      const base = 0.62 + ctx.random(\`base:\${index}\`) * 0.42;
      const wave = 0.42 + 0.58 * Math.sin(phase + index / segmentCount * Math.PI * 2);
      return Math.max(0.16, base + wave * spread);
    });
    const total = values.reduce((sum, value) => sum + value, 0);
    const growth = 0.42 + (0.5 - 0.5 * Math.cos(phase)) * 0.52;
    let cursor = chartLeft;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "17%", opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: chartLeft,
          top: ctx.height * 0.5 - barHeight * 0.5,
          width: chartWidth,
          height: barHeight,
          border: "1px solid #34383F",
          borderRadius: barHeight * 0.22,
          background: "#141619",
          overflow: "hidden"
        }
      },
      values.map((value, index) => {
        const width = value / total * chartWidth * growth;
        const left = cursor - chartLeft;
        cursor += width;
        const lift = Math.sin(phase * 2 + index * 1.7) * barHeight * 0.09;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              left,
              top: lift,
              width: Math.max(2, width - 2),
              height: barHeight - lift * 2,
              background: signal,
              opacity: 0.3 + (index + 1) / segmentCount * 0.65,
              boxShadow: index === segmentCount - 1 ? \`0 0 \${barHeight * 0.35}px \${signal}\` : "none"
            }
          }
        );
      })
    ), values.map((value, index) => {
      const width = value / total * chartWidth * growth;
      const x = chartLeft + values.slice(0, index).reduce((sum, entry) => sum + entry / total * chartWidth * growth, 0);
      return /* @__PURE__ */ h(
        "div",
        {
          key: \`cap:\${index}\`,
          style: {
            position: "absolute",
            left: x + width * 0.5 - 3,
            top: ctx.height * 0.5 - barHeight * 0.82 - Math.sin(phase + index) * 9,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: signal,
            opacity: 0.4 + index / segmentCount * 0.5
          }
        }
      );
    }));
  }
};
var V10_stacked_grow_effect_default = kernel;
`;export{t as default};
