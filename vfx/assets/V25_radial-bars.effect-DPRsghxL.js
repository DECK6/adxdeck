const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const bars = Math.max(12, Math.min(36, Math.round(Number(ctx.params.bars ?? 24))));
    const length = Math.max(0.45, Math.min(1, Number(ctx.params.length ?? 0.78)));
    const thickness = Math.max(4, Math.min(14, Number(ctx.params.thickness ?? 8)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4F7F8', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '25%', opacity: 0.1 }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '7%', width: '86%', height: '86%', overflow: 'visible' }}>
          <circle cx="500" cy="500" r="205" fill="none" stroke={signal} strokeWidth="1" opacity="0.2" />
          {Array.from({ length: bars }, (_, index) => {
            const value = 0.24 + ctx.random(\`bar:\${index}\`) * 0.76;
            const local = Math.max(0, Math.min(1, reveal * 1.4 - index / bars * 0.4));
            const extent = value * 205 * length * local;
            return (
              <line
                key={index}
                x1="500"
                y1="280"
                x2="500"
                y2={280 - extent}
                transform={\`rotate(\${(index / bars) * 360} 500 500)\`}
                stroke={signal}
                strokeWidth={thickness}
                strokeLinecap="round"
                opacity={0.25 + value * 0.75}
                style={{ filter: value > 0.78 ? \`drop-shadow(0 0 7px \${signal})\` : 'none' }}
              />
            );
          })}
          <text x="500" y="485" textAnchor="middle" fill="#F4F7F8" fontSize="24" fontFamily="'JetBrains Mono', monospace" letterSpacing="5">DEXA VFX</text>
          <text x="500" y="535" textAnchor="middle" fill={signal} fontSize="38" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{Math.round(reveal * 100)}</text>
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
