const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const tilt = Math.min(24, Math.max(4, Number(ctx.params.tilt ?? 15)));
    const damping = Math.min(7, Math.max(1, Number(ctx.params.damping ?? 3.8)));
    const oscillations = Math.min(5, Math.max(2, Math.round(Number(ctx.params.oscillations ?? 3))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const half = ctx.t * 2;
    const secondHalf = ctx.t >= 0.5;
    const u = secondHalf ? half - 1 : half;
    const envelope = (1 - u) * Math.exp(-damping * u);
    const angle = (secondHalf ? -1 : 1) * tilt * Math.sin(Math.PI * 2 * oscillations * u) * envelope;
    const beamWidth = ctx.width * 0.68;
    const beamHeight = Math.max(10, ctx.height * 0.035);
    const loadSize = Math.min(ctx.width, ctx.height) * 0.18;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', left: '9%', right: '9%', top: '72%', height: 1, background: signal, opacity: 0.22 }} />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '61%',
            width: ctx.width * 0.15,
            height: ctx.height * 0.2,
            transform: 'translateX(-50%)',
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            borderBottom: \`2px solid \${signal}\`,
            background: \`linear-gradient(90deg, \${signal}12, \${signal}55, \${signal}12)\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '57%',
            width: beamWidth,
            height: beamHeight,
            transform: \`translate(-50%, -50%) rotate(\${angle}deg)\`,
            transformOrigin: 'center',
            border: \`1px solid \${signal}\`,
            borderRadius: beamHeight,
            background: \`linear-gradient(180deg, \${signal}88, \${signal}22)\`,
            boxShadow: \`0 0 \${6 + Math.abs(angle)}px \${signal}44\`,
          }}
        >
          {[-1, 1].map((side) => (
            <div
              key={side}
              style={{
                position: 'absolute',
                left: side < 0 ? beamHeight : undefined,
                right: side > 0 ? beamHeight : undefined,
                bottom: beamHeight * 0.8,
                width: loadSize,
                height: loadSize,
                border: \`1px solid \${signal}\`,
                borderRadius: '50%',
                background: '#101519',
                overflow: 'hidden',
                transform: \`rotate(\${-angle}deg)\`,
                transformOrigin: 'center bottom',
              }}
            >
              <div style={{ position: 'absolute', inset: '17%' }}>{ctx.subjectNode}</div>
            </div>
          ))}
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: \`\${42 + index * 4}%\`,
              top: \`\${81 + Math.abs(angle) * 0.2}%\`,
              width: \`\${1 + index * 0.4}%\`,
              height: 1,
              background: signal,
              opacity: Math.max(0.05, 0.34 - index * 0.06),
            }}
          />
        ))}
        <div style={{ position: 'absolute', left: '7%', bottom: '7%', color: signal, fontFamily: 'JetBrains Mono, monospace', fontSize: Math.max(8, ctx.width * 0.014), letterSpacing: '0.16em', opacity: 0.72 }}>
          BALANCE {angle >= 0 ? '+' : '−'}{Math.abs(angle).toFixed(1)}°
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
