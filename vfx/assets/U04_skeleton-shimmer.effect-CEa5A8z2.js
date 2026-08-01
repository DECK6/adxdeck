const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rows = Math.min(7, Math.max(3, Math.round(Number(ctx.params.rows ?? 5))));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const intensity = Math.min(1, Math.max(0.2, Number(ctx.params.intensity ?? 0.72)));
    const rounded = Boolean(ctx.params.rounded ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = (ctx.t * cycles) % 1;
    const shimmerLeft = -42 + progress * 184;
    const radius = rounded ? Math.max(5, Math.min(ctx.width, ctx.height) * 0.018) : 1;
    const cardWidth = Math.min(ctx.width * 0.72, ctx.height * 1.18);
    const cardHeight = Math.min(ctx.height * 0.74, ctx.width * 0.48);
    const rowHeight = cardHeight * 0.055;
    const rowGap = cardHeight * 0.075;
    const contentLeft = cardWidth * 0.1;
    const rowTop = cardHeight * 0.42;

    const shimmer = (shapeRadius: number) => (
      <div
        style={{
          position: 'absolute',
          left: \`\${shimmerLeft}%\`,
          top: 0,
          bottom: 0,
          width: '42%',
          borderRadius: shapeRadius,
          background: \`linear-gradient(90deg, transparent 0%, \${signal}22 24%, \${signal}AA 50%, \${signal}22 76%, transparent 100%)\`,
          opacity: intensity,
          filter: \`blur(\${Math.max(0.5, ctx.width * 0.002)}px)\`,
        }}
      />
    );

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 + intensity * 0.08 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: cardWidth,
            height: cardHeight,
            transform: 'translate(-50%, -50%)',
            borderRadius: radius * 1.4,
            border: '1px solid #34383F',
            background: '#141619F2',
            boxShadow: '0 18px 50px #00000099',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: contentLeft,
              top: cardHeight * 0.12,
              width: cardHeight * 0.19,
              height: cardHeight * 0.19,
              borderRadius: rounded ? '50%' : radius,
              overflow: 'hidden',
              background: '#292D32',
            }}
          >
            {shimmer(rounded ? cardHeight : radius)}
          </div>
          {[0.46, 0.3].map((widthRatio, index) => (
            <div
              key={widthRatio}
              style={{
                position: 'absolute',
                left: contentLeft + cardHeight * 0.25,
                top: cardHeight * (0.145 + index * 0.1),
                width: cardWidth * widthRatio,
                height: rowHeight,
                borderRadius: radius,
                overflow: 'hidden',
                background: '#292D32',
              }}
            >
              {shimmer(radius)}
            </div>
          ))}
          {Array.from({ length: rows }, (_, index) => {
            const widthRatio = 0.5 + ctx.random(\`skeleton:\${index}\`) * 0.39;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: contentLeft,
                  top: rowTop + index * rowGap,
                  width: cardWidth * widthRatio,
                  height: rowHeight,
                  borderRadius: radius,
                  overflow: 'hidden',
                  background: '#292D32',
                }}
              >
                {shimmer(radius)}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
