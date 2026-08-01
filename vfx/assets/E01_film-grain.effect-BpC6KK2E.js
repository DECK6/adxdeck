const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const amount = Math.min(1, Math.max(0, Number(ctx.params.amount ?? 0.32)));
    const grainSize = Math.min(4, Math.max(1, Math.round(Number(ctx.params.grainSize ?? 2))));
    const mono = Boolean(ctx.params.mono ?? true);

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    if (amount === 0) return;

    g.save();
    g.globalCompositeOperation = 'screen';
    g.globalAlpha = 0.12 + amount * 0.34;

    let i = 0;
    for (let y = 0; y < ctx.height; y += grainSize) {
      for (let x = 0; x < ctx.width; x += grainSize) {
        const noise = ctx.random(\`g:\${ctx.frame}:\${i}\`);
        i += 1;
        if (noise > amount * 0.72) continue;

        if (mono) {
          const value = Math.round(noise * 255);
          g.fillStyle = \`rgb(\${value} \${value} \${value})\`;
        } else {
          const red = Math.round(ctx.random(\`g:\${ctx.frame}:\${i}:r\`) * 255);
          const green = Math.round(ctx.random(\`g:\${ctx.frame}:\${i}:g\`) * 255);
          const blue = Math.round(ctx.random(\`g:\${ctx.frame}:\${i}:b\`) * 255);
          g.fillStyle = \`rgb(\${red} \${green} \${blue})\`;
        }
        g.fillRect(x, y, grainSize, grainSize);
      }
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
