const n=`import type { FxKernel } from '../../src/fx/types';

type MirrorAxis = 'vertical' | 'horizontal' | 'quad';

const TAU = Math.PI * 2;

function drawVerticalFold(
  g: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  width: number,
  height: number,
  offset: number,
): void {
  g.save();
  g.beginPath();
  g.rect(0, 0, width / 2, height);
  g.clip();
  g.drawImage(bitmap, offset, 0, width, height);
  g.restore();

  g.save();
  g.beginPath();
  g.rect(width / 2, 0, width / 2, height);
  g.clip();
  g.translate(width, 0);
  g.scale(-1, 1);
  g.drawImage(bitmap, offset, 0, width, height);
  g.restore();
}

function drawHorizontalFold(
  g: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  width: number,
  height: number,
  offset: number,
): void {
  g.save();
  g.beginPath();
  g.rect(0, 0, width, height / 2);
  g.clip();
  g.drawImage(bitmap, 0, offset, width, height);
  g.restore();

  g.save();
  g.beginPath();
  g.rect(0, height / 2, width, height / 2);
  g.clip();
  g.translate(0, height);
  g.scale(1, -1);
  g.drawImage(bitmap, 0, offset, width, height);
  g.restore();
}

function drawQuadFold(
  g: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
): void {
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      g.save();
      g.beginPath();
      g.rect((column * width) / 2, (row * height) / 2, width / 2, height / 2);
      g.clip();
      g.translate(column === 0 ? 0 : width, row === 0 ? 0 : height);
      g.scale(column === 0 ? 1 : -1, row === 0 ? 1 : -1);
      g.drawImage(bitmap, offsetX, offsetY, width, height);
      g.restore();
    }
  }
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const axisValue = String(ctx.params.axis ?? 'vertical');
    const axis: MirrorAxis = axisValue === 'horizontal' || axisValue === 'quad' ? axisValue : 'vertical';
    const depth = Math.min(1, Math.max(0, Number(ctx.params.depth ?? 0.55)));
    const seam = Math.min(8, Math.max(0, Number(ctx.params.seam ?? 2)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bitmap = ctx.subject.bitmap;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (!bitmap) return;

    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * TAU;
    const pulse = Math.sin(phase) * depth;
    const offsetX = pulse * ctx.width * 0.08;
    const offsetY = pulse * ctx.height * 0.08;

    if (axis === 'vertical') drawVerticalFold(g, bitmap, ctx.width, ctx.height, offsetX);
    else if (axis === 'horizontal') drawHorizontalFold(g, bitmap, ctx.width, ctx.height, offsetY);
    else drawQuadFold(g, bitmap, ctx.width, ctx.height, offsetX, offsetY);

    if (seam === 0) return;
    g.save();
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = seam * 2.5;
    g.globalAlpha = 0.32 + depth * 0.28;
    g.lineWidth = seam;
    g.beginPath();
    if (axis !== 'horizontal') {
      g.moveTo(ctx.width / 2, 0);
      g.lineTo(ctx.width / 2, ctx.height);
    }
    if (axis !== 'vertical') {
      g.moveTo(0, ctx.height / 2);
      g.lineTo(ctx.width, ctx.height / 2);
    }
    g.stroke();
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
