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
var R21_rose_curves_effect_exports = {};
__export(R21_rose_curves_effect_exports, {
  default: () => R21_rose_curves_effect_default
});
module.exports = __toCommonJS(R21_rose_curves_effect_exports);
const TAU = Math.PI * 2;
const rosePath = (petals, phase, radius, morph) => {
  const segments = 300;
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = index / segments * TAU;
    const primary = Math.cos(petals * angle + phase);
    const secondary = Math.cos((petals + 1) * angle - phase * 0.5);
    const radial = (primary * (1 - morph) + secondary * morph) * radius;
    const x = 500 + Math.cos(angle) * radial;
    const y = 500 + Math.sin(angle) * radial;
    return \`\${index === 0 ? "M" : "L"}\${x.toFixed(2)} \${y.toFixed(2)}\`;
  }).join(" ");
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const petals = Math.min(12, Math.max(3, Math.round(Number(ctx.params.petals ?? 7))));
    const layers = Math.min(7, Math.max(2, Math.round(Number(ctx.params.layers ?? 4))));
    const morph = Math.min(1, Math.max(0, Number(ctx.params.morph ?? 0.72)));
    const weight = Math.min(5, Math.max(0.8, Number(ctx.params.weight ?? 2.2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const blend = morph * (0.5 - 0.5 * Math.cos(phase));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "28%", opacity: 0.28, filter: \`grayscale(1) drop-shadow(0 0 7px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", inset: "3%", width: "94%", height: "94%", filter: \`drop-shadow(0 0 \${weight * 3}px \${signal})\` } }, Array.from({ length: layers }, (_, index) => {
      const ratio = index / Math.max(1, layers - 1);
      const localPhase = phase + ratio * Math.PI;
      return /* @__PURE__ */ h(
        "path",
        {
          key: index,
          d: rosePath(petals, localPhase, 390 - ratio * 62, blend),
          fill: "none",
          stroke: signal,
          strokeWidth: weight * (1 - ratio * 0.35),
          strokeLinejoin: "round",
          opacity: 0.86 - ratio * 0.13,
          transform: \`rotate(\${ratio * 36 + ctx.t * 360 * (index % 2 === 0 ? 1 : -1)} 500 500)\`
        }
      );
    }), /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: "6", fill: signal, opacity: "0.9" })));
  }
};
var R21_rose_curves_effect_default = kernel;
`;export{e as default};
