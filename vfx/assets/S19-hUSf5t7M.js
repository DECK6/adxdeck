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
var S19_chevron_march_effect_exports = {};
__export(S19_chevron_march_effect_exports, {
  default: () => S19_chevron_march_effect_default
});
module.exports = __toCommonJS(S19_chevron_march_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rows = Math.min(9, Math.max(3, Math.round(Number(ctx.params.rows ?? 6))));
    const spacing = Math.min(180, Math.max(70, Number(ctx.params.spacing ?? 118)));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const weight = Math.min(12, Math.max(2, Number(ctx.params.weight ?? 6)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const phase = ctx.t * spacing * speed;
    const chevrons = Math.ceil(1e3 / spacing) + speed + 3;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "22%", opacity: 0.3, filter: \`grayscale(1) drop-shadow(0 0 6px \${signal})\` } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%", filter: \`drop-shadow(0 0 \${weight}px \${signal})\` } }, Array.from({ length: rows }, (_, row) => {
      const y = (row + 0.5) / rows * 1e3;
      const direction = row % 2 === 0 ? 1 : -1;
      return /* @__PURE__ */ h("g", { key: row, transform: \`translate(\${direction * phase - spacing * (speed + 1)} 0)\` }, Array.from({ length: chevrons }, (_2, index) => {
        const x = index * spacing;
        const halfHeight = Math.min(64, 360 / rows);
        return /* @__PURE__ */ h(
          "polyline",
          {
            key: index,
            points: \`\${x - spacing * 0.34},\${y - halfHeight} \${x + spacing * 0.16},\${y} \${x - spacing * 0.34},\${y + halfHeight}\`,
            fill: "none",
            stroke: signal,
            strokeWidth: weight,
            strokeLinecap: "square",
            strokeLinejoin: "miter",
            opacity: 0.32 + (index + row) % 3 * 0.24
          }
        );
      }));
    })));
  }
};
var S19_chevron_march_effect_default = kernel;
`;export{e as default};
