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
var S05_polygon_rotate_effect_exports = {};
__export(S05_polygon_rotate_effect_exports, {
  default: () => S05_polygon_rotate_effect_default
});
module.exports = __toCommonJS(S05_polygon_rotate_effect_exports);
const polygonPoints = (sides, radius) => Array.from({ length: sides }, (_, index) => {
  const angle = index / sides * Math.PI * 2 - Math.PI / 2;
  return \`\${500 + Math.cos(angle) * radius},\${500 + Math.sin(angle) * radius}\`;
}).join(" ");
const kernel = {
  kind: "react",
  render: (ctx) => {
    const sides = Math.max(3, Number.parseInt(String(ctx.params.sides ?? "6"), 10));
    const layers = Math.max(3, Math.round(Number(ctx.params.layers ?? 7)));
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 2)));
    const twist = Math.min(45, Math.max(0, Number(ctx.params.twist ?? 18)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const rotation = ctx.t * turns * 360;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.3, filter: \`grayscale(1) drop-shadow(0 0 5px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h(
      "svg",
      {
        viewBox: "0 0 1000 1000",
        preserveAspectRatio: "xMidYMid meet",
        style: { position: "absolute", inset: "4%", width: "92%", height: "92%", filter: \`drop-shadow(0 0 8px \${signal})\` }
      },
      Array.from({ length: layers }, (_, index) => {
        const ratio = layers === 1 ? 1 : index / (layers - 1);
        const radius = 105 + ratio * 330;
        const direction = index % 2 === 0 ? 1 : -1;
        return /* @__PURE__ */ h(
          "polygon",
          {
            key: index,
            points: polygonPoints(sides, radius),
            fill: index === 0 ? \`\${signal}12\` : "none",
            stroke: signal,
            strokeWidth: 7 - ratio * 4,
            opacity: 0.85 - ratio * 0.52,
            transform: \`rotate(\${rotation * direction + index * twist} 500 500)\`
          }
        );
      })
    ));
  }
};
var S05_polygon_rotate_effect_default = kernel;
`;export{e as default};
