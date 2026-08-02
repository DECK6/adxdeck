const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const blades = Math.min(8, Math.max(3, Math.round(Number(ctx.params.blades ?? 5))));
    const depth = Math.min(5, Math.max(2, Math.round(Number(ctx.params.depth ?? 4))));
    const twist = Math.min(1, Math.max(0.1, Number(ctx.params.twist ?? 0.64)));
    const weight = Math.min(4, Math.max(0.5, Number(ctx.params.weight ?? 1.4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const shortSide = Math.min(ctx.width, ctx.height);

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.2;
      g.drawImage(ctx.subject.bitmap, ctx.width * 0.36, ctx.height * 0.25, ctx.width * 0.28, ctx.height * 0.5);
      g.restore();
    }

    g.save();
    g.translate(ctx.width * 0.5, ctx.height * 0.5);
    g.strokeStyle = signal;
    g.fillStyle = \`\${signal}18\`;
    g.lineWidth = weight;
    g.shadowColor = signal;
    g.shadowBlur = weight * 3;

    const drawBranch = (x: number, y: number, radius: number, angle: number, level: number): void => {
      const sweep = TAU / blades;
      g.globalAlpha = 0.28 + (level / depth) * 0.58;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      g.lineTo(x + Math.cos(angle + sweep * 0.72) * radius * 0.74, y + Math.sin(angle + sweep * 0.72) * radius * 0.74);
      g.closePath();
      g.fill();
      g.stroke();
      if (level <= 1) return;
      const nextRadius = radius * 0.52;
      const pivotAngle = angle + sweep * 0.43;
      const pivotX = x + Math.cos(pivotAngle) * radius * 0.58;
      const pivotY = y + Math.sin(pivotAngle) * radius * 0.58;
      const oscillation = Math.sin(phase) * twist;
      drawBranch(pivotX, pivotY, nextRadius, angle + oscillation + sweep * 0.5, level - 1);
      drawBranch(pivotX, pivotY, nextRadius, angle - oscillation - sweep * 0.28, level - 1);
    };

    for (let blade = 0; blade < blades; blade += 1) {
      drawBranch(0, 0, shortSide * 0.42, phase + (blade / blades) * TAU, depth);
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
