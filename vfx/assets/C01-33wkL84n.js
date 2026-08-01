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
var C01_parallax_layers_effect_exports = {};
__export(C01_parallax_layers_effect_exports, {
  default: () => C01_parallax_layers_effect_default
});
module.exports = __toCommonJS(C01_parallax_layers_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const depth = Number(ctx.params.depth ?? 0.68);
    const speed = Number(ctx.params.speed ?? 1);
    const particleCount = Math.max(6, Math.round(Number(ctx.params.particles ?? 14)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const angle = Math.PI * 2 * ctx.t * speed;
    const driftX = Math.sin(angle) * ctx.width * 0.035 * depth;
    const driftY = Math.cos(angle) * ctx.height * 0.028 * depth;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "-10%",
          backgroundImage: \`linear-gradient(\${signal}1F 1px, transparent 1px), linear-gradient(90deg, \${signal}1F 1px, transparent 1px)\`,
          backgroundSize: "58px 58px",
          transform: \`translate3d(\${-driftX * 0.34}px, \${-driftY * 0.34}px, 0) rotate(-2deg)\`
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
          transform: \`translate3d(\${driftX}px, \${driftY}px, 0) scale(\${1.025 + Math.sin(angle) * 0.012 * depth})\`
        }
      },
      ctx.subjectNode
    ), Array.from({ length: particleCount }, (_, index) => {
      const phase = ctx.random(\`particle:\${index}:phase\`) * Math.PI * 2;
      const radius = 2 + ctx.random(\`particle:\${index}:size\`) * 5;
      const baseX = ctx.random(\`particle:\${index}:x\`) * ctx.width;
      const baseY = ctx.random(\`particle:\${index}:y\`) * ctx.height;
      const x = baseX + Math.sin(angle * 2 + phase) * ctx.width * 0.055 * depth + driftX * 1.75;
      const y = baseY + Math.cos(angle * 3 + phase) * ctx.height * 0.045 * depth + driftY * 1.75;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: x,
            top: y,
            width: radius,
            height: radius,
            borderRadius: "50%",
            background: signal,
            opacity: 0.28 + ctx.random(\`particle:\${index}:opacity\`) * 0.55,
            boxShadow: \`0 0 \${radius * 2.5}px \${signal}\`,
            transform: "translate(-50%, -50%)"
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 34,
          bottom: 30,
          color: signal,
          fontFamily: "monospace",
          fontSize: 14,
          letterSpacing: "0.18em",
          opacity: 0.72
        }
      },
      "BG \\xB7 SUBJECT \\xB7 FG"
    ));
  }
};
var C01_parallax_layers_effect_default = kernel;
`;export{n as default};
