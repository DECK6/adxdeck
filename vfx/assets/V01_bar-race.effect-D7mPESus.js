const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const barCount = Math.max(4, Math.min(9, Math.round(Number(ctx.params.bars ?? 6))));
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const spacing = Number(ctx.params.spacing ?? 0.2);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * Math.PI * 2 * cycles;
    const values = Array.from({ length: barCount }, (_, index) => {
      const base = 0.34 + ctx.random(\`base:\${index}\`) * 0.25;
      const amplitude = 0.18 + ctx.random(\`amp:\${index}\`) * 0.2;
      const offset = ctx.random(\`phase:\${index}\`) * Math.PI * 2;
      const harmonic = 1 + (index % 3);
      return Math.max(0.12, Math.min(1, base + Math.sin(phase * harmonic + offset) * amplitude));
    });
    const order = values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value || a.index - b.index);
    const rankByIndex = new Map(order.map((entry, rank) => [entry.index, rank]));
    const top = ctx.height * 0.14;
    const availableHeight = ctx.height * 0.72;
    const rowHeight = availableHeight / barCount;
    const barHeight = rowHeight * (1 - spacing);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '17%', opacity: 0.1, filter: 'grayscale(1)' }}>
          {ctx.subjectNode}
        </div>
        {values.map((value, index) => {
          const rank = rankByIndex.get(index) ?? index;
          const opacity = 1 - rank * (0.58 / Math.max(1, barCount - 1));
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '11%',
                top: top + rank * rowHeight,
                width: \`\${24 + value * 62}%\`,
                height: barHeight,
                borderRadius: barHeight * 0.18,
                background: signal,
                opacity,
                boxShadow: rank === 0 ? \`0 0 \${barHeight * 0.8}px \${signal}55\` : 'none',
              }}
            />
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
