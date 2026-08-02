const t=`import type { FxKernel } from '../../src/fx/types';

const smoothstep = (value: number): number => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const pills = Math.min(10, Math.max(4, Math.round(Number(ctx.params.pills ?? 7))));
    const drop = Math.min(1, Math.max(0.4, Number(ctx.params.drop ?? 0.76)));
    const spacing = Math.min(92, Math.max(48, Number(ctx.params.spacing ?? 68)));
    const width = Math.min(420, Math.max(180, Number(ctx.params.width ?? 300)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const stackHeight = (pills - 1) * spacing;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '34%', opacity: 0.3, filter: \`grayscale(1) drop-shadow(0 0 6px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '3%', width: '94%', height: '94%', filter: \`drop-shadow(0 0 8px \${signal})\` }}>
          <line x1="210" y1="860" x2="790" y2="860" stroke={signal} strokeWidth="3" strokeDasharray="8 12" opacity="0.28" />
          {Array.from({ length: pills }, (_, index) => {
            const local = (ctx.t + index / pills) % 1;
            const arrival = Math.min(1, local / drop);
            const eased = 1 - Math.pow(1 - smoothstep(arrival), 2);
            const targetY = 830 - index * spacing;
            const startY = -90 - index * 24;
            const bounce = arrival < 1 ? Math.sin(arrival * Math.PI * 3) * (1 - arrival) * 34 : 0;
            const y = startY + (targetY - startY) * eased - bounce;
            const scatter = Math.sin(index * 2.17) * 210 * (1 - eased);
            const tilt = Math.cos(index * 1.63) * 34 * (1 - eased);
            const fade = local > 0.9 ? (1 - local) / 0.1 : Math.min(1, local / 0.08);
            const pillHeight = Math.min(54, spacing * 0.66);
            return (
              <g key={index} transform={\`translate(\${scatter} 0) rotate(\${tilt} 500 \${y})\`} opacity={fade}>
                <rect
                  x={500 - width * 0.5}
                  y={y - pillHeight * 0.5}
                  width={width}
                  height={pillHeight}
                  rx={pillHeight * 0.5}
                  fill="#0D0E10"
                  fillOpacity="0.86"
                  stroke={signal}
                  strokeWidth="4"
                />
                <line x1="500" y1={y - pillHeight * 0.36} x2="500" y2={y + pillHeight * 0.36} stroke={signal} strokeWidth="2" opacity="0.48" />
                <circle cx={500 - width * 0.31} cy={y} r="4" fill={signal} opacity="0.78" />
              </g>
            );
          })}
          <path d={\`M180 \${850 - stackHeight} V860 M820 \${850 - stackHeight} V860\`} stroke={signal} strokeWidth="2" opacity="0.14" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
