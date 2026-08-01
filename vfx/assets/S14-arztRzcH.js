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
var S14_concentric_pulse_effect_exports = {};
__export(S14_concentric_pulse_effect_exports, {
  default: () => S14_concentric_pulse_effect_default
});
module.exports = __toCommonJS(S14_concentric_pulse_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const ringCount = Math.max(3, Math.round(Number(ctx.params.rings ?? 7)));
    const spread = Number(ctx.params.spread ?? 0.86);
    const thickness = Number(ctx.params.thickness ?? 3);
    const intensity = Number(ctx.params.intensity ?? 0.78);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % ctx.durationInFrames / ctx.durationInFrames;
    const maxRadius = Math.SQRT1_2 * 1e3 * spread;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "xMidYMid slice", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, Array.from({ length: ringCount }, (_, index) => {
      const local = (phase + index / ringCount) % 1;
      const envelope = Math.pow(Math.sin(local * Math.PI), 1.35) * intensity;
      const radius = 22 + local * maxRadius;
      return /* @__PURE__ */ h(
        "circle",
        {
          key: index,
          cx: "500",
          cy: "500",
          r: radius,
          fill: "none",
          stroke: signal,
          strokeWidth: thickness * (1 - local * 0.55),
          opacity: envelope,
          style: { filter: \`drop-shadow(0 0 \${4 + thickness * 2}px \${signal})\` }
        }
      );
    }), /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: 14 + Math.sin(phase * Math.PI * 2) * 3, fill: signal, opacity: 0.45 + intensity * 0.35 })), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", filter: \`drop-shadow(0 0 \${8 + intensity * 12}px \${signal})\` } }, ctx.subjectNode));
  }
};
var S14_concentric_pulse_effect_default = kernel;
`;export{e as default};
