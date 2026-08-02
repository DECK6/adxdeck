const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const thickness = Math.max(8, Math.min(28, Number(ctx.params.thickness ?? 16)));
    const gap = Math.max(5, Math.min(24, Number(ctx.params.gap ?? 12)));
    const sweep = Math.max(0.4, Math.min(1, Number(ctx.params.sweep ?? 0.84)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const reveal = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const values = [0.78, 0.62, 0.91];
    const labels = ['DEXA', 'VFX', 'SIGNAL'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F4F7F8', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '24%', opacity: 0.09 }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', left: '7%', top: '10%', width: '62%', height: '80%', overflow: 'visible' }}>
          {values.map((value, index) => {
            const radius = 250 - index * (thickness + gap + 20);
            const circumference = Math.PI * 2 * radius;
            const local = Math.max(0, Math.min(1, reveal * 1.55 - index * 0.25));
            return (
              <g key={labels[index]} transform="rotate(-90 500 500)">
                <circle cx="500" cy="500" r={radius} fill="none" stroke="#273036" strokeWidth={thickness} opacity="0.75" />
                <circle cx="500" cy="500" r={radius} fill="none" stroke={signal} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={\`\${circumference * value * sweep * local} \${circumference}\`} opacity={1 - index * 0.2} style={{ filter: \`drop-shadow(0 0 \${8 - index}px \${signal})\` }} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: 'absolute', right: '8%', top: '25%', width: '24%', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {values.map((value, index) => (
            <div key={labels[index]} style={{ borderLeft: \`3px solid \${signal}\`, paddingLeft: 18, opacity: 1 - index * 0.15 }}>
              <div style={{ color: '#AAB2B7', fontSize: 14, letterSpacing: 3 }}>{labels[index]}</div>
              <div style={{ marginTop: 5, fontSize: 34, fontWeight: 700 }}>{Math.round(value * sweep * reveal * 100)}%</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: \`\${9 + reveal * 52}%\`, bottom: '8%', width: 12, height: 12, marginLeft: -6, borderRadius: '50%', background: signal, boxShadow: \`0 0 14px \${signal}\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
