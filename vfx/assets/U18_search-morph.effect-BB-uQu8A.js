const e=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const speed = Math.min(1.6, Math.max(0.6, Number(ctx.params.speed ?? 1)));
    const widthRatio = Math.min(0.82, Math.max(0.45, Number(ctx.params.width ?? 0.68)));
    const query = String(ctx.params.query ?? 'DEXA VFX');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.t * speed) % 1;
    const opening = phase < 0.2 ? ease(phase / 0.2) : phase < 0.86 ? 1 : 1 - ease((phase - 0.86) / 0.14);
    const typing = phase < 0.26 ? 0 : phase < 0.56 ? ease((phase - 0.26) / 0.3) : phase < 0.72 ? 1 : phase < 0.86 ? 1 - ease((phase - 0.72) / 0.14) : 0;
    const visibleChars = Math.min(query.length, Math.floor(typing * (query.length + 1)));
    const shown = query.slice(0, visibleChars);
    const base = Math.max(52, Math.min(ctx.width, ctx.height) * 0.13);
    const expandedWidth = Math.min(ctx.width * widthRatio, ctx.height * 1.2);
    const controlWidth = base + (expandedWidth - base) * opening;
    const radius = base * 0.5;
    const left = (ctx.width - controlWidth) * 0.5;
    const top = ctx.height * 0.5 - base * 0.5;
    const caret = Math.floor(ctx.frame / Math.max(1, Math.round(ctx.fps * 0.28))) % 2 === 0;
    const results = ['DEXA VFX / SIGNAL MAP', 'DEXA VFX / MOTION PRESET', 'DEXA VFX / FRAME CACHE'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, transform: \`scale(\${0.94 - opening * 0.03})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left, top, width: controlWidth, height: base, borderRadius: radius, border: \`2px solid \${signal}\`, background: '#15191DF5', boxSizing: 'border-box', boxShadow: \`0 16px 42px #000000B5, 0 0 \${10 + opening * 18}px \${signal}30\`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: base * 0.29, top: base * 0.27, width: base * 0.29, height: base * 0.29, borderRadius: '50%', border: \`3px solid \${signal}\`, boxSizing: 'border-box', transform: \`scale(\${1 - opening * 0.17})\` }} />
          <div style={{ position: 'absolute', left: base * 0.54, top: base * 0.54, width: base * 0.2, height: 3, borderRadius: 3, background: signal, transformOrigin: 'left center', transform: \`rotate(45deg) scaleX(\${1 - opening * 0.28})\` }} />
          <div style={{ position: 'absolute', left: base * 0.92, right: base * 0.7, top: '50%', transform: 'translateY(-50%)', opacity: ease((opening - 0.35) / 0.65), whiteSpace: 'nowrap', overflow: 'hidden', color: '#F7FAFC', fontSize: Math.max(11, base * 0.24), fontWeight: 700, letterSpacing: '0.06em' }}>
            {shown}<span style={{ display: 'inline-block', width: 2, height: base * 0.28, marginLeft: 4, verticalAlign: 'middle', background: signal, opacity: caret && opening > 0.8 ? 1 : 0 }} />
          </div>
          <div style={{ position: 'absolute', right: base * 0.26, top: '50%', width: base * 0.22, height: 2, background: '#849098', transform: \`translateY(-50%) scaleX(\${opening})\`, opacity: opening }} />
        </div>
        <div style={{ position: 'absolute', left, top: top + base * 1.18, width: controlWidth, border: '1px solid #343C43', borderRadius: 12, background: '#14181CEB', boxShadow: '0 18px 38px #00000099', opacity: ease((typing - 0.35) / 0.45), transform: \`translateY(\${(1 - typing) * -10}px)\`, overflow: 'hidden' }}>
          {results.map((result, index) => (
            <div key={result} style={{ height: Math.max(34, base * 0.62), display: 'flex', alignItems: 'center', padding: \`0 \${base * 0.26}px\`, borderBottom: index < results.length - 1 ? '1px solid #FFFFFF12' : 'none', background: index === 0 ? \`\${signal}13\` : 'transparent', color: index === 0 ? '#F7FAFC' : '#AEB9C0', fontSize: Math.max(7, base * 0.135), letterSpacing: '0.04em' }}>
              <span style={{ color: index === 0 ? signal : '#84969E', marginRight: base * 0.18 }}>0{index + 1}</span>{result}
            </div>
          ))}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
