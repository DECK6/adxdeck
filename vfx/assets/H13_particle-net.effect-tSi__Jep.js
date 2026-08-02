const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const count = Math.min(54, Math.max(18, Math.round(Number(ctx.params.count ?? 34))));
    const reach = Math.min(150, Math.max(50, Number(ctx.params.reach ?? 94)));
    const drift = Math.min(1.5, Math.max(0.2, Number(ctx.params.drift ?? 0.75)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const points = Array.from({ length: count }, (_, index) => {
      const baseX = ctx.random(\`net:\${index}:x\`) * ctx.width;
      const baseY = ctx.random(\`net:\${index}:y\`) * ctx.height;
      const orbit = (7 + ctx.random(\`net:\${index}:orbit\`) * 18) * drift;
      const cycles = 1 + Math.floor(ctx.random(\`net:\${index}:cycles\`) * 2);
      const offset = ctx.random(\`net:\${index}:phase\`) * TAU;
      return {
        x: (baseX + Math.cos(phase * cycles + offset) * orbit + ctx.width) % ctx.width,
        y: (baseY + Math.sin(phase * cycles + offset) * orbit * 0.72 + ctx.height) % ctx.height,
        radius: 1.1 + ctx.random(\`net:\${index}:radius\`) * 1.8,
      };
    });

    g.fillStyle = '#081116';
    g.fillRect(0, 0, ctx.width, ctx.height);
    const glow = g.createRadialGradient(ctx.width * 0.5, ctx.height * 0.5, 0, ctx.width * 0.5, ctx.height * 0.5, ctx.width * 0.65);
    glow.addColorStop(0, \`\${signal}12\`);
    glow.addColorStop(1, 'transparent');
    g.fillStyle = glow;
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.save();
    g.strokeStyle = signal;
    g.lineWidth = 0.75;
    for (let a = 0; a < points.length; a += 1) {
      for (let b = a + 1; b < points.length; b += 1) {
        const dx = points[a].x - points[b].x;
        const dy = points[a].y - points[b].y;
        const distance = Math.hypot(dx, dy);
        if (distance >= reach) continue;
        g.globalAlpha = (1 - distance / reach) * 0.34;
        g.beginPath();
        g.moveTo(points[a].x, points[a].y);
        g.lineTo(points[b].x, points[b].y);
        g.stroke();
      }
    }
    g.fillStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = 6;
    for (const point of points) {
      g.globalAlpha = 0.48;
      g.beginPath();
      g.arc(point.x, point.y, point.radius, 0, TAU);
      g.fill();
    }
    g.restore();

    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.24;
      const insetX = ctx.width * 0.16;
      const insetY = ctx.height * 0.16;
      g.drawImage(ctx.subject.bitmap, insetX, insetY, ctx.width - insetX * 2, ctx.height - insetY * 2);
      g.restore();
    }
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
