const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.68);
    const softness = Number(ctx.params.softness ?? 0.58);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 2)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame / Math.max(1, ctx.durationInFrames)) * Math.PI * 2 * cycles;
    const breath = 0.5 - Math.cos(phase) * 0.5;
    const innerStop = 30 + softness * 28 - breath * 5;
    const edgeOpacity = intensity * (0.72 + breath * 0.28);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`scale(\${1 + breath * 0.018})\`,
            filter: \`brightness(\${1 - breath * intensity * 0.08})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(ellipse at center, transparent \${innerStop}%, rgba(13, 14, 16, \${edgeOpacity * 0.2}) \${innerStop + 18}%, rgba(13, 14, 16, \${edgeOpacity}) 100%)\`,
            boxShadow: \`inset 0 0 \${24 + softness * 96}px \${signal}18\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
