const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const rows = Math.round(Number(ctx.params.rows ?? 30));
    const drift = Number(ctx.params.drift ?? 54);
    const dropout = Number(ctx.params.dropout ?? 0.28);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2;
    g.fillStyle = '#0D0E10'; g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;
    const sourceH = ctx.subject.bitmap.height;
    const sourceW = ctx.subject.bitmap.width;
    const rowH = ctx.height / rows;
    g.imageSmoothingEnabled = false;
    for (let row = 0; row < rows; row += 1) {
      const gate = ctx.random(\`drop:\${row}\`);
      const wave = Math.sin(phase * (1 + row % 3 * 0.25) + row * 1.71);
      const lost = gate < dropout * (0.45 + 0.55 * (wave + 1) * 0.5);
      const x = wave * drift * (0.25 + ctx.random(\`x:\${row}\`) * 0.75);
      const fall = lost ? ((ctx.t + ctx.random(\`fall:\${row}\`)) % 1) * ctx.height * 0.32 : 0;
      const sy = row * sourceH / rows;
      g.globalAlpha = lost ? 0.18 + ctx.random(\`a:\${row}\`) * 0.42 : 0.96;
      g.drawImage(ctx.subject.bitmap, 0, sy, sourceW, sourceH / rows + 1, x, row * rowH + fall, ctx.width, rowH + 1);
      if (lost) {
        g.fillStyle = signal;
        g.globalAlpha = 0.12 + Math.abs(wave) * 0.22;
        g.fillRect(Math.max(0, x), row * rowH + fall, ctx.width * (0.08 + gate * 0.24), Math.max(1, rowH * 0.22));
      }
    }
    g.globalAlpha = 1;
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
