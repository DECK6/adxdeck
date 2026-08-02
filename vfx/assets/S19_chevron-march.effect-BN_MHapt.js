const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rows = Math.min(9, Math.max(3, Math.round(Number(ctx.params.rows ?? 6))));
    const spacing = Math.min(180, Math.max(70, Number(ctx.params.spacing ?? 118)));
    const speed = Math.min(4, Math.max(1, Math.round(Number(ctx.params.speed ?? 2))));
    const weight = Math.min(12, Math.max(2, Number(ctx.params.weight ?? 6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * spacing * speed;
    const chevrons = Math.ceil(1000 / spacing) + speed + 3;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '22%', opacity: 0.3, filter: \`grayscale(1) drop-shadow(0 0 6px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: \`drop-shadow(0 0 \${weight}px \${signal})\` }}>
          {Array.from({ length: rows }, (_, row) => {
            const y = ((row + 0.5) / rows) * 1000;
            const direction = row % 2 === 0 ? 1 : -1;
            return (
              <g key={row} transform={\`translate(\${direction * phase - spacing * (speed + 1)} 0)\`}>
                {Array.from({ length: chevrons }, (_, index) => {
                  const x = index * spacing;
                  const halfHeight = Math.min(64, 360 / rows);
                  return (
                    <polyline
                      key={index}
                      points={\`\${x - spacing * 0.34},\${y - halfHeight} \${x + spacing * 0.16},\${y} \${x - spacing * 0.34},\${y + halfHeight}\`}
                      fill="none"
                      stroke={signal}
                      strokeWidth={weight}
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      opacity={0.32 + ((index + row) % 3) * 0.24}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
