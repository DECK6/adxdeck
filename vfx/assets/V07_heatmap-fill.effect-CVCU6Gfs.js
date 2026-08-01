const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const columns = Math.max(6, Math.min(14, Math.round(Number(ctx.params.columns ?? 10))));
    const rows = Math.max(4, Math.min(10, Math.round(Number(ctx.params.rows ?? 7))));
    const trail = Math.max(3, Math.round(Number(ctx.params.trail ?? 10)));
    const gap = Number(ctx.params.gap ?? 6);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const total = columns * rows;
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const sweep = phase * total;
    const head = Math.floor(sweep) % total;
    const headRow = Math.floor(head / columns);
    const headColumnRaw = head % columns;
    const headColumn = headRow % 2 === 0 ? headColumnRaw : columns - 1 - headColumnRaw;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '28%', opacity: 0.04 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: '12%',
            display: 'grid',
            gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
            gridTemplateRows: \`repeat(\${rows}, 1fr)\`,
            gap,
          }}
        >
          {Array.from({ length: total }, (_, visualIndex) => {
            const row = Math.floor(visualIndex / columns);
            const column = visualIndex % columns;
            const order = row * columns + (row % 2 === 0 ? column : columns - 1 - column);
            const age = (sweep - order + total) % total;
            const activity = Math.max(0, 1 - age / trail);
            const base = 0.08 + ctx.random(\`cell:\${visualIndex}\`) * 0.14;
            const scale = 0.72 + activity * 0.28;
            return (
              <div
                key={visualIndex}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  border: \`1px solid \${signal}\`,
                  background: signal,
                  opacity: Math.min(0.96, base + activity * 0.82),
                  transform: \`scale(\${scale}) translateY(\${(1 - activity) * 7}px)\`,
                  boxShadow: activity > 0.45 ? \`0 0 \${6 + activity * 16}px \${signal}\` : 'none',
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: \`calc(12% + \${(headColumn + 0.5) * (76 / columns)}%)\`,
            top: \`calc(12% + \${(headRow + 0.5) * (76 / rows)}%)\`,
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: \`3px solid \${signal}\`,
            background: '#0D0E10',
            boxShadow: \`0 0 18px \${signal}\`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
