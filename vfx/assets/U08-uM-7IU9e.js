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
var U08_cursor_trace_effect_exports = {};
__export(U08_cursor_trace_effect_exports, {
  default: () => U08_cursor_trace_effect_default
});
module.exports = __toCommonJS(U08_cursor_trace_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const trailCount = Math.max(6, Math.min(18, Math.round(Number(ctx.params.trail ?? 12))));
    const loops = Math.max(1, Math.min(3, Math.round(Number(ctx.params.loops ?? 1))));
    const cursorSize = Math.max(16, Math.min(52, Number(ctx.params.size ?? 32)));
    const spread = Math.max(0.45, Math.min(1, Number(ctx.params.spread ?? 0.82)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2 * loops;
    const radiusX = ctx.width * 0.34 * spread;
    const radiusY = ctx.height * 0.27 * spread;
    const pointAt = (angle) => ({
      x: ctx.width * 0.5 + Math.sin(angle) * radiusX,
      y: ctx.height * 0.5 + Math.sin(angle * 2) * radiusY
    });
    const head = pointAt(phase);
    const tangentX = Math.cos(phase) * radiusX;
    const tangentY = Math.cos(phase * 2) * radiusY * 2;
    const rotation = Math.atan2(tangentY, tangentX) * 180 / Math.PI + 90;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "18%", opacity: 0.13 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: \`0 0 \${ctx.width} \${ctx.height}\`, style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, Array.from({ length: trailCount }, (_, index) => {
      const lag = (index + 1) / trailCount * Math.PI * 0.72;
      const point = pointAt(phase - lag);
      const strength = 1 - index / trailCount;
      return /* @__PURE__ */ h(
        "circle",
        {
          key: index,
          cx: point.x,
          cy: point.y,
          r: 2 + strength * cursorSize * 0.16,
          fill: signal,
          opacity: 0.08 + strength * 0.62
        }
      );
    }), /* @__PURE__ */ h(
      "circle",
      {
        cx: head.x,
        cy: head.y,
        r: cursorSize * 0.52,
        fill: "none",
        stroke: signal,
        strokeWidth: Math.max(2, cursorSize * 0.08),
        opacity: "0.28"
      }
    ), /* @__PURE__ */ h("g", { transform: \`translate(\${head.x} \${head.y}) rotate(\${rotation})\` }, /* @__PURE__ */ h(
      "path",
      {
        d: \`M 0 \${-cursorSize * 0.58} L \${cursorSize * 0.42} \${cursorSize * 0.46} L 0 \${cursorSize * 0.22} L \${-cursorSize * 0.42} \${cursorSize * 0.46} Z\`,
        fill: signal,
        stroke: "#0D0E10",
        strokeWidth: Math.max(1.5, cursorSize * 0.07),
        strokeLinejoin: "round",
        style: { filter: \`drop-shadow(0 0 \${cursorSize * 0.34}px \${signal})\` }
      }
    ))));
  }
};
var U08_cursor_trace_effect_default = kernel;
`;export{t as default};
