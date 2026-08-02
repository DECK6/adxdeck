const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const layers = Math.max(3, Math.min(7, Math.round(Number(ctx.params.layers ?? 5))));
    const depth = Number(ctx.params.depth ?? 75);
    const orbit = Number(ctx.params.orbit ?? 0.07);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const theta = phase * Math.PI * 2;
    const cameraX = Math.cos(theta) * ctx.width * orbit;
    const cameraY = Math.sin(theta) * ctx.height * orbit * 0.62;
    const yaw = Math.sin(theta) * 9;
    const pitch = Math.cos(theta) * 5;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.3 }}>
        <div
          data-layout-allow-overflow
          data-layout-allow-overlap
          style={{
            position: 'absolute',
            inset: '12%',
            transformStyle: 'preserve-3d',
            transform: \`rotateX(\${pitch}deg) rotateY(\${yaw}deg)\`,
          }}
        >
          {Array.from({ length: layers }, (_, index) => {
            const centered = index - (layers - 1) / 2;
            const normalizedDepth = centered / Math.max(1, (layers - 1) / 2);
            const z = centered * depth;
            const x = -cameraX * normalizedDepth;
            const y = -cameraY * normalizedDepth;
            const inset = Math.abs(centered) * 1.7;
            const alpha = 0.24 + ((index + 1) / layers) * 0.58;

            return (
              <div
                key={index}
                data-layout-allow-overflow
                data-layout-allow-overlap
                data-layout-allow-occlusion
                style={{
                  position: 'absolute',
                  inset: \`\${inset}%\`,
                  overflow: 'hidden',
                  transformStyle: 'preserve-3d',
                  transform: \`translate3d(\${x}px, \${y}px, \${z}px)\`,
                  border: \`1px solid \${signal}\`,
                  borderRadius: 12,
                  background: '#0D0E10',
                  opacity: alpha,
                  boxShadow: \`0 0 \${8 + index * 5}px \${signal}3D\`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: \`translate(\${cameraX * normalizedDepth * 0.45}px, \${cameraY * normalizedDepth * 0.45}px) scale(\${0.9 + index * 0.025})\`,
                    filter: \`brightness(\${0.56 + index / layers}) saturate(\${0.65 + index / layers})\`,
                  }}
                >
                  {ctx.subjectNode}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 10,
                    color: signal,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    letterSpacing: '0.12em',
                  }}
                >
                  Z {Math.round(z)}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: \`\${50 + Math.cos(theta) * 33}%\`,
            top: \`\${50 + Math.sin(theta) * 23}%\`,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: signal,
            boxShadow: \`0 0 18px \${signal}\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
