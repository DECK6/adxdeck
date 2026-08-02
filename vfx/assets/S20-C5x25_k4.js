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
var S20_squircle_morph_effect_exports = {};
__export(S20_squircle_morph_effect_exports, {
  default: () => S20_squircle_morph_effect_default
});
module.exports = __toCommonJS(S20_squircle_morph_effect_exports);
const TAU = Math.PI * 2;
const superellipsePath = (cx, cy, radius, exponent) => {
  const points = 64;
  return Array.from({ length: points + 1 }, (_, index) => {
    const angle = index / points * TAU;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const x = cx + Math.sign(cosine) * Math.pow(Math.abs(cosine), 2 / exponent) * radius;
    const y = cy + Math.sign(sine) * Math.pow(Math.abs(sine), 2 / exponent) * radius;
    return \`\${index === 0 ? "M" : "L"}\${x.toFixed(2)} \${y.toFixed(2)}\`;
  }).join(" ") + " Z";
};
const kernel = {
  kind: "react",
  render: (ctx) => {
    const grid = Math.min(6, Math.max(2, Math.round(Number(ctx.params.grid ?? 4))));
    const squareness = Math.min(1, Math.max(0.2, Number(ctx.params.squareness ?? 0.78)));
    const gap = Math.min(48, Math.max(8, Number(ctx.params.gap ?? 24)));
    const weight = Math.min(7, Math.max(1, Number(ctx.params.weight ?? 3)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cell = 820 / grid;
    const radius = Math.max(18, cell * 0.5 - gap);
    const phase = ctx.t * TAU;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "31%", opacity: 0.34, filter: \`grayscale(1) drop-shadow(0 0 5px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", inset: "4%", width: "92%", height: "92%", filter: \`drop-shadow(0 0 \${weight * 2}px \${signal})\` } }, Array.from({ length: grid * grid }, (_, index) => {
      const column = index % grid;
      const row = Math.floor(index / grid);
      const local = 0.5 - 0.5 * Math.cos(phase + (row + column) * 0.48);
      const exponent = 2 + local * squareness * 10;
      const cx = 90 + cell * (column + 0.5);
      const cy = 90 + cell * (row + 0.5);
      return /* @__PURE__ */ h(
        "path",
        {
          key: index,
          d: superellipsePath(cx, cy, radius, exponent),
          fill: \`\${signal}\${index % 2 === 0 ? "12" : "08"}\`,
          stroke: signal,
          strokeWidth: weight,
          opacity: 0.42 + local * 0.5
        }
      );
    })));
  }
};
var S20_squircle_morph_effect_default = kernel;
`;export{n as default};
