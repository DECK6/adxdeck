const n=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Confetto {
  x: number;
  y: number;
  speed: number;
  drift: number;
  angle: number;
  spin: number;
  scale: number;
  cycle: number;
  pale: boolean;
}

interface ConfettiState {
  particles: Confetto[];
}

const TAU = Math.PI * 2;

const stateful: CanvasStatefulKernel<ConfettiState> = {
  init: (ctx): ConfettiState => {
    const count = Math.min(220, Math.max(24, Math.round(Number(ctx.params.count ?? 110))));
    return {
      particles: Array.from({ length: count }, (_, index) => ({
        x: ctx.random(\`c:\${index}:x\`) * ctx.width,
        y: (ctx.random(\`c:\${index}:y\`) * 1.2 - 0.1) * ctx.height,
        speed: 0.65 + ctx.random(\`c:\${index}:speed\`) * 0.85,
        drift: ctx.random(\`c:\${index}:drift\`) * TAU,
        angle: ctx.random(\`c:\${index}:angle\`) * TAU,
        spin: (ctx.random(\`c:\${index}:spin\`) * 2 - 1) * 3.2,
        scale: 0.55 + ctx.random(\`c:\${index}:scale\`) * 0.9,
        cycle: 0,
        pale: ctx.random(\`c:\${index}:color\`) > 0.72,
      })),
    };
  },
  step: (state, ctx): ConfettiState => {
    const dt = 1 / ctx.fps;
    const speed = Math.min(2, Math.max(0.3, Number(ctx.params.speed ?? 0.9)));
    const wind = Math.min(1, Math.max(-1, Number(ctx.params.wind ?? 0.18)));
    const margin = ctx.height * 0.1;

    return {
      particles: state.particles.map((particle, index) => {
        let x = particle.x + (wind * ctx.width * 0.065 + Math.sin(particle.drift + ctx.frame * 0.065) * 13) * dt;
        let y = particle.y + ctx.height * 0.32 * particle.speed * speed * dt;
        let cycle = particle.cycle;
        if (y > ctx.height + margin) {
          cycle += 1;
          y = -margin;
          x = ctx.random(\`c:\${index}:cycle:\${cycle}:x\`) * ctx.width;
        }
        if (x < -margin) x += ctx.width + margin * 2;
        if (x > ctx.width + margin) x -= ctx.width + margin * 2;
        return { ...particle, x, y, angle: particle.angle + particle.spin * dt, cycle };
      }),
    };
  },
  render: (g, state, ctx) => {
    const size = Math.min(12, Math.max(2, Number(ctx.params.size ?? 6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    for (const particle of state.particles) {
      const flutter = 0.18 + Math.abs(Math.cos(particle.angle)) * 0.82;
      g.save();
      g.translate(particle.x, particle.y);
      g.rotate(particle.angle);
      g.globalAlpha = 0.5 + flutter * 0.5;
      g.fillStyle = particle.pale ? 'rgba(255,255,255,0.92)' : signal;
      g.fillRect(-size * particle.scale * 0.5, -size * 0.28, size * particle.scale, size * 0.56 * flutter);
      g.restore();
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
