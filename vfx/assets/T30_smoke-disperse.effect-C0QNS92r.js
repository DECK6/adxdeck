const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const particles = Math.max(40, Math.min(500, Math.round(Number(ctx.params.particles ?? 240))));
    const drift = Number(ctx.params.drift ?? 0.75);
    const softness = Number(ctx.params.softness ?? 0.62);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const disperse = Math.pow(Math.sin(phase * Math.PI), 1.35);
    const phrase = (ctx.subject.label || 'DEXA').toUpperCase();
    const fontSize = Math.max(38, Math.min(ctx.width * 0.18, ctx.height * 0.34));

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.1 + (1 - disperse) * 0.08;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = \`800 \${fontSize}px JetBrains Mono, monospace\`;
    g.fillStyle = signal;
    g.globalAlpha = 0.92 - disperse * 0.78;
    g.shadowColor = signal;
    g.shadowBlur = 9 + softness * 12;
    g.fillText(phrase, ctx.width / 2, ctx.height / 2);
    g.restore();

    g.save();
    g.globalCompositeOperation = 'screen';
    for (let index = 0; index < particles; index += 1) {
      const seedX = ctx.random(\`smoke:\${index}:x\`);
      const seedY = ctx.random(\`smoke:\${index}:y\`);
      const direction = ctx.random(\`smoke:\${index}:direction\`) * 2 - 1;
      const lift = 0.35 + ctx.random(\`smoke:\${index}:lift\`) * 0.9;
      const baseX = ctx.width * (0.18 + seedX * 0.64);
      const baseY = ctx.height * 0.5 + (seedY - 0.5) * fontSize * 0.75;
      const curl = Math.sin(phase * Math.PI * 2 + index * 1.73) * ctx.width * 0.025 * drift;
      const x = baseX + direction * disperse * ctx.width * (0.04 + ctx.random(\`smoke:\${index}:reach\`) * 0.22) * drift + curl * disperse;
      const y = baseY - disperse * ctx.height * 0.3 * lift * drift + Math.sin(index * 0.91 + phase * Math.PI * 4) * fontSize * 0.08 * disperse;
      const radius = (1.2 + ctx.random(\`smoke:\${index}:size\`) * 5.8) * (0.45 + softness) * (0.55 + disperse);
      const alpha = disperse * (0.035 + ctx.random(\`smoke:\${index}:alpha\`) * 0.18) * (1 - Math.abs(seedX - 0.5) * 0.35);
      g.globalAlpha = alpha;
      g.fillStyle = index % 5 === 0 ? signal : '#A9BDC1';
      g.shadowColor = index % 5 === 0 ? signal : '#8FA3A8';
      g.shadowBlur = radius * (1 + softness * 2.4);
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
