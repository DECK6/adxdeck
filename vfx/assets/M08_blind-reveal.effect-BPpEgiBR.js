const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const slats = Math.min(16, Math.max(4, Math.round(Number(ctx.params.slats ?? 10))));
    const orientation = String(ctx.params.orientation ?? 'vertical');
    const stagger = clamp01(Number(ctx.params.stagger ?? 0.42));
    const edge = Math.min(8, Math.max(1, Number(ctx.params.edge ?? 3)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const baseOpen = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const vertical = orientation === 'vertical';
    const slotSize = (vertical ? ctx.width : ctx.height) / slats;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05 + baseOpen * 0.04 }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: slats }, (_, index) => {
          const wave = Math.sin(Math.PI * 2 * ctx.t + index * 0.72);
          const open = clamp01(0.04 + baseOpen * 0.96 + wave * stagger * 0.1);
          const visibleSize = Math.max(1, slotSize * open);
          const slotStart = index * slotSize;
          const start = slotStart + (slotSize - visibleSize) * 0.5;

          return (
            <div key={index}>
              <div
                style={{
                  position: 'absolute',
                  left: vertical ? start : 0,
                  top: vertical ? 0 : start,
                  width: vertical ? visibleSize : ctx.width,
                  height: vertical ? ctx.height : visibleSize,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: vertical ? -start : 0,
                    top: vertical ? 0 : -start,
                    width: ctx.width,
                    height: ctx.height,
                  }}
                >
                  {ctx.subjectNode}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: vertical ? start + visibleSize - edge : slotStart,
                  top: vertical ? 0 : start + visibleSize - edge,
                  width: vertical ? edge : slotSize,
                  height: vertical ? ctx.height : edge,
                  background: signal,
                  opacity: 0.18 + open * 0.5,
                  boxShadow: \`0 0 \${edge * 3}px \${signal}\`,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
