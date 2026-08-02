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
var B12_live_badge_effect_exports = {};
__export(B12_live_badge_effect_exports, {
  default: () => B12_live_badge_effect_default
});
module.exports = __toCommonJS(B12_live_badge_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const label = String(ctx.params.label ?? "LIVE");
    const pulse = Number(ctx.params.pulse ?? 1);
    const position = String(ctx.params.position ?? "top-right");
    const timecode = Boolean(ctx.params.timecode ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const intro = clamp01(ctx.t / 0.11);
    const outro = clamp01((1 - ctx.t) / 0.08);
    const beat = 0.76 + 0.24 * (0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 6 * pulse));
    const totalSeconds = ctx.frame / Math.max(1, ctx.fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const frames = ctx.frame % Math.max(1, Math.round(ctx.fps));
    const code = \`00:\${String(minutes).padStart(2, "0")}:\${String(seconds).padStart(2, "0")}:\${String(frames).padStart(2, "0")}\`;
    const isLeft = position === "top-left";
    const isBottom = position === "bottom-right";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.15 * outro } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: isLeft ? "5%" : void 0,
          right: isLeft ? void 0 : "5%",
          top: isBottom ? void 0 : "7%",
          bottom: isBottom ? "7%" : void 0,
          display: "flex",
          alignItems: "stretch",
          transform: \`translateX(\${(1 - intro) * (isLeft ? -1 : 1) * ctx.width * 0.12}px)\`,
          opacity: outro,
          filter: \`drop-shadow(0 0 \${beat * 10}px \${signal}33)\`
        }
      },
      /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: "0.65em", padding: \`\${ctx.height * 0.018}px \${ctx.width * 0.018}px\`, background: signal, color: "#071012", fontSize: Math.max(10, ctx.height * 0.04), fontWeight: 900, letterSpacing: "0.12em" } }, /* @__PURE__ */ h("span", { style: { width: ctx.height * 0.027, height: ctx.height * 0.027, borderRadius: "50%", background: "#071012", transform: \`scale(\${0.78 + beat * 0.22})\`, boxShadow: \`0 0 0 \${ctx.height * 0.012 * (1 - beat)}px #07101255\` } }), label),
      timecode ? /* @__PURE__ */ h("div", { style: { display: "grid", placeItems: "center", padding: \`0 \${ctx.width * 0.018}px\`, border: \`1px solid \${signal}66\`, background: "#0D0E10E8", color: "#F4F7F8", fontSize: Math.max(8, ctx.height * 0.028), fontVariantNumeric: "tabular-nums", letterSpacing: "0.08em" } }, code) : null
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "5%", bottom: "6%", color: "#B6BEC2", fontSize: Math.max(7, ctx.height * 0.019), letterSpacing: "0.15em", opacity: intro * outro * 0.72 } }, "DEXA VFX // MASTER FEED"));
  }
};
var B12_live_badge_effect_default = kernel;
`;export{t as default};
