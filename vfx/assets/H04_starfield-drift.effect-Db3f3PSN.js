const t=`import type { CanvasStatefulKernel, FxKernel } from '../../src/fx/types';

interface Star {
  anchorX: number;
  anchorY: number;
  phase: number;
  phaseOffset: number;
  cycles: number;
  layer: number;
  size: number;
  alpha: number;
}

interface StarfieldState {
  stars: Star[];
}

const TAU = Math.PI * 2;

const stateful: CanvasStatefulKernel<StarfieldState> = {
  init: (ctx) => {
    const density = Math.min(132, Math.max(36, Math.round(Number(ctx.params.density ?? 82))));
    return {
      stars: Array.from({ length: density }, (_, index) => {
        const layer = index % 3;
        return {
          anchorX: ctx.random(\`star:\${index}:x\`),
          anchorY: ctx.random(\`star:\${index}:y\`),
          phase: ctx.random(\`star:\${index}:phase\`) * TAU,
          phaseOffset: ctx.random(\`star:\${index}:offset\`) * TAU,
          cycles: 1 + Math.floor(ctx.random(\`star:\${index}:cycles\`) * 2),
          layer,
          size: 0.45 + ctx.random(\`star:\${index}:size\`) * 0.85 + layer * 0.42,
          alpha: 0.24 + ctx.random(\`star:\${index}:alpha\`) * 0.42 + layer * 0.09,
        };
      }),
    };
  },
  step: (state, ctx) => ({
    stars: state.stars.map((star) => ({
      ...star,
      phase: star.phase + (TAU * star.cycles) / Math.max(1, ctx.durationInFrames),
    })),
  }),
  render: (g, state, ctx) => {
    const drift = Math.min(1.2, Math.max(0.2, Number(ctx.params.drift ?? 0.55)));
    const glow = Math.min(1, Math.max(0, Number(ctx.params.glow ?? 0.42)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.save();
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    const driftPhase = state.stars[0]?.phase ?? ctx.t * TAU;
    const hazeX = ctx.width * (0.5 + Math.sin(driftPhase * 0.61) * 0.28);
    const hazeY = ctx.height * (0.46 + Math.cos(driftPhase * 0.47) * 0.16);
    const haze = g.createRadialGradient(hazeX, hazeY, 0, hazeX, hazeY, ctx.width * 0.48);
    haze.addColorStop(0, signal);
    haze.addColorStop(1, '#0D0E10');
    g.globalAlpha = 0.14;
    g.fillStyle = haze;
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.fillStyle = signal;
    for (const star of state.stars) {
      const depth = (star.layer + 1) / 3;
      const x = (star.anchorX + Math.sin(star.phase) * 0.035 * drift * depth + 1) % 1;
      const y = (star.anchorY + Math.cos(star.phase + star.phaseOffset) * 0.022 * drift * depth + 1) % 1;
      const twinkle = 0.68 + 0.32 * Math.sin(star.phase * 2 + star.phaseOffset);
      g.globalAlpha = star.alpha * twinkle;
      g.shadowColor = signal;
      g.shadowBlur = glow * star.size * 4 * depth;
      g.beginPath();
      g.arc(x * ctx.width, y * ctx.height, star.size, 0, TAU);
      g.fill();
    }

    const cometPhase = driftPhase;
    const cometX = (0.5 + Math.sin(cometPhase) * 0.38) * ctx.width;
    const cometY = (0.24 + 0.14 * Math.cos(cometPhase * 0.73)) * ctx.height;
    const cometTrail = g.createLinearGradient(cometX - ctx.width * 0.12, cometY, cometX, cometY);
    cometTrail.addColorStop(0, 'rgba(94, 231, 243, 0)');
    cometTrail.addColorStop(1, signal);
    g.globalAlpha = 0.88;
    g.fillStyle = cometTrail;
    g.fillRect(cometX - ctx.width * 0.12, cometY - 5, ctx.width * 0.12, 10);
    g.beginPath();
    g.arc(cometX, cometY, 9, 0, TAU);
    g.fill();

    if (ctx.subject.bitmap) {
      g.globalAlpha = 0.28;
      g.shadowBlur = 0;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
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
