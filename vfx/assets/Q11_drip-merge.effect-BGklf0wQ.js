const s=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const streamsValue = String(ctx.params.streams ?? '5');
    const streams = streamsValue === '3' ? 3 : streamsValue === '7' ? 7 : 5;
    const viscosity = Math.min(1, Math.max(0.2, Number(ctx.params.viscosity ?? 0.72)));
    const dropSize = Math.min(1.6, Math.max(0.6, Number(ctx.params.dropSize ?? 1)));
    const cyclesValue = String(ctx.params.cycles ?? '2');
    const cycles = cyclesValue === '1' ? 1 : cyclesValue === '3' ? 3 : 2;
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const scale = Math.min(ctx.width, ctx.height);
    const poolY = ctx.height * 0.78;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.5;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = scale * 0.025;
    g.globalAlpha = 0.38 + viscosity * 0.38;
    g.beginPath();
    g.moveTo(0, poolY);
    for (let sample = 0; sample <= 24; sample += 1) {
      const x = (sample / 24) * ctx.width;
      const wave = Math.sin((sample / 24) * TAU * 2 + ctx.t * TAU * cycles) * scale * 0.012 * (1 - viscosity);
      g.lineTo(x, poolY + wave);
    }
    g.lineTo(ctx.width, ctx.height);
    g.lineTo(0, ctx.height);
    g.closePath();
    g.fill();

    for (let index = 0; index < streams; index += 1) {
      const offset = ctx.random(\`drip:\${index}:offset\`);
      const progress = (ctx.t * cycles + offset) % 1;
      const eased = progress * progress * (3 - 2 * progress);
      const x = ctx.width * (0.18 + ((index + 0.5) / streams) * 0.64)
        + Math.sin(progress * TAU + offset * TAU) * scale * 0.018 * (1 - viscosity);
      const baseRadius = scale * (0.025 + ctx.random(\`drip:\${index}:size\`) * 0.025) * dropSize;
      const y = ctx.height * 0.08 + eased * (poolY - ctx.height * 0.08);
      const proximity = Math.max(0, (progress - 0.72) / 0.28);
      const radiusX = baseRadius * (1 + proximity * 0.7);
      const radiusY = baseRadius * (1.28 - proximity * 0.64);
      const fade = Math.sin(progress * Math.PI);

      g.globalAlpha = fade * (0.56 + viscosity * 0.4);
      if (progress < 0.24) {
        const neck = (0.24 - progress) / 0.24;
        g.beginPath();
        g.moveTo(x - baseRadius * 0.32, ctx.height * 0.02);
        g.quadraticCurveTo(x - baseRadius * 0.5, y * 0.62, x - radiusX * 0.68, y);
        g.quadraticCurveTo(x, y + radiusY * 0.8, x + radiusX * 0.68, y);
        g.quadraticCurveTo(x + baseRadius * 0.5, y * 0.62, x + baseRadius * 0.32, ctx.height * 0.02);
        g.closePath();
        g.globalAlpha *= 0.45 + neck * 0.55;
        g.fill();
      }
      if (proximity > 0) {
        g.beginPath();
        g.moveTo(x - radiusX * 0.72, y);
        g.quadraticCurveTo(x - baseRadius * 0.24, (y + poolY) * 0.5, x - baseRadius * 0.38, poolY + scale * 0.01);
        g.lineTo(x + baseRadius * 0.38, poolY + scale * 0.01);
        g.quadraticCurveTo(x + baseRadius * 0.24, (y + poolY) * 0.5, x + radiusX * 0.72, y);
        g.closePath();
        g.globalAlpha = proximity * viscosity * 0.78;
        g.fill();
      }
      g.globalAlpha = fade * (0.56 + viscosity * 0.4);
      g.beginPath();
      g.ellipse(x, y, radiusX, radiusY, 0, 0, TAU);
      g.fill();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{s as default};
