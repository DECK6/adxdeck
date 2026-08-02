const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rowCount = Math.min(9, Math.max(4, Math.round(Number(ctx.params.rows ?? 6))));
    const sensitivity = Math.min(2.4, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.3)));
    const stepCount = Number(ctx.params.steps ?? 16) === 8 ? 8 : Number(ctx.params.steps ?? 16) === 24 ? 24 : 16;
    const glow = Math.min(24, Math.max(0, Number(ctx.params.glow ?? 12)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const sequencerStep = Math.floor(ctx.t * stepCount) % stepCount;
    const activeColumn = sequencerStep % 8;
    const activeRow = Math.floor(sequencerStep / 8) % rowCount;
    const gap = Math.max(3, Math.min(ctx.width, ctx.height) * 0.018);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 + rms * 0.08 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '14%',
            bottom: '14%',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
            gridTemplateRows: \`repeat(\${rowCount}, minmax(0, 1fr))\`,
            gap,
          }}
        >
          {Array.from({ length: rowCount * 8 }, (_, index) => {
            const row = Math.floor(index / 8);
            const column = index % 8;
            const band = bands[column];
            const threshold = (row + 1) / (rowCount + 1);
            const level = clamp01((band * 0.78 + rms * 0.28) * sensitivity);
            const columnHit = column === activeColumn ? 1 : 0;
            const cursorHit = columnHit && row === activeRow ? 1 : 0;
            const lit = level >= threshold ? 1 : 0;
            const opacity = 0.08 + lit * (0.3 + level * 0.42) + columnHit * 0.12 + cursorHit * 0.32;
            return (
              <div
                key={index}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  border: \`1px solid \${signal}\`,
                  borderRadius: Math.max(2, Math.min(ctx.width, ctx.height) * 0.012),
                  background: signal,
                  opacity: Math.min(1, opacity),
                  transform: \`scale(\${0.82 + level * 0.1 + cursorHit * 0.16})\`,
                  boxShadow: lit || cursorHit ? \`0 0 \${2 + glow * (level + cursorHit * 0.45)}px \${signal}\` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
