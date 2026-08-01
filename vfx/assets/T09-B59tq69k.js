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
var T09_char_flip_3d_effect_exports = {};
__export(T09_char_flip_3d_effect_exports, {
  default: () => T09_char_flip_3d_effect_default
});
module.exports = __toCommonJS(T09_char_flip_3d_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA VFX");
    const stagger = Number(ctx.params.stagger ?? 0.065);
    const depth = Number(ctx.params.depth ?? 80);
    const direction = String(ctx.params.direction ?? "alternate");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.25 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.09 * outro } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          display: "flex",
          transform: "translate(-50%, -50%)",
          transformStyle: "preserve-3d",
          color: signal,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(18, Math.min(ctx.width * 0.095, ctx.height * 0.28)),
          fontWeight: 800,
          letterSpacing: "0.04em",
          whiteSpace: "pre"
        }
      },
      phrase.split("").map((character, index) => {
        const raw = Math.min(1, Math.max(0, (ctx.t - 0.06 - index * stagger) / 0.22));
        const progress = raw * raw * (3 - 2 * raw);
        const sign = direction === "alternate" && index % 2 === 1 ? -1 : 1;
        const rotation = sign * (1 - progress) * 92;
        return /* @__PURE__ */ h(
          "span",
          {
            key: index,
            style: {
              display: "inline-block",
              minWidth: character === " " ? "0.55em" : void 0,
              opacity: progress * outro,
              transformOrigin: "50% 58%",
              transformStyle: "preserve-3d",
              transform: \`translateZ(\${-(1 - progress) * depth}px) translateY(\${(1 - progress) * ctx.height * 0.06}px) rotateX(\${rotation}deg)\`,
              filter: \`brightness(\${0.45 + progress * 0.55}) blur(\${(1 - progress) * 2}px)\`,
              textShadow: \`0 \${Math.max(2, depth * 0.08)}px \${Math.max(8, depth * 0.22)}px \${signal}52\`,
              backfaceVisibility: "hidden"
            }
          },
          character
        );
      })
    ));
  }
};
var T09_char_flip_3d_effect_default = kernel;
`;export{e as default};
