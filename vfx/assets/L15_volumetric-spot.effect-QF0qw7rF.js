const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Math.min(1, Math.max(0.15, Number(ctx.params.intensity ?? 0.78)));
    const spread = Math.min(62, Math.max(18, Number(ctx.params.spread ?? 42)));
    const dustCount = Math.min(42, Math.max(8, Math.round(Number(ctx.params.dust ?? 24))));
    const sweep = Math.min(3, Math.max(1, Math.round(Number(ctx.params.sweep ?? 1))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU * sweep;
    const sourceX = 50 + Math.sin(phase) * 7;
    const poolX = 50 - Math.sin(phase) * 14;
    const breathe = 0.82 + Math.cos(phase * 2) * 0.08;
    const left = poolX - spread / 2;
    const right = poolX + spread / 2;
    const dust = Array.from({ length: dustCount }, (_, i) => {
      const depth = 0.12 + ctx.random(\`dust:\${i}:depth\`) * 0.78;
      const coneHalfWidth = spread * depth * 0.42;
      const driftPhase = phase + ctx.random(\`dust:\${i}:phase\`) * TAU;
      return {
        x: poolX + (ctx.random(\`dust:\${i}:x\`) * 2 - 1) * coneHalfWidth + Math.sin(driftPhase) * 1.4,
        y: 7 + depth * 78 + Math.cos(driftPhase * 2) * 1.8,
        size: 1 + ctx.random(\`dust:\${i}:size\`) * 2.2,
        opacity: (0.16 + ctx.random(\`dust:\${i}:alpha\`) * 0.5) * (0.55 + 0.45 * Math.sin(driftPhase * 3) ** 2),
      };
    });

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(ellipse 36% 16% at \${poolX}% 83%, \${signal}38 0%, \${signal}12 52%, transparent 76%)\`,
            opacity: intensity,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: \`polygon(\${sourceX - 1}% 0%, \${sourceX + 1}% 0%, \${right}% 84%, \${left}% 84%)\`,
            background: \`linear-gradient(180deg, \${signal}42 0%, \${signal}1f 38%, \${signal}0a 78%, transparent 100%)\`,
            filter: 'blur(7px)',
            opacity: intensity * breathe,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: \`polygon(\${sourceX - 0.35}% 0%, \${sourceX + 0.35}% 0%, \${poolX + spread * 0.3}% 84%, \${poolX - spread * 0.3}% 84%)\`,
            background: \`linear-gradient(180deg, \${signal}70 0%, \${signal}18 54%, transparent 100%)\`,
            opacity: intensity * 0.68,
          }}
        />
        {dust.map((particle, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: \`\${particle.x}%\`,
              top: \`\${particle.y}%\`,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: signal,
              boxShadow: \`0 0 \${particle.size * 3}px \${signal}\`,
              opacity: particle.opacity * intensity,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`drop-shadow(0 0 \${8 + intensity * 12}px \${signal})\`,
            opacity: 0.72 + intensity * 0.28,
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
