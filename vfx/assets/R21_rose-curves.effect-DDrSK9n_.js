const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const rosePath = (petals: number, phase: number, radius: number, morph: number): string => {
  const segments = 300;
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * TAU;
    const primary = Math.cos(petals * angle + phase);
    const secondary = Math.cos((petals + 1) * angle - phase * 0.5);
    const radial = (primary * (1 - morph) + secondary * morph) * radius;
    const x = 500 + Math.cos(angle) * radial;
    const y = 500 + Math.sin(angle) * radial;
    return \`\${index === 0 ? 'M' : 'L'}\${x.toFixed(2)} \${y.toFixed(2)}\`;
  }).join(' ');
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const petals = Math.min(12, Math.max(3, Math.round(Number(ctx.params.petals ?? 7))));
    const layers = Math.min(7, Math.max(2, Math.round(Number(ctx.params.layers ?? 4))));
    const morph = Math.min(1, Math.max(0, Number(ctx.params.morph ?? 0.72)));
    const weight = Math.min(5, Math.max(0.8, Number(ctx.params.weight ?? 2.2)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const blend = morph * (0.5 - 0.5 * Math.cos(phase));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '28%', opacity: 0.28, filter: \`grayscale(1) drop-shadow(0 0 7px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '3%', width: '94%', height: '94%', filter: \`drop-shadow(0 0 \${weight * 3}px \${signal})\` }}>
          {Array.from({ length: layers }, (_, index) => {
            const ratio = index / Math.max(1, layers - 1);
            const localPhase = phase + ratio * Math.PI;
            return (
              <path
                key={index}
                d={rosePath(petals, localPhase, 390 - ratio * 62, blend)}
                fill="none"
                stroke={signal}
                strokeWidth={weight * (1 - ratio * 0.35)}
                strokeLinejoin="round"
                opacity={0.86 - ratio * 0.13}
                transform={\`rotate(\${ratio * 36 + ctx.t * 360 * (index % 2 === 0 ? 1 : -1)} 500 500)\`}
              />
            );
          })}
          <circle cx="500" cy="500" r="6" fill={signal} opacity="0.9" />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
