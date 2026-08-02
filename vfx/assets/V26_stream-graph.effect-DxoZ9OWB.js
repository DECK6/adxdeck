const n=`import type { FxKernel } from '../../src/fx/types';

function rgba(hexValue: string, alpha: number): string {
  const hex = /^#[0-9a-f]{6}$/i.test(hexValue) ? hexValue.slice(1) : '5EE7F3';
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return \`rgba(\${red}, \${green}, \${blue}, \${alpha})\`;
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const bandCount = Math.max(3, Math.min(7, Math.round(Number(ctx.params.bands ?? 5))));
    const amplitude = Math.max(0.3, Math.min(1, Number(ctx.params.amplitude ?? 0.72)));
    const flow = Math.max(0.5, Math.min(2, Number(ctx.params.flow ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const samples = 64;
    const left = ctx.width * 0.07;
    const chartWidth = ctx.width * 0.86;
    const center = ctx.height * 0.53;
    const totalHeight = ctx.height * 0.56;
    const phase = ctx.t * Math.PI * 2 * flow;
    const thicknesses = Array.from({ length: samples }, (_, sample) => {
      const x = sample / (samples - 1);
      const values = Array.from({ length: bandCount }, (_, band) => {
        const waveA = Math.sin(x * Math.PI * (2.2 + band * 0.31) + phase + band * 1.4);
        const waveB = Math.cos(x * Math.PI * (4.1 - band * 0.18) - phase * 0.65 + band);
        return 0.45 + amplitude * (0.18 + waveA * 0.1 + waveB * 0.06) + ctx.random(\`bias:\${band}\`) * 0.12;
      });
      const sum = values.reduce((total, value) => total + value, 0);
      return values.map((value) => value / sum * totalHeight);
    });

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.1;
      g.drawImage(ctx.subject.bitmap, ctx.width * 0.2, ctx.height * 0.2, ctx.width * 0.6, ctx.height * 0.6);
      g.restore();
    }
    g.save();
    g.beginPath();
    g.rect(left, ctx.height * 0.18, chartWidth * reveal, ctx.height * 0.66);
    g.clip();
    for (let band = 0; band < bandCount; band += 1) {
      const topPoints = Array.from({ length: samples }, (_, sample) => {
        const total = thicknesses[sample].reduce((sum, value) => sum + value, 0);
        const before = thicknesses[sample].slice(0, band).reduce((sum, value) => sum + value, 0);
        return [left + sample / (samples - 1) * chartWidth, center - total / 2 + before] as const;
      });
      const bottomPoints = topPoints.map(([x, y], sample) => [x, y + thicknesses[sample][band]] as const);
      g.beginPath();
      topPoints.forEach(([x, y], index) => index === 0 ? g.moveTo(x, y) : g.lineTo(x, y));
      for (let index = bottomPoints.length - 1; index >= 0; index -= 1) g.lineTo(bottomPoints[index][0], bottomPoints[index][1]);
      g.closePath();
      g.fillStyle = rgba(signal, 0.14 + (bandCount - band) / bandCount * 0.58);
      g.fill();
      g.strokeStyle = rgba(signal, 0.3 + (bandCount - band) / bandCount * 0.35);
      g.lineWidth = 1.5;
      g.stroke();
    }
    g.restore();
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
