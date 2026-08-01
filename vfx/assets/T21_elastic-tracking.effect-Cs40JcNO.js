const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** Periodic spring: harmonics keep the overshoot loop-clean at any time shift. */
const springDrive = (time: number, cycles: number) => {
  const w = Math.PI * 2 * cycles * time;
  return 0.5 - 0.5 * Math.cos(w) + 0.09 * Math.sin(w * 2) - 0.028 * Math.sin(w * 3);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'DEXA VFX').toUpperCase();
    const spread = Number(ctx.params.spread ?? 0.52);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const lag = Number(ctx.params.lag ?? 0.025);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const characters = text.split('');
    const center = (characters.length - 1) / 2;
    const reach = Math.max(1, center);
    const fontSize = Math.max(20, Math.min((ctx.width * 0.5) / Math.max(4, characters.length * 0.5), ctx.height * 0.22));
    const advance = fontSize * 0.66;
    const edgeTrack = springDrive(ctx.t - reach * lag, cycles) * spread * fontSize;
    const halfSpan = reach * (advance + edgeTrack) + fontSize * 0.5;
    const compressed = 1 - clamp01(springDrive(ctx.t, cycles));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          {ctx.subjectNode}
        </div>
        {[-1, 1].map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 2,
              height: fontSize * 1.5,
              background: signal,
              opacity: 0.25 + compressed * 0.45,
              transform: \`translate(-50%, -50%) translateX(\${side * halfSpan}px)\`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize,
            fontWeight: 700,
            lineHeight: 1,
            color: '#F5F8FA',
            whiteSpace: 'pre',
          }}
        >
          {characters.map((character, index) => {
            const offsetIndex = index - center;
            const distance = Math.abs(offsetIndex) / reach;
            const drive = springDrive(ctx.t - Math.abs(offsetIndex) * lag, cycles);
            const open = clamp01(drive);
            const shift = offsetIndex * drive * spread * fontSize;

            return (
              <span
                key={\`\${character}:\${index}\`}
                style={{
                  display: 'inline-block',
                  width: advance,
                  textAlign: 'center',
                  transform: \`translate3d(\${shift}px, 0, 0)\`,
                  opacity: 1 - distance * open * 0.72,
                  filter: \`blur(\${distance * open * 2.2}px)\`,
                  textShadow: \`0 0 \${4 + (1 - open) * 18}px \${signal}\`,
                }}
              >
                {character}
              </span>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
