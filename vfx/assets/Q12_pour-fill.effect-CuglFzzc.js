const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const amount = Math.min(0.92, Math.max(0.35, Number(ctx.params.amount ?? 0.78)));
    const streamWidth = Math.min(22, Math.max(4, Number(ctx.params.streamWidth ?? 11)));
    const bubbles = Math.min(28, Math.max(4, Math.round(Number(ctx.params.bubbles ?? 15))));
    const slosh = Math.min(1, Math.max(0, Number(ctx.params.slosh ?? 0.48)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const scale = Math.min(ctx.width, ctx.height);
    const left = ctx.width * 0.22;
    const right = ctx.width * 0.78;
    const top = ctx.height * 0.19;
    const bottom = ctx.height * 0.88;
    const fillEnvelope = 0.5 - 0.5 * Math.cos(ctx.t * TAU);
    const surfaceY = bottom - (bottom - top) * amount * fillEnvelope;
    const wave = scale * 0.018 * slosh;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.24;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    const liquidPath = new Path2D();
    liquidPath.moveTo(left, surfaceY);
    for (let sample = 0; sample <= 20; sample += 1) {
      const x = left + (sample / 20) * (right - left);
      const y = surfaceY + Math.sin((sample / 20) * TAU * 2 + ctx.t * TAU) * wave;
      liquidPath.lineTo(x, y);
    }
    liquidPath.lineTo(right, bottom);
    liquidPath.lineTo(left, bottom);
    liquidPath.closePath();

    g.save();
    g.clip(liquidPath);
    if (ctx.subject.bitmap) {
      g.globalAlpha = 0.78;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    }
    g.globalAlpha = 0.3 + fillEnvelope * 0.22;
    g.fillStyle = signal;
    g.fillRect(left, top, right - left, bottom - top);
    g.restore();

    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = scale * 0.022;
    const pourActive = Math.sin(ctx.t * Math.PI);
    g.globalAlpha = pourActive * (0.5 + fillEnvelope * 0.38);
    const streamX = ctx.width * 0.57 + Math.sin(ctx.t * TAU) * scale * 0.025 * slosh;
    g.beginPath();
    g.moveTo(streamX - streamWidth * 0.5, 0);
    g.quadraticCurveTo(streamX - streamWidth * 0.2, surfaceY * 0.54, streamX - streamWidth * 0.65, surfaceY);
    g.lineTo(streamX + streamWidth * 0.65, surfaceY);
    g.quadraticCurveTo(streamX + streamWidth * 0.2, surfaceY * 0.54, streamX + streamWidth * 0.5, 0);
    g.closePath();
    g.fill();

    for (let index = 0; index < bubbles; index += 1) {
      const offset = ctx.random(\`pour:\${index}:offset\`);
      const progress = (ctx.t + offset) % 1;
      const x = left + (0.1 + ctx.random(\`pour:\${index}:x\`) * 0.8) * (right - left)
        + Math.sin(progress * TAU * 2 + offset) * scale * 0.012 * slosh;
      const y = bottom - progress * Math.max(0, bottom - surfaceY);
      const radius = scale * (0.006 + ctx.random(\`pour:\${index}:size\`) * 0.012);
      if (y < surfaceY - radius || fillEnvelope < 0.04) continue;
      g.globalAlpha = Math.sin(progress * Math.PI) * 0.62;
      g.lineWidth = Math.max(0.7, radius * 0.16);
      g.beginPath();
      g.arc(x, y, radius, 0, TAU);
      g.stroke();
    }
    g.restore();

    g.save();
    g.strokeStyle = signal;
    g.globalAlpha = 0.86;
    g.lineWidth = Math.max(1.5, scale * 0.012);
    g.beginPath();
    g.moveTo(left, top);
    g.lineTo(left, bottom);
    g.quadraticCurveTo(ctx.width * 0.5, bottom + scale * 0.04, right, bottom);
    g.lineTo(right, top);
    g.stroke();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
