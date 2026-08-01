const n=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Orbiter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number;
  scale: number;
  alpha: number;
}

interface FieldState {
  particles: Orbiter[];
}

const TAU = Math.PI * 2;

const stateful: CanvasStatefulKernel<FieldState> = {
  init: (ctx) => {
    const count = Math.min(180, Math.max(32, Math.round(Number(ctx.params.count ?? 108))));
    const radius = Math.min(ctx.width, ctx.height) * 0.22;
    return {
      particles: Array.from({ length: count }, (_, index) => {
        const angle = ctx.random(\`orbit:\${index}:angle\`) * TAU;
        const shell = radius * (0.34 + ctx.random(\`orbit:\${index}:shell\`) * 0.86);
        const direction = index % 2 === 0 ? 1 : -1;
        const tangent = 22 + ctx.random(\`orbit:\${index}:speed\`) * 42;
        return {
          x: ctx.width * 0.5 + Math.cos(angle) * shell,
          y: ctx.height * 0.5 + Math.sin(angle) * shell * 0.72,
          vx: -Math.sin(angle) * tangent * direction,
          vy: Math.cos(angle) * tangent * direction,
          charge: direction,
          scale: 0.5 + ctx.random(\`orbit:\${index}:scale\`) * 1.1,
          alpha: 0.45 + ctx.random(\`orbit:\${index}:alpha\`) * 0.52,
        };
      }),
    };
  },
  step: (state, ctx) => {
    const dt = 1 / Math.max(1, ctx.fps);
    const force = Math.min(2, Math.max(0.2, Number(ctx.params.force ?? 0.92)));
    const separation = Math.min(0.55, Math.max(0.15, Number(ctx.params.separation ?? 0.34)));
    const poles = [ctx.width * (0.5 - separation * 0.5), ctx.width * (0.5 + separation * 0.5)];
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;
    const scale = Math.min(ctx.width, ctx.height);

    return {
      particles: state.particles.map((particle) => {
        let ax = 0;
        let ay = 0;
        for (let pole = 0; pole < 2; pole += 1) {
          const dx = poles[pole] - particle.x;
          const dy = centerY - particle.y;
          const distanceSquared = Math.max(scale * scale * 0.0025, dx * dx + dy * dy);
          const distance = Math.sqrt(distanceSquared);
          const poleCharge = pole === 0 ? 1 : -1;
          const polarity = poleCharge * particle.charge;
          const magnitude = (-polarity * force * scale * scale * 0.34) / distanceSquared;
          ax += (dx / distance) * magnitude;
          ay += (dy / distance) * magnitude;
        }
        const centerDx = centerX - particle.x;
        const centerDy = centerY - particle.y;
        ax += centerDx * 0.38 + centerDy * 0.34 * particle.charge;
        ay += centerDy * 0.38 - centerDx * 0.34 * particle.charge;
        const damping = Math.pow(0.975, dt * 30);
        const vx = (particle.vx + ax * dt) * damping;
        const vy = (particle.vy + ay * dt) * damping;
        return { ...particle, x: particle.x + vx * dt, y: particle.y + vy * dt, vx, vy };
      }),
    };
  },
  render: (g, state, ctx) => {
    const separation = Math.min(0.55, Math.max(0.15, Number(ctx.params.separation ?? 0.34)));
    const size = Math.min(6, Math.max(1, Number(ctx.params.size ?? 2.8)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const centerY = ctx.height * 0.5;
    const poleX = [ctx.width * (0.5 - separation * 0.5), ctx.width * (0.5 + separation * 0.5)];

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = 12;
    for (let pole = 0; pole < 2; pole += 1) {
      g.globalAlpha = 0.75;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(poleX[pole], centerY, size * 4.2, 0, TAU);
      g.stroke();
      g.globalAlpha = 0.22;
      g.beginPath();
      g.arc(poleX[pole], centerY, size * 8.5, 0, TAU);
      g.stroke();
    }
    for (const particle of state.particles) {
      g.globalAlpha = particle.alpha;
      g.beginPath();
      g.arc(particle.x, particle.y, size * particle.scale, 0, TAU);
      g.fill();
    }
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{n as default};
