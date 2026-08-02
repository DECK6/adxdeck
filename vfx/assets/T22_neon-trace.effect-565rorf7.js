const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'DEXA');
    const trace = Number(ctx.params.trace ?? 0.58);
    const glow = Number(ctx.params.glow ?? 24);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const loop = (ctx.frame % duration) / duration;
    const progress = loop < trace ? loop / trace : loop < 0.86 ? 1 : Math.max(0, (1 - loop) / 0.14);
    const textSize = Math.max(38, Math.min(ctx.width * 0.22, ctx.height * 0.48));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.04em', fontFamily: 'Inter, Arial, sans-serif', fontSize: textSize, fontWeight: 900, letterSpacing: '0.04em' }}>
          {text.split('').map((character, index) => {
            const start = index / Math.max(1, text.length) * 0.72;
            const letterProgress = Math.max(0, Math.min(1, (progress - start) / 0.28));
            const eased = letterProgress * letterProgress * (3 - 2 * letterProgress);
            return (
              <span
                key={\`\${character}:\${index}\`}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  color: signal,
                  WebkitTextFillColor: signal,
                  WebkitTextStroke: \`2px \${signal}\`,
                  opacity: 0.36 + eased * 0.64,
                  transform: \`translateY(\${(1 - eased) * 4}px)\`,
                  filter: \`drop-shadow(0 0 \${glow * (0.12 + eased * 0.28)}px \${signal})\`,
                }}
              >
                {character}
                <span style={{ position: 'absolute', left: '50%', top: \`\${100 - eased * 100}%\`, width: 5, height: 5, borderRadius: '50%', background: '#FFFFFF', boxShadow: \`0 0 \${glow * 0.7}px \${signal}\`, opacity: letterProgress > 0 && letterProgress < 1 ? 1 : 0 }} />
              </span>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: '18%', right: '18%', bottom: '24%', height: 1, background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`, opacity: progress * 0.48, transform: \`scaleX(\${progress})\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
