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
var M02_gradient_wipe_effect_exports = {};
__export(M02_gradient_wipe_effect_exports, {
  default: () => M02_gradient_wipe_effect_default
});
module.exports = __toCommonJS(M02_gradient_wipe_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? "right");
    const softness = Number(ctx.params.softness ?? 14);
    const glow = Number(ctx.params.glow ?? 0.68);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const reveal = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * ctx.t);
    const travel = -softness + reveal * (100 + softness * 2);
    const start = travel - softness;
    const end = travel + softness;
    const cssDirection = direction === "left" ? "to left" : direction === "down" ? "to bottom" : direction === "up" ? "to top" : "to right";
    const mask = \`linear-gradient(\${cssDirection}, #000 0%, #000 \${start}%, transparent \${end}%, transparent 100%)\`;
    const horizontal = direction === "right" || direction === "left";
    const reverse = direction === "left" || direction === "up";
    const physicalTravel = reverse ? 100 - travel : travel;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h(
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
        style: horizontal ? {
          position: "absolute",
          left: \`\${physicalTravel - softness}%\`,
          top: 0,
          bottom: 0,
          width: \`\${softness * 2}%\`,
          background: \`linear-gradient(to right, transparent, \${signal}, transparent)\`,
          filter: \`blur(\${Math.max(1, softness * 0.12)}px)\`,
          opacity: glow * 0.55
        } : {
          position: "absolute",
          left: 0,
          right: 0,
          top: \`\${physicalTravel - softness}%\`,
          height: \`\${softness * 2}%\`,
          background: \`linear-gradient(to bottom, transparent, \${signal}, transparent)\`,
          filter: \`blur(\${Math.max(1, softness * 0.12)}px)\`,
          opacity: glow * 0.55
        }
      }
    ));
  }
};
var M02_gradient_wipe_effect_default = kernel;
`;export{e as default};
