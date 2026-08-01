const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const cellSize = Math.min(132, Math.max(44, Number(ctx.params.cellSize ?? 82)));
    const pulse = Math.min(1, Math.max(0.25, Number(ctx.params.pulse ?? 0.78)));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const falloff = Math.min(1.6, Math.max(0.3, Number(ctx.params.falloff ?? 0.9)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const radius = cellSize * 0.48;
    const stepX = cellSize * 0.84;
    const stepY = cellSize * 0.73;
    const columns = Math.ceil(ctx.width / stepX) + 3;
    const rows = Math.ceil(ctx.height / stepY) + 3;
    const phase = ctx.t * TAU * cycles;
    const points = Array.from({ length: 6 }, (_, point) => {
      const angle = (Math.PI / 3) * point;
      return \`\${Math.cos(angle) * radius},\${Math.sin(angle) * radius}\`;
    }).join(' ');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <svg
          viewBox={\`0 0 \${ctx.width} \${ctx.height}\`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
        >
          {Array.from({ length: rows * columns }, (_, index) => {
            const row = Math.floor(index / columns);
            const column = index % columns;
            const x = (column - 1.5) * stepX + (row % 2) * stepX * 0.5;
            const y = (row - 1.5) * stepY;
            const nx = (x - ctx.width * 0.5) / Math.max(1, ctx.width);
            const ny = (y - ctx.height * 0.5) / Math.max(1, ctx.height);
            const distance = Math.sqrt(nx * nx + ny * ny);
            const wave = 0.5 + 0.5 * Math.cos(phase - distance * TAU * falloff * 2.25);
            const scale = 0.58 + wave * pulse * 0.62;
            const opacity = 0.13 + wave * (0.42 + pulse * 0.28);
            return (
              <g key={index} transform={\`translate(\${x} \${y}) scale(\${scale})\`} opacity={opacity}>
                <polygon
                  points={points}
                  fill={\`\${signal}12\`}
                  stroke={signal}
                  strokeWidth={1.2 + wave * 2.2}
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: \`drop-shadow(0 0 \${2 + wave * 8}px \${signal})\` }}
                />
                <circle cx="0" cy="0" r={2 + wave * 4.5} fill={signal} opacity={0.36 + wave * 0.64} />
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.68,
            transform: \`scale(\${0.94 + (0.5 + 0.5 * Math.sin(phase)) * 0.12})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
