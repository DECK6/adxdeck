const n=`var __defProp = Object.defineProperty;
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
var T11_stretch_squash_effect_exports = {};
__export(T11_stretch_squash_effect_exports, {
  default: () => T11_stretch_squash_effect_default
});
module.exports = __toCommonJS(T11_stretch_squash_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "BOUNCE");
    const amount = Number(ctx.params.amount ?? 0.62);
    const tempo = Math.max(1, Math.round(Number(ctx.params.tempo ?? 2)));
    const stagger = Number(ctx.params.stagger ?? 0.75);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * Math.PI * 2 * tempo;
    const textSize = Math.max(24, Math.min(ctx.width * 0.13, ctx.height * 0.31));
    const characters = phrase.split("");
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.06 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "49%",
          display: "flex",
          alignItems: "flex-end",
          transform: "translate(-50%, -50%)",
          color: signal,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: textSize,
          fontWeight: 900,
          lineHeight: 0.8,
          letterSpacing: "-0.07em",
          whiteSpace: "pre"
        }
      },
      characters.map((character, index) => {
        const wave = Math.sin(phase - index * stagger);
        const yScale = 1 + wave * amount * 0.72;
        const xScale = 1 - wave * amount * 0.42;
        const lift = Math.max(0, wave) * -textSize * amount * 0.24;
        return /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${index}\`,
            style: {
              display: "inline-block",
              minWidth: character === " " ? "0.38em" : void 0,
              transform: \`translate3d(0, \${lift}px, 0) scale(\${xScale}, \${yScale})\`,
              transformOrigin: "50% 100%",
              textShadow: \`0 \${8 + Math.max(0, wave) * 12}px \${14 + amount * 18}px \${signal}52\`
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
          left: "13%",
          right: "13%",
          top: "66%",
          height: 3,
          background: signal,
          opacity: 0.5,
          transform: \`scaleX(\${0.62 + Math.sin(phase) * 0.28})\`,
          boxShadow: \`0 0 14px \${signal}\`
        }
      }
    ));
  }
};
var T11_stretch_squash_effect_default = kernel;
`;export{n as default};
