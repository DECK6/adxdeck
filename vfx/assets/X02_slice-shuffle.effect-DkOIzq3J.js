const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const slices = Math.max(4, Math.round(Number(ctx.params.slices ?? 10)));
    const stagger = Number(ctx.params.stagger ?? 0.46);
    const travel = Number(ctx.params.travel ?? 1.05);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const wave = Math.sin(Math.PI * ctx.t);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: slices }, (_, index) => {
          const rank = slices <= 1 ? 0 : index / (slices - 1);
          const delay = Math.abs(rank - 0.5) * 2 * stagger;
          const raw = Math.max(0, Math.min(1, (wave - delay) / Math.max(0.01, 1 - delay)));
          const progress = raw * raw * (3 - 2 * raw);
          const direction = index % 2 === 0 ? -1 : 1;
          const offset = direction * (1 - progress) * ctx.height * travel;
          const left = (index / slices) * 100;
          const width = 100 / slices + 0.12;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                clipPath: \`polygon(\${left}% 0, \${left + width}% 0, \${left + width}% 100%, \${left}% 100%)\`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#F5F1E6',
                  transform: \`translate3d(0, \${offset}px, 0)\`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    filter: 'grayscale(1) contrast(1.4) brightness(0.45)',
                    mixBlendMode: 'multiply',
                  }}
                >
                  {ctx.subjectNode}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: \`\${left + width * 0.18}%\`,
                    top: index % 3 === 0 ? '14%' : '78%',
                    width: \`\${Math.max(1.4, width * 0.14)}%\`,
                    height: index % 3 === 0 ? '25%' : '12%',
                    background: '#17181A',
                    opacity: 0.82,
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: \`\${left}%\`,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: signal,
                  opacity: progress > 0.04 && progress < 0.96 ? 0.7 : 0,
                  transform: \`translateY(\${offset}px)\`,
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            right: 38,
            bottom: 30,
            color: signal,
            background: 'rgba(13, 14, 16, 0.88)',
            padding: '4px 10px',
            fontFamily: 'monospace',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.2em',
          }}
        >
          DEXA VFX / SHUFFLE
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
