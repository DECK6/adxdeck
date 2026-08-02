const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const size = Number(ctx.params.size ?? 300);
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const tilt = Number(ctx.params.tilt ?? -8);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const theta = phase * Math.PI * 2;
    const side = size * 0.72;
    const prismHeight = size;
    const radius = side / (2 * Math.tan(Math.PI / 3));
    const rotation = phase * 360 * turns;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.3 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, filter: 'grayscale(1)' }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '72%',
            width: side * 1.35,
            height: side * 0.2,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}2E, transparent)\`,
            filter: 'blur(7px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: side,
            height: prismHeight,
            transformStyle: 'preserve-3d',
            transform: \`translate(-50%, -50%) rotateX(\${tilt + Math.sin(theta) * 4}deg) rotateY(\${rotation}deg)\`,
          }}
        >
          {[0, 1, 2].map((faceIndex) => {
            const angle = faceIndex * 120;
            const tint = 0.08 + faceIndex * 0.07;
            return (
              <div
                key={faceIndex}
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  transform: \`rotateY(\${angle}deg) translateZ(\${radius}px)\`,
                  backfaceVisibility: 'hidden',
                  border: \`1px solid \${signal}\`,
                  boxSizing: 'border-box',
                  background: '#0D0E10',
                  boxShadow: \`inset 0 0 \${size * 0.16}px #000000, 0 0 12px \${signal}44\`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: \`scale(\${1 + faceIndex * 0.035})\`,
                    filter: \`hue-rotate(\${faceIndex * 22}deg) brightness(\${0.74 + faceIndex * 0.11})\`,
                  }}
                >
                  {ctx.subjectNode}
                </div>
                <div style={{ position: 'absolute', inset: 0, background: signal, opacity: tint }} />
                <div
                  style={{
                    position: 'absolute',
                    right: 12,
                    bottom: 10,
                    color: signal,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                    letterSpacing: '0.18em',
                  }}
                >
                  FACE {faceIndex + 1}
                </div>
              </div>
            );
          })}
          {[-1, 1].map((direction) => (
            <div
              key={direction}
              style={{
                position: 'absolute',
                left: 0,
                top: direction < 0 ? 0 : prismHeight,
                width: side,
                height: side * 0.866,
                clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
                transformOrigin: '50% 0%',
                transform: \`\${direction < 0 ? 'rotateX(90deg)' : 'rotateX(-90deg) rotateZ(180deg)'} translateY(\${-side * 0.577}px)\`,
                background: \`linear-gradient(135deg, #11161C, \${signal}88)\`,
                border: \`1px solid \${signal}\`,
                boxSizing: 'border-box',
              }}
            />
          ))}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
