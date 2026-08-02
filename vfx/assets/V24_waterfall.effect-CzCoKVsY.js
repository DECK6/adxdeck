const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const steps = Math.max(5, Math.min(10, Math.round(Number(ctx.params.steps ?? 7))));
    const swing = Math.max(0.35, Math.min(1, Number(ctx.params.swing ?? 0.72)));
    const spacing = Math.max(0.08, Math.min(0.28, Number(ctx.params.spacing ?? 0.16)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const deltas = Array.from({ length: steps }, (_, index) => (ctx.random(\`delta:\${index}\`) * 2 - 0.78) * 34 * swing);
    const levels = [48];
    for (const delta of deltas) levels.push(Math.max(10, Math.min(90, levels[levels.length - 1] + delta)));
    const barWidth = 700 / steps * (1 - spacing);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4F7F8', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '22%', opacity: 0.08 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '9%', top: '9%', fontSize: 20, letterSpacing: 5, fontWeight: 700 }}>DEXA VFX / DELTA</div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', left: '8%', top: '18%', width: '84%', height: '70%', overflow: 'visible' }}>
          {[20, 40, 60, 80].map((level) => <line key={level} x1="100" x2="900" y1={900 - level * 8} y2={900 - level * 8} stroke="#AAB2B7" strokeWidth="1" opacity="0.16" />)}
          {deltas.map((delta, index) => {
            const local = Math.max(0, Math.min(1, reveal * 1.45 - index / steps * 0.45));
            const x = 130 + index * (700 / steps);
            const previous = levels[index];
            const next = levels[index + 1];
            const topLevel = Math.max(previous, next);
            const height = Math.abs(next - previous) * 8 * local;
            const y = 900 - topLevel * 8 + (delta < 0 ? (1 - local) * Math.abs(next - previous) * 8 : 0);
            return (
              <g key={index}>
                {index > 0 && <line x1={x - 700 / steps + barWidth} x2={x} y1={900 - previous * 8} y2={900 - previous * 8} stroke={signal} strokeWidth="2" strokeDasharray="8 8" opacity={local * 0.42} />}
                <rect x={x} y={y} width={barWidth} height={Math.max(2, height)} rx="5" fill={signal} opacity={delta >= 0 ? 0.82 : 0.32} style={{ filter: delta >= 0 ? \`drop-shadow(0 0 8px \${signal})\` : 'none' }} />
                <text x={x + barWidth / 2} y="950" textAnchor="middle" fill="#AAB2B7" fontSize="18" fontFamily="'JetBrains Mono', monospace">{String(index + 1).padStart(2, '0')}</text>
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
