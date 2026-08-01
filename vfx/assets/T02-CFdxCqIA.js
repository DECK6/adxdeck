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
var T02_scramble_decode_effect_exports = {};
__export(T02_scramble_decode_effect_exports, {
  default: () => T02_scramble_decode_effect_default
});
module.exports = __toCommonJS(T02_scramble_decode_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1.4);
    const spread = Number(ctx.params.spread ?? 0.5);
    const glow = Number(ctx.params.glow ?? 0.55);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const answer = "DEXA VFX";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%?";
    const tick = Math.floor(ctx.frame * speed * 0.35);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const decoded = answer.split("").map((character, index) => {
      if (character === " ") return " ";
      const lockAt = 0.14 + index / answer.length * spread + ctx.random(\`lock:\${index}\`) * 0.08;
      if (ctx.t >= lockAt) return character;
      const choice = Math.floor(ctx.random(\`glyph:\${index}:\${tick}\`) * alphabet.length);
      return alphabet[choice] ?? character;
    });
    const resolved = decoded.filter((character, index) => character === answer[index]).length / answer.length;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: (0.16 + resolved * 0.84) * outro,
          filter: \`blur(\${(1 - resolved) * 6}px)\`,
          transform: \`scale(\${0.96 + resolved * 0.04})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "18%",
          transform: "translateX(-50%)",
          display: "flex",
          color: signal,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(12, ctx.width * 0.035),
          fontWeight: 700,
          letterSpacing: "0.16em",
          whiteSpace: "pre",
          textShadow: \`0 0 \${10 + glow * 22}px \${signal}\`,
          opacity: outro
        }
      },
      decoded.map((character, index) => /* @__PURE__ */ h("span", { key: index, style: { opacity: character === answer[index] ? 1 : 0.55 } }, character))
    ));
  }
};
var T02_scramble_decode_effect_default = kernel;
`;export{e as default};
