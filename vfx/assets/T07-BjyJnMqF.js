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
var T07_variable_weight_morph_effect_exports = {};
__export(T07_variable_weight_morph_effect_exports, {
  default: () => T07_variable_weight_morph_effect_default
});
module.exports = __toCommonJS(T07_variable_weight_morph_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "VARIABLE");
    const minWeight = Number(ctx.params.minWeight ?? 180);
    const maxWeight = Math.max(minWeight, Number(ctx.params.maxWeight ?? 880));
    const widthShift = Number(ctx.params.widthShift ?? 0.3);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * Math.PI * 2;
    const textSize = Math.max(22, Math.min(ctx.width * 0.115, ctx.height * 0.28));
    const characters = phrase.split("");
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "12% 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: signal,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: textSize,
          lineHeight: 0.9,
          letterSpacing: "-0.055em",
          whiteSpace: "pre"
        }
      },
      characters.map((character, index) => {
        const offset = characters.length > 1 ? index / (characters.length - 1) * Math.PI * 1.5 : 0;
        const wave = Math.sin(phase * 2 - offset);
        const mix = 0.5 + wave * 0.5;
        const weight = minWeight + (maxWeight - minWeight) * mix;
        const scaleX = 1 + wave * widthShift;
        const lift = Math.cos(phase * 2 - offset) * textSize * 0.11;
        return /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${index}\`,
            style: {
              display: "inline-block",
              minWidth: character === " " ? "0.42em" : void 0,
              fontWeight: Math.round(weight),
              fontVariationSettings: \`'wght' \${Math.round(weight)}, 'wdth' \${Math.round(100 + wave * widthShift * 70)}\`,
              transform: \`translate3d(0, \${lift}px, 0) scaleX(\${scaleX})\`,
              transformOrigin: "50% 70%",
              textShadow: \`0 0 \${8 + mix * 18}px \${signal}59\`
            }
          },
          character
        );
      })
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${12 + (0.5 + 0.5 * Math.sin(phase)) * 76}%\`,
          bottom: "17%",
          width: Math.max(8, textSize * 0.09),
          height: Math.max(8, textSize * 0.09),
          borderRadius: "50%",
          background: signal,
          boxShadow: \`0 0 18px \${signal}\`,
          transform: "translateX(-50%)"
        }
      }
    ));
  }
};
var T07_variable_weight_morph_effect_default = kernel;
`;export{t as default};
