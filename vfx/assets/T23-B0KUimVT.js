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
var T23_liquid_fill_text_effect_exports = {};
__export(T23_liquid_fill_text_effect_exports, {
  default: () => T23_liquid_fill_text_effect_default
});
module.exports = __toCommonJS(T23_liquid_fill_text_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "LIQUID");
    const level = Number(ctx.params.level ?? 0.86);
    const wave = Number(ctx.params.wave ?? 10);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * TAU * speed;
    const fill = (0.5 - 0.5 * Math.cos(phase)) * level;
    const surface = 100 - fill * 94;
    const fontSize = Math.max(34, Math.min(ctx.width * 0.86 / Math.max(4, text.length * 0.62), ctx.height * 0.42));
    const textStyle = { position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "Inter, Arial, sans-serif", fontSize, fontWeight: 900, letterSpacing: "-0.05em", whiteSpace: "nowrap" };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", right: "7%", top: "28%", bottom: "28%" } }, /* @__PURE__ */ h(
      "div",
      {
        "aria-hidden": "true",
        "data-layout-allow-overlap": true,
        "data-layout-allow-occlusion": true,
        style: { ...textStyle, color: "#0D0E10", WebkitTextFillColor: "#0D0E10", WebkitTextStroke: \`2px \${signal}80\`, textShadow: \`0 0 \${wave}px \${signal}24\` }
      },
      text
    ), /* @__PURE__ */ h(
      "div",
      {
        "data-layout-allow-overlap": true,
        "data-layout-allow-occlusion": true,
        style: {
          ...textStyle,
          color: signal,
          clipPath: \`inset(\${surface}% 0 0 0)\`,
          filter: \`drop-shadow(0 0 \${wave * 1.2}px \${signal})\`
        }
      },
      text
    )), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "22%", right: "22%", bottom: "20%", height: 2, background: signal, opacity: 0.22 + fill * 0.45, transform: \`scaleX(\${0.35 + fill * 0.65})\`, boxShadow: \`0 0 \${wave}px \${signal}\` } }));
  }
};
var T23_liquid_fill_text_effect_default = kernel;
`;export{t as default};
