const t=`import type { FxKernel } from '../../src/fx/types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const density = clamp(Number(ctx.params.density ?? 0.36), 0.05, 0.8);
    const grainSize = Math.round(clamp(Number(ctx.params.grainSize ?? 2), 1, 6));
    const burstRate = Math.round(clamp(Number(ctx.params.burstRate ?? 6), 2, 10));
    const intensity = clamp(Number(ctx.params.intensity ?? 0.82), 0, 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const burstPosition = (ctx.t * burstRate) % 1;
    const burst = Math.exp(-Math.pow((burstPosition - 0.18) / 0.105, 2));
    const amount = intensity * (0.1 + burst * 0.9);

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.globalCompositeOperation = 'screen';
    let index = 0;
    for (let y = 0; y < ctx.height; y += grainSize) {
      for (let x = 0; x < ctx.width; x += grainSize) {
        const noise = ctx.random(\`static:\${ctx.frame}:\${index}\`);
        index += 1;
        if (noise > density * (0.35 + amount * 0.65)) continue;
        const bright = ctx.random(\`level:\${ctx.frame}:\${index}\`);
        g.globalAlpha = amount * (0.14 + bright * 0.72);
        g.fillStyle = bright > 0.72 ? signal : \`rgb(\${Math.round(150 + bright * 105)} \${Math.round(160 + bright * 95)} \${Math.round(170 + bright * 85)})\`;
        g.fillRect(x, y, grainSize, grainSize);
      }
    }

    const streaks = 3 + Math.round(burst * 12);
    g.fillStyle = signal;
    for (let streak = 0; streak < streaks; streak += 1) {
      const y = ctx.random(\`streak-y:\${ctx.frame}:\${streak}\`) * ctx.height;
      const x = ctx.random(\`streak-x:\${ctx.frame}:\${streak}\`) * ctx.width * 0.45;
      const width = ctx.width * (0.12 + ctx.random(\`streak-w:\${ctx.frame}:\${streak}\`) * 0.58);
      g.globalAlpha = amount * (0.08 + ctx.random(\`streak-a:\${ctx.frame}:\${streak}\`) * 0.28);
      g.fillRect(x, y, width, Math.max(1, grainSize * 0.7));
    }

    if (burst > 0.72) {
      g.globalAlpha = (burst - 0.72) * intensity * 0.24;
      g.fillStyle = signal;
      g.fillRect(0, 0, ctx.width, ctx.height);
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
