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
var I01_cube_spin_effect_exports = {};
__export(I01_cube_spin_effect_exports, {
  default: () => I01_cube_spin_effect_default
});
module.exports = __toCommonJS(I01_cube_spin_effect_exports);
const FACE_TRANSFORMS = [
  (depth) => \`translateZ(\${depth}px)\`,
  (depth) => \`rotateY(180deg) translateZ(\${depth}px)\`,
  (depth) => \`rotateY(90deg) translateZ(\${depth}px)\`,
  (depth) => \`rotateY(-90deg) translateZ(\${depth}px)\`,
  (depth) => \`rotateX(90deg) translateZ(\${depth}px)\`,
  (depth) => \`rotateX(-90deg) translateZ(\${depth}px)\`
];
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sizeRatio = Math.min(0.58, Math.max(0.26, Number(ctx.params.size ?? 0.42)));
    const perspective = Number(ctx.params.perspective ?? 880);
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const faceShade = Math.min(0.8, Math.max(0.1, Number(ctx.params.faceShade ?? 0.42)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const size = Math.min(ctx.width * sizeRatio, ctx.height * sizeRatio * 1.7);
    const depth = size / 2;
    const phase = ctx.t * Math.PI * 2 * turns;
    const rotateX = phase;
    const rotateY = phase * 2;
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
          "data-layout-allow-overflow": true,
          "data-layout-allow-overlap": true,
          style: {
            position: "relative",
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            transform: \`rotateX(\${rotateX}rad) rotateY(\${rotateY}rad) rotateZ(\${Math.sin(phase) * 0.08}rad)\`
          }
        },
        FACE_TRANSFORMS.map((faceTransform, index) => /* @__PURE__ */ h(
          "div",
          {
            key: index,
            "data-layout-allow-overflow": true,
            "data-layout-allow-overlap": true,
            "data-layout-allow-occlusion": true,
            style: {
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              boxSizing: "border-box",
              border: \`1px solid \${signal}\`,
              background: "#0D0E10",
              backfaceVisibility: "hidden",
              transform: faceTransform(depth),
              boxShadow: \`inset 0 0 \${size * 0.12}px rgba(0,0,0,\${faceShade}), 0 0 \${size * 0.045}px \${signal}42\`
            }
          },
          /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.5 + index * 0.065 } }, ctx.subjectNode),
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                right: size * 0.045,
                bottom: size * 0.035,
                color: signal,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: Math.max(8, size * 0.055),
                letterSpacing: "0.12em",
                opacity: 0.72
              }
            },
            "F",
            index + 1
          )
        ))
      )
    );
  }
};
var I01_cube_spin_effect_default = kernel;
`;export{e as default};
