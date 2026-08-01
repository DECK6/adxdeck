const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const orientation = String(ctx.params.orientation ?? 'horizontal');
    const stripeSize = Number(ctx.params.stripeSize ?? 52);
    const shift = Number(ctx.params.shift ?? 72);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const horizontal = orientation !== 'vertical';
    const extent = horizontal ? ctx.height : ctx.width;
    const stripeCount = Math.ceil(extent / stripeSize) + 1;
    const loopPhase = Math.PI * 2 * cycles * ctx.t;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          backgroundImage: horizontal
            ? \`repeating-linear-gradient(to bottom, \${signal}18 0 1px, transparent 1px \${stripeSize}px)\`
            : \`repeating-linear-gradient(to right, \${signal}18 0 1px, transparent 1px \${stripeSize}px)\`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>{ctx.subjectNode}</div>
        {Array.from({ length: stripeCount }, (_, index) => {
          const start = index * stripeSize;
          const end = Math.min(extent, start + stripeSize);
          const phase = loopPhase + index * 0.56;
          const direction = index % 2 === 0 ? 1 : -1;
          const displacement = Math.sin(phase) * shift * direction;
          const clipPath = horizontal
            ? \`inset(\${start}px 0 \${Math.max(0, ctx.height - end)}px 0)\`
            : \`inset(0 \${Math.max(0, ctx.width - end)}px 0 \${start}px)\`;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath,
                transform: horizontal
                  ? \`translate3d(\${displacement}px, 0, 0)\`
                  : \`translate3d(0, \${displacement}px, 0)\`,
                filter: \`drop-shadow(0 0 5px \${signal})\`,
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: horizontal
              ? \`repeating-linear-gradient(to bottom, transparent 0 \${Math.max(1, stripeSize - 2)}px, \${signal}  \${Math.max(1, stripeSize - 2)}px \${stripeSize}px)\`
              : \`repeating-linear-gradient(to right, transparent 0 \${Math.max(1, stripeSize - 2)}px, \${signal} \${Math.max(1, stripeSize - 2)}px \${stripeSize}px)\`,
            opacity: 0.16,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
