const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const title = String(ctx.params.title ?? 'DEXA VFX');
    const pace = Math.max(2, Math.min(5, Math.round(Number(ctx.params.pace ?? 3))));
    const impact = Math.max(0.2, Math.min(1, Number(ctx.params.impact ?? 0.78)));
    const tracking = Math.max(0, Math.min(0.24, Number(ctx.params.tracking ?? 0.08)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cards = [title, 'CUT THROUGH', 'THE SIGNAL', 'COMING 06.00', 'DEXA VFX RETURNS'];
    const loopT = ctx.t % 1;
    const scaled = (loopT * pace) % 1;
    const cardIndex = Math.min(cards.length - 1, Math.floor(loopT * pace) % cards.length);
    const enter = Math.min(1, scaled / 0.12);
    const leave = Math.min(1, (1 - scaled) / 0.14);
    const visibility = Math.min(enter, leave);
    const eased = 1 - Math.pow(1 - visibility, 3);
    const scale = 1.34 - eased * (0.34 + impact * 0.08);
    const flash = Math.max(0, 1 - scaled / 0.045) * impact;
    const typeSize = Math.max(34, Math.min(ctx.width * 0.115, ctx.height * 0.19));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div
          style={{
            position: 'absolute',
            inset: '-4%',
            opacity: 0.3 + impact * 0.18,
            transform: \`scale(\${1.08 + scaled * 0.08}) translateX(\${(cardIndex % 2 === 0 ? -1 : 1) * (1 - eased) * 4}%)\`,
            filter: \`contrast(\${1.08 + impact * 0.42}) brightness(\${0.56 + eased * 0.26})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #0D0E10E8 0%, #0D0E1048 48%, #0D0E10E8 100%)' }} />
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: \`\${-12 + index * 25}%\`,
              top: '-20%',
              width: '1px',
              height: '145%',
              background: signal,
              opacity: flash * (0.18 + index * 0.035),
              transform: 'rotate(24deg)',
              boxShadow: \`0 0 22px \${signal}\`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8%',
            boxSizing: 'border-box',
            textAlign: 'center',
            opacity: eased,
            transform: \`scale(\${scale}) skewX(\${(1 - eased) * -5}deg)\`,
            filter: \`blur(\${(1 - eased) * impact * 12}px) drop-shadow(0 0 \${impact * 20}px #000)\`,
          }}
        >
          <div>
            <div style={{ color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: '0.42em', marginBottom: ctx.height * 0.035 }}>
              A DEXA MOTION EVENT / 06.00
            </div>
            <div style={{ fontSize: typeSize, lineHeight: 0.9, fontWeight: 900, letterSpacing: \`\${tracking}em\`, textShadow: \`0 4px 34px #000, 0 0 \${impact * 18}px \${signal}42\` }}>
              {cards[cardIndex]}
            </div>
            <div style={{ width: \`\${22 + eased * 56}%\`, height: 3, margin: \`\${ctx.height * 0.055}px auto 0\`, background: signal, boxShadow: \`0 0 16px \${signal}\` }} />
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: '#F7FAFC', opacity: flash * 0.62, mixBlendMode: 'screen' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
