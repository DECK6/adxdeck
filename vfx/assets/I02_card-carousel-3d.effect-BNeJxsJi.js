const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const cards = Math.min(10, Math.max(4, Math.round(Number(ctx.params.cards ?? 7))));
    const radius = Math.min(420, Math.max(120, Number(ctx.params.radius ?? 260)));
    const perspective = Number(ctx.params.perspective ?? 1040);
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * Math.PI * 2 * turns;
    const cardWidth = Math.min(ctx.width * 0.31, ctx.height * 0.54);
    const cardHeight = cardWidth * 0.72;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: '#0D0E10',
          perspective,
          perspectiveOrigin: '50% 44%',
        }}
      >
        <div
          data-layout-allow-overflow
          data-layout-allow-overlap
          style={{
            position: 'relative',
            width: cardWidth,
            height: cardHeight,
            transformStyle: 'preserve-3d',
            transform: \`rotateX(-8deg) rotateY(\${phase}rad)\`,
          }}
        >
          {Array.from({ length: cards }, (_, index) => {
            const angle = (index / cards) * Math.PI * 2;
            const facing = (Math.cos(angle + phase) + 1) / 2;
            return (
              <div
                key={index}
                data-layout-allow-overflow
                data-layout-allow-overlap
                data-layout-allow-occlusion
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  border: \`1px solid \${signal}\`,
                  borderRadius: Math.max(5, cardWidth * 0.035),
                  background: '#0D0E10',
                  backfaceVisibility: 'hidden',
                  transform: \`rotateY(\${angle}rad) translateZ(\${radius}px)\`,
                  opacity: 0.42 + facing * 0.58,
                  filter: \`brightness(\${0.48 + facing * 0.72})\`,
                  boxShadow: \`0 0 \${cardWidth * (0.025 + facing * 0.07)}px \${signal}55\`,
                }}
              >
                <div style={{ position: 'absolute', inset: 0, opacity: 0.44 + facing * 0.56 }}>
                  {ctx.subjectNode}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: cardWidth * 0.045,
                    top: cardWidth * 0.035,
                    color: signal,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: Math.max(8, cardWidth * 0.055),
                    letterSpacing: '0.08em',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '76%',
            width: Math.min(ctx.width * 0.6, radius * 1.8),
            height: ctx.height * 0.08,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(0,0,0,0.86), rgba(0,0,0,0))',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
