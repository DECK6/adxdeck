const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const blockSize = Math.min(24, Math.max(8, Math.round(Number(ctx.params.blockSize ?? 14))));
    const loadSpeed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.loadSpeed ?? 1))));
    const colorBands = Math.min(6, Math.max(2, Math.round(Number(ctx.params.colorBands ?? 4))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const pagePhase = (ctx.t * loadSpeed) % 1;
    const panelX = Math.round(ctx.width * 0.075);
    const panelY = Math.round(ctx.height * 0.08);
    const panelWidth = Math.round(ctx.width * 0.85);
    const panelHeight = Math.round(ctx.height * 0.84);
    const headerHeight = Math.max(20, Math.round(panelHeight * 0.16));
    const contentY = panelY + headerHeight;
    const contentHeight = panelHeight - headerHeight - Math.max(12, blockSize);
    const columns = Math.max(8, Math.floor(panelWidth / blockSize));
    const rows = Math.max(5, Math.floor(contentHeight / blockSize));
    const revealRows = Math.min(rows, Math.floor(pagePhase * (rows + 4)));

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.fillStyle = '#060708';
    g.fillRect(panelX, panelY, panelWidth, panelHeight);
    g.strokeStyle = \`\${signal}66\`;
    g.lineWidth = 2;
    g.strokeRect(panelX - 2, panelY - 2, panelWidth + 4, panelHeight + 4);

    const bandWidth = panelWidth / colorBands;
    const bandColors = [signal, '#FF5A1F', '#E7E95E', '#8C6CF2', '#E4F4F5', '#5EE7F3'];
    for (let band = 0; band < colorBands; band += 1) {
      g.fillStyle = bandColors[band % bandColors.length];
      g.fillRect(panelX + band * bandWidth, panelY, Math.ceil(bandWidth), Math.max(4, headerHeight * 0.18));
    }

    g.font = \`700 \${Math.max(9, Math.round(headerHeight * 0.3))}px JetBrains Mono, monospace\`;
    g.textBaseline = 'middle';
    g.fillStyle = '#E4F4F5';
    g.fillText('P100  DEXA TEXT', panelX + blockSize, panelY + headerHeight * 0.54);
    g.textAlign = 'right';
    g.fillStyle = signal;
    g.fillText(\`\${String(revealRows).padStart(2, '0')}/\${String(rows).padStart(2, '0')}\`, panelX + panelWidth - blockSize, panelY + headerHeight * 0.54);
    g.textAlign = 'left';

    if (ctx.subject.bitmap) {
      const bitmap = ctx.subject.bitmap;
      for (let row = 0; row < revealRows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = panelX + column * blockSize;
          const y = contentY + row * blockSize;
          const width = Math.min(blockSize - 1, panelX + panelWidth - x);
          const height = Math.min(blockSize - 1, contentY + contentHeight - y);
          if (width <= 0 || height <= 0) continue;
          const sourceX = (column / columns) * bitmap.width;
          const sourceY = (row / rows) * bitmap.height;
          const sourceWidth = bitmap.width / columns;
          const sourceHeight = bitmap.height / rows;
          g.globalAlpha = 0.76;
          g.drawImage(bitmap, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);

          const colorCell = ctx.random(\`cell:\${row}:\${column}\`);
          if (colorCell > 0.78) {
            g.globalCompositeOperation = 'screen';
            g.globalAlpha = 0.16 + ctx.random(\`alpha:\${row}:\${column}\`) * 0.22;
            g.fillStyle = bandColors[Math.floor(colorCell * bandColors.length) % bandColors.length];
            g.fillRect(x, y, width, height);
            g.globalCompositeOperation = 'source-over';
          }
        }
      }
    }
    g.globalAlpha = 1;

    const loadingY = contentY + revealRows * blockSize;
    if (revealRows < rows) {
      g.fillStyle = signal;
      g.globalAlpha = 0.7;
      g.fillRect(panelX, loadingY, panelWidth, 2);
      for (let column = 0; column < columns; column += 1) {
        if (ctx.random(\`loader:\${column}\`) > 0.48) {
          g.globalAlpha = 0.22;
          g.fillRect(panelX + column * blockSize, loadingY + 4, blockSize - 1, blockSize * 0.45);
        }
      }
    }
    g.globalAlpha = 1;
    g.font = \`600 \${Math.max(8, Math.round(blockSize * 0.68))}px JetBrains Mono, monospace\`;
    g.fillStyle = '#E4F4F5';
    g.fillText('INDEX  NEWS  SIGNAL  006', panelX + blockSize, panelY + panelHeight - blockSize * 0.52);
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
