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
var S21_starburst_spin_effect_exports = {};
__export(S21_starburst_spin_effect_exports, {
  default: () => S21_starburst_spin_effect_default
});
module.exports = __toCommonJS(S21_starburst_spin_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rays = Math.min(48, Math.max(12, Math.round(Number(ctx.params.rays ?? 28))));
    const modulation = Math.min(1, Math.max(0, Number(ctx.params.modulation ?? 0.68)));
    const turns = Math.min(4, Math.max(1, Math.round(Number(ctx.params.turns ?? 2))));
    const weight = Math.min(8, Math.max(1, Number(ctx.params.weight ?? 3.5)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const rotation = ctx.t * turns * 360;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "32%", opacity: 0.32, filter: \`grayscale(1) drop-shadow(0 0 8px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", inset: "2%", width: "96%", height: "96%", filter: \`drop-shadow(0 0 \${weight * 2.5}px \${signal})\` } }, /* @__PURE__ */ h("g", { transform: \`rotate(\${rotation} 500 500)\` }, Array.from({ length: rays }, (_, index) => {
      const angle = index / rays * TAU;
      const wave = 0.5 + 0.5 * Math.sin(phase * 2 + index * 1.73);
      const active = wave >= modulation * 0.58;
      const inner = 92 + wave * 34;
      const outer = 300 + wave * 155;
      return /* @__PURE__ */ h(
        "line",
        {
          key: index,
          x1: 500 + Math.cos(angle) * inner,
          y1: 500 + Math.sin(angle) * inner,
          x2: 500 + Math.cos(angle) * outer,
          y2: 500 + Math.sin(angle) * outer,
          stroke: signal,
          strokeWidth: active ? weight : Math.max(0.7, weight * 0.32),
          strokeLinecap: "round",
          opacity: active ? 0.9 : 0.1 + wave * 0.2
        }
      );
    })), /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: 76 + Math.sin(phase * 2) * 8, fill: "none", stroke: signal, strokeWidth: weight * 0.7, opacity: "0.42" })));
  }
};
var S21_starburst_spin_effect_default = kernel;
`;export{t as default};
