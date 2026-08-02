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
var T31_magnet_letters_effect_exports = {};
__export(T31_magnet_letters_effect_exports, {
  default: () => T31_magnet_letters_effect_default
});
module.exports = __toCommonJS(T31_magnet_letters_effect_exports);
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA").toUpperCase();
    const scatter = Number(ctx.params.scatter ?? 0.42);
    const snap = Number(ctx.params.snap ?? 0.72);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const attractRaw = phase < 0.7 ? clamp01((phase - 0.08) / (0.5 - snap * 0.18)) : clamp01((0.98 - phase) / 0.2);
    const attract = 1 - Math.pow(1 - attractRaw, 5);
    const bounce = Math.sin(attractRaw * Math.PI * 5) * (1 - attractRaw) * snap;
    const tile = Math.max(34, Math.min(ctx.width * 0.12, ctx.height * 0.22));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(145deg, #20262B, #0C0F12)", display: "grid", placeItems: "center" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), [1, 2, 3].map((ring) => /* @__PURE__ */ h("div", { key: ring, style: { position: "absolute", left: "50%", top: "50%", width: tile * phrase.length * (0.65 + ring * 0.22), height: tile * (0.8 + ring * 0.32), border: \`1px solid \${signal}\`, borderRadius: "50%", opacity: (1 - attract) * (0.22 / ring), transform: \`translate(-50%, -50%) scale(\${0.7 + attract * 0.45})\` } })), /* @__PURE__ */ h("div", { style: { position: "relative", display: "flex", gap: tile * 0.12 } }, phrase.split("").map((character, index) => {
      const angle = ctx.random(\`magnet:\${index}:angle\`) * Math.PI * 2;
      const reach = 0.55 + ctx.random(\`magnet:\${index}:reach\`) * 0.6;
      const startX = Math.cos(angle) * ctx.width * scatter * reach;
      const startY = Math.sin(angle) * ctx.height * scatter * reach;
      const rotation = (ctx.random(\`magnet:\${index}:spin\`) * 2 - 1) * 110;
      const polarity = index % 2 === 0 ? "#E64B52" : signal;
      return /* @__PURE__ */ h("div", { key: \`\${character}:\${index}\`, "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "relative", width: tile, height: tile * 1.08, display: "grid", placeItems: "center", borderRadius: tile * 0.12, background: \`linear-gradient(145deg, \${polarity}, #171A1D)\`, border: "1px solid #FFFFFF38", color: "#F7FAFA", fontFamily: "Arial Black, Inter, sans-serif", fontSize: tile * 0.64, fontWeight: 900, lineHeight: 1, boxShadow: \`\${(1 - attract) * 8}px \${6 + (1 - attract) * 9}px 15px #000A, inset 2px 2px 3px #FFFFFF42, 0 0 \${attract * 16}px \${polarity}55\`, transform: \`translate3d(\${startX * (1 - attract)}px, \${startY * (1 - attract) + bounce * (index % 2 === 0 ? -10 : 10)}px, 0) rotate(\${rotation * (1 - attract)}deg) scale(\${0.82 + attract * 0.18})\`, transformOrigin: "50% 50%" } }, character, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "18%", right: "18%", bottom: "8%", height: tile * 0.05, borderRadius: 99, background: "#08090A88" } }));
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", bottom: "16%", color: signal, fontFamily: "JetBrains Mono, monospace", fontSize: Math.max(9, ctx.width * 0.015), letterSpacing: "0.2em", opacity: 0.28 + attract * 0.5 } }, "N \\xB7 MAGNETIC LOCK \\xB7 S"));
  }
};
var T31_magnet_letters_effect_default = kernel;
`;export{t as default};
