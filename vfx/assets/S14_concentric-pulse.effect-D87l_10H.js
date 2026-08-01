const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const ringCount = Math.max(3, Math.round(Number(ctx.params.rings ?? 7)));
    const spread = Number(ctx.params.spread ?? 0.86);
    const thickness = Number(ctx.params.thickness ?? 3);
    const intensity = Number(ctx.params.intensity ?? 0.78);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % ctx.durationInFrames) / ctx.durationInFrames;
    const maxRadius = Math.SQRT1_2 * 1000 * spread;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {Array.from({ length: ringCount }, (_, index) => {
            const local = (phase + index / ringCount) % 1;
            const envelope = Math.pow(Math.sin(local * Math.PI), 1.35) * intensity;
            const radius = 22 + local * maxRadius;
            return (
              <circle
                key={index}
                cx="500"
                cy="500"
                r={radius}
                fill="none"
                stroke={signal}
                strokeWidth={thickness * (1 - local * 0.55)}
                opacity={envelope}
                style={{ filter: \`drop-shadow(0 0 \${4 + thickness * 2}px \${signal})\` }}
              />
            );
          })}
          <circle cx="500" cy="500" r={14 + Math.sin(phase * Math.PI * 2) * 3} fill={signal} opacity={0.45 + intensity * 0.35} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', filter: \`drop-shadow(0 0 \${8 + intensity * 12}px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
