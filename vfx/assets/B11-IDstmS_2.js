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
var B11_hud_frame_effect_exports = {};
__export(B11_hud_frame_effect_exports, {
  default: () => B11_hud_frame_effect_default
});
module.exports = __toCommonJS(B11_hud_frame_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const density = Math.round(Number(ctx.params.density ?? 2));
    const scanSpeed = Number(ctx.params.scanSpeed ?? 1);
    const mode = String(ctx.params.mode ?? "TRACK");
    const telemetry = Boolean(ctx.params.telemetry ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const intro = clamp01(ctx.t / 0.13);
    const outro = clamp01((1 - ctx.t) / 0.08);
    const scanY = ctx.t * scanSpeed % 1 * 72 + 14;
    const lock = 0.72 + 0.28 * Math.sin(ctx.t * Math.PI * 4);
    const bracket = Math.min(ctx.width, ctx.height) * 0.085;
    const cornerStyle = (x, y, rotate) => ({
      position: "absolute",
      left: x,
      top: y,
      width: bracket,
      height: bracket,
      borderTop: \`3px solid \${signal}\`,
      borderLeft: \`3px solid \${signal}\`,
      transform: \`rotate(\${rotate}deg) scale(\${intro})\`,
      opacity: outro,
      boxShadow: \`-3px -3px 14px \${signal}22\`
    });
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace", color: "#DCE3E6" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.12 * outro } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { ...cornerStyle("6%", "8%", 0), transformOrigin: "top left" } }), /* @__PURE__ */ h("div", { style: { ...cornerStyle("94%", "8%", 90), transformOrigin: "top left" } }), /* @__PURE__ */ h("div", { style: { ...cornerStyle("94%", "92%", 180), transformOrigin: "top left" } }), /* @__PURE__ */ h("div", { style: { ...cornerStyle("6%", "92%", 270), transformOrigin: "top left" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "50%", width: ctx.height * 0.31, height: ctx.height * 0.31, transform: \`translate(-50%, -50%) scale(\${0.86 + intro * 0.14})\`, border: \`1px solid \${signal}66\`, borderRadius: "50%", opacity: outro * lock } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "-18%", bottom: "-18%", width: 1, background: signal, opacity: 0.48 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", top: "50%", left: "-18%", right: "-18%", height: 1, background: signal, opacity: 0.48 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "28%", border: \`1px dashed \${signal}\`, borderRadius: "50%", transform: \`rotate(\${ctx.t * 180 * scanSpeed}deg)\`, opacity: 0.65 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "50%", width: 7, height: 7, border: \`2px solid \${signal}\`, transform: "translate(-50%, -50%) rotate(45deg)", boxShadow: \`0 0 12px \${signal}\` } })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", right: "7%", top: \`\${scanY}%\`, height: 1, background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`, boxShadow: \`0 0 12px \${signal}\`, opacity: intro * outro * 0.62 } }), Array.from({ length: density * 4 }, (_, index) => /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: \`\${9 + index % 4 * 27.3}%\`, top: index % 2 === 0 ? "8%" : "90%", width: 1, height: index % 3 === 0 ? 16 : 8, background: signal, opacity: intro * outro * 0.42 } })), telemetry ? /* @__PURE__ */ h(Frag, null, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "7%", top: "13%", fontSize: Math.max(7, ctx.height * 0.019), lineHeight: 1.7, letterSpacing: "0.12em", opacity: intro * outro } }, /* @__PURE__ */ h("span", { style: { color: signal } }, mode, " // ACTIVE"), /* @__PURE__ */ h("br", null), "SUBJECT 01", /* @__PURE__ */ h("br", null), "CONF ", Math.round(lock * 99), "%"), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "7%", bottom: "13%", textAlign: "right", fontSize: Math.max(7, ctx.height * 0.019), lineHeight: 1.7, letterSpacing: "0.12em", opacity: intro * outro } }, "DEXA TELEMETRY", /* @__PURE__ */ h("br", null), "X ", String(Math.round(ctx.width * 0.5)).padStart(4, "0"), " / Y ", String(Math.round(ctx.height * 0.5)).padStart(4, "0"), /* @__PURE__ */ h("br", null), /* @__PURE__ */ h("span", { style: { color: signal } }, "LOCKED"))) : null);
  }
};
var B11_hud_frame_effect_default = kernel;
`;export{t as default};
