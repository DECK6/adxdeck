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
var C04_dolly_zoom_effect_exports = {};
__export(C04_dolly_zoom_effect_exports, {
  default: () => C04_dolly_zoom_effect_default
});
module.exports = __toCommonJS(C04_dolly_zoom_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const depth = Number(ctx.params.depth ?? 1.25);
    const vignette = Number(ctx.params.vignette ?? 0.62);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const turn = ctx.t * Math.PI * 2;
    const travel = (1 - Math.cos(turn)) * 0.5;
    const environmentScale = 1 + travel * intensity * depth * 1.45;
    const subjectScale = 1 + Math.sin(turn) * intensity * 0.025;
    const subjectDepth = -travel * intensity * ctx.width * 0.035;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "-18%",
          opacity: 0.16 + intensity * 0.2,
          backgroundImage: \`repeating-radial-gradient(ellipse at center, transparent 0 9%, \${signal} 9.25% 9.45%, transparent 9.7% 18%)\`,
          transform: \`scale(\${environmentScale})\`,
          transformOrigin: "center"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          transform: \`translate3d(0, 0, \${subjectDepth}px) scale(\${subjectScale})\`,
          filter: \`drop-shadow(0 0 \${8 + travel * 18 * intensity}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: \`radial-gradient(ellipse at center, transparent \${42 - vignette * 10}%, #0D0E10 \${86 - vignette * 20}%)\`,
          opacity: 0.35 + vignette * 0.55
        }
      }
    ));
  }
};
var C04_dolly_zoom_effect_default = kernel;
`;export{e as default};
