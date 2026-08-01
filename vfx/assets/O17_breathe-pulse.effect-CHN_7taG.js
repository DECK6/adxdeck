const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const depth = Number(ctx.params.depth ?? 0.6);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const glow = Number(ctx.params.glow ?? 0.55);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const unitX = ctx.width / 100;
    const unitY = ctx.height / 100;
    const turn = Math.PI * 2 * ((cycles * ctx.t) % 1);
    // second harmonic skews the wave — short inhale, long exhale — while staying exactly periodic
    const breath = (Math.sin(turn) - 0.34 * Math.sin(turn * 2)) / 1.26;
    const fill = (breath + 1) / 2;
    const inhale = Math.max(0, Math.cos(turn) - 0.68 * Math.cos(turn * 2)) / 1.68;
    const scaleX = 1 + breath * depth * 0.11;
    const scaleY = 1 + breath * depth * 0.15;
    const glowAlpha = Math.round(30 + glow * fill * 170)
      .toString(16)
      .padStart(2, '0');
    const haloSize = (34 + fill * 16) * unitX;
    const poolWidth = (24 + fill * 7) * unitX;
    const meterHeight = ctx.height * 0.42;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            width: haloSize * 2.1,
            height: haloSize * 2.1,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
            opacity: glow * (0.06 + fill * 0.16),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            width: haloSize,
            height: haloSize,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: \`1px solid \${signal}\`,
            opacity: glow * (0.16 + inhale * 0.5),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: ctx.height * 0.85,
            width: poolWidth,
            height: 6.5 * unitY * (1 + fill * 0.24),
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
            opacity: 0.16 + fill * 0.2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`scale(\${scaleX}, \${scaleY})\`,
            transformOrigin: '50% 62%',
            filter: \`drop-shadow(0 0 \${(2 + fill * 7) * unitX}px \${signal}\${glowAlpha})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 7 * unitX,
            top: (ctx.height - meterHeight) / 2,
            width: 3 * unitX,
            height: meterHeight,
            border: \`1px solid \${signal}\`,
            opacity: 0.28,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 7 * unitX,
            top: (ctx.height - meterHeight) / 2 + meterHeight * (1 - fill),
            width: 3 * unitX,
            height: meterHeight * fill,
            background: signal,
            opacity: 0.5 + inhale * 0.4,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
