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
var X06_clock_wipe_effect_exports = {};
__export(X06_clock_wipe_effect_exports, {
  default: () => X06_clock_wipe_effect_default
});
module.exports = __toCommonJS(X06_clock_wipe_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const startAngle = Number(ctx.params.startAngle ?? -90);
    const softness = Number(ctx.params.softness ?? 4);
    const direction = String(ctx.params.direction ?? "clockwise");
    const rim = Boolean(ctx.params.rim ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const sweep = progress * 360;
    const signedSweep = direction === "counterclockwise" ? -sweep : sweep;
    const maskStart = direction === "counterclockwise" ? startAngle + signedSweep : startAngle;
    const feather = Math.min(softness, Math.max(0, sweep * 0.45));
    const solidEnd = Math.max(0, sweep - feather);
    const mask = \`conic-gradient(from \${maskStart}deg, #000 0deg, #000 \${solidEnd}deg, transparent \${sweep}deg)\`;
    const radius = Math.hypot(ctx.width, ctx.height) * 0.58;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.16, filter: "saturate(0.35) brightness(0.55)" } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          WebkitMaskImage: mask,
          maskImage: mask
        }
      },
      ctx.subjectNode
    ), rim && progress > 1e-3 && progress < 0.999 ? /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: radius,
          height: 2,
          background: \`linear-gradient(90deg, \${signal}, transparent)\`,
          boxShadow: \`0 0 12px \${signal}\`,
          transformOrigin: "0 50%",
          transform: \`rotate(\${startAngle + signedSweep}deg)\`
        }
      }
    ) : null, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: signal,
          boxShadow: \`0 0 16px \${signal}\`,
          opacity: rim ? 0.9 : 0,
          transform: "translate(-50%, -50%)"
        }
      }
    ));
  }
};
var X06_clock_wipe_effect_default = kernel;
`;export{e as default};
