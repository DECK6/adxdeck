const e=`var __defProp = Object.defineProperty;
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
var U09_keyboard_press_effect_exports = {};
__export(U09_keyboard_press_effect_exports, {
  default: () => U09_keyboard_press_effect_default
});
module.exports = __toCommonJS(U09_keyboard_press_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const depth = Math.min(36, Math.max(8, Number(ctx.params.depth ?? 24)));
    const size = Math.min(1.3, Math.max(0.65, Number(ctx.params.size ?? 0.95)));
    const cycles = Math.min(5, Math.max(1, Math.round(Number(ctx.params.cycles ?? 3))));
    const rebound = Math.min(1, Math.max(0, Number(ctx.params.rebound ?? 0.62)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * TAU * cycles;
    const wave = 0.5 - Math.cos(phase) * 0.5;
    const press = Math.pow(wave, 1.8 + rebound * 2.4);
    const recoil = Math.max(0, Math.sin(phase * 2)) * (1 - press) * rebound;
    const travel = press * depth - recoil * depth * 0.16;
    const base = Math.min(ctx.width * 0.43, ctx.height * 0.5) * size;
    const capWidth = base * 1.24;
    const capHeight = base;
    const edge = Math.max(8, capHeight * 0.09);
    const squash = 1 - press * 0.075;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, [1, 0.72].map((scale, index) => /* @__PURE__ */ h(
      "div",
      {
        key: scale,
        style: {
          position: "absolute",
          left: "50%",
          top: "52%",
          width: capWidth,
          height: capHeight,
          border: \`2px solid \${signal}\`,
          borderRadius: capHeight * 0.17,
          opacity: press * (0.34 - index * 0.1),
          transform: \`translate(-50%, -50%) scale(\${scale + press * (0.48 + index * 0.2)})\`,
          boxShadow: \`0 0 \${18 + press * 34}px \${signal}\`
        }
      }
    )), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: capWidth,
          height: capHeight + edge,
          borderRadius: capHeight * 0.18,
          background: "#17191D",
          border: "1px solid #4A4F57",
          transform: \`translate(-50%, calc(-50% + \${edge + depth * 0.45}px))\`,
          boxShadow: "0 18px 38px #000000AA"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: capWidth,
          height: capHeight,
          overflow: "hidden",
          borderRadius: capHeight * 0.16,
          background: "#25292F",
          border: \`2px solid \${press > 0.62 ? signal : "#646A73"}\`,
          boxSizing: "border-box",
          transform: \`translate(-50%, calc(-50% + \${travel}px)) scale(\${1 + press * 0.025}, \${squash})\`,
          boxShadow: \`inset 0 \${-edge * 0.7}px \${edge * 1.5}px #050607AA, 0 \${edge - travel * 0.28}px \${Math.max(3, edge - press * edge * 0.55)}px #000000CC, 0 0 \${press * 28}px \${signal}55\`
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: "9%",
            transform: \`translateY(\${press * 3}px) scale(\${0.94 - press * 0.035})\`,
            opacity: 0.72 + press * 0.28
          }
        },
        ctx.subjectNode
      ),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: "12%",
            right: "12%",
            top: "9%",
            height: Math.max(2, edge * 0.28),
            borderRadius: 999,
            background: signal,
            opacity: 0.18 + press * 0.62,
            transform: \`scaleX(\${0.42 + press * 0.58})\`
          }
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: \`calc(50% + \${capHeight * 0.64 + depth}px)\`,
          width: capWidth * (0.42 + press * 0.38),
          height: Math.max(3, edge * 0.32),
          borderRadius: "50%",
          background: signal,
          opacity: 0.12 + press * 0.62,
          transform: "translate(-50%, -50%)",
          filter: \`blur(\${2 + press * 5}px)\`
        }
      }
    ));
  }
};
var U09_keyboard_press_effect_default = kernel;
`;export{e as default};
