const t=`var __defProp = Object.defineProperty;
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
var O29_soft_body_land_effect_exports = {};
__export(O29_soft_body_land_effect_exports, {
  default: () => O29_soft_body_land_effect_default
});
module.exports = __toCommonJS(O29_soft_body_land_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const height = Number(ctx.params.height ?? 0.34) * ctx.height;
    const softness = Number(ctx.params.softness ?? 0.42);
    const damping = Number(ctx.params.damping ?? 5.8);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const u = (ctx.t * 2 % 1 + 1) % 1;
    const flightEnd = 0.44;
    const airborne = u < flightEnd;
    const flight = Math.min(1, u / flightEnd);
    const lift = airborne ? height * 4 * flight * (1 - flight) : 0;
    const recovery = airborne ? 0 : (u - flightEnd) / (1 - flightEnd);
    const ring = airborne ? 0 : softness * Math.exp(-damping * recovery) * Math.pow(1 - recovery, 2) * Math.cos(TAU * 2.25 * recovery);
    const scaleY = 1 - ring;
    const scaleX = 1 / Math.sqrt(Math.max(0.35, scaleY));
    const ground = ctx.height * 0.76;
    const bodyW = ctx.width * 0.44;
    const bodyH = ctx.height * 0.4;
    const contact = airborne ? 0 : Math.min(1, recovery / 0.3);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "10%", right: "10%", top: ground, height: 1, background: \`\${signal}66\` } }), !airborne ? [0, 0.08, 0.16].map((delay, index) => {
      const age = Math.max(0, recovery - delay);
      const spread = Math.min(1, age * 2.2);
      const width = bodyW * (0.45 + spread * 1.5);
      return /* @__PURE__ */ h("div", { key: delay, style: { position: "absolute", left: "50%", top: ground, width, height: width * 0.16, marginLeft: -width / 2, marginTop: -width * 0.08, border: \`1px solid \${signal}\`, borderRadius: "50%", opacity: (1 - spread) * (0.58 - index * 0.12) * contact } });
    }) : null, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: ground, width: bodyW * (0.46 + contact * Math.max(0, ring) * 1.2), height: ctx.height * 0.035, transform: "translate(-50%, -50%)", borderRadius: "50%", background: \`radial-gradient(closest-side, \${signal}66, transparent)\`, opacity: 0.35 + contact * 0.32 } }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: (ctx.width - bodyW) / 2,
          top: ground - bodyH,
          width: bodyW,
          height: bodyH,
          transform: \`translate3d(0, \${-lift}px, 0) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "center bottom",
          borderRadius: \`\${Math.max(4, bodyH * (0.08 + Math.max(0, ring) * 0.3))}px\`,
          overflow: "hidden",
          filter: \`drop-shadow(0 0 \${6 + Math.abs(ring) * 34}px \${signal}66)\`
        }
      },
      ctx.subjectNode,
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: \`radial-gradient(ellipse at 50% 100%, \${signal}\${Math.round(Math.min(0.45, Math.abs(ring)) * 255).toString(16).padStart(2, "0")}, transparent 58%)\`, mixBlendMode: "screen" } })
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "6%", bottom: "6%", color: signal, fontFamily: "monospace", letterSpacing: "0.16em", opacity: 0.7 } }, "VOLUME ", Math.round(scaleX * scaleX * scaleY * 100), "%"));
  }
};
var O29_soft_body_land_effect_default = kernel;
`;export{t as default};
