const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const segments = Math.min(96, Math.max(24, Math.round(Number(ctx.params.segments ?? 64))));
    const radiusFactor = Math.min(0.36, Math.max(0.16, Number(ctx.params.radius ?? 0.25)));
    const gain = Math.min(3, Math.max(0.5, Number(ctx.params.gain ?? 1.5)));
    const thickness = Math.min(6, Math.max(1, Number(ctx.params.thickness ?? 2.5)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const rms = ctx.audio?.rms ?? 0;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const baseRadius = Math.min(ctx.width, ctx.height) * radiusFactor;
    const rotation = ctx.t * Math.PI * 2;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.58;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineCap = 'round';
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, ctx.width * 0.01) * (0.55 + rms);
    for (let index = 0; index < segments; index += 1) {
      const ratio = index / segments;
      const angle = ratio * Math.PI * 2 - Math.PI / 2 + rotation;
      const bandPosition = ratio * bands.length;
      const low = Math.floor(bandPosition) % bands.length;
      const high = (low + 1) % bands.length;
      const blend = bandPosition - Math.floor(bandPosition);
      const audioEnergy = bands[low] * (1 - blend) + bands[high] * blend;
      const idleWave = 0.12 + 0.1 * (0.5 + 0.5 * Math.sin(angle * 5 - rotation * 7));
      const energy = Math.min(1, audioEnergy * gain + rms * 0.32 + idleWave);
      const inner = baseRadius - thickness * 0.5;
      const outer = baseRadius + 5 + energy * Math.min(ctx.width, ctx.height) * 0.16;
      g.globalAlpha = 0.45 + energy * 0.55;
      g.lineWidth = thickness * (0.7 + energy * 0.65);
      g.beginPath();
      g.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      g.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      g.stroke();
    }

    g.globalAlpha = 0.58 + rms * 0.32;
    g.lineWidth = thickness;
    g.beginPath();
    g.arc(centerX, centerY, baseRadius * (1 + rms * 0.08), 0, Math.PI * 2);
    g.stroke();
    const markerAngle = rotation * 2 - Math.PI / 2;
    g.globalAlpha = 0.95;
    g.beginPath();
    g.arc(
      centerX + Math.cos(markerAngle) * baseRadius,
      centerY + Math.sin(markerAngle) * baseRadius,
      thickness * 1.7,
      0,
      Math.PI * 2,
    );
    g.fill();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
