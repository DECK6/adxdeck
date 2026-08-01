const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const layerCount = Math.max(3, Math.min(6, Math.round(Number(ctx.params.layers ?? 4))));
    const spread = Number(ctx.params.spread ?? 84);
    const tilt = Number(ctx.params.tilt ?? 13);
    const orbit = Number(ctx.params.orbit ?? 0.09);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const theta = phase * Math.PI * 2;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          perspective: ctx.width * 1.15,
        }}
      >
        {Array.from({ length: layerCount }, (_, index) => {
          const depthIndex = index - (layerCount - 1) / 2;
          const layerPhase = theta + (index * Math.PI * 2) / layerCount;
          const x = Math.cos(layerPhase) * ctx.width * orbit;
          const y = Math.sin(layerPhase) * ctx.height * orbit * 0.62;
          const z = depthIndex * spread + Math.sin(theta + index * 0.8) * spread * 0.28;
          const alpha = 0.16 + ((index + 1) / layerCount) * 0.58;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: \`\${9 + index * 2}%\`,
                border: \`1px solid \${signal}\`,
                background: '#0D0E10',
                opacity: alpha,
                transformStyle: 'preserve-3d',
                transform: \`translate3d(\${x}px, \${y}px, \${z}px) rotateX(\${tilt + Math.sin(layerPhase) * 4}deg) rotateY(\${Math.cos(theta + index) * tilt}deg)\`,
                boxShadow: \`0 0 \${10 + index * 5}px \${signal}33\`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, transform: \`scale(\${0.82 + index * 0.035})\` }}>
                {ctx.subjectNode}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: \`\${50 + Math.cos(theta) * 38}%\`,
            top: \`\${50 + Math.sin(theta) * 30}%\`,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: signal,
            boxShadow: \`0 0 20px \${signal}\`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
