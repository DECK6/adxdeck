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
var I15_book_flip_effect_exports = {};
__export(I15_book_flip_effect_exports, {
  default: () => I15_book_flip_effect_default
});
module.exports = __toCommonJS(I15_book_flip_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const pages = Math.max(3, Math.min(7, Math.round(Number(ctx.params.pages ?? 5))));
    const spread = Number(ctx.params.spread ?? 0.82);
    const curl = Number(ctx.params.curl ?? 0.58);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const theta = phase * Math.PI * 2;
    const excursion = 0.5 - 0.5 * Math.cos(theta);
    const bookWidth = Math.min(ctx.width * 0.72, ctx.height * 1.08) * spread;
    const bookHeight = bookWidth * 0.62;
    const pageWidth = bookWidth / 2;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.15 } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "70%",
          width: bookWidth * 0.95,
          height: bookHeight * 0.18,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.9), transparent)"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "52%",
          width: bookWidth,
          height: bookHeight,
          transformStyle: "preserve-3d",
          transform: \`translate(-50%, -50%) rotateX(\${56 + Math.sin(theta) * 2}deg) rotateZ(\${Math.sin(theta) * 1.5}deg)\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: "-2%",
            borderRadius: 8,
            background: \`linear-gradient(90deg, #11151A, \${signal}66 49.6%, \${signal}66 50.4%, #11151A)\`,
            border: \`2px solid \${signal}\`,
            transform: "translateZ(-9px)",
            boxShadow: \`0 20px 34px #000000B8, 0 0 16px \${signal}40\`
          }
        }
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: 0, width: pageWidth, height: bookHeight, overflow: "hidden", background: "#E7EEF0" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: 0, width: bookWidth, height: bookHeight, filter: "grayscale(0.7)", opacity: 0.7 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 72%, rgba(0,0,0,0.22))" } })),
      Array.from({ length: pages }, (_, index) => {
        const raw = clamp01(excursion * (pages + 0.75) - index * 0.82);
        const eased = raw * raw * (3 - 2 * raw);
        const rotation = -178 * eased;
        const bend = Math.sin(eased * Math.PI) * curl * 14;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              left: pageWidth,
              top: 0,
              width: pageWidth,
              height: bookHeight,
              transformOrigin: "0% 50%",
              transformStyle: "preserve-3d",
              transform: \`translateZ(\${(pages - index) * 1.2}px) rotateY(\${rotation}deg) rotateZ(\${bend * 0.08}deg)\`
            }
          },
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                backfaceVisibility: "hidden",
                background: "#E7EEF0",
                border: \`1px solid \${signal}66\`,
                boxSizing: "border-box"
              }
            },
            /* @__PURE__ */ h("div", { style: { position: "absolute", left: -pageWidth, top: 0, width: bookWidth, height: bookHeight, opacity: 0.72 } }, ctx.subjectNode),
            /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.2), transparent 24%)" } })
          ),
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: \`repeating-linear-gradient(0deg, #DCE5E7 0 14px, \${signal}55 15px 16px)\`,
                border: \`1px solid \${signal}66\`,
                boxSizing: "border-box"
              }
            }
          )
        );
      }),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: 0,
            width: 3,
            height: "100%",
            transform: "translateX(-50%) translateZ(10px)",
            background: signal,
            boxShadow: \`0 0 12px \${signal}\`
          }
        }
      )
    ));
  }
};
var I15_book_flip_effect_default = kernel;
`;export{n as default};
