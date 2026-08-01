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
var V07_heatmap_fill_effect_exports = {};
__export(V07_heatmap_fill_effect_exports, {
  default: () => V07_heatmap_fill_effect_default
});
module.exports = __toCommonJS(V07_heatmap_fill_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const columns = Math.max(6, Math.min(14, Math.round(Number(ctx.params.columns ?? 10))));
    const rows = Math.max(4, Math.min(10, Math.round(Number(ctx.params.rows ?? 7))));
    const trail = Math.max(3, Math.round(Number(ctx.params.trail ?? 10)));
    const gap = Number(ctx.params.gap ?? 6);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const total = columns * rows;
    const phase = ctx.frame % Math.max(1, ctx.durationInFrames) / Math.max(1, ctx.durationInFrames);
    const sweep = phase * total;
    const head = Math.floor(sweep) % total;
    const headRow = Math.floor(head / columns);
    const headColumnRaw = head % columns;
    const headColumn = headRow % 2 === 0 ? headColumnRaw : columns - 1 - headColumnRaw;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "28%", opacity: 0.04 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "12%",
          display: "grid",
          gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
          gridTemplateRows: \`repeat(\${rows}, 1fr)\`,
          gap
        }
      },
      Array.from({ length: total }, (_, visualIndex) => {
        const row = Math.floor(visualIndex / columns);
        const column = visualIndex % columns;
        const order = row * columns + (row % 2 === 0 ? column : columns - 1 - column);
        const age = (sweep - order + total) % total;
        const activity = Math.max(0, 1 - age / trail);
        const base = 0.08 + ctx.random(\`cell:\${visualIndex}\`) * 0.14;
        const scale = 0.72 + activity * 0.28;
        return /* @__PURE__ */ h(
          "div",
          {
            key: visualIndex,
            style: {
              minWidth: 0,
              minHeight: 0,
              border: \`1px solid \${signal}\`,
              background: signal,
              opacity: Math.min(0.96, base + activity * 0.82),
              transform: \`scale(\${scale}) translateY(\${(1 - activity) * 7}px)\`,
              boxShadow: activity > 0.45 ? \`0 0 \${6 + activity * 16}px \${signal}\` : "none"
            }
          }
        );
      })
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`calc(12% + \${(headColumn + 0.5) * (76 / columns)}%)\`,
          top: \`calc(12% + \${(headRow + 0.5) * (76 / rows)}%)\`,
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: \`3px solid \${signal}\`,
          background: "#0D0E10",
          boxShadow: \`0 0 18px \${signal}\`,
          transform: "translate(-50%, -50%)"
        }
      }
    ));
  }
};
var V07_heatmap_fill_effect_default = kernel;
`;export{n as default};
