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
var O14_rubber_band_effect_exports = {};
__export(O14_rubber_band_effect_exports, {
  default: () => O14_rubber_band_effect_default
});
module.exports = __toCommonJS(O14_rubber_band_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const pull = Number(ctx.params.pull ?? 0.24);
    const tension = Number(ctx.params.tension ?? 2.2);
    const elasticity = Number(ctx.params.elasticity ?? 1.15);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const seconds = ctx.durationInFrames / Math.max(1, ctx.fps);
    const drawEnd = 0.34;
    const holdEnd = 0.42;
    const stretch = ctx.height * pull;
    const offsetAt = (at) => {
      if (at < drawEnd) {
        const u = Math.max(0, at) / drawEnd;
        return stretch * (1 - Math.pow(1 - u, 2.4));
      }
      if (at < holdEnd) {
        const age2 = (at - drawEnd) * seconds;
        return stretch * (1 + 0.014 * Math.sin(Math.PI * 2 * 9 * age2));
      }
      const age = (at - holdEnd) * seconds;
      return stretch * Math.exp(-elasticity * age) * Math.cos(Math.PI * 2 * tension * age);
    };
    const offset = offsetAt(ctx.t);
    const speed = Math.abs(offset - offsetAt(ctx.t - 0.01)) / 0.01;
    const speed01 = Math.min(1, speed / Math.max(1, ctx.height * 3));
    const taut = Math.min(1, Math.abs(offset) / Math.max(1, stretch));
    const deform = Math.min(0.4, taut * 0.16 + speed01 * 0.24);
    const boxWidth = ctx.width * 0.3;
    const boxHeight = ctx.height * 0.36;
    const centerX = ctx.width / 2;
    const restY = ctx.height * 0.44;
    const nodeY = restY + offset;
    const bandWidth = Math.max(1.2, ctx.height * 8e-3 * (1 - taut * 0.45));
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "svg",
      {
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      },
      /* @__PURE__ */ h(
        "polyline",
        {
          points: \`\${ctx.width * 0.08},\${restY} \${centerX},\${nodeY} \${ctx.width * 0.92},\${restY}\`,
          fill: "none",
          stroke: signal,
          strokeWidth: bandWidth,
          strokeLinejoin: "round",
          opacity: 0.5 + taut * 0.45,
          style: { filter: \`drop-shadow(0 0 \${4 + taut * 12}px \${signal})\` }
        }
      ),
      /* @__PURE__ */ h(
        "line",
        {
          x1: ctx.width * 0.08,
          y1: restY,
          x2: ctx.width * 0.92,
          y2: restY,
          stroke: signal,
          strokeWidth: "1",
          strokeDasharray: "3 9",
          opacity: "0.22"
        }
      )
    ), [0.03, 0.06, 0.09].map((delay, index) => /* @__PURE__ */ h(
      "div",
      {
        key: delay,
        style: {
          position: "absolute",
          left: centerX - boxWidth / 2,
          top: restY + offsetAt(ctx.t - delay) - boxHeight * 0.42,
          width: boxWidth,
          height: boxHeight,
          opacity: speed01 * (0.24 - index * 0.07),
          filter: "grayscale(0.5)"
        }
      },
      ctx.subjectNode
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: centerX - boxWidth / 2,
          top: nodeY - boxHeight * 0.42,
          width: boxWidth,
          height: boxHeight,
          transform: \`scale(\${1 - deform * 0.6}, \${1 + deform})\`,
          transformOrigin: "center",
          filter: \`drop-shadow(0 0 \${5 + speed01 * 22}px \${signal}66)\`
        }
      },
      ctx.subjectNode
    ), [ctx.width * 0.08, ctx.width * 0.92].map((postX) => /* @__PURE__ */ h(
      "div",
      {
        key: postX,
        style: {
          position: "absolute",
          left: postX - ctx.width * 0.012,
          top: restY - ctx.height * 0.05,
          width: ctx.width * 0.024,
          height: ctx.height * 0.1,
          background: "#1A1C20",
          border: \`1px solid \${signal}88\`
        }
      }
    )), /* @__PURE__ */ h(
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
          opacity: 0.72
        }
      },
      "TENSION ",
      Math.round(taut * 100).toString().padStart(3, "0")
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          right: "7%",
          bottom: "7.6%",
          width: "18%",
          height: 2,
          background: \`\${signal}33\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            background: signal,
            transform: \`scaleX(\${taut})\`,
            transformOrigin: "right"
          }
        }
      )
    ));
  }
};
var O14_rubber_band_effect_default = kernel;
`;export{t as default};
