const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const radius = Number(ctx.params.radius ?? 18);
    const speed = Number(ctx.params.speed ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const pulse = 0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 2 * speed - Math.PI / 2);
    const blur = 2 + radius * (0.35 + pulse * 0.65);
    const bloomOpacity = intensity * (0.28 + pulse * 0.72);
    const filterId = 'l01-bloom-filter';

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          style={{ position: 'absolute' }}
        >
          <defs>
            <filter id={filterId} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation={blur} result="blur" />
              <feFlood floodColor={signal} floodOpacity={bloomOpacity} result="color" />
              <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`url(#\${filterId})\`,
            opacity: bloomOpacity,
            transform: \`scale(\${1 + pulse * 0.025})\`,
            transformOrigin: 'center',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`drop-shadow(0 0 \${4 + pulse * 8}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
