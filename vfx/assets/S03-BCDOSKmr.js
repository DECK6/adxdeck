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
var S03_grid_wave_effect_exports = {};
__export(S03_grid_wave_effect_exports, {
  default: () => S03_grid_wave_effect_default
});
module.exports = __toCommonJS(S03_grid_wave_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const columns = Math.round(Number(ctx.params.density ?? 7));
    const rows = Math.max(3, Math.round(columns * ctx.height / ctx.width));
    const amplitude = Number(ctx.params.amplitude ?? 0.62);
    const speed = Number(ctx.params.speed ?? 1.4);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cells = Array.from({ length: columns * rows }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const left = column / columns * 100;
      const right = 100 - (column + 1) / columns * 100;
      const top = row / rows * 100;
      const bottom = 100 - (row + 1) / rows * 100;
      const centerX = (column + 0.5) / columns * 100;
      const centerY = (row + 0.5) / rows * 100;
      const distance = Math.hypot(column - (columns - 1) / 2, row - (rows - 1) / 2);
      const wave = (Math.sin(distance * 1.35 - ctx.t * Math.PI * 2 * speed) + 1) / 2;
      const scale = 0.72 + wave * amplitude * 0.5;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "absolute",
            inset: 0,
            clipPath: \`inset(\${top + 0.18}% \${right + 0.12}% \${bottom + 0.18}% \${left + 0.12}%)\`,
            transform: \`scale(\${scale})\`,
            transformOrigin: \`\${centerX}% \${centerY}%\`,
            opacity: 0.2 + wave * 0.8,
            filter: \`drop-shadow(0 0 \${2 + wave * 8}px \${signal})\`
          }
        },
        ctx.subjectNode
      );
    });
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, opacity: 0.08 } }, ctx.subjectNode), cells, /* @__PURE__ */ h("div", { style: { position: "absolute", left: 48, bottom: 42, width: 96 + amplitude * 160, height: 3, background: signal, opacity: 0.8 } }));
  }
};
var S03_grid_wave_effect_default = kernel;
`;export{e as default};
