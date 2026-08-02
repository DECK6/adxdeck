const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const seconds = Math.round(Number(ctx.params.seconds ?? 30));
    const ring = Number(ctx.params.ring ?? 0.82);
    const label = String(ctx.params.label ?? 'ON AIR IN');
    const urgent = Boolean(ctx.params.urgent ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const remaining = Math.max(0, Math.ceil(seconds * (1 - ctx.t)));
    const digits = String(remaining).padStart(2, '0').slice(-2).split('');
    const tickPhase = (ctx.t * seconds) % 1;
    const flipAngle = tickPhase < 0.24 ? -90 * (tickPhase / 0.24) : 0;
    const circumference = Math.PI * 2 * 185;
    const progress = 1 - ctx.t;
    const intro = clamp01(ctx.t / 0.1);
    const outro = clamp01((1 - ctx.t) / 0.06);
    const urgentPulse = urgent && remaining <= Math.min(10, Math.ceil(seconds * 0.25))
      ? 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 18))
      : 1;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 * outro }}>{ctx.subjectNode}</div>
        <svg viewBox="0 0 1000 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: intro * outro }}>
          <circle cx="500" cy="300" r="220" fill="#0D0E10" fillOpacity="0.82" stroke={signal} strokeOpacity="0.12" strokeWidth="2" />
          <circle cx="500" cy="300" r="185" fill="none" stroke={signal} strokeOpacity="0.16" strokeWidth={18 * ring} />
          <circle
            cx="500"
            cy="300"
            r="185"
            fill="none"
            stroke={signal}
            strokeWidth={18 * ring}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 500 300)"
            style={{ filter: \`drop-shadow(0 0 11px \${signal})\`, opacity: urgentPulse }}
          />
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
            return <line key={index} x1={500 + Math.cos(angle) * 208} y1={300 + Math.sin(angle) * 208} x2={500 + Math.cos(angle) * 218} y2={300 + Math.sin(angle) * 218} stroke={signal} strokeWidth="3" opacity="0.52" />;
          })}
        </svg>
        <div style={{ position: 'absolute', left: '50%', top: '45%', transform: \`translate(-50%, -50%) scale(\${0.92 + intro * 0.08})\`, display: 'flex', gap: Math.max(5, ctx.width * 0.012), opacity: outro * urgentPulse, perspective: 700 }}>
          {digits.map((digit, index) => (
            <div key={index} data-layout-allow-occlusion style={{ position: 'relative', width: ctx.width * 0.105, height: ctx.height * 0.205, display: 'grid', placeItems: 'center', overflow: 'hidden', border: \`1px solid \${signal}55\`, borderRadius: 4, background: '#15181CF2', color: '#F4F7F8', fontSize: ctx.height * 0.16, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', boxShadow: \`inset 0 0 22px \${signal}12\` }}>
              <span style={{ transform: \`rotateX(\${index === 1 ? flipAngle : 0}deg)\`, transformOrigin: 'center bottom' }}>{digit}</span>
              <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: '#0D0E10', boxShadow: '0 1px 0 #FFFFFF18' }} />
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '64%', transform: 'translateX(-50%)', color: signal, fontSize: Math.max(9, ctx.height * 0.031), fontWeight: 700, letterSpacing: '0.22em', opacity: intro * outro }}>{label}</div>
        <div style={{ position: 'absolute', left: '50%', top: '71%', transform: 'translateX(-50%)', color: '#AEB6BA', fontSize: Math.max(7, ctx.height * 0.019), letterSpacing: '0.16em', opacity: intro * outro * 0.76 }}>DEXA MASTER CLOCK // {ctx.fps} FPS</div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
