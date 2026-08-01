const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const amount = Number(ctx.params.amount ?? 0.92);
    const waveHeight = Number(ctx.params.waveHeight ?? 4.5);
    const waves = Number(ctx.params.waves ?? 2);
    const viscosity = Number(ctx.params.viscosity ?? 0.64);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = Math.PI * 2 * ctx.t;
    const fill = 0.5 - 0.5 * Math.cos(phase);
    const surface = 104 - fill * 108 * amount;
    const samples = 16;
    const surfacePoints = Array.from({ length: samples + 1 }, (_, index) => {
      const x = (index / samples) * 100;
      const spatial = (index / samples) * Math.PI * 2 * waves;
      const mainWave = Math.sin(spatial + phase) * waveHeight;
      const ripple = Math.sin(spatial * 2 - phase * 2) * waveHeight * (1 - viscosity) * 0.34;
      return { x, y: surface + mainWave + ripple };
    });
    const fillPolygon = \`\${surfacePoints.map(({ x, y }) => \`\${x}% \${y}%\`).join(', ')}, 100% 108%, 0 108%\`;
    const bandBottom = [...surfacePoints]
      .reverse()
      .map(({ x, y }) => \`\${x}% \${y + 1.4 + viscosity * 1.8}%\`)
      .join(', ');
    const bandPolygon = \`\${surfacePoints.map(({ x, y }) => \`\${x}% \${y}%\`).join(', ')}, \${bandBottom}\`;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, clipPath: \`polygon(\${fillPolygon})\` }}>
          {ctx.subjectNode}
          <div style={{ position: 'absolute', inset: 0, background: signal, opacity: 0.09 + (1 - viscosity) * 0.07 }} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: \`polygon(\${bandPolygon})\`,
            background: signal,
            boxShadow: \`0 0 \${10 + waveHeight * 2}px \${signal}\`,
            opacity: 0.78,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
