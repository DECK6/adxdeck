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
var Z03_split_flap_effect_exports = {};
__export(Z03_split_flap_effect_exports, {
  default: () => Z03_split_flap_effect_default
});
module.exports = __toCommonJS(Z03_split_flap_effect_exports);
const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const kernel = {
  kind: "react",
  render: (ctx) => {
    const cells = Math.max(4, Math.round(Number(ctx.params.cells ?? 7)));
    const speed = Math.max(1, Number(ctx.params.speed ?? 2));
    const stagger = Math.min(0.8, Math.max(0, Number(ctx.params.stagger ?? 0.34)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.frame % Math.max(1, ctx.durationInFrames) / Math.max(1, ctx.durationInFrames);
    const label = ctx.subject.label.toUpperCase().replace(/[^ A-Z0-9]/g, "").padEnd(cells, " ").slice(0, cells);
    const cellWidth = Math.min(ctx.width * 0.11, ctx.height * 0.17);
    const cellHeight = cellWidth * 1.35;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "5% 8% 28%", opacity: 0.32, filter: "contrast(1.15)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "70%", transform: "translate(-50%, -50%)", display: "flex", gap: Math.max(3, cellWidth * 0.06), padding: cellWidth * 0.12, background: "#08090A", border: "1px solid #33383D", boxShadow: "0 16px 38px #000B" } }, label.split("").map((target, index) => {
      const cycle = phase * speed * ALPHABET.length - index * stagger * 4;
      const step = (Math.floor(cycle) % ALPHABET.length + ALPHABET.length) % ALPHABET.length;
      const local = cycle - Math.floor(cycle);
      const targetIndex = Math.max(0, ALPHABET.indexOf(target));
      const locked = phase > 0.64 && phase < 0.9;
      const currentChar = locked ? target : ALPHABET[step];
      const nextChar = locked ? target : ALPHABET[(step + 1) % ALPHABET.length];
      const flip = locked ? 0 : Math.min(1, local * 1.65);
      const glyphStyle = { position: "absolute", left: 0, width: "100%", height: cellHeight, display: "grid", placeItems: "center", color: "#F5F7F8", fontFamily: "JetBrains Mono, monospace", fontSize: cellHeight * 0.62, fontWeight: 800, lineHeight: 1 };
      const displayChar = locked ? ALPHABET[targetIndex] : currentChar;
      return /* @__PURE__ */ h("div", { key: index, "data-layout-allow-overlap": true, "data-layout-allow-occlusion": true, style: { position: "relative", width: cellWidth, height: cellHeight, background: "#17191C", border: "1px solid #34383C", borderRadius: 3, overflow: "hidden", transformStyle: "preserve-3d" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden" } }, /* @__PURE__ */ h("div", { style: glyphStyle }, nextChar)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "50%", overflow: "hidden", background: "#202327" } }, /* @__PURE__ */ h("div", { style: glyphStyle }, displayChar)), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "50%", overflow: "hidden", background: "#151719" } }, /* @__PURE__ */ h("div", { style: { ...glyphStyle, bottom: 0 } }, nextChar)), !locked && flip < 0.5 ? /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "50%", overflow: "hidden", background: "#202327", transformOrigin: "50% 100%", transform: \`rotateX(\${-flip * 180}deg)\`, backfaceVisibility: "hidden", zIndex: 3 } }, /* @__PURE__ */ h("div", { style: glyphStyle }, currentChar)) : null, !locked && flip >= 0.5 ? /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, top: "50%", width: "100%", height: "50%", overflow: "hidden", background: "#151719", transformOrigin: "50% 0", transform: \`rotateX(\${(1 - flip) * 180}deg)\`, backfaceVisibility: "hidden", zIndex: 3 } }, /* @__PURE__ */ h("div", { style: { ...glyphStyle, bottom: 0 } }, nextChar)) : null, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: 2, transform: "translateY(-1px)", background: "#050607", boxShadow: \`0 0 4px \${signal}33\`, zIndex: 5 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 3, top: "50%", width: 3, height: 3, borderRadius: "50%", transform: "translateY(-50%)", background: signal, zIndex: 6 } }));
    })));
  }
};
var Z03_split_flap_effect_default = kernel;
`;export{e as default};
