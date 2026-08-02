const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

function sampleMel(bands: number[], position: number): number {
  const curved = Math.pow(clamp01(position), 1.45) * (bands.length - 1);
  const low = Math.floor(curved);
  const high = Math.min(bands.length - 1, low + 1);
  const mix = curved - low;
  return bands[low] * (1 - mix) + bands[high] * mix;
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const rowCount = Math.min(28, Math.max(10, Math.round(Number(ctx.params.rows ?? 20))));
    const gain = Math.min(2.5, Math.max(0.4, Number(ctx.params.gain ?? 1.35)));
    const depth = Math.min(1.4, Math.max(0.5, Number(ctx.params.depth ?? 0.95)));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const phase = ctx.t * TAU * speed;
    const scroll = (ctx.t * rowCount * speed) % 1;
    const horizonY = ctx.height * 0.24;
    const floorY = ctx.height * 0.91;
    const samples = 72;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.08 + rms * 0.08;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.shadowColor = signal;
    for (let row = 0; row < rowCount; row += 1) {
      const track = (row + scroll) % rowCount;
      const depthUnit = track / Math.max(1, rowCount - 1);
      const perspective = 0.34 + depthUnit * 0.66;
      const centerX = ctx.width * 0.5;
      const halfWidth = ctx.width * (0.23 + perspective * 0.23) * depth;
      const baseY = horizonY + (floorY - horizonY) * Math.pow(depthUnit, 1.25);
      const rowPhase = phase - track * 0.43;
      const amplitude = ctx.height * (0.035 + perspective * 0.12) * depth;
      const rowAlpha = 0.1 + perspective * 0.62;
      g.globalAlpha = rowAlpha;
      g.lineWidth = Math.max(0.7, perspective * 2.2);
      g.shadowBlur = perspective > 0.72 ? 5 + rms * 9 : 0;
      g.beginPath();
      for (let index = 0; index <= samples; index += 1) {
        const unit = index / samples;
        const band = sampleMel(bands, unit);
        const ridge = clamp01((band * 0.82 + rms * 0.18) * gain);
        const harmonic = 0.76 + 0.24 * Math.sin(unit * TAU * 6 + rowPhase);
        const noise = 0.92 + ctx.random(\`ridge:\${row}:\${index}\`) * 0.08;
        const x = centerX + (unit - 0.5) * halfWidth * 2;
        const y = baseY - ridge * amplitude * harmonic * noise;
        if (index === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.restore();

    g.save();
    g.strokeStyle = signal;
    g.globalAlpha = 0.12 + rms * 0.12;
    g.lineWidth = 1;
    for (let rail = 0; rail <= 4; rail += 1) {
      const xBottom = ctx.width * (0.5 + (rail - 2) * 0.18 * depth);
      const xTop = ctx.width * (0.5 + (rail - 2) * 0.08 * depth);
      g.beginPath();
      g.moveTo(xTop, horizonY);
      g.lineTo(xBottom, floorY);
      g.stroke();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
