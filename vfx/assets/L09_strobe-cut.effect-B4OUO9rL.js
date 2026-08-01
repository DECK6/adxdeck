const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rate = Math.max(1, Math.round(Number(ctx.params.rate ?? 6)));
    const duty = Math.min(0.5, Math.max(0.05, Number(ctx.params.duty ?? 0.16)));
    const intensity = Math.min(1, Math.max(0.1, Number(ctx.params.intensity ?? 0.84)));
    const sliceCount = Math.max(2, Math.round(Number(ctx.params.slices ?? 6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * rate * 6) % 1;
    const flash = phase < duty ? 1 - phase / duty : 0;
    const cut = phase < duty * 0.42;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: cut ? 0.08 : 0.72 + flash * 0.28 }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: sliceCount }, (_, index) => {
          const active = (index + Math.floor(ctx.t * rate * 6)) % 2 === 0;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: \`\${(index / sliceCount) * 100}%\`,
                height: \`\${100 / sliceCount + 0.15}%\`,
                overflow: 'hidden',
                opacity: active ? flash * intensity : flash * intensity * 0.28,
                background: signal,
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: signal,
            opacity: flash * intensity * 0.34,
            mixBlendMode: 'screen',
            boxShadow: \`inset 0 0 \${80 + intensity * 120}px \${signal}\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
