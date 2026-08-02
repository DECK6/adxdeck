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
var T34_echo_zoom_text_effect_exports = {};
__export(T34_echo_zoom_text_effect_exports, {
  default: () => T34_echo_zoom_text_effect_default
});
module.exports = __toCommonJS(T34_echo_zoom_text_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const echoes = Math.min(9, Math.max(3, Math.round(Number(ctx.params.echoes ?? 6))));
    const zoom = Math.min(0.7, Math.max(0.12, Number(ctx.params.zoom ?? 0.38)));
    const decay = Math.min(0.9, Math.max(0.35, Number(ctx.params.decay ?? 0.68)));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * cycles;
    const travel = 0.5 - 0.5 * Math.cos(phase);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, Array.from({ length: echoes }, (_, index) => {
      const age = (index + travel) / echoes;
      const scale = 1 + age * zoom;
      const opacity = Math.pow(1 - age, 1.35) * Math.pow(decay, index) * 0.72;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            inset: 0,
            opacity,
            color: signal,
            filter: \`drop-shadow(0 0 \${2 + age * 15}px \${signal})\`,
            mixBlendMode: "screen",
            transform: \`scale(\${scale})\`,
            transformOrigin: "center"
          }
        },
        ctx.subjectNode
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          filter: \`drop-shadow(0 0 \${5 + travel * 8}px \${signal})\`
        }
      },
      ctx.subjectNode
    ));
  }
};
var T34_echo_zoom_text_effect_default = kernel;
`;export{e as default};
