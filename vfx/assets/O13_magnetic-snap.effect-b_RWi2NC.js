const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const pull = Number(ctx.params.pull ?? 0.3);
    const sharpness = Number(ctx.params.sharpness ?? 3.2);
    const ringCount = Math.max(1, Math.min(4, Math.round(Number(ctx.params.rings ?? 3))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const seconds = ctx.durationInFrames / Math.max(1, ctx.fps);
    const contact = 0.48;
    const release = 0.82;
    const travel = ctx.width * pull;

    const offsetAt = (at: number) => {
      if (at < contact) {
        const u = Math.max(0, at) / contact;
        return -travel * (1 - Math.pow(u, sharpness)); // 1/r²-style acceleration into the pole
      }
      if (at < release) {
        const age = (at - contact) * seconds;
        return travel * 0.05 * Math.exp(-7 * age) * Math.sin(Math.PI * 2 * 7.5 * age); // snap chatter
      }
      const u = (at - release) / (1 - release);
      return -travel * (u * u * (3 - 2 * u)); // let go — drifts back to the start pose so the loop closes
    };

    const offset = offsetAt(ctx.t);
    const speed = Math.abs(offset - offsetAt(ctx.t - 0.01)) / 0.01;
    const speed01 = Math.min(1, speed / Math.max(1, ctx.width * 2.5));
    const proximity = Math.max(0, 1 - Math.abs(offset) / Math.max(1, travel));
    const snapAge = (ctx.t - contact) * seconds;
    const flash = snapAge > 0 && snapAge < 0.5 ? Math.exp(-snapAge / 0.07) : 0;
    const locked = ctx.t >= contact && ctx.t < release;

    const boxWidth = ctx.width * 0.3;
    const boxHeight = ctx.height * 0.38;
    const centerX = ctx.width / 2;
    const centerY = ctx.height / 2;
    const fieldRadius = Math.min(ctx.width, ctx.height) * 0.42;
    const flow = (ctx.t * 2) % 1; // integer cycles per loop keeps the field seamless

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        {Array.from({ length: ringCount }, (_, index) => {
          const fraction = (index + 1 - flow) / ringCount;
          const diameter = fieldRadius * 2 * Math.max(0.06, fraction);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: centerX - diameter / 2,
                top: centerY - diameter / 2,
                width: diameter,
                height: diameter,
                border: \`1px solid \${signal}\`,
                borderRadius: '50%',
                opacity: (0.1 + proximity * 0.34) * (1 - Math.abs(fraction - 0.55)),
              }}
            />
          );
        })}
        {flash > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: centerX - fieldRadius * (0.3 + (1 - flash) * 1.1),
              top: centerY - fieldRadius * (0.3 + (1 - flash) * 1.1),
              width: fieldRadius * 2 * (0.3 + (1 - flash) * 1.1),
              height: fieldRadius * 2 * (0.3 + (1 - flash) * 1.1),
              border: \`2px solid \${signal}\`,
              borderRadius: '50%',
              boxShadow: \`0 0 \${24 * flash}px \${signal}\`,
              opacity: flash * 0.8,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            left: centerX - fieldRadius * 0.14,
            top: centerY - fieldRadius * 0.14,
            width: fieldRadius * 0.28,
            height: fieldRadius * 0.28,
            border: \`1.5px solid \${signal}\`,
            borderRadius: '50%',
            boxShadow: locked ? \`0 0 \${14 + flash * 30}px \${signal}\` : 'none',
            opacity: 0.3 + proximity * 0.5,
          }}
        />
        {[0.03, 0.06].map((delay, index) => (
          <div
            key={delay}
            style={{
              position: 'absolute',
              left: centerX + offsetAt(ctx.t - delay) - boxWidth / 2,
              top: centerY - boxHeight / 2,
              width: boxWidth,
              height: boxHeight,
              opacity: speed01 * (0.26 - index * 0.1),
              filter: 'grayscale(0.5)',
            }}
          >
            {ctx.subjectNode}
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: centerX + offset - boxWidth / 2,
            top: centerY - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
            transform: \`scale(\${1 + speed01 * 0.32}, \${1 - speed01 * 0.2})\`,
            transformOrigin: 'center',
            filter: \`brightness(\${1 + flash * 0.7}) drop-shadow(0 0 \${6 + (proximity * 14 + flash * 30)}px \${signal}77)\`,
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
            opacity: 0.72,
          }}
        >
          FIELD {Math.round(proximity * 100).toString().padStart(3, '0')} {locked ? '/ LOCK' : ''}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
