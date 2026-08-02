const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const bands = Math.max(4, Math.round(Number(ctx.params.bands ?? 7)));
    const amplitude = Number(ctx.params.amplitude ?? 30);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * TAU * speed;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg, #10181C 0%, #0D0E10 100%)' }}>
        {Array.from({ length: bands }, (_, index) => {
          const depth = (index + 1) / bands;
          const y = 10 + depth * 78 + Math.sin(phase * (1 + index % 2) + index * 1.17) * amplitude * (0.25 + depth * 0.75);
          const tilt = Math.cos(phase + index * 0.8) * (1.2 + depth * 2.6);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '-18%',
                top: \`\${y}%\`,
                width: '136%',
                height: \`\${8 + depth * 10}%\`,
                borderRadius: '50%',
                borderTop: \`2px solid \${signal}\${index % 2 === 0 ? '70' : '3D'}\`,
                background: \`linear-gradient(180deg, \${signal}\${index % 2 === 0 ? '20' : '12'}, transparent 76%)\`,
                filter: \`blur(\${(1 - depth) * 2.2}px)\`,
                opacity: 0.32 + depth * 0.42,
                transform: \`rotate(\${tilt}deg) scaleY(\${0.72 + depth * 0.5})\`,
                transformOrigin: '50% 0%',
              }}
            />
          );
        })}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0.24, transform: 'scale(0.92)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #0D0E107A 0%, transparent 26%, transparent 74%, #0D0E107A 100%)' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
