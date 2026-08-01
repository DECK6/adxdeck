const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const intensity = Math.min(1, Math.max(0, Number(ctx.params.intensity ?? 0.72)));
    const density = Math.min(10, Math.max(2, Math.round(Number(ctx.params.density ?? 4))));
    const rollSpeed = Math.min(5, Math.max(1, Math.round(Number(ctx.params.rollSpeed ?? 3))));
    const jitter = Math.min(12, Math.max(0, Number(ctx.params.jitter ?? 2.4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    const jitterSample = ctx.random(\`jitter:\${ctx.frame}\`) * 2 - 1;
    const jitterX = jitterSample * jitter * intensity;
    if (ctx.subject.bitmap) {
      g.drawImage(ctx.subject.bitmap, jitterX - 1, 0, ctx.width + 2, ctx.height);

      if (intensity > 0) {
        g.save();
        g.globalCompositeOperation = 'screen';
        g.globalAlpha = intensity * 0.055;
        g.filter = 'sepia(1) saturate(7) hue-rotate(130deg)';
        g.drawImage(ctx.subject.bitmap, jitterX + 2.5, 0, ctx.width, ctx.height);
        g.filter = 'sepia(1) saturate(7) hue-rotate(-45deg)';
        g.drawImage(ctx.subject.bitmap, jitterX - 2.5, 0, ctx.width, ctx.height);
        g.restore();
      }
    }

    g.save();
    for (let y = 0; y < ctx.height; y += density) {
      g.globalAlpha = 0.12 + intensity * 0.24;
      g.fillStyle = '#0D0E10';
      g.fillRect(0, y, ctx.width, Math.max(1, density * 0.42));

      if (y % (density * 4) === 0) {
        g.globalAlpha = intensity * 0.055;
        g.fillStyle = signal;
        g.fillRect(0, y + Math.max(1, density * 0.42), ctx.width, 1);
      }
    }

    const roll = ((ctx.t * rollSpeed) % 1) * (ctx.height + 180) - 90;
    const rollingBar = g.createLinearGradient(0, roll - 90, 0, roll + 90);
    rollingBar.addColorStop(0, 'rgba(94, 231, 243, 0)');
    rollingBar.addColorStop(0.5, signal);
    rollingBar.addColorStop(1, 'rgba(94, 231, 243, 0)');
    g.globalCompositeOperation = 'screen';
    g.globalAlpha = 0.04 + intensity * 0.1;
    g.fillStyle = rollingBar;
    g.fillRect(0, roll - 90, ctx.width, 180);
    g.restore();

    const vignette = g.createRadialGradient(
      ctx.width / 2,
      ctx.height / 2,
      Math.min(ctx.width, ctx.height) * 0.2,
      ctx.width / 2,
      ctx.height / 2,
      Math.max(ctx.width, ctx.height) * 0.72,
    );
    vignette.addColorStop(0, 'rgba(13, 14, 16, 0)');
    vignette.addColorStop(0.7, 'rgba(13, 14, 16, 0.08)');
    vignette.addColorStop(1, \`rgba(13, 14, 16, \${0.72 + intensity * 0.2})\`);
    g.fillStyle = vignette;
    g.fillRect(0, 0, ctx.width, ctx.height);
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
