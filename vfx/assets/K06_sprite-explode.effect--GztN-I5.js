const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const blockSize = Math.min(20, Math.max(5, Math.round(Number(ctx.params.blockSize ?? 10))));
    const spread = Math.min(1, Math.max(0.15, Number(ctx.params.spread ?? 0.62)));
    const arc = Math.min(1, Math.max(0, Number(ctx.params.arc ?? 0.55)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = Math.min(1, Math.max(0, ctx.t));
    const explode = Math.sin(progress * Math.PI) ** 2;
    const columns = Math.ceil(ctx.width / blockSize);
    const rows = Math.ceil(ctx.height / blockSize);
    const centerX = ctx.width * 0.5;
    const centerY = ctx.height * 0.5;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!ctx.subject.bitmap) return;

    g.save();
    g.beginPath();
    g.rect(0, 0, ctx.width, ctx.height);
    g.clip();
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const sourceX = column * blockSize;
        const sourceY = row * blockSize;
        const width = Math.min(blockSize, ctx.width - sourceX);
        const height = Math.min(blockSize, ctx.height - sourceY);
        const dx = sourceX + width * 0.5 - centerX;
        const dy = sourceY + height * 0.5 - centerY;
        const direction = Math.atan2(dy, dx) + (ctx.random(\`sprite:\${index}:angle\`) - 0.5) * 0.72;
        const velocity = (0.35 + ctx.random(\`sprite:\${index}:speed\`) * 0.65) * spread * Math.min(ctx.width, ctx.height);
        const stepped = Math.floor(explode * 12) / 12;
        const moveX = Math.cos(direction) * velocity * stepped;
        const lift = -Math.sin(Math.PI * explode) * arc * ctx.height * (0.08 + ctx.random(\`sprite:\${index}:lift\`) * 0.16);
        const moveY = Math.sin(direction) * velocity * stepped + lift;
        const quarterTurn = Math.floor((ctx.random(\`sprite:\${index}:spin\`) * 2 - 1) * explode * 4) * (Math.PI / 2);

        g.save();
        g.translate(sourceX + width * 0.5 + moveX, sourceY + height * 0.5 + moveY);
        g.rotate(quarterTurn);
        g.imageSmoothingEnabled = false;
        g.drawImage(ctx.subject.bitmap, sourceX, sourceY, width, height, -width * 0.5, -height * 0.5, width, height);
        if (explode > 0.04 && ctx.random(\`sprite:\${index}:edge\`) > 0.72) {
          g.globalAlpha = explode * 0.65;
          g.strokeStyle = signal;
          g.lineWidth = 1;
          g.strokeRect(-width * 0.5 + 0.5, -height * 0.5 + 0.5, width - 1, height - 1);
        }
        g.restore();
      }
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
