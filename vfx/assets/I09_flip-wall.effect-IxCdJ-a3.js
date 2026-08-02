const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const columns = Math.max(3, Math.min(8, Math.round(Number(ctx.params.columns ?? 6))));
    const rows = Math.max(3, Math.round((columns * ctx.height) / ctx.width));
    const stagger = Number(ctx.params.stagger ?? 0.46);
    const depth = Number(ctx.params.depth ?? 14);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const theta = phase * Math.PI * 2;
    const tileWidth = ctx.width / columns;
    const tileHeight = ctx.height / rows;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.35 }}>
        {Array.from({ length: rows * columns }, (_, index) => {
          const row = Math.floor(index / columns);
          const column = index % columns;
          const distance = (row + column) / Math.max(1, rows + columns - 2);
          const wave = 0.5 - 0.5 * Math.cos(theta - distance * stagger * Math.PI * 2);
          const angle = wave * 180;
          const left = column * tileWidth;
          const top = row * tileHeight;
          const edgeLight = Math.pow(Math.sin(wave * Math.PI), 3);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left,
                top,
                width: tileWidth + 0.5,
                height: tileHeight + 0.5,
                transformStyle: 'preserve-3d',
                transform: \`rotateY(\${angle}deg) translateZ(\${edgeLight * depth * 0.45}px)\`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: \`translateZ(\${depth / 2}px)\`,
                  border: '1px solid #0D0E10',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ position: 'absolute', left: -left, top: -top, width: ctx.width, height: ctx.height }}>
                  {ctx.subjectNode}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  backfaceVisibility: 'hidden',
                  transform: \`rotateY(180deg) translateZ(\${depth / 2}px)\`,
                  border: \`1px solid \${signal}\`,
                  boxSizing: 'border-box',
                  background: \`linear-gradient(135deg, #11151A, \${signal}2B)\`,
                  color: signal,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: Math.max(8, Math.min(tileWidth, tileHeight) * 0.18),
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: depth,
                  height: '100%',
                  transform: 'translateX(-50%) rotateY(90deg)',
                  background: signal,
                  opacity: edgeLight,
                  boxShadow: \`0 0 \${depth}px \${signal}\`,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
