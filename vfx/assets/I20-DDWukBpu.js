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
var I20_camera_rig_3d_effect_exports = {};
__export(I20_camera_rig_3d_effect_exports, {
  default: () => I20_camera_rig_3d_effect_default
});
module.exports = __toCommonJS(I20_camera_rig_3d_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const orbit = Number(ctx.params.orbit ?? 34);
    const elevation = Number(ctx.params.elevation ?? 18);
    const depth = Number(ctx.params.depth ?? 1);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const unit = Math.min(ctx.width, ctx.height);
    const phase = TAU * speed * ctx.t;
    const yaw = 360 * speed * ctx.t;
    const stage = unit * 0.72;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, perspective: unit * (1.5 / depth), perspectiveOrigin: \`\${50 + orbit * 0.18 * Math.sin(phase)}% \${44 + elevation * 0.18 * Math.cos(phase)}%\` } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "54%",
          width: stage,
          height: stage,
          marginLeft: -stage / 2,
          marginTop: -stage / 2,
          transformStyle: "preserve-3d",
          transform: \`rotateX(\${62 + elevation * Math.sin(phase)}deg) rotateZ(\${yaw}deg)\`
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, border: \`1px solid \${signal}66\`, background: \`repeating-linear-gradient(0deg, transparent 0 \${stage / 10 - 1}px, \${signal}24 \${stage / 10}px), repeating-linear-gradient(90deg, transparent 0 \${stage / 10 - 1}px, \${signal}24 \${stage / 10}px)\` } }),
      [-1, 1].flatMap((x) => [-1, 1].map((y) => /* @__PURE__ */ h("div", { key: \`\${x}:\${y}\`, style: { position: "absolute", left: \`\${50 + x * 34}%\`, top: \`\${50 + y * 34}%\`, width: unit * 0.035, height: unit * 0.035, margin: \`\${-unit * 0.0175}px 0 0 \${-unit * 0.0175}px\`, background: signal, opacity: 0.62, transform: \`translateZ(\${unit * (0.08 + 0.05 * (x + y + 2))}px)\`, boxShadow: \`0 0 \${unit * 0.025}px \${signal}\` } }))),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: "30%", top: "28%", width: "40%", height: "44%", transformStyle: "preserve-3d", transform: \`translateZ(\${unit * 0.2}px) rotateZ(\${-yaw}deg) rotateX(\${-62 - elevation * Math.sin(phase)}deg)\`, filter: \`drop-shadow(0 0 \${unit * 0.025}px \${signal}66)\` } }, ctx.subjectNode)
    )), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "50%", width: unit * 0.22, height: unit * 0.22, margin: \`\${-unit * 0.11}px 0 0 \${-unit * 0.11}px\`, border: \`1px solid \${signal}55\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: -unit * 0.03, width: 1, height: unit * 0.06, background: signal } }), /* @__PURE__ */ h("div", { style: { position: "absolute", top: "50%", left: -unit * 0.03, width: unit * 0.06, height: 1, background: signal } })), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "6%", bottom: "6%", color: signal, fontFamily: "monospace", letterSpacing: "0.16em", opacity: 0.68 } }, "RIG ", Math.round((yaw % 360 + 360) % 360).toString().padStart(3, "0"), "\\xB0"));
  }
};
var I20_camera_rig_3d_effect_default = kernel;
`;export{t as default};
