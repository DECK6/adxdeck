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
var T06_word_cascade_effect_exports = {};
__export(T06_word_cascade_effect_exports, {
  default: () => T06_word_cascade_effect_default
});
module.exports = __toCommonJS(T06_word_cascade_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "MOTION MADE VISIBLE");
    const stagger = Number(ctx.params.stagger ?? 0.12);
    const blur = Number(ctx.params.blur ?? 14);
    const rise = Number(ctx.params.rise ?? 0.16);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const words = phrase.split(" ");
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 * outro } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "12%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: Math.max(4, ctx.height * 0.018),
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(16, Math.min(ctx.width * 0.08, ctx.height * 0.2)),
          fontWeight: 800,
          lineHeight: 0.92,
          letterSpacing: "-0.045em"
        }
      },
      words.map((word, index) => {
        const raw = Math.min(1, Math.max(0, (ctx.t - 0.08 - index * stagger) / 0.2));
        const progress = 1 - Math.pow(1 - raw, 3);
        const travel = (1 - progress) * ctx.height * rise;
        return /* @__PURE__ */ h(
          "div",
          {
            key: \`\${word}:\${index}\`,
            style: {
              position: "relative",
              color: index === words.length - 1 ? signal : "#E7EBEF",
              opacity: progress * outro,
              filter: \`blur(\${(1 - progress) * blur}px)\`,
              transform: \`translate3d(\${index * ctx.width * 0.045}px, \${travel}px, 0) scale(\${0.9 + progress * 0.1})\`,
              textShadow: index === words.length - 1 ? \`0 0 20px \${signal}4D\` : "none",
              whiteSpace: "nowrap"
            }
          },
          word
        );
      })
    ));
  }
};
var T06_word_cascade_effect_default = kernel;
`;export{e as default};
