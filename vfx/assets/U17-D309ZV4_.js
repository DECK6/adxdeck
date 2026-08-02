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
var U17_radial_menu_effect_exports = {};
__export(U17_radial_menu_effect_exports, {
  default: () => U17_radial_menu_effect_default
});
module.exports = __toCommonJS(U17_radial_menu_effect_exports);
const TAU = Math.PI * 2;
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const itemCount = Math.min(8, Math.max(4, Math.round(Number(ctx.params.items ?? 6))));
    const spread = Math.min(1.15, Math.max(0.55, Number(ctx.params.spread ?? 0.88)));
    const layout = String(ctx.params.layout ?? "full");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t % 1;
    const rawOpen = phase < 0.28 ? phase / 0.28 : phase < 0.7 ? 1 : phase < 0.94 ? 1 - (phase - 0.7) / 0.24 : 0;
    const open = clamp01(rawOpen);
    const eased = 1 - Math.pow(1 - open, 3);
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.52;
    const fab = Math.max(48, Math.min(ctx.width, ctx.height) * 0.12);
    const radius = Math.min(ctx.width, ctx.height) * 0.3 * spread;
    const itemSize = fab * 0.68;
    const icons = ["\\u2197", "\\u25C7", "\\u2301", "\\u25CE", "\\u2726", "\\u2318", "\\u25EB", "+"];
    const labels = ["EXPORT", "MASK", "CURVE", "FOCUS", "SPARK", "COMMAND", "LAYERS", "ADD"];
    const highlight = Math.min(itemCount - 1, Math.floor(phase * 1.8 % 1 * itemCount));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F5FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09, transform: \`scale(\${0.9 + open * 0.03})\` } }, ctx.subjectNode), Array.from({ length: itemCount }, (_, index) => {
      const angle = layout === "fan" ? -Math.PI * 0.84 + index / Math.max(1, itemCount - 1) * Math.PI * 0.68 : -Math.PI / 2 + index / itemCount * TAU;
      const stagger = clamp01(open * 1.35 - index / itemCount * 0.35);
      const local = 1 - Math.pow(1 - stagger, 3);
      const x = centerX + Math.cos(angle) * radius * local - itemSize * 0.5;
      const y = centerY + Math.sin(angle) * radius * local - itemSize * 0.5;
      const active = open > 0.86 && index === highlight;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: x, top: y, width: itemSize, height: itemSize, opacity: stagger > 0.45 ? 1 : 0, transform: \`scale(\${0.35 + local * (active ? 0.82 : 0.65)}) rotate(\${(1 - local) * -55}deg)\`, zIndex: 3 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, borderRadius: "50%", border: \`1px solid \${active ? signal : "#56616A"}\`, background: active ? "#183039" : "#171B20", boxShadow: active ? \`0 0 \${itemSize * 0.5}px \${signal}66\` : "0 9px 22px #00000099", display: "flex", alignItems: "center", justifyContent: "center", color: active ? signal : "#E4EBEF", fontSize: itemSize * 0.38, fontWeight: 800 } }, icons[index]), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: itemSize * 1.2, transform: "translateX(-50%)", padding: "5px 8px", borderRadius: 5, background: "#111418F2", border: \`1px solid \${active ? signal : "#353D44"}\`, color: active ? signal : "#C4CED4", fontSize: Math.max(6, itemSize * 0.14), letterSpacing: "0.07em", whiteSpace: "nowrap", opacity: stagger > 0.72 ? 1 : 0 } }, labels[index]));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: centerX - fab * 0.5, top: centerY - fab * 0.5, width: fab, height: fab, borderRadius: "50%", border: \`2px solid \${signal}\`, background: signal, color: "#071113", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fab * 0.45, fontWeight: 900, transform: \`scale(\${1 + Math.sin(open * Math.PI) * 0.08})\`, boxShadow: \`0 12px 30px #000000AA, 0 0 \${18 + open * 18}px \${signal}77\`, zIndex: 5 } }, /* @__PURE__ */ h("span", { style: { display: "block", color: "#071113", lineHeight: 1, transform: \`rotate(\${eased * 135}deg)\` } }, "+")), /* @__PURE__ */ h("div", { style: { position: "absolute", left: centerX - radius * open, top: centerY - radius * open, width: radius * 2 * open, height: radius * 2 * open, borderRadius: "50%", border: \`1px dashed \${signal}\`, opacity: open * 0.16, boxSizing: "border-box" } }));
  }
};
var U17_radial_menu_effect_default = kernel;
`;export{e as default};
