const t=`import type { FxKernel } from '../../src/fx/types';

interface Point { x: number; y: number }

const TAU = Math.PI * 2;

function pathPolygon(g: CanvasRenderingContext2D, points: Point[]): void {
  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) g.lineTo(points[index].x, points[index].y);
  g.closePath();
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const tileSize = Math.min(64, Math.max(24, Math.round(Number(ctx.params.tileSize ?? 40))));
    const irregularity = Math.min(0.38, Math.max(0, Number(ctx.params.irregularity ?? 0.18)));
    const grout = Math.min(7, Math.max(1, Number(ctx.params.grout ?? 3)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const columns = Math.ceil(ctx.width / tileSize);
    const rows = Math.ceil(ctx.height / tileSize);

    let subjectPixels: ImageData | undefined;
    if (ctx.subject.bitmap) {
      g.clearRect(0, 0, ctx.width, ctx.height);
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      subjectPixels = g.getImageData(0, 0, ctx.width, ctx.height);
    }

    const vertex = (column: number, row: number): Point => {
      const boundaryX = column === 0 || column === columns;
      const boundaryY = row === 0 || row === rows;
      const jitter = tileSize * irregularity;
      return {
        x: Math.min(ctx.width, column * tileSize) + (boundaryX ? 0 : (ctx.random(\`mosaic:v:\${column}:\${row}:x\`) - 0.5) * jitter),
        y: Math.min(ctx.height, row * tileSize) + (boundaryY ? 0 : (ctx.random(\`mosaic:v:\${column}:\${row}:y\`) - 0.5) * jitter),
      };
    };

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const points = [vertex(column, row), vertex(column + 1, row), vertex(column + 1, row + 1), vertex(column, row + 1)];
        const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
        const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
        const key = \`mosaic:\${column}:\${row}\`;
        const wave = Math.sin(phase + column * 0.72 + row * 0.48 + ctx.random(\`\${key}:phase\`) * 0.8);
        const lift = wave * irregularity * 2.5;
        const angle = wave * irregularity * 0.018;
        const sampleX = Math.min(ctx.width - 1, Math.max(0, Math.round(centerX)));
        const sampleY = Math.min(ctx.height - 1, Math.max(0, Math.round(centerY)));
        const offset = (sampleY * ctx.width + sampleX) * 4;
        const luma = subjectPixels
          ? (subjectPixels.data[offset] * 0.2126 + subjectPixels.data[offset + 1] * 0.7152 + subjectPixels.data[offset + 2] * 0.0722) / 255
          : 0.35;

        g.save();
        g.translate(centerX + lift, centerY - lift * 0.45);
        g.rotate(angle);
        g.translate(-centerX, -centerY);
        pathPolygon(g, points);
        g.clip();
        if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
        g.globalCompositeOperation = 'screen';
        g.globalAlpha = 0.04 + (1 - luma) * 0.12 + Math.max(0, wave) * 0.07;
        g.fillStyle = signal;
        g.fillRect(centerX - tileSize, centerY - tileSize, tileSize * 2, tileSize * 2);
        g.restore();

        g.save();
        g.translate(centerX + lift, centerY - lift * 0.45);
        g.rotate(angle);
        g.translate(-centerX, -centerY);
        pathPolygon(g, points);
        g.strokeStyle = '#08090B';
        g.lineWidth = grout;
        g.lineJoin = 'round';
        g.shadowColor = signal;
        g.shadowBlur = Math.max(0, wave) * 4;
        g.stroke();
        g.globalAlpha = 0.18 + Math.max(0, wave) * 0.18;
        g.strokeStyle = signal;
        g.lineWidth = Math.max(0.5, grout * 0.22);
        g.stroke();
        g.restore();
      }
    }
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
