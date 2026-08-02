const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const layout = String(ctx.params.layout ?? 'triptych');
    const punch = Math.min(1.4, Math.max(0.4, Number(ctx.params.punch ?? 0.92)));
    const ink = Math.min(1, Math.max(0, Number(ctx.params.ink ?? 0.82)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const impact = Math.pow(Math.max(0, Math.sin(phase)), 6);
    const panels = layout === 'diagonal'
      ? [
          { clipPath: 'polygon(0 0, 58% 0, 43% 100%, 0 100%)', x: -8, scale: 1.08 },
          { clipPath: 'polygon(60% 0, 100% 0, 100% 48%, 51% 57%)', x: 9, scale: 1.16 },
          { clipPath: 'polygon(50% 59%, 100% 50%, 100% 100%, 42% 100%)', x: 13, scale: 1.24 },
        ]
      : [
          { clipPath: 'polygon(0 0, 34% 0, 29% 100%, 0 100%)', x: -15, scale: 1.14 },
          { clipPath: 'polygon(36% 0, 68% 0, 72% 100%, 31% 100%)', x: 0, scale: 1.04 },
          { clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 74% 100%)', x: 15, scale: 1.18 },
        ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, background: \`repeating-conic-gradient(from \${phase * 0.08}rad at 50% 50%, transparent 0deg 7deg, \${signal}18 8deg 9deg)\` }} />
        {panels.map((panel, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 8,
              clipPath: panel.clipPath,
              background: index === 1 ? \`\${signal}12\` : '#121519',
              filter: \`contrast(\${1.05 + ink * 0.75}) saturate(\${0.35 + ink * 0.35}) drop-shadow(0 0 \${2 + ink * 3}px \${signal})\`,
              transform: \`translateX(\${panel.x * impact * punch}px)\`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, transform: \`scale(\${panel.scale + impact * 0.06 * punch}) rotate(\${(index - 1) * impact * 1.4}deg)\` }}>
              {ctx.subjectNode}
            </div>
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 8, border: \`\${Math.max(3, 4 * ink)}px solid #050607\`, boxShadow: \`inset 0 0 0 1px \${signal}77\`, pointerEvents: 'none' }} />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '10%',
            padding: '9px 15px',
            transform: \`rotate(-8deg) scale(\${0.82 + impact * 0.34 * punch})\`,
            background: '#E9FDFF',
            color: '#0D0E10',
            border: '4px solid #050607',
            boxShadow: \`5px 6px 0 \${signal}\`,
            fontFamily: 'Impact, sans-serif',
            fontSize: Math.max(20, Math.min(ctx.width, ctx.height) * 0.065),
            fontWeight: 900,
            letterSpacing: 2,
            lineHeight: 0.9,
          }}
        >
          KRAK!
        </div>
        <div style={{ position: 'absolute', left: 18, bottom: 16, padding: '4px 8px', background: '#0D0E10', color: '#E9FDFF', border: \`2px solid \${signal}\`, fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>
          ISSUE Y16 // {Math.floor((ctx.t % 1) * 99).toString().padStart(2, '0')}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
