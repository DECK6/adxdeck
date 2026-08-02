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
var U24_dark_toggle_effect_exports = {};
__export(U24_dark_toggle_effect_exports, {
  default: () => U24_dark_toggle_effect_default
});
module.exports = __toCommonJS(U24_dark_toggle_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 1))));
    const origin = String(ctx.params.origin ?? "top-right");
    const radius = Math.max(0.75, Math.min(1.35, Number(ctx.params.radius ?? 1)));
    const snap = Math.max(0.35, Math.min(1, Number(ctx.params.snap ?? 0.72)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * Math.PI * 2 * cycles;
    const wave = 0.5 - 0.5 * Math.cos(phase);
    const reveal = Math.pow(wave, 1.2 + snap * 2.2);
    const ox = origin === "center" ? 50 : 82;
    const oy = origin === "center" ? 50 : 18;
    const maxRadius = Math.hypot(ctx.width, ctx.height) * 0.72 * radius;
    const toggleWidth = Math.min(ctx.width * 0.16, ctx.height * 0.3);
    const toggleHeight = toggleWidth * 0.46;
    const toggleX = ctx.width * ox / 100;
    const toggleY = ctx.height * oy / 100;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#EEF9FA", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "12% 14%", border: "1px solid #FFFFFF1F", borderRadius: 14 } }, /* @__PURE__ */ h("div", { "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "absolute", left: "7%", top: "10%", color: "#E8F5F6", background: "#0D0E10", padding: "2px 4px", fontSize: Math.max(9, ctx.width * 0.014), letterSpacing: "0.16em" } }, "DEXA VFX / NIGHT CONSOLE"), [0, 1, 2].map((index) => /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: "7%", top: \`\${34 + index * 16}%\`, width: \`\${58 - index * 8}%\`, height: 5, borderRadius: 5, background: index === 0 ? signal : "#DDEBED", opacity: index === 0 ? 0.8 : 0.32 } }))), /* @__PURE__ */ h("div", { "data-layout-allow-overflow": true, "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "absolute", left: toggleX, top: toggleY, width: maxRadius * 2 * reveal, height: maxRadius * 2 * reveal, transform: "translate(-50%, -50%)", borderRadius: "50%", background: "#EAF7F8", boxShadow: \`0 0 \${Math.max(8, maxRadius * 0.08)}px \${signal}88\`, overflow: "hidden" } }, /* @__PURE__ */ h("div", { "data-layout-allow-overflow": true, style: { position: "absolute", left: \`calc(50% - \${toggleX}px)\`, top: \`calc(50% - \${toggleY}px)\`, width: ctx.width, height: ctx.height, color: "#0B171A" } }, /* @__PURE__ */ h("div", { "data-layout-allow-overflow": true, style: { position: "absolute", inset: "12% 14%", border: "1px solid #0B171A2E", borderRadius: 14, background: "#F4FCFC" } }, /* @__PURE__ */ h("div", { "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "absolute", left: "7%", top: "10%", color: "#071316", background: "#F4FCFC", padding: "2px 4px", fontSize: Math.max(9, ctx.width * 0.014), fontWeight: 800, letterSpacing: "0.16em" } }, "DEXA VFX / DAY CONSOLE"), [0, 1, 2].map((index) => /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: "7%", top: \`\${34 + index * 16}%\`, width: \`\${58 - index * 8}%\`, height: 5, borderRadius: 5, background: index === 0 ? "#087484" : "#26383C", opacity: index === 0 ? 0.9 : 0.55 } }))))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: toggleX, top: toggleY, width: toggleWidth, height: toggleHeight, transform: "translate(-50%, -50%)", borderRadius: toggleHeight, background: reveal > 0.5 ? "#B6DDE1" : "#20272B", border: \`1px solid \${signal}\`, boxShadow: \`0 8px 22px #00000066, 0 0 18px \${signal}33\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", top: toggleHeight * 0.12, left: toggleHeight * 0.12 + (toggleWidth - toggleHeight) * reveal, width: toggleHeight * 0.76, height: toggleHeight * 0.76, borderRadius: "50%", background: reveal > 0.5 ? "#071316" : signal, boxShadow: \`0 0 10px \${signal}\` } })));
  }
};
var U24_dark_toggle_effect_default = kernel;
`;export{t as default};
