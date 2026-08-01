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
var M03_text_knockout_effect_exports = {};
__export(M03_text_knockout_effect_exports, {
  default: () => M03_text_knockout_effect_default
});
module.exports = __toCommonJS(M03_text_knockout_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? "horizontal");
    const bandSize = Math.min(64, Math.max(18, Number(ctx.params.bandSize ?? 38)));
    const cycles = Math.min(3, Math.max(1, Number(ctx.params.cycles ?? 1)));
    const ghost = Boolean(ctx.params.ghost ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const sweep = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * ctx.t);
    const horizontal = direction !== "vertical";
    const extent = horizontal ? ctx.width : ctx.height;
    const bandPixels = extent * bandSize / 100;
    const offset = -bandPixels + sweep * (extent + bandPixels);
    const bandStyle = horizontal ? {
      position: "absolute",
      left: offset,
      top: 0,
      width: bandPixels,
      height: ctx.height
    } : {
      position: "absolute",
      left: 0,
      top: offset,
      width: ctx.width,
      height: bandPixels
    };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, ghost ? /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1, filter: "grayscale(1)" } }, ctx.subjectNode) : null, /* @__PURE__ */ h(
      "div",
      {
        style: {
          ...bandStyle,
          overflow: "hidden",
          background: signal,
          boxShadow: \`0 0 \${Math.max(12, extent * 0.035)}px \${signal}\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: horizontal ? -offset : 0,
            top: horizontal ? 0 : -offset,
            width: ctx.width,
            height: ctx.height,
            filter: "brightness(0)",
            opacity: 0.9
          }
        },
        ctx.subjectNode
      )
    ));
  }
};
var M03_text_knockout_effect_default = kernel;
`;export{t as default};
