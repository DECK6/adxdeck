const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const speed = Number(ctx.params.speed ?? 1);
    const density = Math.round(Number(ctx.params.density ?? 4));
    const edition = String(ctx.params.edition ?? 'NEWS');
    const breaking = Boolean(ctx.params.breaking ?? true);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const stories = [
      'DEXA VFX SIGNAL DESK IS NOW ONLINE',
      'REAL-TIME MOTION SYSTEMS REPORT NOMINAL',
      'NEW FRAMES ARRIVING FROM THE DEXA LAB',
      'CREATIVE NETWORK EXPANDS ACROSS THE GRID',
      'BROADCAST PACKAGE LOCKED TO MASTER CLOCK',
    ].slice(0, density);
    const intro = clamp01(ctx.t / 0.1);
    const outro = clamp01((1 - ctx.t) / 0.08);
    const beltWidth = Math.max(1, ctx.width * Math.max(1.8, stories.length * 0.7));
    const travel = (ctx.t * speed * beltWidth * 1.6) % beltWidth;
    const flash = breaking ? 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 12)) : 1;
    const fontSize = Math.max(9, ctx.height * 0.044);
    const beltTop = ctx.height * 0.76;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace" }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 * outro }}>{ctx.subjectNode}</div>
        <div
          data-layout-allow-overlap
          data-layout-allow-occlusion
          style={{
            position: 'absolute',
            left: '5%',
            top: '9%',
            color: '#F4F7F8',
            fontSize: Math.max(8, ctx.height * 0.027),
            letterSpacing: '0.22em',
            opacity: intro * outro * 0.72,
          }}
        >
          DEXA // {edition} NETWORK
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: beltTop - 2,
            height: 2,
            background: signal,
            transform: \`scaleX(\${intro})\`,
            transformOrigin: 'left',
            boxShadow: \`0 0 16px \${signal}\`,
            opacity: outro,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: beltTop,
            height: ctx.height * 0.14,
            background: '#15181CFA',
            color: '#F4F7F8',
            transform: \`translateY(\${(1 - intro) * ctx.height * 0.16}px)\`,
            opacity: outro,
            overflow: 'hidden',
          }}
        >
          <div
            data-layout-allow-overlap
            data-layout-allow-overflow
            data-layout-allow-occlusion
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: ctx.width * 0.205,
              display: 'grid',
              placeItems: 'center',
              background: signal,
              color: '#071012',
              fontSize,
              fontWeight: 900,
              letterSpacing: '0.08em',
              opacity: flash,
              zIndex: 2,
            }}
          >
            {breaking ? 'BREAKING' : edition}
          </div>
          <div
            style={{
              position: 'absolute',
              left: ctx.width * 0.205,
              right: 0,
              top: 0,
              bottom: 0,
              overflow: 'hidden',
            }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                data-layout-allow-overflow
                data-layout-allow-occlusion
                style={{
                  position: 'absolute',
                  left: copy * beltWidth - travel,
                  top: 0,
                  height: '100%',
                  width: beltWidth,
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  fontSize,
                  fontWeight: 650,
                }}
              >
                {stories.map((story, index) => (
                  <div key={story} style={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', background: '#15181C' }}>
                    <span style={{ width: 7, height: 7, margin: '0 1.4em', background: signal, transform: 'rotate(45deg)', flex: '0 0 auto' }} />
                    <span>{String(index + 1).padStart(2, '0')} / {story}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
