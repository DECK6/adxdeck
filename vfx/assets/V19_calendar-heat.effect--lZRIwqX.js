const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const weeks = Math.max(12, Math.min(32, Math.round(Number(ctx.params.weeks ?? 24))));
    const intensity = Math.max(0.35, Math.min(1, Number(ctx.params.intensity ?? 0.82)));
    const gap = Math.max(2, Math.min(10, Number(ctx.params.gap ?? 5)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const loop = 0.5 - Math.cos(ctx.t * Math.PI * 2) * 0.5;
    const head = loop * (weeks + 7);
    const cells = Array.from({ length: weeks * 7 }, (_, index) => {
      const week = Math.floor(index / 7);
      const day = index % 7;
      const value = 0.12 + ctx.random(\`day:\${index}\`) * 0.88;
      const reveal = Math.max(0, Math.min(1, head - week - day * 0.16));
      return { index, week, day, value, reveal };
    });

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace", color: '#F4F7F8' }}>
        <div style={{ position: 'absolute', inset: '22%', opacity: 0.1 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '14%', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, letterSpacing: 5, fontWeight: 700 }}>DEXA VFX / ACTIVITY</div>
          <div style={{ fontSize: 15, letterSpacing: 2, color: signal }}>06 SEC LOOP</div>
        </div>
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '26%', bottom: '17%', display: 'grid', gridTemplateColumns: \`repeat(\${weeks}, minmax(0, 1fr))\`, gridTemplateRows: 'repeat(7, minmax(0, 1fr))', gridAutoFlow: 'column', gap }}>
          {cells.map((cell) => (
            <div
              key={cell.index}
              style={{
                minWidth: 0,
                minHeight: 0,
                borderRadius: 3,
                border: \`1px solid \${signal}\${cell.reveal > 0.02 ? '38' : '18'}\`,
                background: signal,
                opacity: 0.06 + cell.value * intensity * cell.reveal * 0.9,
                boxShadow: cell.reveal > 0.82 && cell.value > 0.76 ? \`0 0 12px \${signal}88\` : 'none',
              }}
            />
          ))}
        </div>
        <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '9%', display: 'flex', justifyContent: 'space-between', fontSize: 13, letterSpacing: 2, color: '#AAB2B7' }}>
          <span>MON</span><span>WED</span><span>FRI</span><span>DEXA VFX DATA</span>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
