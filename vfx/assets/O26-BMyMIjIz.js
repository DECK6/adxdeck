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
var O26_cloth_wave_effect_exports = {};
__export(O26_cloth_wave_effect_exports, {
  default: () => O26_cloth_wave_effect_default
});
module.exports = __toCommonJS(O26_cloth_wave_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const folds = Math.max(2, Math.round(Number(ctx.params.folds ?? 4)));
    const amplitude = Number(ctx.params.amplitude ?? 0.13);
    const breeze = Math.max(1, Math.round(Number(ctx.params.breeze ?? 2)));
    const slices = Math.max(10, Math.min(20, Math.round(Number(ctx.params.slices ?? 16))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = TAU * breeze * ctx.t;
    const panelW = ctx.width * 0.66;
    const panelH = ctx.height * 0.54;
    const sliceW = panelW / slices;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", top: "14%", width: 3, height: "72%", background: \`linear-gradient(#D9E0E5, \${signal}55)\`, boxShadow: \`0 0 12px \${signal}44\` } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", top: "20%", width: panelW, height: panelH, perspective: ctx.width * 1.1, transformStyle: "preserve-3d" } }, Array.from({ length: slices }, (_, index) => {
      const x = index / Math.max(1, slices - 1);
      const envelope = Math.sin(x * Math.PI * 0.5);
      const wave = Math.sin(x * TAU * folds - phase);
      const y = ctx.height * amplitude * envelope * wave;
      const z = ctx.height * amplitude * 0.7 * envelope * Math.cos(x * TAU * folds - phase);
      const shade = 0.18 + 0.22 * (1 + wave);
      return /* @__PURE__ */ h("div", { key: index, style: { position: "absolute", left: index * sliceW, top: 0, width: sliceW + 1, height: panelH, overflow: "hidden", transformStyle: "preserve-3d", transform: \`translate3d(0, \${y}px, \${z}px) rotateY(\${wave * 12 * envelope}deg)\`, transformOrigin: "center center" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: -index * sliceW, top: 0, width: panelW, height: panelH } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: index % 2 === 0 ? \`linear-gradient(90deg, #000000\${Math.round(shade * 255).toString(16).padStart(2, "0")}, transparent)\` : \`linear-gradient(90deg, transparent, \${signal}24)\`, mixBlendMode: "multiply" } }));
    })), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "12%", top: "20%", width: panelW, height: panelH, border: \`1px solid \${signal}55\`, pointerEvents: "none" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "6%", bottom: "6%", color: signal, fontFamily: "monospace", letterSpacing: "0.16em", opacity: 0.7 } }, "WARP / ", slices, " STRIPS"));
  }
};
var O26_cloth_wave_effect_default = kernel;
`;export{e as default};
