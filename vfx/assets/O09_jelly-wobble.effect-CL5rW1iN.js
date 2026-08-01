const n=`import type { FxKernel } from '../../src/fx/types';

/** Damped elastic response to one impact at \`impact\` seconds — 0 before it lands. */
function ringing(time: number, impact: number, freq: number, decay: number): number {
  const span = time - impact;
  if (span <= 0) return 0;
  return Math.exp(-decay * span) * Math.sin(Math.PI * 2 * freq * span);
}

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const amplitude = Number(ctx.params.amplitude ?? 0.32);
    const frequency = Number(ctx.params.frequency ?? 3.2);
    const damping = Number(ctx.params.damping ?? 2);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const seconds = ctx.durationInFrames / Math.max(1, ctx.fps);
    const time = ctx.t * seconds;
    const dropLand = seconds * 0.16;
    const hopStart = seconds * 0.5;
    const hopLand = seconds * 0.68;

    const boxWidth = ctx.width * 0.44;
    const boxHeight = ctx.height * 0.5;
    const ground = ctx.height * 0.82;
    const dropHeight = ctx.height * 0.34;
    const hopHeight = ctx.height * 0.2;

    let lift = 0;
    if (time < dropLand) {
      const fall = time / dropLand;
      lift = dropHeight * (1 - fall * fall);
    } else if (time > hopStart && time < hopLand) {
      const arc = (time - hopStart) / (hopLand - hopStart);
      lift = hopHeight * 4 * arc * (1 - arc);
    }
    const height01 = Math.min(1, lift / dropHeight);

    // volume-preserving jelly: scaleX up ⇒ scaleY down by the exact inverse
    const impact =
      amplitude * (ringing(time, dropLand, frequency, damping) + 0.82 * ringing(time, hopLand, frequency * 1.12, damping));
    const deform = Math.max(-0.45, Math.min(0.45, impact - height01 * 0.16));
    const scaleX = 1 + deform;
    const scaleY = 1 / (1 + deform);

    const intro = Math.min(1, ctx.t / 0.05);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.1));
    const visible = intro * outro;

    const shadowWidth = boxWidth * (0.5 + deform * 0.42) * (1 - height01 * 0.38);
    const shadowHeight = Math.max(4, ctx.height * 0.028 * (1 - height01 * 0.3));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            top: ground,
            height: 1,
            background: signal,
            opacity: 0.22 * visible,
          }}
        />
        {[dropLand, hopLand].map((landing) => {
          const age = time - landing;
          if (age <= 0 || age > 0.85) return null;
          const spread = age / 0.85;
          const ringWidth = boxWidth * (0.34 + spread * 1.5);
          return (
            <div
              key={landing}
              style={{
                position: 'absolute',
                left: ctx.width / 2 - ringWidth / 2,
                top: ground - ringWidth * 0.11,
                width: ringWidth,
                height: ringWidth * 0.22,
                border: \`1.5px solid \${signal}\`,
                borderRadius: '50%',
                opacity: (1 - spread) * 0.5 * visible,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: ctx.width / 2 - shadowWidth / 2,
            top: ground - shadowHeight / 2,
            width: shadowWidth,
            height: shadowHeight,
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}55, #00000000)\`,
            opacity: (0.62 - height01 * 0.34) * visible,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: (ctx.width - boxWidth) / 2,
            top: ground - boxHeight,
            width: boxWidth,
            height: boxHeight,
            transform: \`translate3d(0, \${-lift}px, 0) scale(\${scaleX}, \${scaleY})\`,
            transformOrigin: 'center bottom',
            opacity: visible,
            filter: \`drop-shadow(0 0 \${6 + Math.abs(deform) * 26}px \${signal}66)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '7%',
            bottom: '7%',
            color: signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(8, ctx.width * 0.014),
            letterSpacing: '0.16em',
            opacity: 0.7 * visible,
          }}
        >
          DEFORM {Math.round(Math.abs(deform) * 100).toString().padStart(2, '0')}
        </div>
        <div
          style={{
            position: 'absolute',
            right: '7%',
            bottom: '7.6%',
            width: '18%',
            height: 2,
            background: \`\${signal}33\`,
            opacity: visible,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: signal,
              transform: \`scaleX(\${Math.min(1, Math.abs(deform) / 0.45)})\`,
              transformOrigin: 'right',
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
