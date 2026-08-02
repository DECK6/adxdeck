const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const stars = Math.min(420, Math.max(80, Math.round(Number(ctx.params.stars ?? 260))));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const spread = Math.min(1.4, Math.max(0.4, Number(ctx.params.spread ?? 0.92)));
    const trail = Math.min(0.18, Math.max(0.01, Number(ctx.params.trail ?? 0.075)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const centerX = ctx.width / 2;
    const centerY = ctx.height / 2;
    const focal = Math.min(ctx.width, ctx.height) * 0.24;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.08;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    g.save();
    g.strokeStyle = signal;
    g.fillStyle = signal;
    g.lineCap = 'round';
    g.shadowColor = signal;
    g.shadowBlur = Math.max(2, Math.min(ctx.width, ctx.height) * 0.012);
    for (let index = 0; index < stars; index += 1) {
      const baseX = (ctx.random(\`star:\${index}:x\`) * 2 - 1) * spread;
      const baseY = (ctx.random(\`star:\${index}:y\`) * 2 - 1) * spread;
      const startZ = ctx.random(\`star:\${index}:z\`);
      const wrapped = ((startZ - ctx.t * speed) % 1 + 1) % 1;
      const z = 0.055 + wrapped * 0.945;
      const previousZ = Math.min(1, z + trail * speed);
      const x = centerX + (baseX / z) * focal;
      const y = centerY + (baseY / z) * focal;
      const previousX = centerX + (baseX / previousZ) * focal;
      const previousY = centerY + (baseY / previousZ) * focal;
      const visible = x > -20 && x < ctx.width + 20 && y > -20 && y < ctx.height + 20;
      if (!visible) continue;
      const intensity = 1 - wrapped;
      g.globalAlpha = 0.18 + intensity * 0.82;
      g.lineWidth = 0.45 + intensity * 2.4;
      g.beginPath();
      g.moveTo(previousX, previousY);
      g.lineTo(x, y);
      g.stroke();
      g.beginPath();
      g.arc(x, y, 0.45 + intensity * 1.55, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
