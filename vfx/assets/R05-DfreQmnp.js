const n=`var __defProp = Object.defineProperty;
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
var R05_moire_interference_effect_exports = {};
__export(R05_moire_interference_effect_exports, {
  default: () => R05_moire_interference_effect_default
});
module.exports = __toCommonJS(R05_moire_interference_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rings = Math.min(64, Math.max(18, Math.round(Number(ctx.params.rings ?? 42))));
    const spacing = Math.min(1.45, Math.max(0.65, Number(ctx.params.spacing ?? 1)));
    const motion = Math.min(1, Math.max(0, Number(ctx.params.motion ?? 0.68)));
    const lineWidth = Math.min(2.2, Math.max(0.4, Number(ctx.params.lineWidth ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const minSide = Math.min(ctx.width, ctx.height);
    const gap = minSide / rings * 1.45 * spacing;
    const offset = minSide * (0.035 + motion * 0.1);
    const driftX = Math.cos(phase) * offset;
    const driftY = Math.sin(phase * 2) * offset * 0.42;
    const circleIndexes = Array.from({ length: rings }, (_, index) => index + 1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          filter: "grayscale(1) contrast(1.35)",
          transform: \`scale(\${1.01 + Math.sin(phase) * 0.01})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "svg",
      {
        width: ctx.width,
        height: ctx.height,
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        style: { position: "absolute", inset: 0, mixBlendMode: "screen" }
      },
      /* @__PURE__ */ h("g", { fill: "none", stroke: signal, strokeWidth: lineWidth, opacity: 0.72 }, circleIndexes.map((index) => /* @__PURE__ */ h(
        "circle",
        {
          key: \`a:\${index}\`,
          cx: ctx.width * 0.5 - offset + driftX,
          cy: ctx.height * 0.5 + driftY,
          r: index * gap
        }
      ))),
      /* @__PURE__ */ h("g", { fill: "none", stroke: signal, strokeWidth: lineWidth, opacity: 0.46 }, circleIndexes.map((index) => /* @__PURE__ */ h(
        "circle",
        {
          key: \`b:\${index}\`,
          cx: ctx.width * 0.5 + offset - driftX,
          cy: ctx.height * 0.5 - driftY,
          r: index * gap * 1.006
        }
      )))
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: \`radial-gradient(circle at center, transparent 18%, \${signal}08 64%, #0D0E10B8 100%)\`,
          pointerEvents: "none"
        }
      }
    ));
  }
};
var R05_moire_interference_effect_default = kernel;
`;export{n as default};
