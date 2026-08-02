const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const choiceCount = Math.min(4, Math.max(2, Math.round(Number(ctx.params.choices ?? 3))));
    const volatility = Math.min(1, Math.max(0, Number(ctx.params.volatility ?? 0.46)));
    const poll = String(ctx.params.poll ?? 'DEXA VFX');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const labels = ['MOTION', 'SIGNAL', 'STORY', 'SYSTEM'];
    const raw = Array.from({ length: choiceCount }, (_, index) => {
      const base = 0.7 + ctx.random(\`poll:base:\${index}\`) * 0.65;
      const motion = Math.sin(ctx.t * Math.PI * 2 + ctx.random(\`poll:phase:\${index}\`) * Math.PI * 2) * volatility * 0.2;
      return Math.max(0.12, base + motion);
    });
    const total = raw.reduce((sum, value) => sum + value, 0);
    const percentages = raw.map((value) => (value / total) * 100);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F5F7F8', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '13%', display: 'grid', placeItems: 'center', opacity: 0.09, filter: 'grayscale(1)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '9%', right: '9%', top: '10%', bottom: '10%', padding: '5% 6%', boxSizing: 'border-box', border: '1px solid #FFFFFF24', background: '#111419ED', boxShadow: '0 24px 70px #00000099' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '22%' }}>
            <div>
              <div style={{ color: signal, fontSize: Math.max(9, ctx.width * 0.009), fontWeight: 800, letterSpacing: '0.22em' }}>LIVE POLL / {poll}</div>
              <div style={{ marginTop: 9, fontSize: Math.max(15, ctx.width * 0.021), fontWeight: 800, letterSpacing: '-0.03em' }}>WHAT DRIVES THE FRAME?</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D9E0E4', fontSize: Math.max(8, ctx.width * 0.008) }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: signal, boxShadow: \`0 0 12px \${signal}\` }} />
              {1240 + Math.floor(ctx.t * 184)} VOTES
            </div>
          </div>
          <div style={{ height: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {percentages.map((percentage, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: Math.max(9, ctx.width * 0.01), fontWeight: 800 }}>
                  <span>{String.fromCharCode(65 + index)} / {labels[index]}</span>
                  <span style={{ color: index === 0 ? signal : '#F5F7F8', fontSize: Math.max(11, ctx.width * 0.015) }}>{percentage.toFixed(0)}%</span>
                </div>
                <div style={{ position: 'relative', height: Math.max(8, ctx.height * 0.018), overflow: 'hidden', background: '#293139' }}>
                  <div style={{ position: 'absolute', inset: 0, width: \`\${percentage}%\`, background: index === 0 ? signal : \`linear-gradient(90deg, #596771, \${signal}99)\`, boxShadow: index === 0 ? \`0 0 18px \${signal}66\` : 'none', transition: 'none' }} />
                  <div style={{ position: 'absolute', left: \`\${percentage}%\`, top: 0, bottom: 0, width: 2, background: '#FFFFFF', transform: 'translateX(-1px)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
