const t=`var __defProp = Object.defineProperty;
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
var O31_paper_fall_effect_exports = {};
__export(O31_paper_fall_effect_exports, {
  default: () => O31_paper_fall_effect_default
});
module.exports = __toCommonJS(O31_paper_fall_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const drift = Number(ctx.params.drift ?? 0.34);
    const flutter = Number(ctx.params.flutter ?? 2.75);
    const tumble = Number(ctx.params.tumble ?? 0.68);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = ctx.t;
    const phase = TAU * p;
    const boxWidth = ctx.width * 0.34;
    const boxHeight = ctx.height * 0.4;
    const travel = ctx.height + boxHeight * 1.7;
    const x = ctx.width / 2 - boxWidth / 2 + ctx.width * drift * 0.28 * Math.sin(phase * 2 + 0.5);
    const y = -boxHeight * 1.15 + travel * p;
    const flap = Math.sin(phase * flutter * 2) * tumble;
    const rotateY = flap * 76;
    const rotateX = Math.sin(phase * flutter + 1.1) * tumble * 36;
    const rotateZ = Math.sin(phase * (flutter * 0.5) - 0.6) * (13 + tumble * 14);
    const edgeScale = Math.max(0.14, Math.abs(Math.cos(rotateY * Math.PI / 180)));
    const edgeFade = Math.min(1, p / 0.09, (1 - p) / 0.09);
    const shadowNear = Math.max(0, 1 - Math.abs(p - 0.76) / 0.28);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: 900 } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: x + boxWidth / 2,
          top: ctx.height * 0.86,
          width: boxWidth * (0.3 + edgeScale * 0.5),
          height: ctx.height * 0.035,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}55, transparent)\`,
          opacity: shadowNear * 0.5 * edgeFade
        }
      }
    ), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      },
      /* @__PURE__ */ h(
        "path",
        {
          d: \`M \${ctx.width * 0.18} \${ctx.height * 0.08} C \${ctx.width * 0.75} \${ctx.height * 0.3}, \${ctx.width * 0.24} \${ctx.height * 0.62}, \${ctx.width * 0.72} \${ctx.height * 0.94}\`,
          fill: "none",
          stroke: signal,
          strokeWidth: "1",
          strokeDasharray: "3 9",
          opacity: "0.2"
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: x,
          top: y,
          width: boxWidth,
          height: boxHeight,
          opacity: edgeFade,
          transform: \`rotateZ(\${rotateZ}deg) rotateY(\${rotateY}deg) rotateX(\${rotateX}deg) scaleX(\${0.86 + edgeScale * 0.14})\`,
          transformStyle: "preserve-3d",
          filter: \`drop-shadow(\${flap * 9}px 12px 10px #00000099) drop-shadow(0 0 7px \${signal}44)\`
        }
      },
      ctx.subjectNode,
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "50%",
            top: "8%",
            bottom: "8%",
            width: 1,
            background: \`linear-gradient(transparent, \${signal}AA, transparent)\`,
            opacity: 0.34 + Math.abs(flap) * 0.28
          }
        }
      )
    ));
  }
};
var O31_paper_fall_effect_default = kernel;
`;export{t as default};
