const n=`import type { FxKernel } from '../../src/fx/types';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'DEXA');
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 2)));
    const stagger = Number(ctx.params.stagger ?? 0.35);
    const windowRows = Number(ctx.params.window ?? 3.2);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const cycle = (ctx.frame % duration) / duration;
    const letters = phrase.split('');
    const cellHeight = Math.max(42, Math.min(ctx.height * 0.2, ctx.width * 0.115));
    const reelWidth = cellHeight * 0.69;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'flex',
            gap: Math.max(3, ctx.width * 0.008),
            transform: 'translate(-50%, -50%)',
          }}
        >
          {letters.map((target, index) => {
            if (target === ' ') {
              return <div key={\`space:\${index}\`} style={{ width: reelWidth * 0.5 }} />;
            }
            const targetIndex = Math.max(0, alphabet.indexOf(target.toUpperCase()));
            const position = cycle * alphabet.length * turns + index * stagger;
            const current = Math.floor(position);
            const fraction = position - current;

            return (
              <div
                key={\`\${target}:\${index}\`}
                style={{
                  position: 'relative',
                  width: reelWidth,
                  height: cellHeight * windowRows,
                  overflow: 'hidden',
                  borderTop: \`2px solid \${signal}8C\`,
                  borderBottom: \`2px solid \${signal}8C\`,
                  background: '#0D0E10E8',
                  boxShadow: \`inset 0 0 \${cellHeight * 0.48}px #0D0E10, 0 0 15px \${signal}14\`,
                }}
              >
                {[-2, -1, 0, 1, 2, 3].map((offset) => {
                  const letterIndex = ((targetIndex + current + offset) % alphabet.length + alphabet.length) % alphabet.length;
                  const distance = Math.abs(offset - fraction);
                  return (
                    <div
                      key={offset}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '50%',
                        height: cellHeight,
                        display: 'grid',
                        placeItems: 'center',
                        color: distance < 0.7 ? signal : '#747880',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: cellHeight * 0.72,
                        fontWeight: 800,
                        lineHeight: 1,
                        opacity: Math.max(0.08, 1 - distance * 0.31),
                        filter: \`blur(\${Math.max(0, distance - 0.45) * 1.4}px)\`,
                        transform: \`translateY(\${(offset - fraction - 0.5) * cellHeight}px)\`,
                        textShadow: distance < 0.7 ? \`0 0 15px \${signal}73\` : 'none',
                      }}
                    >
                      {alphabet[letterIndex]}
                    </div>
                  );
                })}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    height: cellHeight,
                    borderTop: \`1px solid \${signal}38\`,
                    borderBottom: \`1px solid \${signal}38\`,
                    transform: 'translateY(-50%)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
