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
var S01_stroke_draw_effect_exports = {};
__export(S01_stroke_draw_effect_exports, {
  default: () => S01_stroke_draw_effect_default
});
module.exports = __toCommonJS(S01_stroke_draw_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const thickness = Number(ctx.params.thickness ?? 4);
    const speed = Number(ctx.params.speed ?? 1);
    const glow = Number(ctx.params.glow ?? 0.55);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = ctx.t * speed % 1;
    const progress = cycle < 0.72 ? cycle / 0.72 : 1 - (cycle - 0.72) / 0.28;
    const eased = progress * progress * (3 - 2 * progress);
    const pathLength = 1e3;
    const dashOffset = pathLength * (1 - eased);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.14 + eased * 0.86,
          clipPath: \`inset(\${50 * (1 - eased)}% \${50 * (1 - eased)}%)\`,
          filter: \`drop-shadow(0 0 \${glow * 10}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 1000",
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: "9%", width: "82%", height: "82%" }
      },
      /* @__PURE__ */ h(
        "g",
        {
          fill: "none",
          stroke: signal,
          strokeWidth: thickness,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          pathLength,
          strokeDasharray: pathLength,
          strokeDashoffset: dashOffset,
          style: { filter: \`drop-shadow(0 0 \${3 + glow * 12}px \${signal})\` }
        },
        /* @__PURE__ */ h("path", { d: "M500 112 L838 696 L500 500 Z", pathLength }),
        /* @__PURE__ */ h("path", { d: "M500 500 L162 696 L500 888 Z", pathLength }),
        /* @__PURE__ */ h("path", { d: "M162 696 L500 112 L500 500 Z", pathLength })
      ),
      /* @__PURE__ */ h("circle", { cx: "500", cy: "500", r: 10 + eased * 12, fill: signal, opacity: eased })
    ));
  }
};
var S01_stroke_draw_effect_default = kernel;
`;export{e as default};
