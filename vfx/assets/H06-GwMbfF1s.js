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
var H06_bokeh_field_effect_exports = {};
__export(H06_bokeh_field_effect_exports, {
  default: () => H06_bokeh_field_effect_default
});
module.exports = __toCommonJS(H06_bokeh_field_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const count = Math.min(24, Math.max(8, Math.round(Number(ctx.params.count ?? 15))));
    const radius = Math.min(190, Math.max(60, Number(ctx.params.radius ?? 118)));
    const drift = Math.min(20, Math.max(4, Number(ctx.params.drift ?? 11)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(circle at 48% 44%, #152027 0%, #0D0E10 58%, #08090B 100%)" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.25 } }, ctx.subjectNode), Array.from({ length: count }, (_, index) => {
      const layer = index % 3;
      const depth = [0.38, 0.64, 1][layer];
      const harmonic = 1 + Math.floor(ctx.random(\`bokeh:\${index}:harmonic\`) * 2);
      const phase = ctx.random(\`bokeh:\${index}:phase\`) * TAU;
      const diameter = radius * depth * (0.72 + ctx.random(\`bokeh:\${index}:size\`) * 0.64);
      const x = 4 + ctx.random(\`bokeh:\${index}:x\`) * 92 + Math.sin(ctx.t * TAU * harmonic + phase) * drift * depth;
      const y = 5 + ctx.random(\`bokeh:\${index}:y\`) * 90 + Math.cos(ctx.t * TAU * harmonic + phase * 1.31) * drift * 0.62 * depth;
      const shimmer = 0.72 + 0.18 * Math.sin(ctx.t * TAU * harmonic + phase * 0.8);
      const blur = layer === 0 ? diameter * 0.11 : layer === 1 ? diameter * 0.055 : diameter * 0.025;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: \`\${x}%\`,
            top: \`\${y}%\`,
            width: diameter,
            height: diameter,
            marginLeft: -diameter / 2,
            marginTop: -diameter / 2,
            borderRadius: "50%",
            border: \`1px solid \${signal}\${layer === 2 ? "52" : "2E"}\`,
            background: \`radial-gradient(circle at 34% 30%, \${signal}\${layer === 2 ? "3D" : "24"}, \${signal}12 43%, transparent 72%)\`,
            boxShadow: \`inset 0 0 \${diameter * 0.18}px \${signal}1A, 0 0 \${diameter * 0.24}px \${signal}1F\`,
            filter: \`blur(\${blur}px)\`,
            opacity: shimmer * (0.22 + depth * 0.26),
            mixBlendMode: "screen"
          }
        }
      );
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.38) 100%)" } }));
  }
};
var H06_bokeh_field_effect_default = kernel;
`;export{e as default};
