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
var C11_perspective_card_effect_exports = {};
__export(C11_perspective_card_effect_exports, {
  default: () => C11_perspective_card_effect_default
});
module.exports = __toCommonJS(C11_perspective_card_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const tilt = Number(ctx.params.tilt ?? 13);
    const perspective = Number(ctx.params.perspective ?? 920);
    const lift = Number(ctx.params.lift ?? 24);
    const glow = Number(ctx.params.glow ?? 0.46);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const turn = ctx.t * Math.PI * 2;
    const rotateX = Math.sin(turn) * tilt * 0.62;
    const rotateY = Math.cos(turn) * tilt;
    const float = (1 - Math.cos(turn)) * lift * 0.5;
    const sheen = 50 + Math.sin(turn) * 36;
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          background: "#0D0E10",
          perspective
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            width: "72%",
            height: "68%",
            overflow: "hidden",
            border: \`1px solid \${signal}\`,
            borderRadius: 18,
            background: "#0D0E10",
            transformStyle: "preserve-3d",
            transform: \`translate3d(0, \${-float}px, \${float * 1.5}px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`,
            boxShadow: \`0 \${18 + float}px \${34 + lift}px #000000B8, 0 0 \${8 + glow * 26}px \${signal}\`,
            backfaceVisibility: "hidden"
          }
        },
        /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, transform: "translateZ(18px)" } }, ctx.subjectNode),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: "-25%",
              background: \`linear-gradient(112deg, transparent \${sheen - 16}%, \${signal} \${sheen}%, transparent \${sheen + 16}%)\`,
              opacity: 0.08 + glow * 0.14,
              transform: "translateZ(28px)"
            }
          }
        )
      )
    );
  }
};
var C11_perspective_card_effect_default = kernel;
`;export{e as default};
