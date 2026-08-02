const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const title = String(ctx.params.title ?? 'DEXA VFX');
    const layout = String(ctx.params.layout ?? 'screening');
    const reveal = Math.max(0.4, Math.min(1.4, Number(ctx.params.reveal ?? 0.8)));
    const accent = Math.max(1, Math.min(8, Number(ctx.params.accent ?? 3)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const intro = clamp01(ctx.t / (0.18 * reveal));
    const hold = clamp01((1 - ctx.t) / 0.1);
    const subjectProgress = intro * intro * (3 - 2 * intro);
    const detailProgress = clamp01((ctx.t - 0.16 * reveal) / (0.18 * reveal));
    const schedule = layout === 'festival'
      ? ['OFFICIAL SELECTION', 'DEXA MOTION FESTIVAL', 'SCREEN 07 / 20:30']
      : layout === 'premiere'
        ? ['WORLD PREMIERE', '06 SEPTEMBER / 20:30', 'DEXA CINEMA 01']
        : ['SPECIAL SCREENING', '06 SEPTEMBER / 20:30', 'DEXA CINEMA 01'];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', color: '#F7FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: hold }}>
        <div
          style={{
            position: 'absolute',
            left: '35%',
            top: '15%',
            width: '30%',
            height: '34%',
            opacity: 0.86 * subjectProgress,
            transform: \`translateY(\${(1 - subjectProgress) * 7}%) scale(\${0.86 + subjectProgress * 0.14})\`,
            filter: \`drop-shadow(0 0 \${12 + subjectProgress * 22}px \${signal}32)\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '10%', height: accent, background: signal, transform: \`scaleX(\${subjectProgress})\`, transformOrigin: 'left', boxShadow: \`0 0 14px \${signal}\` }} />
        <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '10%', height: 1, background: '#F7FAFC', opacity: 0.3 * detailProgress, transform: \`scaleX(\${detailProgress})\`, transformOrigin: 'right' }} />
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '53%', textAlign: 'center', transform: \`translateY(\${(1 - detailProgress) * 28}px)\`, opacity: detailProgress }}>
          <div style={{ color: signal, fontSize: Math.max(9, ctx.width * 0.012), fontWeight: 700, letterSpacing: '0.38em', marginBottom: ctx.height * 0.024 }}>{schedule[0]}</div>
          <div style={{ fontSize: Math.max(30, Math.min(ctx.width * 0.083, ctx.height * 0.14)), lineHeight: 0.96, fontWeight: 900, letterSpacing: '-0.055em' }}>{title}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6%', marginTop: ctx.height * 0.05, color: '#D7DDE1', fontSize: Math.max(9, ctx.width * 0.013), fontWeight: 600, letterSpacing: '0.08em' }}>
            <span>{schedule[1]}</span>
            <span style={{ color: signal }}>/</span>
            <span>{schedule[2]}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', left: '8%', bottom: '5.6%', color: '#B8C0C5', fontSize: Math.max(8, ctx.width * 0.009), letterSpacing: '0.16em', opacity: detailProgress }}>DEXA.ART/VFX</div>
          <div style={{ position: 'absolute', right: '8%', bottom: '5.6%', color: '#B8C0C5', fontSize: Math.max(8, ctx.width * 0.009), letterSpacing: '0.16em', opacity: detailProgress }}>ADMIT / 001</div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
