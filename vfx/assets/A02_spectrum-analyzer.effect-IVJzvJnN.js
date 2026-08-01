const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function sampleSpectrum(bands: number[], position: number): number {
  if (bands.length === 0) return 0;
  const scaled = Math.pow(clamp01(position), 1.65) * (bands.length - 1);
  const low = Math.floor(scaled);
  const high = Math.min(bands.length - 1, low + 1);
  const mix = scaled - low;
  return clamp01((Number(bands[low]) || 0) * (1 - mix) + (Number(bands[high]) || 0) * mix);
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const bins = Math.min(96, Math.max(16, Math.round(Number(ctx.params.bins ?? 48) / 4) * 4));
    const gain = Math.min(3, Math.max(0.25, Number(ctx.params.gain ?? 1.4)));
    const response = Math.min(2, Math.max(0.5, Number(ctx.params.response ?? 0.85)));
    const layout = String(ctx.params.layout ?? 'radial');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const phase = ctx.t * TAU;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.38 + rms * 0.2;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.fillStyle = signal;
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, Math.min(ctx.width, ctx.height) * 0.012) * (0.4 + rms);

    if (layout === 'columns') {
      const side = ctx.width * 0.07;
      const floor = ctx.height * 0.88;
      const available = ctx.width - side * 2;
      const gap = Math.max(1, available * 0.0035);
      const barWidth = Math.max(1, (available - gap * (bins - 1)) / bins);
      const maxHeight = ctx.height * 0.7;

      for (let index = 0; index < bins; index += 1) {
        const ratio = index / Math.max(1, bins - 1);
        const raw = sampleSpectrum(bands, ratio);
        const energy = clamp01(Math.pow(raw, response) * gain);
        const height = Math.max(2, energy * maxHeight + rms * ctx.height * 0.025);
        const sweep = 0.5 + 0.5 * Math.cos(phase - ratio * TAU);
        g.globalAlpha = 0.42 + energy * 0.42 + sweep * 0.12;
        g.fillRect(side + index * (barWidth + gap), floor - height, barWidth, height);
      }
    } else {
      const centerX = ctx.width * 0.5;
      const centerY = ctx.height * 0.5;
      const shortSide = Math.min(ctx.width, ctx.height);
      const innerRadius = shortSide * (0.18 + rms * 0.025);
      const maxLength = shortSide * 0.25;
      const lineWidth = Math.max(1.25, (TAU * innerRadius) / bins * 0.44);
      g.lineWidth = lineWidth;
      g.lineCap = 'round';

      for (let index = 0; index < bins; index += 1) {
        const mirrored = index <= bins / 2 ? index / (bins / 2) : (bins - index) / (bins / 2);
        const raw = sampleSpectrum(bands, mirrored);
        const energy = clamp01(Math.pow(raw, response) * gain);
        const angle = (index / bins) * TAU - Math.PI / 2 + phase;
        const length = Math.max(lineWidth, energy * maxLength + rms * shortSide * 0.025);
        const sweep = 0.5 + 0.5 * Math.cos(phase * 2 - (index / bins) * TAU);
        g.globalAlpha = 0.42 + energy * 0.42 + sweep * 0.12;
        g.beginPath();
        g.moveTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius);
        g.lineTo(
          centerX + Math.cos(angle) * (innerRadius + length),
          centerY + Math.sin(angle) * (innerRadius + length),
        );
        g.stroke();
      }
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
