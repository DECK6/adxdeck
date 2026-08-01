const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const pointCount = Math.max(6, Math.min(16, Math.round(Number(ctx.params.points ?? 10))));
    const amplitude = Number(ctx.params.amplitude ?? 0.62);
    const thickness = Number(ctx.params.thickness ?? 6);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * Math.PI * 2;
    const progress = 0.5 - Math.cos(phase) * 0.5;
    const points = Array.from({ length: pointCount }, (_, index) => {
      const x = 90 + (820 * index) / (pointCount - 1);
      const trend = 650 - (360 * index) / (pointCount - 1);
      const noise = (ctx.random(\`point:\${index}\`) - 0.5) * 420 * amplitude;
      return { x, y: Math.max(125, Math.min(780, trend + noise)) };
    });
    const path = points.map((point, index) => \`\${index === 0 ? 'M' : 'L'} \${point.x} \${point.y}\`).join(' ');
    const visibleIndex = Math.min(pointCount - 1, Math.floor(progress * pointCount));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '20%', opacity: 0.08 }}>
          {ctx.subjectNode}
        </div>
        <svg
          viewBox="0 0 1000 900"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: '10%', width: '80%', height: '80%', overflow: 'visible' }}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <line
              key={index}
              x1="70"
              x2="930"
              y1={150 + index * 150}
              y2={150 + index * 150}
              stroke={signal}
              strokeWidth="2"
              opacity="0.1"
            />
          ))}
          <path
            d={path}
            fill="none"
            stroke={signal}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
            style={{ filter: \`drop-shadow(0 0 \${thickness * 1.8}px \${signal})\` }}
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={thickness * 1.25}
              fill={signal}
              opacity={index <= visibleIndex && progress > 0.02 ? 1 : 0}
            />
          ))}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
