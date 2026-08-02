const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const BALLS = 5;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const maxAngle = Number(ctx.params.angle ?? 34);
    const tempo = Math.max(1, Math.round(Number(ctx.params.tempo ?? 2)));
    const damping = Number(ctx.params.damping ?? 0.08);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = TAU * tempo * ctx.t;
    const transfer = Math.sin(phase);
    const loopEnvelope = 1 - damping * (0.5 - 0.5 * Math.cos(TAU * ctx.t));
    const leftAngle = -maxAngle * Math.max(0, -transfer) * loopEnvelope;
    const rightAngle = maxAngle * Math.max(0, transfer) * loopEnvelope;
    const collision = Math.pow(Math.abs(Math.cos(phase)), 18);
    const ballSize = Math.min(ctx.width * 0.09, ctx.height * 0.14);
    const gap = ballSize * 0.92;
    const rowWidth = gap * (BALLS - 1) + ballSize;
    const startX = (ctx.width - rowWidth) / 2;
    const pivotY = ctx.height * 0.2;
    const ropeLength = ctx.height * 0.38;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: ctx.width * 0.22,
            right: ctx.width * 0.22,
            top: pivotY - ctx.height * 0.035,
            height: ctx.height * 0.055,
            border: \`2px solid \${signal}\`,
            borderBottom: 0,
            opacity: 0.54,
          }}
        />
        {Array.from({ length: BALLS }, (_, index) => {
          const angle = index === 0 ? leftAngle : index === BALLS - 1 ? rightAngle : 0;
          const x = startX + index * gap + ballSize / 2;
          const innerNudge = index > 0 && index < BALLS - 1
            ? Math.sin(phase + index * 0.7) * collision * damping * ballSize * 0.12
            : 0;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x + innerNudge,
                top: pivotY,
                width: 0,
                height: 0,
                transform: \`rotate(\${angle}deg)\`,
                transformOrigin: '0 0',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -0.5,
                  top: 0,
                  width: 1,
                  height: ropeLength,
                  background: \`linear-gradient(#707780, \${signal})\`,
                  opacity: 0.75,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -ballSize / 2,
                  top: ropeLength - ballSize / 2,
                  width: ballSize,
                  height: ballSize,
                  borderRadius: '50%',
                  border: \`1.5px solid \${signal}\`,
                  background: index === 2 ? '#15191D' : \`radial-gradient(circle at 34% 28%, #D7E2E5, \${signal}66 38%, #15191D 72%)\`,
                  boxShadow: \`0 0 \${5 + collision * 11}px \${signal}55\`,
                  overflow: 'hidden',
                }}
              >
                {index === 2 ? ctx.subjectNode : null}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: ctx.width / 2,
            top: pivotY + ropeLength + ballSize * 0.7,
            width: ctx.width * (0.16 + collision * 0.42),
            height: ctx.height * 0.04,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: \`1px solid \${signal}\`,
            opacity: collision * 0.42,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
