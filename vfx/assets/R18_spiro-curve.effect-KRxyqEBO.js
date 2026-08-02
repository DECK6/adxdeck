const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const ratio = String(ctx.params.ratio ?? '7:3');
    const [rawOuter, rawInner] = ratio.split(':').map(Number);
    const outer = Number.isFinite(rawOuter) ? rawOuter : 7;
    const inner = Number.isFinite(rawInner) ? rawInner : 3;
    const penOffset = Math.min(1, Math.max(0.35, Number(ctx.params.penOffset ?? 0.82)));
    const scale = Math.min(0.95, Math.max(0.5, Number(ctx.params.scale ?? 0.82)));
    const lineWidth = Math.min(3.5, Math.max(0.5, Number(ctx.params.lineWidth ?? 1.4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const reveal = 0.5 - 0.5 * Math.cos(phase);
    const samples = 960;
    const visible = Math.max(2, Math.floor(samples * reveal));
    const radius = Math.min(ctx.width, ctx.height) * 0.46 * scale;
    const smallRadius = radius * inner / outer;
    const distance = smallRadius * penOffset;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.18;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.translate(ctx.width * 0.5, ctx.height * 0.5);
    g.rotate(phase * 0.06);
    g.beginPath();
    for (let index = 0; index < visible; index += 1) {
      const theta = (index / (samples - 1)) * TAU * inner;
      const x = (radius - smallRadius) * Math.cos(theta)
        + distance * Math.cos(((radius - smallRadius) / smallRadius) * theta);
      const y = (radius - smallRadius) * Math.sin(theta)
        - distance * Math.sin(((radius - smallRadius) / smallRadius) * theta);
      if (index === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.strokeStyle = signal;
    g.lineWidth = lineWidth;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.globalAlpha = 0.88;
    g.shadowColor = signal;
    g.shadowBlur = lineWidth * 4;
    g.stroke();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
