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
var T16_justify_snap_effect_exports = {};
__export(T16_justify_snap_effect_exports, {
  default: () => T16_justify_snap_effect_default
});
module.exports = __toCommonJS(T16_justify_snap_effect_exports);
const clamp = (value) => Math.max(0, Math.min(1, value));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const spread = Number(ctx.params.spread ?? 0.68);
    const overshoot = Number(ctx.params.overshoot ?? 0.18);
    const guides = Boolean(ctx.params.guides ?? true);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const raw = clamp(cycle / 0.72);
    const settle = 1 - Math.pow(1 - raw, 3);
    const spring = settle + Math.sin(raw * Math.PI * 3) * (1 - raw) * overshoot;
    const tracking = (1 - spring) * Math.min(ctx.width, ctx.height) * 0.075 * spread;
    const edgeInset = 13 + (1 - spring) * 11;
    const flash = Math.exp(-Math.pow((raw - 0.76) / 0.075, 2));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, guides && /* @__PURE__ */ h(Frag, null, /* @__PURE__ */ h("div", { style: { position: "absolute", top: "18%", bottom: "18%", left: \`\${edgeInset}%\`, width: 1, background: signal, opacity: 0.18 + flash * 0.45 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", top: "18%", bottom: "18%", right: \`\${edgeInset}%\`, width: 1, background: signal, opacity: 0.18 + flash * 0.45 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: \`\${edgeInset}%\`, right: \`\${edgeInset}%\`, top: "50%", height: 1, background: signal, opacity: 0.09 } })), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: "12%",
          display: "grid",
          placeItems: "center",
          letterSpacing: \`\${tracking}px\`,
          transform: \`scaleX(\${0.92 + spring * 0.08})\`,
          transformOrigin: "center",
          filter: \`drop-shadow(0 0 \${4 + flash * 15}px \${signal})\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`\${edgeInset}%\`,
          right: \`\${edgeInset}%\`,
          bottom: "15%",
          height: 3,
          background: signal,
          opacity: 0.7,
          transform: \`scaleX(\${spring})\`,
          transformOrigin: "center"
        }
      }
    ));
  }
};
var T16_justify_snap_effect_default = kernel;
`;export{e as default};
