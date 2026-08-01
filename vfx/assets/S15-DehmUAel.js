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
var S15_isometric_stack_effect_exports = {};
__export(S15_isometric_stack_effect_exports, {
  default: () => S15_isometric_stack_effect_default
});
module.exports = __toCommonJS(S15_isometric_stack_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const layers = Math.max(3, Math.round(Number(ctx.params.layers ?? 5)));
    const spacing = Number(ctx.params.spacing ?? 19);
    const tilt = Number(ctx.params.tilt ?? 58);
    const float = Number(ctx.params.float ?? 25);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const turn = phase * Math.PI * 2;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", display: "grid", placeItems: "center", background: "#0D0E10", perspective: ctx.width * 1.15 } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "relative",
          width: "56%",
          height: "52%",
          transformStyle: "preserve-3d",
          transform: \`rotateX(\${tilt}deg) rotateZ(\${45 + Math.sin(turn) * 3.5}deg)\`
        }
      },
      Array.from({ length: layers }, (_, index) => {
        const order = layers - 1 - index;
        const wave = Math.sin(turn + index * 0.72);
        const lift = order * spacing + wave * float;
        const slide = Math.cos(turn + index * 0.54) * float * 0.42;
        const alpha = 0.2 + (index + 1) / layers * 0.62;
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              border: \`2px solid \${signal}\`,
              borderRadius: 9,
              background: "#0D0E10",
              opacity: alpha,
              transform: \`translate3d(\${slide}px, \${-slide}px, \${lift}px)\`,
              boxShadow: \`0 0 \${8 + index * 3}px \${signal}, \${spacing}px \${spacing}px \${18 + order * 5}px #000000A8\`,
              backfaceVisibility: "hidden"
            }
          },
          /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, transform: "rotateZ(-45deg) scale(1.42)", filter: \`brightness(\${0.54 + index / layers * 0.6})\` } }, ctx.subjectNode)
        );
      })
    ));
  }
};
var S15_isometric_stack_effect_default = kernel;
`;export{e as default};
