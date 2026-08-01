const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const tilt = Number(ctx.params.tilt ?? 13);
    const perspective = Number(ctx.params.perspective ?? 920);
    const lift = Number(ctx.params.lift ?? 24);
    const glow = Number(ctx.params.glow ?? 0.46);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const turn = ctx.t * Math.PI * 2;
    const rotateX = Math.sin(turn) * tilt * 0.62;
    const rotateY = Math.cos(turn) * tilt;
    const float = (1 - Math.cos(turn)) * lift * 0.5;
    const sheen = 50 + Math.sin(turn) * 36;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: '#0D0E10',
          perspective,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '72%',
            height: '68%',
            overflow: 'hidden',
            border: \`1px solid \${signal}\`,
            borderRadius: 18,
            background: '#0D0E10',
            transformStyle: 'preserve-3d',
            transform: \`translate3d(0, \${-float}px, \${float * 1.5}px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`,
            boxShadow: \`0 \${18 + float}px \${34 + lift}px #000000B8, 0 0 \${8 + glow * 26}px \${signal}\`,
            backfaceVisibility: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(18px)' }}>
            {ctx.subjectNode}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: '-25%',
              background: \`linear-gradient(112deg, transparent \${sheen - 16}%, \${signal} \${sheen}%, transparent \${sheen + 16}%)\`,
              opacity: 0.08 + glow * 0.14,
              transform: 'translateZ(28px)',
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
