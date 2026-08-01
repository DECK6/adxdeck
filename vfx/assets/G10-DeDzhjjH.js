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
var G10_ghost_echo_effect_exports = {};
__export(G10_ghost_echo_effect_exports, {
  default: () => G10_ghost_echo_effect_default
});
module.exports = __toCommonJS(G10_ghost_echo_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const echoes = Math.max(1, Math.round(Number(ctx.params.echoes ?? 5)));
    const distance = Number(ctx.params.distance ?? 28);
    const spacing = Number(ctx.params.spacing ?? 0.07);
    const decay = Number(ctx.params.decay ?? 0.62);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const positions = Array.from({ length: echoes + 1 }, (_, index) => {
      const echoPhase = phase - index * spacing;
      const angle = echoPhase * Math.PI * 2;
      const depth = index / Math.max(1, echoes);
      return {
        index,
        x: Math.sin(angle) * distance,
        y: Math.sin(angle * 2) * distance * 0.28,
        opacity: index === 0 ? 1 : Math.pow(decay, index) * (0.72 - depth * 0.18)
      };
    });
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, positions.slice().reverse().map((position) => /* @__PURE__ */ h(
      "div",
      {
        key: position.index,
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${position.x}px, \${position.y}px, 0)\`,
          opacity: position.opacity,
          filter: position.index === 0 ? \`drop-shadow(0 0 4px \${signal})\` : \`brightness(\${0.76 + position.opacity * 0.4}) drop-shadow(0 0 \${5 + position.index * 2}px \${signal})\`,
          mixBlendMode: position.index === 0 ? "normal" : "screen"
        }
      },
      ctx.subjectNode
    )));
  }
};
var G10_ghost_echo_effect_default = kernel;
`;export{e as default};
