const t=`import type { CanvasStatefulKernel, FxContext, FxKernel } from '../../src/fx/types';

interface Point {
  x: number;
  y: number;
}

interface FlowParticle extends Point {
  phase: number;
  weight: number;
  path: Point[];
}

interface FlowState {
  particles: FlowParticle[];
}

function createFlow(ctx: FxContext): FlowState {
  const count = Math.min(180, Math.max(36, Math.round(Number(ctx.params.count ?? 110))));
  return {
    particles: Array.from({ length: count }, (_, index) => {
      const x = ctx.random(\`flow:\${index}:x\`) * ctx.width;
      const y = ctx.random(\`flow:\${index}:y\`) * ctx.height;
      return {
        x,
        y,
        phase: ctx.random(\`flow:\${index}:phase\`) * Math.PI * 2,
        weight: 0.55 + ctx.random(\`flow:\${index}:weight\`) * 1.45,
        path: [{ x, y }],
      };
    }),
  };
}

const stateful: CanvasStatefulKernel<FlowState> = {
  init: createFlow,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createFlow(ctx);
    const scale = Math.min(8, Math.max(1, Number(ctx.params.scale ?? 4.2)));
    const speed = Math.min(140, Math.max(20, Number(ctx.params.speed ?? 72)));
    const trail = Math.min(28, Math.max(4, Math.round(Number(ctx.params.trail ?? 16))));
    const time = (ctx.frame / ctx.durationInFrames) * Math.PI * 2;
    const dt = 1 / ctx.fps;

    return {
      particles: state.particles.map((particle) => {
        const nx = particle.x / ctx.width;
        const ny = particle.y / ctx.height;
        const angle = Math.sin((ny * scale + Math.sin(time)) * Math.PI)
          + Math.cos((nx * scale - Math.cos(time)) * Math.PI)
          + Math.sin((nx + ny) * Math.PI * scale + particle.phase + time) * 0.65;
        let x = particle.x + Math.cos(angle * Math.PI) * speed * particle.weight * dt;
        let y = particle.y + Math.sin(angle * Math.PI) * speed * particle.weight * dt;
        const wrapped = x < 0 || x >= ctx.width || y < 0 || y >= ctx.height;
        x = (x + ctx.width) % ctx.width;
        y = (y + ctx.height) % ctx.height;
        const path = wrapped ? [{ x, y }] : [...particle.path, { x, y }].slice(-trail);
        return { ...particle, x, y, path };
      }),
    };
  },
  render: (g, state, ctx) => {
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.42;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.shadowColor = signal;
    g.shadowBlur = Math.max(1, ctx.width * 0.004);
    for (const particle of state.particles) {
      if (particle.path.length < 2) continue;
      g.globalAlpha = 0.26 + particle.weight * 0.25;
      g.lineWidth = particle.weight;
      g.beginPath();
      g.moveTo(particle.path[0].x, particle.path[0].y);
      for (let index = 1; index < particle.path.length; index += 1) {
        g.lineTo(particle.path[index].x, particle.path[index].y);
      }
      g.stroke();
    }
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{t as default};
