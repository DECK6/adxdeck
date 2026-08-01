const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'DEXA VFX').toUpperCase();
    const jump = Number(ctx.params.jump ?? 0.46);
    const stagger = Number(ctx.params.stagger ?? 0.72);
    const squash = Number(ctx.params.squash ?? 0.55);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const characters = text.split('');
    const last = Math.max(1, characters.length - 1);
    const fontSize = Math.max(20, Math.min((ctx.width * 0.84) / Math.max(6, characters.length * 0.68), ctx.height * 0.24));
    const hop = 0.32;
    const spread = (1 - hop) * stagger;
    // two full passes of the domino wave per 6s loop
    const cycle = (ctx.t * 2) % 1;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', left: '12%', right: '12%', bottom: '42%', height: 1, background: signal, opacity: 0.22 }} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '42%',
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
            const raw = (cycle - (index / last) * spread) / hop;
            const air = Math.sin(Math.PI * clamp01(raw));
            const impact = Math.exp(-Math.pow(raw / 0.08, 2)) + Math.exp(-Math.pow((raw - 1) / 0.08, 2));
            const lift = -Math.pow(air, 0.72) * fontSize * jump;
            const scaleY = 1 + air * squash * 0.12 - impact * squash * 0.34;
            const scaleX = 1 - air * squash * 0.08 + impact * squash * 0.3;

            return (
              <span
                key={\`\${character}:\${index}\`}
                style={{ position: 'relative', display: 'inline-block', minWidth: character === ' ' ? '0.62em' : undefined }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '-8%',
                    right: '-8%',
                    bottom: '-0.09em',
                    height: '0.08em',
                    borderRadius: '50%',
                    background: signal,
                    opacity: character === ' ' ? 0 : 0.34 * (1 - air),
                    transform: \`scaleX(\${1 - air * 0.45})\`,
                  }}
                />
                <span
                  style={{
                    display: 'inline-block',
                    transform: \`translate3d(0, \${lift}px, 0) scale(\${scaleX}, \${scaleY})\`,
                    transformOrigin: '50% 100%',
                    textShadow: \`0 0 \${6 + air * 26}px \${signal}\`,
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
