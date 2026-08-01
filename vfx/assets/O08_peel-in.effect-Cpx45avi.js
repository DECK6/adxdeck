const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const curl = Number(ctx.params.curl ?? 0.7);
    const damping = Number(ctx.params.damping ?? 4.8);
    const shadow = Number(ctx.params.shadow ?? 0.72);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    // diagonal reveal sweeps the corner open; the sheet springs flat behind it
    const p = clamp01(ctx.t / 0.42);
    const reveal = p * p * (3 - 2 * p) * 215;
    const settle = 1 - Math.exp(-damping * p) * Math.cos(8.2 * p);
    const flatten = 1 - settle;

    const idle = Math.max(0, ctx.t - 0.42);
    const rot = -curl * 9 * flatten + 0.5 * Math.sin(idle * Math.PI * 1.5);
    const skew = curl * 5 * flatten;
    const lift = 1 + curl * 0.05 * flatten;

    // the clip edge runs corner to corner, so its angle follows the frame aspect
    const edgeDeg = -(Math.atan2(ctx.height, ctx.width) * 180) / Math.PI;
    const band = clamp01(reveal / 10) * clamp01((215 - reveal) / 55);
    const anchor = \`\${reveal / 2}%\`;
    const outro = clamp01((1 - ctx.t) / 0.1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: outro }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '73%',
              width: ctx.height * (0.4 + settle * 0.24),
              height: ctx.height * (0.06 + flatten * 0.04),
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))',
              opacity: 0.35 + clamp01(settle) * 0.55,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              overflow: 'hidden',
              transform: \`rotate(\${rot}deg) skewX(\${skew}deg) scale(\${lift})\`,
              transformOrigin: '18% 18%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: \`polygon(0 0, \${reveal}% 0, 0 \${reveal}%)\`,
              }}
            >
              {ctx.subjectNode}
            </div>
            <div
              style={{
                position: 'absolute',
                left: anchor,
                top: anchor,
                width: '260%',
                height: ctx.height * 0.16,
                transform: \`translate(-50%, -50%) rotate(\${edgeDeg}deg) translateY(\${-ctx.height * 0.08}px)\`,
                background: \`linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,\${0.72 * shadow}))\`,
                opacity: band,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: anchor,
                top: anchor,
                width: '260%',
                height: ctx.height * 0.05,
                transform: \`translate(-50%, -50%) rotate(\${edgeDeg}deg) translateY(\${ctx.height * 0.026}px)\`,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                opacity: band * 0.85,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: anchor,
                top: anchor,
                width: '260%',
                height: Math.max(2, ctx.height * 0.014),
                transform: \`translate(-50%, -50%) rotate(\${edgeDeg}deg)\`,
                background: \`linear-gradient(90deg, rgba(94,231,243,0) 0%, \${signal} 30%, rgba(255,255,255,0.92) 50%, \${signal} 70%, rgba(94,231,243,0) 100%)\`,
                opacity: band,
                boxShadow: \`0 0 \${ctx.height * 0.06}px \${signal}\`,
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
