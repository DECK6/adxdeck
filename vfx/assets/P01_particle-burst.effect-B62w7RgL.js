const t=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  alpha: number;
}

interface BurstState {
  particles: Particle[];
}

const stateful: CanvasStatefulKernel<BurstState> = {
  init: (ctx): BurstState => {
    const count = Math.min(300, Math.max(20, Math.round(Number(ctx.params.count ?? 120))));
    const particles = Array.from({ length: count }, (_, i) => {
      const angle = ctx.random(\`p:\${i}:angle\`) * Math.PI * 2;
      const speed = 55 + ctx.random(\`p:\${i}:speed\`) * 175;
      return {
        x: ctx.width / 2,
        y: ctx.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: 0.45 + ctx.random(\`p:\${i}:scale\`) * 0.85,
        alpha: 0.48 + ctx.random(\`p:\${i}:alpha\`) * 0.52,
      };
    });
    return { particles };
  },
  step: (state: BurstState, ctx): BurstState => {
    const dt = 1 / ctx.fps;
    const gravity = Number(ctx.params.gravity ?? 0.65) * ctx.height * 0.18;
    const drag = Math.min(0.2, Math.max(0, Number(ctx.params.drag ?? 0.025)));
    const damping = Math.pow(1 - drag, dt * 30);

    return {
      particles: state.particles.map((particle) => {
        const vx = particle.vx * damping;
        const vy = (particle.vy + gravity * dt) * damping;
        return {
          ...particle,
          x: particle.x + vx * dt,
          y: particle.y + vy * dt,
          vx,
          vy,
          alpha: particle.alpha * 0.992,
        };
      }),
    };
  },
  render: (g, state: BurstState, ctx) => {
    const size = Math.min(6, Math.max(1, Number(ctx.params.size ?? 2.8)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 2.5;
    for (const particle of state.particles) {
      g.globalAlpha = particle.alpha;
      g.beginPath();
      g.arc(particle.x, particle.y, size * particle.scale, 0, Math.PI * 2);
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
`;export{t as default};
