const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.max(5, Math.min(10, Math.round(Number(ctx.params.points ?? 8))));
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 1))));
    const amplitude = Math.max(0.35, Math.min(1, Number(ctx.params.amplitude ?? 0.72)));
    const panel = String(ctx.params.panel ?? 'compact');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const left = ctx.width * 0.17;
    const top = ctx.height * 0.2;
    const width = ctx.width * 0.66;
    const height = ctx.height * 0.56;
    const values = Array.from({ length: count }, (_, index) => 0.18 + ctx.random(\`chart:\${index}\`) * 0.7);
    const path = values.map((value, index) => {
      const x = left + (index / (count - 1)) * width;
      const y = top + height * (0.85 - value * amplitude);
      return \`\${index === 0 ? 'M' : 'L'} \${x} \${y}\`;
    }).join(' ');
    const travel = 0.5 - 0.5 * Math.cos(ctx.t * Math.PI * 2 * cycles);
    const scaled = travel * (count - 1);
    const lower = Math.min(count - 2, Math.floor(scaled));
    const mix = scaled - lower;
    const value = values[lower] + (values[lower + 1] - values[lower]) * mix;
    const x = left + travel * width;
    const y = top + height * (0.85 - value * amplitude);
    const tooltipWidth = panel === 'wide' ? ctx.width * 0.24 : ctx.width * 0.18;
    const tooltipLeft = Math.min(ctx.width - tooltipWidth - ctx.width * 0.04, Math.max(ctx.width * 0.04, x - tooltipWidth * 0.5));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4FAFB', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '17%', top: '11%', color: '#D7E1E4', fontSize: Math.max(8, ctx.width * 0.011), letterSpacing: '0.14em' }}>DEXA VFX / SIGNAL INDEX</div>
        <svg viewBox={\`0 0 \${ctx.width} \${ctx.height}\`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {Array.from({ length: 5 }, (_, index) => (
            <line key={index} x1={left} x2={left + width} y1={top + height * index / 4} y2={top + height * index / 4} stroke="#D9F8FC" strokeOpacity="0.1" />
          ))}
          <path d={\`\${path} L \${left + width} \${top + height} L \${left} \${top + height} Z\`} fill={\`\${signal}14\`} />
          <path d={path} fill="none" stroke={signal} strokeWidth={Math.max(2, ctx.width * 0.003)} strokeLinejoin="round" style={{ filter: \`drop-shadow(0 0 7px \${signal})\` }} />
          <line x1={x} x2={x} y1={top} y2={top + height} stroke={signal} strokeDasharray="4 5" strokeOpacity="0.65" />
          <line x1={left} x2={left + width} y1={y} y2={y} stroke={signal} strokeDasharray="4 5" strokeOpacity="0.3" />
          <circle cx={x} cy={y} r={Math.max(5, ctx.width * 0.007)} fill="#0D0E10" stroke={signal} strokeWidth="3" />
        </svg>
        <div style={{ position: 'absolute', left: tooltipLeft, top: Math.max(ctx.height * 0.08, y - ctx.height * 0.19), width: tooltipWidth, padding: '2.2% 2.6%', boxSizing: 'border-box', border: \`1px solid \${signal}\`, borderRadius: 8, background: '#151A1DEB', boxShadow: \`0 10px 28px #00000099, 0 0 18px \${signal}22\`, fontSize: Math.max(7, ctx.width * 0.01) }}>
          <div style={{ color: signal, letterSpacing: '0.12em', marginBottom: '0.55em' }}>FRAME {String(Math.round(travel * 180)).padStart(3, '0')}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFFFFF' }}><span>DEXA VFX</span><span>{Math.round(value * 100)}%</span></div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
