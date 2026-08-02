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
var T28_split_reveal_text_effect_exports = {};
__export(T28_split_reveal_text_effect_exports, {
  default: () => T28_split_reveal_text_effect_default
});
module.exports = __toCommonJS(T28_split_reveal_text_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA VFX");
    const gap = Number(ctx.params.gap ?? 0.24);
    const skew = Number(ctx.params.skew ?? 7);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const lock = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
    const eased = 1 - Math.pow(1 - lock, 3);
    const offset = (1 - eased) * ctx.width * gap;
    const size = Math.max(28, Math.min(ctx.width * 0.12, ctx.height * 0.28));
    const common = { position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#F4F7F8", fontFamily: "Inter, Arial, sans-serif", fontSize: size, fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap" };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 + eased * 0.12 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { "data-layout-allow-overflow": true, "data-layout-allow-overlap": true, style: { ...common, clipPath: "inset(0 0 50% 0)", transform: \`translate3d(\${-offset}px, \${-(1 - eased) * size * 0.16}px, 0) skewX(\${-skew * (1 - eased)}deg)\`, textShadow: \`0 -2px 16px \${signal}70\` } }, phrase), /* @__PURE__ */ h("div", { "data-layout-allow-overflow": true, "data-layout-allow-overlap": true, style: { ...common, clipPath: "inset(50% 0 0 0)", transform: \`translate3d(\${offset}px, \${(1 - eased) * size * 0.16}px, 0) skewX(\${skew * (1 - eased)}deg)\`, textShadow: \`0 2px 16px \${signal}70\` } }, phrase), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", right: "12%", top: "50%", height: 1, background: signal, opacity: 0.18 + (1 - eased) * 0.72, boxShadow: \`0 0 12px \${signal}\`, transform: \`scaleX(\${0.25 + eased * 0.75})\` } }));
  }
};
var T28_split_reveal_text_effect_default = kernel;
`;export{e as default};
