const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp01(value), 4);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const value = Math.round(Number(ctx.params.value ?? 87));
    const unit = String(ctx.params.unit ?? '%');
    const label = String(ctx.params.label ?? 'DEXA REACH');
    const speed = Number(ctx.params.speed ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = easeOut((ctx.t - 0.06) * 3.2 * speed);
    const current = Math.round(value * progress);
    const intro = easeOut(ctx.t * 6);
    const outro = clamp01((1 - ctx.t) / 0.09);
    const ticks = 19;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 * outro }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '8%', top: '15%', bottom: '15%', width: '58%', background: '#111418EB', borderLeft: \`4px solid \${signal}\`, transform: \`translateX(\${(1 - intro) * -ctx.width * 0.12}px)\`, opacity: outro, boxShadow: \`18px 0 50px #00000055\` }}>
          <div style={{ position: 'absolute', left: '8%', top: '13%', color: '#B8C0C4', fontSize: Math.max(8, ctx.height * 0.022), letterSpacing: '0.2em' }}>DEXA DATA / LIVE METRIC</div>
          <div data-layout-allow-overlap style={{ position: 'absolute', left: '7%', top: '27%', display: 'flex', alignItems: 'flex-start', color: '#F4F7F8', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ fontSize: Math.max(64, ctx.height * 0.32), lineHeight: 0.86, fontWeight: 900, letterSpacing: '-0.08em' }}>{current}</span>
            <span style={{ marginLeft: '0.18em', color: signal, fontSize: Math.max(20, ctx.height * 0.095), lineHeight: 1, fontWeight: 800 }}>{unit}</span>
          </div>
          <div style={{ position: 'absolute', left: '8%', bottom: '18%', color: signal, fontSize: Math.max(10, ctx.height * 0.039), fontWeight: 700, letterSpacing: '0.14em' }}>{label}</div>
          <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '10%', height: 3, background: \`\${signal}25\` }}>
            <div style={{ width: \`\${progress * 100}%\`, height: '100%', background: signal, boxShadow: \`0 0 12px \${signal}\` }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: '8%', top: '20%', bottom: '20%', width: '17%', opacity: intro * outro }}>
          {Array.from({ length: ticks }, (_, index) => {
            const active = index / (ticks - 1) <= progress;
            return <div key={index} style={{ position: 'absolute', right: 0, top: \`\${(index / (ticks - 1)) * 100}%\`, width: index % 3 === 0 ? '100%' : '55%', height: 2, background: active ? signal : '#647077', opacity: active ? 0.9 : 0.28, transform: \`scaleX(\${intro})\`, transformOrigin: 'right' }} />;
          })}
          <div data-layout-allow-overlap style={{ position: 'absolute', right: 0, top: \`\${(1 - progress) * 100}%\`, transform: 'translateY(-50%)', color: '#F4F7F8', fontSize: Math.max(8, ctx.height * 0.024), letterSpacing: '0.12em' }}>{String(current).padStart(3, '0')}</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
