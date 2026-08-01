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
var L06_light_leak_effect_exports = {};
__export(L06_light_leak_effect_exports, {
  default: () => L06_light_leak_effect_default
});
module.exports = __toCommonJS(L06_light_leak_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.68);
    const size = Number(ctx.params.size ?? 0.82);
    const drift = Math.max(1, Math.round(Number(ctx.params.drift ?? 1)));
    const source = String(ctx.params.source ?? "left");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * Math.PI * 2 * drift;
    const x = source === "right" ? 108 - Math.cos(phase) * 13 : source === "orbit" ? 50 + Math.cos(phase) * 48 : -8 + Math.cos(phase) * 13;
    const y = 50 + Math.sin(phase) * (source === "orbit" ? 38 : 24);
    const breathe = 0.82 + (0.5 + 0.5 * Math.sin(phase - Math.PI / 2)) * 0.34;
    const width = ctx.width * size * 1.15 * breathe;
    const height = ctx.height * size * 2.4 * breathe;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${x}%\`,
          top: \`\${y}%\`,
          width,
          height,
          transform: \`translate(-50%, -50%) rotate(\${18 + Math.sin(phase) * 12}deg)\`,
          borderRadius: "50%",
          background: \`radial-gradient(ellipse at center, \${signal} 0%, transparent 68%)\`,
          filter: \`blur(\${18 + size * 26}px)\`,
          mixBlendMode: "screen",
          opacity: intensity * 0.72
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${x}%\`,
          top: "-30%",
          width: Math.max(18, width * 0.16),
          height: "160%",
          transform: \`translateX(-50%) rotate(\${8 + Math.cos(phase) * 5}deg)\`,
          background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`,
          filter: \`blur(\${12 + size * 18}px)\`,
          mixBlendMode: "screen",
          opacity: intensity * 0.28
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: \`radial-gradient(circle at \${x}% \${y}%, \${signal} 0%, transparent \${Math.max(24, size * 54)}%)\`,
          mixBlendMode: "screen",
          opacity: intensity * 0.14
        }
      }
    ));
  }
};
var L06_light_leak_effect_default = kernel;
`;export{e as default};
