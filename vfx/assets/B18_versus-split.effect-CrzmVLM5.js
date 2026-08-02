const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const angle = Math.min(28, Math.max(8, Number(ctx.params.angle ?? 18)));
    const impact = Math.min(1, Math.max(0, Number(ctx.params.impact ?? 0.82)));
    const matchup = String(ctx.params.matchup ?? 'DEXA / VFX').split(' / ');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = 0.5 - 0.5 * Math.cos(ctx.t * Math.PI * 2);
    const slam = 1 - Math.pow(1 - Math.min(1, phase * 3.2), 3);
    const split = 50 + Math.tan((angle * Math.PI) / 180) * 10;
    const stampScale = 0.72 + slam * 0.28 + Math.sin(ctx.t * Math.PI * 8) * (1 - slam) * 0.08 * impact;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: '12%', display: 'grid', placeItems: 'center', opacity: 0.1, filter: 'grayscale(1)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, clipPath: \`polygon(0 0, \${split}% 0, \${100 - split}% 100%, 0 100%)\`, background: \`linear-gradient(135deg, \${signal}31, #11161B 62%)\`, transform: \`translateX(\${(1 - slam) * -22}%)\` }}>
          <div style={{ position: 'absolute', left: '9%', top: '17%', color: signal, fontSize: Math.max(9, ctx.width * 0.01), fontWeight: 800, letterSpacing: '0.24em' }}>SIDE / A</div>
          <div style={{ position: 'absolute', left: '8%', bottom: '18%', fontSize: Math.max(30, ctx.width * 0.062), fontWeight: 900, letterSpacing: '-0.06em' }}>{matchup[0] ?? 'DEXA'}</div>
          <div style={{ position: 'absolute', left: '8%', bottom: '12%', width: '27%', height: 5, background: signal, boxShadow: \`0 0 18px \${signal}\` }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, clipPath: \`polygon(\${split}% 0, 100% 0, 100% 100%, \${100 - split}% 100%)\`, background: 'linear-gradient(315deg, #ECEFF1 0%, #65727C 100%)', transform: \`translateX(\${(1 - slam) * 22}%)\` }}>
          <div style={{ position: 'absolute', right: '9%', top: '17%', color: '#15191D', fontSize: Math.max(9, ctx.width * 0.01), fontWeight: 900, letterSpacing: '0.24em' }}>SIDE / B</div>
          <div style={{ position: 'absolute', right: '8%', bottom: '18%', color: '#0D0E10', fontSize: Math.max(30, ctx.width * 0.062), fontWeight: 900, letterSpacing: '-0.06em' }}>{matchup[1] ?? 'VFX'}</div>
          <div style={{ position: 'absolute', right: '8%', bottom: '12%', width: '27%', height: 5, background: '#0D0E10' }} />
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: Math.min(ctx.width, ctx.height) * 0.25, aspectRatio: '1', display: 'grid', placeItems: 'center', borderRadius: '50%', border: \`3px solid \${signal}\`, background: '#0D0E10', boxShadow: \`0 0 0 9px #0D0E10, 0 0 34px \${signal}99\`, transform: \`translate(-50%, -50%) rotate(-8deg) scale(\${stampScale})\` }}>
          <span style={{ color: '#FFFFFF', fontSize: Math.max(28, ctx.width * 0.052), fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.08em' }}>VS</span>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: signal, opacity: 0.55, transform: \`translateX(-50%) skewX(\${-angle}deg)\`, boxShadow: \`0 0 22px \${signal}\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
