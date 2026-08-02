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
var U15_card_carousel_effect_exports = {};
__export(U15_card_carousel_effect_exports, {
  default: () => U15_card_carousel_effect_default
});
module.exports = __toCommonJS(U15_card_carousel_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const cardCount = Math.min(7, Math.max(3, Math.round(Number(ctx.params.cards ?? 5))));
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const depth = Math.min(1, Math.max(0.4, Number(ctx.params.depth ?? 0.78)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const travel = ctx.t * cycles % 1 * cardCount;
    const cardWidth = Math.min(ctx.width * 0.34, ctx.height * 0.68);
    const cardHeight = cardWidth * 1.12;
    const spacing = cardWidth * 0.74;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.48;
    const labels = ["PRISM", "VECTOR", "SIGNAL", "GRAIN", "CHROMA", "DEPTH", "FRAME"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F5FAFC", fontFamily: "'JetBrains Mono', monospace", perspective: Math.max(700, ctx.width * 1.1) } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08, transform: "scale(0.82)" } }, ctx.subjectNode), Array.from({ length: cardCount }, (_, index) => {
      let offset = index - travel;
      while (offset > cardCount / 2) offset -= cardCount;
      while (offset < -cardCount / 2) offset += cardCount;
      const distance = Math.abs(offset);
      const focus = Math.max(0, 1 - distance);
      const scale = 1 - Math.min(0.3, distance * 0.11 * depth);
      const x = centerX + offset * spacing - cardWidth * 0.5;
      const y = centerY - cardHeight * 0.5 + distance * cardHeight * 0.035 * depth;
      const rotate = offset * -12 * depth;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          "data-layout-allow-overlap": true,
          "data-layout-allow-occlusion": true,
          style: {
            position: "absolute",
            left: x,
            top: y,
            width: cardWidth,
            height: cardHeight,
            boxSizing: "border-box",
            padding: cardWidth * 0.08,
            borderRadius: cardWidth * 0.065,
            border: \`1px solid \${focus > 0.5 ? signal : "#3C434B"}\`,
            background: focus > 0.5 ? "#17242AF7" : "#15181CEB",
            boxShadow: focus > 0.5 ? \`0 22px 55px #000000CC, 0 0 25px \${signal}35\` : "0 14px 34px #00000099",
            transform: \`rotateY(\${rotate}deg) scale(\${scale + focus * 0.04}) translateZ(\${focus * 45}px)\`,
            opacity: Math.max(0.28, 1 - distance * 0.2),
            zIndex: 100 - Math.round(distance * 10),
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ h("div", { style: { color: focus > 0.5 ? signal : "#B8C2C9", fontSize: Math.max(8, cardWidth * 0.045), letterSpacing: "0.12em" } }, "DEXA / ", String(index + 1).padStart(2, "0")),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "22%", height: "43%", borderRadius: cardWidth * 0.035, border: "1px solid #FFFFFF1F", background: \`linear-gradient(145deg, \${signal}24, #0D0E1000 65%)\` } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: "50%", width: "32%", aspectRatio: "1", border: \`2px solid \${signal}\`, transform: \`translate(-50%, -50%) rotate(\${45 + offset * 8}deg)\`, opacity: 0.45 + focus * 0.5 } })),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", bottom: "19%", color: "#F8FBFC", fontSize: Math.max(11, cardWidth * 0.078), fontWeight: 800, letterSpacing: "0.08em" } }, labels[index]),
        /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", bottom: "10%", width: \`\${34 + index * 6}%\`, height: 4, borderRadius: 4, background: focus > 0.5 ? signal : "#637079" } })
      );
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", bottom: "8%", transform: "translateX(-50%)", display: "flex", gap: 7 } }, Array.from({ length: cardCount }, (_, index) => {
      const distance = Math.min(Math.abs(index - travel), cardCount - Math.abs(index - travel));
      const active = Math.max(0, 1 - distance);
      return /* @__PURE__ */ h("div", { key: index, style: { width: 7 + active * 18, height: 7, borderRadius: 999, background: active > 0.5 ? signal : "#505961", boxShadow: active > 0.5 ? \`0 0 10px \${signal}\` : "none" } });
    })));
  }
};
var U15_card_carousel_effect_default = kernel;
`;export{t as default};
