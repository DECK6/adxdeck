const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const grid = Math.min(32, Math.max(8, Math.round(Number(ctx.params.grid ?? 18))));
    const order = String(ctx.params.order ?? 'scramble');
    const cycles = Math.min(3, Math.max(1, Math.round(Number(ctx.params.cycles ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = 0.5 - 0.5 * Math.cos(ctx.t * TAU * cycles);
    const cellWidth = ctx.width / grid;
    const rows = Math.max(1, Math.ceil(ctx.height / cellWidth));
    const bitmap = ctx.subject.bitmap;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.save();
    g.strokeStyle = signal;
    g.lineWidth = 1;
    g.globalAlpha = 0.07;
    for (let column = 0; column <= grid; column += 1) {
      g.beginPath();
      g.moveTo(column * cellWidth, 0);
      g.lineTo(column * cellWidth, ctx.height);
      g.stroke();
    }
    for (let row = 0; row <= rows; row += 1) {
      g.beginPath();
      g.moveTo(0, row * cellWidth);
      g.lineTo(ctx.width, row * cellWidth);
      g.stroke();
    }
    g.restore();

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < grid; column += 1) {
        const index = row * grid + column;
        const nx = (column + 0.5) / grid - 0.5;
        const ny = (row + 0.5) / rows - 0.5;
        const rank = order === 'radial'
          ? Math.min(1, Math.hypot(nx, ny) * 1.65)
          : order === 'scan'
            ? (row + column * 0.32) / Math.max(1, rows - 1 + (grid - 1) * 0.32)
            : ctx.random(\`cell:\${index}:rank\`);
        const reveal = Math.min(1, Math.max(0, (progress - rank * 0.84) / 0.16));
        if (reveal <= 0) continue;
        const x = column * cellWidth;
        const y = row * cellWidth;
        const height = Math.min(cellWidth, ctx.height - y);
        const inset = (1 - reveal) * cellWidth * 0.42;
        if (bitmap) {
          const sx = (x / ctx.width) * bitmap.width;
          const sy = (y / ctx.height) * bitmap.height;
          const sw = (cellWidth / ctx.width) * bitmap.width;
          const sh = (height / ctx.height) * bitmap.height;
          g.save();
          g.globalAlpha = reveal;
          g.drawImage(bitmap, sx, sy, sw, sh, x + inset, y + inset, cellWidth - inset * 2, height - inset * 2);
          g.restore();
        }
        if (Math.abs(progress - rank) < 0.09) {
          g.save();
          g.globalAlpha = 0.18 + reveal * 0.42;
          g.strokeStyle = signal;
          g.lineWidth = Math.max(1, cellWidth * 0.06);
          g.strokeRect(x + 1, y + 1, cellWidth - 2, height - 2);
          g.restore();
        }
      }
    }

    const scanY = progress * (ctx.height + cellWidth) - cellWidth * 0.5;
    g.save();
    g.globalAlpha = 0.45;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = cellWidth;
    g.fillRect(0, scanY, ctx.width, Math.max(1, cellWidth * 0.06));
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
