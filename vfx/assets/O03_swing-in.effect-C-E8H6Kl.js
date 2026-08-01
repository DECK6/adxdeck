const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const angle = Number(ctx.params.angle ?? 98);
    const damping = Number(ctx.params.damping ?? 3.4);
    const stiffness = Number(ctx.params.stiffness ?? 11);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    // pendulum released from \`angle\`, damped toward rest, then idle sway
    const p = clamp01(ctx.t / 0.46);
    const decay = Math.exp(-damping * p);
    const swing = -angle * decay * Math.cos(stiffness * p);
    const idle = Math.max(0, ctx.t - 0.46);
    const rot = swing + 1.1 * Math.sin(idle * Math.PI * 1.5);

    const speed = Math.abs(decay * Math.sin(stiffness * p));
    const pin = Math.max(2, ctx.height * 0.028);
    const outro = clamp01((1 - ctx.t) / 0.1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: outro }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(58% 58% at 50% 44%, rgba(247,250,252,0.08), rgba(247,250,252,0) 72%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              transform: \`translate(\${ctx.height * 0.06}px, \${ctx.height * 0.05}px) rotate(\${rot}deg) scale(1.05)\`,
              transformOrigin: '50% 0%',
              filter: \`brightness(0) blur(\${ctx.height * 0.022}px)\`,
              opacity: 0.55,
            }}
          >
            {ctx.subjectNode}
          </div>
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              transform: \`rotate(\${rot}deg)\`,
              transformOrigin: '50% 0%',
            }}
          >
            {ctx.subjectNode}
          </div>
          <div
            style={{
              position: 'absolute',
              left: '32%',
              right: '32%',
              top: \`calc(19% - \${pin * 0.55}px)\`,
              height: pin * 0.55,
              background: 'linear-gradient(180deg, #24272C, #14161A)',
              borderTop: '1px solid rgba(247,250,252,0.16)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '19%',
              width: pin,
              height: pin,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: signal,
              opacity: 0.55 + speed * 0.45,
              boxShadow: \`0 0 \${pin * 1.6}px \${signal}\`,
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
