const e=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Ember {
  x: number;
  y: number;
  phase: number;
  swayCycles: number;
  scale: number;
  alpha: number;
}

interface EmberState {
  embers: Ember[];
}

const TAU = Math.PI * 2;

const stateful: CanvasStatefulKernel<EmberState> = {
  init: (ctx) => {
    const count = Math.min(160, Math.max(24, Math.round(Number(ctx.params.count ?? 82))));
    return {
      embers: Array.from({ length: count }, (_, index) => ({
        x: 0.12 + ctx.random(\`e:\${index}:x\`) * 0.76,
        y: ctx.random(\`e:\${index}:y\`),
        phase: ctx.random(\`e:\${index}:phase\`) * TAU,
        swayCycles: 1 + Math.floor(ctx.random(\`e:\${index}:cycles\`) * 3),
        scale: 0.45 + ctx.random(\`e:\${index}:scale\`) * 1.2,
        alpha: 0.38 + ctx.random(\`e:\${index}:alpha\`) * 0.6,
      })),
    };
  },
  step: (state, ctx) => {
    const duration = Math.max(1, ctx.durationInFrames);
    const lift = Math.min(3, Math.max(1, Math.round(Number(ctx.params.lift ?? 2))));
    return {
      embers: state.embers.map((ember) => ({
        ...ember,
        y: (ember.y - lift / duration + 1) % 1,
        phase: (ember.phase + (TAU * ember.swayCycles) / duration) % TAU,
      })),
    };
  },
  render: (g, state, ctx) => {
    const turbulence = Math.min(1, Math.max(0, Number(ctx.params.turbulence ?? 0.58)));
    const size = Math.min(6, Math.max(1, Number(ctx.params.size ?? 2.7)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);

    g.save();
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = size * 3.2;
    for (const ember of state.embers) {
      const edgeFade = Math.min(1, ember.y * 7, (1 - ember.y) * 7);
      const sway = Math.sin(ember.phase) * (0.018 + turbulence * 0.052);
      const flicker = 0.78 + 0.22 * Math.sin(ember.phase * 3 + ember.y * TAU);
      const x = (ember.x + sway + 1) % 1;
      const radius = size * ember.scale * flicker;
      g.globalAlpha = ember.alpha * Math.max(0, edgeFade);
      g.beginPath();
      g.ellipse(x * ctx.width, (0.93 - ember.y * 0.86) * ctx.height, radius * 0.7, radius * 1.8, sway * 8, 0, TAU);
      g.fill();
    }
    g.restore();
  },
};

const kernel = { kind: 'canvas', stateful } satisfies FxKernel;

export default kernel;
`;export{e as default};
