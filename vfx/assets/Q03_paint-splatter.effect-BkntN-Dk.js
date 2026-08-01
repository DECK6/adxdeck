const n=`import type { CanvasStatefulKernel, FxContext, FxKernel } from '../../src/fx/types';

interface PaintDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  delay: number;
  life: number;
  radius: number;
  alpha: number;
}

interface SplatterState {
  drops: PaintDrop[];
}

function createSplatter(ctx: FxContext): SplatterState {
  const count = Math.min(120, Math.max(24, Math.round(Number(ctx.params.drops ?? 68))));
  const spread = Math.min(1.6, Math.max(0.4, Number(ctx.params.spread ?? 1)));
  return {
    drops: Array.from({ length: count }, (_, index) => {
      const angle = ctx.random(\`paint:\${index}:angle\`) * Math.PI * 2;
      const velocity = (55 + ctx.random(\`paint:\${index}:velocity\`) * 190) * spread;
      return {
        x: ctx.width * 0.5,
        y: ctx.height * 0.5,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        age: 0,
        delay: ctx.random(\`paint:\${index}:delay\`) * 4.8,
        life: 0.7 + ctx.random(\`paint:\${index}:life\`) * 1.15,
        radius: 1.5 + ctx.random(\`paint:\${index}:radius\`) * 7,
        alpha: 0.55 + ctx.random(\`paint:\${index}:alpha\`) * 0.45,
      };
    }),
  };
}

const stateful: CanvasStatefulKernel<SplatterState> = {
  init: createSplatter,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createSplatter(ctx);
    const dt = 1 / ctx.fps;
    const gravity = Math.min(2, Math.max(0, Number(ctx.params.gravity ?? 0.8))) * ctx.height * 0.34;
    return {
      drops: state.drops.map((drop) => {
        const age = drop.age + dt;
        if (age <= drop.delay || age > drop.delay + drop.life) return { ...drop, age };
        const drag = 0.985;
        const vx = drop.vx * drag;
        const vy = drop.vy * drag + gravity * dt;
        return {
          ...drop,
          age,
          x: drop.x + vx * dt,
          y: drop.y + vy * dt,
          vx,
          vy,
        };
      }),
    };
  },
  render: (g, state, ctx) => {
    const size = Math.min(2, Math.max(0.5, Number(ctx.params.size ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.62;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, ctx.width * 0.006);
    const centerPulse = 0.86 + 0.14 * Math.sin(ctx.t * Math.PI * 12);
    g.globalAlpha = 0.5;
    for (let index = 0; index < 9; index += 1) {
      const angle = (index / 9) * Math.PI * 2;
      const radius = (8 + (index % 3) * 5) * size * centerPulse;
      g.beginPath();
      g.arc(
        ctx.width * 0.5 + Math.cos(angle) * radius * 0.8,
        ctx.height * 0.5 + Math.sin(angle) * radius * 0.55,
        radius,
        0,
        Math.PI * 2,
      );
      g.fill();
    }

    for (const drop of state.drops) {
      const localAge = drop.age - drop.delay;
      if (localAge < 0 || localAge > drop.life) continue;
      const life = localAge / drop.life;
      const radius = drop.radius * size * (1 - life * 0.42);
      g.globalAlpha = drop.alpha * Math.sin(life * Math.PI);
      g.beginPath();
      g.ellipse(drop.x, drop.y, Math.max(0.7, radius * (1 + life)), Math.max(0.7, radius), Math.atan2(drop.vy, drop.vx), 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{n as default};
