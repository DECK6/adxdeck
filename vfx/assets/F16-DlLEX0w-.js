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
var F16_end_card_effect_exports = {};
__export(F16_end_card_effect_exports, {
  default: () => F16_end_card_effect_default
});
module.exports = __toCommonJS(F16_end_card_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const title = String(ctx.params.title ?? "DEXA VFX");
    const layout = String(ctx.params.layout ?? "screening");
    const reveal = Math.max(0.4, Math.min(1.4, Number(ctx.params.reveal ?? 0.8)));
    const accent = Math.max(1, Math.min(8, Number(ctx.params.accent ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const intro = clamp01(ctx.t / (0.18 * reveal));
    const hold = clamp01((1 - ctx.t) / 0.1);
    const subjectProgress = intro * intro * (3 - 2 * intro);
    const detailProgress = clamp01((ctx.t - 0.16 * reveal) / (0.18 * reveal));
    const schedule = layout === "festival" ? ["OFFICIAL SELECTION", "DEXA MOTION FESTIVAL", "SCREEN 07 / 20:30"] : layout === "premiere" ? ["WORLD PREMIERE", "06 SEPTEMBER / 20:30", "DEXA CINEMA 01"] : ["SPECIAL SCREENING", "06 SEPTEMBER / 20:30", "DEXA CINEMA 01"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: hold } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "35%",
          top: "15%",
          width: "30%",
          height: "34%",
          opacity: 0.86 * subjectProgress,
          transform: \`translateY(\${(1 - subjectProgress) * 7}%) scale(\${0.86 + subjectProgress * 0.14})\`,
          filter: \`drop-shadow(0 0 \${12 + subjectProgress * 22}px \${signal}32)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "10%", height: accent, background: signal, transform: \`scaleX(\${subjectProgress})\`, transformOrigin: "left", boxShadow: \`0 0 14px \${signal}\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", bottom: "10%", height: 1, background: "#F7FAFC", opacity: 0.3 * detailProgress, transform: \`scaleX(\${detailProgress})\`, transformOrigin: "right" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "53%", textAlign: "center", transform: \`translateY(\${(1 - detailProgress) * 28}px)\`, opacity: detailProgress } }, /* @__PURE__ */ h("div", { style: { color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: "0.38em", marginBottom: ctx.height * 0.024 } }, schedule[0]), /* @__PURE__ */ h("div", { style: { fontSize: Math.max(30, Math.min(ctx.width * 0.083, ctx.height * 0.14)), lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.055em" } }, title), /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "center", gap: "6%", marginTop: ctx.height * 0.05, color: "#D7DDE1", fontSize: Math.max(9, ctx.width * 0.013), fontWeight: 600, letterSpacing: "0.08em" } }, /* @__PURE__ */ h("span", null, schedule[1]), /* @__PURE__ */ h("span", { style: { color: signal } }, "/"), /* @__PURE__ */ h("span", null, schedule[2]))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", bottom: "5.6%", color: "#B8C0C5", fontSize: Math.max(8, ctx.width * 9e-3), letterSpacing: "0.16em", opacity: detailProgress } }, "DEXA.ART/VFX"), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "8%", bottom: "5.6%", color: "#B8C0C5", fontSize: Math.max(8, ctx.width * 9e-3), letterSpacing: "0.16em", opacity: detailProgress } }, "ADMIT / 001")));
  }
};
var F16_end_card_effect_default = kernel;
`;export{t as default};
