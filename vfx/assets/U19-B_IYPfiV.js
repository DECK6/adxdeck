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
var U19_slider_snap_effect_exports = {};
__export(U19_slider_snap_effect_exports, {
  default: () => U19_slider_snap_effect_default
});
module.exports = __toCommonJS(U19_slider_snap_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const stops = Math.min(9, Math.max(4, Math.round(Number(ctx.params.stops ?? 7))));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const spring = Math.min(1, Math.max(0, Number(ctx.params.spring ?? 0.58)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const wave = 0.5 - Math.cos(ctx.t * Math.PI * 2 * cycles) * 0.5;
    const raw = wave * (stops - 1);
    const snapped = Math.round(raw);
    const distance = raw - snapped;
    const elastic = Math.sin(distance * Math.PI) * Math.abs(distance) * spring * 0.5;
    const position = Math.min(stops - 1, Math.max(0, snapped + elastic));
    const ratio = position / (stops - 1);
    const railWidth = Math.min(ctx.width * 0.7, ctx.height * 1.28);
    const railLeft = (ctx.width - railWidth) * 0.5;
    const railTop = ctx.height * 0.54;
    const knob = Math.max(28, Math.min(ctx.width, ctx.height) * 0.075);
    const knobLeft = railLeft + ratio * railWidth;
    const value = Math.round(snapped / (stops - 1) * 100);
    const snapPulse = 1 - Math.min(1, Math.abs(distance) * 5);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F7FAFC", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1, transform: "scale(0.9)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: railLeft, top: railTop - 3, width: railWidth, height: 6, borderRadius: 999, background: "#343B42", boxShadow: "inset 0 2px 5px #00000099" } }, /* @__PURE__ */ h("div", { style: { width: \`\${ratio * 100}%\`, height: "100%", borderRadius: 999, background: signal, boxShadow: \`0 0 14px \${signal}\` } })), Array.from({ length: stops }, (_, index) => {
      const active = index <= snapped;
      const selected = index === snapped;
      const x = railLeft + index / (stops - 1) * railWidth;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: x, top: railTop, transform: "translate(-50%, -50%)" } }, /* @__PURE__ */ h("div", { style: { width: selected ? 12 : 7, height: selected ? 12 : 7, borderRadius: "50%", border: \`2px solid \${active ? signal : "#69747C"}\`, background: selected ? signal : "#0D0E10", boxSizing: "border-box", boxShadow: selected ? \`0 0 12px \${signal}\` : "none" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: 18, width: 1, height: index % 2 === 0 ? 13 : 8, background: active ? \`\${signal}99\` : "#566169", transform: "translateX(-50%)" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: 36, transform: "translateX(-50%)", color: selected ? "#F7FAFC" : "#89959D", fontSize: Math.max(7, ctx.width * 85e-4), letterSpacing: "0.04em" } }, Math.round(index / (stops - 1) * 100)));
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: knobLeft, top: railTop, width: knob, height: knob, borderRadius: "50%", border: \`2px solid \${signal}\`, background: "#EAFDFF", transform: \`translate(-50%, -50%) scale(\${1 + snapPulse * spring * 0.12})\`, boxShadow: \`0 8px 24px #000000B0, 0 0 \${12 + snapPulse * 12}px \${signal}88\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: knobLeft, top: railTop - knob * 1.72, minWidth: knob * 1.28, padding: \`\${knob * 0.2}px \${knob * 0.3}px\`, boxSizing: "border-box", borderRadius: knob * 0.25, border: \`1px solid \${signal}\`, background: "#17242AF5", color: "#F7FAFC", fontSize: knob * 0.38, fontWeight: 800, textAlign: "center", transform: \`translateX(-50%) translateY(\${-snapPulse * 5}px)\`, boxShadow: \`0 10px 26px #000000A8, 0 0 14px \${signal}2E\` } }, String(value).padStart(3, "0"), /* @__PURE__ */ h("span", { style: { color: signal, fontSize: "0.62em" } }, "%"), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: -6, width: 10, height: 10, borderRight: \`1px solid \${signal}\`, borderBottom: \`1px solid \${signal}\`, background: "#17242A", transform: "translateX(-50%) rotate(45deg)" } })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: railLeft, top: railTop - knob * 2.35, color: "#A9B4BB", fontSize: Math.max(8, ctx.width * 0.011), letterSpacing: "0.13em" } }, "DEXA VFX / INTENSITY"));
  }
};
var U19_slider_snap_effect_default = kernel;
`;export{t as default};
