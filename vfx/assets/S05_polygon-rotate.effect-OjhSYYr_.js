const n=`import type { FxKernel } from '../../src/fx/types';

const polygonPoints = (sides: number, radius: number): string =>
  Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 - Math.PI / 2;
    return \`\${500 + Math.cos(angle) * radius},\${500 + Math.sin(angle) * radius}\`;
  }).join(' ');

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sides = Math.max(3, Number.parseInt(String(ctx.params.sides ?? '6'), 10));
    const layers = Math.max(3, Math.round(Number(ctx.params.layers ?? 7)));
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 2)));
    const twist = Math.min(45, Math.max(0, Number(ctx.params.twist ?? 18)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const rotation = ctx.t * turns * 360;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, filter: \`grayscale(1) drop-shadow(0 0 5px \${signal})\` }}>
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%', filter: \`drop-shadow(0 0 8px \${signal})\` }}
        >
          {Array.from({ length: layers }, (_, index) => {
            const ratio = layers === 1 ? 1 : index / (layers - 1);
            const radius = 105 + ratio * 330;
            const direction = index % 2 === 0 ? 1 : -1;
            return (
              <polygon
                key={index}
                points={polygonPoints(sides, radius)}
                fill={index === 0 ? \`\${signal}12\` : 'none'}
                stroke={signal}
                strokeWidth={7 - ratio * 4}
                opacity={0.85 - ratio * 0.52}
                transform={\`rotate(\${rotation * direction + index * twist} 500 500)\`}
              />
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
