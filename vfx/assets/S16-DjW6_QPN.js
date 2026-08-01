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
var S16_truchet_tile_effect_exports = {};
__export(S16_truchet_tile_effect_exports, {
  default: () => S16_truchet_tile_effect_default
});
module.exports = __toCommonJS(S16_truchet_tile_effect_exports);
const ease = (value) => value * value * (3 - 2 * value);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const grid = Math.max(5, Math.min(11, Math.round(Number(ctx.params.grid ?? 8))));
    const weight = Number(ctx.params.weight ?? 8);
    const stagger = Number(ctx.params.stagger ?? 0.58);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cell = 800 / grid;
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const transition = cycle * 3;
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "28%", display: "grid", placeItems: "center", opacity: 0.1 } }, ctx.subjectNode), /* @__PURE__ */ h("svg", { viewBox: "0 0 1000 1000", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, /* @__PURE__ */ h("rect", { x: "100", y: "100", width: "800", height: "800", fill: "none", stroke: signal, strokeWidth: "2", opacity: "0.18" }), Array.from({ length: grid * grid }, (_, index) => {
      const column = index % grid;
      const row = Math.floor(index / grid);
      const delay = (row + column) / Math.max(1, grid * 2 - 2) * 0.7 * stagger;
      const local = Math.max(0, Math.min(3, transition * (1 + 0.28 * stagger) - delay));
      const state = Math.min(2, Math.floor(local));
      const fraction = ease(local - state);
      const base = Math.floor(ctx.random(\`tile:\${index}\`) * 4);
      const direction = (row + column) % 2 === 0 ? 1 : -1;
      const rotation = (base + direction * (state + fraction)) * 90;
      const x = 100 + column * cell;
      const y = 100 + row * cell;
      return /* @__PURE__ */ h("g", { key: index, transform: \`translate(\${x + cell / 2} \${y + cell / 2}) rotate(\${rotation}) translate(\${-cell / 2} \${-cell / 2})\` }, /* @__PURE__ */ h("path", { d: \`M 0 \${cell / 2} A \${cell / 2} \${cell / 2} 0 0 1 \${cell / 2} 0\`, fill: "none", stroke: signal, strokeWidth: weight, strokeLinecap: "round", opacity: "0.82" }), /* @__PURE__ */ h("path", { d: \`M \${cell} \${cell / 2} A \${cell / 2} \${cell / 2} 0 0 1 \${cell / 2} \${cell}\`, fill: "none", stroke: signal, strokeWidth: weight, strokeLinecap: "round", opacity: "0.82" }));
    })));
  }
};
var S16_truchet_tile_effect_default = kernel;
`;export{e as default};
