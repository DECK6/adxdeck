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
var T10_highlight_sweep_effect_exports = {};
__export(T10_highlight_sweep_effect_exports, {
  default: () => T10_highlight_sweep_effect_default
});
module.exports = __toCommonJS(T10_highlight_sweep_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "MAKE MOTION VISIBLE");
    const duration = Math.max(0.01, Number(ctx.params.duration ?? 0.42));
    const thickness = Number(ctx.params.thickness ?? 0.72);
    const direction = String(ctx.params.direction ?? "left");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const raw = Math.min(1, Math.max(0, (ctx.t - 0.12) / duration));
    const progress = raw * raw * (3 - 2 * raw);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const textSize = Math.max(16, Math.min(ctx.width * 0.065, ctx.height * 0.2));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 * outro } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "78%",
          transform: "translate(-50%, -50%)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: textSize,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1.12,
          textAlign: "center",
          whiteSpace: "nowrap",
          opacity: outro
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          "data-layout-allow-overlap": "",
          "data-layout-allow-occlusion": "",
          style: {
            position: "absolute",
            left: "-3%",
            right: "-3%",
            top: \`\${50 - thickness * 37}%\`,
            height: \`\${thickness * 74}%\`,
            clipPath: direction === "right" ? \`inset(0 0 0 \${(1 - progress) * 100}%)\` : \`inset(0 \${(1 - progress) * 100}% 0 0)\`,
            background: \`\${signal}2E\`,
            borderTop: \`2px solid \${signal}\`,
            borderBottom: \`2px solid \${signal}\`,
            transform: \`skewX(-8deg) rotate(\${direction === "right" ? 1.2 : -1.2}deg)\`,
            boxShadow: \`0 0 26px \${signal}66, inset 0 0 18px \${signal}40\`
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "relative",
            color: "#E7EBEF",
            textShadow: "0 2px 3px #0D0E10C0"
          }
        },
        phrase
      )
    ));
  }
};
var T10_highlight_sweep_effect_default = kernel;
`;export{n as default};
