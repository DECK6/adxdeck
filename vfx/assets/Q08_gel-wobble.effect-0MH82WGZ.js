const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const wobble = Number(ctx.params.wobble ?? 0.68);
    const elasticity = Number(ctx.params.elasticity ?? 0.74);
    const blur = Number(ctx.params.blur ?? 7);
    const cycles = Number(ctx.params.cycles ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = Math.PI * 2 * cycles * ctx.t;
    const primary = Math.sin(phase);
    const rebound = Math.sin(phase * 2 + Math.PI / 3) * elasticity;
    const scaleX = 1 + primary * wobble * 0.09 + rebound * wobble * 0.025;
    const scaleY = 1 - primary * wobble * 0.065 - rebound * wobble * 0.018;
    const skewX = primary * wobble * 5.5;
    const driftX = rebound * wobble * ctx.width * 0.012;
    const driftY = Math.cos(phase) * wobble * ctx.height * 0.014;
    const radiusA = 42 + primary * wobble * 10;
    const radiusB = 46 - primary * wobble * 8;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {Array.from({ length: 3 }, (_, index) => {
          const trail = index + 1;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: wobble * (0.13 / trail),
                filter: \`blur(\${blur * trail * 0.55}px) drop-shadow(0 0 \${8 + blur}px \${signal})\`,
                transform: \`translate3d(\${-driftX * trail * 0.65}px, \${driftY * trail * 0.45}px, 0) scale(\${1 + trail * 0.012})\`,
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: '9% 12%',
            overflow: 'hidden',
            border: \`2px solid \${signal}\`,
            borderRadius: \`\${radiusA}% \${radiusB}% \${100 - radiusA}% \${100 - radiusB}% / \${radiusB}% \${100 - radiusA}% \${radiusA}% \${100 - radiusB}%\`,
            boxShadow: \`inset 0 0 \${18 + blur * 2}px \${signal}, 0 0 \${12 + blur * 2}px \${signal}\`,
            transform: \`translate3d(\${driftX}px, \${driftY}px, 0) skewX(\${skewX}deg) scale(\${scaleX}, \${scaleY})\`,
            transformOrigin: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: '-11% -14%' }}>{ctx.subjectNode}</div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: \`radial-gradient(circle at \${50 + primary * 12}% \${42 + rebound * 8}%, transparent 0 24%, \${signal} 100%)\`,
              opacity: 0.08 + wobble * 0.12,
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
