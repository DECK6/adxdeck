const n=`import type { CanvasStatefulKernel, FxContext, FxKernel } from '../../src/fx/types';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  phase: number;
  swayCycles: number;
  riseCycles: number;
  alpha: number;
}

interface BubbleState {
  bubbles: Bubble[];
}

const TAU = Math.PI * 2;

function makeState(ctx: FxContext): BubbleState {
  const count = Math.min(72, Math.max(18, Math.round(Number(ctx.params.count ?? 42))));
  return {
    bubbles: Array.from({ length: count }, (_, index) => ({
      x: ctx.random(\`bubble:\${index}:x\`) * 2 - 1,
      y: ctx.random(\`bubble:\${index}:y\`),
      radius: 2 + ctx.random(\`bubble:\${index}:radius\`) * 9,
      phase: ctx.random(\`bubble:\${index}:phase\`) * TAU,
      swayCycles: 1 + Math.floor(ctx.random(\`bubble:\${index}:sway\`) * 3),
      riseCycles: 1 + Math.floor(ctx.random(\`bubble:\${index}:rise\`) * 2),
      alpha: 0.22 + ctx.random(\`bubble:\${index}:alpha\`) * 0.48,
    })),
  };
}

const stateful: CanvasStatefulKernel<BubbleState> = {
  init: makeState,
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const lift = Math.min(4, Math.max(1, Math.round(Number(ctx.params.lift ?? 2))));
    return {
      bubbles: state.bubbles.map((bubble) => ({
        ...bubble,
        y: (bubble.y - (bubble.riseCycles * lift) / duration + 1) % 1,
        phase: (bubble.phase + (TAU * bubble.swayCycles) / duration) % TAU,
      })),
    };
  },
  render: (g, state, ctx) => {
    const spread = Math.min(0.7, Math.max(0.15, Number(ctx.params.spread ?? 0.4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    g.fillStyle = '#071116';
    g.fillRect(0, 0, ctx.width, ctx.height);

    const column = g.createLinearGradient(0, 0, ctx.width, 0);
    column.addColorStop(0, 'transparent');
    column.addColorStop(0.5, \`\${signal}12\`);
    column.addColorStop(1, 'transparent');
    g.fillStyle = column;
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = 7;
    for (const bubble of state.bubbles) {
      const edgeFade = Math.min(1, bubble.y * 9, (1 - bubble.y) * 9);
      const x = ctx.width * (0.5 + bubble.x * spread + Math.sin(bubble.phase) * 0.035);
      const y = bubble.y * ctx.height;
      g.globalAlpha = bubble.alpha * Math.max(0, edgeFade);
      g.lineWidth = Math.max(0.7, bubble.radius * 0.12);
      g.beginPath();
      g.arc(x, y, bubble.radius, 0, TAU);
      g.stroke();
      g.globalAlpha *= 0.72;
      g.beginPath();
      g.arc(x - bubble.radius * 0.3, y - bubble.radius * 0.3, Math.max(0.7, bubble.radius * 0.13), 0, TAU);
      g.fill();
    }
    g.restore();

    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.27;
      const insetX = ctx.width * 0.16;
      const insetY = ctx.height * 0.16;
      g.drawImage(ctx.subject.bitmap, insetX, insetY, ctx.width - insetX * 2, ctx.height - insetY * 2);
      g.restore();
    }
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{n as default};
