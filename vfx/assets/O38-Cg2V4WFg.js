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
var O38_elevator_stop_effect_exports = {};
__export(O38_elevator_stop_effect_exports, {
  default: () => O38_elevator_stop_effect_default
});
module.exports = __toCommonJS(O38_elevator_stop_effect_exports);
const smoothstep = (value) => value * value * (3 - 2 * value);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const travel = Math.min(0.58, Math.max(0.2, Number(ctx.params.travel ?? 0.42)));
    const overshoot = Math.min(1, Math.max(0, Number(ctx.params.overshoot ?? 0.66)));
    const damping = Math.min(9, Math.max(2, Number(ctx.params.damping ?? 5.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const settle = (u, direction2) => {
      const window = Math.sin(Math.PI * u) * (1 - u);
      return direction2 * overshoot * 0.075 * Math.exp(-damping * u) * Math.sin(Math.PI * 4 * u) * window;
    };
    const cableRing = (u) => {
      const window = Math.sin(Math.PI * u) * (1 - u);
      return overshoot * Math.exp(-damping * 0.72 * u) * Math.sin(Math.PI * 8 * u) * window;
    };
    let level = 1;
    let ring = 0;
    let direction = 0;
    if (ctx.t >= 0.08 && ctx.t < 0.28) {
      const u = (ctx.t - 0.08) / 0.2;
      level = 1 - smoothstep(u);
      direction = -1;
    } else if (ctx.t >= 0.28 && ctx.t < 0.5) {
      const u = (ctx.t - 0.28) / 0.22;
      level = settle(u, -1);
      ring = cableRing(u);
    } else if (ctx.t >= 0.58 && ctx.t < 0.78) {
      const u = (ctx.t - 0.58) / 0.2;
      level = smoothstep(u);
      direction = 1;
    } else if (ctx.t >= 0.78) {
      const u = (ctx.t - 0.78) / 0.22;
      level = 1 + settle(u, 1);
      ring = cableRing(u);
    } else if (ctx.t >= 0.5) {
      level = 0;
    }
    const carWidth = ctx.width * 0.3;
    const carHeight = ctx.height * 0.27;
    const top = ctx.height * (0.16 + travel * level);
    const cableHeight = Math.max(0, top - ctx.height * 0.04);
    const speedBars = direction === 0 ? 0 : 4;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", left: "24%", top: "5%", bottom: "7%", width: 1, background: signal, opacity: 0.2 } }), /* @__PURE__ */ h("div", { style: { position: "absolute", right: "24%", top: "5%", bottom: "7%", width: 1, background: signal, opacity: 0.2 } }), Array.from({ length: 7 }, (_, index) => /* @__PURE__ */ h(
      "div",
      {
        key: index,
        style: {
          position: "absolute",
          left: "22%",
          right: "22%",
          top: \`\${10 + index * 13}%\`,
          height: 1,
          background: signal,
          opacity: index === Math.round(level * 4) + 1 ? 0.5 : 0.09
        }
      }
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`calc(50% - \${carWidth * 0.01}px)\`,
          top: ctx.height * 0.03,
          width: Math.max(2, carWidth * 0.02),
          height: cableHeight,
          background: signal,
          opacity: 0.5,
          transform: \`translateX(\${ring * carWidth * 0.05}px)\`,
          transformOrigin: "top center",
          boxShadow: \`0 0 8px \${signal}\`
        }
      }
    ), Array.from({ length: speedBars }, (_, index) => /* @__PURE__ */ h(
      "div",
      {
        key: \`speed:\${index}\`,
        style: {
          position: "absolute",
          left: \`\${31 + index * 12}%\`,
          top: top + (direction < 0 ? carHeight + 8 : -20),
          width: 1,
          height: 12 + index * 4,
          background: signal,
          opacity: 0.18 + index * 0.07
        }
      }
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: \`calc(50% - \${carWidth / 2}px)\`,
          top,
          width: carWidth,
          height: carHeight,
          border: \`1px solid \${signal}\`,
          background: "#101519",
          boxShadow: \`0 0 \${10 + Math.abs(ring) * 18}px \${signal}55\`,
          transform: \`translateX(\${ring * carWidth * 0.018}px) scaleY(\${1 - Math.abs(ring) * 0.025})\`,
          transformOrigin: "center top",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "12%" } }, ctx.subjectNode),
      /* @__PURE__ */ h("div", { style: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: signal, opacity: 0.2 } })
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
          opacity: 0.72
        }
      },
      "FLOOR ",
      level < 0.5 ? "02" : "01",
      " / ",
      direction === 0 ? Math.abs(ring) > 0.01 ? "BRAKE" : "HOLD" : direction < 0 ? "UP" : "DOWN"
    ));
  }
};
var O38_elevator_stop_effect_default = kernel;
`;export{n as default};
