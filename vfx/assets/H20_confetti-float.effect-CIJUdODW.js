const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const count = Math.max(18, Math.round(Number(ctx.params.count ?? 42)));
    const drift = Number(ctx.params.drift ?? 1);
    const size = Number(ctx.params.size ?? 7);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * TAU;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    const wash = g.createRadialGradient(ctx.width * 0.5, ctx.height * 0.46, 0, ctx.width * 0.5, ctx.height * 0.46, ctx.width * 0.62);
    wash.addColorStop(0, \`\${signal}18\`);
    wash.addColorStop(1, '#0D0E1000');
    g.fillStyle = wash;
    g.fillRect(0, 0, ctx.width, ctx.height);

    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.26;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    for (let index = 0; index < count; index += 1) {
      const baseX = ctx.random(\`float:\${index}:x\`) * ctx.width;
      const baseY = ctx.random(\`float:\${index}:y\`) * ctx.height;
      const orbit = (10 + ctx.random(\`float:\${index}:orbit\`) * 32) * drift;
      const phaseOffset = ctx.random(\`float:\${index}:phase\`) * TAU;
      const rate = 1 + Math.floor(ctx.random(\`float:\${index}:rate\`) * 3);
      const x = baseX + Math.sin(phase * rate + phaseOffset) * orbit;
      const y = baseY + Math.cos(phase * rate + phaseOffset) * orbit * 0.58;
      const angle = phase * (index % 2 === 0 ? 2 : -2) + phaseOffset;
      const scale = 0.55 + ctx.random(\`float:\${index}:scale\`) * 0.9;
      const flutter = 0.22 + Math.abs(Math.cos(angle)) * 0.78;

      g.save();
      g.translate(x, y);
      g.rotate(angle);
      g.globalAlpha = 0.35 + ctx.random(\`float:\${index}:alpha\`) * 0.5;
      g.fillStyle = index % 5 === 0 ? '#F7FAFC' : signal;
      if (index % 3 === 0) {
        g.beginPath();
        g.moveTo(0, -size * scale);
        g.lineTo(size * scale * 0.82, size * scale * 0.6);
        g.lineTo(-size * scale * 0.82, size * scale * 0.6);
        g.closePath();
        g.fill();
      } else {
        g.fillRect(-size * scale * 0.5, -size * flutter * 0.3, size * scale, size * flutter * 0.6);
      }
      g.restore();
    }
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
