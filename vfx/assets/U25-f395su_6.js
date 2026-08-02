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
var U25_dock_magnify_effect_exports = {};
__export(U25_dock_magnify_effect_exports, {
  default: () => U25_dock_magnify_effect_default
});
module.exports = __toCommonJS(U25_dock_magnify_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const iconCount = Math.max(5, Math.min(9, Math.round(Number(ctx.params.icons ?? 7))));
    const magnify = Math.max(1.25, Math.min(2.1, Number(ctx.params.magnify ?? 1.72)));
    const spread = Math.max(0.65, Math.min(1.5, Number(ctx.params.spread ?? 1)));
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 1))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2 * cycles;
    const cursor = 0.5 - 0.5 * Math.cos(phase);
    const dockWidth = Math.min(ctx.width * 0.76, ctx.height * 1.45);
    const dockHeight = Math.min(ctx.height * 0.18, dockWidth * 0.16);
    const slot = dockWidth / iconCount;
    const iconSize = Math.min(dockHeight * 0.65, slot * 0.66);
    const labels = ["D", "E", "X", "A", "V", "F", "X", "+", "\\u2197"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F3FAFB", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "23%", transform: "translateX(-50%)", color: "#AAB7BC", fontSize: Math.max(8, ctx.width * 0.011), letterSpacing: "0.18em" } }, "DEXA VFX DOCK / PROXIMITY"), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: "22%", width: dockWidth, height: dockHeight, transform: "translateX(-50%)", border: "1px solid #A7F5FF33", borderRadius: dockHeight * 0.27, background: "#171C20E8", boxShadow: "0 18px 45px #000000A8", display: "flex", alignItems: "center", justifyContent: "space-around", padding: \`0 \${slot * 0.1}px\`, boxSizing: "border-box" } }, Array.from({ length: iconCount }, (_, index) => {
      const position = iconCount === 1 ? 0.5 : index / (iconCount - 1);
      const distance = Math.abs(position - cursor) * (iconCount - 1) / spread;
      const influence = Math.exp(-distance * distance * 0.72);
      const scale = 1 + influence * (magnify - 1);
      const lift = influence * iconSize * 0.62;
      return /* @__PURE__ */ h("div", { key: index, style: { position: "relative", width: slot * 0.88, height: dockHeight, display: "flex", alignItems: "center", justifyContent: "center", transform: \`translateY(\${-lift}px)\` } }, /* @__PURE__ */ h("div", { style: { width: iconSize, height: iconSize, transform: \`scale(\${scale})\`, borderRadius: iconSize * 0.22, border: \`1px solid \${influence > 0.55 ? signal : "#56636A"}\`, background: influence > 0.55 ? "#183038" : "#242B30", color: influence > 0.55 ? signal : "#E6EFF1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.max(10, iconSize * 0.31), fontWeight: 800, boxShadow: influence > 0.2 ? \`0 \${8 + influence * 14}px \${14 + influence * 20}px #00000099, 0 0 \${influence * 18}px \${signal}55\` : "0 7px 14px #00000077" } }, labels[index]), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: dockHeight * 0.08, width: 4 + influence * 3, height: 4 + influence * 3, transform: "translateX(-50%)", borderRadius: "50%", background: signal, opacity: 0.2 + influence * 0.8 } }));
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`calc(\${12 + cursor * 76}% - 7px)\`, bottom: "12%", width: 14, height: 20, transform: \`rotate(\${-12 + cursor * 24}deg)\`, clipPath: "polygon(0 0, 100% 72%, 55% 78%, 38% 100%)", background: signal, filter: \`drop-shadow(0 0 7px \${signal})\` } }));
  }
};
var U25_dock_magnify_effect_default = kernel;
`;export{e as default};
