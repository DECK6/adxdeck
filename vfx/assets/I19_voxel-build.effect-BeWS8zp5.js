const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const u = clamp01(value);
  return u * u * (3 - 2 * u);
};

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const grid = Math.max(5, Math.min(11, Math.round(Number(ctx.params.grid ?? 9)) | 1));
    const dropHeight = Number(ctx.params.height ?? 0.45) * ctx.height;
    const depth = Number(ctx.params.depth ?? 10);
    const stagger = Number(ctx.params.stagger ?? 0.54);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const u = ((ctx.t % 1) + 1) % 1;
    const assembly = u < 0.1 ? 0 : u < 0.48 ? smooth((u - 0.1) / 0.38) : u < 0.72 ? 1 : u < 0.98 ? smooth((0.98 - u) / 0.26) : 0;
    const side = Math.min(ctx.width, ctx.height) * 0.62;
    const cell = side / grid;
    const left = (ctx.width - side) / 2;
    const top = (ctx.height - side) / 2;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    const glow = g.createRadialGradient(ctx.width / 2, ctx.height / 2, 0, ctx.width / 2, ctx.height / 2, side * 0.72);
    glow.addColorStop(0, \`\${signal}18\`);
    glow.addColorStop(1, '#0D0E1000');
    g.fillStyle = glow;
    g.fillRect(0, 0, ctx.width, ctx.height);

    const bitmap = ctx.subject.bitmap;
    for (let row = grid - 1; row >= 0; row -= 1) {
      for (let column = 0; column < grid; column += 1) {
        const index = row * grid + column;
        const order = (row + column + ctx.random(\`voxel:\${index}:order\`) * grid * 0.8) / (grid * 2.8);
        const progress = smooth((assembly - order * stagger) / Math.max(0.05, 1 - order * stagger));
        if (progress <= 0.002) continue;
        const fall = (1 - progress) * dropHeight * (0.65 + ctx.random(\`voxel:\${index}:height\`) * 0.7);
        const bounce = Math.sin(progress * Math.PI * 3) * (1 - progress) * cell * 0.28;
        const x = left + column * cell;
        const y = top + row * cell - fall - bounce;
        const d = depth * progress;

        g.globalAlpha = progress;
        g.fillStyle = \`\${signal}2E\`;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + d, y - d);
        g.lineTo(x + cell + d, y - d);
        g.lineTo(x + cell, y);
        g.closePath();
        g.fill();
        g.fillStyle = '#10272C';
        g.beginPath();
        g.moveTo(x + cell, y);
        g.lineTo(x + cell + d, y - d);
        g.lineTo(x + cell + d, y + cell - d);
        g.lineTo(x + cell, y + cell);
        g.closePath();
        g.fill();

        if (bitmap) {
          const sourceW = bitmap.width / grid;
          const sourceH = bitmap.height / grid;
          g.drawImage(bitmap, column * sourceW, row * sourceH, sourceW, sourceH, x, y, cell + 0.5, cell + 0.5);
        } else {
          g.fillStyle = '#182026';
          g.fillRect(x, y, cell, cell);
        }
        g.strokeStyle = \`\${signal}88\`;
        g.lineWidth = Math.max(0.75, cell * 0.025);
        g.strokeRect(x, y, cell, cell);
      }
    }
    g.globalAlpha = 1;
    g.fillStyle = signal;
    g.font = \`\${Math.max(10, Math.min(ctx.width, ctx.height) * 0.018)}px monospace\`;
    g.fillText(\`VOXEL ASSEMBLY \${Math.round(assembly * 100).toString().padStart(3, '0')}%\`, ctx.width * 0.06, ctx.height * 0.93);
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
