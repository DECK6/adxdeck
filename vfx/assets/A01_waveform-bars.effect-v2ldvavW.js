const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const barCount = Math.min(64, Math.max(8, Math.round(Number(ctx.params.barCount ?? 32))));
    const gain = Math.min(3, Math.max(0.25, Number(ctx.params.gain ?? 1.35)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const rms = ctx.audio?.rms ?? 0;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    const gap = Math.max(1, ctx.width * 0.006);
    const side = ctx.width * 0.08;
    const available = ctx.width - side * 2;
    const barWidth = Math.max(1, (available - gap * (barCount - 1)) / barCount);
    const centerY = ctx.height * 0.5;
    const maxHeight = ctx.height * 0.68;

    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, ctx.width * 0.012) * (0.35 + rms);
    for (let index = 0; index < barCount; index += 1) {
      const position = (index / Math.max(1, barCount - 1)) * (bands.length - 1);
      const low = Math.floor(position);
      const high = Math.min(bands.length - 1, low + 1);
      const mix = position - low;
      const energy = bands[low] * (1 - mix) + bands[high] * mix;
      const symmetry = 0.72 + 0.28 * Math.sin((index / barCount) * Math.PI);
      const height = Math.max(2, Math.min(maxHeight, energy * gain * maxHeight * symmetry + rms * 8));
      const x = side + index * (barWidth + gap);
      g.globalAlpha = 0.58 + energy * 0.42;
      g.fillRect(x, centerY - height / 2, barWidth, height);
    }
    g.restore();

    g.fillStyle = 'rgba(247,250,252,0.72)';
    g.font = \`600 \${Math.max(9, ctx.height * 0.055)}px 'JetBrains Mono', monospace\`;
    g.textAlign = 'center';
    g.fillText('AUDIO / 120 BPM', ctx.width / 2, ctx.height * 0.91);
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
