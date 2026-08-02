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
var T24_shadow_pop_3d_effect_exports = {};
__export(T24_shadow_pop_3d_effect_exports, {
  default: () => T24_shadow_pop_3d_effect_default
});
module.exports = __toCommonJS(T24_shadow_pop_3d_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "POP");
    const depth = Math.max(4, Math.round(Number(ctx.params.depth ?? 11)));
    const angle = Number(ctx.params.angle ?? -6);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * TAU;
    const pulse = Math.pow(0.5 - 0.5 * Math.cos(phase), 0.42);
    const rotation = angle + Math.sin(phase) * 4;
    const fontSize = Math.max(48, Math.min(ctx.width * 0.25, ctx.height * 0.48));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { "data-layout-allow-overlap": true, style: { position: "absolute", left: "50%", top: "50%", transform: \`translate(-50%, -50%) rotateZ(\${rotation}deg) scale(\${0.58 + pulse * 0.42})\`, transformStyle: "preserve-3d", fontFamily: "Inter, Arial, sans-serif", fontSize, fontWeight: 950, letterSpacing: "-0.08em", whiteSpace: "nowrap" } }, Array.from({ length: depth }, (_, index) => {
      const layer = depth - index;
      return /* @__PURE__ */ h("span", { key: index, "aria-hidden": index !== depth - 1, "data-layout-allow-overlap": true, style: { position: "absolute", left: 0, top: 0, color: index === depth - 1 ? "#F7FAFC" : signal, opacity: index === depth - 1 ? 1 : 0.18 + index / depth * 0.44, transform: \`translate3d(\${layer * pulse * 1.5}px, \${layer * pulse * 1.7}px, \${-layer}px)\`, textShadow: index === depth - 1 ? \`0 0 \${10 + depth}px \${signal}\` : "none" } }, text);
    }), /* @__PURE__ */ h("span", { style: { position: "relative", color: "#F7FAFC", opacity: 0 } }, text)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "26%", right: "26%", bottom: "20%", height: 8, borderRadius: "50%", background: \`radial-gradient(ellipse, \${signal}72, transparent 70%)\`, filter: "blur(4px)", opacity: pulse * 0.65, transform: \`scaleX(\${0.4 + pulse * 0.6})\` } }));
  }
};
var T24_shadow_pop_3d_effect_default = kernel;
`;export{e as default};
