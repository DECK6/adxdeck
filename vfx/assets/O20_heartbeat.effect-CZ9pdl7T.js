const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const beats = Math.max(1, Math.round(Number(ctx.params.beats ?? 5)));
    const depth = Number(ctx.params.depth ?? 0.6);
    const rings = Math.max(2, Math.round(Number(ctx.params.rings ?? 4)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const unitX = ctx.width / 100;
    const turn = Math.PI * 2 * ((beats * ctx.t) % 1);
    // powered raised cosine — a narrow spike per cycle, still a pure harmonic of t
    const pulseAt = (lag: number, sharp: number) => Math.pow((1 - Math.cos(turn - lag)) / 2, sharp);
    const lub = pulseAt(0, 14);
    const dub = pulseAt(0.92, 20) * 0.62;
    const beat = Math.min(1, lub + dub);
    const scale = 1 + beat * depth * 0.17;
    const bpm = Math.round((beats * ctx.fps * 60) / ctx.durationInFrames);
    const centerY = ctx.height * 0.5;
    const meterHeight = ctx.height * 0.34;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: centerY,
            width: 62 * unitX,
            height: 62 * unitX,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
            opacity: beat * 0.24,
          }}
        />
        {Array.from({ length: rings }, (_, index) => {
          const env = pulseAt(0.3 + index * 0.4, 9);
          const size = (17 + index * 7.5) * unitX * 2;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: centerY,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: \`\${Math.max(1, 0.5 * unitX)}px solid \${signal}\`,
                opacity: env * 0.7 * (1 - index / (rings + 1)),
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: ctx.height * 0.86,
            width: (22 + beat * 5) * unitX,
            height: (5 + beat * 1.4) * unitX,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
            opacity: 0.16 + beat * 0.2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: \`scale(\${scale})\`,
            transformOrigin: '50% 50%',
            filter: \`drop-shadow(0 0 \${(2 + beat * 8) * unitX}px \${signal}66)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 6 * unitX,
            top: (ctx.height - meterHeight) / 2,
            width: 2.4 * unitX,
            height: meterHeight,
            border: \`1px solid \${signal}\`,
            opacity: 0.26,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6 * unitX,
            top: (ctx.height - meterHeight) / 2 + meterHeight * (1 - beat),
            width: 2.4 * unitX,
            height: meterHeight * beat,
            background: signal,
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6 * unitX,
            bottom: ctx.height * 0.07,
            color: signal,
            fontFamily: 'monospace',
            fontSize: Math.max(9, 3.6 * unitX),
            letterSpacing: '0.16em',
            opacity: 0.4 + beat * 0.5,
          }}
        >
          {bpm.toString().padStart(2, '0')} BPM
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
