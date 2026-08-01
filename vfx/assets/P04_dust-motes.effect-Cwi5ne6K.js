const n=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Mote {
  anchorX: number;
  anchorY: number;
  radiusX: number;
  radiusY: number;
  phase: number;
  phaseOffset: number;
  cycles: number;
  scale: number;
  alpha: number;
}

interface DustState {
  motes: Mote[];
}

const TAU = Math.PI * 2;

const stateful: CanvasStatefulKernel<DustState> = {
  init: (ctx) => {
    const count = Math.min(96, Math.max(16, Math.round(Number(ctx.params.count ?? 52))));
    return {
      motes: Array.from({ length: count }, (_, index) => ({
        anchorX: ctx.random(\`m:\${index}:x\`),
        anchorY: ctx.random(\`m:\${index}:y\`),
        radiusX: 0.018 + ctx.random(\`m:\${index}:rx\`) * 0.055,
        radiusY: 0.012 + ctx.random(\`m:\${index}:ry\`) * 0.045,
        phase: ctx.random(\`m:\${index}:phase\`) * TAU,
        phaseOffset: ctx.random(\`m:\${index}:offset\`) * TAU,
        cycles: 1 + Math.floor(ctx.random(\`m:\${index}:cycles\`) * 2),
        scale: 0.45 + ctx.random(\`m:\${index}:scale\`) * 1.15,
        alpha: 0.22 + ctx.random(\`m:\${index}:alpha\`) * 0.56,
      })),
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    return {
      motes: state.motes.map((mote) => ({
        ...mote,
        phase: mote.phase + (TAU * mote.cycles) / duration,
      })),
    };
  },
  render: (g, state, ctx) => {
    const drift = Math.min(1.5, Math.max(0.2, Number(ctx.params.drift ?? 0.65)));
    const size = Math.min(4, Math.max(0.5, Number(ctx.params.size ?? 1.8)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2.2;
    for (const mote of state.motes) {
      const x = (mote.anchorX + Math.sin(mote.phase) * mote.radiusX * drift + 1) % 1;
      const y = (mote.anchorY + Math.cos(mote.phase + mote.phaseOffset) * mote.radiusY * drift + 1) % 1;
      const shimmer = 0.62 + 0.38 * Math.sin(mote.phase * 2 + mote.phaseOffset);
      g.globalAlpha = mote.alpha * shimmer;
      g.beginPath();
      g.arc(x * ctx.width, y * ctx.height, size * mote.scale, 0, TAU);
      g.fill();
    }
    g.restore();
  },
};

const kernel = {
  kind: 'canvas',
  stateful,
} satisfies FxKernel;

export default kernel;
`;export{n as default};
