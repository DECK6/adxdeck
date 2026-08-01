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
var Q04_viscous_drip_effect_exports = {};
__export(Q04_viscous_drip_effect_exports, {
  default: () => Q04_viscous_drip_effect_default
});
module.exports = __toCommonJS(Q04_viscous_drip_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const strands = Math.min(11, Math.max(4, Math.round(Number(ctx.params.strands ?? 7))));
    const length = Math.min(72, Math.max(24, Number(ctx.params.length ?? 56)));
    const viscosity = Math.min(1, Math.max(0.25, Number(ctx.params.viscosity ?? 0.76)));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * cycles;
    const surfaceWave = 0.5 + 0.5 * Math.sin(phase);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.72,
          transform: \`translateY(\${surfaceWave * 9}px) scaleY(\${0.97 + surfaceWave * 0.06})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "-5%",
          top: "-5%",
          width: "110%",
          height: \`\${18 + surfaceWave * 7}%\`,
          borderRadius: "0 0 42% 38%",
          background: \`linear-gradient(180deg, \${signal}38, \${signal}B8)\`,
          opacity: 0.45 + viscosity * 0.28,
          transform: \`translateX(\${Math.sin(phase) * 2.5}%) skewX(\${Math.sin(phase) * 2}deg)\`,
          boxShadow: \`0 10px \${18 + viscosity * 24}px \${signal}33\`
        }
      }
    ), Array.from({ length: strands }, (_, index) => {
      const offset = index / strands;
      const progress = (ctx.t * cycles + offset) % 1;
      const envelope = 0.5 - 0.5 * Math.cos(progress * TAU);
      const x = 10 + (index + 0.5) / strands * 80 + Math.sin(phase + index * 1.7) * 2.2;
      const width = ctx.width * (0.024 + index % 3 * 7e-3) * (0.72 + viscosity * 0.42);
      const maxHeight = ctx.height * (length / 100) * (0.62 + index % 4 * 0.11);
      const stemHeight = ctx.height * 0.11 + maxHeight * envelope;
      const dropProgress = progress * (1.12 + (1 - viscosity) * 0.38) % 1;
      const dropOpacity = Math.pow(Math.sin(dropProgress * Math.PI), 0.7);
      const dropSize = width * (1.08 + viscosity * 0.62);
      return /* @__PURE__ */ h("div", { key: index }, /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: \`\${x}%\`,
            top: "8%",
            width,
            height: stemHeight,
            borderRadius: \`0 0 \${width}px \${width}px\`,
            background: \`linear-gradient(90deg, \${signal}88, \${signal}, \${signal}77)\`,
            opacity: 0.42 + viscosity * 0.48,
            transform: \`translateX(-50%) scaleX(\${0.72 + envelope * 0.48})\`,
            transformOrigin: "50% 0%",
            boxShadow: \`0 0 \${6 + viscosity * 12}px \${signal}66\`
          }
        }
      ), /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: \`\${x + Math.sin(progress * TAU) * (1 - viscosity) * 4}%\`,
            top: \`\${25 + dropProgress * 70}%\`,
            width: dropSize,
            height: dropSize * (1.18 + viscosity * 0.72),
            borderRadius: "48% 52% 58% 42% / 36% 40% 60% 64%",
            background: signal,
            opacity: dropOpacity * (0.48 + viscosity * 0.48),
            transform: \`translate(-50%, -50%) scale(\${0.62 + dropOpacity * 0.68}) rotate(\${Math.sin(progress * TAU) * 12}deg)\`,
            boxShadow: \`0 0 \${8 + viscosity * 16}px \${signal}\`
          }
        }
      ));
    }));
  }
};
var Q04_viscous_drip_effect_default = kernel;
`;export{n as default};
