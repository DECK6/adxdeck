const t=`import type { FxKernel } from '../../src/fx/types';

function smoothstep(edge0: number, edge1: number, value: number): number {
  const x = Math.min(1, Math.max(0, (value - edge0) / Math.max(0.0001, edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const aperture = Math.min(0.62, Math.max(0.32, Number(ctx.params.aperture ?? 0.43)));
    const hold = Math.min(0.7, Math.max(0.2, Number(ctx.params.hold ?? 0.48)));
    const title = String(ctx.params.title ?? 'DEXA CINEMA');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const edge = (1 - hold) * 0.5;
    const openIn = smoothstep(0, edge, ctx.t);
    const openOut = 1 - smoothstep(1 - edge, 1, ctx.t);
    const open = Math.min(openIn, openOut);
    const barHeight = 50 - aperture * 50 * open;
    const titleOpacity = smoothstep(0.18, 0.55, open) * smoothstep(0, 0.15, 1 - Math.abs(ctx.t - 0.5) * 2);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#FFFFFF', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: -12, display: 'grid', placeItems: 'center', transform: \`scale(\${1.06 - open * 0.06})\`, filter: \`brightness(\${0.62 + open * 0.38}) saturate(\${0.74 + open * 0.26})\` }}>
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: \`radial-gradient(ellipse at center, transparent 36%, #0D0E108C 100%)\`, opacity: 0.76 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: \`\${barHeight}%\`, background: '#050607', boxShadow: \`0 7px 0 \${signal}\${open > 0.08 ? '66' : '00'}\` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: \`\${barHeight}%\`, background: '#050607', boxShadow: \`0 -7px 0 \${signal}\${open > 0.08 ? '66' : '00'}\` }} />
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '50%', transform: \`translateY(\${14 - open * 14}px)\`, textAlign: 'center', opacity: titleOpacity }}>
          <div style={{ color: signal, fontSize: Math.max(8, ctx.width * 0.009), fontWeight: 800, letterSpacing: '0.42em' }}>A SIX SECOND PICTURE</div>
          <div style={{ marginTop: 12, color: '#FFFFFF', fontSize: Math.max(24, ctx.width * 0.052), fontWeight: 800, letterSpacing: '0.12em', textShadow: '0 3px 18px #000000' }}>{title}</div>
        </div>
        <div style={{ position: 'absolute', left: '4%', bottom: \`\${barHeight * 0.5}%\`, width: \`\${open * 13}%\`, height: 2, background: signal, opacity: open * 0.72 }} />
        <div style={{ position: 'absolute', right: '4%', top: \`\${barHeight * 0.5}%\`, width: \`\${open * 13}%\`, height: 2, background: signal, opacity: open * 0.72 }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
