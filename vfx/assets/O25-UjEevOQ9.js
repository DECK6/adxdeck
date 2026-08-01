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
var O25_glitch_pop_effect_exports = {};
__export(O25_glitch_pop_effect_exports, {
  default: () => O25_glitch_pop_effect_default
});
module.exports = __toCommonJS(O25_glitch_pop_effect_exports);
const LEAD = 0.06;
const SPAN = 0.5;
const POP_AT = 0.16;
const RED = "brightness(0) saturate(100%) invert(35%) sepia(92%) saturate(4549%) hue-rotate(331deg) brightness(102%) contrast(103%)";
const BLUE = "brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(2895%) hue-rotate(218deg) brightness(101%) contrast(102%)";
const kernel = {
  kind: "react",
  render: (ctx) => {
    const pop = Math.min(1.5, Math.max(1.05, Number(ctx.params.pop ?? 1.22)));
    const split = Math.min(30, Math.max(2, Number(ctx.params.split ?? 14)));
    const flash = Math.min(1, Math.max(0, Number(ctx.params.flash ?? 0.6)));
    const cycles = Math.min(3, Math.max(2, Math.round(Number(ctx.params.cycles ?? 3))));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const raw = (ctx.t * cycles % 1 - LEAD) / SPAN;
    const u = Math.min(1, Math.max(0, raw));
    const frameSpan = Math.max(cycles / (ctx.durationInFrames * SPAN), 1e-3);
    const spike = frameSpan * 1.2;
    const rise = Math.min(1, Math.max(0, u - POP_AT) / spike);
    const settle = Math.exp(-9 * Math.max(0, u - POP_AT - spike));
    const scale = 1 + (pop - 1) * rise * settle;
    const flashSpan = Math.min(POP_AT, Math.max(frameSpan * 4, 0.05) * (0.5 + flash));
    const burst = raw >= 0 ? Math.max(0, 1 - Math.abs(u - POP_AT) / flashSpan) : 0;
    const jitter = ctx.random(\`jitter:\${ctx.frame}\`) - 0.5;
    const offset = split * burst * (1 + jitter * 0.8);
    const drift = split * 0.35 * burst * jitter;
    const channels = [
      { key: "red", x: -offset, y: drift, filter: RED },
      { key: "blue", x: offset, y: -drift * 0.6, filter: BLUE }
    ];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          transform: \`scale(\${scale})\`,
          transformOrigin: "center"
        }
      },
      ctx.subjectNode
    ), burst > 0 ? channels.map((channel) => /* @__PURE__ */ h(
      "div",
      {
        key: channel.key,
        style: {
          position: "absolute",
          inset: 0,
          transform: \`translate3d(\${channel.x}px, \${channel.y}px, 0) scale(\${scale * (1 + burst * 0.02)})\`,
          transformOrigin: "center",
          filter: channel.filter,
          opacity: burst * 0.85,
          mixBlendMode: "screen"
        }
      },
      ctx.subjectNode
    )) : null, burst > 0 ? Array.from({ length: 3 }, (_, index) => {
      const top = ctx.random(\`band:\${ctx.frame}:\${index}:y\`) * 82;
      const thickness = 2 + ctx.random(\`band:\${ctx.frame}:\${index}:h\`) * 7;
      const shift = (ctx.random(\`band:\${ctx.frame}:\${index}:x\`) - 0.5) * split * 2.4 * burst;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: \`\${top}%\`,
            height: \`\${thickness}%\`,
            background: \`linear-gradient(90deg, transparent, \${signal}5C, transparent)\`,
            transform: \`translate3d(\${shift}px, 0, 0)\`,
            opacity: burst * 0.5,
            mixBlendMode: "screen"
          }
        }
      );
    }) : null, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: \`radial-gradient(circle at 50% 50%, \${signal}33, transparent 64%)\`,
          opacity: rise * settle * (1 - Math.min(1, Math.max(0, u - POP_AT) / (spike * 3))),
          mixBlendMode: "screen"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 48,
          bottom: 42,
          width: 96,
          height: 3,
          background: signal,
          opacity: 0.32 + burst * 0.5,
          transform: \`scaleX(\${1 + burst * 0.6})\`,
          transformOrigin: "left center"
        }
      }
    ));
  }
};
var O25_glitch_pop_effect_default = kernel;
`;export{n as default};
