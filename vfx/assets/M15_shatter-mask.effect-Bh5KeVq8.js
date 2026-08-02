const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const columns = Math.round(Number(ctx.params.shards ?? 4));
    const rows = 3;
    const spread = Number(ctx.params.spread ?? 92);
    const spin = Number(ctx.params.spin ?? 0.18);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const open = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;
    const cellW = ctx.width / columns;
    const cellH = ctx.height / rows;
    let index = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        for (let half = 0; half < 2; half += 1) {
          const x = col * cellW;
          const y = row * cellH;
          const points = half === 0 ? [[x, y], [x + cellW, y], [x + cellW, y + cellH]] : [[x, y], [x + cellW, y + cellH], [x, y + cellH]];
          const cx = points.reduce((sum, point) => sum + point[0], 0) / 3;
          const cy = points.reduce((sum, point) => sum + point[1], 0) / 3;
          const angle = Math.atan2(cy - ctx.height / 2, cx - ctx.width / 2) + (ctx.random(\`shard:\${index}\`) - 0.5) * 0.7;
          const distance = spread * open * (0.55 + ctx.random(\`distance:\${index}\`) * 0.65);
          g.save();
          g.beginPath();
          g.moveTo(points[0][0], points[0][1]);
          g.lineTo(points[1][0], points[1][1]);
          g.lineTo(points[2][0], points[2][1]);
          g.closePath();
          g.clip();
          g.translate(Math.cos(angle) * distance, Math.sin(angle) * distance);
          g.translate(cx, cy);
          g.rotate((ctx.random(\`spin:\${index}\`) - 0.5) * spin * open);
          g.translate(-cx, -cy);
          g.globalAlpha = 1 - open * 0.08;
          g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
          g.restore();
          g.strokeStyle = signal;
          g.globalAlpha = 0.12 + open * 0.5;
          g.lineWidth = 1.2;
          g.beginPath();
          g.moveTo(points[0][0], points[0][1]);
          g.lineTo(points[1][0], points[1][1]);
          g.lineTo(points[2][0], points[2][1]);
          g.closePath();
          g.stroke();
          index += 1;
        }
      }
    }
    g.globalAlpha = 1;
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
