const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.max(8, Math.min(18, Math.round(Number(ctx.params.candles ?? 12))));
    const volatility = Math.max(0.2, Math.min(1, Number(ctx.params.volatility ?? 0.62)));
    const speed = Math.max(1, Math.min(3, Math.round(Number(ctx.params.speed ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * speed) % 1;
    const reveal = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const left = 92;
    const top = 130;
    const chartWidth = 816;
    const chartHeight = 660;
    const step = chartWidth / count;
    let previous = 0.52;
    const candles = Array.from({ length: count }, (_, index) => {
      const open = previous;
      const delta = (ctx.random(\`candle:\${index}:delta\`) - 0.46) * volatility * 0.32;
      const close = Math.max(0.12, Math.min(0.88, open + delta));
      const wick = (0.035 + ctx.random(\`candle:\${index}:wick\`) * 0.09) * volatility;
      const high = Math.min(0.96, Math.max(open, close) + wick);
      const low = Math.max(0.04, Math.min(open, close) - wick * (0.7 + ctx.random(\`candle:\${index}:low\`) * 0.6));
      previous = close;
      return { open, close, high, low };
    });
    const y = (value: number): number => top + (1 - value) * chartHeight;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '18%', opacity: 0.09 }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 900" preserveAspectRatio="none" style={{ position: 'absolute', inset: '7%', width: '86%', height: '86%' }}>
          {Array.from({ length: 6 }, (_, index) => (
            <g key={index}>
              <line x1={left} x2={left + chartWidth} y1={top + index * (chartHeight / 5)} y2={top + index * (chartHeight / 5)} stroke="#F7FAFC" strokeWidth="1" opacity="0.11" />
              <text x={left - 18} y={top + index * (chartHeight / 5)} fill="#B8C0C5" fontFamily="'JetBrains Mono', monospace" fontSize="18" textAnchor="end" dominantBaseline="middle">{(100 - index * 8).toFixed(0)}</text>
            </g>
          ))}
          {candles.map((candle, index) => {
            const local = Math.max(0, Math.min(1, reveal * (count + 2) - index));
            const eased = local * local * (3 - 2 * local);
            const x = left + step * (index + 0.5);
            const rising = candle.close >= candle.open;
            const color = rising ? signal : '#FF6B5F';
            const openY = y(candle.open);
            const closeY = y(candle.close);
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(8, Math.abs(closeY - openY));
            return (
              <g key={index} opacity={local} style={{ filter: rising ? \`drop-shadow(0 0 7px \${signal})\` : 'none' }}>
                <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke={color} strokeWidth="4" strokeDasharray="1" pathLength="1" strokeDashoffset={1 - eased} />
                <rect x={x - step * 0.27} y={bodyTop + bodyHeight * (1 - eased) * 0.5} width={step * 0.54} height={bodyHeight * eased} fill={rising ? '#0D0E10' : color} stroke={color} strokeWidth="4" />
              </g>
            );
          })}
          <line x1={left} x2={left + chartWidth * reveal} y1={top + chartHeight + 34} y2={top + chartHeight + 34} stroke={signal} strokeWidth="4" />
        </svg>
        <div style={{ position: 'absolute', left: '8%', top: '7%', color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: '0.18em' }}>DEXA VFX / OHLC SIGNAL</div>
        <div style={{ position: 'absolute', right: '8%', top: '7%', color: '#D7DDE1', fontSize: Math.max(9, ctx.width * 0.011), fontWeight: 600 }}>06.00 / LIVE</div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
