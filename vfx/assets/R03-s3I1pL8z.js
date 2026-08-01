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
var R03_cellular_automata_effect_exports = {};
__export(R03_cellular_automata_effect_exports, {
  default: () => R03_cellular_automata_effect_default
});
module.exports = __toCommonJS(R03_cellular_automata_effect_exports);
function createAutomata(ctx) {
  const cellSize = Math.min(20, Math.max(5, Math.round(Number(ctx.params.cellSize ?? 10))));
  const columns = Math.max(8, Math.ceil(ctx.width / cellSize));
  const rows = Math.max(8, Math.ceil(ctx.height / cellSize));
  const density = Math.min(0.48, Math.max(0.08, Number(ctx.params.density ?? 0.26)));
  return {
    columns,
    rows,
    cells: Array.from({ length: columns * rows }, (_, index) => ctx.random(\`automata:\${index}\`) < density ? 1 : 0)
  };
}
function evolve(state) {
  const { cells, columns, rows } = state;
  const next = new Array(cells.length).fill(0);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      let firing = 0;
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          if (ox === 0 && oy === 0) continue;
          const px = (x + ox + columns) % columns;
          const py = (y + oy + rows) % rows;
          if (cells[py * columns + px] === 1) firing += 1;
        }
      }
      const index = y * columns + x;
      if (cells[index] === 0 && firing === 2) next[index] = 1;
      else if (cells[index] === 1) next[index] = 2;
    }
  }
  return { ...state, cells: next };
}
const stateful = {
  init: createAutomata,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createAutomata(ctx);
    const expected = createAutomata(ctx);
    if (expected.columns !== state.columns || expected.rows !== state.rows) return expected;
    const rate = Math.min(30, Math.max(4, Math.round(Number(ctx.params.rate ?? 15))));
    const interval = Math.max(1, Math.round(ctx.fps / rate));
    return ctx.frame % interval === 0 ? evolve(state) : state;
  },
  render: (g, state, ctx) => {
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cellWidth = ctx.width / state.columns;
    const cellHeight = ctx.height / state.rows;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(1, Math.min(cellWidth, cellHeight) * 0.45);
    for (let index = 0; index < state.cells.length; index += 1) {
      const value = state.cells[index];
      if (value === 0) continue;
      const x = index % state.columns * cellWidth;
      const y = Math.floor(index / state.columns) * cellHeight;
      g.globalAlpha = value === 1 ? 0.92 : 0.28;
      const inset = value === 1 ? 0.7 : 1.7;
      g.fillRect(x + inset, y + inset, Math.max(1, cellWidth - inset * 2), Math.max(1, cellHeight - inset * 2));
    }
    g.restore();
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.34;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
  }
};
const kernel = { kind: "canvas", stateful };
var R03_cellular_automata_effect_default = kernel;
`;export{e as default};
