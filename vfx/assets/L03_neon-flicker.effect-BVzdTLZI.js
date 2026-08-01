const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const glow = Number(ctx.params.glow ?? 0.82);
    const flickerRate = Number(ctx.params.flickerRate ?? 22);
    const settle = Number(ctx.params.settle ?? 0.3);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const flickerIndex = Math.floor(ctx.t * flickerRate);
    const flickerNoise = ctx.random(\`flicker:\${flickerIndex}\`);
    const warmup = Math.min(1, ctx.t / Math.max(0.01, settle));
    const unstable = warmup < 1
      ? (flickerNoise > 0.42 ? 0.58 + flickerNoise * 0.42 : 0.04 + flickerNoise * 0.28)
      : 1;
    const ignitionPulse = warmup < 1 ? 0.78 + Math.sin(ctx.t * Math.PI * flickerRate * 1.7) * 0.22 : 1;
    const power = Math.max(0.04, unstable * ignitionPulse);
    const blur = 5 + glow * 20;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: power,
            filter: \`brightness(\${1 + glow * 0.7}) drop-shadow(0 0 \${blur * 0.35}px \${signal}) drop-shadow(0 0 \${blur}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '10%',
            color: '#F7FAFC',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.42em',
            textAlign: 'center',
            opacity: power * 0.82,
            textShadow: \`0 0 4px #F7FAFC, 0 0 \${blur * 0.55}px \${signal}, 0 0 \${blur * 1.2}px \${signal}, 0 0 \${blur * 2}px \${signal}\`,
          }}
        >
          DEXA VFX
        </div>
        <div style={{ position: 'absolute', left: 48, bottom: 42, width: 96 + glow * 160, height: 3, background: signal, opacity: power * 0.8, boxShadow: \`0 0 \${blur}px \${signal}\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
