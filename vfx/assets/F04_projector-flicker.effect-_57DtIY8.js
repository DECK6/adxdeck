const t=`import type { FxKernel } from '../../src/fx/types';

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  alpha: number;
}

interface ProjectorState {
  age: number;
  dust: DustParticle[];
}

const kernel = {
  kind: 'canvas',
  stateful: {
    init: (ctx): ProjectorState => {
      const count = Math.min(42, Math.max(8, Math.round(Number(ctx.params.dust ?? 24))));
      const duration = Math.max(1, ctx.durationInFrames);
      return {
        age: 0,
        dust: Array.from({ length: count }, (_, index) => ({
          x: ctx.random(\`dust:\${index}:x\`),
          y: ctx.random(\`dust:\${index}:y\`),
          radius: 0.7 + ctx.random(\`dust:\${index}:radius\`) * 2.4,
          speed: (1 + Math.floor(ctx.random(\`dust:\${index}:speed\`) * 3)) / duration,
          drift: (Math.floor(ctx.random(\`dust:\${index}:drift\`) * 3) - 1) / duration,
          alpha: 0.18 + ctx.random(\`dust:\${index}:alpha\`) * 0.56,
        })),
      };
    },
    step: (state: ProjectorState): ProjectorState => ({
      age: state.age + 1,
      dust: state.dust.map((particle) => ({
        ...particle,
        x: (particle.x + particle.drift + 1) % 1,
        y: (particle.y + particle.speed) % 1,
      })),
    }),
    render: (g, state: ProjectorState, ctx) => {
      const flicker = Math.min(1, Math.max(0, Number(ctx.params.flicker ?? 0.48)));
      const weave = Math.min(1, Math.max(0, Number(ctx.params.weave ?? 0.56)));
      const scratchCount = Math.min(6, Math.max(0, Math.round(Number(ctx.params.scratches ?? 3))));
      const signal = String(ctx.params.signal ?? '#5EE7F3');
      const phase = ctx.t * Math.PI * 2;
      const frameNoise = ctx.random(\`projector:flicker:\${ctx.frame}\`);
      const brightness = 0.82 + (frameNoise - 0.5) * flicker * 0.46 + Math.sin(phase * 12) * flicker * 0.045;
      const gateX = weave * (Math.sin(phase * 2) * 8.2 + Math.sin(phase * 7) * 2.4);
      const gateY = weave * (Math.cos(phase * 3) * 6.4 + Math.sin(phase * 11) * 1.8);
      const gateRotation = weave * Math.sin(phase * 5) * 0.0055;
      const overscan = 12;

      g.fillStyle = '#0D0E10';
      g.fillRect(0, 0, ctx.width, ctx.height);
      g.save();
      g.translate(ctx.width / 2 + gateX, ctx.height / 2 + gateY);
      g.rotate(gateRotation);
      g.filter = \`brightness(\${brightness}) contrast(\${1.06 + flicker * 0.16}) saturate(\${0.76 + flicker * 0.12})\`;
      if (ctx.subject.bitmap) {
        g.drawImage(ctx.subject.bitmap, -ctx.width / 2 - overscan, -ctx.height / 2 - overscan, ctx.width + overscan * 2, ctx.height + overscan * 2);
      }
      g.restore();

      g.save();
      g.globalCompositeOperation = 'screen';
      g.globalAlpha = 0.035 + flicker * 0.055;
      g.fillStyle = signal;
      g.fillRect(0, 0, ctx.width, ctx.height);
      g.restore();

      g.save();
      for (const particle of state.dust) {
        const shimmer = 0.55 + 0.45 * Math.sin(phase * (1 + Math.round(particle.radius)) + particle.x * 19 + particle.y * 11);
        g.globalAlpha = particle.alpha * shimmer;
        g.fillStyle = particle.radius > 2.15 ? signal : '#F4F1DF';
        g.beginPath();
        g.arc(particle.x * ctx.width, particle.y * ctx.height, particle.radius, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();

      g.save();
      g.lineWidth = 0.7;
      for (let index = 0; index < scratchCount; index += 1) {
        const visible = ctx.random(\`scratch:\${Math.floor(ctx.frame / 5)}:\${index}:visible\`);
        if (visible < 0.38) continue;
        const x = ctx.random(\`scratch:\${index}:x\`) * ctx.width;
        const bend = (ctx.random(\`scratch:\${index}:bend\`) - 0.5) * ctx.width * 0.025;
        g.globalAlpha = 0.12 + visible * 0.28;
        g.strokeStyle = index === 0 ? signal : '#F2EEE1';
        g.beginPath();
        g.moveTo(x, -8);
        g.bezierCurveTo(x + bend, ctx.height * 0.28, x - bend, ctx.height * 0.7, x + bend * 0.4, ctx.height + 8);
        g.stroke();
      }
      g.restore();

      g.save();
      const vignette = g.createRadialGradient(ctx.width * 0.5, ctx.height * 0.48, Math.min(ctx.width, ctx.height) * 0.16, ctx.width * 0.5, ctx.height * 0.5, Math.max(ctx.width, ctx.height) * 0.68);
      vignette.addColorStop(0, 'rgba(13, 14, 16, 0)');
      vignette.addColorStop(0.7, 'rgba(13, 14, 16, 0.12)');
      vignette.addColorStop(1, 'rgba(13, 14, 16, 0.82)');
      g.fillStyle = vignette;
      g.fillRect(0, 0, ctx.width, ctx.height);
      g.strokeStyle = \`\${signal}66\`;
      g.lineWidth = 1;
      g.strokeRect(8 + gateX, 8 + gateY, ctx.width - 16, ctx.height - 16);
      g.restore();
    },
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
