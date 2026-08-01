const n=`import type { FxKernel } from '../../src/fx/types';

const TRAIL = 6;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const radius = Number(ctx.params.radius ?? 0.5);
    const flatten = Number(ctx.params.flatten ?? 0.42);
    const lean = Number(ctx.params.lean ?? 0.6);
    const cycles = Math.max(1, Math.round(Number(ctx.params.cycles ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const unitX = ctx.width / 100;
    const turn = Math.PI * 2 * ((cycles * ctx.t) % 1);
    const rx = radius * 11 * unitX;
    const ry = rx * flatten;
    const centerX = ctx.width / 2;
    const centerY = ctx.height * 0.5;
    const orbitX = Math.cos(turn) * rx;
    const orbitY = Math.sin(turn) * ry;
    // velocity is (-sin, cos) — bank into the direction of travel
    const bank = -lean * 13 * Math.sin(turn);
    const near = Math.sin(turn); // +1 at the near (bottom) side of the ellipse
    const scale = 1 + near * 0.055;
    const markerSize = 2.2 * unitX;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: centerX,
            top: centerY,
            width: rx * 2,
            height: ry * 2,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: \`1px dashed \${signal}\`,
            opacity: 0.24,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: centerX,
            top: centerY,
            width: 1.6 * unitX,
            height: 1.6 * unitX,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: signal,
            opacity: 0.35,
          }}
        />
        {Array.from({ length: TRAIL }, (_, index) => {
          const lag = turn - (index + 1) * 0.24;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: centerX + Math.cos(lag) * rx,
                top: centerY + Math.sin(lag) * ry,
                width: markerSize * (1 - index / (TRAIL + 2)),
                height: markerSize * (1 - index / (TRAIL + 2)),
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: signal,
                opacity: 0.42 * (1 - index / TRAIL),
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: centerX + orbitX,
            top: centerY + orbitY,
            width: markerSize,
            height: markerSize,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: signal,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: centerX + orbitX,
            top: ctx.height * 0.87,
            width: (16 + near * 3) * unitX,
            height: 4.2 * unitX,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
            opacity: 0.14 + Math.max(0, near) * 0.16,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`translate3d(\${orbitX}px, \${orbitY}px, 0) rotate(\${bank}deg) scale(\${scale})\`,
            transformOrigin: 'center',
            filter: \`drop-shadow(0 0 \${(2 + Math.max(0, near) * 4) * unitX}px \${signal}44)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
