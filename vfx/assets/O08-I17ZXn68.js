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
var O08_peel_in_effect_exports = {};
__export(O08_peel_in_effect_exports, {
  default: () => O08_peel_in_effect_default
});
module.exports = __toCommonJS(O08_peel_in_effect_exports);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const curl = Number(ctx.params.curl ?? 0.7);
    const damping = Number(ctx.params.damping ?? 4.8);
    const shadow = Number(ctx.params.shadow ?? 0.72);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = clamp01(ctx.t / 0.42);
    const reveal = p * p * (3 - 2 * p) * 215;
    const settle = 1 - Math.exp(-damping * p) * Math.cos(8.2 * p);
    const flatten = 1 - settle;
    const idle = Math.max(0, ctx.t - 0.42);
    const rot = -curl * 9 * flatten + 0.5 * Math.sin(idle * Math.PI * 1.5);
    const skew = curl * 5 * flatten;
    const lift = 1 + curl * 0.05 * flatten;
    const edgeDeg = -(Math.atan2(ctx.height, ctx.width) * 180) / Math.PI;
    const band = clamp01(reveal / 10) * clamp01((215 - reveal) / 55);
    const anchor = \`\${reveal / 2}%\`;
    const outro = clamp01((1 - ctx.t) / 0.1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "73%",
          width: ctx.height * (0.4 + settle * 0.24),
          height: ctx.height * (0.06 + flatten * 0.04),
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))",
          opacity: 0.35 + clamp01(settle) * 0.55
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
          overflow: "hidden",
          transform: \`rotate(\${rot}deg) skewX(\${skew}deg) scale(\${lift})\`,
          transformOrigin: "18% 18%"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            clipPath: \`polygon(0 0, \${reveal}% 0, 0 \${reveal}%)\`
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: anchor,
            top: anchor,
            width: "260%",
            height: ctx.height * 0.16,
            transform: \`translate(-50%, -50%) rotate(\${edgeDeg}deg) translateY(\${-ctx.height * 0.08}px)\`,
            background: \`linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,\${0.72 * shadow}))\`,
            opacity: band
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: anchor,
            top: anchor,
            width: "260%",
            height: ctx.height * 0.05,
            transform: \`translate(-50%, -50%) rotate(\${edgeDeg}deg) translateY(\${ctx.height * 0.026}px)\`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0))",
            opacity: band * 0.85
          }
        }
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: anchor,
            top: anchor,
            width: "260%",
            height: Math.max(2, ctx.height * 0.014),
            transform: \`translate(-50%, -50%) rotate(\${edgeDeg}deg)\`,
            background: \`linear-gradient(90deg, rgba(94,231,243,0) 0%, \${signal} 30%, rgba(255,255,255,0.92) 50%, \${signal} 70%, rgba(94,231,243,0) 100%)\`,
            opacity: band,
            boxShadow: \`0 0 \${ctx.height * 0.06}px \${signal}\`
          }
        }
      )
    )));
  }
};
var O08_peel_in_effect_default = kernel;
`;export{n as default};
