const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const foldAngle = Number(ctx.params.foldAngle ?? 165);
    const stagger = Number(ctx.params.stagger ?? 0.1);
    const shade = Number(ctx.params.shade ?? 0.7);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    // hinge 1 — right panel unfolds off the centre crease
    const p1 = clamp01(ctx.t / 0.26);
    const open = 1 - Math.exp(-5.8 * p1) * Math.cos(7.6 * p1);
    const rotY = -foldAngle * (1 - open);
    const backShade = (shade * (1 - Math.cos((rotY * Math.PI) / 180))) / 2;

    // hinge 2 — the opened sheet lays down onto the ground plane
    const p2 = clamp01((ctx.t - stagger) / 0.3);
    const flat = 1 - Math.exp(-5.2 * p2) * Math.cos(6.8 * p2);
    const idle = Math.max(0, ctx.t - stagger - 0.3);
    const rotX = -58 * (1 - flat) + 0.7 * Math.sin(idle * Math.PI * 1.6);

    const spread = clamp01(open);
    const outro = clamp01((1 - ctx.t) / 0.1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: outro }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '74%',
              width: ctx.height * (0.34 + spread * 0.5),
              height: ctx.height * 0.08,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.84), rgba(0,0,0,0))',
              opacity: 0.4 + clamp01(flat) * 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              perspective: ctx.width * 2.4,
              perspectiveOrigin: '50% 100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: \`rotateX(\${rotX}deg)\`,
                transformOrigin: '50% 100%',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)' }}>
                {ctx.subjectNode}
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: 'inset(0 0 0 50%)',
                  transform: \`rotateY(\${rotY}deg)\`,
                  transformOrigin: '50% 50%',
                }}
              >
                {ctx.subjectNode}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#08090B',
                    opacity: backShade,
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: Math.max(1, ctx.height * 0.007),
                  transform: 'translateX(-50%)',
                  background: signal,
                  opacity: 0.12 + (1 - spread) * 0.62,
                  boxShadow: \`0 0 \${ctx.height * 0.05}px \${signal}\`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
