const n=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Drop {
  baseX: number;
  y: number;
  fallCycles: number;
  scale: number;
  alpha: number;
}

interface RainState {
  drops: Drop[];
}

const stateful: CanvasStatefulKernel<RainState> = {
  init: (ctx) => {
    const density = Math.min(180, Math.max(24, Math.round(Number(ctx.params.density ?? 110))));
    return {
      drops: Array.from({ length: density }, (_, index) => ({
        baseX: ctx.random(\`r:\${index}:x\`),
        y: ctx.random(\`r:\${index}:y\`),
        fallCycles: 2 + Math.floor(ctx.random(\`r:\${index}:fall\`) * 4),
        scale: 0.55 + ctx.random(\`r:\${index}:scale\`) * 1.15,
        alpha: 0.26 + ctx.random(\`r:\${index}:alpha\`) * 0.58,
      })),
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    return {
      drops: state.drops.map((drop) => ({
        ...drop,
        y: (drop.y + (drop.fallCycles * speed) / duration) % 1,
      })),
    };
  },
  render: (g, state, ctx) => {
    const slant = Math.min(0.6, Math.max(-0.6, Number(ctx.params.slant ?? -0.18)));
    const length = Math.min(60, Math.max(8, Number(ctx.params.length ?? 28)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.strokeStyle = signal;
    g.lineCap = 'round';
    g.shadowColor = signal;
    g.shadowBlur = Math.max(1, ctx.width * 0.0025);
    for (const drop of state.drops) {
      const streakLength = length * drop.scale;
      const x = (drop.baseX + slant * drop.y * 0.14 + 1) % 1;
      const endX = x * ctx.width;
      const endY = drop.y * ctx.height;
      g.globalAlpha = drop.alpha;
      g.lineWidth = Math.max(0.65, drop.scale * 0.9);
      g.beginPath();
      g.moveTo(endX - slant * streakLength, endY - streakLength);
      g.lineTo(endX, endY);
      g.stroke();
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
