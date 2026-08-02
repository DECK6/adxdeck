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
var F06_anamorphic_bokeh_effect_exports = {};
__export(F06_anamorphic_bokeh_effect_exports, {
  default: () => F06_anamorphic_bokeh_effect_default
});
module.exports = __toCommonJS(F06_anamorphic_bokeh_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const count = Math.min(24, Math.max(6, Math.round(Number(ctx.params.count ?? 15))));
    const stretch = Math.min(4.5, Math.max(1.5, Number(ctx.params.stretch ?? 2.8)));
    const depth = Math.min(1, Math.max(0.2, Number(ctx.params.depth ?? 0.72)));
    const flare = Math.min(1.5, Math.max(0, Number(ctx.params.flare ?? 0.82)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU;
    const focusBreath = 0.5 - 0.5 * Math.cos(phase);
    const flareY = 43 + Math.sin(phase) * 7;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "-2%",
          display: "grid",
          placeItems: "center",
          transform: \`scale(\${1.03 - focusBreath * 0.018})\`,
          filter: \`contrast(\${1.04 + focusBreath * 0.08}) brightness(\${0.72 + focusBreath * 0.12})\`
        }
      },
      ctx.subjectNode
    ), Array.from({ length: count }, (_, index) => {
      const plane = 0.2 + ctx.random(\`anamorphic:\${index}:plane\`) * 0.8;
      const orbit = 0.45 + ctx.random(\`anamorphic:\${index}:orbit\`) * 0.8;
      const angle = ctx.random(\`anamorphic:\${index}:phase\`) * TAU;
      const baseSize = 15 + plane * 42;
      const diameter = baseSize * (0.82 + focusBreath * plane * 0.34);
      const x = 4 + ctx.random(\`anamorphic:\${index}:x\`) * 92 + Math.sin(phase * orbit + angle) * 4 * depth;
      const y = 7 + ctx.random(\`anamorphic:\${index}:y\`) * 86 + Math.cos(phase * orbit + angle) * 3 * depth;
      const highlight = 0.16 + plane * 0.28 + Math.sin(phase + angle) * 0.08;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width: diameter * stretch,
            height: diameter,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: \`1px solid \${signal}88\`,
            opacity: highlight * depth,
            background: \`radial-gradient(ellipse at 38% 32%, #FFFFFF99 0 2%, \${signal}55 7%, \${signal}18 35%, transparent 70%)\`,
            boxShadow: \`0 0 \${diameter * 0.7}px \${signal}55, inset 0 0 \${diameter * 0.35}px \${signal}44\`,
            filter: \`blur(\${(1 - plane) * 5 + focusBreath * 1.5}px)\`,
            mixBlendMode: "screen"
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "-8%",
          right: "-8%",
          top: \`\${flareY}%\`,
          height: 2,
          opacity: flare * (0.34 + focusBreath * 0.26),
          background: \`linear-gradient(90deg, transparent, \${signal}22 18%, \${signal}CC 50%, \${signal}22 82%, transparent)\`,
          boxShadow: \`0 0 \${8 + flare * 16}px \${signal}, 0 0 \${30 + flare * 28}px \${signal}66\`,
          mixBlendMode: "screen"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 38%, #0D0E10CC 100%)",
          pointerEvents: "none"
        }
      }
    ));
  }
};
var F06_anamorphic_bokeh_effect_default = kernel;
`;export{n as default};
