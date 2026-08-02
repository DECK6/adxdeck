const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const count = Math.min(180, Math.max(36, Math.round(Number(ctx.params.stars ?? 112))));
    const twinkle = Math.min(1, Math.max(0.1, Number(ctx.params.twinkle ?? 0.72)));
    const meteorCount = Math.min(3, Math.max(0, Math.round(Number(ctx.params.meteors ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const sky = g.createLinearGradient(0, 0, 0, ctx.height);
    sky.addColorStop(0, '#05070B');
    sky.addColorStop(0.62, '#0D0E10');
    sky.addColorStop(1, \`\${signal}12\`);
    g.fillStyle = sky;
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.52;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    for (let index = 0; index < count; index += 1) {
      const x = ctx.random(\`star:\${index}:x\`) * ctx.width;
      const y = ctx.random(\`star:\${index}:y\`) * ctx.height * 0.9;
      const radius = 0.45 + ctx.random(\`star:\${index}:size\`) * 1.65;
      const frequency = 1 + Math.floor(ctx.random(\`star:\${index}:frequency\`) * 4);
      const phase = ctx.random(\`star:\${index}:phase\`) * Math.PI * 2;
      const pulse = 0.5 + 0.5 * Math.sin(Math.PI * 2 * frequency * ctx.t + phase);
      const alpha = (0.18 + pulse * twinkle * 0.82) * (0.55 + radius * 0.24);
      g.save();
      g.translate(x, y);
      g.globalAlpha = Math.min(1, alpha);
      g.fillStyle = signal;
      g.shadowColor = signal;
      g.shadowBlur = radius * (2 + pulse * 5);
      g.beginPath();
      g.arc(0, 0, radius, 0, Math.PI * 2);
      g.fill();
      if (radius > 1.45 && pulse > 0.62) {
        g.globalAlpha *= pulse * 0.55;
        g.fillRect(-radius * 4, -0.35, radius * 8, 0.7);
        g.fillRect(-0.35, -radius * 4, 0.7, radius * 8);
      }
      g.restore();
    }

    for (let index = 0; index < meteorCount; index += 1) {
      const cycle = (ctx.t + ctx.random(\`meteor:\${index}:phase\`)) % 1;
      if (cycle > 0.14) continue;
      const u = cycle / 0.14;
      const startX = ctx.width * (0.22 + ctx.random(\`meteor:\${index}:x\`) * 0.72);
      const startY = ctx.height * (0.06 + ctx.random(\`meteor:\${index}:y\`) * 0.32);
      const length = ctx.width * (0.1 + ctx.random(\`meteor:\${index}:length\`) * 0.16);
      const x = startX - u * length;
      const y = startY + u * length * 0.38;
      const alpha = Math.sin(Math.PI * u);
      const gradient = g.createLinearGradient(x, y, x + length, y - length * 0.38);
      gradient.addColorStop(0, \`\${signal}00\`);
      gradient.addColorStop(0.8, signal);
      gradient.addColorStop(1, '#FFFFFF');
      g.save();
      g.globalAlpha = alpha;
      g.strokeStyle = gradient;
      g.lineWidth = 1.5;
      g.shadowColor = signal;
      g.shadowBlur = 8;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + length, y - length * 0.38);
      g.stroke();
      g.restore();
    }
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
