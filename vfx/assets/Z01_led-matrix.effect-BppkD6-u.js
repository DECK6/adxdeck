const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const pitch = Math.max(7, Math.round(Number(ctx.params.pitch ?? 12)));
    const bloom = clamp01(Number(ctx.params.bloom ?? 0.68));
    const persistence = clamp01(Number(ctx.params.persistence ?? 0.72));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);

    g.save();
    g.clearRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    const pixels = g.getImageData(0, 0, ctx.width, ctx.height).data;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.fillStyle = '#15181B';
    g.fillRect(pitch * 0.45, pitch * 0.45, ctx.width - pitch * 0.9, ctx.height - pitch * 0.9);

    const scanRow = phase * (ctx.height + pitch * 8) - pitch * 4;
    const radius = Math.max(1.4, pitch * 0.27);
    for (let y = Math.floor(pitch / 2); y < ctx.height; y += pitch) {
      for (let x = Math.floor(pitch / 2); x < ctx.width; x += pitch) {
        const offset = (Math.min(ctx.height - 1, y) * ctx.width + Math.min(ctx.width - 1, x)) * 4;
        const alpha = pixels[offset + 3] / 255;
        const luma = (pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722) / 255;
        const source = clamp01(alpha * (0.18 + luma * 0.94));
        const threshold = ctx.random(\`led:\${x}:\${y}\`) * 0.16;
        const scan = Math.exp(-Math.abs(y - scanRow) / Math.max(1, pitch * 1.8));
        const decay = source > threshold ? source : source * persistence * 0.48;
        const power = clamp01(decay + scan * (0.12 + persistence * 0.16));

        g.beginPath();
        g.arc(x, y, radius + bloom * power * pitch * 0.14, 0, Math.PI * 2);
        g.fillStyle = power > 0.08 ? signal : '#24292C';
        g.globalAlpha = power > 0.08 ? 0.24 + power * 0.76 : 0.42;
        g.shadowColor = signal;
        g.shadowBlur = bloom * power * pitch * 1.5;
        g.fill();

        g.beginPath();
        g.arc(x - radius * 0.22, y - radius * 0.25, Math.max(0.5, radius * 0.25), 0, Math.PI * 2);
        g.fillStyle = '#F2FFFF';
        g.globalAlpha = power * 0.62;
        g.shadowBlur = 0;
        g.fill();
      }
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
