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
var E06_duotone_map_effect_exports = {};
__export(E06_duotone_map_effect_exports, {
  default: () => E06_duotone_map_effect_default
});
module.exports = __toCommonJS(E06_duotone_map_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const contrast = Number(ctx.params.contrast ?? 1.65);
    const mix = Number(ctx.params.mix ?? 0.88);
    const shadow = String(ctx.params.shadow ?? "#0D0E10");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const turn = ctx.t * Math.PI * 2;
    const breathingContrast = contrast * (0.94 + Math.sin(turn) * 0.06);
    const wipe = 50 + Math.sin(turn) * 46;
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          isolation: "isolate",
          background: shadow
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            filter: \`grayscale(1) contrast(\${breathingContrast}) brightness(0.92)\`
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: \`\${wipe}%\`,
            overflow: "hidden",
            background: \`linear-gradient(118deg, \${shadow} 0%, \${signal} 130%)\`,
            mixBlendMode: "multiply",
            opacity: mix
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: \`\${wipe}%\`,
            width: 2,
            marginLeft: -1,
            background: signal,
            opacity: 0.85,
            boxShadow: \`0 0 14px \${signal}\`
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            opacity: mix * 0.28,
            filter: \`contrast(\${1.15 + contrast * 0.12}) drop-shadow(0 0 10px \${signal})\`,
            mixBlendMode: "screen"
          }
        },
        ctx.subjectNode
      )
    );
  }
};
var E06_duotone_map_effect_default = kernel;
`;export{n as default};
