const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const lift = Number(ctx.params.lift ?? 0.62);
    const sway = Number(ctx.params.sway ?? 0.5);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const unitX = ctx.width / 100;
    const unitY = ctx.height / 100;
    const turn = Math.PI * 2 * ((cycles * ctx.t) % 1);
    const phaseA = ctx.random('hover:phase:a') * Math.PI * 2;
    const phaseB = ctx.random('hover:phase:b') * Math.PI * 2;
    // integer harmonics only — every term returns to its t=0 value at t=1
    const swayNorm =
      Math.sin(turn + phaseA) * 0.62 + Math.sin(turn * 2 + phaseB) * 0.26 + Math.sin(turn * 3 + phaseA) * 0.12;
    const riseNorm =
      Math.cos(turn + phaseB) * 0.6 + Math.cos(turn * 2 + phaseA) * 0.28 + Math.cos(turn * 3 + phaseB) * 0.12;
    const rollNorm = Math.sin(turn * 2 + phaseA) * 0.6 + Math.sin(turn * 3 + phaseB) * 0.4;
    const driftX = swayNorm * sway * 3.6 * unitX;
    const driftY = riseNorm * lift * 5.4 * unitY;
    const roll = rollNorm * sway * 2.1;
    const altitude = -riseNorm; // +1 at the top of the float, -1 at the bottom
    const groundY = ctx.height * 0.84;
    const poolScale = 1 + altitude * 0.34 * lift;
    const poolAlpha = 0.34 - altitude * 0.14;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: ctx.width / 2 + driftX * 0.55,
            top: groundY,
            width: 27 * unitX * poolScale,
            height: 7.5 * unitY * poolScale,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
            opacity: poolAlpha,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: groundY,
            width: 48 * unitX,
            height: 1,
            background: signal,
            opacity: 0.16,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6 * unitX,
            top: ctx.height * 0.26,
            width: 1,
            height: ctx.height * 0.48,
            background: signal,
            opacity: 0.14,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 4 * unitX,
            top: ctx.height / 2 + driftY,
            width: 5 * unitX,
            height: 1,
            background: signal,
            opacity: 0.62,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`translate3d(\${driftX}px, \${driftY}px, 0) rotate(\${roll}deg)\`,
            transformOrigin: 'center',
            filter: \`drop-shadow(0 \${2 * unitY}px \${(3 + altitude * 2) * unitX}px rgba(0, 0, 0, 0.6))\`,
          }}
        >
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
