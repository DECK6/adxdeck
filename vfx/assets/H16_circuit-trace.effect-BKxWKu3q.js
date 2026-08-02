const n=`import type { FxKernel } from '../../src/fx/types';

interface Point {
  x: number;
  y: number;
}

function pointAlong(points: Point[], progress: number): Point {
  const lengths = points.slice(1).map((point, index) => Math.abs(point.x - points[index].x) + Math.abs(point.y - points[index].y));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = progress * total;
  for (let index = 0; index < lengths.length; index += 1) {
    if (remaining <= lengths[index]) {
      const amount = lengths[index] === 0 ? 0 : remaining / lengths[index];
      return {
        x: points[index].x + (points[index + 1].x - points[index].x) * amount,
        y: points[index].y + (points[index + 1].y - points[index].y) * amount,
      };
    }
    remaining -= lengths[index];
  }
  return points[points.length - 1];
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const traceCount = Math.min(24, Math.max(8, Math.round(Number(ctx.params.traces ?? 15))));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const density = Math.min(1, Math.max(0.3, Number(ctx.params.density ?? 0.72)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const grid = Math.max(14, Math.round(ctx.width / 22));

    g.fillStyle = '#07100F';
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.strokeStyle = \`\${signal}12\`;
    g.lineWidth = 1;
    for (let x = grid; x < ctx.width; x += grid) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, ctx.height);
      g.stroke();
    }
    for (let y = grid; y < ctx.height; y += grid) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(ctx.width, y);
      g.stroke();
    }
    g.restore();

    for (let index = 0; index < traceCount; index += 1) {
      const leftToRight = index % 2 === 0;
      const startY = Math.round((ctx.random(\`trace:\${index}:y\`) * ctx.height) / grid) * grid;
      const bendX = Math.round((0.22 + ctx.random(\`trace:\${index}:bend-x\`) * 0.28) * ctx.width / grid) * grid;
      const endY = Math.round((ctx.random(\`trace:\${index}:end-y\`) * ctx.height) / grid) * grid;
      const points: Point[] = leftToRight
        ? [{ x: -grid, y: startY }, { x: bendX, y: startY }, { x: bendX, y: endY }, { x: ctx.width + grid, y: endY }]
        : [{ x: ctx.width + grid, y: startY }, { x: ctx.width - bendX, y: startY }, { x: ctx.width - bendX, y: endY }, { x: -grid, y: endY }];
      const alpha = density * (0.18 + ctx.random(\`trace:\${index}:alpha\`) * 0.2);

      g.save();
      g.strokeStyle = signal;
      g.globalAlpha = alpha;
      g.lineWidth = 0.8 + ctx.random(\`trace:\${index}:width\`) * 1.1;
      g.beginPath();
      g.moveTo(points[0].x, points[0].y);
      for (let pointIndex = 1; pointIndex < points.length; pointIndex += 1) g.lineTo(points[pointIndex].x, points[pointIndex].y);
      g.stroke();
      for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex += 1) {
        g.fillStyle = '#07100F';
        g.strokeStyle = signal;
        g.beginPath();
        g.arc(points[pointIndex].x, points[pointIndex].y, 2.4, 0, Math.PI * 2);
        g.fill();
        g.stroke();
      }

      const offset = ctx.random(\`trace:\${index}:pulse\`);
      const pulse = pointAlong(points, (ctx.t * speed + offset) % 1);
      g.globalAlpha = 0.72 + density * 0.22;
      g.fillStyle = signal;
      g.shadowColor = signal;
      g.shadowBlur = 12;
      g.beginPath();
      g.arc(pulse.x, pulse.y, 2.2 + density * 1.4, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }

    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.25;
      const insetX = ctx.width * 0.16;
      const insetY = ctx.height * 0.16;
      g.drawImage(ctx.subject.bitmap, insetX, insetY, ctx.width - insetX * 2, ctx.height - insetY * 2);
      g.restore();
    }
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
