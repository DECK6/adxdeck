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
var R11_checker_flip_effect_exports = {};
__export(R11_checker_flip_effect_exports, {
  default: () => R11_checker_flip_effect_default
});
module.exports = __toCommonJS(R11_checker_flip_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const cellSize = Number(ctx.params.cellSize ?? 80);
    const stagger = Number(ctx.params.stagger ?? 0.58);
    const depth = Number(ctx.params.depth ?? 0.72);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const columns = Math.ceil(ctx.width / cellSize);
    const rows = Math.ceil(ctx.height / cellSize);
    const sequenceSpan = Math.max(1, columns + rows - 2);
    const basePhase = Math.PI * 2 * cycles * ctx.t;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.12 } }, ctx.subjectNode), Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const left = column * cellSize;
      const top = row * cellSize;
      const width = Math.min(cellSize, ctx.width - left);
      const height = Math.min(cellSize, ctx.height - top);
      const sequence = (row + column) / sequenceSpan;
      const checkerOffset = (row + column) % 2 === 0 ? 0 : Math.PI;
      const phase = basePhase - sequence * stagger * Math.PI * 2 + checkerOffset;
      const flip = 0.5 - 0.5 * Math.cos(phase);
      const angle = flip * 180;
      const edge = 0.08 + Math.sin(flip * Math.PI) * depth * 0.55;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            left,
            top,
            width,
            height,
            overflow: "hidden",
            transform: \`perspective(720px) rotateY(\${angle}deg)\`,
            transformOrigin: "center",
            backfaceVisibility: "visible",
            border: \`1px solid \${signal}\`,
            boxSizing: "border-box",
            boxShadow: \`inset 0 0 \${10 + depth * 20}px \${signal}\`
          }
        },
        /* @__PURE__ */ h(
          "div",
          {
            style: {
              position: "absolute",
              left: -left,
              top: -top,
              width: ctx.width,
              height: ctx.height,
              opacity: 0.82 + depth * 0.18
            }
          },
          ctx.subjectNode
        ),
        /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: signal, opacity: edge } })
      );
    }));
  }
};
var R11_checker_flip_effect_default = kernel;
`;export{e as default};
