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
var O01_pop_in_effect_exports = {};
__export(O01_pop_in_effect_exports, {
  default: () => O01_pop_in_effect_default
});
module.exports = __toCommonJS(O01_pop_in_effect_exports);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const overshoot = Number(ctx.params.overshoot ?? 0.6);
    const damping = Number(ctx.params.damping ?? 6.4);
    const ring = Number(ctx.params.ring ?? 0.72);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = clamp01(ctx.t / 0.32);
    const omega = 5.5 + overshoot * 9;
    const decay = Math.exp(-damping * p);
    const settle = 1 - decay * Math.cos(omega * p);
    const wobble = decay * Math.sin(omega * p);
    const idle = Math.max(0, ctx.t - 0.32);
    const breathe = 1 + 0.014 * Math.sin(idle * Math.PI * 3.2);
    const scale = (0.04 + settle * 0.96) * breathe;
    const scaleX = scale * (1 + wobble * 0.18 * overshoot);
    const scaleY = scale * (1 - wobble * 0.18 * overshoot);
    const tilt = 2.4 * wobble * overshoot + 0.45 * Math.sin(idle * Math.PI * 2.2);
    const impact = clamp01((ctx.t - 0.09) / 0.3);
    const ringSize = ctx.height * (0.34 + Math.pow(impact, 0.6) * 0.9);
    const ringAlpha = ring * Math.pow(Math.sin(Math.PI * impact), 1.4) * 0.9;
    const outro = clamp01((1 - ctx.t) / 0.1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: "69%",
          bottom: 0,
          background: "linear-gradient(180deg, rgba(247,250,252,0.05), rgba(247,250,252,0))"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "70%",
          width: ctx.height * 0.58 * scale,
          height: ctx.height * 0.09 * scale,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "70%",
          width: ctx.height * 0.3 * scale,
          height: ctx.height * 0.05 * scale,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: signal,
          opacity: 0.24 * settle,
          filter: \`blur(\${ctx.height * 0.022}px)\`
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "48.6%",
          width: ringSize,
          height: ringSize,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: \`\${Math.max(1, ctx.height * 8e-3)}px solid \${signal}\`,
          opacity: ringAlpha
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          transform: \`rotate(\${tilt}deg) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "50% 47.8%"
        }
      },
      ctx.subjectNode
    )));
  }
};
var O01_pop_in_effect_default = kernel;
`;export{n as default};
