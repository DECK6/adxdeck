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
var L15_volumetric_spot_effect_exports = {};
__export(L15_volumetric_spot_effect_exports, {
  default: () => L15_volumetric_spot_effect_default
});
module.exports = __toCommonJS(L15_volumetric_spot_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Math.min(1, Math.max(0.15, Number(ctx.params.intensity ?? 0.78)));
    const spread = Math.min(62, Math.max(18, Number(ctx.params.spread ?? 42)));
    const dustCount = Math.min(42, Math.max(8, Math.round(Number(ctx.params.dust ?? 24))));
    const sweep = Math.min(3, Math.max(1, Math.round(Number(ctx.params.sweep ?? 1))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * sweep;
    const sourceX = 50 + Math.sin(phase) * 7;
    const poolX = 50 - Math.sin(phase) * 14;
    const breathe = 0.82 + Math.cos(phase * 2) * 0.08;
    const left = poolX - spread / 2;
    const right = poolX + spread / 2;
    const dust = Array.from({ length: dustCount }, (_, i) => {
      const depth = 0.12 + ctx.random(\`dust:\${i}:depth\`) * 0.78;
      const coneHalfWidth = spread * depth * 0.42;
      const driftPhase = phase + ctx.random(\`dust:\${i}:phase\`) * TAU;
      return {
        x: poolX + (ctx.random(\`dust:\${i}:x\`) * 2 - 1) * coneHalfWidth + Math.sin(driftPhase) * 1.4,
        y: 7 + depth * 78 + Math.cos(driftPhase * 2) * 1.8,
        size: 1 + ctx.random(\`dust:\${i}:size\`) * 2.2,
        opacity: (0.16 + ctx.random(\`dust:\${i}:alpha\`) * 0.5) * (0.55 + 0.45 * Math.sin(driftPhase * 3) ** 2)
      };
    });
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: \`radial-gradient(ellipse 36% 16% at \${poolX}% 83%, \${signal}38 0%, \${signal}12 52%, transparent 76%)\`,
          opacity: intensity
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: \`polygon(\${sourceX - 1}% 0%, \${sourceX + 1}% 0%, \${right}% 84%, \${left}% 84%)\`,
          background: \`linear-gradient(180deg, \${signal}42 0%, \${signal}1f 38%, \${signal}0a 78%, transparent 100%)\`,
          filter: "blur(7px)",
          opacity: intensity * breathe
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          clipPath: \`polygon(\${sourceX - 0.35}% 0%, \${sourceX + 0.35}% 0%, \${poolX + spread * 0.3}% 84%, \${poolX - spread * 0.3}% 84%)\`,
          background: \`linear-gradient(180deg, \${signal}70 0%, \${signal}18 54%, transparent 100%)\`,
          opacity: intensity * 0.68
        }
      }
    ), dust.map((particle, i) => /* @__PURE__ */ h(
      "span",
      {
        key: i,
        style: {
          position: "absolute",
          left: \`\${particle.x}%\`,
          top: \`\${particle.y}%\`,
          width: particle.size,
          height: particle.size,
          borderRadius: "50%",
          background: signal,
          boxShadow: \`0 0 \${particle.size * 3}px \${signal}\`,
          opacity: particle.opacity * intensity
        }
      }
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          filter: \`drop-shadow(0 0 \${8 + intensity * 12}px \${signal})\`,
          opacity: 0.72 + intensity * 0.28
        }
      },
      ctx.subjectNode
    ));
  }
};
var L15_volumetric_spot_effect_default = kernel;
`;export{n as default};
