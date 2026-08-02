const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const urgency = Math.min(1, Math.max(0, Number(ctx.params.urgency ?? 0.82)));
    const strobes = Math.min(8, Math.max(2, Math.round(Number(ctx.params.strobes ?? 5))));
    const headline = String(ctx.params.headline ?? 'DEXA VFX BREAKING');
    const bandCount = Math.min(6, Math.max(2, Math.round(Number(ctx.params.bands ?? 4))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const pulse = 0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 2 * strobes);
    const reveal = Math.min(1, ctx.t * 7) * Math.min(1, (1 - ctx.t) * 7);
    const slashOffset = (ctx.t * 140) % 28;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#FFFFFF', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '12%', display: 'grid', placeItems: 'center', opacity: 0.08 + pulse * 0.04, filter: 'grayscale(1)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 + pulse * urgency * 0.16, background: \`repeating-linear-gradient(112deg, transparent \${slashOffset}px, transparent \${slashOffset + 13}px, \${signal} \${slashOffset + 14}px, \${signal} \${slashOffset + 16}px, transparent \${slashOffset + 17}px, transparent \${slashOffset + 28}px)\` }} />
        {Array.from({ length: bandCount }, (_, index) => (
          <div key={index} style={{ position: 'absolute', left: 0, right: 0, top: \`\${9 + index * (82 / Math.max(1, bandCount - 1))}%\`, height: index % 2 === 0 ? 3 : 1, background: index % 2 === 0 ? signal : '#FFFFFF', opacity: 0.28 + pulse * urgency * 0.5, transform: \`translateX(\${(index % 2 === 0 ? 1 : -1) * (1 - reveal) * 48}%)\`, boxShadow: index % 2 === 0 ? \`0 0 18px \${signal}\` : 'none' }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '13%', height: '11%', display: 'flex', alignItems: 'center', background: signal, color: '#0D0E10', transform: \`translateX(\${(1 - reveal) * -105}%)\`, boxShadow: \`0 0 \${16 + pulse * 28}px \${signal}66\` }}>
          <div style={{ marginLeft: '7%', fontSize: Math.max(12, ctx.width * 0.016), fontWeight: 900, letterSpacing: '0.24em' }}>BREAKING / SIGNAL 07</div>
        </div>
        <div style={{ position: 'absolute', left: '7%', right: '7%', top: '35%', transform: \`translateY(\${(1 - reveal) * 42}px)\`, opacity: reveal }}>
          <div style={{ color: signal, fontSize: Math.max(9, ctx.width * 0.01), fontWeight: 800, letterSpacing: '0.28em' }}>NOW TRANSMITTING</div>
          <div style={{ marginTop: '2%', maxWidth: '92%', fontSize: Math.max(31, ctx.width * 0.067), lineHeight: 0.92, fontWeight: 900, letterSpacing: '-0.075em', textTransform: 'uppercase', textShadow: pulse > 0.75 ? \`3px 0 0 \${signal}66\` : 'none' }}>{headline}</div>
          <div style={{ marginTop: '3%', width: \`\${38 + pulse * urgency * 38}%\`, height: 7, background: signal, boxShadow: \`0 0 18px \${signal}\` }} />
        </div>
        <div style={{ position: 'absolute', left: '7%', right: '7%', bottom: '8%', display: 'flex', justifyContent: 'space-between', color: '#D5DDE2', fontSize: Math.max(8, ctx.width * 0.009), fontWeight: 700, letterSpacing: '0.14em' }}>
          <span>DEXA NETWORK / VERIFIED FEED</span><span style={{ color: signal }}>LIVE 00:00:{Math.floor(ctx.t * 6).toString().padStart(2, '0')}</span>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
