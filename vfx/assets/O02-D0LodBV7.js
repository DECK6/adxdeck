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
var O02_drop_bounce_effect_exports = {};
__export(O02_drop_bounce_effect_exports, {
  default: () => O02_drop_bounce_effect_default
});
module.exports = __toCommonJS(O02_drop_bounce_effect_exports);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const DECAY = 3.2;
const REST = Math.exp(-DECAY);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const dropHeight = Number(ctx.params.dropHeight ?? 0.62);
    const bounces = Number(ctx.params.bounces ?? 2.6);
    const squash = Number(ctx.params.squash ?? 0.62);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = clamp01(ctx.t / 0.38);
    const omega = Math.PI * (bounces + 0.5);
    const env = Math.max(0, (Math.exp(-DECAY * p) - REST) / (1 - REST));
    const swing = Math.cos(omega * p);
    const height = dropHeight * env * Math.abs(swing);
    const idle = Math.max(0, ctx.t - 0.38);
    const hover = Math.sin(idle * Math.PI * 2) * 5e-3;
    const dropY = -(height + hover) * ctx.height;
    const contact = Math.exp(-Math.pow(height / (dropHeight * 0.14), 2));
    const impact = squash * contact * Math.sqrt(env);
    const stretch = 0.26 * Math.abs(Math.sin(omega * p)) * env;
    const scaleY = 1 - impact * 0.42 + stretch;
    const scaleX = 1 + impact * 0.34 - stretch * 0.7;
    const flow = env * Math.sin(omega * p) * Math.sign(swing);
    const ghostY = dropY - flow * ctx.height * dropHeight * 0.1;
    const speed = Math.abs(flow);
    const near = 1 - clamp01(height / dropHeight);
    const outro = clamp01((1 - ctx.t) / 0.1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: "67.2%",
          bottom: 0,
          background: "linear-gradient(180deg, rgba(247,250,252,0.06), rgba(247,250,252,0))"
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "68%",
          width: ctx.height * (0.34 + near * 0.42),
          height: ctx.height * (0.05 + near * 0.05),
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0))",
          opacity: 0.3 + near * 0.7
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "68%",
          width: ctx.height * (0.2 + contact * 0.5),
          height: ctx.height * 0.05,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: signal,
          opacity: 0.5 * contact * Math.sqrt(env),
          filter: \`blur(\${ctx.height * 0.02}px)\`
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          transform: \`translate3d(0, \${ghostY}px, 0) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "50% 78%",
          opacity: 0.3 * speed,
          filter: \`blur(\${speed * ctx.height * 0.018}px)\`
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          transform: \`translate3d(0, \${dropY}px, 0) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "50% 78%"
        }
      },
      ctx.subjectNode
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "67.2%",
          height: Math.max(1, ctx.height * 6e-3),
          background: signal,
          opacity: 0.14 + 0.55 * contact * Math.sqrt(env)
        }
      }
    )));
  }
};
var O02_drop_bounce_effect_default = kernel;
`;export{n as default};
