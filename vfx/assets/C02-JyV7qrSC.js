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
var C02_ken_burns_effect_exports = {};
__export(C02_ken_burns_effect_exports, {
  default: () => C02_ken_burns_effect_default
});
module.exports = __toCommonJS(C02_ken_burns_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const zoom = Number(ctx.params.zoom ?? 1.25);
    const panX = Number(ctx.params.panX ?? 0);
    const panY = Number(ctx.params.panY ?? 0);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = ctx.t * ctx.t * (3 - 2 * ctx.t);
    const scale = 1 + (zoom - 1) * progress;
    const travelX = panX * ctx.width * 0.09 * progress;
    const travelY = panY * ctx.height * 0.09 * progress;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${travelX}px, \${travelY}px, 0) scale(\${scale})\`,
          transformOrigin: "center"
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 48,
          bottom: 42,
          width: 96 + progress * 160,
          height: 3,
          background: signal,
          opacity: 0.8
        }
      }
    ));
  }
};
var C02_ken_burns_effect_default = kernel;
`;export{e as default};
