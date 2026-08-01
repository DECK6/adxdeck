const n=`import type { FxKernel } from '../../src/fx/types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const threshold = clamp(Number(ctx.params.threshold ?? 0.34), 0.08, 0.9) * 255;
    const maxStreak = Math.round(clamp(Number(ctx.params.streak ?? 38), 8, 72));
    const rowStep = Math.round(clamp(Number(ctx.params.density ?? 2), 1, 6));
    const intensity = clamp(Number(ctx.params.intensity ?? 0.78), 0, 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2;

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);

    const fieldX = ctx.width * (0.5 + 0.34 * Math.sin(phase));
    const field = g.createRadialGradient(fieldX, ctx.height * 0.5, 0, fieldX, ctx.height * 0.5, ctx.width * 0.62);
    field.addColorStop(0, signal);
    field.addColorStop(0.24, \`\${signal}55\`);
    field.addColorStop(1, '#0D0E1000');
    g.save();
    g.globalAlpha = 0.32 + intensity * 0.3;
    g.fillStyle = field;
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.restore();
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    if (intensity === 0) return;

    const image = g.getImageData(0, 0, ctx.width, ctx.height);
    const pixels = image.data;
    const width = ctx.width;

    for (let y = 0; y < ctx.height; y += rowStep) {
      const wave = Math.sin(phase * 3 + y * 0.075);
      const animatedThreshold = threshold + wave * 52 * intensity;
      let x = Math.floor(ctx.random(\`row:\${y}:offset\`) * maxStreak);

      while (x < width) {
        const sourceIndex = (y * width + x) * 4;
        const luminance = pixels[sourceIndex] * 0.2126 + pixels[sourceIndex + 1] * 0.7152 + pixels[sourceIndex + 2] * 0.0722;
        if (luminance < animatedThreshold) {
          x += 1;
          continue;
        }

        const length = Math.min(
          width - x,
          6 + Math.floor(ctx.random(\`row:\${y}:run:\${x}\`) * maxStreak * (0.45 + intensity)),
        );
        const colors: Array<[number, number, number, number, number]> = [];
        for (let index = 0; index < length; index += 1) {
          const offset = (y * width + x + index) * 4;
          const brightness = pixels[offset] + pixels[offset + 1] * 2 + pixels[offset + 2];
          colors.push([brightness, pixels[offset], pixels[offset + 1], pixels[offset + 2], pixels[offset + 3]]);
        }
        colors.sort((a, b) => a[0] - b[0]);
        const rotation = Math.floor(((Math.sin(phase * 2 + y * 0.11) + 1) * 0.5) * Math.max(1, length - 1));
        for (let index = 0; index < length; index += 1) {
          const color = colors[(index + rotation) % length];
          const offset = (y * width + x + index) * 4;
          pixels[offset] = color[1];
          pixels[offset + 1] = color[2];
          pixels[offset + 2] = color[3];
          pixels[offset + 3] = color[4];
        }
        x += length + 1;
      }
    }

    g.putImageData(image, 0, 0);
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
