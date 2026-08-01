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
var T05_typewriter_caret_effect_exports = {};
__export(T05_typewriter_caret_effect_exports, {
  default: () => T05_typewriter_caret_effect_default
});
module.exports = __toCommonJS(T05_typewriter_caret_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "DEXA SIGNAL");
    const speed = Math.max(1, Number(ctx.params.speed ?? 11));
    const caret = String(ctx.params.caret ?? "block");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const elapsed = Math.max(0, ctx.t - 0.08) * 6;
    const count = Math.min(phrase.length, Math.floor(elapsed * speed));
    const typed = phrase.slice(0, count);
    const reveal = Math.min(1, elapsed * speed);
    const blinkFrames = Math.max(1, Math.round(ctx.fps * 0.38));
    const caretOn = Math.floor(ctx.frame / blinkFrames) % 2 === 0;
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const caretShape = caret === "line" ? { width: "0.12em", height: "1em", marginLeft: "0.12em" } : caret === "underscore" ? { width: "0.68em", height: "0.1em", marginLeft: "0.08em", alignSelf: "flex-end" } : { width: "0.58em", height: "1em", marginLeft: "0.12em" };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: (0.07 + reveal * 0.18) * outro,
          filter: \`blur(\${(1 - reveal) * 3}px)\`,
          transform: \`translate3d(\${(1 - reveal) * ctx.width * 0.025}px, 0, 0)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          minWidth: "72%",
          color: signal,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(18, Math.min(ctx.width * 0.07, ctx.height * 0.25)),
          fontWeight: 700,
          letterSpacing: "0.08em",
          whiteSpace: "pre",
          textShadow: \`0 0 18px \${signal}4D\`,
          opacity: outro
        }
      },
      /* @__PURE__ */ h("span", null, typed),
      /* @__PURE__ */ h(
        "span",
        {
          style: {
            ...caretShape,
            display: "inline-block",
            flex: "0 0 auto",
            background: signal,
            boxShadow: \`0 0 12px \${signal}\`,
            opacity: caretOn ? 0.95 : 0.08
          }
        }
      )
    ));
  }
};
var T05_typewriter_caret_effect_default = kernel;
`;export{e as default};
