const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const threshold = Math.min(0.8, Math.max(0.05, Number(ctx.params.threshold ?? 0.34)));
    const intensity = Math.min(2, Math.max(0.5, Number(ctx.params.intensity ?? 1.25)));
    const trailCount = Math.min(6, Math.max(2, Math.round(Number(ctx.params.trails ?? 4))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bass = (bands[0] + bands[1] + bands[2]) / 3;
    const beat = clamp01((bass * 0.72 + rms * 0.28 - threshold) / Math.max(0.05, 1 - threshold));
    const gate = Math.pow(0.5 + 0.5 * Math.cos(ctx.t * TAU * 12), 10);
    const flash = clamp01(beat * intensity * (0.3 + gate * 0.7));
    const directionX = Math.sin(ctx.t * TAU * 3);
    const directionY = Math.cos(ctx.t * TAU * 2);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: flash > 0.72 ? '#F7FAFC' : '#090A0D' }}>
        {Array.from({ length: trailCount }, (_, index) => {
          const distance = (index + 1) * (3 + flash * 9);
          const alpha = (0.06 + flash * 0.2) * (1 - index / (trailCount + 1));
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: alpha,
                transform: \`translate3d(\${directionX * distance}px, \${directionY * distance * 0.55}px, 0) scale(\${1 + index * 0.012})\`,
                filter: index % 2 === 0 ? \`drop-shadow(0 0 \${6 + flash * 18}px \${signal})\` : 'grayscale(1)',
              }}
            >
              {ctx.subjectNode}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.66 + beat * 0.3,
            transform: \`scale(\${1 + flash * 0.055})\`,
            filter: \`contrast(\${1 + flash * 0.75}) drop-shadow(0 0 \${5 + beat * 18}px \${signal})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: signal, opacity: flash * 0.72, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', inset: \`\${7 + flash * 3}%\`, border: \`1px solid \${signal}\`, opacity: 0.16 + beat * 0.56, boxShadow: \`inset 0 0 \${10 + flash * 30}px \${signal}\` }} />
        <div
          style={{
            position: 'absolute',
            left: '6%',
            top: '7%',
            color: flash > 0.62 ? '#080A0E' : signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(8, ctx.height * 0.045),
            fontWeight: 800,
            letterSpacing: '0.16em',
            opacity: 0.38 + beat * 0.6,
          }}
        >
          SYNC {Math.round(beat * 99).toString().padStart(2, '0')}
        </div>
        <div style={{ position: 'absolute', left: \`\${7 + (0.5 + 0.5 * Math.sin(ctx.t * TAU)) * 86}%\`, bottom: '6%', width: 10, height: 10, marginLeft: -5, borderRadius: '50%', background: signal, opacity: 0.45 + flash * 0.5, boxShadow: \`0 0 \${8 + flash * 16}px \${signal}\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
