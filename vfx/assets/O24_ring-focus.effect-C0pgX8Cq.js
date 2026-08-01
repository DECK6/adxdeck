const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const LEAD = 0.05;
const SPAN = 0.72;
/** Each ring launches STAGGER later and needs TRAVEL to reach the subject. */
const STAGGER = 0.15;
const TRAVEL = 0.4;
/** Arrival echo lifetime, in burst units. */
const ECHO = 0.17;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const rings = Math.min(3, Math.max(2, Math.round(Number(ctx.params.rings ?? 3))));
    const reach = Math.min(1.4, Math.max(0.4, Number(ctx.params.reach ?? 0.95)));
    const pulse = Math.min(0.14, Math.max(0, Number(ctx.params.pulse ?? 0.06)));
    const cycles = Math.min(3, Math.max(2, Math.round(Number(ctx.params.cycles ?? 3))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const raw = (((ctx.t * cycles) % 1) - LEAD) / SPAN;
    const u = Math.min(1, Math.max(0, raw));
    const unit = Math.min(ctx.width, ctx.height);
    const target = unit * 0.3;
    const span = unit * reach;
    const lanes = Array.from({ length: rings }, (_, index) => {
      const start = index * STAGGER;
      const v = Math.min(1, Math.max(0, (u - start) / TRAVEL));
      return { index, v, since: raw >= 0 ? u - (start + TRAVEL) : -1 };
    });
    const hit = lanes.reduce(
      (sum, lane) =>
        lane.since >= 0
          ? sum + pulse * Math.exp(-16 * lane.since) * Math.cos(TAU * 1.9 * lane.since)
          : sum,
      0,
    );
    const glow = lanes.reduce(
      (sum, lane) => (lane.since >= 0 ? Math.max(sum, Math.exp(-22 * lane.since)) : sum),
      0,
    );

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`scale(\${1 + hit})\`,
            transformOrigin: 'center',
            filter: \`drop-shadow(0 0 \${unit * 0.03 * glow}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        {raw >= 0
          ? lanes.map((lane) => {
              const diameter = target + (span - target) * Math.pow(1 - lane.v, 1.35);
              const opacity = Math.min(1, lane.v / 0.14) * Math.pow(1 - lane.v, 0.55);
              const thickness = Math.max(1, unit * (0.004 + lane.v * lane.v * 0.011));
              return (
                <div
                  key={lane.index}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: diameter,
                    height: diameter,
                    marginLeft: -diameter / 2,
                    marginTop: -diameter / 2,
                    borderRadius: '50%',
                    border: \`\${thickness}px solid \${signal}\`,
                    opacity: opacity * 0.9,
                    boxShadow: \`0 0 \${unit * 0.03 * lane.v}px \${signal}66\`,
                    mixBlendMode: 'screen',
                  }}
                />
              );
            })
          : null}
        {lanes.map((lane) => {
          const age = lane.since >= 0 && lane.since < ECHO ? lane.since / ECHO : -1;
          if (age < 0) return null;
          const diameter = target * (0.72 + age * 1.05);
          return (
            <div
              key={\`echo:\${lane.index}\`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: diameter,
                height: diameter,
                marginLeft: -diameter / 2,
                marginTop: -diameter / 2,
                borderRadius: '50%',
                border: \`\${Math.max(1, unit * 0.005 * (1 - age))}px solid \${signal}\`,
                opacity: Math.pow(1 - age, 2.1) * 0.8,
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 48,
            bottom: 42,
            width: 96,
            height: 3,
            background: signal,
            opacity: 0.32 + glow * 0.5,
            transform: \`scaleX(\${1 + glow * 0.5})\`,
            transformOrigin: 'left center',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
