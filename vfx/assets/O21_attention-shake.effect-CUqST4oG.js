const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
/** Rest before the burst, then the burst span — both in per-cycle units (rest fills the remainder). */
const LEAD = 0.08;
const SPAN = 0.54;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const amp = Math.min(48, Math.max(4, Number(ctx.params.amp ?? 22)));
    const shakes = Math.min(7, Math.max(2, Math.round(Number(ctx.params.shakes ?? 4))));
    const cycles = Math.min(3, Math.max(2, Math.round(Number(ctx.params.cycles ?? 3))));
    const ghost = Math.min(1, Math.max(0, Number(ctx.params.ghost ?? 0.6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const raw = (((ctx.t * cycles) % 1) - LEAD) / SPAN;
    const u = Math.min(1, Math.max(0, raw));
    const frameSpan = Math.max(cycles / (ctx.durationInFrames * SPAN), 0.001);
    // Damped horizontal oscillation — zero at both ends of the burst, so the cycle rests at 0.
    const swing = (at: number) => {
      const v = Math.min(1, Math.max(0, at));
      return amp * Math.pow(1 - v, 2.1) * Math.sin(TAU * shakes * v);
    };
    const offset = swing(u);
    const envelope = raw >= 0 ? Math.pow(1 - u, 2.1) : 0;
    const strike = raw >= 0 && raw < frameSpan * 1.5 ? 1 : 0;
    const trails = [
      { delta: frameSpan * 1.6, weight: 0.62 },
      { delta: frameSpan * 3.2, weight: 0.34 },
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {envelope > 0
          ? trails.map((trail) => {
              const past = swing(u - trail.delta);
              const lag = Math.abs(offset - past) / Math.max(amp, 1);
              return (
                <div
                  key={trail.delta}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: \`translate3d(\${past}px, 0, 0) rotate(\${(-past / Math.max(amp, 1)) * 2.4}deg)\`,
                    opacity: ghost * trail.weight * Math.min(1, lag * 3.2) * envelope,
                    filter: \`blur(\${1.4 + trail.delta * 60}px)\`,
                    mixBlendMode: 'screen',
                  }}
                >
                  {ctx.subjectNode}
                </div>
              );
            })
          : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`translate3d(\${offset}px, 0, 0) rotate(\${(-offset / Math.max(amp, 1)) * 3}deg) scale(\${1 + strike * 0.055})\`,
            transformOrigin: 'center',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(circle at 50% 50%, \${signal}3D, transparent 62%)\`,
            opacity: strike * 0.9,
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 48,
            bottom: 42,
            width: 96,
            height: 3,
            background: signal,
            opacity: 0.35 + envelope * 0.5,
            transform: \`translateX(\${offset * 0.5}px) scaleX(\${1 + envelope * 0.35})\`,
            transformOrigin: 'left center',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
