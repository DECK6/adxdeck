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
var B05_title_card_effect_exports = {};
__export(B05_title_card_effect_exports, {
  default: () => B05_title_card_effect_default
});
module.exports = __toCommonJS(B05_title_card_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const title = String(ctx.params.title ?? "DEXA VFX");
    const alignment = String(ctx.params.alignment ?? "center");
    const lineWeight = Number(ctx.params.lineWeight ?? 2);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const kickerIn = smooth((ctx.t - 0.05) / 0.16);
    const titleIn = smooth((ctx.t - 0.13) / 0.24);
    const lineIn = smooth((ctx.t - 0.28) / 0.22);
    const outro = smooth((1 - ctx.t) / 0.12);
    const origin = alignment === "left" ? "left" : alignment === "right" ? "right" : "center";
    const justify = alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7F9FA", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "13% 10%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: justify, textAlign: alignment, opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          color: signal,
          fontSize: Math.max(8, ctx.width * 0.011),
          fontWeight: 900,
          letterSpacing: "0.32em",
          opacity: kickerIn,
          transform: \`translate3d(0, \${(1 - kickerIn) * 18}px, 0)\`,
          whiteSpace: "nowrap"
        }
      },
      "ORIGINAL BROADCAST SERIES"
    ), /* @__PURE__ */ h("div", { style: { margin: "2.5% 0 2%", display: "flex", justifyContent: justify, overflow: "hidden", width: "100%" } }, title.split("").map((character, index) => {
      const charIn = smooth((ctx.t - 0.12 - index * 0.018) / 0.18);
      return /* @__PURE__ */ h(
        "span",
        {
          key: \`\${character}:\${index}\`,
          style: {
            display: "inline-block",
            minWidth: character === " " ? "0.34em" : void 0,
            fontSize: Math.max(30, ctx.width * 0.082),
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.075em",
            opacity: charIn * titleIn,
            transform: \`translate3d(0, \${(1 - charIn) * ctx.height * 0.09}px, 0)\`
          }
        },
        character === " " ? "\\xA0" : character
      );
    })), /* @__PURE__ */ h("div", { style: { width: "100%", height: lineWeight, background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`, transform: \`scaleX(\${lineIn})\`, transformOrigin: origin } }), /* @__PURE__ */ h("div", { style: { marginTop: "2%", color: "#C8D0D5", fontSize: Math.max(7, ctx.width * 9e-3), fontWeight: 700, letterSpacing: "0.2em", opacity: lineIn, whiteSpace: "nowrap" } }, "MOTION / SIGNAL / FORM")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "4%", top: "6%", color: "#AEB8BD", fontSize: Math.max(7, ctx.width * 8e-3), fontWeight: 700, letterSpacing: "0.14em", opacity: kickerIn * outro } }, "DEXA 07\\u201424"));
  }
};
var B05_title_card_effect_default = kernel;
`;export{t as default};
