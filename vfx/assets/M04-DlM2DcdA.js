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
var M04_alpha_matte_effect_exports = {};
__export(M04_alpha_matte_effect_exports, {
  default: () => M04_alpha_matte_effect_default
});
module.exports = __toCommonJS(M04_alpha_matte_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const windows = Math.min(7, Math.max(3, Math.round(Number(ctx.params.windows ?? 5))));
    const travel = Math.min(38, Math.max(8, Number(ctx.params.travel ?? 26)));
    const softness = Math.min(30, Math.max(0, Number(ctx.params.softness ?? 12)));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * cycles;
    const baseWidth = ctx.width / (windows + 1.8);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.055, filter: "grayscale(1)" } }, ctx.subjectNode), Array.from({ length: windows }, (_, index) => {
      const localPhase = phase + index / windows * TAU;
      const baseX = (index + 0.5) / windows * ctx.width;
      const centerX = baseX + Math.sin(localPhase) * ctx.width * travel * 0.01;
      const centerY = ctx.height * (0.5 + Math.cos(localPhase * 0.5 + index) * 0.11);
      const width = baseWidth * (0.68 + (0.5 + 0.5 * Math.cos(localPhase)) * 0.62);
      const height = ctx.height * (0.42 + (0.5 + 0.5 * Math.sin(localPhase)) * 0.46);
      const left = centerX - width * 0.5;
      const top = centerY - height * 0.5;
      const edge = softness * 0.5;
      const matte = \`linear-gradient(90deg, transparent 0%, #000 \${edge}%, #000 \${100 - edge}%, transparent 100%)\`;
      const opacity = 0.64 + (0.5 + 0.5 * Math.sin(localPhase + 0.7)) * 0.36;
      return /* @__PURE__ */ h("div", { key: index }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left,
            top,
            width,
            height,
            overflow: "hidden",
            borderRadius: Math.min(width, height) * 0.32,
            opacity,
            maskImage: matte,
            WebkitMaskImage: matte,
            boxShadow: \`0 0 \${18 + softness}px \${signal}44\`
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: -left,
              top: -top,
              width: ctx.width,
              height: ctx.height
            }
          },
          ctx.subjectNode
        ),
        /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: signal, opacity: 0.035 + index * 0.012 } })
      ), /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left,
            top,
            width,
            height,
            border: \`1px solid \${signal}\`,
            borderRadius: Math.min(width, height) * 0.32,
            boxSizing: "border-box",
            opacity: 0.16 + opacity * 0.2,
            transform: \`scale(\${1.025 + Math.sin(localPhase) * 0.018})\`,
            boxShadow: \`inset 0 0 \${10 + softness}px \${signal}22\`
          }
        }
      ));
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${12 + (0.5 + 0.5 * Math.sin(phase)) * 76}%\`,
          bottom: "7%",
          width: \`\${8 + (0.5 + 0.5 * Math.cos(phase)) * 18}%\`,
          height: 3,
          borderRadius: 999,
          background: signal,
          opacity: 0.72,
          transform: "translateX(-50%)",
          boxShadow: \`0 0 14px \${signal}\`
        }
      }
    ));
  }
};
var M04_alpha_matte_effect_default = kernel;
`;export{n as default};
