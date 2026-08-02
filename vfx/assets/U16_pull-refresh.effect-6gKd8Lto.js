const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const pull = Math.min(1.3, Math.max(0.6, Number(ctx.params.pull ?? 1)));
    const threshold = Math.min(0.8, Math.max(0.45, Number(ctx.params.threshold ?? 0.62)));
    const style = String(ctx.params.style ?? 'arc');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t % 1;
    const gesture = phase < 0.38 ? phase / 0.38 : phase < 0.58 ? 1 : phase < 0.78 ? 1 - (phase - 0.58) / 0.2 : 0;
    const pullProgress = clamp01(gesture * pull);
    const refreshing = phase >= 0.38 && phase < 0.72 && pullProgress >= threshold;
    const complete = phase >= 0.68 && phase < 0.82;
    const panelOffset = pullProgress * ctx.height * 0.23;
    const iconSize = Math.max(36, Math.min(ctx.width, ctx.height) * 0.09);
    const rotation = refreshing ? 180 + ((phase - 0.38) / 0.34) * 720 : pullProgress * 210;
    const rows = ['DEXA VFX SIGNAL', 'FRAME CACHE', 'COLOR PIPELINE', 'OUTPUT MONITOR'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F5FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: panelOffset * 0.35 - iconSize * 0.5, width: iconSize, height: iconSize, transform: 'translateX(-50%)', opacity: clamp01(pullProgress * 1.8) }}>
          {style === 'arc' ? (
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: \`rotate(\${rotation}deg)\` }}>
              <circle cx="50" cy="50" r="34" fill="none" stroke="#384149" strokeWidth="7" />
              <circle cx="50" cy="50" r="34" fill="none" stroke={signal} strokeWidth="7" strokeLinecap="round" strokeDasharray={\`\${38 + pullProgress * 125} 214\`} style={{ filter: \`drop-shadow(0 0 5px \${signal})\` }} />
              {complete ? <path d="M34 51 L45 62 L68 38" fill="none" stroke={signal} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /> : null}
            </svg>
          ) : (
            <div style={{ position: 'absolute', inset: 0, transform: \`rotate(\${rotation}deg)\` }}>
              {Array.from({ length: 8 }, (_, index) => {
                const angle = (index / 8) * Math.PI * 2;
                return <div key={index} style={{ position: 'absolute', left: \`\${50 + Math.cos(angle) * 34}%\`, top: \`\${50 + Math.sin(angle) * 34}%\`, width: '10%', height: '10%', borderRadius: '50%', background: signal, opacity: 0.24 + index * 0.09, transform: 'translate(-50%, -50%)' }} />;
              })}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute', left: '16%', right: '16%', top: ctx.height * 0.12 + panelOffset,
            padding: '4% 5%', boxSizing: 'border-box', borderRadius: 16,
            border: \`1px solid \${pullProgress >= threshold ? signal : '#343B42'}\`,
            background: '#15181CF7', boxShadow: \`0 20px 55px #000000B8\${pullProgress >= threshold ? \`, 0 0 22px \${signal}22\` : ''}\`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F7FAFC', fontSize: Math.max(9, ctx.width * 0.015), fontWeight: 800, letterSpacing: '0.09em', marginBottom: '5%' }}>
            <span>DEXA VFX FEED</span><span style={{ color: signal }}>{complete ? 'UPDATED' : refreshing ? 'REFRESHING' : pullProgress >= threshold ? 'RELEASE' : 'PULL'}</span>
          </div>
          {rows.map((label, index) => (
            <div key={label} style={{ height: Math.max(42, ctx.height * 0.095), marginBottom: 8, borderRadius: 9, border: '1px solid #FFFFFF1C', background: '#1A1E23', display: 'flex', alignItems: 'center', padding: '0 4%', boxSizing: 'border-box' }}>
              <div style={{ width: Math.max(18, ctx.height * 0.038), height: Math.max(18, ctx.height * 0.038), borderRadius: 5, background: \`\${signal}\${index === 0 ? 'B8' : '35'}\` }} />
              <span style={{ marginLeft: '4%', color: '#D8E0E5', fontSize: Math.max(8, ctx.width * 0.011), letterSpacing: '0.06em' }}>{label}</span>
              <span style={{ marginLeft: 'auto', color: '#89949C', fontSize: Math.max(7, ctx.width * 0.009) }}>00:{String(index * 7 + 3).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
