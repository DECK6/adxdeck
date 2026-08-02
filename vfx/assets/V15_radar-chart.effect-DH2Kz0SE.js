const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const axes = Math.max(4, Math.min(8, Math.round(Number(ctx.params.axes ?? 6))));
    const amplitude = Math.max(0.35, Math.min(1, Number(ctx.params.amplitude ?? 0.82)));
    const rings = Math.max(3, Math.min(6, Math.round(Number(ctx.params.rings ?? 5))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2;
    const progress = 0.5 - Math.cos(phase) * 0.5;
    const eased = progress * progress * (3 - 2 * progress);
    const center = 500;
    const radius = 345;
    const labels = ['MOTION', 'CLARITY', 'DEPTH', 'ENERGY', 'RHYTHM', 'SIGNAL', 'FOCUS', 'RANGE'];
    const polar = (index: number, distance: number): { x: number; y: number } => {
      const angle = -Math.PI / 2 + (index / axes) * Math.PI * 2;
      return { x: center + Math.cos(angle) * distance, y: center + Math.sin(angle) * distance };
    };
    const polygon = (distanceAt: (index: number) => number): string => Array.from({ length: axes }, (_, index) => {
      const point = polar(index, distanceAt(index));
      return \`\${point.x},\${point.y}\`;
    }).join(' ');
    const values = Array.from({ length: axes }, (_, index) => (0.48 + ctx.random(\`axis:\${index}\`) * 0.5) * amplitude);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '17%', opacity: 0.1 }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%', overflow: 'visible' }}>
          {Array.from({ length: rings }, (_, index) => (
            <polygon key={index} points={polygon(() => radius * ((index + 1) / rings))} fill="none" stroke={signal} strokeWidth={index === rings - 1 ? 3 : 1.5} opacity={0.08 + index * 0.035} />
          ))}
          {Array.from({ length: axes }, (_, index) => {
            const end = polar(index, radius * eased);
            const label = polar(index, radius + 64);
            return (
              <g key={index}>
                <line x1={center} y1={center} x2={end.x} y2={end.y} stroke={signal} strokeWidth="2" opacity="0.32" />
                <text x={label.x} y={label.y} fill="#D7DDE1" fontFamily="'JetBrains Mono', monospace" fontSize="24" fontWeight="700" textAnchor="middle" dominantBaseline="middle" opacity={eased}>{labels[index]}</text>
              </g>
            );
          })}
          <polygon points={polygon((index) => radius * values[index] * eased)} fill={signal} fillOpacity="0.18" stroke={signal} strokeWidth="7" strokeLinejoin="round" style={{ filter: \`drop-shadow(0 0 13px \${signal})\` }} />
          {values.map((value, index) => {
            const point = polar(index, radius * value * eased);
            return <circle key={index} cx={point.x} cy={point.y} r={8 + eased * 5} fill="#0D0E10" stroke={signal} strokeWidth="6" />;
          })}
          <circle cx={center} cy={center} r="10" fill={signal} />
        </svg>
        <div style={{ position: 'absolute', left: '5%', top: '7%', color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: '0.18em' }}>DEXA VFX / SIGNAL PROFILE</div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
