const t=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface TrailParticle {
  age: number;
  spread: number;
  scale: number;
  alpha: number;
}

interface TrailState {
  phase: number;
  particles: TrailParticle[];
}

const TAU = Math.PI * 2;

const pathPoint = (phase: number) => ({
  x: 0.5 + Math.sin(phase * 2) * 0.32,
  y: 0.5 + Math.sin(phase * 3 + Math.PI / 2) * 0.28,
});

const stateful: CanvasStatefulKernel<TrailState> = {
  init: (ctx) => {
    const count = Math.min(160, Math.max(24, Math.round(Number(ctx.params.count ?? 96))));
    return {
      phase: 0,
      particles: Array.from({ length: count }, (_, index) => ({
        age: index / count,
        spread: ctx.random(\`t:\${index}:spread\`) * 2 - 1,
        scale: 0.5 + ctx.random(\`t:\${index}:scale\`) * 1.15,
        alpha: 0.45 + ctx.random(\`t:\${index}:alpha\`) * 0.52,
      })),
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      phase: (state.phase + (TAU * speed) / duration) % TAU,
      particles: state.particles,
    };
  },
  render: (g, state, ctx) => {
    const trail = Math.min(0.8, Math.max(0.1, Number(ctx.params.trail ?? 0.46)));
    const size = Math.min(7, Math.max(1, Number(ctx.params.size ?? 3)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2.8;
    for (const particle of state.particles) {
      const lag = particle.age * trail * TAU;
      const phase = state.phase - lag;
      const point = pathPoint(phase);
      const tangent = pathPoint(phase + 0.008);
      const dx = (tangent.x - point.x) * ctx.width;
      const dy = (tangent.y - point.y) * ctx.height;
      const magnitude = Math.max(0.001, Math.hypot(dx, dy));
      const spread = particle.spread * size * 2.4 * Math.sin(particle.age * Math.PI);
      const x = point.x * ctx.width - (dy / magnitude) * spread;
      const y = point.y * ctx.height + (dx / magnitude) * spread;
      const fade = (1 - particle.age) ** 1.4;
      g.globalAlpha = particle.alpha * fade;
      g.beginPath();
      g.arc(x, y, Math.max(0.7, size * particle.scale * (0.28 + fade * 0.72)), 0, TAU);
      g.fill();
    }

    const emitter = pathPoint(state.phase);
    g.globalAlpha = 1;
    g.beginPath();
    g.arc(emitter.x * ctx.width, emitter.y * ctx.height, size * 1.8, 0, TAU);
    g.fill();
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{t as default};
