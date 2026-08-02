const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.max(4, Math.min(8, Math.round(Number(ctx.params.series ?? 6))));
    const spread = Math.max(0.4, Math.min(1, Number(ctx.params.spread ?? 0.78)));
    const thickness = Math.max(2, Math.min(8, Number(ctx.params.thickness ?? 4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const leftRanks = Array.from({ length: count }, (_, index) => index);
    const rightRanks = [...leftRanks].sort((a, b) => {
      const aScore = ctx.random(\`rank:\${a}\`);
      const bScore = ctx.random(\`rank:\${b}\`);
      return bScore - aScore || a - b;
    });
    const rightRank = new Map(rightRanks.map((index, rank) => [index, rank]));
    const yForRank = (rank: number) => 150 + rank * (700 / Math.max(1, count - 1)) * spread + (1 - spread) * 350;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4F7F8', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '22%', opacity: 0.08 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '13%', right: '13%', top: '9%', display: 'flex', justifyContent: 'space-between', fontSize: 16, letterSpacing: 4, color: '#B8C0C4' }}><span>DEXA / A</span><span>VFX / B</span></div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', left: '11%', top: '13%', width: '78%', height: '75%', overflow: 'visible' }}>
          {leftRanks.map((seriesIndex) => {
            const y1 = yForRank(seriesIndex);
            const y2 = yForRank(rightRank.get(seriesIndex) ?? seriesIndex);
            const local = Math.max(0, Math.min(1, reveal * 1.4 - seriesIndex * 0.06));
            return (
              <g key={seriesIndex} opacity={0.42 + (seriesIndex === 0 ? 0.58 : 0.32)}>
                <line x1="130" y1={y1} x2={130 + 740 * local} y2={y1 + (y2 - y1) * local} stroke={signal} strokeWidth={seriesIndex === 0 ? thickness * 1.5 : thickness} strokeLinecap="round" />
                <circle cx="130" cy={y1} r={thickness * 1.8} fill={signal} />
                <circle cx={130 + 740 * local} cy={y1 + (y2 - y1) * local} r={thickness * 1.8} fill={signal} />
                <text x="105" y={y1 + 6} textAnchor="end" fill="#F4F7F8" fontSize="22" fontFamily="'JetBrains Mono', monospace">{String(seriesIndex + 1).padStart(2, '0')}</text>
                <text x="895" y={y2 + 6} fill="#F4F7F8" fontSize="22" fontFamily="'JetBrains Mono', monospace" opacity={local}>{String((rightRank.get(seriesIndex) ?? 0) + 1).padStart(2, '0')}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
