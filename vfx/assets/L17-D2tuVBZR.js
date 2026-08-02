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
var L17_laser_grid_effect_exports = {};
__export(L17_laser_grid_effect_exports, {
  default: () => L17_laser_grid_effect_default
});
module.exports = __toCommonJS(L17_laser_grid_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const density = Math.min(14, Math.max(4, Math.round(Number(ctx.params.density ?? 8))));
    const intensity = Math.min(1, Math.max(0.2, Number(ctx.params.intensity ?? 0.82)));
    const sweep = Math.min(3, Math.max(1, Math.round(Number(ctx.params.sweep ?? 2))));
    const tilt = Math.min(76, Math.max(42, Number(ctx.params.tilt ?? 62)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * sweep;
    const scanX = 50 + Math.sin(phase) * 47;
    const scanY = 50 + Math.cos(phase) * 43;
    const gridStep = 100 / density;
    const horizonGlow = 0.42 + 0.18 * Math.cos(phase * 2);
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#0D0E10",
          perspective: 520
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "-25%",
            right: "-25%",
            bottom: "-40%",
            height: "108%",
            transformOrigin: "50% 100%",
            transform: \`rotateX(\${tilt}deg) translateY(8%)\`,
            backgroundImage: \`repeating-linear-gradient(90deg, transparent 0, transparent calc(\${gridStep}% - 1px), \${signal}  \${gridStep}%), repeating-linear-gradient(0deg, transparent 0, transparent calc(\${gridStep}% - 1px), \${signal} \${gridStep}%)\`,
            backgroundSize: "100% 100%",
            opacity: intensity * 0.46,
            filter: \`drop-shadow(0 0 4px \${signal})\`,
            maskImage: "linear-gradient(to top, black 15%, transparent 92%)"
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: "43%",
            height: 2,
            background: signal,
            boxShadow: \`0 0 12px 2px \${signal}\`,
            opacity: intensity * horizonGlow
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: \`\${scanX}%\`,
            top: "8%",
            bottom: "-5%",
            width: 2,
            transform: \`rotate(\${Math.sin(phase) * 7}deg)\`,
            transformOrigin: "50% 0%",
            background: \`linear-gradient(180deg, transparent, \${signal} 18%, \${signal} 82%, transparent)\`,
            boxShadow: \`0 0 9px 2px \${signal}\`,
            opacity: intensity
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "-8%",
            right: "-8%",
            top: \`\${scanY}%\`,
            height: 2,
            transform: \`rotate(\${Math.cos(phase) * 4}deg)\`,
            background: \`linear-gradient(90deg, transparent, \${signal} 18%, \${signal} 82%, transparent)\`,
            boxShadow: \`0 0 9px 2px \${signal}\`,
            opacity: intensity * 0.84
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            filter: \`drop-shadow(0 0 \${5 + intensity * 7}px \${signal})\`
          }
        },
        ctx.subjectNode
      )
    );
  }
};
var L17_laser_grid_effect_default = kernel;
`;export{n as default};
