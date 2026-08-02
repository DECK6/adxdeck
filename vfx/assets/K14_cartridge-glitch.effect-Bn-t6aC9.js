const t=`import type { FxKernel } from '../../src/fx/types';

function colorToRgb(value: unknown): [number, number, number] {
  const hex = String(value ?? '#5EE7F3').replace('#', '');
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : '5EE7F3';
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16)) as [number, number, number];
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const tileSize = Math.max(4, Math.round(Number(ctx.params.tileSize ?? 12) / 2) * 2);
    const corruption = Math.min(1, Math.max(0, Number(ctx.params.corruption ?? 0.58)));
    const hold = Math.max(2, Math.round(Number(ctx.params.hold ?? 6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const signalRgb = colorToRgb(signal);
    const tick = Math.floor(ctx.frame / hold);
    const width = Math.max(1, Math.floor(ctx.width));
    const height = Math.max(1, Math.floor(ctx.height));

    g.clearRect(0, 0, width, height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, width, height);
    const input = g.getImageData(0, 0, width, height);
    const output = g.createImageData(width, height);
    const columns = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);

    for (let y = 0; y < height; y += 1) {
      const tileY = Math.floor(y / tileSize);
      for (let x = 0; x < width; x += 1) {
        const tileX = Math.floor(x / tileSize);
        const tileIndex = tileY * columns + tileX;
        const active = ctx.random(\`contact:\${tick}:\${tileIndex}\`) < corruption * 0.62;
        const bank = Math.floor(ctx.random(\`bank:\${tick}:\${tileY}\`) * 4);
        const shiftTiles = active ? Math.floor(ctx.random(\`shift:\${tick}:\${tileIndex}\`) * 7) - 3 : 0;
        const sourceTileX = (tileX + shiftTiles + columns) % columns;
        const sourceX = Math.min(width - 1, sourceTileX * tileSize + (x % tileSize));
        const sourceY = active && bank === 3 ? Math.min(height - 1, ((tileY + 1) % rows) * tileSize + (y % tileSize)) : y;
        const sourceOffset = (sourceY * width + sourceX) * 4;
        const targetOffset = (y * width + x) * 4;
        const alpha = input.data[sourceOffset + 3] / 255;
        const background = [13, 14, 16];
        for (let channel = 0; channel < 3; channel += 1) {
          let value = input.data[sourceOffset + channel] * alpha + background[channel] * (1 - alpha);
          if (active) {
            const contamination = bank === channel ? 0.48 : bank === 3 ? 0.22 : 0.08;
            value = value * (1 - contamination) + signalRgb[channel] * contamination;
            value = Math.round(value / 32) * 32;
          }
          output.data[targetOffset + channel] = Math.min(255, Math.max(0, value));
        }
        output.data[targetOffset + 3] = 255;
      }
    }

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, width, height);
    g.putImageData(output, 0, 0);
    g.save();
    g.globalAlpha = 0.2 + corruption * 0.24;
    g.fillStyle = '#0D0E10';
    for (let y = tileSize; y < height; y += tileSize) g.fillRect(0, y, width, 1);
    for (let x = tileSize; x < width; x += tileSize) g.fillRect(x, 0, 1, height);
    const contactY = ((ctx.t * 6) % 1) * height;
    g.globalAlpha = 0.58;
    g.fillStyle = signal;
    g.fillRect(0, contactY, width, Math.max(1, tileSize * 0.16));
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
