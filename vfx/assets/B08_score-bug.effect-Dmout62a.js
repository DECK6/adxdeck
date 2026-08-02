const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const matchup = String(ctx.params.matchup ?? 'DEXA / VFX').split('/').map((part) => part.trim());
    const homeScore = Math.round(Number(ctx.params.score ?? 3));
    const awayScore = Math.max(0, homeScore - 1);
    const period = Math.round(Number(ctx.params.period ?? 2));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const enter = smooth((ctx.t - 0.04) / 0.2);
    const flip = smooth((ctx.t - 0.28) / 0.18);
    const metaIn = smooth((ctx.t - 0.4) / 0.14);
    const outro = smooth((1 - ctx.t) / 0.1);
    const previousHome = Math.max(0, homeScore - 1);
    const previousAway = awayScore;
    const teamA = matchup[0] || 'DEXA';
    const teamB = matchup[1] || 'VFX';

    const scoreCard = (previous: number, current: number, active: boolean) => (
      <div
        data-layout-allow-overlap
        data-layout-allow-occlusion
        style={{ position: 'relative', width: '26%', height: '100%', perspective: 600, background: '#0A0C0E', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F6F9FA', fontSize: Math.max(18, Math.min(ctx.width * 0.028, ctx.height * 0.08)), fontWeight: 900 }}>{current}</div>
        {active ? (
          <div
            data-layout-allow-overflow
            data-layout-allow-overlap
            data-layout-allow-occlusion
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F6F9FA',
              background: '#15191C',
              fontSize: Math.max(18, Math.min(ctx.width * 0.028, ctx.height * 0.08)),
              fontWeight: 900,
              lineHeight: 1,
              transform: \`rotateX(\${-flip * 90}deg)\`,
              transformOrigin: 'bottom',
              backfaceVisibility: 'hidden',
              borderBottom: '1px solid #000',
            }}
          >
            {previous}
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: '#000', opacity: 0.7 }} />
      </div>
    );

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.09 }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            right: '4%',
            top: '5%',
            width: '43%',
            height: '13%',
            display: 'flex',
            background: '#15191DEE',
            borderBottom: \`3px solid \${signal}\`,
            boxShadow: '0 16px 38px rgba(0,0,0,0.42)',
            opacity: enter * outro,
            transform: \`translate3d(0, \${(1 - enter) * -ctx.height * 0.18}px, 0)\`,
          }}
        >
          <div style={{ width: '37%', padding: '4% 5%', boxSizing: 'border-box', color: '#F5F8FA', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: Math.max(8, ctx.width * 0.011), fontWeight: 900, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{teamA}</div>
            <div style={{ marginTop: '0.55em', color: '#CBD3D7', fontSize: Math.max(7, ctx.width * 0.008), fontWeight: 800, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{teamB}</div>
          </div>
          <div style={{ display: 'flex', width: '39%', height: '100%', gap: 2 }}>
            {scoreCard(previousHome, homeScore, true)}
            <div style={{ width: '22%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: signal, fontSize: Math.max(9, ctx.width * 0.015), fontWeight: 900 }}>—</div>
            {scoreCard(previousAway, awayScore, false)}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F6F9FA', background: signal, opacity: metaIn }}>
            <div style={{ color: '#071013', fontSize: Math.max(7, ctx.width * 0.008), fontWeight: 900, letterSpacing: '0.08em' }}>P{period}</div>
            <div style={{ marginTop: '0.45em', color: '#071013', fontSize: Math.max(7, ctx.width * 0.008), fontWeight: 900 }}>04:26</div>
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
