const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const travel = Number(ctx.params.travel ?? 1);
    const edge = Number(ctx.params.edge ?? 4);
    const depth = Number(ctx.params.depth ?? 0.06);
    const underlay = String(ctx.params.underlay ?? 'clean');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const progress = cycle * cycle * (3 - 2 * cycle);
    const distance = progress * travel * ctx.width * 0.52;
    const underlayFilter = underlay === 'monochrome'
      ? 'grayscale(1) contrast(1.08)'
      : underlay === 'dimmed'
        ? 'brightness(0.55) saturate(0.7)'
        : 'none';

    const panel = (side: 'left' | 'right') => {
      const isLeft = side === 'left';
      return (
        <div
          style={{
            position: 'absolute',
            left: isLeft ? 0 : '50%',
            top: 0,
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            background: '#0D0E10',
            boxShadow: \`\${isLeft ? edge : -edge}px 0 \${edge * 3}px \${signal}\`,
            transform: \`translate3d(\${isLeft ? -distance : distance}px, 0, \${progress * 18}px) rotateY(\${isLeft ? -depth * progress * 90 : depth * progress * 90}deg)\`,
            transformOrigin: isLeft ? 'right center' : 'left center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: isLeft ? 0 : '-100%',
              top: 0,
              width: '200%',
              height: '100%',
            }}
          >
            {ctx.subjectNode}
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              [isLeft ? 'right' : 'left']: 0,
              width: edge,
              background: signal,
              opacity: 0.9,
              boxShadow: \`0 0 \${edge * 4}px \${signal}\`,
            }}
          />
        </div>
      );
    };

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          perspective: Math.max(500, ctx.width * 1.2),
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: underlayFilter,
            transform: \`scale(\${1 + depth * (1 - progress)})\`,
            opacity: 0.45 + progress * 0.55,
          }}
        >
          {ctx.subjectNode}
        </div>
        {panel('left')}
        {panel('right')}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
