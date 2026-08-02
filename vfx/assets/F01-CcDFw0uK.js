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
var F01_letterbox_reveal_effect_exports = {};
__export(F01_letterbox_reveal_effect_exports, {
  default: () => F01_letterbox_reveal_effect_default
});
module.exports = __toCommonJS(F01_letterbox_reveal_effect_exports);
function smoothstep(edge0, edge1, value) {
  const x = Math.min(1, Math.max(0, (value - edge0) / Math.max(1e-4, edge1 - edge0)));
  return x * x * (3 - 2 * x);
}
const kernel = {
  kind: "react",
  render: (ctx) => {
    const aperture = Math.min(0.62, Math.max(0.32, Number(ctx.params.aperture ?? 0.43)));
    const hold = Math.min(0.7, Math.max(0.2, Number(ctx.params.hold ?? 0.48)));
    const title = String(ctx.params.title ?? "DEXA CINEMA");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const edge = (1 - hold) * 0.5;
    const openIn = smoothstep(0, edge, ctx.t);
    const openOut = 1 - smoothstep(1 - edge, 1, ctx.t);
    const open = Math.min(openIn, openOut);
    const barHeight = 50 - aperture * 50 * open;
    const titleOpacity = smoothstep(0.18, 0.55, open) * smoothstep(0, 0.15, 1 - Math.abs(ctx.t - 0.5) * 2);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: -12, display: "grid", placeItems: "center", transform: \`scale(\${1.06 - open * 0.06})\`, filter: \`brightness(\${0.62 + open * 0.38}) saturate(\${0.74 + open * 0.26})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: \`radial-gradient(ellipse at center, transparent 36%, #0D0E108C 100%)\`, opacity: 0.76 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: 0, height: \`\${barHeight}%\`, background: "#050607", boxShadow: \`0 7px 0 \${signal}\${open > 0.08 ? "66" : "00"}\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: \`\${barHeight}%\`, background: "#050607", boxShadow: \`0 -7px 0 \${signal}\${open > 0.08 ? "66" : "00"}\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "50%", transform: \`translateY(\${14 - open * 14}px)\`, textAlign: "center", opacity: titleOpacity } }, /* @__PURE__ */ h("div", { style: { color: signal, fontSize: Math.max(8, ctx.width * 9e-3), fontWeight: 800, letterSpacing: "0.42em" } }, "A SIX SECOND PICTURE"), /* @__PURE__ */ h("div", { style: { marginTop: 12, color: "#FFFFFF", fontSize: Math.max(24, ctx.width * 0.052), fontWeight: 800, letterSpacing: "0.12em", textShadow: "0 3px 18px #000000" } }, title)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "4%", bottom: \`\${barHeight * 0.5}%\`, width: \`\${open * 13}%\`, height: 2, background: signal, opacity: open * 0.72 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "4%", top: \`\${barHeight * 0.5}%\`, width: \`\${open * 13}%\`, height: 2, background: signal, opacity: open * 0.72 } }));
  }
};
var F01_letterbox_reveal_effect_default = kernel;
`;export{e as default};
