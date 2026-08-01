const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sensitivity = Math.min(2.5, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.35)));
    const barCount = Math.min(20, Math.max(8, Math.round(Number(ctx.params.bars ?? 14))));
    const falloff = clamp01(Number(ctx.params.falloff ?? 0.28));
    const gap = Math.min(14, Math.max(2, Number(ctx.params.gap ?? 6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bands = ctx.audio?.bands ?? [0, 0, 0, 0, 0, 0, 0, 0];
    const meterWidth = ctx.width * 0.78;
    const meterHeight = ctx.height * 0.52;
    const barWidth = Math.max(3, (meterWidth - gap * (barCount - 1)) / barCount);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12 + rms * 0.12,
            transform: \`scale(\${0.94 + rms * 0.06})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: ctx.height * 0.14,
            width: meterWidth,
            height: meterHeight,
            transform: 'translateX(-50%)',
          }}
        >
          {Array.from({ length: barCount }, (_, index) => {
            const bandIndex = Math.min(7, Math.floor(index * 8 / barCount));
            const band = clamp01(bands[bandIndex] ?? 0);
            const oscillator = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (ctx.t * (2 + bandIndex % 3) + index * 0.083));
            const edgeDistance = Math.abs(index - (barCount - 1) * 0.5) / Math.max(1, (barCount - 1) * 0.5);
            const shape = 1 - edgeDistance * falloff * 0.58;
            const level = clamp01((0.09 + band * 0.72 + rms * 0.22 + oscillator * 0.17) * sensitivity * shape);
            const height = Math.max(4, meterHeight * level);
            const left = index * (barWidth + gap);

            return (
              <div key={index}>
                <div
                  style={{
                    position: 'absolute',
                    left,
                    bottom: 0,
                    width: barWidth,
                    height,
                    borderRadius: Math.min(5, barWidth * 0.35),
                    background: signal,
                    opacity: 0.48 + level * 0.48,
                    boxShadow: \`0 0 \${4 + level * 13}px \${signal}\`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left,
                    bottom: Math.min(meterHeight - 3, height + 7 + oscillator * 10),
                    width: barWidth,
                    height: 3,
                    borderRadius: 999,
                    background: signal,
                    opacity: 0.28 + level * 0.6,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
