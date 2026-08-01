const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const nodeCount = Math.max(7, Math.min(15, Math.round(Number(ctx.params.nodes ?? 11))));
    const spread = Number(ctx.params.spread ?? 0.72);
    const drift = Number(ctx.params.drift ?? 28);
    const linkCount = Math.max(1, Math.min(3, Math.round(Number(ctx.params.links ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const theta = phase * Math.PI * 2;
    const unfold = 0.72 + (0.5 - Math.cos(theta) * 0.5) * 0.28;
    const nodes = Array.from({ length: nodeCount }, (_, index) => {
      const ring = index === 0 ? 0 : 0.34 + (index % 3) * 0.18;
      const baseAngle = (index / nodeCount) * Math.PI * 2 + ctx.random(\`angle:\${index}\`) * 0.55;
      const radius = ring * 410 * spread * unfold;
      return {
        x: 500 + Math.cos(baseAngle + theta * 0.08) * radius + Math.sin(theta * 2 + index) * drift,
        y: 500 + Math.sin(baseAngle + theta * 0.08) * radius * 0.78 + Math.cos(theta * 1.5 + index * 0.7) * drift,
        radius: 9 + ctx.random(\`radius:\${index}\`) * 15,
      };
    });
    const edges = nodes.flatMap((node, index) =>
      Array.from({ length: linkCount }, (_, linkIndex) => {
        const targetIndex = (index + linkIndex + 1 + Math.floor(ctx.random(\`link:\${index}:\${linkIndex}\`) * 3)) % nodeCount;
        return { from: node, to: nodes[targetIndex], key: \`\${index}:\${linkIndex}\` };
      }),
    );
    const activeEdge = edges[Math.floor(phase * edges.length) % edges.length];
    const edgeProgress = (phase * edges.length) % 1;
    const markerX = activeEdge.from.x + (activeEdge.to.x - activeEdge.from.x) * edgeProgress;
    const markerY = activeEdge.from.y + (activeEdge.to.y - activeEdge.from.y) * edgeProgress;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '31%', opacity: 0.05 }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: '6%', width: '88%', height: '88%', overflow: 'visible' }}>
          {edges.map((edge) => (
            <line
              key={edge.key}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke={signal}
              strokeWidth="2"
              opacity="0.24"
            />
          ))}
          {nodes.map((node, index) => (
            <g key={index} transform={\`translate(\${node.x} \${node.y}) scale(\${0.82 + Math.sin(theta * 2 + index) * 0.16})\`}>
              <circle r={node.radius * 1.9} fill="none" stroke={signal} strokeWidth="2" opacity="0.25" />
              <circle r={node.radius} fill={index === 0 ? signal : '#0D0E10'} stroke={signal} strokeWidth="4" />
            </g>
          ))}
          <circle cx={markerX} cy={markerY} r="12" fill={signal} style={{ filter: \`drop-shadow(0 0 12px \${signal})\` }} />
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
