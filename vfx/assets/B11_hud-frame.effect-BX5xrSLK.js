const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const density = Math.round(Number(ctx.params.density ?? 2));
    const scanSpeed = Number(ctx.params.scanSpeed ?? 1);
    const mode = String(ctx.params.mode ?? 'TRACK');
    const telemetry = Boolean(ctx.params.telemetry ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const intro = clamp01(ctx.t / 0.13);
    const outro = clamp01((1 - ctx.t) / 0.08);
    const scanY = ((ctx.t * scanSpeed) % 1) * 72 + 14;
    const lock = 0.72 + 0.28 * Math.sin(ctx.t * Math.PI * 4);
    const bracket = Math.min(ctx.width, ctx.height) * 0.085;
    const cornerStyle = (x: string, y: string, rotate: number) => ({
      position: 'absolute' as const,
      left: x,
      top: y,
      width: bracket,
      height: bracket,
      borderTop: \`3px solid \${signal}\`,
      borderLeft: \`3px solid \${signal}\`,
      transform: \`rotate(\${rotate}deg) scale(\${intro})\`,
      opacity: outro,
      boxShadow: \`-3px -3px 14px \${signal}22\`,
    });

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace", color: '#DCE3E6' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 * outro }}>{ctx.subjectNode}</div>
        <div style={{ ...cornerStyle('6%', '8%', 0), transformOrigin: 'top left' }} />
        <div style={{ ...cornerStyle('94%', '8%', 90), transformOrigin: 'top left' }} />
        <div style={{ ...cornerStyle('94%', '92%', 180), transformOrigin: 'top left' }} />
        <div style={{ ...cornerStyle('6%', '92%', 270), transformOrigin: 'top left' }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: ctx.height * 0.31, height: ctx.height * 0.31, transform: \`translate(-50%, -50%) scale(\${0.86 + intro * 0.14})\`, border: \`1px solid \${signal}66\`, borderRadius: '50%', opacity: outro * lock }}>
          <div style={{ position: 'absolute', left: '50%', top: '-18%', bottom: '-18%', width: 1, background: signal, opacity: 0.48 }} />
          <div style={{ position: 'absolute', top: '50%', left: '-18%', right: '-18%', height: 1, background: signal, opacity: 0.48 }} />
          <div style={{ position: 'absolute', inset: '28%', border: \`1px dashed \${signal}\`, borderRadius: '50%', transform: \`rotate(\${ctx.t * 180 * scanSpeed}deg)\`, opacity: 0.65 }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 7, height: 7, border: \`2px solid \${signal}\`, transform: 'translate(-50%, -50%) rotate(45deg)', boxShadow: \`0 0 12px \${signal}\` }} />
        </div>
        <div style={{ position: 'absolute', left: '7%', right: '7%', top: \`\${scanY}%\`, height: 1, background: \`linear-gradient(90deg, transparent, \${signal}, transparent)\`, boxShadow: \`0 0 12px \${signal}\`, opacity: intro * outro * 0.62 }} />
        {Array.from({ length: density * 4 }, (_, index) => (
          <div key={index} style={{ position: 'absolute', left: \`\${9 + (index % 4) * 27.3}%\`, top: index % 2 === 0 ? '8%' : '90%', width: 1, height: index % 3 === 0 ? 16 : 8, background: signal, opacity: intro * outro * 0.42 }} />
        ))}
        {telemetry ? (
          <>
            <div style={{ position: 'absolute', left: '7%', top: '13%', fontSize: Math.max(7, ctx.height * 0.019), lineHeight: 1.7, letterSpacing: '0.12em', opacity: intro * outro }}><span style={{ color: signal }}>{mode} // ACTIVE</span><br />SUBJECT 01<br />CONF {Math.round(lock * 99)}%</div>
            <div style={{ position: 'absolute', right: '7%', bottom: '13%', textAlign: 'right', fontSize: Math.max(7, ctx.height * 0.019), lineHeight: 1.7, letterSpacing: '0.12em', opacity: intro * outro }}>DEXA TELEMETRY<br />X {String(Math.round(ctx.width * 0.5)).padStart(4, '0')} / Y {String(Math.round(ctx.height * 0.5)).padStart(4, '0')}<br /><span style={{ color: signal }}>LOCKED</span></div>
          </>
        ) : null}
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
