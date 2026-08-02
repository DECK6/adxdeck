const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - (1 - clamp01(value)) ** 3;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const title = String(ctx.params.title ?? 'DEXA VFX');
    const blur = Number(ctx.params.blur ?? 16);
    const frost = Number(ctx.params.frost ?? 0.42);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bloom = easeOut((ctx.t - 0.05) / 0.24);
    const textIn = easeOut((ctx.t - 0.19) / 0.17);
    const sheen = clamp01((ctx.t - 0.12) / 0.36);
    const outro = clamp01((1 - ctx.t) / 0.11);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            left: '7%',
            bottom: '9%',
            width: '58%',
            height: '18%',
            overflow: 'hidden',
            borderRadius: Math.max(8, ctx.width * 0.009),
            border: \`1px solid \${signal}52\`,
            background: \`linear-gradient(110deg, rgba(20,25,29,\${0.58 + frost * 0.28}), rgba(57,70,75,\${0.2 + frost * 0.2}), rgba(15,18,21,\${0.62 + frost * 0.24}))\`,
            backdropFilter: \`blur(\${blur}px) saturate(1.35)\`,
            WebkitBackdropFilter: \`blur(\${blur}px) saturate(1.35)\`,
            boxShadow: \`inset 0 1px 0 rgba(255,255,255,0.2), 0 22px 52px rgba(0,0,0,0.42), 0 0 26px \${signal}14\`,
            opacity: bloom * outro,
            transform: \`scaleX(\${0.08 + bloom * 0.92}) scaleY(\${0.82 + bloom * 0.18})\`,
            transformOrigin: '50% 50%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-45%',
              bottom: '-45%',
              left: \`\${-35 + sheen * 150}%\`,
              width: '13%',
              transform: 'skewX(-18deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            }}
          />
          <div style={{ position: 'absolute', left: '5%', top: '22%', right: '6%', color: '#F7FAFC', opacity: textIn, transform: \`translate3d(0, \${(1 - textIn) * 16}px, 0)\` }}>
            <div style={{ color: signal, fontSize: Math.max(7, ctx.width * 0.009), fontWeight: 800, letterSpacing: '0.22em', marginBottom: '0.5em' }}>
              SIGNAL / 07
            </div>
            <div style={{ fontSize: Math.max(12, ctx.width * 0.028), fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>
              {title}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: '-28%', height: 1, background: \`linear-gradient(90deg, \${signal}, \${signal}22, transparent)\` }} />
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
