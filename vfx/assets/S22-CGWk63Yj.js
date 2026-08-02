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
var S22_nested_frames_effect_exports = {};
__export(S22_nested_frames_effect_exports, {
  default: () => S22_nested_frames_effect_default
});
module.exports = __toCommonJS(S22_nested_frames_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const frames = Math.min(13, Math.max(5, Math.round(Number(ctx.params.frames ?? 9))));
    const zoom = Math.min(4, Math.max(1, Math.round(Number(ctx.params.zoom ?? 2))));
    const corner = Math.min(100, Math.max(0, Number(ctx.params.corner ?? 28)));
    const weight = Math.min(8, Math.max(1, Number(ctx.params.weight ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "26%", opacity: 0.34, filter: \`grayscale(1) drop-shadow(0 0 7px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%", filter: \`drop-shadow(0 0 \${weight * 2}px \${signal})\` } }, Array.from({ length: frames }, (_, index) => {
      const local = (index / frames + ctx.t * zoom) % 1;
      const eased = local * local;
      const width = 80 + eased * 1100;
      const height = 48 + eased * 660;
      const opacity = Math.sin(local * Math.PI) * 0.86;
      return /* @__PURE__ */ h(
        "rect",
        {
          key: index,
          x: 500 - width * 0.5,
          y: 500 - height * 0.5,
          width,
          height,
          rx: corner * (0.3 + eased * 0.7),
          fill: "none",
          stroke: signal,
          strokeWidth: weight * (0.5 + eased * 0.8),
          opacity
        }
      );
    }), /* @__PURE__ */ h("path", { d: "M500 72 V928 M72 500 H928", stroke: signal, strokeWidth: "1", strokeDasharray: "4 16", opacity: "0.15" })));
  }
};
var S22_nested_frames_effect_default = kernel;
`;export{e as default};
