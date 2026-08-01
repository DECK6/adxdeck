const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const distance = Number(ctx.params.distance ?? 0.28);
    const brake = Number(ctx.params.brake ?? 5.2);
    const leanMax = Number(ctx.params.lean ?? 15);
    const trailCount = Math.max(0, Math.min(5, Math.round(Number(ctx.params.trails ?? 4))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const seconds = ctx.durationInFrames / Math.max(1, ctx.fps);
    const travel = ctx.width * distance;
    const span = 0.3;
    const runs = [
      { start: 0.08, from: -1, to: 1 },
      { start: 0.56, from: 1, to: -1 },
    ];
    const brakeEase = (u: number) => (1 - Math.exp(-brake * u)) / (1 - Math.exp(-brake));

    const positionAt = (at: number) => {
      let x = -travel;
      let settle = 0;
      for (const run of runs) {
        if (at <= run.start) break;
        const u = Math.min(1, (at - run.start) / span);
        x = travel * (run.from + (run.to - run.from) * brakeEase(u));
        const age = (at - run.start - span) * seconds;
        settle = u >= 1 ? travel * 0.03 * run.to * Math.exp(-5 * age) * Math.sin(Math.PI * 2 * 2.4 * age) : 0;
      }
      return x + settle;
    };

    const here = positionAt(ctx.t);
    const velocity = (here - positionAt(ctx.t - 0.01)) / 0.01;
    const peakSpeed = (2 * travel * brake) / (span * (1 - Math.exp(-brake)));
    const speed01 = Math.min(1, Math.abs(velocity) / Math.max(1, peakSpeed));
    const heading = velocity === 0 ? 0 : Math.sign(velocity);
    const launchKick = runs.reduce((kick, run) => {
      const age = ctx.t - run.start;
      if (age < 0 || age > 0.12) return kick;
      return kick + Math.exp(-age / 0.028);
    }, 0);
    // braking tips the body forward; the launch impulse tips it back for a beat
    const lean = leanMax * heading * (Math.pow(speed01, 0.7) - Math.min(1.3, launchKick * 1.3));

    const boxWidth = ctx.width * 0.3;
    const boxHeight = ctx.height * 0.4;
    const centerX = ctx.width / 2;
    const ground = ctx.height * 0.8;
    const shadowWidth = boxWidth * (0.5 + speed01 * 0.55);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: ground,
            height: 1,
            background: signal,
            opacity: 0.24,
          }}
        />
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: \`\${8 + index * 10.5}%\`,
              top: ground,
              width: 1,
              height: ctx.height * 0.02,
              background: signal,
              opacity: 0.16,
            }}
          />
        ))}
        {Array.from({ length: 4 }, (_, index) => {
          const jitter = ctx.random(\`streak:\${index}\`);
          const length = ctx.width * 0.06 + speed01 * ctx.width * 0.2 * (0.5 + jitter * 0.5);
          const y = ground - boxHeight * (0.25 + jitter * 0.55);
          return (
            <div
              key={\`streak:\${index}\`}
              style={{
                position: 'absolute',
                left: centerX + here - heading * (boxWidth * 0.4 + length),
                top: y,
                width: length,
                height: 1,
                background: \`linear-gradient(\${heading > 0 ? '270deg' : '90deg'}, \${signal}, #00000000)\`,
                opacity: speed01 * 0.5,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: centerX + here - shadowWidth / 2 - heading * speed01 * boxWidth * 0.12,
            top: ground - Math.max(3, ctx.height * 0.012),
            width: shadowWidth,
            height: Math.max(5, ctx.height * 0.024),
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}4D, #00000000)\`,
            opacity: 0.55,
          }}
        />
        {Array.from({ length: trailCount }, (_, index) => (
          <div
            key={\`trail:\${index}\`}
            style={{
              position: 'absolute',
              left: centerX + positionAt(ctx.t - (index + 1) * 0.018) - boxWidth / 2,
              top: ground - boxHeight,
              width: boxWidth,
              height: boxHeight,
              opacity: speed01 * (0.26 - index * 0.045),
              filter: 'grayscale(0.55)',
            }}
          >
            {ctx.subjectNode}
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: centerX + here - boxWidth / 2,
            top: ground - boxHeight,
            width: boxWidth,
            height: boxHeight,
            transform: \`rotate(\${lean}deg) scale(\${1 + speed01 * 0.12}, \${1 - speed01 * 0.07})\`,
            transformOrigin: 'center bottom',
            filter: \`drop-shadow(0 0 \${5 + speed01 * 20}px \${signal}55)\`,
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
          VEL {Math.round(speed01 * 100).toString().padStart(3, '0')} / LEAN {lean >= 0 ? '+' : '−'}
          {Math.abs(lean).toFixed(1)}°
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
