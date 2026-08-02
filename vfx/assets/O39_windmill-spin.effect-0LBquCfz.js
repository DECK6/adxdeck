const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const turns = Math.min(5, Math.max(1, Math.round(Number(ctx.params.turns ?? 3))));
    const inertia = Math.min(1, Math.max(0.35, Number(ctx.params.inertia ?? 0.94)));
    const bladeCount = Math.min(6, Math.max(3, Math.round(Number(ctx.params.blades ?? 4))));
    const radius = Math.min(0.42, Math.max(0.2, Number(ctx.params.radius ?? 0.32)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = Math.PI * 2 * ctx.t;
    const angle = turns * 360 * (ctx.t - (inertia * Math.sin(phase)) / (Math.PI * 2));
    const speed01 = (1 - inertia * Math.cos(phase)) / (1 + inertia);
    const rotorRadius = Math.min(ctx.width, ctx.height) * radius;
    const bladeWidth = rotorRadius * 0.82;
    const bladeHeight = Math.max(8, rotorRadius * 0.16);
    const hubSize = Math.max(28, rotorRadius * 0.32);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: \`\${-18 + ((index * 17 + ctx.t * 136) % 136)}%\`,
              top: \`\${13 + (index % 5) * 15}%\`,
              width: \`\${7 + (index % 3) * 4}%\`,
              height: 1,
              background: \`linear-gradient(90deg, #00000000, \${signal}, #00000000)\`,
              opacity: 0.08 + speed01 * 0.2,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '48%',
            width: rotorRadius * 2,
            height: rotorRadius * 2,
            transform: \`translate(-50%, -50%) rotate(\${angle}deg)\`,
            transformOrigin: 'center',
          }}
        >
          {Array.from({ length: bladeCount }, (_, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: \`calc(50% - \${bladeHeight / 2}px)\`,
                width: bladeWidth,
                height: bladeHeight,
                transform: \`rotate(\${(index * 360) / bladeCount}deg) translateX(\${hubSize * 0.35}px)\`,
                transformOrigin: 'left center',
                clipPath: 'polygon(0 38%, 100% 0, 84% 100%, 0 62%)',
                border: \`1px solid \${signal}\`,
                background: \`linear-gradient(90deg, \${signal}22, \${signal}77)\`,
                boxShadow: \`0 0 \${4 + speed01 * 12}px \${signal}44\`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: hubSize,
              height: hubSize,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: \`2px solid \${signal}\`,
              background: '#0D0E10',
              boxShadow: \`0 0 \${8 + speed01 * 18}px \${signal}88\`,
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: '18%' }}>{ctx.subjectNode}</div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '48%',
            width: Math.max(10, rotorRadius * 0.18),
            height: ctx.height * 0.43,
            transform: 'translateX(-50%)',
            clipPath: 'polygon(36% 0, 64% 0, 100% 100%, 0 100%)',
            background: \`linear-gradient(90deg, \${signal}20, \${signal}66, \${signal}20)\`,
            opacity: 0.72,
          }}
        />
        <div style={{ position: 'absolute', left: '7%', bottom: '7%', color: signal, fontFamily: 'JetBrains Mono, monospace', fontSize: Math.max(8, ctx.width * 0.014), letterSpacing: '0.16em', opacity: 0.72 }}>
          ROTOR {Math.round(speed01 * 100).toString().padStart(3, '0')} / INERTIA
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
