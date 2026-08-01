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
var X03_zoom_punch_effect_exports = {};
__export(X03_zoom_punch_effect_exports, {
  default: () => X03_zoom_punch_effect_default
});
module.exports = __toCommonJS(X03_zoom_punch_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.78);
    const blurAmount = Number(ctx.params.blur ?? 18);
    const duration = Number(ctx.params.duration ?? 0.11);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const firstDistance = Math.abs(ctx.t - 0.25);
    const secondDistance = Math.abs(ctx.t - 0.75);
    const distance = Math.min(firstDistance, secondDistance);
    const rawPunch = Math.max(0, 1 - distance / Math.max(0.01, duration));
    const punch = rawPunch * rawPunch * (3 - 2 * rawPunch);
    const sceneB = ctx.t >= 0.25 && ctx.t < 0.75;
    const beforeCut = ctx.t < 0.25 || ctx.t >= 0.75;
    const direction = beforeCut ? 1 : -1;
    const scale = 1 + punch * intensity * (direction > 0 ? 0.42 : 0.24);
    const blur = punch * blurAmount;
    const opacity = 1 - punch * 0.16;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: sceneB ? "#F5F1E6" : "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: sceneB ? "#F5F1E6" : "#0D0E10",
          transform: \`scale(\${scale})\`,
          filter: \`blur(\${blur}px)\`,
          opacity
        }
      },
      sceneB ? /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 } }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            backgroundImage: "repeating-linear-gradient(100deg, transparent 0 86px, rgba(23,24,26,0.1) 86px 89px)"
          }
        }
      ), /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            filter: "grayscale(1) contrast(1.45) brightness(0.45)",
            mixBlendMode: "multiply"
          }
        },
        ctx.subjectNode
      ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", top: "17%", width: "26%", height: 10, background: "#17181A", transform: "rotate(-5deg)" } }), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "11%", bottom: "16%", width: 60, height: 60, border: "8px solid #17181A", transform: "rotate(12deg)" } })) : /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center" } }, ctx.subjectNode)
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: \`\${20 + punch * 95}%\`,
          height: 2 + punch * 10,
          background: sceneB ? "#17181A" : signal,
          transform: "translate(-50%, -50%)",
          opacity: punch * 0.9,
          boxShadow: \`0 0 \${8 + punch * 34}px \${signal}\`
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          right: 38,
          bottom: 30,
          color: sceneB ? "#17181A" : signal,
          fontFamily: "monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.22em"
        }
      },
      "DEXA VFX / PUNCH"
    ));
  }
};
var X03_zoom_punch_effect_default = kernel;
`;export{n as default};
