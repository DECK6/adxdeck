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
var X10_morph_cut_effect_exports = {};
__export(X10_morph_cut_effect_exports, {
  default: () => X10_morph_cut_effect_default
});
module.exports = __toCommonJS(X10_morph_cut_effect_exports);
const ease = (value) => value * value * (3 - 2 * value);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const tension = Number(ctx.params.tension ?? 0.58);
    const edge = Number(ctx.params.edge ?? 5);
    const invert = Boolean(ctx.params.invert ?? false);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const progress = ease(Math.max(0, Math.min(1, cycle)));
    const elastic = progress + Math.sin(progress * Math.PI) * 0.08 * tension;
    const from = invert ? [[390, 245], [610, 245], [760, 390], [760, 610], [610, 755], [390, 755], [240, 610], [240, 390]] : [[0, 0], [1e3, 0], [1e3, 0], [1e3, 1e3], [1e3, 1e3], [0, 1e3], [0, 1e3], [0, 0]];
    const to = invert ? [[0, 0], [1e3, 0], [1e3, 0], [1e3, 1e3], [1e3, 1e3], [0, 1e3], [0, 1e3], [0, 0]] : [[500, 180], [625, 360], [835, 500], [625, 640], [500, 820], [375, 640], [165, 500], [375, 360]];
    const points = from.map(([x, y], index) => {
      const [targetX, targetY] = to[index];
      return [x + (targetX - x) * elastic, y + (targetY - y) * elastic];
    });
    const path = \`\${points.map(([x, y], index) => \`\${index === 0 ? "M" : "L"} \${x.toFixed(2)} \${y.toFixed(2)}\`).join(" ")} Z\`;
    const paperOpacity = invert ? 1 - progress : progress;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "#F5F1E6", opacity: paperOpacity } }), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, /* @__PURE__ */ h("defs", null, /* @__PURE__ */ h("mask", { id: "x10-morph-mask" }, /* @__PURE__ */ h("rect", { width: "1000", height: "1000", fill: "black" }), /* @__PURE__ */ h("path", { d: path, fill: "white" }))), /* @__PURE__ */ h("path", { d: path, fill: "#0D0E10", stroke: signal, strokeWidth: edge, style: { filter: \`drop-shadow(0 0 \${edge * 3}px \${signal})\` } }), /* @__PURE__ */ h("foreignObject", { x: "0", y: "0", width: "1000", height: "1000", mask: "url(#x10-morph-mask)" }, /* @__PURE__ */ h("div", { style: { width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#0D0E10" } }, ctx.subjectNode))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", bottom: "7%", color: paperOpacity > 0.5 ? "#0D0E10" : "#F4F7F8", fontFamily: "monospace", fontSize: 13, letterSpacing: 4 } }, paperOpacity > 0.5 ? "SCENE B / PAPER" : "SCENE A / DARK"));
  }
};
var X10_morph_cut_effect_default = kernel;
`;export{e as default};
