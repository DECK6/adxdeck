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
var M13_venetian_sweep_effect_exports = {};
__export(M13_venetian_sweep_effect_exports, {
  default: () => M13_venetian_sweep_effect_default
});
module.exports = __toCommonJS(M13_venetian_sweep_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const slats = Math.round(Number(ctx.params.slats ?? 9));
    const angle = Number(ctx.params.angle ?? -12);
    const stagger = Number(ctx.params.stagger ?? 0.48);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1, filter: "grayscale(1)" } }, ctx.subjectNode), Array.from({ length: slats }, (_, index) => {
      const delay = index / Math.max(1, slats - 1) * stagger;
      const local = Math.max(0, Math.min(1, (cycle - delay) / Math.max(0.01, 1 - stagger)));
      const eased = local * local * (3 - 2 * local);
      const top = index * 100 / slats;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", inset: 0, clipPath: \`inset(\${top}% 0 \${100 - top - 100 / slats}% 0)\`, transform: \`translateX(\${(1 - eased) * (index % 2 ? 1 : -1) * 62}%) skewX(\${angle * (1 - eased)}deg)\`, transformOrigin: "center" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: \`\${top}%\`, height: 2, background: signal, opacity: 0.24 + eased * 0.55 } }));
    }));
  }
};
var M13_venetian_sweep_effect_default = kernel;
`;export{e as default};
