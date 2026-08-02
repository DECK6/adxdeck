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
var U21_chart_tooltip_effect_exports = {};
__export(U21_chart_tooltip_effect_exports, {
  default: () => U21_chart_tooltip_effect_default
});
module.exports = __toCommonJS(U21_chart_tooltip_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const count = Math.max(5, Math.min(10, Math.round(Number(ctx.params.points ?? 8))));
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 1))));
    const amplitude = Math.max(0.35, Math.min(1, Number(ctx.params.amplitude ?? 0.72)));
    const panel = String(ctx.params.panel ?? "compact");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const left = ctx.width * 0.17;
    const top = ctx.height * 0.2;
    const width = ctx.width * 0.66;
    const height = ctx.height * 0.56;
    const values = Array.from({ length: count }, (_, index) => 0.18 + ctx.random(\`chart:\${index}\`) * 0.7);
    const path = values.map((value2, index) => {
      const x2 = left + index / (count - 1) * width;
      const y2 = top + height * (0.85 - value2 * amplitude);
      return \`\${index === 0 ? "M" : "L"} \${x2} \${y2}\`;
    }).join(" ");
    const travel = 0.5 - 0.5 * Math.cos(ctx.t * Math.PI * 2 * cycles);
    const scaled = travel * (count - 1);
    const lower = Math.min(count - 2, Math.floor(scaled));
    const mix = scaled - lower;
    const value = values[lower] + (values[lower + 1] - values[lower]) * mix;
    const x = left + travel * width;
    const y = top + height * (0.85 - value * amplitude);
    const tooltipWidth = panel === "wide" ? ctx.width * 0.24 : ctx.width * 0.18;
    const tooltipLeft = Math.min(ctx.width - tooltipWidth - ctx.width * 0.04, Math.max(ctx.width * 0.04, x - tooltipWidth * 0.5));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F4FAFB", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "17%", top: "11%", color: "#D7E1E4", fontSize: Math.max(8, ctx.width * 0.011), letterSpacing: "0.14em" } }, "DEXA VFX / SIGNAL INDEX"), /* @__PURE__ */ h("svg", { viewBox: \`0 0 \${ctx.width} \${ctx.height}\`, style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ h("line", { key: index, x1: left, x2: left + width, y1: top + height * index / 4, y2: top + height * index / 4, stroke: "#D9F8FC", strokeOpacity: "0.1" })), /* @__PURE__ */ h("path", { d: \`\${path} L \${left + width} \${top + height} L \${left} \${top + height} Z\`, fill: \`\${signal}14\` }), /* @__PURE__ */ h("path", { d: path, fill: "none", stroke: signal, strokeWidth: Math.max(2, ctx.width * 3e-3), strokeLinejoin: "round", style: { filter: \`drop-shadow(0 0 7px \${signal})\` } }), /* @__PURE__ */ h("line", { x1: x, x2: x, y1: top, y2: top + height, stroke: signal, strokeDasharray: "4 5", strokeOpacity: "0.65" }), /* @__PURE__ */ h("line", { x1: left, x2: left + width, y1: y, y2: y, stroke: signal, strokeDasharray: "4 5", strokeOpacity: "0.3" }), /* @__PURE__ */ h("circle", { cx: x, cy: y, r: Math.max(5, ctx.width * 7e-3), fill: "#0D0E10", stroke: signal, strokeWidth: "3" })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: tooltipLeft, top: Math.max(ctx.height * 0.08, y - ctx.height * 0.19), width: tooltipWidth, padding: "2.2% 2.6%", boxSizing: "border-box", border: \`1px solid \${signal}\`, borderRadius: 8, background: "#151A1DEB", boxShadow: \`0 10px 28px #00000099, 0 0 18px \${signal}22\`, fontSize: Math.max(7, ctx.width * 0.01) } }, /* @__PURE__ */ h("div", { style: { color: signal, letterSpacing: "0.12em", marginBottom: "0.55em" } }, "FRAME ", String(Math.round(travel * 180)).padStart(3, "0")), /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "space-between", color: "#FFFFFF" } }, /* @__PURE__ */ h("span", null, "DEXA VFX"), /* @__PURE__ */ h("span", null, Math.round(value * 100), "%"))));
  }
};
var U21_chart_tooltip_effect_default = kernel;
`;export{t as default};
