const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const count = Math.min(90, Math.max(24, Math.round(Number(ctx.params.count ?? 58))));
    const flow = Math.min(3, Math.max(1, Math.round(Number(ctx.params.flow ?? 2))));
    const scatter = Math.min(0.8, Math.max(0.1, Number(ctx.params.scatter ?? 0.46)));
    const size = Math.min(3.2, Math.max(0.6, Number(ctx.params.size ?? 1.6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.globalAlpha = 0.68;
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.restore();

    g.save();
    const beam = g.createLinearGradient(0, ctx.height, ctx.width, 0);
    beam.addColorStop(0, 'rgba(94,231,243,0)');
    beam.addColorStop(0.48, 'rgba(94,231,243,0.09)');
    beam.addColorStop(0.62, 'rgba(94,231,243,0.025)');
    beam.addColorStop(1, 'rgba(94,231,243,0)');
    g.fillStyle = beam;
    g.beginPath();
    g.moveTo(ctx.width * 0.04, ctx.height);
    g.lineTo(ctx.width * 0.44, 0);
    g.lineTo(ctx.width * 0.92, 0);
    g.lineTo(ctx.width * 0.58, ctx.height);
    g.closePath();
    g.fill();
    g.restore();

    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.globalCompositeOperation = 'screen';
    for (let index = 0; index < count; index += 1) {
      const depth = 0.25 + ctx.random(\`pollen:\${index}:depth\`) * 0.75;
      const cycles = flow + (index % 2);
      const progress = (ctx.t * cycles + ctx.random(\`pollen:\${index}:offset\`)) % 1;
      const baseY = ctx.random(\`pollen:\${index}:y\`);
      const curl = Math.sin(phase * (1 + index % 3) + ctx.random(\`pollen:\${index}:phase\`) * TAU);
      const x = -0.08 + progress * 1.16;
      const y = (baseY - progress * 0.34 + curl * 0.055 * scatter + 1) % 1;
      const axisY = 0.9 - x * 0.72;
      const beamGain = Math.max(0, 1 - Math.abs(y - axisY) / (0.16 + scatter * 0.18));
      const alpha = (0.08 + beamGain * 0.72) * depth;
      const particleSize = size * (0.45 + depth * 1.15);
      const angle = -0.36 + curl * 0.32;
      const px = x * ctx.width;
      const py = y * ctx.height;
      g.globalAlpha = alpha;
      g.lineWidth = Math.max(0.55, particleSize * 0.52);
      g.shadowBlur = particleSize * 2.4 * beamGain;
      g.beginPath();
      g.moveTo(px - Math.cos(angle) * particleSize, py - Math.sin(angle) * particleSize);
      g.lineTo(px + Math.cos(angle) * particleSize, py + Math.sin(angle) * particleSize);
      g.stroke();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
