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
var A10_beat_cut_effect_exports = {};
__export(A10_beat_cut_effect_exports, {
  default: () => A10_beat_cut_effect_default
});
module.exports = __toCommonJS(A10_beat_cut_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sensitivity = Math.min(2, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.2)));
    const tempo = String(ctx.params.tempo ?? "medium");
    const cutCount = Math.min(6, Math.max(3, Math.round(Number(ctx.params.cuts ?? 4))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const rms = Math.min(1, Math.max(0, ctx.audio?.rms ?? 0));
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const bass = Math.min(1, Math.max(0, ((bands[0] ?? 0) + (bands[1] ?? 0)) * 0.5));
    const energy = Math.min(1, (rms * 0.4 + bass * 0.6) * sensitivity);
    const cycles = tempo === "slow" ? 2 : tempo === "fast" ? 4 : 3;
    const beatCount = cutCount * cycles;
    const beatPosition = ctx.t % 1 * beatCount;
    const beatIndex = Math.floor(beatPosition);
    const beatPhase = beatPosition - beatIndex;
    const audioKick = energy > 0.58 ? 1 : 0;
    const scene = (beatIndex + audioKick) % cutCount;
    const composition = scene % 4;
    const flash = Math.max(0, 1 - beatPhase * 8) * (0.18 + energy * 0.38);
    const subjectScale = composition === 0 ? 0.92 : composition === 1 ? 1.32 : composition === 2 ? 1.05 : 1.5;
    const subjectX = composition === 1 ? -ctx.width * 0.12 : composition === 2 ? ctx.width * 0.11 : 0;
    const subjectY = composition === 3 ? ctx.height * 0.08 : 0;
    const clipPath = composition === 2 ? "polygon(0 0, 66% 0, 48% 100%, 0 100%)" : composition === 3 ? "inset(13% 12% 13% 12%)" : "none";
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#FFFFFF" } }, composition === 0 ? /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "50%", height: 1, background: \`\${signal}88\`, boxShadow: \`0 0 18px \${signal}\` } }) : null, composition === 1 ? /* @__PURE__ */ h("div", { style: { position: "absolute", right: 0, top: 0, width: "28%", height: "100%", background: signal, opacity: 0.13 } }) : null, composition === 2 ? /* @__PURE__ */ h("div", { style: { position: "absolute", right: "8%", top: "12%", bottom: "12%", width: "24%", border: \`2px solid \${signal}\`, background: \`\${signal}18\` } }) : null, composition === 3 ? /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "8%", border: \`1px solid \${signal}77\`, transform: "rotate(-3deg)" } }) : null, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, clipPath, opacity: 0.82 + energy * 0.18, transform: \`translate3d(\${subjectX}px, \${subjectY}px, 0) scale(\${subjectScale}) rotate(\${composition === 3 ? -3 : 0}deg)\`, filter: \`contrast(\${1.02 + energy * 0.32}) drop-shadow(0 0 \${5 + energy * 18}px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: signal, opacity: flash, mixBlendMode: "screen" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "5%", top: "6%", fontFamily: "JetBrains Mono, monospace", fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 800, letterSpacing: "0.12em" } }, "CUT ", /* @__PURE__ */ h("span", { style: { color: signal } }, String(scene + 1).padStart(2, "0"))), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "5%", right: "5%", bottom: "6%", display: "flex", gap: 4 } }, Array.from({ length: cutCount }, (_, index) => /* @__PURE__ */ h("div", { key: index, style: { flex: 1, height: index === scene ? 5 : 2, background: index === scene ? signal : "#FFFFFF5C", boxShadow: index === scene ? \`0 0 10px \${signal}\` : "none" } }))));
  }
};
var A10_beat_cut_effect_default = kernel;
`;export{t as default};
