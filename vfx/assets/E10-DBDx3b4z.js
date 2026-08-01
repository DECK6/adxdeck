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
var E10_vignette_breathe_effect_exports = {};
__export(E10_vignette_breathe_effect_exports, {
  default: () => E10_vignette_breathe_effect_default
});
module.exports = __toCommonJS(E10_vignette_breathe_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.68);
    const softness = Number(ctx.params.softness ?? 0.58);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2 * cycles;
    const breath = 0.5 - Math.cos(phase) * 0.5;
    const innerStop = 30 + softness * 28 - breath * 5;
    const edgeOpacity = intensity * (0.72 + breath * 0.28);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`scale(\${1 + breath * 0.018})\`,
          filter: \`brightness(\${1 - breath * intensity * 0.08})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: \`radial-gradient(ellipse at center, transparent \${innerStop}%, rgba(13, 14, 16, \${edgeOpacity * 0.2}) \${innerStop + 18}%, rgba(13, 14, 16, \${edgeOpacity}) 100%)\`,
          boxShadow: \`inset 0 0 \${24 + softness * 96}px \${signal}18\`
        }
      }
    ));
  }
};
var E10_vignette_breathe_effect_default = kernel;
`;export{e as default};
