const n=`import type { FxKernel } from '../../src/fx/types';

const smooth = (value: number): number => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const foldDepth = Math.min(168, Math.max(70, Number(ctx.params.foldDepth ?? 138)));
    const perspective = Math.min(1600, Math.max(500, Number(ctx.params.perspective ?? 920)));
    const stagger = Math.min(0.8, Math.max(0.15, Number(ctx.params.stagger ?? 0.52)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const foldWave = (1 - Math.cos(ctx.t * Math.PI * 2)) * 0.5;
    const size = Math.min(ctx.width, ctx.height) * 0.72;
    const panels = [
      { clip: 'polygon(0 0, 100% 0, 50% 50%)', axis: 'X', sign: -1 },
      { clip: 'polygon(100% 0, 100% 100%, 50% 50%)', axis: 'Y', sign: 1 },
      { clip: 'polygon(0 100%, 100% 100%, 50% 50%)', axis: 'X', sign: 1 },
      { clip: 'polygon(0 0, 50% 50%, 0 100%)', axis: 'Y', sign: -1 },
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'grid', placeItems: 'center', background: '#0D0E10', perspective }}>
        <div
          style={{
            position: 'relative',
            width: size,
            height: size,
            transformStyle: 'preserve-3d',
            transform: \`rotateZ(45deg) rotateX(\${8 + foldWave * 7}deg) scale(\${1 - foldWave * 0.08})\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              clipPath: 'polygon(50% 25%, 75% 50%, 50% 75%, 25% 50%)',
              background: '#12191C',
              border: \`2px solid \${signal}\`,
              filter: \`drop-shadow(0 0 \${6 + foldWave * 12}px \${signal})\`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, transform: 'rotateZ(-45deg) scale(1.18)', opacity: 0.72 }}>{ctx.subjectNode}</div>
          </div>
          {panels.map((panel, index) => {
            const delay = index * stagger * 0.17;
            const local = smooth(Math.min(1, Math.max(0, (foldWave - delay) / Math.max(0.01, 1 - delay))));
            const angle = panel.sign * foldDepth * local;
            const transform = panel.axis === 'X' ? \`rotateX(\${angle}deg)\` : \`rotateY(\${angle}deg)\`;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  clipPath: panel.clip,
                  transformOrigin: '50% 50%',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'visible',
                  transform,
                  background: index % 2 === 0 ? '#1A2529' : '#101719',
                  border: \`1px solid \${signal}\`,
                  boxShadow: \`inset 0 0 \${18 + local * 28}px #000000B8, 0 0 \${4 + local * 9}px \${signal}\`,
                }}
              >
                <div style={{ position: 'absolute', inset: 0, transform: 'rotateZ(-45deg) scale(1.18)', opacity: 0.26 + (1 - local) * 0.34, filter: \`contrast(1.1) drop-shadow(0 0 4px \${signal})\` }}>
                  {ctx.subjectNode}
                </div>
              </div>
            );
          })}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.24 + (1 - foldWave) * 0.42 }}>
            <path d="M0 0 L50 50 L100 0 M100 100 L50 50 L0 100 M50 25 L75 50 L50 75 L25 50 Z" fill="none" stroke={signal} strokeWidth="0.7" strokeDasharray="2 2" />
          </svg>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
