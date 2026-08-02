const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const frequencyX = Math.max(1, Math.round(Number(ctx.params.frequencyX ?? 3)));
    const frequencyY = Math.max(1, Math.round(Number(ctx.params.frequencyY ?? 2)));
    const trail = Math.min(1, Math.max(0.08, Number(ctx.params.trail ?? 0.58)));
    const gain = Math.min(1, Math.max(0.45, Number(ctx.params.gain ?? 0.82)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const radiusX = ctx.width * 0.38 * gain;
    const radiusY = ctx.height * 0.39 * gain;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.13;
      g.filter = 'grayscale(1) contrast(1.35)';
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.lineWidth = 1;
    g.globalAlpha = 0.12;
    for (let index = 1; index < 10; index += 1) {
      const x = (ctx.width * index) / 10;
      const y = (ctx.height * index) / 10;
      g.beginPath();
      g.moveTo(x, ctx.height * 0.08);
      g.lineTo(x, ctx.height * 0.92);
      g.stroke();
      g.beginPath();
      g.moveTo(ctx.width * 0.08, y);
      g.lineTo(ctx.width * 0.92, y);
      g.stroke();
    }
    g.globalAlpha = 0.28;
    g.strokeRect(ctx.width * 0.065, ctx.height * 0.065, ctx.width * 0.87, ctx.height * 0.87);

    const samples = 360;
    const head = phase / TAU;
    const start = head - trail;
    for (let layer = 5; layer >= 0; layer -= 1) {
      g.beginPath();
      for (let index = 0; index <= samples; index += 1) {
        const progress = index / samples;
        const theta = (start + progress * trail) * TAU;
        const x = centerX + Math.sin(frequencyX * theta + phase * 0.35) * radiusX;
        const y = centerY + Math.sin(frequencyY * theta) * radiusY;
        if (index === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokeStyle = signal;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.lineWidth = 1 + layer * 1.8;
      g.globalAlpha = layer === 0 ? 0.94 : 0.025 + (5 - layer) * 0.012;
      g.stroke();
    }

    const headTheta = head * TAU;
    const headX = centerX + Math.sin(frequencyX * headTheta + phase * 0.35) * radiusX;
    const headY = centerY + Math.sin(frequencyY * headTheta) * radiusY;
    g.beginPath();
    g.arc(headX, headY, Math.max(2, Math.min(ctx.width, ctx.height) * 0.018), 0, TAU);
    g.fillStyle = '#F2FFFF';
    g.globalAlpha = 0.9;
    g.shadowColor = signal;
    g.shadowBlur = 18;
    g.fill();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
