const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.min(24, Math.max(8, Math.round(Number(ctx.params.count ?? 15))));
    const radius = Math.min(190, Math.max(60, Number(ctx.params.radius ?? 118)));
    const drift = Math.min(20, Math.max(4, Number(ctx.params.drift ?? 11)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(circle at 48% 44%, #152027 0%, #0D0E10 58%, #08090B 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>{ctx.subjectNode}</div>
        {Array.from({ length: count }, (_, index) => {
          const layer = index % 3;
          const depth = [0.38, 0.64, 1][layer];
          const harmonic = 1 + Math.floor(ctx.random(\`bokeh:\${index}:harmonic\`) * 2);
          const phase = ctx.random(\`bokeh:\${index}:phase\`) * TAU;
          const diameter = radius * depth * (0.72 + ctx.random(\`bokeh:\${index}:size\`) * 0.64);
          const x = 4 + ctx.random(\`bokeh:\${index}:x\`) * 92 + Math.sin(ctx.t * TAU * harmonic + phase) * drift * depth;
          const y = 5 + ctx.random(\`bokeh:\${index}:y\`) * 90 + Math.cos(ctx.t * TAU * harmonic + phase * 1.31) * drift * 0.62 * depth;
          const shimmer = 0.72 + 0.18 * Math.sin(ctx.t * TAU * harmonic + phase * 0.8);
          const blur = layer === 0 ? diameter * 0.11 : layer === 1 ? diameter * 0.055 : diameter * 0.025;

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
                border: \`1px solid \${signal}\${layer === 2 ? '52' : '2E'}\`,
                background: \`radial-gradient(circle at 34% 30%, \${signal}\${layer === 2 ? '3D' : '24'}, \${signal}12 43%, transparent 72%)\`,
                boxShadow: \`inset 0 0 \${diameter * 0.18}px \${signal}1A, 0 0 \${diameter * 0.24}px \${signal}1F\`,
                filter: \`blur(\${blur}px)\`,
                opacity: shimmer * (0.22 + depth * 0.26),
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.38) 100%)' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
