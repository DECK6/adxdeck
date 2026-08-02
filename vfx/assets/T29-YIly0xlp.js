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
var T29_ticker_digits_effect_exports = {};
__export(T29_ticker_digits_effect_exports, {
  default: () => T29_ticker_digits_effect_default
});
module.exports = __toCommonJS(T29_ticker_digits_effect_exports);
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const value = Math.max(0, Math.round(Number(ctx.params.value ?? 260933)));
    const speed = Number(ctx.params.speed ?? 1.2);
    const stagger = Number(ctx.params.stagger ?? 0.08);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const digits = String(value).padStart(6, "0").slice(-6).split("").map(Number);
    const cell = Math.max(34, Math.min(ctx.width * 0.105, ctx.height * 0.22));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", display: "grid", placeItems: "center" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "relative", display: "flex", gap: Math.max(2, cell * 0.1), padding: \`\${cell * 0.22}px\`, borderTop: \`2px solid \${signal}8C\`, borderBottom: \`2px solid \${signal}8C\`, background: "#14171BEF", boxShadow: \`0 12px 34px #000A, inset 0 0 18px \${signal}12\` } }, digits.map((target, index) => {
      const local = clamp01((phase - 0.04 - index * stagger) / Math.max(0.12, 0.4 / speed));
      const release = clamp01((phase - 0.76 - (digits.length - index - 1) * 0.018) / 0.18);
      const settle = 1 - Math.pow(1 - local, 4);
      const direction = index % 2 === 0 ? 1 : -1;
      const targetStep = direction > 0 ? target : (10 - target) % 10;
      const position = (1 - release) * settle * ((4 + index) * 10 + targetStep) + release * (8 + index) * 10;
      const current = Math.floor(position);
      const fraction = position - current;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "relative", width: cell * 0.68, height: cell, overflow: "hidden", borderRadius: 2, background: "#090A0C", boxShadow: \`inset 0 0 \${cell * 0.35}px #000\` } }, [-1, 0, 1, 2].map((row) => {
        const digit = (direction * (current + row) % 10 + 10) % 10;
        const distance = Math.abs(row - fraction);
        return /* @__PURE__ */ h("div", { key: row, "data-layout-allow-overflow": true, "data-layout-allow-overlap": true, style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", color: distance < 0.6 ? signal : "#596068", fontFamily: "JetBrains Mono, monospace", fontSize: cell * 0.68, fontWeight: 800, lineHeight: 1, opacity: Math.max(0.08, 1 - distance * 0.45), filter: \`blur(\${Math.max(0, distance - 0.4) * 1.6}px)\`, transform: \`translateY(\${direction * (row - fraction) * cell}px)\` } }, digit);
      }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "#FFFFFF24" } }));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", right: cell * 0.22, top: cell * 0.025, color: signal, fontFamily: "JetBrains Mono, monospace", fontSize: Math.max(8, cell * 0.15), lineHeight: 1, letterSpacing: "0.16em" } }, "TICKER / SYNC")));
  }
};
var T29_ticker_digits_effect_default = kernel;
`;export{e as default};
