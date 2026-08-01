const e=`import type { CanvasStatefulKernel, FxContext, FxKernel } from '../../src/fx/types';

interface FoamBubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  target: number;
  age: number;
  lifetime: number;
  vx: number;
  vy: number;
  alpha: number;
}

interface FoamPop {
  x: number;
  y: number;
  radius: number;
  age: number;
}

interface FoamState {
  bubbles: FoamBubble[];
  pops: FoamPop[];
}

function createFoam(ctx: FxContext): FoamState {
  const count = Math.min(72, Math.max(18, Math.round(Number(ctx.params.count ?? 46))));
  const scale = Math.min(ctx.width, ctx.height);
  return {
    pops: [],
    bubbles: Array.from({ length: count }, (_, index) => {
      const angle = ctx.random(\`foam:\${index}:angle\`) * Math.PI * 2;
      const distance = Math.sqrt(ctx.random(\`foam:\${index}:distance\`)) * scale * 0.27;
      return {
        id: index,
        x: ctx.width * 0.5 + Math.cos(angle) * distance,
        y: ctx.height * 0.52 + Math.sin(angle) * distance * 0.62,
        radius: 0.4,
        target: scale * (0.018 + ctx.random(\`foam:\${index}:size\`) * 0.06),
        age: -Math.floor(ctx.random(\`foam:\${index}:delay\`) * ctx.durationInFrames * 0.38),
        lifetime: ctx.durationInFrames * (0.48 + ctx.random(\`foam:\${index}:life\`) * 0.46),
        vx: (ctx.random(\`foam:\${index}:vx\`) - 0.5) * scale * 0.035,
        vy: -(0.006 + ctx.random(\`foam:\${index}:vy\`) * 0.018) * scale,
        alpha: 0.5 + ctx.random(\`foam:\${index}:alpha\`) * 0.45,
      };
    }),
  };
}

const stateful: CanvasStatefulKernel<FoamState> = {
  init: createFoam,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createFoam(ctx);
    const growth = Math.min(2, Math.max(0.4, Number(ctx.params.growth ?? 1)));
    const merge = Math.min(1, Math.max(0, Number(ctx.params.merge ?? 0.42)));
    const dt = 1 / Math.max(1, ctx.fps);
    const popped: FoamPop[] = state.pops
      .map((pop) => ({ ...pop, age: pop.age + 1 }))
      .filter((pop) => pop.age < ctx.fps * 0.35);
    const active: FoamBubble[] = [];
    for (const bubble of state.bubbles) {
      const age = bubble.age + 1;
      if (age > bubble.lifetime) {
        if (bubble.age <= bubble.lifetime && bubble.radius > 1) popped.push({ x: bubble.x, y: bubble.y, radius: bubble.radius, age: 0 });
        continue;
      }
      if (age <= 0) {
        active.push({ ...bubble, age });
        continue;
      }
      const radius = Math.min(bubble.target, bubble.radius + bubble.target * growth * dt * 0.72);
      const drift = (ctx.random(\`foam:\${ctx.frame}:\${bubble.id}:drift\`) - 0.5) * ctx.width * 0.006;
      active.push({
        ...bubble,
        age,
        radius,
        vx: bubble.vx * 0.98 + drift * dt,
        x: bubble.x + bubble.vx * dt,
        y: bubble.y + bubble.vy * dt,
      });
    }

    const removed = new Set<number>();
    for (let first = 0; first < active.length; first += 1) {
      if (removed.has(first) || active[first].age <= 0) continue;
      for (let second = first + 1; second < active.length; second += 1) {
        if (removed.has(second) || active[second].age <= 0) continue;
        const a = active[first];
        const b = active[second];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.max(0.001, Math.hypot(dx, dy));
        const overlap = a.radius + b.radius - distance;
        if (overlap <= 0) continue;
        const nx = dx / distance;
        const ny = dy / distance;
        const push = overlap * 0.12;
        a.x -= nx * push;
        a.y -= ny * push;
        b.x += nx * push;
        b.y += ny * push;
        const mergeChance = merge * Math.min(1, overlap / Math.max(1, Math.min(a.radius, b.radius)));
        if (ctx.random(\`foam:merge:\${ctx.frame}:\${a.id}:\${b.id}\`) < mergeChance * 0.12) {
          const keeper = a.radius >= b.radius ? a : b;
          const consumed = keeper === a ? b : a;
          const totalArea = keeper.radius * keeper.radius + consumed.radius * consumed.radius;
          keeper.radius = Math.sqrt(totalArea);
          keeper.target = Math.max(keeper.target, Math.sqrt(keeper.target * keeper.target + consumed.target * consumed.target) * 0.82);
          keeper.vx = (keeper.vx + consumed.vx) * 0.5;
          keeper.vy = Math.min(keeper.vy, consumed.vy);
          removed.add(keeper === a ? second : first);
          popped.push({ x: consumed.x, y: consumed.y, radius: consumed.radius * 0.6, age: 0 });
          break;
        }
      }
    }
    return { bubbles: active.filter((_, index) => !removed.has(index)), pops: popped };
  },
  render: (g, state, ctx) => {
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
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, ctx.width * 0.009);
    for (const bubble of state.bubbles) {
      if (bubble.age <= 0) continue;
      const fade = Math.min(1, bubble.age / Math.max(1, ctx.fps * 0.18)) * Math.min(1, (bubble.lifetime - bubble.age) / Math.max(1, ctx.fps * 0.12));
      g.globalAlpha = bubble.alpha * Math.max(0, fade);
      g.lineWidth = Math.max(0.8, bubble.radius * 0.11);
      g.beginPath();
      g.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      g.stroke();
      g.globalAlpha *= 0.52;
      g.beginPath();
      g.arc(bubble.x - bubble.radius * 0.28, bubble.y - bubble.radius * 0.3, Math.max(0.7, bubble.radius * 0.12), 0, Math.PI * 2);
      g.fill();
    }
    for (const pop of state.pops) {
      const progress = pop.age / Math.max(1, ctx.fps * 0.35);
      g.globalAlpha = (1 - progress) * 0.7;
      g.lineWidth = Math.max(0.7, pop.radius * 0.08);
      g.beginPath();
      g.arc(pop.x, pop.y, pop.radius * (1 + progress * 0.8), 0, Math.PI * 2);
      g.stroke();
    }
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{e as default};
