const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

function sampleBands(bands: number[], position: number): number {
  const wrapped = ((position % 1) + 1) % 1;
  const scaled = wrapped * bands.length;
  const low = Math.floor(scaled) % bands.length;
  const high = (low + 1) % bands.length;
  const mix = scaled - Math.floor(scaled);
  return bands[low] * (1 - mix) + bands[high] * mix;
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const segments = Math.min(160, Math.max(48, Math.round(Number(ctx.params.segments ?? 96) / 4) * 4));
    const radiusFactor = Math.min(0.34, Math.max(0.16, Number(ctx.params.radius ?? 0.24)));
    const gain = Math.min(2.6, Math.max(0.4, Number(ctx.params.gain ?? 1.3)));
    const rotation = Math.min(4, Math.max(1, Math.round(Number(ctx.params.rotation ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const phase = ctx.t * TAU * rotation;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const scale = Math.min(ctx.width, ctx.height);
    const baseRadius = scale * radiusFactor;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.34 + rms * 0.12;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    const trace = (mirror: number, alpha: number, width: number): void => {
      g.globalAlpha = alpha;
      g.lineWidth = width;
      g.beginPath();
      for (let index = 0; index <= segments; index += 1) {
        const unit = index / segments;
        const angle = unit * TAU + phase;
        const energy = clamp01(sampleBands(bands, unit + ctx.t * rotation) * gain + rms * 0.16);
        const carrier = Math.sin(unit * TAU * 8 + phase * 2) * 0.28 + Math.sin(unit * TAU * 3 - phase) * 0.12;
        const radial = baseRadius + mirror * scale * energy * (0.035 + carrier * 0.025);
        const x = centerX + Math.cos(angle) * radial;
        const y = centerY + Math.sin(angle) * radial;
        if (index === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.stroke();
    };

    g.save();
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = scale * (0.012 + rms * 0.025);
    g.lineJoin = 'round';
    trace(-1, 0.24 + rms * 0.2, Math.max(0.8, scale * 0.006));
    trace(1, 0.82, Math.max(1.2, scale * 0.01));
    g.globalAlpha = 0.18 + rms * 0.25;
    g.lineWidth = Math.max(0.8, scale * 0.004);
    g.beginPath();
    g.arc(centerX, centerY, baseRadius, 0, TAU);
    g.stroke();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
