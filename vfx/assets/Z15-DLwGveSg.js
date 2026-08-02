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
var Z15_price_board_effect_exports = {};
__export(Z15_price_board_effect_exports, {
  default: () => Z15_price_board_effect_default
});
module.exports = __toCommonJS(Z15_price_board_effect_exports);
const SYMBOLS = ["DXA", "CYAN", "VFX", "FRAME", "PIXEL", "NODE", "WAVE"];
const BASE_PRICES = [142.8, 78.45, 216.1, 54.72, 91.34, 168.6, 37.25];
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rows = Math.max(3, Math.min(7, Math.round(Number(ctx.params.rows ?? 5))));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const flipDepth = Math.min(1, Math.max(0, Number(ctx.params.flipDepth ?? 0.72)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const rowHeight = Math.min(ctx.height * 0.105, ctx.width * 0.052);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "8% 13%", opacity: 0.1, filter: \`grayscale(1) drop-shadow(0 0 12px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "50%", width: "78%", transform: "translate(-50%, -50%)", border: "1px solid #3A4247", background: "#080A0BEE", boxShadow: "0 18px 44px #000C", fontFamily: "JetBrains Mono, monospace" } }, /* @__PURE__ */ h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.2fr 0.8fr", padding: \`\${rowHeight * 0.23}px \${rowHeight * 0.42}px\`, color: "#B8C1C5", background: "#151A1D", borderBottom: \`1px solid \${signal}55\`, fontSize: rowHeight * 0.24, letterSpacing: "0.14em" } }, /* @__PURE__ */ h("span", null, "SYMBOL"), /* @__PURE__ */ h("span", { style: { textAlign: "right" } }, "LAST"), /* @__PURE__ */ h("span", { style: { textAlign: "right" } }, "CHG")), Array.from({ length: rows }, (_, index) => {
      const movement = Math.sin(phase * speed + index * 1.31);
      const price = BASE_PRICES[index] + movement * (1.2 + index * 0.37);
      const change = movement * (0.6 + index * 0.18);
      const flipPulse = Math.max(0, Math.sin(phase * speed * 2 + index * 1.7));
      const angle = -flipPulse * flipDepth * 42;
      const rising = change >= 0;
      return /* @__PURE__ */ h("div", { key: SYMBOLS[index], style: { position: "relative", height: rowHeight, overflow: "hidden", borderBottom: index === rows - 1 ? "none" : "1px solid #252C30", background: index % 2 === 0 ? "#0C1012" : "#111518" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1.2fr 0.8fr", alignItems: "center", padding: \`0 \${rowHeight * 0.42}px\`, transform: \`rotateX(\${angle}deg)\`, transformOrigin: "50% 50%", background: flipPulse > 0.78 ? \`\${signal}12\` : "transparent", color: "#E8EEF0", fontSize: rowHeight * 0.38, fontWeight: 700 } }, /* @__PURE__ */ h("span", { style: { color: signal, letterSpacing: "0.08em" } }, SYMBOLS[index]), /* @__PURE__ */ h("span", { style: { textAlign: "right" } }, price.toFixed(2)), /* @__PURE__ */ h("span", { style: { textAlign: "right", color: rising ? signal : "#FF8174" } }, rising ? "+" : "", change.toFixed(2), "%")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "#000A", opacity: flipPulse * flipDepth, zIndex: 1 } }));
    })));
  }
};
var Z15_price_board_effect_default = kernel;
`;export{e as default};
