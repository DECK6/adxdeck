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
var M06_brush_stroke_effect_exports = {};
__export(M06_brush_stroke_effect_exports, {
  default: () => M06_brush_stroke_effect_default
});
module.exports = __toCommonJS(M06_brush_stroke_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const bristles = Math.min(12, Math.max(5, Math.round(Number(ctx.params.bristles ?? 8))));
    const roughness = clamp01(Number(ctx.params.roughness ?? 0.58));
    const edgeWidth = Math.min(140, Math.max(24, Number(ctx.params.edgeWidth ?? 72)));
    const direction = String(ctx.params.direction ?? "left-to-right");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const sweep = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const laneHeight = ctx.height / bristles;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.055 + sweep * 0.055 } }, ctx.subjectNode), Array.from({ length: bristles }, (_, index) => {
      const seed = ctx.random(\`bristle:\${index}\`);
      const lag = (index / Math.max(1, bristles - 1) - 0.5) * roughness * 0.18;
      const local = clamp01(sweep + lag + (seed - 0.5) * roughness * 0.08);
      const ragged = (seed - 0.5) * edgeWidth * roughness;
      const revealWidth = Math.max(1, local * (ctx.width + edgeWidth) - edgeWidth + ragged);
      const top = index * laneHeight - laneHeight * roughness * 0.12;
      const height = laneHeight * (1.04 + roughness * (0.18 + seed * 0.12));
      const fromRight = direction === "right-to-left";
      const headX = fromRight ? ctx.width - revealWidth : revealWidth;
      return /* @__PURE__ */ h("div", { key: index }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            top,
            ...fromRight ? { right: 0 } : { left: 0 },
            width: revealWidth,
            height,
            overflow: "hidden",
            transform: \`skewY(\${(seed - 0.5) * roughness * 1.8}deg)\`
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              top: -top,
              ...fromRight ? { right: 0 } : { left: 0 },
              width: ctx.width,
              height: ctx.height
            }
          },
          ctx.subjectNode
        )
      ), /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: headX - edgeWidth * 0.5,
            top: top + height * (0.14 + seed * 0.34),
            width: edgeWidth * (0.45 + seed * 0.5),
            height: Math.max(2, laneHeight * (0.035 + roughness * 0.045)),
            borderRadius: 999,
            background: signal,
            opacity: 0.18 + roughness * 0.42,
            boxShadow: \`0 0 \${6 + roughness * 12}px \${signal}\`,
            transform: \`rotate(\${(seed - 0.5) * 7}deg)\`
          }
        }
      ));
    }));
  }
};
var M06_brush_stroke_effect_default = kernel;
`;export{e as default};
