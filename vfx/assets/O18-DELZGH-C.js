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
var O18_self_orbit_effect_exports = {};
__export(O18_self_orbit_effect_exports, {
  default: () => O18_self_orbit_effect_default
});
module.exports = __toCommonJS(O18_self_orbit_effect_exports);
const TRAIL = 6;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const radius = Number(ctx.params.radius ?? 0.5);
    const flatten = Number(ctx.params.flatten ?? 0.42);
    const lean = Number(ctx.params.lean ?? 0.6);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const unitX = ctx.width / 100;
    const turn = Math.PI * 2 * (cycles * ctx.t % 1);
    const rx = radius * 11 * unitX;
    const ry = rx * flatten;
    const centerX = ctx.width / 2;
    const centerY = ctx.height * 0.5;
    const orbitX = Math.cos(turn) * rx;
    const orbitY = Math.sin(turn) * ry;
    const bank = -lean * 13 * Math.sin(turn);
    const near = Math.sin(turn);
    const scale = 1 + near * 0.055;
    const markerSize = 2.2 * unitX;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: centerX,
          top: centerY,
          width: rx * 2,
          height: ry * 2,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: \`1px dashed \${signal}\`,
          opacity: 0.24
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: centerX,
          top: centerY,
          width: 1.6 * unitX,
          height: 1.6 * unitX,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: signal,
          opacity: 0.35
        }
      }
    ), Array.from({ length: TRAIL }, (_, index) => {
      const lag = turn - (index + 1) * 0.24;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: centerX + Math.cos(lag) * rx,
            top: centerY + Math.sin(lag) * ry,
            width: markerSize * (1 - index / (TRAIL + 2)),
            height: markerSize * (1 - index / (TRAIL + 2)),
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: signal,
            opacity: 0.42 * (1 - index / TRAIL)
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: centerX + orbitX,
          top: centerY + orbitY,
          width: markerSize,
          height: markerSize,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: signal,
          opacity: 0.9
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: centerX + orbitX,
          top: ctx.height * 0.87,
          width: (16 + near * 3) * unitX,
          height: 4.2 * unitX,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
          opacity: 0.14 + Math.max(0, near) * 0.16
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${orbitX}px, \${orbitY}px, 0) rotate(\${bank}deg) scale(\${scale})\`,
          transformOrigin: "center",
          filter: \`drop-shadow(0 0 \${(2 + Math.max(0, near) * 4) * unitX}px \${signal}44)\`
        }
      },
      ctx.subjectNode
    ));
  }
};
var O18_self_orbit_effect_default = kernel;
`;export{n as default};
