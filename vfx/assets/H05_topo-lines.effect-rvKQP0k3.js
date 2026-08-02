const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

function terrain(x: number, y: number, phase: number): number {
  const orbitX = Math.cos(phase) * 0.42;
  const orbitY = Math.sin(phase) * 0.34;
  const broad = Math.sin(x * 2.1 + orbitX + Math.sin(y * 1.7 - orbitY));
  const cross = Math.cos(y * 2.6 - orbitY * 1.4 + Math.sin(x * 1.3 + orbitX));
  const ridge = Math.sin((x + y) * 3.2 + Math.cos(phase)) * 0.32;
  const basin = Math.cos(Math.hypot(x - orbitX, y - orbitY) * 5.1 - Math.sin(phase)) * 0.24;
  return broad * 0.46 + cross * 0.34 + ridge + basin;
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const levels = Math.min(22, Math.max(8, Math.round(Number(ctx.params.levels ?? 15))));
    const columns = Math.min(56, Math.max(24, Math.round(Number(ctx.params.detail ?? 40))));
    const drift = Math.min(3, Math.max(1, Math.round(Number(ctx.params.drift ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rows = Math.max(14, Math.round(columns * ctx.height / ctx.width));
    const phase = ctx.t * TAU * drift;
    const values = Array.from({ length: (columns + 1) * (rows + 1) }, (_, index) => {
      const x = index % (columns + 1);
      const y = Math.floor(index / (columns + 1));
      return terrain((x / columns - 0.5) * 5.4, (y / rows - 0.5) * 3.5, phase);
    });
    const valueAt = (x: number, y: number) => values[y * (columns + 1) + x];

    g.save();
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    const wash = g.createRadialGradient(ctx.width * 0.48, ctx.height * 0.46, 0, ctx.width * 0.48, ctx.height * 0.46, ctx.width * 0.62);
    wash.addColorStop(0, signal);
    wash.addColorStop(1, '#0D0E10');
    g.globalAlpha = 0.045;
    g.fillStyle = wash;
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.strokeStyle = signal;
    g.lineWidth = Math.max(0.7, ctx.width / 900);
    g.lineCap = 'round';
    for (let levelIndex = 0; levelIndex < levels; levelIndex++) {
      const threshold = -1.05 + (levelIndex / Math.max(1, levels - 1)) * 2.1;
      g.globalAlpha = levelIndex % 5 === 0 ? 0.52 : 0.27;
      g.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const corners = [valueAt(x, y), valueAt(x + 1, y), valueAt(x + 1, y + 1), valueAt(x, y + 1)];
          const points: Array<[number, number]> = [];
          const edges: Array<[number, number, number, number, number, number]> = [
            [0, 1, x, y, x + 1, y],
            [1, 2, x + 1, y, x + 1, y + 1],
            [2, 3, x + 1, y + 1, x, y + 1],
            [3, 0, x, y + 1, x, y],
          ];
          for (const [a, b, ax, ay, bx, by] of edges) {
            const va = corners[a];
            const vb = corners[b];
            if ((va < threshold) === (vb < threshold)) continue;
            const ratio = (threshold - va) / (vb - va);
            points.push([
              ((ax + (bx - ax) * ratio) / columns) * ctx.width,
              ((ay + (by - ay) * ratio) / rows) * ctx.height,
            ]);
          }
          for (let pointIndex = 0; pointIndex + 1 < points.length; pointIndex += 2) {
            g.moveTo(points[pointIndex][0], points[pointIndex][1]);
            g.lineTo(points[pointIndex + 1][0], points[pointIndex + 1][1]);
          }
        }
      }
      g.stroke();
    }

    if (ctx.subject.bitmap) {
      g.globalAlpha = 0.26;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
