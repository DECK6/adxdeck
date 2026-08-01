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
var O19_tilt_sway_effect_exports = {};
__export(O19_tilt_sway_effect_exports, {
  default: () => O19_tilt_sway_effect_default
});
module.exports = __toCommonJS(O19_tilt_sway_effect_exports);
const REEDS = 9;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sway = Number(ctx.params.sway ?? 0.6);
    const gust = Number(ctx.params.gust ?? 0.5);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const unitX = ctx.width / 100;
    const turn = Math.PI * 2 * (cycles * ctx.t % 1);
    const phaseA = ctx.random("sway:phase:a") * Math.PI * 2;
    const phaseB = ctx.random("sway:phase:b") * Math.PI * 2;
    const windAt = (lag) => Math.sin(turn + lag + phaseA) * 0.62 + Math.sin((turn + lag) * 2 + phaseB) * gust * 0.42 + Math.sin((turn + lag) * 3 + phaseA) * gust * 0.2;
    const wind = windAt(0);
    const lean = wind * sway * 12;
    const baseY = ctx.height * 0.86;
    const reedHeight = ctx.height * 0.13;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: baseY,
          width: 62 * unitX,
          height: 1,
          background: signal,
          opacity: 0.18,
          transform: "translate(-50%, -50%)"
        }
      }
    ), Array.from({ length: REEDS }, (_, index) => {
      const spread = index / (REEDS - 1) - 0.5;
      const reedWind = windAt(-0.3 - index * 0.16);
      const height = reedHeight * (0.55 + index * 7 % 5 / 8);
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: ctx.width / 2 + spread * 62 * unitX,
            top: baseY - height,
            width: 1,
            height,
            background: signal,
            opacity: 0.2 + Math.abs(reedWind) * 0.16,
            transform: \`rotate(\${reedWind * sway * 15}deg)\`,
            transformOrigin: "50% 100%"
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width / 2 + lean * 0.9 * unitX,
          top: baseY,
          width: (20 + Math.abs(lean) * 0.7) * unitX,
          height: 3.6 * unitX,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
          opacity: 0.24 - Math.abs(wind) * 0.06
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`rotate(\${lean}deg) translate3d(\${lean * 0.18 * unitX}px, 0, 0)\`,
          transformOrigin: \`50% \${baseY}px\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width / 2,
          top: ctx.height * 0.12,
          width: Math.abs(lean) * 1.6 * unitX,
          height: 2,
          background: signal,
          opacity: 0.5,
          transform: \`translateX(\${lean < 0 ? "-100%" : "0"})\`
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 5 * unitX,
          top: ctx.height * 0.1,
          color: signal,
          fontFamily: "monospace",
          fontSize: Math.max(9, 3.6 * unitX),
          letterSpacing: "0.16em",
          opacity: 0.62
        }
      },
      "WIND ",
      lean < 0 ? "-" : "+",
      Math.round(Math.abs(lean)).toString().padStart(2, "0")
    ));
  }
};
var O19_tilt_sway_effect_default = kernel;
`;export{n as default};
