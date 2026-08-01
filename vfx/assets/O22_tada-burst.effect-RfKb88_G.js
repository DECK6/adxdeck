const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const LEAD = 0.06;
const SPAN = 0.66;
/** Anticipation crouch occupies the burst up to this point, the pop fires right after. */
const IMPACT = 0.28;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sparks = Math.min(14, Math.max(8, Math.round(Number(ctx.params.sparks ?? 11))));
    const pop = Math.min(1.45, Math.max(1.08, Number(ctx.params.pop ?? 1.26)));
    const spread = Math.min(0.55, Math.max(0.12, Number(ctx.params.spread ?? 0.32)));
    const cycles = Math.min(3, Math.max(2, Math.round(Number(ctx.params.cycles ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const raw = (((ctx.t * cycles) % 1) - LEAD) / SPAN;
    const u = Math.min(1, Math.max(0, raw));
    const crouchAt = Math.min(1, u / IMPACT);
    const crouch = crouchAt * crouchAt * (3 - 2 * crouchAt);
    const q = u <= IMPACT ? 0 : (u - IMPACT) / (1 - IMPACT);
    const qFrame = Math.max(cycles / (ctx.durationInFrames * SPAN * (1 - IMPACT)), 0.002);
    // 1.6-frame ramp from the crouch into the peak — the snap that reads as the hit.
    const rise = Math.min(1, q / (qFrame * 1.6));
    const spring = Math.exp(-5.4 * q) * Math.cos(TAU * 1.7 * q);
    const scale = 1 - 0.12 * crouch * (1 - rise) + (pop - 1) * rise * spring;
    const spin = -4 * crouch * (1 - rise) + 11 * rise * spring;
    const radius = Math.min(ctx.width, ctx.height) * spread;
    const flash = raw >= 0 ? rise * Math.pow(1 - q, 7) : 0;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`scale(\${scale}) rotate(\${spin}deg)\`,
            transformOrigin: 'center',
          }}
        >
          {ctx.subjectNode}
        </div>
        {q > 0
          ? Array.from({ length: sparks }, (_, index) => {
              const angle = (index / sparks) * TAU + (ctx.random(\`spark:\${index}:angle\`) - 0.5) * 0.46;
              const speed = 0.62 + ctx.random(\`spark:\${index}:speed\`) * 0.62;
              const travel = radius * speed * (1 - Math.pow(1 - q, 2.4));
              const length = (14 + ctx.random(\`spark:\${index}:len\`) * 22) * (0.35 + (1 - q) * 0.75);
              const opacity = rise * Math.pow(1 - q, 1.9);
              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: length,
                    height: 3,
                    marginTop: -1.5,
                    borderRadius: 2,
                    transformOrigin: '0 50%',
                    transform: \`rotate(\${(angle * 180) / Math.PI}deg) translateX(\${travel}px)\`,
                    background: \`linear-gradient(90deg, \${signal}00, \${signal})\`,
                    boxShadow: \`0 0 \${8 + length * 0.3}px \${signal}88\`,
                    opacity,
                    mixBlendMode: 'screen',
                  }}
                />
              );
            })
          : null}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: radius * 2.1,
            height: radius * 2.1,
            marginLeft: -radius * 1.05,
            marginTop: -radius * 1.05,
            borderRadius: '50%',
            background: \`radial-gradient(circle, \${signal}55, \${signal}14 42%, transparent 68%)\`,
            opacity: flash,
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
            opacity: 0.32 + (raw >= 0 ? Math.pow(1 - q, 2) * (1 - crouch * 0.4) * 0.5 : 0),
            transform: \`scaleX(\${1 + (raw >= 0 ? rise * Math.pow(1 - q, 3) * 0.6 : 0)})\`,
            transformOrigin: 'left center',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
