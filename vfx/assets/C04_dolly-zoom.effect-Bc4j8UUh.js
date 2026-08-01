const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Number(ctx.params.intensity ?? 0.72);
    const depth = Number(ctx.params.depth ?? 1.25);
    const vignette = Number(ctx.params.vignette ?? 0.62);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const turn = ctx.t * Math.PI * 2;
    const travel = (1 - Math.cos(turn)) * 0.5;
    const environmentScale = 1 + travel * intensity * depth * 1.45;
    const subjectScale = 1 + Math.sin(turn) * intensity * 0.025;
    const subjectDepth = -travel * intensity * ctx.width * 0.035;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-18%',
            opacity: 0.16 + intensity * 0.2,
            backgroundImage: \`repeating-radial-gradient(ellipse at center, transparent 0 9%, \${signal} 9.25% 9.45%, transparent 9.7% 18%)\`,
            transform: \`scale(\${environmentScale})\`,
            transformOrigin: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            transform: \`translate3d(0, 0, \${subjectDepth}px) scale(\${subjectScale})\`,
            filter: \`drop-shadow(0 0 \${8 + travel * 18 * intensity}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(ellipse at center, transparent \${42 - vignette * 10}%, #0D0E10 \${86 - vignette * 20}%)\`,
            opacity: 0.35 + vignette * 0.55,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
