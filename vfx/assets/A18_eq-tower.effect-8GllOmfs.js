const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const gain = Math.min(2.5, Math.max(0.5, Number(ctx.params.gain ?? 1.35)));
    const segmentCount = Math.min(18, Math.max(8, Math.round(Number(ctx.params.segments ?? 13))));
    const spread = Math.min(1.25, Math.max(0.55, Number(ctx.params.spread ?? 0.9)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const towerHeight = ctx.height * 0.68;
    const segmentGap = Math.max(2, ctx.height * 0.006);
    const segmentHeight = (towerHeight - segmentGap * (segmentCount - 1)) / segmentCount;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#080A0E' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 + rms * 0.12, transform: \`scale(\${0.94 + rms * 0.05})\` }}>
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '11%', bottom: '11%', width: 1, background: signal, opacity: 0.2, boxShadow: \`0 0 18px \${signal}\` }} />
        {[-1, 1].map((side) => (
          <div key={side}>
            {bands.map((band, bandIndex) => {
              const idle = 0.5 + 0.5 * Math.sin(TAU * (ctx.t * 2 + bandIndex / 8));
              const level = clamp01((band * 0.8 + rms * 0.18 + idle * 0.06) * gain);
              const activeSegments = Math.round(level * segmentCount);
              const distance = (ctx.width * (0.055 + bandIndex * 0.042) * spread) * side;
              const width = Math.max(5, ctx.width * (0.028 - bandIndex * 0.0014));
              return (
                <div
                  key={bandIndex}
                  style={{
                    position: 'absolute',
                    left: \`calc(50% + \${distance}px)\`,
                    bottom: ctx.height * 0.16,
                    width,
                    height: towerHeight,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {Array.from({ length: segmentCount }, (_, segmentIndex) => {
                    const active = segmentIndex < activeSegments;
                    const crown = segmentIndex / Math.max(1, segmentCount - 1);
                    return (
                      <div
                        key={segmentIndex}
                        style={{
                          position: 'absolute',
                          left: 0,
                          bottom: segmentIndex * (segmentHeight + segmentGap),
                          width: '100%',
                          height: Math.max(1, segmentHeight),
                          borderRadius: 2,
                          background: active ? signal : '#293039',
                          opacity: active ? 0.48 + crown * 0.48 : 0.2,
                          boxShadow: active ? \`0 0 \${3 + level * 9}px \${signal}\` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '8%',
            color: signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(8, ctx.height * 0.042),
            fontWeight: 800,
            letterSpacing: '0.28em',
            opacity: 0.5 + rms * 0.45,
            transform: 'translateX(-50%)',
          }}
        >
          L&nbsp;&nbsp;EQ&nbsp;&nbsp;R
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
