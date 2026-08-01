const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'BOUNCE');
    const amount = Number(ctx.params.amount ?? 0.62);
    const tempo = Math.max(1, Math.round(Number(ctx.params.tempo ?? 2)));
    const stagger = Number(ctx.params.stagger ?? 0.75);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * Math.PI * 2 * tempo;
    const textSize = Math.max(24, Math.min(ctx.width * 0.13, ctx.height * 0.31));
    const characters = phrase.split('');

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '49%',
            display: 'flex',
            alignItems: 'flex-end',
            transform: 'translate(-50%, -50%)',
            color: signal,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: textSize,
            fontWeight: 900,
            lineHeight: 0.8,
            letterSpacing: '-0.07em',
            whiteSpace: 'pre',
          }}
        >
          {characters.map((character, index) => {
            const wave = Math.sin(phase - index * stagger);
            const yScale = 1 + wave * amount * 0.72;
            const xScale = 1 - wave * amount * 0.42;
            const lift = Math.max(0, wave) * -textSize * amount * 0.24;

            return (
              <span
                key={\`\${character}:\${index}\`}
                style={{
                  display: 'inline-block',
                  minWidth: character === ' ' ? '0.38em' : undefined,
                  transform: \`translate3d(0, \${lift}px, 0) scale(\${xScale}, \${yScale})\`,
                  transformOrigin: '50% 100%',
                  textShadow: \`0 \${8 + Math.max(0, wave) * 12}px \${14 + amount * 18}px \${signal}52\`,
                }}
              >
                {character}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '13%',
            right: '13%',
            top: '66%',
            height: 3,
            background: signal,
            opacity: 0.5,
            transform: \`scaleX(\${0.62 + Math.sin(phase) * 0.28})\`,
            boxShadow: \`0 0 14px \${signal}\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
