const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const offset = Math.min(24, Math.max(2, Number(ctx.params.offset ?? 10)));
    const dotSize = Math.min(10, Math.max(2, Math.round(Number(ctx.params.dotSize ?? 5))));
    const ink = Math.min(1, Math.max(0.2, Number(ctx.params.ink ?? 0.72)));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * speed;
    const cyanX = Math.cos(phase) * offset;
    const cyanY = Math.sin(phase * 2) * offset * 0.55;
    const pinkX = Math.cos(phase + Math.PI * 0.72) * offset;
    const pinkY = Math.sin(phase * 2 + Math.PI * 0.4) * offset * 0.7;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    if (ctx.subject.bitmap) {
      g.save();
      g.globalCompositeOperation = 'screen';
      g.globalAlpha = ink * 0.42;
      g.filter = 'grayscale(1) contrast(1.55) sepia(1) hue-rotate(125deg) saturate(5)';
      g.drawImage(ctx.subject.bitmap, cyanX, cyanY, ctx.width, ctx.height);
      g.globalAlpha = ink * 0.34;
      g.filter = 'grayscale(1) contrast(1.45) sepia(1) hue-rotate(275deg) saturate(4)';
      g.drawImage(ctx.subject.bitmap, pinkX, pinkY, ctx.width, ctx.height);
      g.globalAlpha = 0.64;
      g.filter = 'grayscale(1) contrast(1.2)';
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }

    const cols = Math.ceil(ctx.width / dotSize) + 2;
    const rows = Math.ceil(ctx.height / dotSize) + 2;
    const slide = (ctx.t * dotSize * 18 * speed) % (dotSize * 2);
    g.save();
    g.fillStyle = signal;
    for (let row = -1; row < rows; row += 1) {
      for (let col = -1; col < cols; col += 1) {
        const index = row * cols + col;
        const strength = ctx.random(\`riso:\${index}\`);
        if (strength < 0.67) continue;
        const x = col * dotSize + (row % 2) * dotSize * 0.5 + slide;
        const y = row * dotSize + Math.sin(phase + col * 0.31) * dotSize * 0.7;
        g.globalAlpha = (strength - 0.67) * ink * 0.55;
        g.beginPath();
        g.arc(x, y, dotSize * (0.12 + strength * 0.12), 0, TAU);
        g.fill();
      }
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
