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
var I09_flip_wall_effect_exports = {};
__export(I09_flip_wall_effect_exports, {
  default: () => I09_flip_wall_effect_default
});
module.exports = __toCommonJS(I09_flip_wall_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const columns = Math.max(3, Math.min(8, Math.round(Number(ctx.params.columns ?? 6))));
    const rows = Math.max(3, Math.round(columns * ctx.height / ctx.width));
    const stagger = Number(ctx.params.stagger ?? 0.46);
    const depth = Number(ctx.params.depth ?? 14);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration;
    const theta = phase * Math.PI * 2;
    const tileWidth = ctx.width / columns;
    const tileHeight = ctx.height / rows;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", perspective: ctx.width * 1.35 } }, Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const distance = (row + column) / Math.max(1, rows + columns - 2);
      const wave = 0.5 - 0.5 * Math.cos(theta - distance * stagger * Math.PI * 2);
      const angle = wave * 180;
      const left = column * tileWidth;
      const top = row * tileHeight;
      const edgeLight = Math.pow(Math.sin(wave * Math.PI), 3);
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left,
            top,
            width: tileWidth + 0.5,
            height: tileHeight + 0.5,
            transformStyle: "preserve-3d",
            transform: \`rotateY(\${angle}deg) translateZ(\${edgeLight * depth * 0.45}px)\`
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              backfaceVisibility: "hidden",
              transform: \`translateZ(\${depth / 2}px)\`,
              border: "1px solid #0D0E10",
              boxSizing: "border-box"
            }
          },
          /* @__PURE__ */ h("div", { style: { position: "absolute", left: -left, top: -top, width: ctx.width, height: ctx.height } }, ctx.subjectNode)
        ),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              backfaceVisibility: "hidden",
              transform: \`rotateY(180deg) translateZ(\${depth / 2}px)\`,
              border: \`1px solid \${signal}\`,
              boxSizing: "border-box",
              background: \`linear-gradient(135deg, #11151A, \${signal}2B)\`,
              color: signal,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: Math.max(8, Math.min(tileWidth, tileHeight) * 0.18)
            }
          },
          String(index + 1).padStart(2, "0")
        ),
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: "50%",
              top: 0,
              width: depth,
              height: "100%",
              transform: "translateX(-50%) rotateY(90deg)",
              background: signal,
              opacity: edgeLight,
              boxShadow: \`0 0 \${depth}px \${signal}\`
            }
          }
        )
      );
    }));
  }
};
var I09_flip_wall_effect_default = kernel;
`;export{n as default};
