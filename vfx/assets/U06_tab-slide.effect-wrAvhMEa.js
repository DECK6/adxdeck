const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const tabCount = Math.max(3, Math.min(6, Math.round(Number(ctx.params.tabs ?? 4))));
    const cycles = Math.max(1, Math.min(4, Math.round(Number(ctx.params.cycles ?? 2))));
    const widthRatio = Math.max(0.45, Math.min(0.9, Number(ctx.params.width ?? 0.72)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * Math.PI * 2 * cycles;
    const railWidth = Math.min(ctx.width * widthRatio, ctx.height * 1.35);
    const railHeight = Math.max(60, ctx.height * 0.12);
    const railLeft = (ctx.width - railWidth) * 0.5;
    const railTop = ctx.height * 0.5 - railHeight * 0.5;
    const slotWidth = railWidth / tabCount;
    const position = (0.5 - 0.5 * Math.cos(phase)) * (tabCount - 1);
    const activeWidth = slotWidth * (0.7 + 0.22 * Math.sin(phase * 2) ** 2);
    const indicatorLeft = railLeft + position * slotWidth + (slotWidth - activeWidth) * 0.5;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '18%', opacity: 0.065 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: railLeft,
            top: railTop,
            width: railWidth,
            height: railHeight,
            borderRadius: railHeight * 0.24,
            border: '1px solid #34383F',
            background: '#15171AEE',
            boxShadow: '0 20px 55px #00000099',
          }}
        >
          {Array.from({ length: tabCount }, (_, index) => {
            const distance = Math.abs(position - index);
            const active = Math.max(0, 1 - distance);
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: index * slotWidth + slotWidth * 0.28,
                  top: railHeight * (0.32 - active * 0.04),
                  width: slotWidth * 0.44,
                  height: railHeight * (0.12 + active * 0.08),
                  borderRadius: 999,
                  background: active > 0.5 ? signal : '#51565E',
                  opacity: 0.38 + active * 0.58,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: indicatorLeft,
            top: railTop + railHeight * 0.78,
            width: activeWidth,
            height: Math.max(5, railHeight * 0.08),
            borderRadius: 999,
            background: signal,
            boxShadow: \`0 0 \${railHeight * 0.22}px \${signal}\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: indicatorLeft + activeWidth * 0.5 - 4,
            top: railTop + railHeight * 0.72,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: signal,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
