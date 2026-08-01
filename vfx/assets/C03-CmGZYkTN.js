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
var C03_handheld_shake_effect_exports = {};
__export(C03_handheld_shake_effect_exports, {
  default: () => C03_handheld_shake_effect_default
});
module.exports = __toCommonJS(C03_handheld_shake_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.58);
    const frequency = Number(ctx.params.frequency ?? 1);
    const rotation = Number(ctx.params.rotation ?? 0.72);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const turn = Math.PI * 2 * ctx.t * frequency;
    const phaseX = ctx.random("shake:phase:x") * Math.PI * 2;
    const phaseY = ctx.random("shake:phase:y") * Math.PI * 2;
    const phaseR = ctx.random("shake:phase:r") * Math.PI * 2;
    const x = intensity * (Math.sin(turn + phaseX) * 7 + Math.sin(turn * 3 + phaseY) * 3.2 + Math.sin(turn * 7 + phaseR) * 1.4);
    const y = intensity * (Math.cos(turn + phaseY) * 5.6 + Math.sin(turn * 4 + phaseR) * 2.8 + Math.cos(turn * 9 + phaseX) * 1.1);
    const rotate = intensity * rotation * (Math.sin(turn * 2 + phaseR) * 0.62 + Math.sin(turn * 5 + phaseX) * 0.38);
    const focus = 0.55 + Math.sin(turn * 3 + phaseY) * 0.18;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: -24,
          background: "#0D0E10",
          transform: \`translate3d(\${x}px, \${y}px, 0) rotate(\${rotate}deg) scale(1.045)\`,
          transformOrigin: "center"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 24,
            backgroundImage: \`linear-gradient(90deg, transparent 49.8%, \${signal}18 50%, transparent 50.2%), linear-gradient(transparent 49.8%, \${signal}18 50%, transparent 50.2%)\`
          }
        }
      ),
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 24, display: "grid", placeItems: "center" } }, ctx.subjectNode)
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 28, top: 28, width: 58, height: 2, background: signal, opacity: focus } }), /* @__PURE__ */ h("div", { style: { position: "absolute", left: 28, top: 28, width: 2, height: 58, background: signal, opacity: focus } }), /* @__PURE__ */ h("div", { style: { position: "absolute", right: 28, bottom: 28, width: 58, height: 2, background: signal, opacity: focus } }), /* @__PURE__ */ h("div", { style: { position: "absolute", right: 28, bottom: 28, width: 2, height: 58, background: signal, opacity: focus } }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 34,
          bottom: 28,
          color: signal,
          fontFamily: "monospace",
          fontSize: 13,
          letterSpacing: "0.16em",
          opacity: 0.68
        }
      },
      "HANDHELD / ",
      Math.round(intensity * 100).toString().padStart(2, "0")
    ));
  }
};
var C03_handheld_shake_effect_default = kernel;
`;export{n as default};
