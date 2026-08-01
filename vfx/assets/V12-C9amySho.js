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
var V12_sankey_flow_effect_exports = {};
__export(V12_sankey_flow_effect_exports, {
  default: () => V12_sankey_flow_effect_default
});
module.exports = __toCommonJS(V12_sankey_flow_effect_exports);
const cubicPoint = (start, end, t) => {
  const controlA = [start[0] + (end[0] - start[0]) * 0.46, start[1]];
  const controlB = [start[0] + (end[0] - start[0]) * 0.54, end[1]];
  const inverse = 1 - t;
  return {
    x: inverse ** 3 * start[0] + 3 * inverse ** 2 * t * controlA[0] + 3 * inverse * t ** 2 * controlB[0] + t ** 3 * end[0],
    y: inverse ** 3 * start[1] + 3 * inverse ** 2 * t * controlA[1] + 3 * inverse * t ** 2 * controlB[1] + t ** 3 * end[1]
  };
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const density = Math.max(1, Math.min(7, Math.round(Number(ctx.params.density ?? 4))));
    const thickness = Number(ctx.params.thickness ?? 1);
    const glow = Number(ctx.params.glow ?? 0.65);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2;
    const growth = (1 - Math.cos(phase)) * 0.5;
    const nodes = [[105, 365, 32, 270], [105, 690, 32, 150], [484, 255, 32, 215], [484, 585, 32, 280], [862, 365, 32, 205], [862, 665, 32, 190]];
    const flows = [
      { start: [137, 415], end: [484, 315], width: 68 },
      { start: [137, 535], end: [484, 690], width: 112 },
      { start: [137, 735], end: [484, 785], width: 54 },
      { start: [516, 320], end: [862, 420], width: 78 },
      { start: [516, 640], end: [862, 470], width: 62 },
      { start: [516, 755], end: [862, 730], width: 96 }
    ];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "30%", display: "grid", placeItems: "center", opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", inset: "3%", width: "94%", height: "94%" } }, flows.map((flow, index) => {
      const path = \`M \${flow.start[0]} \${flow.start[1]} C \${flow.start[0] + 160} \${flow.start[1]}, \${flow.end[0] - 160} \${flow.end[1]}, \${flow.end[0]} \${flow.end[1]}\`;
      return /* @__PURE__ */ h("g", { key: index }, /* @__PURE__ */ h("path", { d: path, fill: "none", stroke: signal, strokeWidth: Math.max(1, flow.width * thickness * growth), strokeLinecap: "round", opacity: 0.08 + growth * 0.18 }), /* @__PURE__ */ h("path", { d: path, fill: "none", stroke: signal, strokeWidth: 2 + growth * 2, strokeLinecap: "round", opacity: 0.4 + growth * 0.5, style: { filter: \`drop-shadow(0 0 \${glow * 14}px \${signal})\` } }), Array.from({ length: density }, (_, particleIndex) => {
        const t = (ctx.t * (0.8 + index * 0.06) + particleIndex / density + ctx.random(\`flow:\${index}:\${particleIndex}\`) * 0.12) % 1;
        const point = cubicPoint(flow.start, flow.end, t);
        return /* @__PURE__ */ h("circle", { key: particleIndex, cx: point.x, cy: point.y, r: 4 + flow.width * 0.035, fill: "#F4F7F8", opacity: 0.35 + growth * 0.65 });
      }));
    }), nodes.map(([x, y, width, height], index) => /* @__PURE__ */ h("g", { key: index }, /* @__PURE__ */ h("rect", { x, y, width, height, rx: "8", fill: "#0D0E10", stroke: signal, strokeWidth: "4" }), /* @__PURE__ */ h("rect", { x: x + 7, y: y + 7, width: width - 14, height: (height - 14) * (0.25 + growth * 0.75), rx: "3", fill: signal, opacity: "0.72" })))));
  }
};
var V12_sankey_flow_effect_default = kernel;
`;export{t as default};
