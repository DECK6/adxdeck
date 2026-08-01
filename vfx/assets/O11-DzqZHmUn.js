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
var O11_spring_chain_effect_exports = {};
__export(O11_spring_chain_effect_exports, {
  default: () => O11_spring_chain_effect_default
});
module.exports = __toCommonJS(O11_spring_chain_effect_exports);
function springStep(elapsed, omega, zeta) {
  if (elapsed <= 0) return 0;
  const damped = omega * Math.sqrt(Math.max(25e-4, 1 - zeta * zeta));
  const decay = Math.exp(-zeta * omega * elapsed);
  return 1 - decay * (Math.cos(damped * elapsed) + zeta * omega / damped * Math.sin(damped * elapsed));
}
const kernel = {
  kind: "react",
  render: (ctx) => {
    const echoes = Math.max(1, Math.min(3, Math.round(Number(ctx.params.echoes ?? 3))));
    const lag = Number(ctx.params.lag ?? 0.14);
    const stiffness = Number(ctx.params.stiffness ?? 9);
    const bounciness = Number(ctx.params.bounciness ?? 0.42);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const seconds = ctx.durationInFrames / Math.max(1, ctx.fps);
    const time = ctx.t * seconds;
    const zeta = Math.max(0.15, Math.min(0.9, 1 - bounciness));
    const marks = [0.1, 0.3, 0.5, 0.7].map((fraction) => fraction * seconds);
    const reachX = ctx.width * 0.24;
    const reachY = ctx.height * 0.24;
    const targetAt = (at) => ({
      x: reachX * ((at >= marks[0] ? 1 : 0) - (at >= marks[1] ? 1 : 0) - (at >= marks[2] ? 1 : 0) + (at >= marks[3] ? 1 : 0)),
      y: -reachY * ((at >= marks[1] ? 1 : 0) - (at >= marks[2] ? 1 : 0))
    });
    const followAt = (at) => ({
      x: reachX * (springStep(at - marks[0], stiffness, zeta) - springStep(at - marks[1], stiffness, zeta) - springStep(at - marks[2], stiffness, zeta) + springStep(at - marks[3], stiffness, zeta)),
      y: -reachY * (springStep(at - marks[1], stiffness, zeta) - springStep(at - marks[2], stiffness, zeta))
    });
    const body = followAt(time);
    const previous = followAt(time - 0.05);
    const velocityX = (body.x - previous.x) / 0.05;
    const velocityY = (body.y - previous.y) / 0.05;
    const speed = Math.hypot(velocityX, velocityY);
    const speed01 = Math.min(1, speed / (ctx.width * 1.1));
    const heading = Math.atan2(velocityY, velocityX) * 180 / Math.PI;
    const target = targetAt(time);
    const boxWidth = ctx.width * 0.34;
    const boxHeight = ctx.height * 0.42;
    const homeLeft = (ctx.width - boxWidth) / 2;
    const homeTop = (ctx.height - boxHeight) / 2;
    const chain = Array.from({ length: echoes }, (_, index) => followAt(time - (index + 1) * lag));
    const chainPoints = [body, ...chain].map((point) => \`\${(ctx.width / 2 + point.x).toFixed(1)},\${(ctx.height / 2 + point.y).toFixed(1)}\`).join(" ");
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "svg",
      {
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      },
      /* @__PURE__ */ h("polyline", { points: chainPoints, fill: "none", stroke: signal, strokeWidth: "1.5", opacity: 0.3 + speed01 * 0.4 })
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width / 2 + target.x - ctx.width * 0.026,
          top: ctx.height / 2 + target.y - ctx.width * 0.026,
          width: ctx.width * 0.052,
          height: ctx.width * 0.052,
          border: \`1px solid \${signal}\`,
          opacity: 0.42,
          transform: "rotate(45deg)"
        }
      }
    ), chain.map((point, index) => /* @__PURE__ */ h(
      "div",
      {
        key: index,
        style: {
          position: "absolute",
          left: homeLeft + point.x,
          top: homeTop + point.y,
          width: boxWidth,
          height: boxHeight,
          opacity: (0.3 - index * 0.08) * (0.35 + speed01 * 0.65),
          transform: \`scale(\${1 - (index + 1) * 0.06})\`,
          filter: "grayscale(0.4)"
        }
      },
      ctx.subjectNode
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: homeLeft + body.x,
          top: homeTop + body.y,
          width: boxWidth,
          height: boxHeight,
          transform: \`rotate(\${heading}deg) scale(\${1 + speed01 * 0.14}, \${1 - speed01 * 0.1}) rotate(\${-heading}deg)\`,
          filter: \`drop-shadow(0 0 \${5 + speed01 * 20}px \${signal}66)\`
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
      "LAG ",
      (lag * 1e3).toFixed(0),
      "MS / \\u03B6 ",
      zeta.toFixed(2)
    ));
  }
};
var O11_spring_chain_effect_default = kernel;
`;export{t as default};
