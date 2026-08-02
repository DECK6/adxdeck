const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rays = Math.min(48, Math.max(12, Math.round(Number(ctx.params.rays ?? 28))));
    const modulation = Math.min(1, Math.max(0, Number(ctx.params.modulation ?? 0.68)));
    const turns = Math.min(4, Math.max(1, Math.round(Number(ctx.params.turns ?? 2))));
    const weight = Math.min(8, Math.max(1, Number(ctx.params.weight ?? 3.5)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const rotation = ctx.t * turns * 360;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '32%', opacity: 0.32, filter: \`grayscale(1) drop-shadow(0 0 8px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '2%', width: '96%', height: '96%', filter: \`drop-shadow(0 0 \${weight * 2.5}px \${signal})\` }}>
          <g transform={\`rotate(\${rotation} 500 500)\`}>
            {Array.from({ length: rays }, (_, index) => {
              const angle = (index / rays) * TAU;
              const wave = 0.5 + 0.5 * Math.sin(phase * 2 + index * 1.73);
              const active = wave >= modulation * 0.58;
              const inner = 92 + wave * 34;
              const outer = 300 + wave * 155;
              return (
                <line
                  key={index}
                  x1={500 + Math.cos(angle) * inner}
                  y1={500 + Math.sin(angle) * inner}
                  x2={500 + Math.cos(angle) * outer}
                  y2={500 + Math.sin(angle) * outer}
                  stroke={signal}
                  strokeWidth={active ? weight : Math.max(0.7, weight * 0.32)}
                  strokeLinecap="round"
                  opacity={active ? 0.9 : 0.1 + wave * 0.2}
                />
              );
            })}
          </g>
          <circle cx="500" cy="500" r={76 + Math.sin(phase * 2) * 8} fill="none" stroke={signal} strokeWidth={weight * 0.7} opacity="0.42" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
