const n=`import type { FxKernel } from '../../src/fx/types';

interface BoltPoint {
  x: number;
  y: number;
}

const drawBolt = (
  g: CanvasRenderingContext2D,
  points: BoltPoint[],
  alpha: number,
  width: number,
) => {
  if (points.length < 2) return;
  g.globalAlpha = alpha;
  g.lineWidth = width;
  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) g.lineTo(points[index].x, points[index].y);
  g.stroke();
};

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const intensity = Math.min(1, Math.max(0.2, Number(ctx.params.intensity ?? 0.82)));
    const branchCount = Math.min(6, Math.max(1, Math.round(Number(ctx.params.branches ?? 4))));
    const frequency = Math.min(8, Math.max(2, Math.round(Number(ctx.params.frequency ?? 5))));
    const boltWidth = Math.min(5, Math.max(1, Number(ctx.params.width ?? 2.2)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const loopFrame = ((ctx.frame % duration) + duration) % duration;
    const interval = duration / frequency;
    const strike = Math.floor(loopFrame / interval);
    const strikeStart = Math.floor(strike * interval);
    const strikeAge = loopFrame - strikeStart;
    const flash = strikeAge < 2 ? 1 - strikeAge * 0.32 : strikeAge < 6 ? (6 - strikeAge) * 0.08 : 0;
    const active = strikeAge < 5;
    const frameSeed = strikeStart;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    if (flash > 0) {
      g.save();
      g.globalAlpha = flash * intensity * 0.34;
      g.fillStyle = signal;
      g.fillRect(0, 0, ctx.width, ctx.height);
      g.restore();
    }
    if (!active) return;

    const segments = 15;
    const startX = ctx.width * (0.26 + ctx.random(\`bolt:\${frameSeed}:x\`) * 0.48);
    const endX = ctx.width * (0.38 + ctx.random(\`bolt:\${frameSeed}:end\`) * 0.24);
    const points: BoltPoint[] = [];
    for (let segment = 0; segment <= segments; segment += 1) {
      const progress = segment / segments;
      const taper = Math.sin(progress * Math.PI);
      const jitter = (ctx.random(\`bolt:\${frameSeed}:segment:\${segment}\`) * 2 - 1) * ctx.width * 0.075 * taper;
      points.push({
        x: startX + (endX - startX) * progress + jitter,
        y: -ctx.height * 0.03 + progress * ctx.height * 0.86,
      });
    }

    g.save();
    g.strokeStyle = signal;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.shadowColor = signal;
    g.shadowBlur = 18 * intensity;
    drawBolt(g, points, intensity * (0.72 + flash * 0.28), boltWidth);
    g.shadowBlur = 4;
    drawBolt(g, points, intensity, Math.max(0.7, boltWidth * 0.38));

    for (let branch = 0; branch < branchCount; branch += 1) {
      const originIndex = 3 + Math.floor(ctx.random(\`branch:\${frameSeed}:\${branch}:origin\`) * (segments - 5));
      const origin = points[originIndex];
      const length = 3 + Math.floor(ctx.random(\`branch:\${frameSeed}:\${branch}:length\`) * 5);
      const direction = ctx.random(\`branch:\${frameSeed}:\${branch}:direction\`) < 0.5 ? -1 : 1;
      const branchPoints: BoltPoint[] = [origin];
      for (let segment = 1; segment <= length; segment += 1) {
        const progress = segment / length;
        const x = origin.x + direction * ctx.width * (0.035 + progress * 0.1)
          + (ctx.random(\`branch:\${frameSeed}:\${branch}:\${segment}\`) * 2 - 1) * ctx.width * 0.025;
        const y = origin.y + progress * ctx.height * (0.08 + ctx.random(\`branch:\${frameSeed}:\${branch}:drop\`) * 0.1);
        branchPoints.push({ x, y });
      }
      drawBolt(g, branchPoints, intensity * 0.7, Math.max(0.7, boltWidth * 0.48));
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
