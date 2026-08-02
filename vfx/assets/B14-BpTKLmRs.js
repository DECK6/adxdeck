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
var B14_stat_callout_effect_exports = {};
__export(B14_stat_callout_effect_exports, {
  default: () => B14_stat_callout_effect_default
});
module.exports = __toCommonJS(B14_stat_callout_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 4);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const value = Math.round(Number(ctx.params.value ?? 87));
    const unit = String(ctx.params.unit ?? "%");
    const label = String(ctx.params.label ?? "DEXA REACH");
    const speed = Number(ctx.params.speed ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const progress = easeOut((ctx.t - 0.06) * 3.2 * speed);
    const current = Math.round(value * progress);
    const intro = easeOut(ctx.t * 6);
    const outro = clamp01((1 - ctx.t) / 0.09);
    const ticks = 19;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 * outro } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", top: "15%", bottom: "15%", width: "58%", background: "#111418EB", borderLeft: \`4px solid \${signal}\`, transform: \`translateX(\${(1 - intro) * -ctx.width * 0.12}px)\`, opacity: outro, boxShadow: \`18px 0 50px #00000055\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", top: "13%", color: "#B8C0C4", fontSize: Math.max(8, ctx.height * 0.022), letterSpacing: "0.2em" } }, "DEXA DATA / LIVE METRIC"), /* @__PURE__ */ h("div", { "data-layout-allow-overlap": true, style: { position: "absolute", left: "7%", top: "27%", display: "flex", alignItems: "flex-start", color: "#F4F7F8", fontVariantNumeric: "tabular-nums" } }, /* @__PURE__ */ h("span", { style: { fontSize: Math.max(64, ctx.height * 0.32), lineHeight: 0.86, fontWeight: 900, letterSpacing: "-0.08em" } }, current), /* @__PURE__ */ h("span", { style: { marginLeft: "0.18em", color: signal, fontSize: Math.max(20, ctx.height * 0.095), lineHeight: 1, fontWeight: 800 } }, unit)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", bottom: "18%", color: signal, fontSize: Math.max(10, ctx.height * 0.039), fontWeight: 700, letterSpacing: "0.14em" } }, label), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", bottom: "10%", height: 3, background: \`\${signal}25\` } }, /* @__PURE__ */ h("div", { style: { width: \`\${progress * 100}%\`, height: "100%", background: signal, boxShadow: \`0 0 12px \${signal}\` } }))), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "8%", top: "20%", bottom: "20%", width: "17%", opacity: intro * outro } }, Array.from({ length: ticks }, (_, index) => {
      const active = index / (ticks - 1) <= progress;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", right: 0, top: \`\${index / (ticks - 1) * 100}%\`, width: index % 3 === 0 ? "100%" : "55%", height: 2, background: active ? signal : "#647077", opacity: active ? 0.9 : 0.28, transform: \`scaleX(\${intro})\`, transformOrigin: "right" } });
    }), /* @__PURE__ */ h("div", { "data-layout-allow-overlap": true, style: { position: "absolute", right: 0, top: \`\${(1 - progress) * 100}%\`, transform: "translateY(-50%)", color: "#F4F7F8", fontSize: Math.max(8, ctx.height * 0.024), letterSpacing: "0.12em" } }, String(current).padStart(3, "0"))));
  }
};
var B14_stat_callout_effect_default = kernel;
`;export{t as default};
