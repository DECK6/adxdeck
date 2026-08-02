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
var H18_wave_bands_effect_exports = {};
__export(H18_wave_bands_effect_exports, {
  default: () => H18_wave_bands_effect_default
});
module.exports = __toCommonJS(H18_wave_bands_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const bands = Math.max(4, Math.round(Number(ctx.params.bands ?? 7)));
    const amplitude = Number(ctx.params.amplitude ?? 30);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * TAU * speed;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #10181C 0%, #0D0E10 100%)" } }, Array.from({ length: bands }, (_, index) => {
      const depth = (index + 1) / bands;
      const y = 10 + depth * 78 + Math.sin(phase * (1 + index % 2) + index * 1.17) * amplitude * (0.25 + depth * 0.75);
      const tilt = Math.cos(phase + index * 0.8) * (1.2 + depth * 2.6);
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: "-18%",
            top: \`\${y}%\`,
            width: "136%",
            height: \`\${8 + depth * 10}%\`,
            borderRadius: "50%",
            borderTop: \`2px solid \${signal}\${index % 2 === 0 ? "70" : "3D"}\`,
            background: \`linear-gradient(180deg, \${signal}\${index % 2 === 0 ? "20" : "12"}, transparent 76%)\`,
            filter: \`blur(\${(1 - depth) * 2.2}px)\`,
            opacity: 0.32 + depth * 0.42,
            transform: \`rotate(\${tilt}deg) scaleY(\${0.72 + depth * 0.5})\`,
            transformOrigin: "50% 0%"
          }
        }
      );
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 0.24, transform: "scale(0.92)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, #0D0E107A 0%, transparent 26%, transparent 74%, #0D0E107A 100%)" } }));
  }
};
var H18_wave_bands_effect_default = kernel;
`;export{e as default};
