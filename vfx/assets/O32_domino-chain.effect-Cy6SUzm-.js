const n=`import type { FxKernel } from '../../src/fx/types';

function smooth(value: number): number {
  const u = Math.min(1, Math.max(0, value));
  return u * u * (3 - 2 * u);
}

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.max(5, Math.min(11, Math.round(Number(ctx.params.count ?? 9))));
    const speed = Number(ctx.params.speed ?? 1);
    const lean = Number(ctx.params.lean ?? 68);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const dominoWidth = Math.min(ctx.width * 0.075, ctx.height * 0.11);
    const dominoHeight = ctx.height * 0.27;
    const spacing = Math.min(ctx.width * 0.09, (ctx.width * 0.74) / Math.max(1, count - 1));
    const rowWidth = spacing * (count - 1) + dominoWidth;
    const startX = (ctx.width - rowWidth) / 2;
    const ground = ctx.height * 0.75;
    const fallStart = 0.1;
    const fallSpan = 0.42 / Math.max(0.55, speed);
    const riseStart = 0.68;
    const riseSpan = 0.24 / Math.max(0.55, speed);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: ground,
            height: 1,
            background: signal,
            opacity: 0.22,
          }}
        />
        {Array.from({ length: count }, (_, index) => {
          const fallDelay = (index / count) * fallSpan;
          const riseDelay = ((count - 1 - index) / count) * riseSpan;
          const fallen = smooth((ctx.t - fallStart - fallDelay) / Math.max(0.04, fallSpan / count * 2.4));
          const restored = smooth((ctx.t - riseStart - riseDelay) / Math.max(0.04, riseSpan / count * 2.2));
          const amount = fallen * (1 - restored);
          const angle = lean * amount;
          const impactAge = ctx.t - fallStart - fallDelay - fallSpan / count * 1.7;
          const impact = impactAge > 0 && impactAge < 0.08 ? 1 - impactAge / 0.08 : 0;
          const isSubject = index === Math.floor(count / 2);
          return (
            <div key={index}>
              {impact > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: startX + index * spacing + dominoWidth * 0.5,
                    top: ground,
                    width: dominoWidth * (0.5 + impact * 1.4),
                    height: dominoWidth * (0.16 + impact * 0.34),
                    border: \`1px solid \${signal}\`,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: impact * 0.5,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  left: startX + index * spacing,
                  top: ground - dominoHeight,
                  width: dominoWidth,
                  height: dominoHeight,
                  border: \`1.5px solid \${signal}\`,
                  borderRadius: Math.max(2, dominoWidth * 0.08),
                  background: isSubject ? '#14181C' : \`\${signal}\${index % 2 === 0 ? '24' : '12'}\`,
                  transform: \`rotate(\${angle}deg)\`,
                  transformOrigin: '50% 100%',
                  boxShadow: \`0 0 \${4 + impact * 16}px \${signal}44\`,
                  overflow: 'hidden',
                }}
              >
                {isSubject ? ctx.subjectNode : (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '13%',
                      bottom: '13%',
                      width: 1,
                      background: signal,
                      opacity: 0.3,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: '7%',
            bottom: '7%',
            color: signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(8, ctx.width * 0.014),
            letterSpacing: '0.16em',
            opacity: 0.7,
          }}
        >
          CHAIN {count.toString().padStart(2, '0')} / CASCADE
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
