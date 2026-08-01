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
var X16_split_open_effect_exports = {};
__export(X16_split_open_effect_exports, {
  default: () => X16_split_open_effect_default
});
module.exports = __toCommonJS(X16_split_open_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const travel = Number(ctx.params.travel ?? 1);
    const edge = Number(ctx.params.edge ?? 4);
    const depth = Number(ctx.params.depth ?? 0.06);
    const underlay = String(ctx.params.underlay ?? "clean");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const progress = cycle * cycle * (3 - 2 * cycle);
    const distance = progress * travel * ctx.width * 0.52;
    const underlayFilter = underlay === "monochrome" ? "grayscale(1) contrast(1.08)" : underlay === "dimmed" ? "brightness(0.55) saturate(0.7)" : "none";
    const panel = (side) => {
      const isLeft = side === "left";
      return /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            left: isLeft ? 0 : "50%",
            top: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
            background: "#0D0E10",
            boxShadow: \`\${isLeft ? edge : -edge}px 0 \${edge * 3}px \${signal}\`,
            transform: \`translate3d(\${isLeft ? -distance : distance}px, 0, \${progress * 18}px) rotateY(\${isLeft ? -depth * progress * 90 : depth * progress * 90}deg)\`,
            transformOrigin: isLeft ? "right center" : "left center"
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: isLeft ? 0 : "-100%",
              top: 0,
              width: "200%",
              height: "100%"
            }
          },
          ctx.subjectNode
        ),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              top: 0,
              bottom: 0,
              [isLeft ? "right" : "left"]: 0,
              width: edge,
              background: signal,
              opacity: 0.9,
              boxShadow: \`0 0 \${edge * 4}px \${signal}\`
            }
          }
        )
      );
    };
    return /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#0D0E10",
          perspective: Math.max(500, ctx.width * 1.2)
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            filter: underlayFilter,
            transform: \`scale(\${1 + depth * (1 - progress)})\`,
            opacity: 0.45 + progress * 0.55
          }
        },
        ctx.subjectNode
      ),
      panel("left"),
      panel("right")
    );
  }
};
var X16_split_open_effect_default = kernel;
`;export{e as default};
