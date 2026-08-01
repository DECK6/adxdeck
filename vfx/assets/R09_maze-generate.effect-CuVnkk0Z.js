const n=`import type { FxContext, FxKernel } from '../../src/fx/types';

interface Passage {
  from: number;
  to: number;
  direction: number;
}

interface Maze {
  columns: number;
  rows: number;
  passages: Passage[];
}

const TOP = 1;
const RIGHT = 2;
const BOTTOM = 4;
const LEFT = 8;

function buildMaze(ctx: FxContext, columns: number, rows: number): Maze {
  const visited = new Array<boolean>(columns * rows).fill(false);
  const stack = [Math.floor(rows / 2) * columns + Math.floor(columns / 2)];
  const passages: Passage[] = [];
  visited[stack[0]] = true;
  let choice = 0;
  while (stack.length > 0) {
    const from = stack[stack.length - 1];
    const x = from % columns;
    const y = Math.floor(from / columns);
    const candidates: Array<{ to: number; direction: number }> = [];
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
  kind: 'canvas',
  draw: (g, ctx) => {
    const cellSize = Math.min(30, Math.max(10, Math.round(Number(ctx.params.cellSize ?? 18))));
    const progress = Math.min(1.8, Math.max(0.4, Number(ctx.params.progress ?? 1)));
    const thickness = Math.min(3, Math.max(0.7, Number(ctx.params.thickness ?? 1.4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const columns = Math.max(7, Math.floor((ctx.width * 0.84) / cellSize));
    const rows = Math.max(5, Math.floor((ctx.height * 0.78) / cellSize));
    const maze = buildMaze(ctx, columns, rows);
    const reveal = Math.min(maze.passages.length, Math.floor(ctx.t * progress * maze.passages.length));
    const walls = new Array<number>(columns * rows).fill(TOP | RIGHT | BOTTOM | LEFT);
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

    g.fillStyle = '#0D0E10';
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
    g.lineCap = 'square';
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, thickness * 2.5);
    g.globalAlpha = 0.68;
    g.beginPath();
    for (let index = 0; index < walls.length; index += 1) {
      const x = left + (index % columns) * cellSize;
      const y = top + Math.floor(index / columns) * cellSize;
      const wall = walls[index];
      if (wall & TOP) { g.moveTo(x, y); g.lineTo(x + cellSize, y); }
      if (wall & RIGHT) { g.moveTo(x + cellSize, y); g.lineTo(x + cellSize, y + cellSize); }
      if (wall & BOTTOM) { g.moveTo(x, y + cellSize); g.lineTo(x + cellSize, y + cellSize); }
      if (wall & LEFT) { g.moveTo(x, y); g.lineTo(x, y + cellSize); }
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
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
