const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const intensity = Math.min(1, Math.max(0, Number(ctx.params.intensity ?? 0.68)));
    const sliceHeight = Math.min(64, Math.max(6, Math.round(Number(ctx.params.sliceHeight ?? 22))));
    const maxShift = Math.min(180, Math.max(4, Number(ctx.params.maxShift ?? 72)));
    const channelOffset = Math.min(24, Math.max(0, Number(ctx.params.channelOffset ?? 8)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;

    g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    if (intensity === 0) return;

    const beat = ctx.t * 15;
    const event = Math.floor(beat);
    const eventPhase = beat - event;
    const envelope = Math.pow(Math.sin(eventPhase * Math.PI), 3);

    g.save();
    g.beginPath();
    g.rect(0, 0, ctx.width, ctx.height);
    g.clip();

    let slice = 0;
    for (let y = 0; y < ctx.height; y += sliceHeight) {
      const height = Math.min(sliceHeight, ctx.height - y);
      const active = ctx.random(\`slice:\${event}:\${slice}:active\`) < 0.22 + intensity * 0.58;
      if (!active) {
        slice += 1;
        continue;
      }

      const direction = ctx.random(\`slice:\${event}:\${slice}:direction\`) < 0.5 ? -1 : 1;
      const strength = 0.3 + ctx.random(\`slice:\${event}:\${slice}:strength\`) * 0.7;
      const shift = direction * maxShift * intensity * strength * envelope;

      g.fillStyle = '#0D0E10';
      g.fillRect(0, y, ctx.width, height);
      g.drawImage(ctx.subject.bitmap, 0, y, ctx.width, height, shift, y, ctx.width, height);

      if (channelOffset > 0 && ctx.random(\`slice:\${event}:\${slice}:channel\`) < 0.55) {
        g.save();
        g.globalCompositeOperation = 'screen';
        g.globalAlpha = (0.08 + intensity * 0.16) * envelope;
        g.filter = 'sepia(1) saturate(8) hue-rotate(130deg)';
        g.drawImage(
          ctx.subject.bitmap,
          0,
          y,
          ctx.width,
          height,
          shift + direction * channelOffset,
          y,
          ctx.width,
          height,
        );
        g.filter = 'sepia(1) saturate(8) hue-rotate(-45deg)';
        g.drawImage(
          ctx.subject.bitmap,
          0,
          y,
          ctx.width,
          height,
          shift - direction * channelOffset,
          y,
          ctx.width,
          height,
        );
        g.restore();
      }

      if (ctx.random(\`slice:\${event}:\${slice}:edge\`) < 0.34) {
        g.globalAlpha = (0.18 + intensity * 0.32) * envelope;
        g.fillStyle = signal;
        g.fillRect(shift, y, Math.max(2, Math.abs(shift) * 0.16), 1);
        g.globalAlpha = 1;
      }

      slice += 1;
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
