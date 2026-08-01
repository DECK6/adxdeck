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
var R13_dot_matrix_effect_exports = {};
__export(R13_dot_matrix_effect_exports, {
  default: () => R13_dot_matrix_effect_default
});
module.exports = __toCommonJS(R13_dot_matrix_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const spacing = Number(ctx.params.spacing ?? 20);
    const dotSize = Number(ctx.params.dotSize ?? 6);
    const intensity = Number(ctx.params.intensity ?? 0.78);
    const speed = Number(ctx.params.speed ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const scanProgress = ctx.t * speed % 1;
    const scanY = -18 + scanProgress * 136;
    const mask = \`radial-gradient(circle, #000 0 \${dotSize / 2}px, transparent \${dotSize / 2 + 0.8}px)\`;
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          backgroundColor: "#0D0E10",
          backgroundImage: \`radial-gradient(circle, \${signal}22 0 1.5px, transparent 1.8px)\`,
          backgroundSize: \`\${spacing}px \${spacing}px\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            opacity: 0.2 + intensity * 0.34,
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: \`\${spacing}px \${spacing}px\`,
            WebkitMaskSize: \`\${spacing}px \${spacing}px\`
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            clipPath: \`inset(\${scanY - 10}% 0 \${90 - scanY}% 0)\`,
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: \`\${spacing}px \${spacing}px\`,
            WebkitMaskSize: \`\${spacing}px \${spacing}px\`,
            filter: \`brightness(1.8) drop-shadow(0 0 10px \${signal})\`,
            opacity: 0.65 + intensity * 0.35
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: \`\${scanY}%\`,
            height: 3,
            background: signal,
            boxShadow: \`0 0 18px \${signal}, 0 0 48px \${signal}\`,
            opacity: 0.35 + intensity * 0.5
          }
        }
      )
    );
  }
};
var R13_dot_matrix_effect_default = kernel;
`;export{n as default};
