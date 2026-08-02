const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const frames = Math.min(13, Math.max(5, Math.round(Number(ctx.params.frames ?? 9))));
    const zoom = Math.min(4, Math.max(1, Math.round(Number(ctx.params.zoom ?? 2))));
    const corner = Math.min(100, Math.max(0, Number(ctx.params.corner ?? 28)));
    const weight = Math.min(8, Math.max(1, Number(ctx.params.weight ?? 3)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '26%', opacity: 0.34, filter: \`grayscale(1) drop-shadow(0 0 7px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: \`drop-shadow(0 0 \${weight * 2}px \${signal})\` }}>
          {Array.from({ length: frames }, (_, index) => {
            const local = (index / frames + ctx.t * zoom) % 1;
            const eased = local * local;
            const width = 80 + eased * 1100;
            const height = 48 + eased * 660;
            const opacity = Math.sin(local * Math.PI) * 0.86;
            return (
              <rect
                key={index}
                x={500 - width * 0.5}
                y={500 - height * 0.5}
                width={width}
                height={height}
                rx={corner * (0.3 + eased * 0.7)}
                fill="none"
                stroke={signal}
                strokeWidth={weight * (0.5 + eased * 0.8)}
                opacity={opacity}
              />
            );
          })}
          <path d="M500 72 V928 M72 500 H928" stroke={signal} strokeWidth="1" strokeDasharray="4 16" opacity="0.15" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
