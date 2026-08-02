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
var A23_speaker_cone_effect_exports = {};
__export(A23_speaker_cone_effect_exports, {
  default: () => A23_speaker_cone_effect_default
});
module.exports = __toCommonJS(A23_speaker_cone_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const bassGain = Math.min(2.5, Math.max(0.5, Number(ctx.params.bassGain ?? 1.45)));
    const coneDepth = Math.min(1.5, Math.max(0.5, Number(ctx.params.coneDepth ?? 1)));
    const rippleCount = Math.min(7, Math.max(2, Math.round(Number(ctx.params.ripples ?? 4))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bass = (bands[0] + bands[1] + bands[2] * 0.5) / 2.5;
    const impact = clamp01((bass * 0.82 + rms * 0.18) * bassGain);
    const size = Math.min(ctx.width, ctx.height) * 0.72;
    const coneScale = 1 + impact * 0.075 * coneDepth;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#080A0D" } }, Array.from({ length: rippleCount }, (_, index) => {
      const phase = (ctx.t + index / rippleCount) % 1;
      const rippleSize = size * (0.55 + phase * 0.95);
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: rippleSize,
            height: rippleSize,
            borderRadius: "50%",
            border: \`\${1 + impact * 1.5}px solid \${signal}\`,
            opacity: (1 - phase) * (0.05 + impact * 0.34),
            transform: "translate(-50%, -50%)"
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size,
          height: size,
          borderRadius: "50%",
          background: "radial-gradient(circle at 44% 40%, #343B43 0%, #171B20 27%, #090B0E 52%, #323940 64%, #090A0C 70%)",
          border: \`3px solid \${signal}55\`,
          boxShadow: \`0 18px 38px #000000CC, inset 0 0 \${size * 0.12}px #000000, 0 0 \${8 + impact * 24}px \${signal}55\`,
          transform: \`translate(-50%, -50%) scale(\${coneScale})\`
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "15%", borderRadius: "50%", border: \`\${Math.max(4, size * 0.035)}px solid #242A30\`, boxShadow: \`inset 0 0 \${size * 0.12}px #000000\` } }),
      /* @__PURE__ */ h(
        "div",
        {
          "data-layout-allow-overflow": true,
          style: {
            position: "absolute",
            inset: \`\${34 - impact * 2}%\`,
            overflow: "hidden",
            borderRadius: "50%",
            background: signal,
            opacity: 0.42 + impact * 0.42,
            boxShadow: \`0 0 \${8 + impact * 24}px \${signal}\`,
            transform: \`scale(\${1 + impact * 0.13 * coneDepth})\`
          }
        },
        /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.82, transform: "scale(2.2)" } }, ctx.subjectNode)
      )
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: "5%", color: signal, fontFamily: "JetBrains Mono, monospace", fontSize: Math.max(8, ctx.height * 0.042), fontWeight: 800, letterSpacing: "0.18em", opacity: 0.42 + impact * 0.5, transform: "translateX(-50%)" } }, "LOW / ", Math.round(bass * 99).toString().padStart(2, "0")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${8 + ctx.t * 84}%\`, top: "7%", width: 12, height: 12, marginLeft: -6, borderRadius: "50%", background: signal, opacity: 0.56 + impact * 0.4, boxShadow: \`0 0 \${10 + impact * 14}px \${signal}\` } }));
  }
};
var A23_speaker_cone_effect_default = kernel;
`;export{n as default};
