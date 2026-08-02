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
var O37_conveyor_belt_effect_exports = {};
__export(O37_conveyor_belt_effect_exports, {
  default: () => O37_conveyor_belt_effect_default
});
module.exports = __toCommonJS(O37_conveyor_belt_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1);
    const bounce = Number(ctx.params.bounce ?? 0.42);
    const rollerCount = Math.max(5, Math.min(10, Math.round(Number(ctx.params.rollers ?? 7))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycles = Math.max(1, Math.round(speed * 2));
    const phase = ctx.t * cycles % 1;
    const beltLeft = ctx.width * 0.08;
    const beltWidth = ctx.width * 0.84;
    const beltTop = ctx.height * 0.68;
    const beltHeight = ctx.height * 0.16;
    const boxWidth = ctx.width * 0.24;
    const boxHeight = ctx.height * 0.31;
    const x = beltLeft - boxWidth * 0.7 + phase * (beltWidth + boxWidth * 1.4);
    const board = Math.min(1, phase / 0.16);
    const depart = Math.min(1, Math.max(0, (phase - 0.84) / 0.16));
    const edgeDrop = (1 - board + depart) * ctx.height * 0.13;
    const rideAge = Math.max(0, phase - 0.16);
    const suspension = phase >= 0.16 && phase < 0.84 ? Math.exp(-rideAge * 11) * Math.sin(rideAge * 46) * bounce * ctx.height * 0.045 : 0;
    const y = beltTop - boxHeight + edgeDrop - suspension;
    const opacity = Math.min(1, phase / 0.07, (1 - phase) / 0.07);
    const rollerSize = beltHeight * 0.66;
    const rollerGap = beltWidth / Math.max(1, rollerCount - 1);
    const slatGap = Math.max(16, ctx.width * 0.055);
    const slatShift = ctx.t * cycles * slatGap % slatGap;
    const lean = -Math.min(8, Math.abs(suspension) / Math.max(1, ctx.height) * 160);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: beltLeft,
          top: beltTop,
          width: beltWidth,
          height: beltHeight,
          border: \`2px solid \${signal}\`,
          borderRadius: beltHeight / 2,
          background: "#15191D",
          overflow: "hidden",
          boxShadow: \`0 0 12px \${signal}33\`
        }
      },
      Array.from({ length: Math.ceil(beltWidth / slatGap) + 2 }, (_, index) => /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: index * slatGap + slatShift - slatGap,
            top: 0,
            width: 2,
            height: beltHeight,
            background: signal,
            opacity: 0.24,
            transform: "skewX(-18deg)"
          }
        }
      ))
    ), Array.from({ length: rollerCount }, (_, index) => {
      const rollerX = beltLeft + index * rollerGap;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: rollerX - rollerSize / 2,
            top: beltTop + beltHeight / 2 - rollerSize / 2,
            width: rollerSize,
            height: rollerSize,
            border: \`1.5px solid \${signal}\`,
            borderRadius: "50%",
            opacity: 0.64,
            transform: \`rotate(\${ctx.t * cycles * 360}deg)\`
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: "50%",
              top: 0,
              width: 1,
              height: "100%",
              background: signal,
              opacity: 0.46
            }
          }
        ),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: "50%",
              width: "100%",
              height: 1,
              background: signal,
              opacity: 0.46
            }
          }
        )
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: x,
          top: y,
          width: boxWidth,
          height: boxHeight,
          opacity,
          transform: \`rotate(\${lean}deg) scale(\${1 + Math.abs(suspension) / Math.max(1, ctx.height) * 0.4}, \${1 - Math.abs(suspension) / Math.max(1, ctx.height) * 0.25})\`,
          transformOrigin: "50% 100%",
          filter: \`drop-shadow(0 8px \${6 + bounce * 6}px #000000AA) drop-shadow(0 0 6px \${signal}44)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "7%",
          bottom: "7%",
          color: signal,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(8, ctx.width * 0.014),
          letterSpacing: "0.16em",
          opacity: 0.7
        }
      },
      "BELT ",
      Math.round(speed * 100).toString().padStart(3, "0"),
      " / TRANSFER"
    ));
  }
};
var O37_conveyor_belt_effect_default = kernel;
`;export{n as default};
