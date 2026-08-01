const t=`import type { FxKernel } from '../../src/fx/types';

const buildSpiral = (turns: number, spread: number): string => {
  const segments = 160;
  return Array.from({ length: segments + 1 }, (_, index) => {
    const progress = index / segments;
    const angle = progress * turns * Math.PI * 2;
    const radius = 18 + progress * 430 * spread;
    const x = 500 + Math.cos(angle) * radius;
    const y = 500 + Math.sin(angle) * radius;
    return \`\${index === 0 ? 'M' : 'L'} \${x.toFixed(2)} \${y.toFixed(2)}\`;
  }).join(' ');
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const turns = Math.min(7, Math.max(2, Number(ctx.params.turns ?? 4.5)));
    const arms = Math.max(1, Math.round(Number(ctx.params.arms ?? 3)));
    const spread = Math.min(1, Math.max(0.45, Number(ctx.params.spread ?? 0.82)));
    const weight = Math.min(8, Math.max(1, Number(ctx.params.weight ?? 3.5)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const unfold = 0.5 - 0.5 * Math.cos(ctx.t * Math.PI * 2);
    const path = buildSpiral(turns, spread);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.24 + unfold * 0.4 }}>
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%', filter: \`drop-shadow(0 0 \${weight * 3}px \${signal})\` }}
        >
          {Array.from({ length: arms }, (_, index) => (
            <path
              key={index}
              d={path}
              fill="none"
              stroke={signal}
              strokeWidth={weight}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - unfold}
              opacity={0.9 - index * 0.1}
              transform={\`rotate(\${(index * 360) / arms + ctx.t * 360} 500 500)\`}
            />
          ))}
          <circle cx="500" cy="500" r={10 + unfold * 15} fill={signal} opacity={0.55 + unfold * 0.4} />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
