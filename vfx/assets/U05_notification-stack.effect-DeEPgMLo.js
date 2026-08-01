const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const cardCount = Math.max(3, Math.min(6, Math.round(Number(ctx.params.cards ?? 4))));
    const cycles = Math.max(1, Math.min(3, Math.round(Number(ctx.params.cycles ?? 1))));
    const depth = Math.max(0.4, Math.min(1, Number(ctx.params.depth ?? 0.74)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * Math.PI * 2 * cycles;
    const cardWidth = Math.min(ctx.width * 0.68, ctx.height * 1.15);
    const cardHeight = Math.max(62, Math.min(ctx.height * 0.17, cardWidth * 0.24));
    const centerX = ctx.width * 0.5 - cardWidth * 0.5;
    const centerY = ctx.height * 0.5 - cardHeight * 0.5;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '19%', opacity: 0.055 }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: cardCount }, (_, index) => {
          const angle = phase + (index / cardCount) * Math.PI * 2;
          const wave = (Math.sin(angle) + 1) * 0.5;
          const z = (Math.cos(angle) + 1) * 0.5;
          const y = centerY + (wave - 0.5) * cardHeight * 2.15 * depth;
          const x = centerX + Math.sin(angle * 2) * cardWidth * 0.045 * depth;
          const scale = 0.82 + z * 0.18;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: cardWidth,
                height: cardHeight,
                transform: \`scale(\${scale})\`,
                transformOrigin: 'center',
                borderRadius: cardHeight * 0.2,
                border: \`1px solid \${z > 0.72 ? signal : '#34383F'}\`,
                background: '#17191D',
                boxShadow: \`0 \${8 + z * 18}px \${18 + z * 30}px #000000AA\`,
                opacity: 0.3 + z * 0.7,
                zIndex: Math.round(z * 100),
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: cardHeight * 0.22,
                  top: cardHeight * 0.27,
                  width: cardHeight * 0.46,
                  height: cardHeight * 0.46,
                  borderRadius: '50%',
                  background: signal,
                  opacity: 0.5 + z * 0.5,
                  boxShadow: \`0 0 \${cardHeight * 0.2}px \${signal}\`,
                }}
              />
              {[0, 1].map((line) => (
                <div
                  key={line}
                  style={{
                    position: 'absolute',
                    left: cardHeight * 0.86,
                    top: cardHeight * (0.28 + line * 0.26),
                    width: cardWidth * (line === 0 ? 0.57 : 0.38),
                    height: Math.max(3, cardHeight * 0.08),
                    borderRadius: 999,
                    background: line === 0 ? signal : '#525862',
                    opacity: line === 0 ? 0.62 : 0.72,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
