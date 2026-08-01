const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const intensity = Math.min(1, Math.max(0, Number(ctx.params.intensity ?? 0.72)));
    const dropoutRate = Math.min(1, Math.max(0, Number(ctx.params.dropoutRate ?? 0.46)));
    const noiseScale = Math.min(10, Math.max(2, Math.round(Number(ctx.params.noiseScale ?? 4))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const loopFrame = ((ctx.frame % ctx.durationInFrames) + ctx.durationInFrames) % ctx.durationInFrames;
    const phase = (loopFrame / ctx.durationInFrames) * TAU;
    const pulse = Math.abs(Math.sin(phase * 3) * Math.sin(phase * 5 + 0.72));
    const threshold = 0.82 - dropoutRate * 0.48;
    const loss = Math.min(1, Math.max(0, (pulse - threshold) / Math.max(0.01, 1 - threshold)));

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 1 - loss * intensity * 0.82;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    const strips = 2 + Math.round(dropoutRate * 5);
    for (let strip = 0; strip < strips; strip += 1) {
      const center = ctx.random(\`strip:\${strip}:y\`);
      const travel = Math.sin(phase * (strip % 3 + 1) + ctx.random(\`strip:\${strip}:phase\`) * TAU) * 0.08;
      const y = ((center + travel + 1) % 1) * ctx.height;
      const height = ctx.height * (0.018 + ctx.random(\`strip:\${strip}:h\`) * 0.055) * (0.4 + intensity);
      const active = ctx.random(\`strip:\${loopFrame}:\${strip}:active\`) < dropoutRate * (0.22 + loss * 0.78);
      if (!active) continue;

      g.fillStyle = '#0D0E10';
      g.globalAlpha = 0.62 + loss * 0.3;
      g.fillRect(0, y, ctx.width, height);
      g.globalAlpha = 0.18 + intensity * 0.32;
      g.fillStyle = signal;
      g.fillRect(0, y, ctx.width, Math.max(1, height * 0.1));
    }
    g.globalAlpha = 1;

    const staticAmount = intensity * (0.12 + loss * 0.88);
    if (staticAmount <= 0.01) return;

    g.save();
    g.globalCompositeOperation = 'screen';
    const bandCount = 3 + Math.round(staticAmount * 7);
    let sample = 0;
    for (let band = 0; band < bandCount; band += 1) {
      const y = ctx.random(\`noise:\${loopFrame}:\${band}:y\`) * ctx.height;
      const bandHeight = noiseScale * (1 + Math.floor(ctx.random(\`noise:\${loopFrame}:\${band}:h\`) * 5));
      for (let x = 0; x < ctx.width; x += noiseScale) {
        const value = ctx.random(\`noise:\${loopFrame}:\${sample}\`);
        sample += 1;
        if (value > staticAmount * 0.82) continue;
        g.globalAlpha = 0.14 + value * 0.58;
        g.fillStyle = value > 0.7 ? signal : 'rgba(255,255,255,0.9)';
        g.fillRect(x, y, noiseScale, bandHeight);
      }
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
