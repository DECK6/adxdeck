const t=`import type { FxKernel } from '../../src/fx/types';

interface SilentEraState {
  frame: number;
  dust: Array<{ originX: number; originY: number; x: number; y: number; size: number; drift: number }>;
}

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  stateful: {
    init: (ctx): SilentEraState => ({
      frame: 0,
      dust: Array.from({ length: 28 }, (_, index) => ({
        originX: ctx.random(\`dust:\${index}:x\`),
        originY: ctx.random(\`dust:\${index}:y\`),
        x: ctx.random(\`dust:\${index}:x\`),
        y: ctx.random(\`dust:\${index}:y\`),
        size: 0.7 + ctx.random(\`dust:\${index}:size\`) * 2.6,
        drift: 0.25 + ctx.random(\`dust:\${index}:drift\`) * 0.75,
      })),
    }),
    step: (state: SilentEraState, ctx): SilentEraState => {
      const loopFrame = ctx.frame % Math.max(1, ctx.durationInFrames);
      const phase = (loopFrame / Math.max(1, ctx.durationInFrames)) * TAU;
      return {
        ...state,
        frame: loopFrame,
        dust: state.dust.map((particle, index) => ({
          ...particle,
          x: (particle.originX + Math.sin(phase + index * 1.7) * particle.drift * 0.018 + 1) % 1,
          y: (particle.originY + (0.5 - Math.cos(phase + index * 0.9) * 0.5) * particle.drift * 0.08) % 1,
        })),
      };
    },
    render: (g, state: SilentEraState, ctx) => {
      const grain = Math.min(1, Math.max(0.1, Number(ctx.params.grain ?? 0.62)));
      const flicker = Math.min(1, Math.max(0, Number(ctx.params.flicker ?? 0.48)));
      const showIntertitle = Boolean(ctx.params.intertitle ?? true);
      const title = String(ctx.params.title ?? 'DEXA VFX PRESENTS');
      const signal = String(ctx.params.signal ?? '#5EE7F3');
      const phase = (state.frame / Math.max(1, ctx.durationInFrames)) * TAU;
      const weaveX = Math.sin(phase * 5) * ctx.width * 0.006 + (ctx.random(\`weave:\${state.frame}\`) - 0.5) * ctx.width * 0.008;
      const weaveY = Math.cos(phase * 4) * ctx.height * 0.004;
      const flickerValue = 0.82 + (ctx.random(\`flicker:\${state.frame}\`) - 0.5) * flicker * 0.28;
      const cardCenter = 0.5 - Math.cos(phase) * 0.5;
      const cardOpacity = showIntertitle ? Math.max(0, 1 - Math.abs(cardCenter - 0.5) * 8) : 0;

      g.fillStyle = '#0D0E10';
      g.fillRect(0, 0, ctx.width, ctx.height);
      if (ctx.subject.bitmap) {
        g.save();
        g.globalAlpha = flickerValue;
        g.filter = 'sepia(0.95) saturate(0.58) contrast(1.22) brightness(0.82)';
        g.drawImage(ctx.subject.bitmap, weaveX - ctx.width * 0.015, weaveY - ctx.height * 0.015, ctx.width * 1.03, ctx.height * 1.03);
        g.restore();
      }

      g.save();
      for (let y = 0, row = 0; y < ctx.height; y += 3, row += 1) {
        const alpha = ctx.random(\`grain:\${state.frame}:\${row}\`) * grain * 0.075;
        g.fillStyle = \`rgba(242, 218, 170, \${alpha})\`;
        g.fillRect(0, y, ctx.width, 1);
      }
      state.dust.forEach((particle, index) => {
        const visible = ctx.random(\`dust:\${state.frame}:\${index}:visible\`) > 0.38;
        if (!visible) return;
        g.globalAlpha = 0.22 + grain * 0.38;
        g.fillStyle = index % 4 === 0 ? '#1A1510' : '#E5D0A9';
        g.beginPath();
        g.arc(particle.x * ctx.width, particle.y * ctx.height, particle.size, 0, TAU);
        g.fill();
      });
      for (let scratch = 0; scratch < 3; scratch += 1) {
        const x = ctx.random(\`scratch:\${Math.floor(state.frame / 5)}:\${scratch}\`) * ctx.width;
        g.strokeStyle = scratch === 0 ? signal : '#E5D0A9';
        g.globalAlpha = scratch === 0 ? 0.18 : 0.22;
        g.lineWidth = scratch === 0 ? 1.5 : 0.7;
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x + Math.sin(phase + scratch) * 8, ctx.height);
        g.stroke();
      }
      g.restore();

      const vignette = g.createRadialGradient(ctx.width * 0.5, ctx.height * 0.48, ctx.height * 0.16, ctx.width * 0.5, ctx.height * 0.5, ctx.width * 0.68);
      vignette.addColorStop(0, 'rgba(13, 14, 16, 0)');
      vignette.addColorStop(0.72, 'rgba(13, 14, 16, 0.2)');
      vignette.addColorStop(1, 'rgba(13, 14, 16, 0.96)');
      g.fillStyle = vignette;
      g.fillRect(0, 0, ctx.width, ctx.height);

      if (cardOpacity > 0.01) {
        const cardWidth = ctx.width * 0.72;
        const cardHeight = ctx.height * 0.52;
        const left = (ctx.width - cardWidth) * 0.5;
        const top = (ctx.height - cardHeight) * 0.5;
        g.save();
        g.globalAlpha = cardOpacity;
        g.fillStyle = '#D8C5A0';
        g.fillRect(left, top, cardWidth, cardHeight);
        g.strokeStyle = '#17130F';
        g.lineWidth = Math.max(2, ctx.width * 0.003);
        g.strokeRect(left + cardWidth * 0.035, top + cardHeight * 0.065, cardWidth * 0.93, cardHeight * 0.87);
        g.strokeStyle = signal;
        g.lineWidth = Math.max(1, ctx.width * 0.0015);
        g.strokeRect(left + cardWidth * 0.055, top + cardHeight * 0.095, cardWidth * 0.89, cardHeight * 0.81);
        g.fillStyle = '#17130F';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = \`700 \${Math.max(18, ctx.width * 0.042)}px 'JetBrains Mono', monospace\`;
        g.fillText(title, ctx.width * 0.5, ctx.height * 0.47, cardWidth * 0.78);
        g.font = \`600 \${Math.max(10, ctx.width * 0.017)}px 'JetBrains Mono', monospace\`;
        g.fillText('— AN ELECTRIC PHOTOPLAY —', ctx.width * 0.5, ctx.height * 0.6, cardWidth * 0.72);
        g.restore();
      }
    },
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
