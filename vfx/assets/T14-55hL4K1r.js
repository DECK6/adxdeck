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
var T14_letter_explode_effect_exports = {};
__export(T14_letter_explode_effect_exports, {
  default: () => T14_letter_explode_effect_default
});
module.exports = __toCommonJS(T14_letter_explode_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const spread = Number(ctx.params.spread ?? 0.3);
    const spin = Number(ctx.params.spin ?? 125);
    const depth = Number(ctx.params.depth ?? 95);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const blast = Math.pow(Math.sin(phase * Math.PI), 0.82);
    const turn = phase * Math.PI * 2;
    const phrase = (ctx.subject.label || "DEXA").toUpperCase();
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", display: "grid", placeItems: "center", background: "#0D0E10", perspective: ctx.width * 1.15 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.07 + (1 - blast) * 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: signal,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(24, Math.min(ctx.width * 0.105, ctx.height * 0.25)),
          fontWeight: 800,
          letterSpacing: "0.035em",
          lineHeight: 1,
          whiteSpace: "pre",
          transformStyle: "preserve-3d"
        }
      },
      phrase.split("").map((character, index) => {
        const angle = ctx.random(\`angle:\${index}\`) * Math.PI * 2;
        const force = 0.58 + ctx.random(\`force:\${index}\`) * 0.64;
        const twist = (ctx.random(\`twist:\${index}\`) * 2 - 1) * spin;
        const driftX = Math.cos(angle + turn * (index % 2 === 0 ? 0.16 : -0.16)) * ctx.width * spread * force * blast;
        const driftY = Math.sin(angle - turn * 0.12) * ctx.height * spread * force * blast;
        const driftZ = (ctx.random(\`depth:\${index}\`) * 2 - 1) * depth * blast;
        const rotation = twist * blast + Math.sin(turn + index) * 10 * blast;
        return /* @__PURE__ */ h(
          "span",
          {
            key: \`\${character}:\${index}\`,
            style: {
              display: "inline-block",
              minWidth: character === " " ? "0.55em" : void 0,
              opacity: 1 - blast * (0.18 + ctx.random(\`fade:\${index}\`) * 0.28),
              transform: \`translate3d(\${driftX}px, \${driftY}px, \${driftZ}px) rotateZ(\${rotation}deg) rotateY(\${rotation * 0.55}deg)\`,
              textShadow: \`0 0 \${8 + blast * 22}px \${signal}\`,
              filter: \`blur(\${blast * ctx.random(\`blur:\${index}\`) * 1.4}px)\`,
              transformStyle: "preserve-3d"
            }
          },
          character
        );
      })
    ));
  }
};
var T14_letter_explode_effect_default = kernel;
`;export{e as default};
