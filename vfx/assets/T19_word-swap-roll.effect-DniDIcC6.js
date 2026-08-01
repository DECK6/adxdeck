const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (u: number) => u * u * (3 - 2 * u);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const source = String(ctx.params.words ?? 'DEXA VFX,MOTION,SIGNAL,SYSTEM');
    const lead = Number(ctx.params.lead ?? 0.18);
    const blurAmount = Number(ctx.params.blur ?? 7);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const parsed = source.split(',').map((word) => word.trim().toUpperCase()).filter((word) => word.length > 0);
    const words = parsed.length > 0 ? parsed : ['DEXA'];
    const columns = words.reduce((widest, word) => Math.max(widest, word.length), 1);
    const padded = words.map((word) => {
      const room = columns - word.length;
      const left = Math.floor(room / 2);
      return ' '.repeat(left) + word + ' '.repeat(room - left);
    });
    // the first word is repeated at the tail so the last roll lands on the loop seam
    const cells = [...padded, padded[0]];

    const fontSize = Math.max(20, Math.min((ctx.width * 0.8) / Math.max(5, columns * 0.7), ctx.height * 0.26));
    const lineHeight = fontSize * 1.28;
    const advance = fontSize * 0.66;
    const steps = words.length;
    const sequence = ctx.t * steps;
    const step = Math.min(steps - 1, Math.floor(sequence));
    const local = sequence - step;
    const swap = Math.sin(Math.PI * smooth(clamp01((local - 0.56) / 0.4)));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize,
            fontWeight: 700,
            lineHeight: \`\${lineHeight}px\`,
            color: '#F5F8FA',
            whiteSpace: 'pre',
          }}
        >
          {Array.from({ length: columns }, (_, column) => {
            const start = Math.min(0.84, 0.56 + (columns > 1 ? column / (columns - 1) : 0) * lead);
            const progress = smooth(clamp01((local - start) / (0.96 - start)));
            const rolling = Math.sin(Math.PI * progress);
            const offset = -(step + progress) * lineHeight;

            return (
              <div
                key={column}
                style={{
                  position: 'relative',
                  width: advance,
                  height: lineHeight,
                  overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    transform: \`translate3d(0, \${offset}px, 0)\`,
                    filter: \`blur(\${rolling * blurAmount * 0.1}px)\`,
                  }}
                >
                  {cells.map((cell, row) => (
                    <div
                      key={\`\${row}:\${cell[column]}\`}
                      style={{
                        height: lineHeight,
                        opacity: 1 - rolling * 0.25,
                        textShadow: \`0 0 \${2 + rolling * 16}px \${signal}\`,
                      }}
                    >
                      {cell[column]}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: advance * columns,
            height: 2,
            marginLeft: -(advance * columns) / 2,
            marginTop: lineHeight * 0.62,
            background: signal,
            opacity: 0.3 + swap * 0.55,
            transform: \`scaleX(\${0.6 + swap * 0.4})\`,
            boxShadow: \`0 0 \${6 + swap * 16}px \${signal}\`,
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
