const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const label = String(ctx.params.label ?? 'DEXA VFX / SIGNAL');
    const right = String(ctx.params.side ?? 'right') === 'right';
    const reach = Number(ctx.params.reach ?? 0.32);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const dotIn = smooth((ctx.t - 0.04) / 0.12);
    const firstLine = smooth((ctx.t - 0.12) / 0.16);
    const secondLine = smooth((ctx.t - 0.25) / 0.18);
    const labelIn = smooth((ctx.t - 0.38) / 0.16);
    const outro = smooth((1 - ctx.t) / 0.1);
    const startX = ctx.width * (right ? 0.36 : 0.64);
    const startY = ctx.height * 0.43;
    const direction = right ? 1 : -1;
    const elbowX = startX + direction * ctx.width * 0.07;
    const elbowY = startY - ctx.height * 0.12;
    const rawEndX = startX + direction * ctx.width * reach;
    const endX = right ? Math.min(ctx.width * 0.7, rawEndX) : Math.max(ctx.width * 0.3, rawEndX);
    const labelWidth = ctx.width * 0.26;
    const labelLeft = right ? endX : endX - labelWidth;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.13 }}>{ctx.subjectNode}</div>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', opacity: outro }} viewBox={\`0 0 \${ctx.width} \${ctx.height}\`}>
          <circle cx={startX} cy={startY} r={Math.max(4, ctx.width * 0.006)} fill="#0D0E10" stroke={signal} strokeWidth={Math.max(2, ctx.width * 0.002)} opacity={dotIn} />
          <circle cx={startX} cy={startY} r={Math.max(10, ctx.width * 0.014) * dotIn} fill="none" stroke={signal} strokeWidth={1} opacity={0.42 * (1 - dotIn * 0.35)} />
          <line x1={startX} y1={startY} x2={elbowX} y2={elbowY} stroke={signal} strokeWidth={Math.max(1.5, ctx.width * 0.0015)} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - firstLine} />
          <line x1={elbowX} y1={elbowY} x2={endX} y2={elbowY} stroke={signal} strokeWidth={Math.max(1.5, ctx.width * 0.0015)} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - secondLine} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: labelLeft,
            top: elbowY - ctx.height * 0.002,
            width: labelWidth,
            padding: '1.4% 1.8%',
            boxSizing: 'border-box',
            background: '#151A1EEB',
            borderTop: \`2px solid \${signal}\`,
            color: '#F5F8F9',
            opacity: labelIn * outro,
            transform: \`translate3d(\${direction * (1 - labelIn) * 28}px, 0, 0)\`,
          }}
        >
          <div style={{ fontSize: Math.max(8, ctx.width * 0.012), fontWeight: 900, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</div>
          <div style={{ marginTop: '0.65em', color: '#BFC9CE', fontSize: Math.max(7, ctx.width * 0.008), fontWeight: 700, letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>TRACKED / FRAME {String(ctx.frame).padStart(3, '0')}</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
