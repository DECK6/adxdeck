const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const startAngle = Number(ctx.params.startAngle ?? -90);
    const softness = Number(ctx.params.softness ?? 4);
    const direction = String(ctx.params.direction ?? 'clockwise');
    const rim = Boolean(ctx.params.rim ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const progress = (1 - Math.cos(ctx.t * Math.PI * 2)) / 2;
    const sweep = progress * 360;
    const signedSweep = direction === 'counterclockwise' ? -sweep : sweep;
    const maskStart = direction === 'counterclockwise' ? startAngle + signedSweep : startAngle;
    const feather = Math.min(softness, Math.max(0, sweep * 0.45));
    const solidEnd = Math.max(0, sweep - feather);
    const mask = \`conic-gradient(from \${maskStart}deg, #000 0deg, #000 \${solidEnd}deg, transparent \${sweep}deg)\`;
    const radius = Math.hypot(ctx.width, ctx.height) * 0.58;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.16, filter: 'saturate(0.35) brightness(0.55)' }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        >
          {ctx.subjectNode}
        </div>
        {rim && progress > 0.001 && progress < 0.999 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: radius,
              height: 2,
              background: \`linear-gradient(90deg, \${signal}, transparent)\`,
              boxShadow: \`0 0 12px \${signal}\`,
              transformOrigin: '0 50%',
              transform: \`rotate(\${startAngle + signedSweep}deg)\`,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: signal,
            boxShadow: \`0 0 16px \${signal}\`,
            opacity: rim ? 0.9 : 0,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
