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
var A17_pulse_tunnel_effect_exports = {};
__export(A17_pulse_tunnel_effect_exports, {
  default: () => A17_pulse_tunnel_effect_default
});
module.exports = __toCommonJS(A17_pulse_tunnel_effect_exports);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const ringCount = Math.min(16, Math.max(6, Math.round(Number(ctx.params.rings ?? 11))));
    const sensitivity = Math.min(2.5, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.35)));
    const depth = Math.min(1.8, Math.max(0.5, Number(ctx.params.depth ?? 1.1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bass = (bands[0] + bands[1]) * 0.5;
    const pulse = clamp01((bass * 0.72 + rms * 0.28) * sensitivity);
    const shortSide = Math.min(ctx.width, ctx.height);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#07090C", perspective: shortSide * 2.8 } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, transformStyle: "preserve-3d" } }, Array.from({ length: ringCount }, (_, index) => {
      const travel = (ctx.t * 2 + index / ringCount) % 1;
      const band = bands[index % bands.length];
      const energy = clamp01((band * 0.68 + pulse * 0.55) * sensitivity);
      const z = (-shortSide * 2.45 + travel * shortSide * 2.3) * depth;
      const size = shortSide * (0.22 + energy * 0.11);
      const fade = Math.sin(Math.PI * travel);
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: size,
            height: size,
            border: \`\${1 + energy * 2.4}px solid \${signal}\`,
            borderRadius: index % 3 === 0 ? "18%" : "50%",
            opacity: 0.08 + fade * (0.28 + energy * 0.6),
            boxShadow: \`0 0 \${5 + energy * 22}px \${signal}, inset 0 0 \${4 + energy * 14}px \${signal}\`,
            transform: \`translate(-50%, -50%) translateZ(\${z}px) rotate(\${index * 17 + ctx.t * 360}deg)\`
          }
        }
      );
    })), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.42 + pulse * 0.5,
          transform: \`scale(\${0.82 + pulse * 0.12})\`,
          filter: \`drop-shadow(0 0 \${8 + pulse * 22}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: shortSide * (0.035 + pulse * 0.045),
          height: shortSide * (0.035 + pulse * 0.045),
          borderRadius: "50%",
          background: signal,
          opacity: 0.45 + pulse * 0.5,
          boxShadow: \`0 0 \${shortSide * (0.1 + pulse * 0.16)}px \${signal}\`,
          transform: "translate(-50%, -50%)"
        }
      }
    ));
  }
};
var A17_pulse_tunnel_effect_default = kernel;
`;export{n as default};
