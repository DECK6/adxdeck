const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const count = Math.max(120, Math.min(720, Math.round(Number(ctx.params.points ?? 420))));
    const radius = Math.min(ctx.width, ctx.height) * Number(ctx.params.radius ?? 0.31);
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const theta = phase * Math.PI * 2;
    const rotation = theta * turns;
    const morph = 0.5 - 0.5 * Math.cos(theta);
    const tilt = -0.34 + Math.sin(theta) * 0.12;
    const focal = Math.min(ctx.width, ctx.height) * 1.15;
    const centerX = ctx.width / 2;
    const centerY = ctx.height / 2;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const projected: Array<{ x: number; y: number; z: number; size: number; alpha: number }> = [];

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.07;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    for (let index = 0; index < count; index += 1) {
      const normalized = (index + 0.5) / count;
      const baseY = 1 - normalized * 2;
      const ringRadius = Math.sqrt(Math.max(0, 1 - baseY * baseY));
      const longitude = goldenAngle * index;
      const ringMix = morph * 0.72;
      const x0 = Math.cos(longitude) * (ringRadius * (1 - ringMix) + ringMix);
      const y0 = baseY * (1 - ringMix);
      const z0 = Math.sin(longitude) * (ringRadius * (1 - ringMix) + ringMix);
      const x1 = x0 * Math.cos(rotation) - z0 * Math.sin(rotation);
      const z1 = x0 * Math.sin(rotation) + z0 * Math.cos(rotation);
      const y1 = y0 * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z2 = y0 * Math.sin(tilt) + z1 * Math.cos(tilt);
      const scale = focal / Math.max(1, focal - z2 * radius);

      projected.push({
        x: centerX + x1 * radius * scale,
        y: centerY + y1 * radius * scale,
        z: z2,
        size: (0.8 + scale * 1.65) * (0.75 + morph * 0.25),
        alpha: 0.22 + ((z2 + 1) / 2) * 0.78,
      });
    }

    projected.sort((a, b) => a.z - b.z);
    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = 7;
    for (const point of projected) {
      g.globalAlpha = point.alpha;
      g.beginPath();
      g.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
