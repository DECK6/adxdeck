const e=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const pixelSize = Math.max(3, Math.round(Number(ctx.params.pixelSize ?? 5)));
    const contrast = Math.min(1, Math.max(0.4, Number(ctx.params.contrast ?? 0.82)));
    const ghosting = clamp01(Number(ctx.params.ghosting ?? 0.54));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);

    g.clearRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    const source = g.getImageData(0, 0, ctx.width, ctx.height).data;
    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    const caseX = ctx.width * 0.13;
    const caseY = ctx.height * 0.13;
    const caseWidth = ctx.width * 0.74;
    const caseHeight = ctx.height * 0.74;
    g.fillStyle = '#252A2D';
    g.fillRect(caseX, caseY, caseWidth, caseHeight);
    g.strokeStyle = '#596166';
    g.lineWidth = Math.max(2, ctx.height * 0.012);
    g.strokeRect(caseX, caseY, caseWidth, caseHeight);

    const inset = Math.max(10, Math.min(ctx.width, ctx.height) * 0.065);
    const screenX = caseX + inset;
    const screenY = caseY + inset * 0.72;
    const screenWidth = caseWidth - inset * 2;
    const screenHeight = caseHeight - inset * 1.5;
    g.fillStyle = '#071012';
    g.fillRect(screenX, screenY, screenWidth, screenHeight);
    g.strokeStyle = \`\${signal}88\`;
    g.lineWidth = 2;
    g.strokeRect(screenX, screenY, screenWidth, screenHeight);

    const columns = Math.floor(screenWidth / pixelSize);
    const rows = Math.floor(screenHeight / pixelSize);
    const ghostShift = Math.round(Math.sin(phase * Math.PI * 2) * pixelSize * 1.4);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = screenX + column * pixelSize + pixelSize * 0.5;
        const y = screenY + row * pixelSize + pixelSize * 0.5;
        const sampleX = Math.min(ctx.width - 1, Math.max(0, Math.round(((x - screenX) / screenWidth) * ctx.width)));
        const sampleY = Math.min(ctx.height - 1, Math.max(0, Math.round(((y - screenY) / screenHeight) * ctx.height)));
        const offset = (sampleY * ctx.width + sampleX) * 4;
        const alpha = source[offset + 3] / 255;
        const luma = (source[offset] * 0.2126 + source[offset + 1] * 0.7152 + source[offset + 2] * 0.0722) / 255;
        const primary = clamp01((alpha * (0.3 + luma * 0.9) - 0.16) * contrast * 1.35);
        const ghostSampleX = Math.min(ctx.width - 1, Math.max(0, sampleX + ghostShift));
        const ghostOffset = (sampleY * ctx.width + ghostSampleX) * 4;
        const oldAlpha = source[ghostOffset + 3] / 255;
        const oldLuma = (source[ghostOffset] + source[ghostOffset + 1] + source[ghostOffset + 2]) / 765;
        const afterimage = clamp01(oldAlpha * oldLuma * ghosting * 0.42);
        const power = Math.max(primary, afterimage);
        g.globalAlpha = 0.12 + power * 0.88;
        g.fillStyle = power > 0.08 ? signal : '#183035';
        const dot = pixelSize * 0.68;
        g.fillRect(x - dot * 0.5, y - dot * 0.5, dot, dot);
      }
    }

    const blink = Math.floor(phase * 12) % 2 === 0;
    g.globalAlpha = blink ? 0.92 : 0.32;
    g.fillStyle = signal;
    g.fillRect(screenX + pixelSize, screenY + pixelSize, pixelSize * 3, Math.max(1, pixelSize * 0.45));
    g.fillRect(screenX + pixelSize, screenY + pixelSize * 1.8, pixelSize * 2, Math.max(1, pixelSize * 0.45));
    g.globalAlpha = 0.52;
    g.fillStyle = signal;
    const refreshX = screenX + phase * screenWidth;
    g.fillRect(refreshX - 2, screenY, 4, screenHeight);
    g.globalAlpha = 1;
    g.fillStyle = '#0D0E10';
    g.fillRect(caseX + caseWidth * 0.73, caseY - 4, caseWidth * 0.16, 7);
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
