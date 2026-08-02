const n=`import type { FxKernel } from '../../src/fx/types';

const FACE_TRANSFORMS = [
  (depth: number) => \`translateZ(\${depth}px)\`,
  (depth: number) => \`rotateY(180deg) translateZ(\${depth}px)\`,
  (depth: number) => \`rotateY(90deg) translateZ(\${depth}px)\`,
  (depth: number) => \`rotateY(-90deg) translateZ(\${depth}px)\`,
  (depth: number) => \`rotateX(90deg) translateZ(\${depth}px)\`,
  (depth: number) => \`rotateX(-90deg) translateZ(\${depth}px)\`,
];

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const sizeRatio = Math.min(0.58, Math.max(0.26, Number(ctx.params.size ?? 0.42)));
    const perspective = Number(ctx.params.perspective ?? 880);
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const faceShade = Math.min(0.8, Math.max(0.1, Number(ctx.params.faceShade ?? 0.42)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const size = Math.min(ctx.width * sizeRatio, ctx.height * sizeRatio * 1.7);
    const depth = size / 2;
    const phase = ctx.t * Math.PI * 2 * turns;
    const rotateX = phase;
    const rotateY = phase * 2;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: '#0D0E10',
          perspective,
        }}
      >
        <div
          data-layout-allow-overflow
          data-layout-allow-overlap
          style={{
            position: 'relative',
            width: size,
            height: size,
            transformStyle: 'preserve-3d',
            transform: \`rotateX(\${rotateX}rad) rotateY(\${rotateY}rad) rotateZ(\${Math.sin(phase) * 0.08}rad)\`,
          }}
        >
          {FACE_TRANSFORMS.map((faceTransform, index) => (
            <div
              key={index}
              data-layout-allow-overflow
              data-layout-allow-overlap
              data-layout-allow-occlusion
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                boxSizing: 'border-box',
                border: \`1px solid \${signal}\`,
                background: '#0D0E10',
                backfaceVisibility: 'hidden',
                transform: faceTransform(depth),
                boxShadow: \`inset 0 0 \${size * 0.12}px rgba(0,0,0,\${faceShade}), 0 0 \${size * 0.045}px \${signal}42\`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, opacity: 0.5 + index * 0.065 }}>
                {ctx.subjectNode}
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: size * 0.045,
                  bottom: size * 0.035,
                  color: signal,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: Math.max(8, size * 0.055),
                  letterSpacing: '0.12em',
                  opacity: 0.72,
                }}
              >
                F{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
