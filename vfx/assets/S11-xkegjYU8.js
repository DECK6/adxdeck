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
var S11_boolean_merge_effect_exports = {};
__export(S11_boolean_merge_effect_exports, {
  default: () => S11_boolean_merge_effect_default
});
module.exports = __toCommonJS(S11_boolean_merge_effect_exports);
const smooth = (value) => value * value * (3 - 2 * value);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const separation = Number(ctx.params.separation ?? 0.42);
    const softness = Number(ctx.params.softness ?? 0.35);
    const outline = Boolean(ctx.params.outline ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const operationPosition = cycle * 2;
    const operation = Math.min(2, Math.floor(operationPosition));
    const blend = smooth(operationPosition - operation);
    const offset = 80 + separation * 210;
    const drift = Math.sin(ctx.t * Math.PI * 2) * 38;
    const opacities = [0, 1, 2].map((index) => {
      if (index === operation) return 1 - blend;
      if (index === Math.min(2, operation + 1)) return blend;
      return 0;
    });
    const labels = ["UNION", "DIFFERENCE", "INTERSECTION"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "25%", display: "grid", placeItems: "center", opacity: 0.12 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", inset: "6%", width: "88%", height: "88%" } }, /* @__PURE__ */ h("defs", null, /* @__PURE__ */ h("mask", { id: "s11-union-mask" }, /* @__PURE__ */ h("rect", { width: "1000", height: "1000", fill: "black" }), /* @__PURE__ */ h("circle", { cx: 500 - offset + drift, cy: "500", r: "245", fill: "white" }), /* @__PURE__ */ h("rect", { x: 500 + offset - 235 - drift, y: "265", width: "470", height: "470", rx: "105", fill: "white" })), /* @__PURE__ */ h("mask", { id: "s11-difference-mask" }, /* @__PURE__ */ h("rect", { width: "1000", height: "1000", fill: "black" }), /* @__PURE__ */ h("circle", { cx: 500 - offset + drift, cy: "500", r: "245", fill: "white" }), /* @__PURE__ */ h("rect", { x: 500 + offset - 235 - drift, y: "265", width: "470", height: "470", rx: "105", fill: "black" })), /* @__PURE__ */ h("clipPath", { id: "s11-circle-clip" }, /* @__PURE__ */ h("circle", { cx: 500 - offset + drift, cy: "500", r: "245" })), /* @__PURE__ */ h("mask", { id: "s11-intersection-mask" }, /* @__PURE__ */ h("rect", { width: "1000", height: "1000", fill: "black" }), /* @__PURE__ */ h("rect", { x: 500 + offset - 235 - drift, y: "265", width: "470", height: "470", rx: "105", fill: "white", clipPath: "url(#s11-circle-clip)" }))), ["s11-union-mask", "s11-difference-mask", "s11-intersection-mask"].map((mask, index) => /* @__PURE__ */ h("g", { key: mask, opacity: opacities[index] }, /* @__PURE__ */ h("rect", { width: "1000", height: "1000", fill: signal, mask: \`url(#\${mask})\`, opacity: "0.3" }), /* @__PURE__ */ h(
      "rect",
      {
        width: "1000",
        height: "1000",
        fill: signal,
        mask: \`url(#\${mask})\`,
        opacity: "0.82",
        style: { filter: \`drop-shadow(0 0 \${8 + softness * 28}px \${signal})\` }
      }
    ))), outline && /* @__PURE__ */ h("g", { fill: "none", stroke: signal, strokeWidth: "4", opacity: "0.24", strokeDasharray: "12 14" }, /* @__PURE__ */ h("circle", { cx: 500 - offset + drift, cy: "500", r: "245" }), /* @__PURE__ */ h("rect", { x: 500 + offset - 235 - drift, y: "265", width: "470", height: "470", rx: "105" })), /* @__PURE__ */ h("text", { x: "500", y: "875", fill: "#F4F7F8", textAnchor: "middle", fontSize: "28", fontFamily: "monospace", letterSpacing: "7" }, labels[operation])));
  }
};
var S11_boolean_merge_effect_default = kernel;
`;export{e as default};
