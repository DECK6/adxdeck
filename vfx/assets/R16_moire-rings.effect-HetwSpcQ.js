const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const rings = Math.min(70, Math.max(20, Math.round(Number(ctx.params.rings ?? 46))));
    const separation = Math.min(0.28, Math.max(0.02, Number(ctx.params.separation ?? 0.13)));
    const drift = Math.min(1, Math.max(0, Number(ctx.params.drift ?? 0.72)));
    const lineWidth = Math.min(2, Math.max(0.4, Number(ctx.params.lineWidth ?? 0.9)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const minSide = Math.min(ctx.width, ctx.height);
    const gap = minSide / (rings * 0.62);
    const offset = minSide * separation;
    const orbitX = Math.cos(phase) * offset * drift;
    const orbitY = Math.sin(phase * 2) * offset * drift * 0.5;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.2;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    const drawSet = (cx: number, cy: number, scale: number, alpha: number) => {
      g.beginPath();
      for (let index = 1; index <= rings; index += 1) {
        g.moveTo(cx + index * gap * scale, cy);
        g.arc(cx, cy, index * gap * scale, 0, TAU);
      }
      g.globalAlpha = alpha;
      g.stroke();
    };

    g.save();
    g.strokeStyle = signal;
    g.lineWidth = lineWidth;
    g.shadowColor = signal;
    g.shadowBlur = lineWidth * 2;
    drawSet(ctx.width * 0.5 - offset + orbitX, ctx.height * 0.5 + orbitY, 1, 0.64);
    drawSet(ctx.width * 0.5 + offset - orbitX, ctx.height * 0.5 - orbitY, 1.007, 0.48);
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
