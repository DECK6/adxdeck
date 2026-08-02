const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const headerDepth = Math.min(0.42, Math.max(0.08, Number(ctx.params.headerDepth ?? 0.24)));
    const stripeHeight = Math.round(Math.min(18, Math.max(2, Number(ctx.params.stripeHeight ?? 7))));
    const shift = Math.min(160, Math.max(8, Number(ctx.params.shift ?? 68)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const failure = 0.5 - 0.5 * Math.cos(phase);
    const source = ctx.subject.bitmap;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (source) g.drawImage(source, 0, 0, ctx.width, ctx.height);

    const maximumDepth = ctx.height * headerDepth;
    const activeDepth = maximumDepth * (0.25 + failure * 0.75);
    const stripeCount = Math.ceil(maximumDepth / stripeHeight);
    g.save();
    g.beginPath();
    g.rect(0, 0, ctx.width, maximumDepth + stripeHeight);
    g.clip();
    for (let stripe = 0; stripe < stripeCount; stripe += 1) {
      const y = stripe * stripeHeight;
      const front = 1 - y / Math.max(1, activeDepth);
      if (front <= 0) continue;
      const direction = ctx.random(\`header:\${stripe}:direction\`) < 0.5 ? -1 : 1;
      const amount = direction * shift * front * (0.28 + ctx.random(\`header:\${stripe}:amount\`) * 0.72);
      const height = Math.min(stripeHeight, ctx.height - y);
      g.fillStyle = '#0D0E10';
      g.fillRect(0, y, ctx.width, height);
      if (source) {
        const sourceY = (y / ctx.height) * source.height;
        const sourceHeight = Math.max(1, (height / ctx.height) * source.height);
        g.globalAlpha = 0.55 + front * 0.45;
        g.drawImage(source, 0, sourceY, source.width, sourceHeight, amount, y, ctx.width, height);
      }
      if (stripe % 3 === 0) {
        g.globalAlpha = 0.12 + front * 0.32;
        g.fillStyle = signal;
        g.fillRect(Math.max(0, amount), y, Math.min(ctx.width, Math.abs(amount) + ctx.width * 0.08), Math.max(1, height * 0.22));
      }
    }
    g.restore();

    const boundaryY = activeDepth;
    g.globalAlpha = 0.55 + failure * 0.35;
    g.fillStyle = signal;
    g.fillRect(0, boundaryY, ctx.width, Math.max(1, stripeHeight * 0.28));
    g.globalAlpha = 1;

    // Rolling resync line — keeps visible motion even while the failure envelope is near zero.
    const rollY = ((ctx.t * 2) % 1) * ctx.height;
    g.globalAlpha = 0.48;
    g.fillStyle = signal;
    g.fillRect(0, rollY, ctx.width, 4);
    g.globalAlpha = 1;

    const panelWidth = Math.min(230, ctx.width * 0.58);
    g.fillStyle = '#0D0E10E8';
    g.fillRect(14, 12, panelWidth, 38);
    g.strokeStyle = signal;
    g.lineWidth = 1;
    g.strokeRect(14.5, 12.5, panelWidth - 1, 37);
    g.fillStyle = '#E9FDFF';
    g.font = 'bold 11px monospace';
    g.fillText('HEADER CRC // DECODE FAIL', 24, 28);
    g.fillStyle = signal;
    g.font = '10px monospace';
    g.fillText(\`OFFSET \${((ctx.frame * 1103) % 65536).toString(16).toUpperCase().padStart(4, '0')}\`, 24, 43);
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
