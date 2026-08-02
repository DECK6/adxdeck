const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp01(value), 3);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const quote = String(ctx.params.quote ?? 'MOTION WITH INTENT');
    const source = String(ctx.params.source ?? 'DEXA VFX');
    const align = String(ctx.params.align ?? 'left');
    const reveal = Number(ctx.params.reveal ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const intro = easeOut((ctx.t - 0.03) * 4.2 * reveal);
    const textIn = easeOut((ctx.t - 0.13) * 3.6 * reveal);
    const sourceIn = easeOut((ctx.t - 0.27) * 4 * reveal);
    const outro = clamp01((1 - ctx.t) / 0.09);
    const centered = align === 'center';
    const words = quote.split(' ');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 * outro, transform: \`scale(\${1.04 - intro * 0.04})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: centered ? '15%' : '10%', right: centered ? '15%' : '22%', top: '14%', bottom: '14%', border: \`1px solid \${signal}35\`, background: '#111316E8', transform: \`translateY(\${(1 - intro) * ctx.height * 0.08}px)\`, opacity: intro * outro, boxShadow: \`0 20px 60px #00000066, inset 0 0 40px \${signal}08\` }}>
          <div data-layout-allow-overflow style={{ position: 'absolute', left: centered ? '50%' : '7%', top: '-9%', transform: \`translateX(\${centered ? '-50%' : '0'}) scale(\${0.65 + intro * 0.35})\`, transformOrigin: 'center', color: signal, fontFamily: 'Georgia, serif', fontSize: Math.max(90, ctx.height * 0.31), fontWeight: 700, lineHeight: 1, opacity: 0.9 }}>“</div>
          <div style={{ position: 'absolute', left: '7%', right: '7%', top: '34%', color: '#F3F6F7', fontSize: Math.max(22, ctx.height * 0.1), fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.055em', textAlign: centered ? 'center' : 'left', textWrap: 'balance' }}>
            {words.map((word, index) => {
              const wordIn = easeOut((textIn - index * 0.07) / 0.58);
              return <span key={\`\${word}-\${index}\`} style={{ display: 'inline-block', marginRight: '0.28em', transform: \`translateY(\${(1 - wordIn) * 0.75}em)\`, opacity: wordIn * outro }}>{word}</span>;
            })}
          </div>
          <div style={{ position: 'absolute', left: '7%', right: '7%', bottom: '17%', display: 'flex', flexDirection: centered ? 'column' : 'row', alignItems: 'center', justifyContent: centered ? 'center' : 'flex-start', gap: centered ? '0.8em' : '1.1em', opacity: sourceIn * outro }}>
            <span style={{ width: centered ? ctx.width * 0.13 : ctx.width * 0.09, height: 2, background: signal, transform: \`scaleX(\${sourceIn})\` }} />
            <span style={{ color: signal, fontSize: Math.max(8, ctx.height * 0.026), fontWeight: 700, letterSpacing: '0.18em' }}>{source}</span>
          </div>
          <div style={{ position: 'absolute', right: '4%', top: '5%', color: '#B3BABE', fontSize: Math.max(7, ctx.height * 0.017), letterSpacing: '0.12em', opacity: 0.66 }}>QUOTE / 01</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
