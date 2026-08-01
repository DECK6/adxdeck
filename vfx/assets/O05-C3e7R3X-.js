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
var O05_slide_snap_effect_exports = {};
__export(O05_slide_snap_effect_exports, {
  default: () => O05_slide_snap_effect_default
});
module.exports = __toCommonJS(O05_slide_snap_effect_exports);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const from = String(ctx.params.from ?? "left");
    const distance = Number(ctx.params.distance ?? 0.75);
    const damping = Number(ctx.params.damping ?? 5.6);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const horiz = from === "left" || from === "right";
    const sign = from === "left" || from === "top" ? -1 : 1;
    const span = horiz ? ctx.width : ctx.height;
    const p = clamp01(ctx.t / 0.34);
    const decay = Math.exp(-damping * p);
    const settle = 1 - decay * Math.cos(9.4 * p);
    const velocity = decay * Math.sin(9.4 * p);
    const speed = Math.abs(velocity);
    const idle = Math.max(0, ctx.t - 0.34);
    const drift = Math.sin(idle * Math.PI * 1.4) * span * 4e-3;
    const offset = (1 - settle) * distance * span * sign + drift;
    const dx = horiz ? offset : 0;
    const dy = horiz ? 0 : offset;
    const stretch = 1 + speed * 0.3;
    const squash = 1 - speed * 0.14;
    const scaleX = horiz ? stretch : squash;
    const scaleY = horiz ? squash : stretch;
    const cx = ctx.width * 0.5 + dx;
    const cy = ctx.height * 0.486 + dy;
    const dir = offset >= 0 ? 1 : -1;
    const pad = horiz ? ctx.width * 0.1 : ctx.height * 0.17;
    const thickness = Math.max(1, ctx.height * 8e-3);
    const lift = clamp01(Math.abs(dy) / (ctx.height * 0.5));
    const outro = clamp01((1 - ctx.t) / 0.1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: "69%",
          bottom: 0,
          background: "linear-gradient(180deg, rgba(247,250,252,0.05), rgba(247,250,252,0))"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width * 0.5 + dx,
          top: "70%",
          width: ctx.height * (0.5 + lift * 0.3),
          height: ctx.height * 0.08,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))",
          opacity: 0.85 - lift * 0.5
        }
      }
    ), [0, 1, 2, 3].map((index) => {
      const lane = (index - 1.5) * 0.075 * (horiz ? ctx.height : ctx.width);
      const length = speed * (0.14 + index * 0.05) * span;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left: horiz ? dir > 0 ? cx + pad : cx - pad - length : cx + lane,
            top: horiz ? cy + lane : dir > 0 ? cy + pad : cy - pad - length,
            width: horiz ? length : thickness,
            height: horiz ? thickness : length,
            background: signal,
            opacity: speed * (0.7 - index * 0.11)
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          transform: \`translate3d(\${dx}px, \${dy}px, 0) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "50% 47.8%"
        }
      },
      ctx.subjectNode
    )));
  }
};
var O05_slide_snap_effect_default = kernel;
`;export{n as default};
