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
var T22_neon_trace_effect_exports = {};
__export(T22_neon_trace_effect_exports, {
  default: () => T22_neon_trace_effect_default
});
module.exports = __toCommonJS(T22_neon_trace_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const text = String(ctx.params.text ?? "DEXA");
    const trace = Number(ctx.params.trace ?? 0.58);
    const glow = Number(ctx.params.glow ?? 24);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const loop = ctx.frame % duration / duration;
    const progress = loop < trace ? loop / trace : loop < 0.86 ? 1 : Math.max(0, (1 - loop) / 0.14);
    const textSize = Math.max(38, Math.min(ctx.width * 0.22, ctx.height * 0.48));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.04em", fontFamily: "Inter, Arial, sans-serif", fontSize: textSize, fontWeight: 900, letterSpacing: "0.04em" } }, text.split("").map((character, index) => {
      const start = index / Math.max(1, text.length) * 0.72;
      const letterProgress = Math.max(0, Math.min(1, (progress - start) / 0.28));
      const eased = letterProgress * letterProgress * (3 - 2 * letterProgress);
      return /* @__PURE__ */ h(
        "span",
        {
          key: \`\${character}:\${index}\`,
          style: {
            position: "relative",
            display: "inline-block",
            color: signal,
            WebkitTextFillColor: signal,
            WebkitTextStroke: \`2px \${signal}\`,
            opacity: 0.36 + eased * 0.64,
            transform: \`translateY(\${(1 - eased) * 4}px)\`,
            filter: \`drop-shadow(0 0 \${glow * (0.12 + eased * 0.28)}px \${signal})\`
          }
        },
        character,
        /* @__PURE__ */ h("span", { style: { position: "absolute", left: "50%", top: \`\${100 - eased * 100}%\`, width: 5, height: 5, borderRadius: "50%", background: "#FFFFFF", boxShadow: \`0 0 \${glow * 0.7}px \${signal}\`, opacity: letterProgress > 0 && letterProgress < 1 ? 1 : 0 } })
      );
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "18%", right: "18%", bottom: "24%", height: 1, background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`, opacity: progress * 0.48, transform: \`scaleX(\${progress})\` } }));
  }
};
var T22_neon_trace_effect_default = kernel;
`;export{e as default};
