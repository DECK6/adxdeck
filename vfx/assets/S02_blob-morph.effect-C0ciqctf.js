const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const amplitude = Number(ctx.params.amplitude ?? 0.2);
    const pointCount = Math.round(Number(ctx.params.points ?? 8));
    const softness = Number(ctx.params.softness ?? 0.68);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2;
    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < pointCount; i += 1) {
      const angle = (i / pointCount) * Math.PI * 2 - Math.PI / 2;
      const waveA = Math.sin(phase * 2 + i * 1.73);
      const waveB = Math.sin(phase * 3 - i * 0.91);
      const radius = 300 * (1 + amplitude * (waveA * 0.7 + waveB * 0.3));
      points.push({ x: 500 + Math.cos(angle) * radius, y: 500 + Math.sin(angle) * radius });
    }

    const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    });
    const firstMid = mid(points[pointCount - 1], points[0]);
    let path = \`M \${firstMid.x.toFixed(2)} \${firstMid.y.toFixed(2)}\`;
    for (let i = 0; i < pointCount; i += 1) {
      const next = points[(i + 1) % pointCount];
      const nextMid = mid(points[i], next);
      path += \` Q \${points[i].x.toFixed(2)} \${points[i].y.toFixed(2)} \${nextMid.x.toFixed(2)} \${nextMid.y.toFixed(2)}\`;
    }
    path += ' Z';

    const polygon = points.map((point) => \`\${(point.x / 10).toFixed(2)}% \${(point.y / 10).toFixed(2)}%\`).join(', ');
    const breathe = 1 + Math.sin(phase * 2) * 0.025;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: '7%', width: '86%', height: '86%' }}
        >
          <path d={path} fill={signal} opacity={0.08 + softness * 0.12} />
          <path
            d={path}
            fill="none"
            stroke={signal}
            strokeWidth={2 + softness * 6}
            opacity={0.78}
            style={{ filter: \`drop-shadow(0 0 \${5 + softness * 15}px \${signal})\` }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: '7%',
            clipPath: \`polygon(\${polygon})\`,
            transform: \`scale(\${breathe})\`,
            transformOrigin: 'center',
            filter: \`drop-shadow(0 0 \${softness * 10}px \${signal})\`,
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
