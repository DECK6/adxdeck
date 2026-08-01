const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const CHANNELS = ['#F04E98', '#7567FF'] as const;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const amount = Math.min(1, Math.max(0.15, Number(ctx.params.amount ?? 0.68)));
    const grainSize = Math.min(9, Math.max(2, Math.round(Number(ctx.params.grainSize ?? 4))));
    const orbit = Math.min(42, Math.max(4, Number(ctx.params.orbit ?? 22)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const count = Math.round((ctx.width * ctx.height) / (grainSize * grainSize) * 0.075 * amount);

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.globalCompositeOperation = 'screen';
    for (let index = 0; index < count; index += 1) {
      const baseX = ctx.random(\`grain:\${index}:x\`) * ctx.width;
      const baseY = ctx.random(\`grain:\${index}:y\`) * ctx.height;
      const direction = ctx.random(\`grain:\${index}:phase\`) * TAU;
      const radius = orbit * (0.35 + ctx.random(\`grain:\${index}:radius\`) * 0.65);
      const x = (baseX + Math.cos(phase + direction) * radius + ctx.width) % ctx.width;
      const y = (baseY + Math.sin(phase * 2 + direction) * radius * 0.7 + ctx.height) % ctx.height;
      const channel = index % 3;
      const size = grainSize * (0.55 + ctx.random(\`grain:\${index}:size\`) * 1.1);
      g.fillStyle = channel === 0 ? signal : CHANNELS[channel - 1];
      g.globalAlpha = amount * (0.18 + ctx.random(\`grain:\${index}:alpha\`) * 0.5);
      g.fillRect(x - size * 0.5, y - size * 0.5, size, size);
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
