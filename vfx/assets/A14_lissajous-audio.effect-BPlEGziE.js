const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const trailCount = Math.min(8, Math.max(2, Math.round(Number(ctx.params.trails ?? 5))));
    const ratio = String(ctx.params.ratio ?? '3:4');
    const xFrequency = ratio === '2:3' ? 2 : 3;
    const yFrequency = ratio === '3:5' ? 5 : ratio === '2:3' ? 3 : 4;
    const phaseSpread = Math.min(1.2, Math.max(0.1, Number(ctx.params.phaseSpread ?? 0.55)));
    const gain = Math.min(2.4, Math.max(0.4, Number(ctx.params.gain ?? 1.25)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const phase = ctx.t * TAU;
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const width = ctx.width * 0.31;
    const height = ctx.height * 0.34;
    const samples = 280;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.12 + rms * 0.1;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.shadowColor = signal;
    g.shadowBlur = Math.min(ctx.width, ctx.height) * (0.012 + rms * 0.018);
    for (let trail = trailCount - 1; trail >= 0; trail -= 1) {
      const pair = trail % 4;
      const xBand = bands[pair];
      const yBand = bands[7 - pair];
      const trailUnit = trail / Math.max(1, trailCount - 1);
      const audioPhase = (yBand - xBand) * Math.PI * phaseSpread;
      const xScale = width * clamp01((0.38 + xBand * 0.52 + rms * 0.18) * gain);
      const yScale = height * clamp01((0.38 + yBand * 0.52 + rms * 0.18) * gain);
      const offset = (trailUnit - 0.5) * phaseSpread;
      g.globalAlpha = 0.16 + (1 - trailUnit) * 0.58;
      g.lineWidth = Math.max(0.8, Math.min(ctx.width, ctx.height) * (0.004 + (1 - trailUnit) * 0.006));
      g.beginPath();
      for (let index = 0; index <= samples; index += 1) {
        const unit = index / samples;
        const theta = unit * TAU;
        const x = centerX + Math.sin(theta * xFrequency + phase + offset) * xScale;
        const y = centerY + Math.sin(theta * yFrequency + phase * 2 + audioPhase - offset) * yScale;
        if (index === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.restore();

    g.save();
    g.fillStyle = signal;
    g.globalAlpha = 0.45 + rms * 0.45;
    g.shadowColor = signal;
    g.shadowBlur = 12;
    const headX = centerX + Math.sin(phase * xFrequency + phase) * width * (0.46 + bands[1] * 0.4);
    const headY = centerY + Math.sin(phase * yFrequency + phase * 2 + (bands[6] - bands[1]) * Math.PI * phaseSpread) * height * (0.46 + bands[6] * 0.4);
    g.beginPath();
    g.arc(headX, headY, Math.max(2, Math.min(ctx.width, ctx.height) * (0.008 + rms * 0.012)), 0, TAU);
    g.fill();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
