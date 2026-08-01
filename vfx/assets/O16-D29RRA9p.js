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
var O16_float_hover_effect_exports = {};
__export(O16_float_hover_effect_exports, {
  default: () => O16_float_hover_effect_default
});
module.exports = __toCommonJS(O16_float_hover_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const lift = Number(ctx.params.lift ?? 0.62);
    const sway = Number(ctx.params.sway ?? 0.5);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const unitX = ctx.width / 100;
    const unitY = ctx.height / 100;
    const turn = Math.PI * 2 * (cycles * ctx.t % 1);
    const phaseA = ctx.random("hover:phase:a") * Math.PI * 2;
    const phaseB = ctx.random("hover:phase:b") * Math.PI * 2;
    const swayNorm = Math.sin(turn + phaseA) * 0.62 + Math.sin(turn * 2 + phaseB) * 0.26 + Math.sin(turn * 3 + phaseA) * 0.12;
    const riseNorm = Math.cos(turn + phaseB) * 0.6 + Math.cos(turn * 2 + phaseA) * 0.28 + Math.cos(turn * 3 + phaseB) * 0.12;
    const rollNorm = Math.sin(turn * 2 + phaseA) * 0.6 + Math.sin(turn * 3 + phaseB) * 0.4;
    const driftX = swayNorm * sway * 3.6 * unitX;
    const driftY = riseNorm * lift * 5.4 * unitY;
    const roll = rollNorm * sway * 2.1;
    const altitude = -riseNorm;
    const groundY = ctx.height * 0.84;
    const poolScale = 1 + altitude * 0.34 * lift;
    const poolAlpha = 0.34 - altitude * 0.14;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width / 2 + driftX * 0.55,
          top: groundY,
          width: 27 * unitX * poolScale,
          height: 7.5 * unitY * poolScale,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
          opacity: poolAlpha
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: groundY,
          width: 48 * unitX,
          height: 1,
          background: signal,
          opacity: 0.16,
          transform: "translate(-50%, -50%)"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 6 * unitX,
          top: ctx.height * 0.26,
          width: 1,
          height: ctx.height * 0.48,
          background: signal,
          opacity: 0.14
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 4 * unitX,
          top: ctx.height / 2 + driftY,
          width: 5 * unitX,
          height: 1,
          background: signal,
          opacity: 0.62
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${driftX}px, \${driftY}px, 0) rotate(\${roll}deg)\`,
          transformOrigin: "center",
          filter: \`drop-shadow(0 \${2 * unitY}px \${(3 + altitude * 2) * unitX}px rgba(0, 0, 0, 0.6))\`
        }
      },
      ctx.subjectNode
    ));
  }
};
var O16_float_hover_effect_default = kernel;
`;export{n as default};
