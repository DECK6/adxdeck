const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const pages = Math.max(3, Math.min(7, Math.round(Number(ctx.params.pages ?? 5))));
    const spread = Number(ctx.params.spread ?? 0.82);
    const curl = Number(ctx.params.curl ?? 0.58);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const theta = phase * Math.PI * 2;
    const excursion = 0.5 - 0.5 * Math.cos(theta);
    const bookWidth = Math.min(ctx.width * 0.72, ctx.height * 1.08) * spread;
    const bookHeight = bookWidth * 0.62;
    const pageWidth = bookWidth / 2;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.15 }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '70%',
            width: bookWidth * 0.95,
            height: bookHeight * 0.18,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(0,0,0,0.9), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: bookWidth,
            height: bookHeight,
            transformStyle: 'preserve-3d',
            transform: \`translate(-50%, -50%) rotateX(\${56 + Math.sin(theta) * 2}deg) rotateZ(\${Math.sin(theta) * 1.5}deg)\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-2%',
              borderRadius: 8,
              background: \`linear-gradient(90deg, #11151A, \${signal}66 49.6%, \${signal}66 50.4%, #11151A)\`,
              border: \`2px solid \${signal}\`,
              transform: 'translateZ(-9px)',
              boxShadow: \`0 20px 34px #000000B8, 0 0 16px \${signal}40\`,
            }}
          />
          <div style={{ position: 'absolute', left: 0, top: 0, width: pageWidth, height: bookHeight, overflow: 'hidden', background: '#E7EEF0' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: bookWidth, height: bookHeight, filter: 'grayscale(0.7)', opacity: 0.7 }}>
              {ctx.subjectNode}
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 72%, rgba(0,0,0,0.22))' }} />
          </div>
          {Array.from({ length: pages }, (_, index) => {
            const raw = clamp01(excursion * (pages + 0.75) - index * 0.82);
            const eased = raw * raw * (3 - 2 * raw);
            const rotation = -178 * eased;
            const bend = Math.sin(eased * Math.PI) * curl * 14;

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: pageWidth,
                  top: 0,
                  width: pageWidth,
                  height: bookHeight,
                  transformOrigin: '0% 50%',
                  transformStyle: 'preserve-3d',
                  transform: \`translateZ(\${(pages - index) * 1.2}px) rotateY(\${rotation}deg) rotateZ(\${bend * 0.08}deg)\`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    background: '#E7EEF0',
                    border: \`1px solid \${signal}66\`,
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ position: 'absolute', left: -pageWidth, top: 0, width: bookWidth, height: bookHeight, opacity: 0.72 }}>
                    {ctx.subjectNode}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.2), transparent 24%)' }} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: \`repeating-linear-gradient(0deg, #DCE5E7 0 14px, \${signal}55 15px 16px)\`,
                    border: \`1px solid \${signal}66\`,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 3,
              height: '100%',
              transform: 'translateX(-50%) translateZ(10px)',
              background: signal,
              boxShadow: \`0 0 12px \${signal}\`,
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
