const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const density = Math.min(84, Math.max(18, Math.round(Number(ctx.params.density ?? 46))));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const trail = Math.min(74, Math.max(12, Number(ctx.params.trail ?? 42)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.72;
      g.filter = \`blur(\${Math.max(1, ctx.width * 0.004)}px)\`;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    const haze = g.createLinearGradient(0, 0, 0, ctx.height);
    haze.addColorStop(0, '#0D0E1008');
    haze.addColorStop(0.65, \`\${signal}0D\`);
    haze.addColorStop(1, \`\${signal}1F\`);
    g.fillStyle = haze;
    g.fillRect(0, 0, ctx.width, ctx.height);

    g.save();
    g.lineCap = 'round';
    for (let index = 0; index < density; index += 1) {
      const fallCycles = 1 + Math.floor(ctx.random(\`glass:\${index}:cycles\`) * 3);
      const progress = (ctx.random(\`glass:\${index}:phase\`) + ctx.t * speed * fallCycles) % 1;
      const baseX = ctx.random(\`glass:\${index}:x\`);
      const bendPhase = ctx.random(\`glass:\${index}:bend\`) * Math.PI * 2;
      const scale = 0.45 + ctx.random(\`glass:\${index}:scale\`) * 1.45;
      const x = (baseX + Math.sin(progress * Math.PI * 2 + bendPhase) * 0.018 * scale + 1) % 1;
      const y = -0.08 + progress * 1.18;
      const length = trail * scale * (0.55 + progress * 0.7);
      const endX = x * ctx.width;
      const endY = y * ctx.height;
      const startX = endX - Math.sin(progress * Math.PI * 3 + bendPhase) * ctx.width * 0.012 * scale;
      const width = Math.max(1, scale * 2.2);

      g.globalAlpha = 0.08 + scale * 0.055;
      g.strokeStyle = signal;
      g.lineWidth = width * 2.8;
      g.beginPath();
      g.moveTo(startX, endY - length);
      g.bezierCurveTo(startX + width * 2, endY - length * 0.68, endX - width * 2, endY - length * 0.28, endX, endY);
      g.stroke();

      g.globalAlpha = 0.3 + Math.min(0.4, scale * 0.16);
      g.lineWidth = Math.max(0.7, width * 0.42);
      g.beginPath();
      g.moveTo(startX, endY - length);
      g.bezierCurveTo(startX + width * 2, endY - length * 0.68, endX - width * 2, endY - length * 0.28, endX, endY);
      g.stroke();

      const beadRadius = Math.max(1.6, width * 1.15);
      const bead = g.createRadialGradient(endX - beadRadius * 0.35, endY - beadRadius * 0.45, 0, endX, endY, beadRadius);
      bead.addColorStop(0, '#FFFFFFCC');
      bead.addColorStop(0.2, \`\${signal}88\`);
      bead.addColorStop(0.72, '#0D0E1033');
      bead.addColorStop(1, \`\${signal}11\`);
      g.globalAlpha = 0.74;
      g.fillStyle = bead;
      g.beginPath();
      g.ellipse(endX, endY, beadRadius * 0.72, beadRadius * 1.18, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    g.save();
    g.globalAlpha = 0.17;
    g.strokeStyle = signal;
    g.lineWidth = 1;
    for (let index = 0; index < 6; index += 1) {
      const y = ctx.height * (0.12 + index * 0.15);
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(ctx.width, y + Math.sin(index * 1.7) * 3);
      g.stroke();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
