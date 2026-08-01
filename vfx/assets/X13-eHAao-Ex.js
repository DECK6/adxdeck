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
var X13_cube_rotate_effect_exports = {};
__export(X13_cube_rotate_effect_exports, {
  default: () => X13_cube_rotate_effect_default
});
module.exports = __toCommonJS(X13_cube_rotate_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? "left");
    const perspective = Number(ctx.params.perspective ?? 900);
    const shading = Number(ctx.params.shading ?? 0.4);
    const edge = Boolean(ctx.params.edge ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const eased = cycle * cycle * (3 - 2 * cycle);
    const horizontal = direction === "left" || direction === "right";
    const sign = direction === "left" || direction === "up" ? -1 : 1;
    const angle = sign * eased * 90;
    const halfDepth = horizontal ? ctx.width / 2 : ctx.height / 2;
    const cubeTransform = horizontal ? \`rotateY(\${angle}deg)\` : \`rotateX(\${-angle}deg)\`;
    const nextFaceTransform = horizontal ? \`rotateY(\${-sign * 90}deg) translateZ(\${halfDepth}px)\` : \`rotateX(\${sign * 90}deg) translateZ(\${halfDepth}px)\`;
    const shadeDirection = horizontal ? direction === "left" ? "to left" : "to right" : direction === "up" ? "to top" : "to bottom";
    const faceStyle = {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      backfaceVisibility: "hidden",
      border: edge ? \`1px solid \${signal}\` : "none",
      boxSizing: "border-box"
    };
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#0D0E10",
          perspective
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: cubeTransform
          }
        },
        /* @__PURE__ */ h("div", { style: { ...faceStyle, transform: \`translateZ(\${halfDepth}px)\` } }, ctx.subjectNode, /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: \`linear-gradient(\${shadeDirection}, rgba(13,14,16,\${shading * eased}), transparent 70%)\`
            }
          }
        )),
        /* @__PURE__ */ h("div", { style: { ...faceStyle, transform: nextFaceTransform } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, filter: "saturate(1.15) contrast(1.04)" } }, ctx.subjectNode), /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: \`linear-gradient(\${shadeDirection}, transparent 35%, rgba(13,14,16,\${shading * (1 - eased)}))\`
            }
          }
        ))
      )
    );
  }
};
var X13_cube_rotate_effect_default = kernel;
`;export{e as default};
