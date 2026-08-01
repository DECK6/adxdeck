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
var U04_skeleton_shimmer_effect_exports = {};
__export(U04_skeleton_shimmer_effect_exports, {
  default: () => U04_skeleton_shimmer_effect_default
});
module.exports = __toCommonJS(U04_skeleton_shimmer_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rows = Math.min(7, Math.max(3, Math.round(Number(ctx.params.rows ?? 5))));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const intensity = Math.min(1, Math.max(0.2, Number(ctx.params.intensity ?? 0.72)));
    const rounded = Boolean(ctx.params.rounded ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = ctx.t * cycles % 1;
    const shimmerLeft = -42 + progress * 184;
    const radius = rounded ? Math.max(5, Math.min(ctx.width, ctx.height) * 0.018) : 1;
    const cardWidth = Math.min(ctx.width * 0.72, ctx.height * 1.18);
    const cardHeight = Math.min(ctx.height * 0.74, ctx.width * 0.48);
    const rowHeight = cardHeight * 0.055;
    const rowGap = cardHeight * 0.075;
    const contentLeft = cardWidth * 0.1;
    const rowTop = cardHeight * 0.42;
    const shimmer = (shapeRadius) => /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${shimmerLeft}%\`,
          top: 0,
          bottom: 0,
          width: "42%",
          borderRadius: shapeRadius,
          background: \`linear-gradient(90deg, transparent 0%, \${signal}22 24%, \${signal}AA 50%, \${signal}22 76%, transparent 100%)\`,
          opacity: intensity,
          filter: \`blur(\${Math.max(0.5, ctx.width * 2e-3)}px)\`
        }
      }
    );
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 + intensity * 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: cardWidth,
          height: cardHeight,
          transform: "translate(-50%, -50%)",
          borderRadius: radius * 1.4,
          border: "1px solid #34383F",
          background: "#141619F2",
          boxShadow: "0 18px 50px #00000099",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: contentLeft,
            top: cardHeight * 0.12,
            width: cardHeight * 0.19,
            height: cardHeight * 0.19,
            borderRadius: rounded ? "50%" : radius,
            overflow: "hidden",
            background: "#292D32"
          }
        },
        shimmer(rounded ? cardHeight : radius)
      ),
      [0.46, 0.3].map((widthRatio, index) => /* @__PURE__ */ h(
        "div",
        {
          key: widthRatio,
          style: {
            position: "absolute",
            left: contentLeft + cardHeight * 0.25,
            top: cardHeight * (0.145 + index * 0.1),
            width: cardWidth * widthRatio,
            height: rowHeight,
            borderRadius: radius,
            overflow: "hidden",
            background: "#292D32"
          }
        },
        shimmer(radius)
      )),
      Array.from({ length: rows }, (_, index) => {
        const widthRatio = 0.5 + ctx.random(\`skeleton:\${index}\`) * 0.39;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              left: contentLeft,
              top: rowTop + index * rowGap,
              width: cardWidth * widthRatio,
              height: rowHeight,
              borderRadius: radius,
              overflow: "hidden",
              background: "#292D32"
            }
          },
          shimmer(radius)
        );
      })
    ));
  }
};
var U04_skeleton_shimmer_effect_default = kernel;
`;export{n as default};
