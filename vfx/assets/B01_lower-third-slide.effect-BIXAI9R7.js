const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const title = String(ctx.params.title ?? 'DEXA VFX');
    const speed = Number(ctx.params.speed ?? 1);
    const accentWidth = Number(ctx.params.accentWidth ?? 0.08);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const base = smooth((ctx.t * speed - 0.035) / 0.2);
    const nameIn = smooth((ctx.t * speed - 0.13) / 0.15);
    const roleIn = smooth((ctx.t * speed - 0.2) / 0.15);
    const outro = smooth((1 - ctx.t) / 0.1);
    const fontSize = Math.max(12, ctx.width * 0.029);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            left: '6%',
            bottom: '9%',
            width: '58%',
            height: '17%',
            opacity: outro,
            transform: \`translate3d(\${(base - 1) * ctx.width * 0.7}px, 0, 0)\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#14181CEB',
              borderTop: \`1px solid \${signal}66\`,
              boxShadow: '0 18px 42px rgba(0,0,0,0.38)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: \`\${accentWidth * 100}%\`,
              background: signal,
              transform: \`scaleY(\${smooth((ctx.t * speed - 0.08) / 0.12)})\`,
              transformOrigin: 'bottom',
            }}
          />
          <div style={{ position: 'absolute', left: \`\${accentWidth * 100 + 4}%\`, right: '5%', top: '21%', overflow: 'hidden' }}>
            <div
              style={{
                color: '#F5F8FA',
                fontSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                opacity: nameIn,
                transform: \`translate3d(\${(1 - nameIn) * 48}px, 0, 0)\`,
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ position: 'absolute', left: \`\${accentWidth * 100 + 4}%\`, right: '5%', bottom: '17%', overflow: 'hidden' }}>
            <div
              style={{
                color: '#C7CFD4',
                fontSize: Math.max(8, ctx.width * 0.011),
                fontWeight: 700,
                letterSpacing: '0.18em',
                opacity: roleIn,
                transform: \`translate3d(\${(1 - roleIn) * 34}px, 0, 0)\`,
                whiteSpace: 'nowrap',
              }}
            >
              MOTION SYSTEMS / ON AIR
            </div>
          </div>
          <div style={{ position: 'absolute', right: '3%', top: '14%', width: '7%', height: 2, background: signal, opacity: 0.72 * roleIn }} />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
