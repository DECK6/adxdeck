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
var I03_folding_cube_effect_exports = {};
__export(I03_folding_cube_effect_exports, {
  default: () => I03_folding_cube_effect_default
});
module.exports = __toCommonJS(I03_folding_cube_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sizeRatio = Math.min(0.36, Math.max(0.18, Number(ctx.params.size ?? 0.26)));
    const foldAngle = Math.min(90, Math.max(55, Number(ctx.params.foldAngle ?? 90)));
    const perspective = Number(ctx.params.perspective ?? 980);
    const shade = Math.min(0.8, Math.max(0.1, Number(ctx.params.shade ?? 0.48)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const size = Math.min(ctx.width * sizeRatio, ctx.height * sizeRatio * 1.7);
    const closed = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const angle = closed * foldAngle;
    const viewTurn = closed * 32;
    const faceStyle = {
      position: "absolute",
      width: size,
      height: size,
      overflow: "hidden",
      boxSizing: "border-box",
      border: \`1px solid \${signal}\`,
      background: "#0D0E10",
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
      boxShadow: \`inset 0 0 \${size * 0.11}px rgba(0,0,0,\${shade}), 0 0 \${size * 0.035}px \${signal}35\`
    };
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          background: "#0D0E10",
          perspective
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "relative",
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            transform: \`rotateX(\${-18 * closed}deg) rotateY(\${viewTurn}deg) scale(\${1 - closed * 0.04})\`
          }
        },
        /* @__PURE__ */ h("div", { style: { ...faceStyle, inset: 0 } }, ctx.subjectNode),
        /* @__PURE__ */ h("div", { style: { ...faceStyle, left: -size, top: 0, transformOrigin: "100% 50%", transform: \`rotateY(\${-angle}deg)\` } }, ctx.subjectNode),
        /* @__PURE__ */ h("div", { style: { ...faceStyle, left: size, top: 0, transformOrigin: "0% 50%", transform: \`rotateY(\${angle}deg)\` } }, ctx.subjectNode, /* @__PURE__ */ h(
          "div",
          {
            style: {
              ...faceStyle,
              left: size,
              top: 0,
              transformOrigin: "0% 50%",
              transform: \`rotateY(\${angle}deg)\`
            }
          },
          ctx.subjectNode
        )),
        /* @__PURE__ */ h("div", { style: { ...faceStyle, left: 0, top: -size, transformOrigin: "50% 100%", transform: \`rotateX(\${angle}deg)\` } }, ctx.subjectNode),
        /* @__PURE__ */ h("div", { style: { ...faceStyle, left: 0, top: size, transformOrigin: "50% 0%", transform: \`rotateX(\${-angle}deg)\` } }, ctx.subjectNode)
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: "78%",
            width: size * (1.2 + (1 - closed) * 2.2),
            height: size * 0.22,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))",
            opacity: 0.35 + closed * 0.65
          }
        }
      )
    );
  }
};
var I03_folding_cube_effect_default = kernel;
`;export{e as default};
