const n=`import type { FxKernel } from '../../src/fx/types';

const smooth = (value: number) => {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
};

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const label = String(ctx.params.label ?? 'DEXA VFX');
    const take = Math.min(12, Math.max(1, Math.round(Number(ctx.params.take ?? 7))));
    const snap = Math.min(2, Math.max(0.5, Number(ctx.params.snap ?? 1.2)));
    const scale = Math.min(1.15, Math.max(0.7, Number(ctx.params.scale ?? 0.92)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const closeEnd = 0.16 + 0.11 / snap;
    const reopenStart = 0.7;
    const closed = ctx.t < closeEnd
      ? smooth((ctx.t - 0.1) / Math.max(0.02, closeEnd - 0.1))
      : ctx.t < reopenStart
        ? 1
        : 1 - smooth((ctx.t - reopenStart) / (1 - reopenStart));
    const clapAngle = -34 * (1 - closed);
    const impact = Math.exp(-Math.abs(ctx.t - closeEnd) * 95);
    const boardWidth = Math.min(ctx.width * 0.72, 560) * scale;
    const boardHeight = boardWidth * 0.55;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#0D0E10',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            opacity: 0.46,
            transform: \`scale(\${1.03 + impact * 0.012})\`,
            filter: \`contrast(1.1) brightness(\${0.72 + impact * 0.16})\`,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: boardWidth,
            height: boardHeight,
            transform: \`translate(-50%, -50%) translateY(\${impact * 3}px)\`,
            filter: 'drop-shadow(0 18px 28px #000000AA)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '16% 0 0',
              border: \`2px solid \${signal}88\`,
              background: '#11171BEE',
              color: '#F2F6F7',
              boxShadow: \`inset 0 0 30px \${signal}0F\`,
            }}
          >
            <div style={{ padding: '7% 8% 4%', fontSize: boardWidth * 0.065, fontWeight: 800, letterSpacing: '0.13em' }}>
              {label}
            </div>
            <div style={{ height: 1, margin: '0 8%', background: \`\${signal}88\` }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', margin: '5% 8% 0', color: '#D5DFE2', fontSize: boardWidth * 0.029 }}>
              <div>SCENE<br /><span style={{ color: signal, fontSize: '1.55em' }}>W7</span></div>
              <div>TAKE<br /><span style={{ color: signal, fontSize: '1.55em' }}>{String(take).padStart(2, '0')}</span></div>
              <div>ROLL<br /><span style={{ color: signal, fontSize: '1.55em' }}>F11</span></div>
            </div>
            <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '8%', color: '#AEBCC0', fontSize: boardWidth * 0.022, letterSpacing: '0.12em' }}>
              DIR. DEXA · CAM. VFX · 30 FPS
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '7%',
              width: '100%',
              height: '15%',
              transformOrigin: '3% 100%',
              transform: \`rotate(\${clapAngle}deg)\`,
              border: \`2px solid \${signal}99\`,
              background: \`repeating-linear-gradient(135deg, #EDF4F5 0 9%, #151A1D 9% 18%)\`,
              boxShadow: impact > 0.08 ? \`0 0 \${12 + impact * 24}px \${signal}\` : '0 8px 14px #00000099',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: \`\${signal}22\`, mixBlendMode: 'multiply' }} />
          </div>
          <div style={{ position: 'absolute', left: '-1.5%', top: '17%', width: 12, height: 12, borderRadius: '50%', background: signal, boxShadow: \`0 0 10px \${signal}\` }} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: \`\${2 + impact * 5}px solid \${signal}\`,
            opacity: impact * 0.5,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
