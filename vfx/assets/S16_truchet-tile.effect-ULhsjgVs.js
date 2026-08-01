const t=`import type { FxKernel } from '../../src/fx/types';

const ease = (value: number) => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const grid = Math.max(5, Math.min(11, Math.round(Number(ctx.params.grid ?? 8))));
    const weight = Number(ctx.params.weight ?? 8);
    const stagger = Number(ctx.params.stagger ?? 0.58);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cell = 800 / grid;
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const transition = cycle * 3;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '28%', display: 'grid', placeItems: 'center', opacity: 0.1 }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <rect x="100" y="100" width="800" height="800" fill="none" stroke={signal} strokeWidth="2" opacity="0.18" />
          {Array.from({ length: grid * grid }, (_, index) => {
            const column = index % grid;
            const row = Math.floor(index / grid);
            const delay = ((row + column) / Math.max(1, grid * 2 - 2)) * 0.7 * stagger;
            const local = Math.max(0, Math.min(3, transition * (1 + 0.28 * stagger) - delay));
            const state = Math.min(2, Math.floor(local));
            const fraction = ease(local - state);
            const base = Math.floor(ctx.random(\`tile:\${index}\`) * 4);
            const direction = (row + column) % 2 === 0 ? 1 : -1;
            const rotation = (base + direction * (state + fraction)) * 90;
            const x = 100 + column * cell;
            const y = 100 + row * cell;
            return (
              <g key={index} transform={\`translate(\${x + cell / 2} \${y + cell / 2}) rotate(\${rotation}) translate(\${-cell / 2} \${-cell / 2})\`}>
                <path d={\`M 0 \${cell / 2} A \${cell / 2} \${cell / 2} 0 0 1 \${cell / 2} 0\`} fill="none" stroke={signal} strokeWidth={weight} strokeLinecap="round" opacity="0.82" />
                <path d={\`M \${cell} \${cell / 2} A \${cell / 2} \${cell / 2} 0 0 1 \${cell / 2} \${cell}\`} fill="none" stroke={signal} strokeWidth={weight} strokeLinecap="round" opacity="0.82" />
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
