const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const zoom = Number(ctx.params.zoom ?? 1.25);
    const panX = Number(ctx.params.panX ?? 0);
    const panY = Number(ctx.params.panY ?? 0);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = ctx.t * ctx.t * (3 - 2 * ctx.t);
    const scale = 1 + (zoom - 1) * progress;
    const travelX = panX * ctx.width * 0.09 * progress;
    const travelY = panY * ctx.height * 0.09 * progress;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`translate3d(\${travelX}px, \${travelY}px, 0) scale(\${scale})\`,
            transformOrigin: 'center',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 48,
            bottom: 42,
            width: 96 + progress * 160,
            height: 3,
            background: signal,
            opacity: 0.8,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
