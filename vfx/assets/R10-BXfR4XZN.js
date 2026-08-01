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
var R10_stripe_shift_effect_exports = {};
__export(R10_stripe_shift_effect_exports, {
  default: () => R10_stripe_shift_effect_default
});
module.exports = __toCommonJS(R10_stripe_shift_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const orientation = String(ctx.params.orientation ?? "horizontal");
    const stripeSize = Number(ctx.params.stripeSize ?? 52);
    const shift = Number(ctx.params.shift ?? 72);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const horizontal = orientation !== "vertical";
    const extent = horizontal ? ctx.height : ctx.width;
    const stripeCount = Math.ceil(extent / stripeSize) + 1;
    const loopPhase = Math.PI * 2 * cycles * ctx.t;
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#0D0E10",
          backgroundImage: horizontal ? \`repeating-linear-gradient(to bottom, \${signal}18 0 1px, transparent 1px \${stripeSize}px)\` : \`repeating-linear-gradient(to right, \${signal}18 0 1px, transparent 1px \${stripeSize}px)\`
        }
      },
      /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.1 } }, ctx.subjectNode),
      Array.from({ length: stripeCount }, (_, index) => {
        const start = index * stripeSize;
        const end = Math.min(extent, start + stripeSize);
        const phase = loopPhase + index * 0.56;
        const direction = index % 2 === 0 ? 1 : -1;
        const displacement = Math.sin(phase) * shift * direction;
        const clipPath = horizontal ? \`inset(\${start}px 0 \${Math.max(0, ctx.height - end)}px 0)\` : \`inset(0 \${Math.max(0, ctx.width - end)}px 0 \${start}px)\`;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              inset: 0,
              clipPath,
              transform: horizontal ? \`translate3d(\${displacement}px, 0, 0)\` : \`translate3d(0, \${displacement}px, 0)\`,
              filter: \`drop-shadow(0 0 5px \${signal})\`
            }
          },
          ctx.subjectNode
        );
      }),
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: horizontal ? \`repeating-linear-gradient(to bottom, transparent 0 \${Math.max(1, stripeSize - 2)}px, \${signal}  \${Math.max(1, stripeSize - 2)}px \${stripeSize}px)\` : \`repeating-linear-gradient(to right, transparent 0 \${Math.max(1, stripeSize - 2)}px, \${signal} \${Math.max(1, stripeSize - 2)}px \${stripeSize}px)\`,
            opacity: 0.16
          }
        }
      )
    );
  }
};
var R10_stripe_shift_effect_default = kernel;
`;export{t as default};
