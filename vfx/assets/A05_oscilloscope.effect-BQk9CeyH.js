const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const gain = clamp(Number(ctx.params.gain ?? 1.4), 0.25, 3);
    const sweep = clamp(Math.round(Number(ctx.params.sweep ?? 2)), 1, 5);
    const thickness = clamp(Number(ctx.params.thickness ?? 2.2), 1, 5);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp(ctx.audio?.rms ?? 0, 0, 1);
    const sourceBands = ctx.audio?.bands ?? [];
    const bands = Array.from({ length: 8 }, (_, index) =>
      clamp(Number(sourceBands[index] ?? 0), 0, 1),
    );

    const left = ctx.width * 0.07;
    const top = ctx.height * 0.12;
    const plotWidth = ctx.width * 0.86;
    const plotHeight = ctx.height * 0.76;
    const centerY = top + plotHeight * 0.5;
    const phase = ctx.t * TAU * sweep;
    const sampleCount = Math.min(480, Math.max(96, Math.round(ctx.width * 0.75)));

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.save();
    g.strokeStyle = signal;
    g.lineWidth = Math.max(0.5, ctx.width / 960);
    g.globalAlpha = 0.1;
    for (let column = 0; column <= 10; column += 1) {
      const x = left + (plotWidth * column) / 10;
      g.beginPath();
      g.moveTo(x, top);
      g.lineTo(x, top + plotHeight);
      g.stroke();
    }
    for (let row = 0; row <= 6; row += 1) {
      const y = top + (plotHeight * row) / 6;
      g.beginPath();
      g.moveTo(left, y);
      g.lineTo(left + plotWidth, y);
      g.stroke();
    }

    g.globalAlpha = 0.24;
    g.lineWidth = Math.max(0.75, ctx.width / 720);
    g.beginPath();
    g.moveTo(left, centerY);
    g.lineTo(left + plotWidth, centerY);
    g.stroke();
    g.restore();

    const pointAt = (index: number, phaseOffset: number): [number, number] => {
      const u = index / sampleCount;
      const bandPosition = u * (bands.length - 1);
      const low = Math.floor(bandPosition);
      const high = Math.min(bands.length - 1, low + 1);
      const mix = bandPosition - low;
      const energy = bands[low] * (1 - mix) + bands[high] * mix;
      const localPhase = phase + phaseOffset;
      const primary = Math.sin(TAU * (2.2 + bands[1] * 1.8) * u + localPhase);
      const harmonic = Math.sin(TAU * (5.4 + bands[4] * 2.6) * u - localPhase * 2 + bands[6] * Math.PI);
      const shimmer = Math.sin(TAU * 11 * u + localPhase * 3) * bands[7];
      const wave = (primary + harmonic * (0.18 + bands[3] * 0.3) + shimmer * 0.16) / 1.46;
      const amplitude = plotHeight * clamp((0.07 + rms * 0.24 + energy * 0.13) * gain, 0.04, 0.46);
      return [left + u * plotWidth, centerY + wave * amplitude];
    };

    const strokeWave = (phaseOffset: number, alpha: number, lineWidth: number): void => {
      g.globalAlpha = alpha;
      g.lineWidth = lineWidth;
      g.beginPath();
      for (let index = 0; index <= sampleCount; index += 1) {
        const [x, y] = pointAt(index, phaseOffset);
        if (index === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    };

    g.save();
    g.strokeStyle = signal;
    g.lineJoin = 'round';
    g.lineCap = 'round';
    strokeWave(-0.32, 0.1, thickness * 3.2);
    strokeWave(-0.16, 0.18, thickness * 2.1);
    g.shadowColor = signal;
    g.shadowBlur = thickness * (3.5 + rms * 5);
    strokeWave(0, 0.9, thickness);
    g.restore();

    const scanU = 0.5 + Math.sin(phase) * 0.44;
    const scanX = left + scanU * plotWidth;
    const scanRadius = plotWidth * 0.075;
    g.save();
    g.beginPath();
    g.rect(scanX - scanRadius, top, scanRadius * 2, plotHeight);
    g.clip();
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = thickness * 7;
    strokeWave(0, 1, thickness * 1.45);
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
