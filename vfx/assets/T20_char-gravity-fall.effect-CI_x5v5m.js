const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'DEXA VFX').toUpperCase();
    const drop = Number(ctx.params.drop ?? 0.55);
    const bounce = Number(ctx.params.bounce ?? 0.34);
    const stagger = Number(ctx.params.stagger ?? 0.05);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const characters = text.split('');
    const fontSize = Math.max(20, Math.min((ctx.width * 0.84) / Math.max(6, characters.length * 0.68), ctx.height * 0.24));
    const fallDuration = 0.26;
    const outro = clamp01((1 - ctx.t) / 0.1);
    const intro = clamp01(ctx.t / 0.08);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.11 }}>
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', left: '10%', right: '10%', bottom: '38%', height: 1, background: signal, opacity: 0.25 * outro * intro }} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '38%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize,
            fontWeight: 700,
            lineHeight: 1,
            color: '#F5F8FA',
            whiteSpace: 'pre',
          }}
        >
          {characters.map((character, index) => {
            const delay = 0.04 + index * stagger + ctx.random(\`delay:\${index}\`) * 0.05;
            const fall = clamp01((ctx.t - delay) / fallDuration);
            const since = ctx.t - delay - fallDuration;
            const fallY = -ctx.height * drop * (1 - fall * fall);
            const settle = since > 0 ? -Math.abs(Math.sin(since * 26)) * fontSize * bounce * Math.exp(-since * 14) : 0;
            const impact = since > 0 ? Math.exp(-Math.pow(since / 0.03, 2)) : 0;
            const puff = since > 0 ? clamp01(since / 0.2) : 1;

            return (
              <span
                key={\`\${character}:\${index}\`}
                style={{ position: 'relative', display: 'inline-block', minWidth: character === ' ' ? '0.62em' : undefined }}
              >
                {puff < 1 && character !== ' ' && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '-0.05em',
                      width: '1.5em',
                      height: '0.2em',
                      marginLeft: '-0.75em',
                      borderRadius: '50%',
                      background: \`radial-gradient(closest-side, \${signal}, transparent)\`,
                      opacity: (1 - puff) * 0.6 * outro,
                      transform: \`scale(\${0.35 + puff * 1.5}, \${0.5 + puff * 0.6})\`,
                    }}
                  />
                )}
                <span
                  style={{
                    display: 'inline-block',
                    opacity: clamp01(fall * 5) * outro,
                    transform: \`translate3d(0, \${fallY + settle}px, 0) scale(\${1 + impact * 0.24}, \${1 - impact * 0.3})\`,
                    transformOrigin: '50% 100%',
                    textShadow: \`0 0 \${4 + impact * 30}px \${signal}\`,
                  }}
                >
                  {character}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
