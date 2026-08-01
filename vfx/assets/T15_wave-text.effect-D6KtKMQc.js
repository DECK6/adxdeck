const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const amplitude = Number(ctx.params.amplitude ?? 16);
    const frequency = Math.max(1, Math.round(Number(ctx.params.frequency ?? 2)));
    const bands = Math.max(2, Math.round(Number(ctx.params.bands ?? 14)));
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * Math.PI * 2 * speed;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {Array.from({ length: bands }, (_, index) => {
          const top = (index / bands) * 100;
          const bottom = 100 - ((index + 1) / bands) * 100;
          const bandPhase = (index / bands) * Math.PI * 2 * frequency;
          const offset = Math.sin(phase + bandPhase) * amplitude;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: \`inset(\${top}% 0 \${bottom}% 0)\`,
                transform: \`translate3d(0, \${offset}px, 0)\`,
                filter: \`drop-shadow(0 0 \${Math.max(2, amplitude * 0.16)}px \${signal})\`,
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
