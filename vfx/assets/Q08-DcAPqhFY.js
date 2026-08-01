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
var Q08_gel_wobble_effect_exports = {};
__export(Q08_gel_wobble_effect_exports, {
  default: () => Q08_gel_wobble_effect_default
});
module.exports = __toCommonJS(Q08_gel_wobble_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const wobble = Number(ctx.params.wobble ?? 0.68);
    const elasticity = Number(ctx.params.elasticity ?? 0.74);
    const blur = Number(ctx.params.blur ?? 7);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = Math.PI * 2 * cycles * ctx.t;
    const primary = Math.sin(phase);
    const rebound = Math.sin(phase * 2 + Math.PI / 3) * elasticity;
    const scaleX = 1 + primary * wobble * 0.09 + rebound * wobble * 0.025;
    const scaleY = 1 - primary * wobble * 0.065 - rebound * wobble * 0.018;
    const skewX = primary * wobble * 5.5;
    const driftX = rebound * wobble * ctx.width * 0.012;
    const driftY = Math.cos(phase) * wobble * ctx.height * 0.014;
    const radiusA = 42 + primary * wobble * 10;
    const radiusB = 46 - primary * wobble * 8;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, Array.from({ length: 3 }, (_, index) => {
      const trail = index + 1;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            inset: 0,
            opacity: wobble * (0.13 / trail),
            filter: \`blur(\${blur * trail * 0.55}px) drop-shadow(0 0 \${8 + blur}px \${signal})\`,
            transform: \`translate3d(\${-driftX * trail * 0.65}px, \${driftY * trail * 0.45}px, 0) scale(\${1 + trail * 0.012})\`
          }
        },
        ctx.subjectNode
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "9% 12%",
          overflow: "hidden",
          border: \`2px solid \${signal}\`,
          borderRadius: \`\${radiusA}% \${radiusB}% \${100 - radiusA}% \${100 - radiusB}% / \${radiusB}% \${100 - radiusA}% \${radiusA}% \${100 - radiusB}%\`,
          boxShadow: \`inset 0 0 \${18 + blur * 2}px \${signal}, 0 0 \${12 + blur * 2}px \${signal}\`,
          transform: \`translate3d(\${driftX}px, \${driftY}px, 0) skewX(\${skewX}deg) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "center"
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "-11% -14%" } }, ctx.subjectNode),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            background: \`radial-gradient(circle at \${50 + primary * 12}% \${42 + rebound * 8}%, transparent 0 24%, \${signal} 100%)\`,
            opacity: 0.08 + wobble * 0.12
          }
        }
      )
    ));
  }
};
var Q08_gel_wobble_effect_default = kernel;
`;export{e as default};
