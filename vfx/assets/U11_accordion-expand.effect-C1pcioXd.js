const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sectionCount = Math.min(5, Math.max(3, Math.round(Number(ctx.params.sections ?? 4))));
    const speed = Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1)));
    const easing = String(ctx.params.easing ?? 'soft');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const loopCount = speed >= 1.75 ? 3 : speed >= 1.25 ? 2 : 1;
    const phase = (ctx.t * loopCount) % 1;
    const traversal = (0.5 - 0.5 * Math.cos(Math.PI * 2 * phase)) * (sectionCount - 1);
    const labels = ['OVERVIEW', 'SIGNAL PATH', 'PARAMETERS', 'OUTPUT', 'NOTES'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F6F8FA', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.13, transform: 'scale(0.88)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '20%', right: '20%', top: '10%', bottom: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
          {labels.slice(0, sectionCount).map((label, index) => {
            const raw = Math.max(0, 1 - Math.abs(traversal - index));
            const open = easing === 'snappy' ? Math.min(1, raw * 1.6) : raw * raw * (3 - 2 * raw);
            const contentOpacity = Math.max(0, (open - 0.2) / 0.8);
            return (
              <div key={label} style={{ height: 36 + open * Math.max(34, ctx.height * 0.09), flexShrink: 0, overflow: 'hidden', border: \`1px solid \${open > 0.5 ? signal : '#FFFFFF24'}\`, borderRadius: 8, background: open > 0.5 ? '#152127F2' : '#14181DDE', boxShadow: open > 0.5 ? \`0 0 20px \${signal}18\` : 'none' }}>
                <div style={{ height: 36, padding: '0 3.5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  <span style={{ color: open > 0.5 ? '#FFFFFF' : '#C9D0D5', fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 750, letterSpacing: '0.08em' }}>{label}</span>
                  <span style={{ color: signal, fontSize: Math.max(14, ctx.width * 0.019), lineHeight: 1, transform: \`rotate(\${open * 45}deg)\` }}>+</span>
                </div>
                <div style={{ padding: '1% 3.5% 3%', opacity: contentOpacity, transform: \`translateY(\${(1 - open) * 9}px)\` }}>
                  <div style={{ width: \`\${58 + index * 5}%\`, height: 5, borderRadius: 4, background: '#F6F8FABD', marginBottom: 7 }} />
                  <div style={{ width: \`\${42 + index * 4}%\`, height: 5, borderRadius: 4, background: signal, opacity: 0.72 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
