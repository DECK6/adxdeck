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
var O04_flip_reveal_effect_exports = {};
__export(O04_flip_reveal_effect_exports, {
  default: () => O04_flip_reveal_effect_default
});
module.exports = __toCommonJS(O04_flip_reveal_effect_exports);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const kernel = {
  kind: "react",
  render: (ctx) => {
    const angle = Number(ctx.params.angle ?? 180);
    const perspective = Number(ctx.params.perspective ?? 2.2);
    const damping = Number(ctx.params.damping ?? 5.2);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const p = clamp01(ctx.t / 0.4);
    const settle = 1 - Math.exp(-damping * p) * Math.cos(7.2 * p);
    const idle = Math.max(0, ctx.t - 0.4);
    const rotY = -angle * (1 - settle) + 2.2 * Math.sin(idle * Math.PI * 1.3);
    const rotX = 1.4 * Math.sin(idle * Math.PI * 0.9);
    const scale = 0.86 + clamp01(settle) * 0.14;
    const facing = Math.cos(rotY * Math.PI / 180);
    const sweep = 50 + Math.sin(rotY * Math.PI / 180) * 70;
    const glint = Math.pow(1 - Math.abs(facing), 6);
    const outro = clamp01((1 - ctx.t) / 0.1);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: outro } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "72%",
          width: ctx.height * 0.56 * Math.abs(facing) * scale,
          height: ctx.height * 0.07,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.8), rgba(0,0,0,0))",
          opacity: 0.5 + Math.abs(facing) * 0.5
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
          perspective: ctx.width * perspective,
          perspectiveOrigin: "50% 48%"
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transform: \`rotateY(\${rotY}deg) rotateX(\${rotX}deg) scale(\${scale})\`
          }
        },
        ctx.subjectNode,
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: \`linear-gradient(105deg, rgba(255,255,255,0) \${sweep - 26}%, rgba(255,255,255,0.17) \${sweep}%, rgba(255,255,255,0) \${sweep + 26}%)\`,
              opacity: clamp01(facing) * 0.9
            }
          }
        ),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              background: "#15171B",
              border: \`1px solid \${signal}\`,
              opacity: clamp01(-facing) * 0.94
            }
          }
        )
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "19%",
          width: Math.max(1, ctx.height * 0.012),
          height: "62%",
          transform: "translateX(-50%)",
          background: signal,
          opacity: glint * 0.95,
          boxShadow: \`0 0 \${ctx.height * 0.08}px \${signal}\`
        }
      }
    )));
  }
};
var O04_flip_reveal_effect_default = kernel;
`;export{n as default};
