const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const count = Math.min(5, Math.max(3, Math.round(Number(ctx.params.count ?? 4))));
    const lifetime = Math.min(1.5, Math.max(0.5, Number(ctx.params.lifetime ?? 1)));
    const side = String(ctx.params.side ?? 'right');
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const flow = (ctx.t * (1.65 / lifetime)) % 1;
    const cardWidth = Math.min(ctx.width * 0.52, ctx.height * 1.04);
    const cardHeight = Math.min(ctx.height * 0.14, cardWidth * 0.23);
    const gap = cardHeight * 0.16;
    const labels = ['EXPORT READY', 'SIGNAL SYNCED', 'VFX CACHED', 'RENDER QUEUED', 'FRAME VERIFIED'];
    const direction = side === 'left' ? -1 : 1;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F5FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, transform: 'scale(0.9)' }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: cardWidth, height: count * (cardHeight + gap), transform: 'translate(-50%, -50%)' }}>
          {Array.from({ length: count }, (_, index) => {
            const age = (flow + index / count) % 1;
            const entering = ease(age / 0.16);
            const leaving = ease((age - 0.78) / 0.22);
            const visible = entering * (1 - leaving);
            const rank = Math.floor(age * count);
            const y = (count - 1 - rank) * (cardHeight + gap);
            const exitX = leaving * direction * cardWidth * 1.25;
            const entryX = (1 - entering) * -direction * cardWidth * 0.3;
            const life = clamp01((0.78 - age) / 0.62);
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: cardWidth,
                  height: cardHeight,
                  boxSizing: 'border-box',
                  borderRadius: Math.max(8, cardHeight * 0.16),
                  border: \`1px solid \${rank === 0 ? signal : '#3A4148'}\`,
                  background: '#171A1EF5',
                  boxShadow: rank === 0 ? \`0 14px 34px #000000A8, 0 0 20px \${signal}24\` : '0 10px 26px #00000088',
                  opacity: visible * (1 - rank * 0.08),
                  transform: \`translate3d(\${entryX + exitX}px, \${y}px, 0) scale(\${1 - rank * 0.025})\`,
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: cardHeight * 0.2, top: cardHeight * 0.27, width: cardHeight * 0.46, height: cardHeight * 0.46, borderRadius: '50%', border: \`2px solid \${signal}\`, boxSizing: 'border-box' }}>
                  <div style={{ position: 'absolute', left: '27%', top: '22%', width: '38%', height: '20%', borderLeft: \`2px solid \${signal}\`, borderBottom: \`2px solid \${signal}\`, transform: 'rotate(-45deg)' }} />
                </div>
                <div style={{ position: 'absolute', left: cardHeight * 0.84, top: '25%', color: '#F7FAFC', fontSize: Math.max(9, cardWidth * 0.033), fontWeight: 750, letterSpacing: '0.07em' }}>{labels[index]}</div>
                <div style={{ position: 'absolute', left: cardHeight * 0.84, top: '57%', color: '#9CA8B0', fontSize: Math.max(7, cardWidth * 0.023), letterSpacing: '0.06em' }}>DEXA VFX · 00{index + 1}</div>
                <div style={{ position: 'absolute', left: 0, bottom: 0, width: \`\${life * 100}%\`, height: Math.max(2, cardHeight * 0.035), background: signal, boxShadow: \`0 0 10px \${signal}\` }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
