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
var V22_slope_chart_effect_exports = {};
__export(V22_slope_chart_effect_exports, {
  default: () => V22_slope_chart_effect_default
});
module.exports = __toCommonJS(V22_slope_chart_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const count = Math.max(4, Math.min(8, Math.round(Number(ctx.params.series ?? 6))));
    const spread = Math.max(0.4, Math.min(1, Number(ctx.params.spread ?? 0.78)));
    const thickness = Math.max(2, Math.min(8, Number(ctx.params.thickness ?? 4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const leftRanks = Array.from({ length: count }, (_, index) => index);
    const rightRanks = [...leftRanks].sort((a, b) => {
      const aScore = ctx.random(\`rank:\${a}\`);
      const bScore = ctx.random(\`rank:\${b}\`);
      return bScore - aScore || a - b;
    });
    const rightRank = new Map(rightRanks.map((index, rank) => [index, rank]));
    const yForRank = (rank) => 150 + rank * (700 / Math.max(1, count - 1)) * spread + (1 - spread) * 350;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F4F7F8", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "22%", opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "13%", right: "13%", top: "9%", display: "flex", justifyContent: "space-between", fontSize: 16, letterSpacing: 4, color: "#B8C0C4" } }, /* @__PURE__ */ h("span", null, "DEXA / A"), /* @__PURE__ */ h("span", null, "VFX / B")), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: { position: "absolute", left: "11%", top: "13%", width: "78%", height: "75%", overflow: "visible" } }, leftRanks.map((seriesIndex) => {
      const y1 = yForRank(seriesIndex);
      const y2 = yForRank(rightRank.get(seriesIndex) ?? seriesIndex);
      const local = Math.max(0, Math.min(1, reveal * 1.4 - seriesIndex * 0.06));
      return /* @__PURE__ */ h("g", { key: seriesIndex, opacity: 0.42 + (seriesIndex === 0 ? 0.58 : 0.32) }, /* @__PURE__ */ h("line", { x1: "130", y1, x2: 130 + 740 * local, y2: y1 + (y2 - y1) * local, stroke: signal, strokeWidth: seriesIndex === 0 ? thickness * 1.5 : thickness, strokeLinecap: "round" }), /* @__PURE__ */ h("circle", { cx: "130", cy: y1, r: thickness * 1.8, fill: signal }), /* @__PURE__ */ h("circle", { cx: 130 + 740 * local, cy: y1 + (y2 - y1) * local, r: thickness * 1.8, fill: signal }), /* @__PURE__ */ h("text", { x: "105", y: y1 + 6, textAnchor: "end", fill: "#F4F7F8", fontSize: "22", fontFamily: "'JetBrains Mono', monospace" }, String(seriesIndex + 1).padStart(2, "0")), /* @__PURE__ */ h("text", { x: "895", y: y2 + 6, fill: "#F4F7F8", fontSize: "22", fontFamily: "'JetBrains Mono', monospace", opacity: local }, String((rightRank.get(seriesIndex) ?? 0) + 1).padStart(2, "0")));
    })));
  }
};
var V22_slope_chart_effect_default = kernel;
`;export{e as default};
