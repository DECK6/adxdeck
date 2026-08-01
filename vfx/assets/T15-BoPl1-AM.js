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
var T15_wave_text_effect_exports = {};
__export(T15_wave_text_effect_exports, {
  default: () => T15_wave_text_effect_default
});
module.exports = __toCommonJS(T15_wave_text_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const amplitude = Number(ctx.params.amplitude ?? 16);
    const frequency = Math.max(1, Math.round(Number(ctx.params.frequency ?? 2)));
    const bands = Math.max(2, Math.round(Number(ctx.params.bands ?? 14)));
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * Math.PI * 2 * speed;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, Array.from({ length: bands }, (_, index) => {
      const top = index / bands * 100;
      const bottom = 100 - (index + 1) / bands * 100;
      const bandPhase = index / bands * Math.PI * 2 * frequency;
      const offset = Math.sin(phase + bandPhase) * amplitude;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            inset: 0,
            clipPath: \`inset(\${top}% 0 \${bottom}% 0)\`,
            transform: \`translate3d(0, \${offset}px, 0)\`,
            filter: \`drop-shadow(0 0 \${Math.max(2, amplitude * 0.16)}px \${signal})\`
          }
        },
        ctx.subjectNode
      );
    }));
  }
};
var T15_wave_text_effect_default = kernel;
`;export{e as default};
