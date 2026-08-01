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
var M09_radial_unveil_effect_exports = {};
__export(M09_radial_unveil_effect_exports, {
  default: () => M09_radial_unveil_effect_default
});
module.exports = __toCommonJS(M09_radial_unveil_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? "clockwise");
    const startAngle = Math.min(180, Math.max(-180, Number(ctx.params.startAngle ?? -90)));
    const softness = Math.min(36, Math.max(0, Number(ctx.params.softness ?? 10)));
    const radius = Math.min(76, Math.max(42, Number(ctx.params.radius ?? 64)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const reveal = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const sweep = reveal * 360;
    const solidEdge = Math.max(0, sweep - softness);
    const fromAngle = direction === "counter-clockwise" ? startAngle - sweep : startAngle;
    const headAngle = (direction === "counter-clockwise" ? startAngle - sweep : startAngle + sweep) * Math.PI / 180;
    const mask = \`conic-gradient(from \${fromAngle}deg at 50% 50%, #000 0deg, #000 \${solidEdge}deg, transparent \${sweep}deg, transparent 360deg)\`;
    const orbitRadius = Math.min(ctx.width, ctx.height) * radius / 200;
    const headX = ctx.width * 0.5 + Math.cos(headAngle) * orbitRadius;
    const headY = ctx.height * 0.5 + Math.sin(headAngle) * orbitRadius;
    const pulse = 0.5 - 0.5 * Math.cos(Math.PI * 4 * ctx.t);
    const ringSize = Math.min(ctx.width, ctx.height) * (0.13 + pulse * 0.08);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: \`circle(\${radius}% at 50% 50%)\`,
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
          left: headX,
          top: headY,
          width: 10 + pulse * 8,
          height: 10 + pulse * 8,
          borderRadius: "50%",
          background: signal,
          boxShadow: \`0 0 18px \${signal}\`,
          opacity: 0.42 + reveal * 0.48,
          transform: "translate(-50%, -50%)"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: ringSize,
          height: ringSize,
          border: \`1px solid \${signal}\`,
          borderRadius: "50%",
          opacity: 0.12 + pulse * 0.2,
          transform: "translate(-50%, -50%)"
        }
      }
    ));
  }
};
var M09_radial_unveil_effect_default = kernel;
`;export{e as default};
