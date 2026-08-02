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
var I12_ribbon_twist_effect_exports = {};
__export(I12_ribbon_twist_effect_exports, {
  default: () => I12_ribbon_twist_effect_default
});
module.exports = __toCommonJS(I12_ribbon_twist_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const segments = Math.max(12, Math.min(32, Math.round(Number(ctx.params.segments ?? 24))));
    const twists = Math.max(1, Math.round(Number(ctx.params.twists ?? 2)));
    const depth = Number(ctx.params.depth ?? 110);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const theta = phase * Math.PI * 2;
    const ribbonWidth = ctx.width * 0.72;
    const ribbonHeight = ctx.height * 0.42;
    const segmentWidth = ribbonWidth / segments;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.1 } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: ribbonWidth,
          height: ribbonHeight,
          transform: "translate(-50%, -50%) rotateZ(-4deg)",
          transformStyle: "preserve-3d"
        }
      },
      Array.from({ length: segments }, (_, index) => {
        const normalized = index / Math.max(1, segments - 1);
        const local = normalized * Math.PI * 2 * twists + theta;
        const z = Math.sin(local) * depth;
        const y = Math.cos(local) * ribbonHeight * 0.13;
        const rotation = local * 180 / Math.PI;
        const light = 0.55 + 0.45 * (0.5 + 0.5 * Math.cos(local));
        return /* @__PURE__ */ h(
          "div",
          {
            key: index,
            style: {
              position: "absolute",
              left: index * segmentWidth,
              top: 0,
              width: segmentWidth + 1,
              height: ribbonHeight,
              transformStyle: "preserve-3d",
              transform: \`translate3d(0, \${y}px, \${z}px) rotateX(\${rotation}deg)\`,
              transformOrigin: "50% 50%"
            }
          },
          /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", backfaceVisibility: "hidden", filter: \`brightness(\${light})\` } }, /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                left: -index * segmentWidth,
                top: 0,
                width: ribbonWidth,
                height: ribbonHeight
              }
            },
            ctx.subjectNode
          )),
          /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
                background: \`linear-gradient(180deg, #101419, \${signal}55, #101419)\`,
                borderLeft: \`1px solid \${signal}66\`
              }
            }
          )
        );
      })
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "50%",
          top: "72%",
          width: ribbonWidth * 0.78,
          height: ctx.height * 0.1,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}26, transparent)\`,
          filter: \`blur(\${Math.max(6, depth * 0.08)}px)\`
        }
      }
    ));
  }
};
var I12_ribbon_twist_effect_default = kernel;
`;export{n as default};
