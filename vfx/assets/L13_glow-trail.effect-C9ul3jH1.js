const t=`import type { CanvasStatefulKernel, FxContext, FxKernel } from '../../src/fx/types';

interface TrailPoint {
  x: number;
  y: number;
}

interface TrailState {
  points: TrailPoint[];
}

const TAU = Math.PI * 2;

function pointAt(frame: number, ctx: FxContext): TrailPoint {
  const duration = Math.max(1, ctx.durationInFrames);
  const wrapped = ((frame % duration) + duration) % duration;
  const phase = (wrapped / duration) * TAU;
  const radius = Math.min(0.18, Math.max(0, Number(ctx.params.radius ?? 0.08)));
  return {
    x: Math.cos(phase) * ctx.width * radius,
    y: Math.sin(phase * 2) * ctx.height * radius * 0.58,
  };
}

const stateful: CanvasStatefulKernel<TrailState> = {
  init: (ctx): TrailState => {
    const trailLength = Math.min(36, Math.max(4, Math.round(Number(ctx.params.trailLength ?? 20))));
    return {
      points: Array.from({ length: trailLength }, (_, index) => pointAt(index - trailLength, ctx)),
    };
  },
  step: (state, ctx): TrailState => {
    const trailLength = Math.min(36, Math.max(4, Math.round(Number(ctx.params.trailLength ?? 20))));
    return { points: [...state.points, pointAt(ctx.frame, ctx)].slice(-trailLength) };
  },
  render: (g, state, ctx) => {
    const glow = Math.min(30, Math.max(0, Number(ctx.params.glow ?? 16)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;

    g.save();
    g.globalCompositeOperation = 'screen';
    g.shadowColor = signal;
    g.shadowBlur = glow;
    for (let index = 0; index < state.points.length; index += 1) {
      const point = state.points[index];
      const age = (index + 1) / state.points.length;
      g.globalAlpha = age * age * 0.24;
      g.drawImage(ctx.subject.bitmap, point.x, point.y, ctx.width, ctx.height);
    }
    g.restore();

    const current = state.points[state.points.length - 1] ?? pointAt(ctx.frame, ctx);
    g.save();
    g.shadowColor = signal;
    g.shadowBlur = glow * 0.7;
    g.drawImage(ctx.subject.bitmap, current.x, current.y, ctx.width, ctx.height);
    g.restore();
  },
};

const kernel = {
  kind: 'canvas',
  stateful,
} satisfies FxKernel;

export default kernel;
`;export{t as default};
