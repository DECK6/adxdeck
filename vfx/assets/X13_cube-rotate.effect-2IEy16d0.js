const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'left');
    const perspective = Number(ctx.params.perspective ?? 900);
    const shading = Number(ctx.params.shading ?? 0.4);
    const edge = Boolean(ctx.params.edge ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const eased = cycle * cycle * (3 - 2 * cycle);
    const horizontal = direction === 'left' || direction === 'right';
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;
    const angle = sign * eased * 90;
    const halfDepth = horizontal ? ctx.width / 2 : ctx.height / 2;
    const cubeTransform = horizontal ? \`rotateY(\${angle}deg)\` : \`rotateX(\${-angle}deg)\`;
    const nextFaceTransform = horizontal
      ? \`rotateY(\${-sign * 90}deg) translateZ(\${halfDepth}px)\`
      : \`rotateX(\${sign * 90}deg) translateZ(\${halfDepth}px)\`;
    const shadeDirection = horizontal
      ? direction === 'left' ? 'to left' : 'to right'
      : direction === 'up' ? 'to top' : 'to bottom';

    const faceStyle = {
      position: 'absolute' as const,
      inset: 0,
      overflow: 'hidden',
      backfaceVisibility: 'hidden' as const,
      border: edge ? \`1px solid \${signal}\` : 'none',
      boxSizing: 'border-box' as const,
    };

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          perspective,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: cubeTransform,
          }}
        >
          <div style={{ ...faceStyle, transform: \`translateZ(\${halfDepth}px)\` }}>
            {ctx.subjectNode}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: \`linear-gradient(\${shadeDirection}, rgba(13,14,16,\${shading * eased}), transparent 70%)\`,
              }}
            />
          </div>
          <div style={{ ...faceStyle, transform: nextFaceTransform }}>
            <div style={{ position: 'absolute', inset: 0, filter: 'saturate(1.15) contrast(1.04)' }}>
              {ctx.subjectNode}
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: \`linear-gradient(\${shadeDirection}, transparent 35%, rgba(13,14,16,\${shading * (1 - eased)}))\`,
              }}
            />
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
