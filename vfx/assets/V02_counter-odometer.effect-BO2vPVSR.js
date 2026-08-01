const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const target = Math.max(0, Math.round(Number(ctx.params.value ?? 2048)));
    const speed = Number(ctx.params.speed ?? 1);
    const digits = Math.round(Number(ctx.params.digits ?? 4));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const raw = Math.min(1, Math.max(0, (ctx.t - 0.06) * 2.2 * speed));
    const progress = 1 - (1 - raw) * (1 - raw) * (1 - raw);
    const current = Math.round(target * progress);
    const values = String(current).padStart(digits, '0').slice(-digits).split('').map(Number);
    const slotHeight = Math.max(30, ctx.height * 0.24);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: (0.1 + progress * 0.22) * outro,
            transform: \`scale(\${0.92 + progress * 0.08})\`,
            filter: \`blur(\${(1 - progress) * 4}px)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: Math.max(2, ctx.width * 0.006),
            opacity: outro,
          }}
        >
          {values.map((digit, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: Math.max(24, ctx.width * 0.065),
                height: slotHeight,
                overflow: 'hidden',
                border: \`1px solid \${signal}55\`,
                background: '#0D0E10E8',
                boxShadow: \`inset 0 0 18px \${signal}16\`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  transform: \`translateY(\${-digit * slotHeight}px)\`,
                  transition: 'none',
                }}
              >
                {Array.from({ length: 10 }, (_, number) => (
                  <div
                    key={number}
                    style={{
                      height: slotHeight,
                      display: 'grid',
                      placeItems: 'center',
                      color: number === digit ? signal : '#8A8D93',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: slotHeight * 0.64,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
