const n=`import type { CanvasStatefulKernel, FxContext, FxKernel } from '../../src/fx/types';

interface CrystalTip {
  x: number;
  y: number;
  angle: number;
  depth: number;
  energy: number;
}

interface CrystalSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
}

interface CrystalState {
  tips: CrystalTip[];
  segments: CrystalSegment[];
  serial: number;
}

function createCrystal(ctx: FxContext): CrystalState {
  const arms = 6;
  return {
    segments: [],
    serial: 0,
    tips: Array.from({ length: arms }, (_, index) => ({
      x: ctx.width * 0.5,
      y: ctx.height * 0.5,
      angle: (index / arms) * Math.PI * 2 + (ctx.random(\`crystal:arm:\${index}\`) - 0.5) * 0.14,
      depth: 0,
      energy: 0.72 + ctx.random(\`crystal:energy:\${index}\`) * 0.28,
    })),
  };
}

function growOnce(state: CrystalState, ctx: FxContext): CrystalState {
  if (state.tips.length === 0 || state.segments.length >= 720) return state;
  const branching = Math.min(0.55, Math.max(0.05, Number(ctx.params.branching ?? 0.24)));
  const spread = Math.min(0.7, Math.max(0.08, Number(ctx.params.spread ?? 0.34)));
  const tipIndex = state.serial % state.tips.length;
  const tip = state.tips[tipIndex];
  const key = \`crystal:\${state.serial}\`;
  const turn = (ctx.random(\`\${key}:turn\`) - 0.5) * spread;
  const angle = tip.angle + turn;
  const length = Math.min(ctx.width, ctx.height) * (0.012 + ctx.random(\`\${key}:length\`) * 0.012);
  const x2 = tip.x + Math.cos(angle) * length;
  const y2 = tip.y + Math.sin(angle) * length;
  const inside = x2 > ctx.width * 0.06 && x2 < ctx.width * 0.94 && y2 > ctx.height * 0.08 && y2 < ctx.height * 0.92;
  const nextEnergy = tip.energy - 0.018 - ctx.random(\`\${key}:decay\`) * 0.014;
  const tips = [...state.tips];
  if (!inside || nextEnergy <= 0) tips.splice(tipIndex, 1);
  else tips[tipIndex] = { x: x2, y: y2, angle, depth: tip.depth + 1, energy: nextEnergy };

  if (inside && nextEnergy > 0.16 && ctx.random(\`\${key}:branch\`) < branching) {
    const side = ctx.random(\`\${key}:side\`) < 0.5 ? -1 : 1;
    tips.push({
      x: x2,
      y: y2,
      angle: angle + side * (0.48 + ctx.random(\`\${key}:fork\`) * 0.7),
      depth: tip.depth + 1,
      energy: nextEnergy * (0.64 + ctx.random(\`\${key}:branch-energy\`) * 0.2),
    });
  }
  return {
    tips,
    segments: inside ? [...state.segments, { x1: tip.x, y1: tip.y, x2, y2, depth: tip.depth }] : state.segments,
    serial: state.serial + 1,
  };
}

const stateful: CanvasStatefulKernel<CrystalState> = {
  init: createCrystal,
  step: (state, ctx) => {
    if (ctx.frame > 0 && ctx.frame % ctx.durationInFrames === 0) return createCrystal(ctx);
    const growth = Math.min(2, Math.max(0.4, Number(ctx.params.growth ?? 1)));
    const additions = Math.max(1, Math.round(growth * 3));
    let next = state;
    for (let index = 0; index < additions; index += 1) next = growOnce(next, ctx);
    return next;
  },
  render: (g, state, ctx) => {
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.58;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = Math.max(3, ctx.width * 0.008);
    g.lineCap = 'round';
    for (const segment of state.segments) {
      g.globalAlpha = Math.max(0.34, 0.96 - segment.depth * 0.012);
      g.lineWidth = Math.max(0.75, 2.8 - segment.depth * 0.035);
      g.beginPath();
      g.moveTo(segment.x1, segment.y1);
      g.lineTo(segment.x2, segment.y2);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.beginPath();
    g.arc(ctx.width * 0.5, ctx.height * 0.5, Math.max(2, ctx.width * 0.009), 0, Math.PI * 2);
    g.fill();
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{n as default};
