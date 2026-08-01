const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const overshoot = Number(ctx.params.overshoot ?? 0.6);
    const damping = Number(ctx.params.damping ?? 6.4);
    const ring = Number(ctx.params.ring ?? 0.72);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    // damped sine spring: 0 -> 1 with overshoot, settled by the end of the entrance window
    const p = clamp01(ctx.t / 0.32);
    const omega = 5.5 + overshoot * 9;
    const decay = Math.exp(-damping * p);
    const settle = 1 - decay * Math.cos(omega * p);
    const wobble = decay * Math.sin(omega * p);

    const idle = Math.max(0, ctx.t - 0.32);
    const breathe = 1 + 0.014 * Math.sin(idle * Math.PI * 3.2);
    const scale = (0.04 + settle * 0.96) * breathe;
    const scaleX = scale * (1 + wobble * 0.18 * overshoot);
    const scaleY = scale * (1 - wobble * 0.18 * overshoot);
    const tilt = 2.4 * wobble * overshoot + 0.45 * Math.sin(idle * Math.PI * 2.2);

    const impact = clamp01((ctx.t - 0.09) / 0.3);
    const ringSize = ctx.height * (0.34 + Math.pow(impact, 0.6) * 0.9);
    const ringAlpha = ring * Math.pow(Math.sin(Math.PI * impact), 1.4) * 0.9;
    const outro = clamp01((1 - ctx.t) / 0.1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: outro }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '69%',
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(247,250,252,0.05), rgba(247,250,252,0))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '70%',
              width: ctx.height * 0.58 * scale,
              height: ctx.height * 0.09 * scale,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '70%',
              width: ctx.height * 0.3 * scale,
              height: ctx.height * 0.05 * scale,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: signal,
              opacity: 0.24 * settle,
              filter: \`blur(\${ctx.height * 0.022}px)\`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '48.6%',
              width: ringSize,
              height: ringSize,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: \`\${Math.max(1, ctx.height * 0.008)}px solid \${signal}\`,
              opacity: ringAlpha,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              transform: \`rotate(\${tilt}deg) scale(\${scaleX}, \${scaleY})\`,
              transformOrigin: '50% 47.8%',
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
