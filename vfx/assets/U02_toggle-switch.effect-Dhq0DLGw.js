const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const size = Math.min(1.25, Math.max(0.65, Number(ctx.params.size ?? 0.92)));
    const cycles = Math.min(4, Math.max(1, Math.round(Number(ctx.params.cycles ?? 2))));
    const snap = Math.min(1, Math.max(0.35, Number(ctx.params.snap ?? 0.72)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const wave = 0.5 - Math.cos(ctx.t * TAU * cycles) * 0.5;
    const exponent = 1 + snap * 5;
    const forward = Math.pow(wave, exponent);
    const reverse = Math.pow(1 - wave, exponent);
    const position = forward / Math.max(0.0001, forward + reverse);
    const transition = Math.sin(ctx.t * TAU * cycles);
    const base = Math.min(ctx.width * 0.28, ctx.height * 0.34) * size;
    const trackWidth = base * 2.05;
    const trackHeight = base;
    const inset = trackHeight * 0.12;
    const knobSize = trackHeight - inset * 2;
    const travel = trackWidth - inset * 2 - knobSize;
    const squash = 1 + Math.abs(transition) * 0.1 * snap;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1 + position * 0.12,
            transform: \`scale(\${0.96 + position * 0.04})\`,
            filter: \`saturate(\${0.7 + position * 0.7})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        {[1.42, 1.2].map((ringScale, index) => (
          <div
            key={ringScale}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight,
              border: \`1px solid \${signal}\`,
              opacity: position * (0.11 + index * 0.08),
              transform: \`translate(-50%, -50%) scale(\${ringScale + position * 0.06})\`,
              boxShadow: \`0 0 \${18 + index * 10}px \${signal}22\`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight,
            transform: 'translate(-50%, -50%)',
            background: \`linear-gradient(90deg, #24272C 0%, #24272C \${Math.max(0, position * 100 - 18)}%, \${signal} \${position * 100}%, #24272C \${Math.min(100, position * 100 + 18)}%)\`,
            border: \`1px solid \${position > 0.5 ? signal : '#454A52'}\`,
            boxShadow: position > 0.5 ? \`inset 0 0 \${trackHeight * 0.28}px \${signal}44, 0 0 \${trackHeight * 0.32}px \${signal}22\` : 'inset 0 0 18px #00000099',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: inset + travel * position,
              top: inset,
              width: knobSize,
              height: knobSize,
              borderRadius: '50%',
              background: position > 0.5 ? '#E9FDFF' : '#8A8D93',
              border: \`2px solid \${position > 0.5 ? signal : '#B8BBC1'}\`,
              boxSizing: 'border-box',
              transform: \`scaleX(\${squash}) scaleY(\${2 - squash})\`,
              boxShadow: position > 0.5 ? \`0 0 \${knobSize * 0.45}px \${signal}\` : '0 5px 16px #00000099',
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
