const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const bristles = Math.min(12, Math.max(5, Math.round(Number(ctx.params.bristles ?? 8))));
    const roughness = clamp01(Number(ctx.params.roughness ?? 0.58));
    const edgeWidth = Math.min(140, Math.max(24, Number(ctx.params.edgeWidth ?? 72)));
    const direction = String(ctx.params.direction ?? 'left-to-right');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const sweep = 0.5 - 0.5 * Math.cos(Math.PI * 2 * ctx.t);
    const laneHeight = ctx.height / bristles;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.055 + sweep * 0.055 }}>
          {ctx.subjectNode}
        </div>
        {Array.from({ length: bristles }, (_, index) => {
          const seed = ctx.random(\`bristle:\${index}\`);
          const lag = (index / Math.max(1, bristles - 1) - 0.5) * roughness * 0.18;
          const local = clamp01(sweep + lag + (seed - 0.5) * roughness * 0.08);
          const ragged = (seed - 0.5) * edgeWidth * roughness;
          const revealWidth = Math.max(1, local * (ctx.width + edgeWidth) - edgeWidth + ragged);
          const top = index * laneHeight - laneHeight * roughness * 0.12;
          const height = laneHeight * (1.04 + roughness * (0.18 + seed * 0.12));
          const fromRight = direction === 'right-to-left';
          const headX = fromRight ? ctx.width - revealWidth : revealWidth;

          return (
            <div key={index}>
              <div
                style={{
                  position: 'absolute',
                  top,
                  ...(fromRight ? { right: 0 } : { left: 0 }),
                  width: revealWidth,
                  height,
                  overflow: 'hidden',
                  transform: \`skewY(\${(seed - 0.5) * roughness * 1.8}deg)\`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -top,
                    ...(fromRight ? { right: 0 } : { left: 0 }),
                    width: ctx.width,
                    height: ctx.height,
                  }}
                >
                  {ctx.subjectNode}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: headX - edgeWidth * 0.5,
                  top: top + height * (0.14 + seed * 0.34),
                  width: edgeWidth * (0.45 + seed * 0.5),
                  height: Math.max(2, laneHeight * (0.035 + roughness * 0.045)),
                  borderRadius: 999,
                  background: signal,
                  opacity: 0.18 + roughness * 0.42,
                  boxShadow: \`0 0 \${6 + roughness * 12}px \${signal}\`,
                  transform: \`rotate(\${(seed - 0.5) * 7}deg)\`,
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
