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
var L11_halation_effect_exports = {};
__export(L11_halation_effect_exports, {
  default: () => L11_halation_effect_default
});
module.exports = __toCommonJS(L11_halation_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const spread = Number(ctx.params.spread ?? 32);
    const drift = Number(ctx.params.drift ?? 0.24);
    const hotspots = Math.max(2, Math.round(Number(ctx.params.hotspots ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const turn = phase * Math.PI * 2;
    const fieldX = 50 + Math.sin(turn) * 34 * drift * 2.5;
    const fieldY = 50 + Math.cos(turn * 2) * 22 * drift * 2.5;
    const mask = \`radial-gradient(ellipse at \${fieldX}% \${fieldY}%, black 0%, black 21%, transparent 68%)\`;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 } }, ctx.subjectNode), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          maskImage: mask,
          WebkitMaskImage: mask,
          transform: \`translate3d(\${Math.sin(turn) * drift * 18}px, \${Math.cos(turn) * drift * 12}px, 0) scale(\${1 + intensity * 0.025})\`,
          filter: \`brightness(\${1.15 + intensity * 1.15}) blur(\${1 + intensity * 2.4}px) drop-shadow(0 0 \${spread}px \${signal})\`,
          mixBlendMode: "screen",
          opacity: 0.28 + intensity * 0.48
        }
      },
      ctx.subjectNode
    ), Array.from({ length: hotspots }, (_, index) => {
      const local = turn + index / hotspots * Math.PI * 2;
      const x = 50 + Math.cos(local) * (18 + index * 6) * drift * 2.7;
      const y = 50 + Math.sin(local * (index % 2 === 0 ? 1.5 : -1.25)) * (14 + index * 4) * drift * 2.4;
      const size = spread * (1.25 + index * 0.28);
      const glow = 0.52 + 0.48 * Math.sin(local + Math.PI / 2) ** 2;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width: size,
            height: size,
            borderRadius: "50%",
            background: \`radial-gradient(circle, #FFFFFF\${intensity > 0.65 ? "B8" : "80"} 0 5%, \${signal}8F 13%, \${signal}30 38%, transparent 72%)\`,
            filter: \`blur(\${2 + spread * 0.08}px)\`,
            opacity: intensity * glow,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen"
          }
        }
      );
    }));
  }
};
var L11_halation_effect_default = kernel;
`;export{n as default};
