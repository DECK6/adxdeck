const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rings = Math.min(64, Math.max(18, Math.round(Number(ctx.params.rings ?? 42))));
    const spacing = Math.min(1.45, Math.max(0.65, Number(ctx.params.spacing ?? 1)));
    const motion = Math.min(1, Math.max(0, Number(ctx.params.motion ?? 0.68)));
    const lineWidth = Math.min(2.2, Math.max(0.4, Number(ctx.params.lineWidth ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const minSide = Math.min(ctx.width, ctx.height);
    const gap = (minSide / rings) * 1.45 * spacing;
    const offset = minSide * (0.035 + motion * 0.1);
    const driftX = Math.cos(phase) * offset;
    const driftY = Math.sin(phase * 2) * offset * 0.42;
    const circleIndexes = Array.from({ length: rings }, (_, index) => index + 1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.22,
            filter: 'grayscale(1) contrast(1.35)',
            transform: \`scale(\${1.01 + Math.sin(phase) * 0.01})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <svg
          width={ctx.width}
          height={ctx.height}
          viewBox={\`0 0 \${ctx.width} \${ctx.height}\`}
          style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen' }}
        >
          <g fill="none" stroke={signal} strokeWidth={lineWidth} opacity={0.72}>
            {circleIndexes.map((index) => (
              <circle
                key={\`a:\${index}\`}
                cx={ctx.width * 0.5 - offset + driftX}
                cy={ctx.height * 0.5 + driftY}
                r={index * gap}
              />
            ))}
          </g>
          <g fill="none" stroke={signal} strokeWidth={lineWidth} opacity={0.46}>
            {circleIndexes.map((index) => (
              <circle
                key={\`b:\${index}\`}
                cx={ctx.width * 0.5 + offset - driftX}
                cy={ctx.height * 0.5 - driftY}
                r={index * gap * 1.006}
              />
            ))}
          </g>
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(circle at center, transparent 18%, \${signal}08 64%, #0D0E10B8 100%)\`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
