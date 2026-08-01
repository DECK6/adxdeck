const n=`import type { FxKernel } from '../../src/fx/types';

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const dropletCount = Math.max(6, Math.round(Number(ctx.params.droplets ?? 12)));
    const spread = Number(ctx.params.spread ?? 1);
    const softness = Number(ctx.params.softness ?? 0.42);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % ctx.durationInFrames) / ctx.durationInFrames;
    const pulse = (1 - Math.cos(phase * Math.PI * 2)) * 0.5;
    const progress = smoothstep(pulse);
    const diagonal = Math.hypot(ctx.width, ctx.height);
    const blobs = Array.from({ length: dropletCount + 1 }, (_, index) => {
      if (index === 0) {
        return { x: ctx.width * 0.5, y: ctx.height * 0.5, threshold: 0, target: diagonal * 1.22 };
      }
      const angle = ctx.random(\`angle:\${index}\`) * Math.PI * 2;
      const distance = (0.08 + ctx.random(\`distance:\${index}\`) * 0.38) * Math.min(ctx.width, ctx.height) * spread;
      return {
        x: ctx.width * 0.5 + Math.cos(angle) * distance,
        y: ctx.height * 0.5 + Math.sin(angle) * distance,
        threshold: 0.08 + ctx.random(\`threshold:\${index}\`) * 0.42,
        target: (0.12 + ctx.random(\`size:\${index}\`) * 0.3) * diagonal * spread,
      };
    });

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0.18 }}>
          {ctx.subjectNode}
        </div>
        {blobs.map((blob, index) => {
          const localRaw = Math.max(0, Math.min(1, (progress - blob.threshold) / Math.max(0.01, 1 - blob.threshold)));
          const local = smoothstep(localRaw);
          const size = Math.max(0.01, blob.target * local);
          const blobHeight = size * (0.82 + ctx.random(\`ratio:\${index}\`) * 0.32);
          const wobble = Math.sin(phase * Math.PI * 2 + ctx.random(\`wobble:\${index}\`) * Math.PI * 2) * 6 * softness;
          const radiusA = 42 + ctx.random(\`radius-a:\${index}\`) * 16 + wobble;
          const radiusB = 44 + ctx.random(\`radius-b:\${index}\`) * 14 - wobble * 0.5;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: blob.x,
                top: blob.y,
                width: size,
                height: blobHeight,
                overflow: 'hidden',
                borderRadius: \`\${radiusA}% \${100 - radiusA}% \${radiusB}% \${100 - radiusB}% / \${radiusB}% \${radiusA}% \${100 - radiusB}% \${100 - radiusA}%\`,
                transform: 'translate(-50%, -50%)',
                boxShadow: \`0 0 \${2 + softness * 18}px \${signal}\`,
                background: '#0D0E10',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: size * 0.5 - blob.x,
                  top: blobHeight * 0.5 - blob.y,
                  width: ctx.width,
                  height: ctx.height,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {ctx.subjectNode}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
