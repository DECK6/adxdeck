const t=`import type { FxKernel } from '../../src/fx/types';

const smooth = (value: number) => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const separation = Number(ctx.params.separation ?? 0.42);
    const softness = Number(ctx.params.softness ?? 0.35);
    const outline = Boolean(ctx.params.outline ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const operationPosition = cycle * 2;
    const operation = Math.min(2, Math.floor(operationPosition));
    const blend = smooth(operationPosition - operation);
    const offset = 80 + separation * 210;
    const drift = Math.sin(ctx.t * Math.PI * 2) * 38;
    const opacities = [0, 1, 2].map((index) => {
      if (index === operation) return 1 - blend;
      if (index === Math.min(2, operation + 1)) return blend;
      return 0;
    });
    const labels = ['UNION', 'DIFFERENCE', 'INTERSECTION'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '25%', display: 'grid', placeItems: 'center', opacity: 0.12 }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '6%', width: '88%', height: '88%' }}>
          <defs>
            <mask id="s11-union-mask">
              <rect width="1000" height="1000" fill="black" />
              <circle cx={500 - offset + drift} cy="500" r="245" fill="white" />
              <rect x={500 + offset - 235 - drift} y="265" width="470" height="470" rx="105" fill="white" />
            </mask>
            <mask id="s11-difference-mask">
              <rect width="1000" height="1000" fill="black" />
              <circle cx={500 - offset + drift} cy="500" r="245" fill="white" />
              <rect x={500 + offset - 235 - drift} y="265" width="470" height="470" rx="105" fill="black" />
            </mask>
            <clipPath id="s11-circle-clip">
              <circle cx={500 - offset + drift} cy="500" r="245" />
            </clipPath>
            <mask id="s11-intersection-mask">
              <rect width="1000" height="1000" fill="black" />
              <rect x={500 + offset - 235 - drift} y="265" width="470" height="470" rx="105" fill="white" clipPath="url(#s11-circle-clip)" />
            </mask>
          </defs>
          {['s11-union-mask', 's11-difference-mask', 's11-intersection-mask'].map((mask, index) => (
            <g key={mask} opacity={opacities[index]}>
              <rect width="1000" height="1000" fill={signal} mask={\`url(#\${mask})\`} opacity="0.3" />
              <rect
                width="1000"
                height="1000"
                fill={signal}
                mask={\`url(#\${mask})\`}
                opacity="0.82"
                style={{ filter: \`drop-shadow(0 0 \${8 + softness * 28}px \${signal})\` }}
              />
            </g>
          ))}
          {outline && (
            <g fill="none" stroke={signal} strokeWidth="4" opacity="0.24" strokeDasharray="12 14">
              <circle cx={500 - offset + drift} cy="500" r="245" />
              <rect x={500 + offset - 235 - drift} y="265" width="470" height="470" rx="105" />
            </g>
          )}
          <text x="500" y="875" fill="#F4F7F8" textAnchor="middle" fontSize="28" fontFamily="monospace" letterSpacing="7">
            {labels[operation]}
          </text>
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
