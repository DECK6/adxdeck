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
var M05_spotlight_mask_effect_exports = {};
__export(M05_spotlight_mask_effect_exports, {
  default: () => M05_spotlight_mask_effect_default
});
module.exports = __toCommonJS(M05_spotlight_mask_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const radius = Math.min(42, Math.max(12, Number(ctx.params.radius ?? 24)));
    const travel = Math.min(34, Math.max(0, Number(ctx.params.travel ?? 24)));
    const softness = Math.min(18, Math.max(2, Number(ctx.params.softness ?? 8)));
    const path = String(ctx.params.path ?? "orbit");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const angle = Math.PI * 2 * ctx.t;
    const xWave = Math.sin(angle);
    const yWave = path === "sweep" ? Math.sin(angle * 2) * 0.16 : path === "figure-eight" ? Math.sin(angle * 2) * 0.72 : Math.cos(angle) * 0.72;
    const centerX = 50 + travel * xWave;
    const centerY = 50 + travel * yWave;
    const innerRadius = Math.max(0, radius - softness);
    const mask = \`radial-gradient(circle at \${centerX}% \${centerY}%, #000 0%, #000 \${innerRadius}%, transparent \${radius}%)\`;
    const diameter = Math.min(ctx.width, ctx.height) * radius * 0.02;
    const breathing = 1 + 0.055 * Math.sin(angle * 2);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          maskImage: mask,
          WebkitMaskImage: mask
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${centerX}%\`,
          top: \`\${centerY}%\`,
          width: diameter,
          height: diameter,
          border: \`2px solid \${signal}\`,
          borderRadius: "50%",
          boxShadow: \`0 0 \${Math.max(12, diameter * 0.28)}px \${signal}, inset 0 0 \${Math.max(8, diameter * 0.16)}px \${signal}\`,
          opacity: 0.44,
          transform: \`translate(-50%, -50%) scale(\${breathing})\`
        }
      }
    ));
  }
};
var M05_spotlight_mask_effect_default = kernel;
`;export{e as default};
