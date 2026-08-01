const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const layers = Math.max(3, Math.round(Number(ctx.params.layers ?? 5)));
    const spacing = Number(ctx.params.spacing ?? 19);
    const tilt = Number(ctx.params.tilt ?? 58);
    const float = Number(ctx.params.float ?? 25);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const turn = phase * Math.PI * 2;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'grid', placeItems: 'center', background: '#0D0E10', perspective: ctx.width * 1.15 }}>
        <div
          style={{
            position: 'relative',
            width: '56%',
            height: '52%',
            transformStyle: 'preserve-3d',
            transform: \`rotateX(\${tilt}deg) rotateZ(\${45 + Math.sin(turn) * 3.5}deg)\`,
          }}
        >
          {Array.from({ length: layers }, (_, index) => {
            const order = layers - 1 - index;
            const wave = Math.sin(turn + index * 0.72);
            const lift = order * spacing + wave * float;
            const slide = Math.cos(turn + index * 0.54) * float * 0.42;
            const alpha = 0.2 + ((index + 1) / layers) * 0.62;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  border: \`2px solid \${signal}\`,
                  borderRadius: 9,
                  background: '#0D0E10',
                  opacity: alpha,
                  transform: \`translate3d(\${slide}px, \${-slide}px, \${lift}px)\`,
                  boxShadow: \`0 0 \${8 + index * 3}px \${signal}, \${spacing}px \${spacing}px \${18 + order * 5}px #000000A8\`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, transform: 'rotateZ(-45deg) scale(1.42)', filter: \`brightness(\${0.54 + (index / layers) * 0.6})\` }}>
                  {ctx.subjectNode}
                </div>
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
