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
var G15_frame_drop_effect_exports = {};
__export(G15_frame_drop_effect_exports, {
  default: () => G15_frame_drop_effect_default
});
module.exports = __toCommonJS(G15_frame_drop_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const hold = Math.max(1, Math.round(Number(ctx.params.hold ?? 6)));
    const motion = Number(ctx.params.motion ?? 30);
    const jitter = Number(ctx.params.jitter ?? 6);
    const axis = String(ctx.params.axis ?? "horizontal");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const loopFrame = (ctx.frame % duration + duration) % duration;
    const sampledFrame = Math.floor(loopFrame / hold) * hold;
    const previousFrame = (sampledFrame - hold + duration) % duration;
    const holdProgress = (loopFrame - sampledFrame) / hold;
    const transformAt = (frame) => {
      const phase = frame / duration * Math.PI * 2;
      const offset = Math.sin(phase) * motion + Math.sin(phase * 7) * jitter;
      if (axis === "vertical") return \`translate3d(0, \${offset}px, 0)\`;
      if (axis === "rotate") return \`rotate(\${offset * 0.32}deg) scale(\${1 + Math.abs(offset) * 15e-4})\`;
      return \`translate3d(\${offset}px, 0, 0)\`;
    };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: transformAt(previousFrame),
          opacity: (1 - holdProgress) * 0.28,
          filter: \`brightness(1.25) drop-shadow(0 0 8px \${signal})\`,
          mixBlendMode: "screen"
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: transformAt(sampledFrame),
          filter: \`drop-shadow(0 0 \${2 + (1 - holdProgress) * 5}px \${signal})\`
        }
      },
      ctx.subjectNode
    ));
  }
};
var G15_frame_drop_effect_default = kernel;
`;export{e as default};
