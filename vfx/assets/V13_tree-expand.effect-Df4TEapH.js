const n=`import type { FxKernel } from '../../src/fx/types';

const smooth = (value: number) => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const levels = Math.max(2, Math.min(4, Math.round(Number(ctx.params.levels ?? 4))));
    const spread = Number(ctx.params.spread ?? 1);
    const nodeSize = Number(ctx.params.nodeSize ?? 15);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const progress = smooth(cycle);
    const allNodes = [
      { x: 500, y: 135, parent: -1, level: 0 },
      { x: 315, y: 335, parent: 0, level: 1 }, { x: 685, y: 335, parent: 0, level: 1 },
      { x: 205, y: 555, parent: 1, level: 2 }, { x: 400, y: 555, parent: 1, level: 2 },
      { x: 600, y: 555, parent: 2, level: 2 }, { x: 795, y: 555, parent: 2, level: 2 },
      { x: 135, y: 790, parent: 3, level: 3 }, { x: 275, y: 790, parent: 3, level: 3 },
      { x: 355, y: 790, parent: 4, level: 3 }, { x: 445, y: 790, parent: 4, level: 3 },
      { x: 555, y: 790, parent: 5, level: 3 }, { x: 645, y: 790, parent: 5, level: 3 },
      { x: 725, y: 790, parent: 6, level: 3 }, { x: 865, y: 790, parent: 6, level: 3 },
    ];
    const nodes = allNodes.filter((node) => node.level < levels).map((node) => ({ ...node, x: 500 + (node.x - 500) * spread }));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '32%', display: 'grid', placeItems: 'center', opacity: 0.07 }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', inset: '4%', width: '92%', height: '92%' }}>
          {nodes.map((node, index) => {
            if (node.parent < 0) return null;
            const parent = nodes[node.parent];
            if (!parent) return null;
            const start = node.level * 0.18;
            const local = smooth(Math.max(0, Math.min(1, (progress - start) / 0.28)));
            const midY = parent.y + (node.y - parent.y) * 0.5;
            const path = \`M \${parent.x} \${parent.y} C \${parent.x} \${midY}, \${node.x} \${midY}, \${node.x} \${node.y}\`;
            return (
              <path
                key={\`branch:\${index}\`}
                d={path}
                fill="none"
                stroke={signal}
                strokeWidth="5"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - local}
                opacity={0.28 + local * 0.6}
                style={{ filter: \`drop-shadow(0 0 \${local * 9}px \${signal})\` }}
              />
            );
          })}
          {nodes.map((node, index) => {
            const start = node.level * 0.18 + (index % 2) * 0.025;
            const local = smooth(Math.max(0, Math.min(1, (progress - start) / 0.22)));
            return (
              <g key={\`node:\${index}\`} transform={\`translate(\${node.x} \${node.y}) scale(\${local})\`}>
                <circle r={nodeSize * 1.8} fill="#0D0E10" stroke={signal} strokeWidth="3" opacity="0.95" />
                <circle r={nodeSize * 0.72} fill={index === 0 ? '#F4F7F8' : signal} />
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
