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
var T13_outline_fill_effect_exports = {};
__export(T13_outline_fill_effect_exports, {
  default: () => T13_outline_fill_effect_default
});
module.exports = __toCommonJS(T13_outline_fill_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? "OUTLINE");
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const outlineWidth = Number(ctx.params.outlineWidth ?? 3);
    const glow = Number(ctx.params.glow ?? 16);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * Math.PI * 2 * cycles;
    const fill = 0.5 - 0.5 * Math.cos(phase);
    const textSize = Math.max(22, Math.min(ctx.width * 0.1, ctx.height * 0.26));
    const textBoxWidth = ctx.width * 0.82;
    const textStyle = {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: textSize,
      fontWeight: 900,
      lineHeight: 1,
      letterSpacing: "-0.055em",
      whiteSpace: "nowrap"
    };
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.06 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: textBoxWidth,
          height: textSize * 1.45,
          transform: "translate(-50%, -50%)"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            ...textStyle,
            color: "transparent",
            WebkitTextStroke: \`\${outlineWidth}px \${signal}\`,
            textShadow: \`0 0 \${glow}px \${signal}52\`
          }
        },
        phrase
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            width: fill * textBoxWidth,
            height: "100%",
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              ...textStyle,
              width: textBoxWidth,
              color: signal,
              textShadow: \`0 0 \${glow * 1.35}px \${signal}A6\`
            }
          },
          phrase
        )
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: fill * textBoxWidth,
            top: "-12%",
            width: Math.max(3, outlineWidth),
            height: "124%",
            background: signal,
            opacity: 0.55 + fill * 0.45,
            boxShadow: \`0 0 \${Math.max(8, glow)}px \${signal}\`,
            transform: "translateX(-50%)"
          }
        }
      )
    ));
  }
};
var T13_outline_fill_effect_default = kernel;
`;export{n as default};
