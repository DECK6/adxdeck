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
var F02_credits_roll_effect_exports = {};
__export(F02_credits_roll_effect_exports, {
  default: () => F02_credits_roll_effect_default
});
module.exports = __toCommonJS(F02_credits_roll_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    const density = Math.min(6, Math.max(3, Math.round(Number(ctx.params.density ?? 5))));
    const layout = String(ctx.params.layout ?? "split");
    const title = String(ctx.params.title ?? "DEXA VFX");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = ctx.t * speed % 1;
    const translate = 92 - progress * (190 + density * 18);
    const roles = ["A DEXA PICTURE", "VISUAL DIRECTION", "MOTION SYSTEMS", "FRAME DESIGN", "SIGNAL UNIT", "FINAL OUTPUT"];
    const names = ["DEXA VFX", "DEXA LAB", "DEXA SIGNAL", "DEXA MOTION", "DEXA FRAME", "DEXA CINEMA"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F5F7F8", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: -16, display: "grid", placeItems: "center", opacity: 0.52, filter: "grayscale(1) contrast(1.18) brightness(0.52)", transform: \`scale(\${1.03 + Math.sin(ctx.t * Math.PI * 2) * 0.015})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, #0D0E10 0%, transparent 22%, transparent 70%, #0D0E10 100%)" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "9%", top: "8%", color: signal, fontSize: Math.max(8, ctx.width * 9e-3), fontWeight: 800, letterSpacing: "0.32em", zIndex: 2 } }, title, " / END CREDITS"), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "10%", right: "10%", top: \`\${translate}%\`, textAlign: layout === "center" ? "center" : "left" } }, /* @__PURE__ */ h("div", { style: { marginBottom: Math.max(42, ctx.height * 0.14), textAlign: "center" } }, /* @__PURE__ */ h("div", { style: { color: signal, fontSize: Math.max(8, ctx.width * 9e-3), letterSpacing: "0.42em", fontWeight: 800 } }, "THE FRAME REMAINS"), /* @__PURE__ */ h("div", { style: { marginTop: 16, fontSize: Math.max(28, ctx.width * 0.057), fontWeight: 900, letterSpacing: "0.12em" } }, title)), Array.from({ length: density }, (_, index) => /* @__PURE__ */ h("div", { key: index, style: { minHeight: Math.max(74, ctx.height * 0.17), display: layout === "split" ? "grid" : "block", gridTemplateColumns: "1fr 1fr", alignItems: "start", gap: "6%", borderTop: index === 0 ? \`1px solid \${signal}70\` : "1px solid #FFFFFF1C", paddingTop: 18 } }, /* @__PURE__ */ h("div", { style: { color: index % 2 === 0 ? signal : "#AEB8C0", fontSize: Math.max(8, ctx.width * 9e-3), fontWeight: 800, letterSpacing: "0.18em" } }, roles[index]), /* @__PURE__ */ h("div", { style: { marginTop: layout === "center" ? 7 : 0, color: "#FFFFFF", fontSize: Math.max(11, ctx.width * 0.014), fontWeight: 700, letterSpacing: "0.08em", textAlign: layout === "split" ? "right" : "center" } }, names[index]))), /* @__PURE__ */ h("div", { style: { padding: \`\${Math.max(36, ctx.height * 0.1)}px 0\`, textAlign: "center", color: "#D9E0E4", fontSize: Math.max(9, ctx.width * 0.011), letterSpacing: "0.25em" } }, "MADE FOR THE NEXT FRAME")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "5%", top: 0, bottom: 0, width: 1, background: \`linear-gradient(transparent, \${signal}66, transparent)\` } }));
  }
};
var F02_credits_roll_effect_default = kernel;
`;export{t as default};
