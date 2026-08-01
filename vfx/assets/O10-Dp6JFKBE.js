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
var O10_pendulum_swing_effect_exports = {};
__export(O10_pendulum_swing_effect_exports, {
  default: () => O10_pendulum_swing_effect_default
});
module.exports = __toCommonJS(O10_pendulum_swing_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const maxAngle = Number(ctx.params.angle ?? 34);
    const ropeRatio = Number(ctx.params.rope ?? 0.42);
    const damping = Number(ctx.params.damping ?? 0.3);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const seconds = ctx.durationInFrames / Math.max(1, ctx.fps);
    const time = ctx.t * seconds;
    const pivotX = ctx.width / 2;
    const pivotY = ctx.height * 0.1;
    const ropeLength = ctx.height * ropeRatio;
    const bobSize = Math.min(ctx.width * 0.34, ctx.height * 0.4);
    const bobCenter = ropeLength + bobSize * 0.5;
    const lengthMeters = 0.35 + ropeRatio * 1.6;
    const omega = Math.sqrt(9.81 / lengthMeters);
    const angleAt = (at) => maxAngle * Math.exp(-damping * at) * Math.cos(omega * at);
    const angle = angleAt(time);
    const angularSpeed = Math.abs(
      maxAngle * Math.exp(-damping * time) * (damping * Math.cos(omega * time) + omega * Math.sin(omega * time))
    );
    const speed01 = Math.min(1, angularSpeed / Math.max(1, maxAngle * omega));
    const visible = Math.min(1, ctx.t / 0.08, Math.max(0, (1 - ctx.t) / 0.08));
    const radians = angle * Math.PI / 180;
    const bobX = pivotX + Math.sin(radians) * bobCenter;
    const shadowY = ctx.height * 0.93;
    const shadowWidth = bobSize * (0.46 - Math.abs(Math.sin(radians)) * 0.12);
    const arcRadius = bobCenter;
    const arcPoints = Array.from({ length: 25 }, (_, index) => {
      const sweep = (index / 24 * 2 - 1) * maxAngle;
      const rad = sweep * Math.PI / 180;
      return \`\${(pivotX + Math.sin(rad) * arcRadius).toFixed(1)},\${(pivotY + Math.cos(rad) * arcRadius).toFixed(1)}\`;
    }).join(" ");
    const arm = (armAngle, opacity, showBob) => /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: pivotX,
          top: pivotY,
          width: 0,
          height: 0,
          transform: \`rotate(\${armAngle}deg)\`,
          transformOrigin: "0 0",
          opacity
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: -1,
            top: 0,
            width: 2,
            height: ropeLength,
            background: \`linear-gradient(#6E737B, \${signal})\`
          }
        }
      ),
      showBob ? /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: -bobSize / 2,
            top: ropeLength - bobSize * 0.06,
            width: bobSize,
            height: bobSize,
            filter: \`drop-shadow(0 0 \${5 + speed01 * 16}px \${signal}55)\`
          }
        },
        ctx.subjectNode
      ) : /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: -bobSize * 0.16,
            top: ropeLength + bobSize * 0.34,
            width: bobSize * 0.32,
            height: bobSize * 0.32,
            border: \`1px solid \${signal}\`,
            borderRadius: "50%"
          }
        }
      )
    );
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
          points: arcPoints,
          fill: "none",
          stroke: signal,
          strokeWidth: "1",
          strokeDasharray: "4 7",
          opacity: 0.26 * visible
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: bobX - shadowWidth / 2,
          top: shadowY,
          width: shadowWidth,
          height: Math.max(4, ctx.height * 0.022),
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}44, #00000000)\`,
          opacity: 0.55 * visible
        }
      }
    ), arm(angleAt(time - 0.14), 0.1 * speed01 * visible, false), arm(angleAt(time - 0.07), 0.18 * speed01 * visible, false), arm(angle, visible, true), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: pivotX - ctx.width * 0.09,
          top: pivotY - Math.max(6, ctx.height * 0.024),
          width: ctx.width * 0.18,
          height: Math.max(4, ctx.height * 0.016),
          background: "#1A1C20",
          borderBottom: \`2px solid \${signal}\`,
          opacity: visible
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: pivotX - 5,
          top: pivotY - 5,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#0D0E10",
          border: \`2px solid \${signal}\`,
          opacity: visible
        }
      }
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
          opacity: 0.72 * visible
        }
      },
      "\\u03B8 ",
      angle >= 0 ? "+" : "\\u2212",
      Math.abs(angle).toFixed(1),
      "\\xB0"
    ));
  }
};
var O10_pendulum_swing_effect_default = kernel;
`;export{n as default};
