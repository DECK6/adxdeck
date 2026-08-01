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
var U07_modal_spring_effect_exports = {};
__export(U07_modal_spring_effect_exports, {
  default: () => U07_modal_spring_effect_default
});
module.exports = __toCommonJS(U07_modal_spring_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 2))));
    const bounce = Math.max(0.1, Math.min(0.7, Number(ctx.params.bounce ?? 0.42)));
    const size = Math.max(0.45, Math.min(0.82, Number(ctx.params.size ?? 0.64)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame / Math.max(1, ctx.durationInFrames) * Math.PI * 2 * cycles;
    const openness = 0.5 - 0.5 * Math.cos(phase);
    const spring = Math.sin(phase * 3) * Math.sin(Math.PI * openness) * bounce;
    const scale = 0.52 + openness * 0.48 + spring * 0.12;
    const translateY = (1 - openness) * ctx.height * 0.19 - spring * ctx.height * 0.025;
    const modalWidth = Math.min(ctx.width * size, ctx.height * 1.08);
    const modalHeight = Math.min(ctx.height * size, modalWidth * 0.7);
    const radius = Math.max(12, Math.min(ctx.width, ctx.height) * 0.025);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: 0.08 + openness * 0.58
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: modalWidth,
          height: modalHeight,
          transform: \`translate(-50%, -50%) translateY(\${translateY}px) scale(\${scale})\`,
          borderRadius: radius,
          border: \`1px solid \${signal}\`,
          background: "#17191D",
          boxShadow: \`0 \${18 + openness * 24}px \${35 + openness * 50}px #000000CC, 0 0 \${openness * 28}px \${signal}\`,
          opacity: 0.18 + openness * 0.82,
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "13% 18% 25%", opacity: 0.45 + openness * 0.55 } }, ctx.subjectNode),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "14%",
            right: "14%",
            bottom: "12%",
            height: Math.max(8, modalHeight * 0.055),
            borderRadius: 999,
            background: signal,
            transform: \`scaleX(\${0.35 + openness * 0.65})\`,
            transformOrigin: "center",
            opacity: 0.72
          }
        }
      )
    ));
  }
};
var U07_modal_spring_effect_default = kernel;
`;export{n as default};
