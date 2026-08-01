const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const spacing = Number(ctx.params.spacing ?? 20);
    const dotSize = Number(ctx.params.dotSize ?? 6);
    const intensity = Number(ctx.params.intensity ?? 0.78);
    const speed = Number(ctx.params.speed ?? 1);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const scanProgress = (ctx.t * speed) % 1;
    const scanY = -18 + scanProgress * 136;
    const mask = \`radial-gradient(circle, #000 0 \${dotSize / 2}px, transparent \${dotSize / 2 + 0.8}px)\`;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          backgroundColor: '#0D0E10',
          backgroundImage: \`radial-gradient(circle, \${signal}22 0 1.5px, transparent 1.8px)\`,
          backgroundSize: \`\${spacing}px \${spacing}px\`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2 + intensity * 0.34,
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: \`\${spacing}px \${spacing}px\`,
            WebkitMaskSize: \`\${spacing}px \${spacing}px\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: \`inset(\${scanY - 10}% 0 \${90 - scanY}% 0)\`,
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: \`\${spacing}px \${spacing}px\`,
            WebkitMaskSize: \`\${spacing}px \${spacing}px\`,
            filter: \`brightness(1.8) drop-shadow(0 0 10px \${signal})\`,
            opacity: 0.65 + intensity * 0.35,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: \`\${scanY}%\`,
            height: 3,
            background: signal,
            boxShadow: \`0 0 18px \${signal}, 0 0 48px \${signal}\`,
            opacity: 0.35 + intensity * 0.5,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
