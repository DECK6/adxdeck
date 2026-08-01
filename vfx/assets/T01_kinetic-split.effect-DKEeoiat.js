const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const stagger = Number(ctx.params.stagger ?? 0.06);
    const distance = Number(ctx.params.distance ?? 0.24);
    const slices = Math.round(Number(ctx.params.slices ?? 7));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {Array.from({ length: slices }, (_, index) => {
          const start = 0.04 + index * stagger;
          const raw = Math.min(1, Math.max(0, (ctx.t - start) / 0.18));
          const progress = raw * raw * (3 - 2 * raw);
          const left = (index / slices) * 100;
          const right = 100 - ((index + 1) / slices) * 100;
          const travel = (1 - progress) * ctx.height * distance * (index % 2 === 0 ? 1 : -1);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: \`inset(0 \${right}% 0 \${left}%)\`,
                opacity: progress * outro,
                transform: \`translate3d(0, \${travel}px, 0)\`,
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '10%',
            height: 2,
            background: signal,
            opacity: 0.75 * outro,
            transform: \`scaleX(\${Math.min(1, Math.max(0, ctx.t / 0.68))})\`,
            transformOrigin: 'left',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
