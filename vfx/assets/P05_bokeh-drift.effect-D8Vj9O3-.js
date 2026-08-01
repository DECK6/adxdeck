const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.max(6, Math.round(Number(ctx.params.count ?? 18)));
    const size = Math.min(96, Math.max(16, Number(ctx.params.size ?? 52)));
    const drift = Math.min(18, Math.max(2, Number(ctx.params.drift ?? 9)));
    const blur = Math.min(14, Math.max(0, Number(ctx.params.blur ?? 5)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.76 }}>{ctx.subjectNode}</div>
        {Array.from({ length: count }, (_, index) => {
          const phase = ctx.random(\`bokeh:\${index}:phase\`) * TAU;
          const harmonic = 1 + Math.floor(ctx.random(\`bokeh:\${index}:harmonic\`) * 3);
          const depth = 0.35 + ctx.random(\`bokeh:\${index}:depth\`) * 0.65;
          const diameter = size * (0.45 + depth * 0.9);
          const x = 5 + ctx.random(\`bokeh:\${index}:x\`) * 90
            + Math.sin(ctx.t * TAU * harmonic + phase) * drift * depth;
          const y = 5 + ctx.random(\`bokeh:\${index}:y\`) * 90
            + Math.cos(ctx.t * TAU * harmonic + phase * 1.37) * drift * 0.7 * depth;
          const shimmer = 0.45 + Math.sin(ctx.t * TAU * harmonic + phase) * 0.2;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: \`\${x}%\`,
                top: \`\${y}%\`,
                width: diameter,
                height: diameter,
                marginLeft: -diameter / 2,
                marginTop: -diameter / 2,
                borderRadius: '50%',
                border: \`\${Math.max(1, diameter * 0.035)}px solid \${signal}\`,
                background: \`radial-gradient(circle at 35% 30%, \${signal}66, \${signal}16 38%, transparent 72%)\`,
                opacity: shimmer * depth,
                filter: \`blur(\${blur * (1.1 - depth * 0.55)}px)\`,
                boxShadow: \`0 0 \${diameter * 0.42}px \${signal}44\`,
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
