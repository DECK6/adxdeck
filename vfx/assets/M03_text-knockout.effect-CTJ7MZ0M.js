const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const direction = String(ctx.params.direction ?? 'horizontal');
    const bandSize = Math.min(64, Math.max(18, Number(ctx.params.bandSize ?? 38)));
    const cycles = Math.min(3, Math.max(1, Number(ctx.params.cycles ?? 1)));
    const ghost = Boolean(ctx.params.ghost ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const sweep = 0.5 - 0.5 * Math.cos(Math.PI * 2 * cycles * ctx.t);
    const horizontal = direction !== 'vertical';
    const extent = horizontal ? ctx.width : ctx.height;
    const bandPixels = extent * bandSize / 100;
    const offset = -bandPixels + sweep * (extent + bandPixels);

    const bandStyle = horizontal
      ? {
          position: 'absolute' as const,
          left: offset,
          top: 0,
          width: bandPixels,
          height: ctx.height,
        }
      : {
          position: 'absolute' as const,
          left: 0,
          top: offset,
          width: ctx.width,
          height: bandPixels,
        };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {ghost ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, filter: 'grayscale(1)' }}>
            {ctx.subjectNode}
          </div>
        ) : null}
        <div
          style={{
            ...bandStyle,
            overflow: 'hidden',
            background: signal,
            boxShadow: \`0 0 \${Math.max(12, extent * 0.035)}px \${signal}\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: horizontal ? -offset : 0,
              top: horizontal ? 0 : -offset,
              width: ctx.width,
              height: ctx.height,
              filter: 'brightness(0)',
              opacity: 0.9,
            }}
          >
            {ctx.subjectNode}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
