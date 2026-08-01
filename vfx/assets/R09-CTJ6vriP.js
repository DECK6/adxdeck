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
var R09_maze_generate_effect_exports = {};
__export(R09_maze_generate_effect_exports, {
  default: () => R09_maze_generate_effect_default
});
module.exports = __toCommonJS(R09_maze_generate_effect_exports);
const TOP = 1;
const RIGHT = 2;
const BOTTOM = 4;
const LEFT = 8;
function buildMaze(ctx, columns, rows) {
  const visited = new Array(columns * rows).fill(false);
  const stack = [Math.floor(rows / 2) * columns + Math.floor(columns / 2)];
  const passages = [];
  visited[stack[0]] = true;
  let choice = 0;
  while (stack.length > 0) {
    const from = stack[stack.length - 1];
    const x = from % columns;
    const y = Math.floor(from / columns);
    const candidates = [];
    if (y > 0 && !visited[from - columns]) candidates.push({ to: from - columns, direction: TOP });
    if (x < columns - 1 && !visited[from + 1]) candidates.push({ to: from + 1, direction: RIGHT });
    if (y < rows - 1 && !visited[from + columns]) candidates.push({ to: from + columns, direction: BOTTOM });
    if (x > 0 && !visited[from - 1]) candidates.push({ to: from - 1, direction: LEFT });
    if (candidates.length === 0) {
      stack.pop();
      continue;
    }
    const picked = candidates[Math.min(candidates.length - 1, Math.floor(ctx.random(\`maze:\${columns}:\${rows}:\${choice}\`) * candidates.length))];
    passages.push({ from, to: picked.to, direction: picked.direction });
    visited[picked.to] = true;
    stack.push(picked.to);
    choice += 1;
  }
  return { columns, rows, passages };
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const cellSize = Math.min(30, Math.max(10, Math.round(Number(ctx.params.cellSize ?? 18))));
    const progress = Math.min(1.8, Math.max(0.4, Number(ctx.params.progress ?? 1)));
    const thickness = Math.min(3, Math.max(0.7, Number(ctx.params.thickness ?? 1.4)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const columns = Math.max(7, Math.floor(ctx.width * 0.84 / cellSize));
    const rows = Math.max(5, Math.floor(ctx.height * 0.78 / cellSize));
    const maze = buildMaze(ctx, columns, rows);
    const reveal = Math.min(maze.passages.length, Math.floor(ctx.t * progress * maze.passages.length));
    const walls = new Array(columns * rows).fill(TOP | RIGHT | BOTTOM | LEFT);
    for (let index = 0; index < reveal; index += 1) {
      const passage = maze.passages[index];
      walls[passage.from] &= ~passage.direction;
      const opposite = passage.direction === TOP ? BOTTOM : passage.direction === RIGHT ? LEFT : passage.direction === BOTTOM ? TOP : RIGHT;
      walls[passage.to] &= ~opposite;
    }
    const drawWidth = columns * cellSize;
    const drawHeight = rows * cellSize;
    const left = (ctx.width - drawWidth) * 0.5;
    const top = (ctx.height - drawHeight) * 0.5;
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.34;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    g.save();
    g.strokeStyle = signal;
    g.lineWidth = thickness;
    g.lineCap = "square";
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, thickness * 2.5);
    g.globalAlpha = 0.68;
    g.beginPath();
    for (let index = 0; index < walls.length; index += 1) {
      const x = left + index % columns * cellSize;
      const y = top + Math.floor(index / columns) * cellSize;
      const wall = walls[index];
      if (wall & TOP) {
        g.moveTo(x, y);
        g.lineTo(x + cellSize, y);
      }
      if (wall & RIGHT) {
        g.moveTo(x + cellSize, y);
        g.lineTo(x + cellSize, y + cellSize);
      }
      if (wall & BOTTOM) {
        g.moveTo(x, y + cellSize);
        g.lineTo(x + cellSize, y + cellSize);
      }
      if (wall & LEFT) {
        g.moveTo(x, y);
        g.lineTo(x, y + cellSize);
      }
    }
    g.stroke();
    g.globalAlpha = 0.22;
    g.lineWidth = Math.max(2.5, thickness * 3.6);
    g.beginPath();
    for (let index = 0; index < reveal; index += 1) {
      const passage = maze.passages[index];
      const fromX = left + (passage.from % columns + 0.5) * cellSize;
      const fromY = top + (Math.floor(passage.from / columns) + 0.5) * cellSize;
      const toX = left + (passage.to % columns + 0.5) * cellSize;
      const toY = top + (Math.floor(passage.to / columns) + 0.5) * cellSize;
      g.moveTo(fromX, fromY);
      g.lineTo(toX, toY);
    }
    g.stroke();
    g.restore();
  }
};
var R09_maze_generate_effect_default = kernel;
`;export{e as default};
